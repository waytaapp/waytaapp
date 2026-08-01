# Copy review — "Sale in execution / Rule 46A outreach"

Reviewed: the campaign body in the Blueticks payload dated 2026-08-01.

**This is a working review by a non-lawyer, not legal advice.** Several findings
below go to the structure of the business, not the wording, and those in
particular need your own attorney — ideally one who does not also receive
referral work from you, since findings L-1 and L-2 concern that relationship.

Priority order: **L-1, L-2, C-1 and C-2 are the ones that could cost you the
business.** The POPIA findings are the ones that stop the campaign from being
sendable at all. The rest are fixable wording.

---

## Findings

| # | Area | Severity | Finding |
|---|---|---|---|
| P-1 | POPIA s69(1) | **Critical** | No consent, no customer relationship — the send is prohibited |
| P-2 | POPIA s69(2) | High | A lawful one-time approach exists, but this message is not it |
| P-3 | POPIA s69(4)(a) | High | Sender identity insufficient — trading name only |
| P-4 | POPIA s69(4)(b) | High | No address for cessation requests |
| P-5 | POPIA s18 | High | No notification to people whose details were collected from a third source |
| P-6 | Operational | High | "Reply STOP" with nothing processing STOP |
| L-1 | Legal Practice Act s33 | **Critical** | Fee structure may amount to rendering legal services without admission |
| L-2 | LPC Code of Conduct | **Critical** | "Affiliate attorneys" paid out of your fee looks like fee-sharing |
| L-3 | LPA / touting | High | Cold outreach to identified litigants, generating attorney work |
| C-1 | CPA s16 | **Critical** | 5-business-day cooling-off applies to direct-marketed agreements |
| C-2 | CPA s41 | **Critical** | "NO HIDDEN EXTRAS" alongside separately-billed attorney work |
| C-3 | CPA s41 / ARB | High | "3,035 homes saved" etc. require substantiation on demand |
| C-4 | CPA s40 | Medium | Fee banded by property value, not by work done |
| N-1 | NCA s44 | High | Debt-counselling-adjacent activity without NCR registration |
| A-1 | Accuracy | Low | Rule 46A attributed to the National Credit Act |
| A-2 | Accuracy | Medium | "We act for you" is the language of legal representation |
| T-1 | WhatsApp | Medium | Personalised variant exceeds the 1,024-character template limit |
| T-2 | Data | Medium | "Send us your court papers" over WhatsApp, with no retention position |

---

## POPIA

### P-1 — s69(1): the send is prohibited as designed · **Critical**

Section 69(1) prohibits processing personal information for direct marketing by
electronic communication unless the data subject **has consented** or **is a
customer** of the responsible party. Neither applies to these 50 numbers. The
list description — "WhatsApp-verified leads, sale-in-execution outreach,
sourced 2026-08-01" — is a description of a compiled list, which is the fact
pattern the section exists to prohibit.

Two beliefs I would want to correct before anything else:

- **The opt-out line does not cure it.** POPIA is opt-in. "Reply STOP" is what
  you add once you already have consent. It has no curative effect on a send
  that was prohibited when it left.
- **Public source ≠ free to market to.** Sale-in-execution notices are public,
  and reading them is lawful. Section 69 does not turn on how you obtained the
  number; it turns on whether the person agreed to be marketed to. They did not.

Exposure is an enforcement notice from the Information Regulator and, on
non-compliance with one, an administrative fine of up to R10 million or
prosecution. Practically, the more likely first event is a complaint from one
recipient, which puts the whole list in scope.

### P-2 — s69(2): the one lawful cold approach, and why this isn't it · High

This is the part most often missed, and it is genuinely useful to you.

Section 69(2) permits you to approach a person **once** — and only once — to
*request* their consent, provided they have not previously withheld it. The
request must be made in the manner prescribed by Regulation 6, on **Form 4**.

So a lawful first contact does exist. But it is a consent request, not a pitch.
Form 4 asks for the data subject's details, identifies the responsible party,
states the categories of information and the purpose, and asks them to sign
consent. Your message is a full marketing communication with a hook, a value
proposition and a five-band price list. It cannot be recharacterised as a Form 4
request, and sending it burns the single approach you were entitled to make.

If you want to use this route for the existing 50, the message has to become a
short, plain consent request that sells nothing. My honest read is that a
WhatsApp-delivered Form 4 to a distressed homeowner converts poorly and reads as
strange; the postal route in `postal-outreach.md` is the better instrument for
this cohort. But the option is real and it is worth knowing you have it.

### P-3 / P-4 — s69(4): what every marketing message must carry · High

