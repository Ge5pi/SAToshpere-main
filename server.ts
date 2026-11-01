import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import pg from 'pg';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StoredLeadRow {
  id: string;
  studentName: string;
  phone: string;
  grade: '9' | '10' | '11';
  selectedPlan:
    | 'diagnostic'
    | 'per_lesson'
    | 'course_1m'
    | 'course_2m'
    | 'standard_group'
    | 'intensive_pro'
    | 'individual_vip';
  paymentMode: 'package_total' | 'per_lesson_view' | 'full_3m' | 'monthly';
  locale: 'ru' | 'kz';
  status: 'new' | 'contacted' | 'diagnostic_scheduled' | 'enrolled' | 'archived';
  notes: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  createdAtMillis: number;
  updatedAtMillis: number;
}

const VALID_GRADES = new Set(['9', '10', '11']);
const VALID_PLANS = new Set([
  'diagnostic',
  'per_lesson',
  'course_1m',
  'course_2m',
  'standard_group',
  'intensive_pro',
  'individual_vip',
]);
const VALID_PAYMENT_MODES = new Set([
  'package_total',
  'per_lesson_view',
  'full_3m',
  'monthly',
]);
const VALID_LOCALES = new Set(['ru', 'kz']);
const VALID_STATUSES = new Set([
  'new',
  'contacted',
  'diagnostic_scheduled',
  'enrolled',
  'archived',
]);
const PHONE_REGEX = /^\+7[0-9]{10}$/;
const ID_REGEX = /^[a-zA-Z0-9_-]{4,64}$/;

function cleanText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function normalizePhone(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('8') && digits.length === 11) {
    digits = '7' + digits.slice(1);
  }
  if (digits.length === 10) {
    digits = '7' + digits;
  }
  return `+${digits}`;
}

function isPlaceholder(val: string | undefined, placeholderPrefix: string): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  if (!trimmed) return true;
  return trimmed.startsWith(placeholderPrefix) || trimmed === 'MY_DATABASE_URL';
}

