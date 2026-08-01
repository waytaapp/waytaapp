# Postal outreach — why it sits differently, and what it still requires

**Working analysis by a non-lawyer, not legal advice.** The conclusion below is
favourable to you, which is exactly why it should be confirmed by your attorney
before you spend money on a print run.

---

## The short version

POPIA s69 — the opt-in requirement that blocks the WhatsApp campaign — is
confined to **electronic communication**. A physical letter is not an electronic
communication. So s69's consent requirement does not attach to postal direct
marketing.

That does **not** make post unregulated. POPIA still applies in full through
other sections, and the CPA adds a registry obligation that has no WhatsApp
equivalent. Post is *available*; it is not *free*.

---

## Why s69 does not reach post

Section 69(1) prohibits direct marketing "by means of any form of **electronic
communication**, including automatic calling machines, facsimile machines, SMSs
or e-mail".

POPIA s1 defines electronic communication as:

> any text, voice, sound or image message sent over an electronic communications
> network which is stored in the network or in the recipient's terminal equipment
> until it is collected by the recipient

WhatsApp is squarely inside that definition — which is why the campaign is
blocked. A letter delivered by the post office is outside it on every limb:
there is no electronic communications network and no terminal equipment.

The consequence is the useful one: **for post, you do not need prior consent.**
You need a lawful basis under s11, and s11(1)(f) — processing necessary for the
legitimate interests of the responsible party — is available where the interest
is real, the processing is proportionate, and it does not override the person's
rights. Marketing a genuine service to a homeowner facing execution, using their
name and property address from a published notice, is a plausible fit.

Two limits on relying on it:

- Legitimate interest is a **balancing test**, not a switch. The more intrusive
  the contact and the more vulnerable the person, the harder it is to sustain.
  One letter offering help, with a clear way to stop, sits well. Repeated
  letters, or letters implying urgency you have manufactured, do not.
- The person may **object under s11(3)** at any time, on Form 1. Once they do,
  you must stop. This is why the suppression list in `../inbound/schema.sql`
  includes `post` as a channel — a postal objection has to suppress the address
  as well as the number.

---

## What still applies

### POPIA s18 — notification

Because you collected their details from a source other than them, you must make
them aware of: what you hold, its source, who you are and your address, the
purpose, the recipients, their rights of access, correction and objection, and
their right to complain to the Information Regulator.

The letter below carries this on the reverse. **This obligation is the reason
post works well here**: an A4 page has room for a full s18 notice, where a
1,024-character WhatsApp template does not. The constraint that makes post
expensive is the same one that makes it compliant.

### CPA s11 — the opt-out register · **do not skip this**

Section 11 gives consumers a right to pre-emptively block direct marketing, and
provides for a national opt-out register. Unlike POPIA s69, this applies to
**all** direct marketing, postal included.

Before a print run, screen your list against the applicable registry — the
DMASA's register and any operative national register. Confirm the current
mechanism with your attorney; this is the step most likely to be skipped and it
is cheap to do.

### CPA s16 — cooling-off still attaches

A letter is direct marketing. An engagement concluded as a result of it carries
the same **five-business-day** rescission right discussed in `copy-review.md`
(C-1). Changing channel does not avoid this. Disclose it.

### The 50 numbers do not become a mailing list

You have phone numbers, not verified postal addresses. Do not reverse-look-up
addresses from the numbers. Work forward from the **published notice** instead:
the sale-in-execution notice gives the property description and address
directly, which is a cleaner provenance and one you can evidence.

This also fixes the data-quality problem flagged earlier. Two entries in the
source list differ by a single digit while carrying different first names, which
is the signature of a transcription error (they are rows 16 and 23 of
`whatsapp-verified-leads-2026-08-01.csv` — the numbers are deliberately not
reproduced here). A wrong number gets a message about a stranger's home being
auctioned. A letter addressed to "The Owner" at the property named in the notice
cannot make that mistake.

---

## Why this channel actually suits this cohort

Setting law aside — post is plausibly the *better* instrument here, not merely
the permitted one:

- **The address is the qualifier.** The notice tells you a specific property is
  going to auction. A letter to that address reaches the person the notice is
  about. No matching, no verification, no wrong number.
- **No character limit.** You can enclose the s129 guide. The guide is the thing
  that establishes competence; the WhatsApp version cannot carry it.
- **Nobody else is doing it well.** This cohort is saturated with WhatsApp
  messages from distressed-property buyers. A printed letter that opens with
  "we do not want to buy your house" is differentiated in a way that a WhatsApp
  message with the same words is not — because the medium itself carries the
  signal.
- **It is unhurried.** Someone can read it twice, show a family member, and come
  to you. Every response is inbound, which starts a 24-hour WhatsApp window and
  makes the rest of the funnel lawful automatically.

---

## Letter — draft

Single sheet, notice on the reverse. `[BRACKETS]` are yours to fill.

---

