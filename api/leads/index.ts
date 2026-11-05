import crypto from 'node:crypto';
import type { VercelRequest, VercelResponse } from '../_lib/types.js';
import { getPool, mapPgRowToLead } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';
import {
  cleanText,
  normalizePhone,
  VALID_GRADES,
  VALID_PLANS,
  VALID_PAYMENT_MODES,
  VALID_LOCALES,
  ID_REGEX,
  PHONE_REGEX,
} from '../_lib/validators.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = crypto.randomUUID().slice(0, 8);
  const tag = `[leads/${req.method} #${requestId}]`;

  // ─── GET /api/leads — list all leads (admin only) ─────────────────────────
  if (req.method === 'GET') {
    const authHeader = (req.headers.authorization as string) ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!verifyAdminToken(token)) {
      console.warn(`${tag} Unauthorized GET attempt`);
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      console.log(`${tag} Fetching leads list`);
      const pool = getPool();
      const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 1000');
      console.log(`${tag} OK — returned ${result.rowCount} rows`);
      res.json({ leads: result.rows.map((r) => mapPgRowToLead(r as Record<string, unknown>)) });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`${tag} ERROR fetching leads:`, message);
      res.status(500).json({ error: 'Failed to load leads', detail: message });
    }
    return;
  }

  // ─── POST /api/leads — submit a new lead (public) ─────────────────────────
  if (req.method === 'POST') {
    console.log(`${tag} Received body:`, JSON.stringify(req.body ?? {}));

    try {
      // --- Parse & validate fields ---
      const rawId = cleanText(req.body?.id, 64);
      const id = ID_REGEX.test(rawId)
        ? rawId
        : `lead_${crypto.randomUUID().replace(/[^a-zA-Z0-9_-]/g, '')}`;

      const studentName = cleanText(req.body?.studentName, 80);
      const phone = normalizePhone(req.body?.phone);
      const gradeRaw = cleanText(req.body?.grade, 4);
      const planRaw = cleanText(req.body?.selectedPlan, 32);
      const modeRaw = cleanText(req.body?.paymentMode, 32);
      const localeRaw = cleanText(req.body?.locale, 4);

      console.log(`${tag} Parsed: name="${studentName}" phone="${phone}" grade="${gradeRaw}" plan="${planRaw}" mode="${modeRaw}" locale="${localeRaw}"`);

      if (studentName.length < 2) {
        console.warn(`${tag} Validation failed: studentName too short ("${studentName}")`);
        res.status(400).json({ error: 'Invalid student name' });
        return;
      }
      if (!PHONE_REGEX.test(phone)) {
        console.warn(`${tag} Validation failed: invalid phone ("${phone}")`);
        res.status(400).json({ error: 'Invalid Kazakhstan phone format' });
        return;
      }

      const grade = (VALID_GRADES.has(gradeRaw) ? gradeRaw : '10') as '9' | '10' | '11';
      const selectedPlan = (VALID_PLANS.has(planRaw) ? planRaw : 'diagnostic') as string;
      const paymentMode = (VALID_PAYMENT_MODES.has(modeRaw) ? modeRaw : 'package_total') as string;
      const locale = (VALID_LOCALES.has(localeRaw) ? localeRaw : 'ru') as string;
      const utmSource = cleanText(req.body?.utmSource, 64) || 'direct';
      const utmMedium = cleanText(req.body?.utmMedium, 64) || 'none';
      const utmCampaign = cleanText(req.body?.utmCampaign, 96) || 'satosphere_landing';
      const promoCodeRaw = cleanText(req.body?.promoCode, 32);
      const promoCode = /^[A-Z0-9_-]{2,32}$/.test(promoCodeRaw) ? promoCodeRaw : '';
      const promoNote = promoCode ? `Промо ${promoCode} · −15% + гайд` : '';

      // --- Database write ---
      console.log(`${tag} Acquiring DB pool...`);
      const pool = getPool(); // throws with clear message if DATABASE_URL not set

      console.log(`${tag} Running INSERT for id="${id}"...`);
      const result = await pool.query(
        `INSERT INTO leads (
          id, student_name, phone, grade, selected_plan, payment_mode,
          locale, status, notes, utm_source, utm_medium, utm_campaign
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', $8, $9, $10, $11)
        RETURNING *`,
        [id, studentName, phone, grade, selectedPlan, paymentMode, locale, promoNote, utmSource, utmMedium, utmCampaign]
      );

      console.log(`${tag} INSERT OK — lead id="${id}" created`);
      res.status(201).json({ lead: mapPgRowToLead(result.rows[0]) });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;
      console.error(`${tag} ERROR writing lead:`, message);
      if (stack) console.error(`${tag} Stack:`, stack);
      res.status(500).json({ error: 'Database write failed', detail: message });
    }
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
