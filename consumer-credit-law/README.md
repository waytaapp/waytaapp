# Consumer Credit Law — compliant outreach

Work product for the sale-in-execution outreach programme. **Unrelated to the
Wayta application** in `stitch_wayta_nightlife_order_pay/` — it lives in this
repository only because this working branch does. Move it to its own repository
before anyone else touches it.

---

## Why this exists

A WhatsApp campaign was prepared for 2026-08-01: 50 numbers compiled from
sale-in-execution sources, to be sent via Blueticks with a 30-second interval.
It was not sent, and it should not be. Sending it would be direct marketing by
electronic communication to people who never consented — prohibited by section
69(1) of POPIA.

These four workstreams are the replacement.

---

## Contents

```
inbound/           Consent-capturing enquiry funnel for creditlaws.co.za
  index.html         Landing page + form. Unbundled consent, s18 notice.
  consent-handler.js POST /api/enquiry — writes the consent evidence.
  schema.sql         Append-only consent ledger, suppression list, message log.

whatsapp/          Migration off Blueticks onto the Meta Cloud API
  RUNBOOK.md         Setup, categories, template rules, order of work.
  templates/         Two submission-ready templates (marketing + utility).
  webhook-optout.js  Signature verification, STOP handling, delivery status.

compliance/        Review of the campaign copy and the alternative channel
  copy-review.md     18 findings across POPIA, LPA, CPA and NCA.
  revised-copy.md    Four rewritten versions, one per lawful moment.
  postal-outreach.md Why post is available when WhatsApp is not, plus a letter.
```

---

## Read in this order

1. **`compliance/copy-review.md`** — start here. Findings **L-1, L-2 and C-2**
   are about the structure of the business, not the campaign, and they gate
   everything else. No copy in this repository can be finalised until they are
   resolved, because every version describes the fee and the attorney
   relationship.
2. **`compliance/postal-outreach.md`** — how to reach the existing 50 lawfully.
3. **`inbound/`** — the asset that compounds. Everything else is one-shot.
4. **`whatsapp/RUNBOOK.md`** — infrastructure, once there is a consented list to
   send to.

---

## The one rule the code enforces

Nothing sends unless a row exists in the `marketable_contacts` view: a contact
joined to a live, un-withdrawn `direct_marketing` consent event, minus the
suppression list. The `marketing_requires_consent` constraint on `message_log`
enforces the same thing a layer down — a marketing send that cannot cite the
consent authorising it will not insert.

On day one that view returns nothing. That is correct, and it is the honest
starting position.

---

## Placeholders to fill before anything ships

Every file uses `[SQUARE BRACKETS]` for details only you hold:

- `[REGISTERED ENTITY NAME]`, `[CIPC REG NO]`, `[FULL STREET ADDRESS]` — POPIA
  s69(4) requires the real identity and a real address in every marketing
  message. A trading name is not enough.
- `[FEE SCOPE]` — **finding C-2.** Does the quoted band include the attorney's
  fees, sheriff's fees and court disbursements, or not? I did not guess. A wrong
  answer here beside the words "NO HIDDEN EXTRAS" is the finding.
- `[RETENTION PERIOD]` — how long enquiry data and matter files are kept.
- The "homes saved" figure — reinstate once the definition is settled and the
  file that produces it is held.

---

## Status

Nothing here has been deployed, submitted or sent. No message has gone to any of
the 50 numbers, and the contact list is deliberately **not** committed to this
repository — 50 people's personal information does not belong in git history.

Prepared with AI assistance. The legal analysis is a non-lawyer's working
review, offered so that you can brief an attorney efficiently — not so that you
can skip one. Findings L-1, L-2, C-1 and C-2 need an independent attorney, and
independent matters here: L-2 concerns the affiliate-attorney fee relationship
itself.