function createPgPoolFromEnv(): pg.Pool | null {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
  const pgHost = process.env.PGHOST?.trim() ?? '';
  const sslMode = (process.env.PGSSLMODE ?? '').trim().toLowerCase();

  if (
    databaseUrl &&
    (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))
  ) {
    const needsSsl =
      sslMode === 'require' ||
      databaseUrl.includes('sslmode=require') ||
      databaseUrl.includes('neon.tech') ||
      databaseUrl.includes('supabase.co') ||
      databaseUrl.includes('render.com');

    return new Pool({
      connectionString: databaseUrl,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }

  if (pgHost) {
    const port = Number(process.env.PGPORT || 5432);
    return new Pool({
      host: pgHost,
      port: Number.isFinite(port) ? port : 5432,
      database: process.env.PGDATABASE?.trim() || 'satosphere',
      user: process.env.PGUSER?.trim() || 'postgres',
      password: process.env.PGPASSWORD ?? '',
      ssl: sslMode === 'require' ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }

  return null;
}

const pgPool = createPgPoolFromEnv();
const localStorePath = path.join(__dirname, '.data', 'leads.json');

async function readLocalLeads(): Promise<StoredLeadRow[]> {
  try {
    const content = await fs.readFile(localStorePath, 'utf-8');
    const parsed = JSON.parse(content) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredLeadRow[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalLeads(rows: StoredLeadRow[]): Promise<void> {
  await fs.mkdir(path.dirname(localStorePath), { recursive: true });
  await fs.writeFile(localStorePath, JSON.stringify(rows, null, 2), 'utf-8');
}

function mapPgRowToLead(row: Record<string, unknown>): StoredLeadRow {
  const createdAt = row.created_at instanceof Date ? row.created_at.getTime() : Date.now();
  const updatedAt = row.updated_at instanceof Date ? row.updated_at.getTime() : createdAt;

  return {
    id: String(row.id ?? ''),
    studentName: String(row.student_name ?? ''),
    phone: String(row.phone ?? ''),
    grade: (VALID_GRADES.has(String(row.grade)) ? String(row.grade) : '10') as StoredLeadRow['grade'],
    selectedPlan: (VALID_PLANS.has(String(row.selected_plan))
      ? String(row.selected_plan)
      : 'diagnostic') as StoredLeadRow['selectedPlan'],
    paymentMode: (VALID_PAYMENT_MODES.has(String(row.payment_mode))
      ? String(row.payment_mode)
      : 'package_total') as StoredLeadRow['paymentMode'],
    locale: (VALID_LOCALES.has(String(row.locale))
      ? String(row.locale)
      : 'ru') as StoredLeadRow['locale'],
    status: (VALID_STATUSES.has(String(row.status))
      ? String(row.status)
      : 'new') as StoredLeadRow['status'],
    notes: String(row.notes ?? ''),
    utmSource: String(row.utm_source ?? 'direct'),
    utmMedium: String(row.utm_medium ?? 'none'),
    utmCampaign: String(row.utm_campaign ?? 'satosphere_landing'),
    createdAtMillis: createdAt,
    updatedAtMillis: updatedAt,
  };
}

async function runStartupMigrationIfConfigured(): Promise<void> {
  if (!pgPool) {
    console.log(
      '[SATosphere DB] DATABASE_URL / PGHOST not set yet — using local file store (.data/leads.json) until .env is filled.'
    );
    return;
  }

  if ((process.env.AUTO_MIGRATE ?? 'true').toLowerCase() === 'false') {
    console.log('[SATosphere DB] PostgreSQL pool configured (AUTO_MIGRATE=false).');
    return;
  }

  try {
    const schemaPath = path.join(__dirname, 'sql', '001_init_schema.sql');
    const sql = await fs.readFile(schemaPath, 'utf-8');
    await pgPool.query(sql);
    console.log('[SATosphere DB] PostgreSQL connected and sql/001_init_schema.sql verified.');
  } catch (err) {
    console.error('[SATosphere DB] Failed to run startup migration:', err);
  }
}

function getAdminPassword(): string {
  const raw = process.env.ADMIN_PASSWORD;
  if (!raw || isPlaceholder(raw, 'CHANGE_ME')) {
    return 'satosphere2026';
  }
  return raw;
}

function getSessionSecret(): string {
  const raw = process.env.ADMIN_SESSION_SECRET;
  if (!raw || isPlaceholder(raw, 'CHANGE_ME')) {
    return 'satosphere-default-hmac-secret-key-2026';
  }
  return raw;
}

function signAdminToken(): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `admin:${expiresAt}`;
  const sig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}:${sig}`, 'utf-8').toString('base64url');
}

function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3 || parts[0] !== 'admin') return false;
    const expiresAt = Number(parts[1]);
    const providedSig = parts[2];
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

    const expectedSig = crypto
      .createHmac('sha256', getSessionSecret())
      .update(`admin:${expiresAt}`)
      .digest('hex');

    const a = Buffer.from(providedSig, 'utf-8');
    const b = Buffer.from(expectedSig, 'utf-8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

async function startServer(): Promise<void> {
  await runStartupMigrationIfConfigured();

  const app = express();
  app.use(express.json({ limit: '32kb' }));

  // 1. Admin Login & Session Check
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const provided = typeof req.body?.password === 'string' ? req.body.password : '';
    const expected = getAdminPassword();

    const bufA = Buffer.from(provided, 'utf-8');
    const bufB = Buffer.from(expected, 'utf-8');
    const matches =
      bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);

    if (!matches) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    res.json({ token: signAdminToken() });
  });

  app.get('/api/admin/session', requireAdminAuth, (_req: Request, res: Response) => {
    res.json({ authenticated: true });
  });

  // 2. Public Lead Submission Endpoint
  app.post('/api/leads', async (req: Request, res: Response) => {
    try {
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

      if (studentName.length < 2) {
        res.status(400).json({ error: 'Invalid student name' });
        return;
      }
      if (!PHONE_REGEX.test(phone)) {
        res.status(400).json({ error: 'Invalid Kazakhstan phone format' });
        return;
      }

      const grade = (VALID_GRADES.has(gradeRaw) ? gradeRaw : '10') as StoredLeadRow['grade'];
      const selectedPlan = (VALID_PLANS.has(planRaw)
        ? planRaw
        : 'diagnostic') as StoredLeadRow['selectedPlan'];
      const paymentMode = (VALID_PAYMENT_MODES.has(modeRaw)
        ? modeRaw
        : 'package_total') as StoredLeadRow['paymentMode'];
      const locale = (VALID_LOCALES.has(localeRaw)
        ? localeRaw
        : 'ru') as StoredLeadRow['locale'];
      const utmSource = cleanText(req.body?.utmSource, 64) || 'direct';
      const utmMedium = cleanText(req.body?.utmMedium, 64) || 'none';
      const utmCampaign = cleanText(req.body?.utmCampaign, 96) || 'satosphere_landing';

      if (pgPool) {
        const result = await pgPool.query(
          `INSERT INTO leads (
            id, student_name, phone, grade, selected_plan, payment_mode,
            locale, status, notes, utm_source, utm_medium, utm_campaign
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', '', $8, $9, $10)
          RETURNING *`,
          [
            id,
            studentName,
            phone,
            grade,
            selectedPlan,
            paymentMode,
            locale,
            utmSource,
            utmMedium,
            utmCampaign,
          ]
        );
        res.status(201).json({ lead: mapPgRowToLead(result.rows[0]) });
        return;
      }

      const now = Date.now();
      const newLead: StoredLeadRow = {
        id,
        studentName,
        phone,
        grade,
        selectedPlan,
        paymentMode,
        locale,
        status: 'new',
        notes: '',
        utmSource,
        utmMedium,
        utmCampaign,
        createdAtMillis: now,
        updatedAtMillis: now,
      };
      const existing = await readLocalLeads();
      existing.unshift(newLead);
      await writeLocalLeads(existing);
      res.status(201).json({ lead: newLead });
    } catch (err) {
      console.error('[POST /api/leads] Error:', err);
      res.status(500).json({ error: 'Database write failed' });
    }
  });

  // 3. Protected CRM Endpoints (List, Update Status/Notes, Delete)
  app.get('/api/leads', requireAdminAuth, async (_req: Request, res: Response) => {
    try {
      if (pgPool) {
        const result = await pgPool.query(
          'SELECT * FROM leads ORDER BY created_at DESC LIMIT 1000'
        );
        res.json({ leads: result.rows.map((r) => mapPgRowToLead(r as Record<string, unknown>)) });
        return;
      }

      const rows = await readLocalLeads();
      rows.sort((a, b) => b.createdAtMillis - a.createdAtMillis);
      res.json({ leads: rows });
    } catch (err) {
      console.error('[GET /api/leads] Error:', err);
      res.status(500).json({ error: 'Failed to load leads' });
    }
  });

  app.patch('/api/leads/:id', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const id = cleanText(req.params.id, 64);
      if (!ID_REGEX.test(id)) {
        res.status(400).json({ error: 'Invalid lead id' });
        return;
      }

      const hasStatus = typeof req.body?.status === 'string';
      const hasNotes = typeof req.body?.notes === 'string';

      if (hasStatus && !VALID_STATUSES.has(req.body.status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const nextStatus = hasStatus
        ? (req.body.status as StoredLeadRow['status'])
        : undefined;
      const nextNotes = hasNotes ? cleanText(req.body.notes, 500) : undefined;

      if (pgPool) {
        const currentRes = await pgPool.query('SELECT * FROM leads WHERE id = $1', [id]);
        if (currentRes.rowCount === 0) {
          res.status(404).json({ error: 'Lead not found' });
          return;
        }
        const curr = currentRes.rows[0] as Record<string, unknown>;
        const updatedRes = await pgPool.query(
          `UPDATE leads
           SET status = $1, notes = $2, updated_at = NOW()
           WHERE id = $3
           RETURNING *`,
          [nextStatus ?? curr.status, nextNotes ?? curr.notes, id]
        );
        res.json({ lead: mapPgRowToLead(updatedRes.rows[0] as Record<string, unknown>) });
        return;
      }

      const rows = await readLocalLeads();
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      rows[idx] = {
        ...rows[idx],
        status: nextStatus ?? rows[idx].status,
        notes: nextNotes ?? rows[idx].notes,
        updatedAtMillis: Date.now(),
      };
      await writeLocalLeads(rows);
      res.json({ lead: rows[idx] });
    } catch (err) {
      console.error('[PATCH /api/leads/:id] Error:', err);
      res.status(500).json({ error: 'Failed to update lead' });
    }
  });

  app.delete('/api/leads/:id', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const id = cleanText(req.params.id, 64);
      if (!ID_REGEX.test(id)) {
        res.status(400).json({ error: 'Invalid lead id' });
        return;
      }

      if (pgPool) {
        await pgPool.query('DELETE FROM leads WHERE id = $1', [id]);
        res.json({ deleted: true });
        return;
      }

      const rows = await readLocalLeads();
      const filtered = rows.filter((r) => r.id !== id);
      await writeLocalLeads(filtered);
      res.json({ deleted: true });
    } catch (err) {
      console.error('[DELETE /api/leads/:id] Error:', err);
      res.status(500).json({ error: 'Failed to delete lead' });
    }
  });

  // 4. Static Production Bundle OR Vite Dev Middleware
  const isProduction =
    process.env.NODE_ENV === 'production' || Boolean(process.env.K_SERVICE);
  const distDir = path.join(__dirname, 'dist');

  if (isProduction && fsSync.existsSync(path.join(distDir, 'index.html'))) {
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`[SATosphere] Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
