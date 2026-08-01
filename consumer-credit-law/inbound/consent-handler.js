/**
 * POST /api/enquiry — inbound enquiry + consent capture.
 *
 * Framework-agnostic handler. Works under Express (`app.post('/api/enquiry', handler)`),
 * Vercel/Netlify functions, or any adapter giving you `(req, res)` with a parsed body.
 *
 * The job here is not really "save a lead". It is to produce evidence that will
 * still be good in two years: who agreed, to what exact wording, from where, when.
 * Everything else is secondary.
 */

'use strict';

const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Verbatim consent wording rendered by inbound/index.html.
 *
 * These strings are the evidence. If you change a word on the form, mint a NEW
 * version key here and leave the old one in place forever — historical rows must
 * keep resolving to the text those people actually saw.
 */
const CONSENT_TEXT = {
  'ccl-consent-v1': {
    contact_about_enquiry:
      'Contact me about this enquiry. I am asking Consumer Credit Law to review the ' +
      'information and documents I provide and to contact me about my own matter.',
    whatsapp_channel:
      'You may reach me on WhatsApp. I consent to Consumer Credit Law sending me ' +
      'messages on WhatsApp about my enquiry, on the number given above.',
    direct_marketing:
      'Send me guides and updates. I consent, in terms of section 69 of POPIA, to ' +
      'receiving direct marketing from Consumer Credit Law by email, SMS and WhatsApp ' +
      'about its services. This is not required in order to get help with my matter.'
  }
};

const PURPOSE_BY_FIELD = {
  contact:   'contact_about_enquiry',
  whatsapp:  'whatsapp_channel',
  marketing: 'direct_marketing'
};

/** Normalise SA mobile input to E.164. Returns null if it cannot be trusted. */
function toE164(raw) {
  if (!raw) return null;
  const d = String(raw).replace(/[^\d+]/g, '');
  if (/^\+27[6-8]\d{8}$/.test(d)) return d;          // already E.164
  if (/^27[6-8]\d{8}$/.test(d))   return '+' + d;
  if (/^0[6-8]\d{8}$/.test(d))    return '+27' + d.slice(1);
  return null;
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? String(fwd).split(',')[0] : req.socket?.remoteAddress || '').trim() || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'method_not_allowed' }));
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const {
    full_name, phone, email, stage, value_band, notes,
    form_version, consent_text_version, consents = {}, page_url
  } = body;

  const phoneE164 = toE164(phone);
  if (!full_name || !phoneE164) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'name_and_valid_sa_mobile_required' }));
  }

  const texts = CONSENT_TEXT[consent_text_version];
  if (!texts) {
    // An unknown version means we cannot say what this person was shown, so we
    // cannot honestly record a consent. Refuse rather than store an unprovable one.
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'unknown_consent_text_version' }));
  }

  if (!consents.contact) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'contact_consent_required' }));
  }

  const ip = clientIp(req);
  const ua = req.headers['user-agent'] || null;

  const db = await pool.connect();
  try {
    await db.query('BEGIN');

    const { rows: [contact] } = await db.query(
      `INSERT INTO contacts (phone_e164, full_name, email, acquisition)
       VALUES ($1, $2, $3, 'inbound_form')
       ON CONFLICT (phone_e164) DO UPDATE
         SET full_name = COALESCE(contacts.full_name, EXCLUDED.full_name),
             email     = COALESCE(EXCLUDED.email, contacts.email)
       RETURNING id`,
      [phoneE164, full_name.trim(), email || null]
    );

    // One immutable event per permission actually ticked.
    for (const [field, purpose] of Object.entries(PURPOSE_BY_FIELD)) {
      if (!consents[field]) continue;                 // silence is not consent
      await db.query(
        `INSERT INTO consent_events
           (contact_id, purpose, action, consent_text_version, consent_text,
            form_version, page_url, source_ip, user_agent, channel)
         VALUES ($1, $2, 'granted', $3, $4, $5, $6, $7, $8, 'web_form')`,
        [contact.id, purpose, consent_text_version, texts[purpose],
         form_version || null, page_url || null, ip, ua]
      );
    }

    // A returning enquirer may have opted out previously. An enquiry is a
    // deliberate approach, so lift a prior suppression — but only that person's,
    // and only on the strength of the event we just wrote.
    await db.query(
      `DELETE FROM suppression_list
        WHERE phone_e164 = $1 AND reason IN ('stop_keyword','manual')`,
      [phoneE164]
    );

    const { rows: [enq] } = await db.query(
      `INSERT INTO enquiries (contact_id, stage, value_band, notes)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [contact.id, stage || null, value_band || null, notes || null]
    );

    await db.query('COMMIT');

    // Never log the enquiry body or the contact's details — court papers and
    // financial distress do not belong in application logs.
    console.log(JSON.stringify({
      evt: 'enquiry_received', enquiry_id: enq.id, stage: stage || null,
      consents: Object.keys(PURPOSE_BY_FIELD).filter(k => !!consents[k])
    }));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: true, enquiry_id: enq.id }));

  } catch (e) {
    await db.query('ROLLBACK').catch(() => {});
    console.error(JSON.stringify({ evt: 'enquiry_failed', err: e.message }));
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'internal_error' }));
  } finally {
    db.release();
  }
};
