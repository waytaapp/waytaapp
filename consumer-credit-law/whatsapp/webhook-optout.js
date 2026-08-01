/**
 * WhatsApp Cloud API webhook — inbound messages, opt-out processing, delivery status.
 *
 * Wire to the `messages` webhook field on the WABA.
 *
 * Requires the RAW request body for signature verification. Under Express:
 *   app.use('/webhooks/whatsapp', express.raw({ type: 'application/json' }));
 *
 * Env: WA_VERIFY_TOKEN, WA_APP_SECRET, DATABASE_URL
 */

'use strict';

const crypto = require('crypto');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Opt-out intent matching.
 *
 * A matcher that only catches a bare "STOP" is close to useless in practice.
 * People reply in the words that come naturally, often in more than one language,
 * and — because this list was built from public auction notices — a meaningful
 * share of replies will be from people who are not the debtor at all. Every one
 * of those is someone who must stop receiving messages immediately.
 *
 * Deliberately over-inclusive: the cost of wrongly suppressing someone who meant
 * something else is one lost lead. The cost of missing a genuine opt-out is a
 * POPIA complaint from a person already in the worst month of their year.
 */
const STOP_PATTERNS = [
  /\bstop\b/i,
  /\bunsubscribe\b/i,
  /\bopt[\s-]?out\b/i,
  /\bremove\s*me\b/i,
  /\btake\s*me\s*off\b/i,
  /\bdo\s*not\s*(contact|message|text|whatsapp)\b/i,
  /\bdon'?t\s*(contact|message|text|whatsapp)\b/i,
  /\bleave\s*me\s*alone\b/i,
  /\bnot\s*interested\b/i,
  /\bwrong\s*(number|person)\b/i,
  /\bwho\s*(are|r)\s*(you|u)\b/i,     // near-always an uninvited-contact signal
  /\bhoezit\s*wie\b/i,
  /\bhou\s*op\b/i,                    // Afrikaans: stop
  /\bverwyder\s*my\b/i,               // Afrikaans: remove me
  /\byekela\b/i,                      // isiZulu: leave it / stop
  /\bmusa\s*uku(ng|)thumela\b/i,      // isiZulu: don't send me
  /\bemisa\b/i                        // Sesotho: stop
];

const BUTTON_STOP_PAYLOADS = ['Stop these messages', 'Stop promotions'];

function isStop(text) {
  if (!text) return false;
  const t = String(text).trim();
  if (t.length > 160) return false;   // a long message is a real enquiry, not an opt-out
  return STOP_PATTERNS.some(re => re.test(t));
}

function verifySignature(rawBody, header) {
  if (!header || !process.env.WA_APP_SECRET) return false;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.WA_APP_SECRET)
    .update(rawBody)
    .digest('hex');
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Record the withdrawal and suppress the number, in one transaction. */
async function suppress(waId, reason, sourceText) {
  const phone = waId.startsWith('+') ? waId : '+' + waId;
  const db = await pool.connect();
  try {
    await db.query('BEGIN');

    const { rows } = await db.query(
      'SELECT id FROM contacts WHERE phone_e164 = $1', [phone]
    );

    // Withdraw every live consent this contact holds — someone saying "stop"
    // is not distinguishing between your marketing consent and your channel
    // consent, and it is not their job to.
    if (rows.length) {
      await db.query(
        `INSERT INTO consent_events
           (contact_id, purpose, action, consent_text_version, consent_text, channel, notes)
         SELECT $1, p, 'withdrawn', 'n/a-withdrawal',
                'Withdrawn by inbound message from the data subject.', 'whatsapp_stop', $2
         FROM   unnest(ARRAY['contact_about_enquiry','whatsapp_channel','direct_marketing']) AS p
         WHERE  EXISTS (
                  SELECT 1 FROM consent_state s
                  WHERE s.contact_id = $1 AND s.purpose = p AND s.is_active
                )`,
        [rows[0].id, sourceText ? sourceText.slice(0, 200) : null]
      );
    }

    // Suppress regardless of whether we hold a contact row. If we messaged a
    // number we have no record of, that is precisely the case that must never
    // be messaged again.
    await db.query(
      `INSERT INTO suppression_list (phone_e164, reason, source, notes)
       VALUES ($1, $2, 'whatsapp_webhook', $3)
       ON CONFLICT (phone_e164) DO NOTHING`,
      [phone, reason, sourceText ? sourceText.slice(0, 200) : null]
    );

    await db.query('COMMIT');
    console.log(JSON.stringify({ evt: 'opt_out_recorded', reason }));
  } catch (e) {
    await db.query('ROLLBACK').catch(() => {});
    console.error(JSON.stringify({ evt: 'opt_out_failed', err: e.message }));
    throw e;
  } finally {
    db.release();
  }
}

module.exports = async function webhook(req, res) {

  // --- Meta's subscription handshake ---------------------------------------
  if (req.method === 'GET') {
    const q = req.query || {};
    if (q['hub.mode'] === 'subscribe' && q['hub.verify_token'] === process.env.WA_VERIFY_TOKEN) {
      res.statusCode = 200;
      return res.end(String(q['hub.challenge']));
    }
    res.statusCode = 403;
    return res.end();
  }

  if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }

  const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
  if (!verifySignature(raw, req.headers['x-hub-signature-256'])) {
    console.error(JSON.stringify({ evt: 'webhook_bad_signature' }));
    res.statusCode = 401;
    return res.end();
  }

  // Acknowledge immediately — Meta retries on slow responses, which would
  // double-process opt-outs.
  res.statusCode = 200;
  res.end();

  let payload;
  try { payload = JSON.parse(raw.toString('utf8')); } catch { return; }

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const v = change.value || {};

      for (const msg of v.messages || []) {
        const from = msg.from;

        const buttonText = msg.button?.text || msg.interactive?.button_reply?.title;
        if (buttonText && BUTTON_STOP_PAYLOADS.includes(buttonText)) {
          await suppress(from, 'stop_keyword', buttonText).catch(() => {});
          continue;
        }

        const text = msg.text?.body;
        if (isStop(text)) {
          const reason = /\bwrong\s*(number|person)\b/i.test(text) ? 'wrong_number' : 'stop_keyword';
          await suppress(from, reason, text).catch(() => {});
          continue;
        }

        // Anything else is a live human wanting help. Log it and hand off —
        // you now have a 24-hour window to reply free-form, no template needed.
        await pool.query(
          `INSERT INTO message_log (contact_id, direction, channel, category, wa_message_id, body_snapshot, status)
           SELECT id, 'inbound', 'whatsapp', 'reply', $2, $3, 'delivered'
           FROM contacts WHERE phone_e164 = $1`,
          ['+' + from, msg.id, text ? text.slice(0, 2000) : `[${msg.type}]`]
        ).catch(e => console.error(JSON.stringify({ evt: 'inbound_log_failed', err: e.message })));
      }

      // Delivery receipts and failures.
      for (const st of v.statuses || []) {
        // 131047 / 131026: cannot deliver — number not on WhatsApp, or blocked us.
        const undeliverable = (st.errors || []).some(e => [131026, 131047, 131050].includes(e.code));
        if (undeliverable) {
          await suppress(st.recipient_id, 'bounce', 'undeliverable').catch(() => {});
          continue;
        }
        await pool.query(
          `UPDATE message_log SET status = $2 WHERE wa_message_id = $1`,
          [st.id, st.status]
        ).catch(() => {});
      }
    }
  }
};