Section 69(4) requires *every* direct marketing communication to contain
(a) the identity of the sender, and (b) an address or other contact details to
which a request to cease may be sent.

Current message: "Consumer Credit Law" — a trading name — plus a WhatsApp
number and "Fourways, Johannesburg, by appointment".

- **(a) is not met.** Give the registered entity name, the "t/a Consumer Credit
  Law" trading style, and the CIPC registration number.
- **(b) is weak.** "By appointment" is not an address. Give the street address
  and a monitored email (`privacy@creditlaws.co.za`), in addition to STOP.

Note the platform constraint: WhatsApp template **footers are capped at 60
characters**, so the identity and address will not fit there. They must sit in
the body, inside the 1,024-character budget. The templates in `../whatsapp/templates/`
hardcode them rather than passing them as variables, so they cannot be sent empty.

### P-5 — s18: notification when details come from elsewhere · High

Where personal information is collected from a source other than the data
subject, s18 still requires you to take reasonably practicable steps to make
them aware of what you hold, where it came from, who you are, the purpose, the
recipients, their right of access, correction and objection, and their right to
complain to the Information Regulator.

None of that has happened for these 50 people. Whatever channel you eventually
use, first contact needs to carry it or link to a notice that does. The
"How we handle your information" block in `../inbound/index.html` is drafted to
this standard and can be lifted.

### P-6 — the opt-out that does not exist · High

The message promises "Reply STOP to opt out". Blueticks does not process STOP
into any suppression list you hold. So the sentence describes a mechanism that
does not exist — which is both a s69(4)(b) failure and, separately, a
misrepresentation under CPA s41.

`../whatsapp/webhook-optout.js` implements it. Stand it up before the first send.
Note that it deliberately matches far more than the literal word "STOP": on a
list built from auction notices, a meaningful share of replies will be
"wrong number" or "who are you", and every one of those is a person who must
never be contacted again.

---

## Legal Practice Act and LPC rules

**These are the findings I would put in front of an attorney first.** They are
not about the campaign. They are about whether the offer can lawfully be sold
in this shape at all, on any channel.

### L-1 — s33: rendering legal services for reward · **Critical**

Section 33 of the Legal Practice Act 28 of 2014 reserves the rendering of legal
services for fee or reward to practising legal practitioners. Contravention is
an offence.

The message positions Consumer Credit Law as taking R18,000–R44,000 from a
homeowner to obtain a litigation outcome, with the court work subcontracted to
"our independent affiliate attorneys". The consumer's contract, payment and
relationship all sit with a non-attorney; the attorney appears as your
supplier. That is the structure s33 is aimed at, whatever the internal papering
says.

The phrases doing the most damage are **"We act for you, NEVER the bank"** and
**"our independent affiliate attorneys"** — "act for" is the standard formula
for legal representation, and "our" makes the attorneys sound like your
department.

### L-2 — fee-sharing · **Critical**

The LPC Code of Conduct prohibits a legal practitioner from sharing professional
fees with a person who is not a legal practitioner. If the R18,000–R44,000 is
collected by you and the affiliate attorney is then paid out of it, that is very
likely the prohibited arrangement — and the exposure runs to the attorneys as
well as to you, which is why the reviewing attorney should be an independent one.

The alternative structure to put to counsel: the homeowner contracts and pays
the **attorney** directly for the legal work, and contracts and pays **you**
separately for a defined, genuinely non-legal consultancy service — document
assembly, affordability reconstruction, budget and payment-plan preparation,
liaison. Two engagement letters, two invoices, no flow of the attorney's fee
through your account. That also cleans up C-2 as a side effect.

### L-3 — touting · High

Approaching identified litigants, unsolicited, and channelling them to specific
attorneys engages the prohibition on touting. Inbound enquiries generated by
published guides do not have this problem, which is a further argument for the
funnel in `../inbound/`.

---

## Consumer Protection Act

### C-1 — s16: the cooling-off right you are creating · **Critical**

This one is easy to miss and expensive.

Under CPA s16, a consumer who concludes a transaction or agreement **as a result
of direct marketing** may rescind it, without reason or penalty, within **five
business days** of concluding it. Any consideration paid must be refunded within
15 business days.

So the campaign as designed manufactures a rescission right over every resulting
engagement, on fees of R18,000–R44,000 taken upfront. If work starts immediately
— which is the whole premise, given the sale dates — you can be five days into a
matter, having briefed an attorney, when a valid rescission lands.

You must also **inform the consumer of this right**. Not doing so is an
independent contravention.

This is the strongest commercial argument in this document for an inbound model:
a consumer who found you through a published guide and enquired has not
concluded an agreement "as a result of direct marketing", and s16 does not
attach in the same way.

