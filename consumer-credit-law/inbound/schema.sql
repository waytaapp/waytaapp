-- Consumer Credit Law — consent & contact ledger
-- PostgreSQL 13+
--
-- Design principle: consent is stored as an APPEND-ONLY EVENT LOG, never as a
-- mutable boolean on a contact row. If you are ever asked to prove that a given
-- number consented before you messaged it, you must be able to produce the
-- moment of consent, the exact wording shown, and the moment of any withdrawal.
-- A `marketing_ok = true` column cannot do that; it only tells you the present.
--
-- POPIA s69(1)(a) is the provision this schema exists to satisfy.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Contacts
-- ---------------------------------------------------------------------------
CREATE TABLE contacts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164      text NOT NULL UNIQUE,      -- normalise to +27XXXXXXXXX on write
  full_name       text,
  email           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  -- How this contact entered the database. Only 'inbound_form' and
  -- 'inbound_whatsapp' can ever support a s69(1)(a) consent claim.
  acquisition     text NOT NULL
                  CHECK (acquisition IN ('inbound_form','inbound_whatsapp',
                                         'inbound_phone','referral','existing_client')),
  CONSTRAINT phone_is_e164 CHECK (phone_e164 ~ '^\+[1-9][0-9]{7,14}$')
);

CREATE INDEX contacts_email_idx ON contacts (lower(email));

-- ---------------------------------------------------------------------------
-- Consent events  (append-only — no UPDATE, no DELETE)
-- ---------------------------------------------------------------------------
CREATE TABLE consent_events (
  id                   bigserial PRIMARY KEY,
  contact_id           uuid NOT NULL REFERENCES contacts(id),

  purpose              text NOT NULL
                       CHECK (purpose IN ('contact_about_enquiry','whatsapp_channel','direct_marketing')),
  action               text NOT NULL CHECK (action IN ('granted','withdrawn')),

  occurred_at          timestamptz NOT NULL DEFAULT now(),

  -- Evidence of what the person was actually shown when they agreed.
  consent_text_version text NOT NULL,        -- e.g. 'ccl-consent-v1'
  consent_text         text NOT NULL,        -- verbatim copy of the wording rendered
  form_version         text,
  page_url             text,

  -- Evidence of circumstance.
  source_ip            inet,
  user_agent           text,
  -- How the withdrawal/grant reached us: 'web_form','whatsapp_stop','email','phone','opt_out_page'
  channel              text NOT NULL,

  notes                text
);

CREATE INDEX consent_events_lookup_idx
  ON consent_events (contact_id, purpose, occurred_at DESC);

-- Enforce append-only at the database, not just in application code.
CREATE OR REPLACE FUNCTION consent_events_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'consent_events is append-only (attempted %)', TG_OP;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER consent_events_no_update BEFORE UPDATE OR DELETE ON consent_events
  FOR EACH ROW EXECUTE FUNCTION consent_events_immutable();

-- ---------------------------------------------------------------------------
-- Current consent state, derived. Never write to this — read it.
-- ---------------------------------------------------------------------------
CREATE VIEW consent_state AS
SELECT DISTINCT ON (contact_id, purpose)
       contact_id,
       purpose,
       action = 'granted' AS is_active,
       occurred_at        AS as_at,
       consent_text_version
FROM   consent_events
ORDER  BY contact_id, purpose, occurred_at DESC, id DESC;

-- The only view a send job may read from. If a number is not in here, it does
-- not get a marketing message — there is no override and no "just this once".
CREATE VIEW marketable_contacts AS
SELECT c.id, c.phone_e164, c.full_name, c.email, s.as_at AS consented_at
FROM   contacts c
JOIN   consent_state s
       ON s.contact_id = c.id
      AND s.purpose    = 'direct_marketing'
      AND s.is_active
WHERE  NOT EXISTS (
         SELECT 1 FROM suppression_list sl WHERE sl.phone_e164 = c.phone_e164
       );

-- ---------------------------------------------------------------------------
-- Suppression list — survives contact deletion, and outranks any consent.
-- A number lands here on STOP, on an Information Regulator complaint, on a
-- bounce/ban signal, or on manual instruction. Nothing removes a row except a
-- fresh, documented opt-in recorded by hand.
-- ---------------------------------------------------------------------------
CREATE TABLE suppression_list (
  phone_e164   text PRIMARY KEY,
  reason       text NOT NULL
               CHECK (reason IN ('stop_keyword','manual','complaint','bounce',
                                 'wrong_number','regulator','deceased')),
  suppressed_at timestamptz NOT NULL DEFAULT now(),
  source       text,
  notes        text
);

-- ---------------------------------------------------------------------------
-- Enquiries from the inbound form
-- ---------------------------------------------------------------------------
CREATE TABLE enquiries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id    uuid NOT NULL REFERENCES contacts(id),
  received_at   timestamptz NOT NULL DEFAULT now(),
  stage         text,          -- s129 / summons / rule 46A / sale set / already sold / unsure
  value_band    text,
  notes         text,
  status        text NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','assessing','responded','engaged','declined','closed')),
  -- Sale dates drive urgency triage; nulls sort last.
  sale_date     date
);

CREATE INDEX enquiries_triage_idx ON enquiries (status, sale_date NULLS LAST, received_at);

-- ---------------------------------------------------------------------------
-- Outbound message log — one row per attempted send, written BEFORE the send.
-- consent_event_id is NOT NULL on marketing sends: a marketing message that
-- cannot name the consent that authorised it must not be sendable.
-- ---------------------------------------------------------------------------
CREATE TABLE message_log (
  id                bigserial PRIMARY KEY,
  contact_id        uuid NOT NULL REFERENCES contacts(id),
  direction         text NOT NULL CHECK (direction IN ('outbound','inbound')),
  channel           text NOT NULL CHECK (channel IN ('whatsapp','sms','email','post')),
  category          text NOT NULL CHECK (category IN ('marketing','utility','service','reply')),
  template_name     text,
  wa_message_id     text UNIQUE,
  body_snapshot     text,
  consent_event_id  bigint REFERENCES consent_events(id),
  sent_at           timestamptz NOT NULL DEFAULT now(),
  status            text NOT NULL DEFAULT 'queued'
                    CHECK (status IN ('queued','sent','delivered','read','failed','blocked')),
  failure_reason    text,
  CONSTRAINT marketing_requires_consent
    CHECK (category <> 'marketing' OR consent_event_id IS NOT NULL)
);

CREATE INDEX message_log_contact_idx ON message_log (contact_id, sent_at DESC);
