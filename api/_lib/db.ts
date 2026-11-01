import pg from 'pg';
import { VALID_GRADES, VALID_PLANS, VALID_PAYMENT_MODES, VALID_LOCALES, VALID_STATUSES } from './validators.js';

const { Pool } = pg;

export interface StoredLeadRow {
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

function isPlaceholder(val: string): boolean {
  const trimmed = val.trim();
  return !trimmed || trimmed === 'MY_DATABASE_URL' || trimmed.startsWith('CHANGE_ME');
}

function createPgPool(): pg.Pool | null {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
  const pgHost = process.env.PGHOST?.trim() ?? '';
  const sslMode = (process.env.PGSSLMODE ?? '').trim().toLowerCase();

  // --- Option 1: Full connection string ---
  if (
    databaseUrl &&
    !isPlaceholder(databaseUrl) &&
    (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))
  ) {
    const needsSsl =
      sslMode === 'require' ||
      databaseUrl.includes('sslmode=require') ||
      databaseUrl.includes('neon.tech') ||
      databaseUrl.includes('supabase.co') ||
      databaseUrl.includes('render.com') ||
      databaseUrl.includes('aivencloud.com');

    console.log(
      `[DB] Connecting via DATABASE_URL (ssl=${needsSsl}, host=${new URL(databaseUrl).hostname})`
    );

    return new Pool({
      connectionString: databaseUrl,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 5000,
    });
  }

  // --- Option 2: Individual PG* env vars ---
  if (pgHost && !isPlaceholder(pgHost)) {
    const port = Number(process.env.PGPORT || 5432);
    console.log(
      `[DB] Connecting via PGHOST=${pgHost}, PGDATABASE=${process.env.PGDATABASE ?? 'satosphere'}`
    );
    return new Pool({
      host: pgHost,
      port: Number.isFinite(port) ? port : 5432,
      database: process.env.PGDATABASE?.trim() || 'satosphere',
      user: process.env.PGUSER?.trim() || 'postgres',
      password: process.env.PGPASSWORD ?? '',
      ssl: sslMode === 'require' ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 5000,
    });
  }

  // --- Not configured ---
  console.warn(
    '[DB] WARNING: DATABASE_URL and PGHOST are not set or contain placeholder values. ' +
    'Database operations will fail. Set DATABASE_URL in Vercel Environment Variables.'
  );
  return null;
}

// Singleton pool reused across warm function invocations
let _pool: pg.Pool | null = null;
let _poolInitialized = false;

export function getPool(): pg.Pool {
  if (!_poolInitialized) {
    _pool = createPgPool();
    _poolInitialized = true;
  }
  if (!_pool) {
    throw new Error(
      'Database not configured: DATABASE_URL or PGHOST environment variable is missing. ' +
      'Set DATABASE_URL in your Vercel project settings under Settings → Environment Variables.'
    );
  }
  return _pool;
}

export function mapPgRowToLead(row: Record<string, unknown>): StoredLeadRow {
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