### C-2 — s41: "NO HIDDEN EXTRAS" · **Critical**

Section 41 prohibits false, misleading or deceptive representations. The message
carries, in bold caps, **"NO HIDDEN EXTRAS"**, immediately followed by
"Court work by our independent affiliate attorneys."

If the attorney's professional fees, counsel's fees, sheriff's fees or court
disbursements are billed separately from the quoted band, then "NO HIDDEN
EXTRAS" is a misrepresentation on its face — and a bold, capitalised one, which
is how a regulator will read it. This is compounded by C-1: a consumer who
discovers the extras within five business days has both a s41 complaint and a
live rescission right.

Resolve it factually, in the copy:
- **If the fee is genuinely all-in**, say so: "This fee includes the attorney's
  professional fees and all court disbursements."
- **If it is not**, itemise what sits outside it. "From R X for attorney's fees,
  billed by the attorney directly" is a perfectly sellable line and it is safe.

I have left this as a `[SPECIFY]` block in `index.html` and in the revised copy
rather than guessing, because only you know the answer and a wrong guess here is
the finding.

Related question for your attorney: taking fees upfront for services not yet
rendered, from consumers in financial distress, may raise s65 accounting
obligations. Worth resolving alongside L-2.

### C-3 — substantiation · High

"20+ years. 8,700+ clients. 3,035 homes saved." — a precise figure like 3,035
reads as auditable, and both the ARB Code and s41 mean you must be able to
produce the evidence on demand, promptly.

Before this runs anywhere, settle: what counts as a home "saved"? Sale
cancelled? Postponed? Reserve price achieved? Matter settled with the bank? Fix
the definition in writing, hold the file that produces the number, and state the
period it covers. If the definition is soft, use a softer claim.

### C-4 — fee banded by property value · Medium

The fee scales with the value of the house, not with the work. A R44,000 matter
and an R18,000 matter may involve identical documents and the same hearing.

Not unlawful. But paired with the vulnerability of the cohort it is the kind of
term that attracts s40 unconscionable-conduct scrutiny, and it is hard to defend
if a complaint is ever assessed. Either be able to explain the value link
(higher-value matters genuinely carry more work or more risk) or move to a
scope-based fee.

---

## National Credit Act

### N-1 — s44: registration · High

Debt counselling is a registered function under the NCA, and performing it
without NCR registration is an offence. "Consumer credit consultancy" is not a
recognised category, and the activities implied — assessing affordability,
negotiating with credit providers, proposing restructured payment arrangements —
sit close to the registered function.

Confirm which side of the line the actual service falls on, and if it is close,
register. Being able to display an NCR number would also do more for conversion
than any sentence in the current message.

---

## Accuracy and tone

**A-1 (Low).** "The National Credit Act and Rule 46A gives you room." Rule 46A is
a Uniform Rule of Court, not a provision of the NCA. They are separate
instruments that happen to both be relevant. Minor, but it is the sort of error
a bank's attorney will enjoy quoting back.

**A-2 (Medium).** "We act for you, NEVER the bank." Replace with "We work only
for homeowners — never for banks." Keeps the whole rhetorical force, drops the
representation claim. See L-1.

**T-1 (Medium).** The body is 1,017 characters against WhatsApp's 1,024 template
limit. It fits — but the personalised opening in the payload (`Hi {{1}}, ` plus
two newlines, 12 characters) takes it to 1,029 and Meta will reject the template.
The trimmed version in `../whatsapp/templates/` comes in at 937 with the identity
line included.

**T-2 (Medium).** "Send us your court papers today" invites people to send
summonses and Rule 46A applications over WhatsApp — documents containing ID
numbers, financial positions and household details. Decide and publish where
those go, how long you keep them, and who sees them. The inbound page offers a
secure route and states a retention position; the `[RETENTION PERIOD]`
placeholders need filling.

---

## What I did not find wrong

Worth saying plainly, because the list above is long:

- Leading with **"We DO NOT buy houses"** is the right opening. It separates you
  from the distressed-property buyers this cohort is being circled by, and it is
  the most credible sentence in the message.
- **Publishing the fee schedule upfront** is unusually transparent for this
  sector. Most operators hide it. Keep it — it is an asset, and C-2 is about one
  bold line beside it, not about the disclosure itself.
- The **stage-based framing** (s129 → summons → Rule 46A → sale date) is
  accurate and genuinely useful to someone trying to work out where they stand.
- **Rule 46A judicial oversight** is correctly described: a court must apply its
  mind before declaring a primary residence specially executable, and reserve
  prices are the norm.

The problem is the channel and the list, and — separately and more seriously —
the L-1/L-2 structure. It is not the proposition.