**[REGISTERED ENTITY NAME] t/a Consumer Credit Law**
[STREET ADDRESS], Fourways, Johannesburg · [CIPC REG NO]
[TEL] · [EMAIL] · creditlaws.co.za

[DATE]

The Owner
[PROPERTY ADDRESS AS DESCRIBED IN THE NOTICE]

**Your home has been set down for sale in execution. There may be more room than the papers suggest.**

Dear Homeowner,

We saw the notice of sale in execution published in respect of your property in
**[PUBLICATION, DATE]**. We are writing once, to tell you what your options are
and to offer help if you want it.

**First, so there is no confusion: we do not buy houses.** This is not an offer
to purchase your property and we will never make one. We are a consumer credit
consultancy. We work only for homeowners — never for banks or credit providers.

**What the law gives you.** Rule 46A of the Uniform Rules of Court requires a
court to apply its mind before a person's primary residence is declared
specially executable. The court must consider whether there is another way to
recover the debt, and it will usually set a reserve price below which your home
may not be sold. Separately, the National Credit Act sets out steps a credit
provider must take before it may litigate — including the section 129 notice.
These protections are real, but they are only useful if your circumstances are
actually put before the court, in time.

**Free, whether or not you ever contact us.** Our guides on section 129 letters,
summonses, Rule 46A applications and sales in execution are at
**creditlaws.co.za**. They cost nothing and we do not ask for your details.

**If you would like us to look at your papers.** Send them to [EMAIL] or
WhatsApp [NUMBER]. We will read them and tell you, at no charge, what stage you
are at and what options remain. If we cannot help, we will say so.

**What we charge, if you decide to go ahead.** Our consultancy fee is set by the
value of the property, payable upfront or over two months:

| Property value | Total | Over two months |
|---|---|---|
| Under R500,000 | R18,000 | R9,000 × 2 |
| R500,000 – R800,000 | R24,000 | R12,000 × 2 |
| R800,000 – R1.2m | R34,000 | R17,000 × 2 |
| R1.2m – R1.5m | R36,000 | R18,000 × 2 |
| Above R1.5m | R44,000 | R22,000 × 2 |

[FEE SCOPE — state precisely what this includes, and itemise anything charged
separately by the attorney, the sheriff or the court. See copy-review.md, C-2.]

Court work is carried out by independent attorneys admitted under the Legal
Practice Act, whom you engage and pay directly. **We are not a firm of attorneys
and we do not provide legal services.** We do not guarantee any outcome — no one
honestly can. If you engage us following this letter, the Consumer Protection
Act gives you **five business days to cancel and be refunded in full**, for any
reason or none.

[20+ years. 8,700+ clients. — reinstate the "homes saved" figure only once the
definition is settled and the supporting file is held. See C-3.]

The earlier this starts, the more options are open. If your sale date is within
14 days, please phone rather than write.

Yours faithfully,

**[FULL NAME]**
[ROLE], [REGISTERED ENTITY NAME] t/a Consumer Credit Law

---

**REVERSE OF LETTER**

**How we got your details, and what you can do about it — POPIA notice**

**Who we are.** [REGISTERED ENTITY NAME] t/a Consumer Credit Law, registration
number [CIPC REG NO], of [FULL STREET ADDRESS], Fourways, Johannesburg.
Information Officer: [NAME], privacy@creditlaws.co.za.

**Where your details came from.** The notice of sale in execution published in
[PUBLICATION] on [DATE], which is a public record. We hold the property address
from that notice and nothing more. We did not obtain your details from your bank
or from any credit provider.

**What we hold and why.** The property address, and the fact that a sale in
execution has been set down against it. We use this only to write to you once
about services that may be relevant to you.

**Who else sees it.** No one. We do not sell, rent or share these details. If
you instruct us, we would share only what is necessary with the independent
attorney doing your court work, and only with your agreement.

**Your rights.** You may ask what we hold about you, ask us to correct or delete
it, and object to our processing it for direct marketing. Write to
privacy@creditlaws.co.za or [STREET ADDRESS], or call [NUMBER]. We will act on
any objection immediately and will not write to you again.

**Complaints.** You may complain to the Information Regulator (South Africa),
JD House, 27 Stiemens Street, Braamfontein, Johannesburg 2001 —
complaints.IR@justice.gov.za.

**How long we keep it.** If you do not respond, we delete your details after
[RETENTION PERIOD]. If you become a client, we keep your file for
[RETENTION PERIOD] after your matter closes.

---

## Before the first print run

- [ ] L-1, L-2 and C-2 resolved by an independent attorney — the letter states the
      fee and attorney structure, so it cannot be finalised before those are
- [ ] `[FEE SCOPE]` filled in with the real answer
- [ ] Legitimate-interest assessment written down and filed
- [ ] List screened against the applicable opt-out register (CPA s11)
- [ ] "Homes saved" definition settled, or the claim stays out
- [ ] Guides actually published at creditlaws.co.za before the letter points there
- [ ] Suppression process covers postal addresses, not only numbers
- [ ] One letter per property recorded, so nobody is written to twice
