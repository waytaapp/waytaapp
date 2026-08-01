# Moving to the WhatsApp Business Platform (Meta Cloud API)

**Status:** not started. This is the migration plan, not a record of work done.

---

## 1. Why move off the current setup

Blueticks and tools like it drive a WhatsApp account that is linked to a phone —
technically, they automate the same session WhatsApp Web uses. Three consequences
follow, and only the first is usually noticed:

1. **It breaches the WhatsApp Terms of Service.** Automated or bulk sending
   through a non-API client is expressly prohibited. Enforcement is by ban, and
   bans usually hit the number rather than the tool. `063 651 0302` appears on
   your letterhead, your site footer, and every message you have already sent —
   losing it is not a small operational inconvenience.
2. **It produces no defensible record.** There is no per-message log tied to a
   consent record. If the Information Regulator asks you to substantiate a
   send, an export of a chat list will not do it.
3. **Pacing does not protect you.** The 30-second interval in the campaign
   payload manages the *ban* risk. It has no bearing on the POPIA s69 question,
   which is about consent, not cadence. A slow unlawful send is still unlawful.

The Cloud API fixes 1 and 2. Section 3 of this runbook is what fixes the third.

---

## 2. Prerequisites

| Item | Notes |
|---|---|
| Meta Business Account | business.facebook.com |
| Business Verification | Requires CIPC registration documents and proof of address. Budget 3–10 business days. |
| WhatsApp Business Account (WABA) | Created inside the Business Account |
| A phone number | **See the warning below** |
| Display name | Must reflect the registered/trading name. "Consumer Credit Law" should pass; invented names get rejected. |
| Payment method | Meta bills per message. Confirm current ZA rates at time of setup — Meta moved to per-message pricing in 2025 and the rate card changes. |

> **Warning about the number.** A number already registered on the WhatsApp
> Business *app* cannot simultaneously run on the Cloud API. You either migrate
> `063 651 0302` (deleting it from the app, losing the app inbox and its history)
> or register a new number for outbound and keep the current one for walk-in
> conversations. Decide this before you start — migrating mid-campaign strands
> in-flight conversations.

---

## 3. The rule that makes the rest work

**Nothing sends unless a row exists in `marketable_contacts`.**

That view (see `../inbound/schema.sql`) joins a contact to a live, un-withdrawn
`direct_marketing` consent event and excludes anyone on the suppression list.
The send job's contact query has no other legal form. Not a filtered CSV, not a
list pasted into an admin screen, not "the ones who replied last time".

The `marketing_requires_consent` CHECK constraint on `message_log` enforces the
same thing one layer down: a marketing row that cannot cite the `consent_event_id`
authorising it will not insert, so it cannot be sent.

Build the send path so that bypassing this requires editing the schema. That is
the point — it should be easier to do it correctly than to work around it.

---

## 4. Message categories, and which one you actually need

| Category | When it applies | Opt-in needed |
|---|---|---|
| **Service** (free-form) | Within 24h of the user messaging you | No |
| **Utility** | Transactional follow-up on an existing matter — "we received your papers" | Yes, but a service relationship suffices |
| **Marketing** | Anything promotional, including the fee list | **Yes — explicit, and you must be able to produce it** |
| **Authentication** | OTPs. Not relevant here. |

The single most useful thing about this model for your business: **once a person
messages you first, you have a 24-hour window in which you can reply freely,
with no template and no approval.** An inbound-led funnel therefore costs less
and moves faster than an outbound one, quite apart from being lawful. That is
the commercial argument for the landing page, not just the compliance one.

The original campaign body is a marketing message — it leads with a hook and
carries a price list. It cannot be sent as Utility, and relabelling it as such
to avoid the opt-in requirement is exactly what template review is looking for.

---

## 5. Templates

Submit via `POST /v21.0/{WABA_ID}/message_templates`. Payloads are in
`templates/`. Notes that will save you a rejection cycle:

- **Body limit is 1,024 characters.** Your current body is **1,017**. It fits —
  but the personalised opening in the payload (`Hi {{1}}, ` + two newlines, 12
  characters) takes it to **1,029** and Meta will reject it. Personalisation
  requires trimming the body first; `templates/` does this.
- Variables must be sequential from `{{1}}` and cannot sit at the very start or
  end of the body without surrounding text.
- Every variable needs an `example` value or the submission is rejected.
- Marketing templates are quality-rated after they start sending. Templates that
  attract blocks get paused automatically, and a pattern of it drags down the
  whole number's quality rating.
- Approval is usually minutes to 24 hours. Do not schedule anything against an
  unapproved template.

---

## 6. Opt-out handling

`webhook-optout.js` processes inbound messages and writes withdrawals to the
ledger. Wire it to the `messages` webhook field.

The current campaign says "Reply STOP to opt out". **If nothing is listening for
STOP, that sentence is itself a misrepresentation** — you are telling people a
mechanism exists that does not. Stand this up before the first send, not after.

Note it recognises more than the word STOP. People in distress reply
"please stop", "who are you", "wrong number", "remove me" — and a matcher that
only catches a bare `STOP` will keep messaging all of them.

---

## 7. Order of work

1. Business verification (start now — it is the long pole).
2. Stand up `schema.sql` and the inbound form. Begin collecting consent.
3. Register the number, get the display name approved.
4. Deploy `webhook-optout.js`. Verify a STOP round-trips to `suppression_list`.
5. Submit templates. Wait for approval.
6. Send to `marketable_contacts` only. At first, that view is empty — that is
   correct, and it is the honest starting position.
7. Postal outreach (see `../compliance/postal-outreach.md`) runs in parallel and
   is what reaches the existing 50 while the consented list builds.
