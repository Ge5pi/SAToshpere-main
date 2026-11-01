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
    // Parse URL manually instead of passing connectionString — this prevents
    // pg-connection-string from overriding our ssl config with sslmode from the URL.
    // (sslmode=require/prefer in the URL sets rejectUnauthorized:true, defeating our fix)
    let parsed = { host: '', port: 5432, database: '', user: '', password: '', isLocalhost: false };
    try {
      const u = new URL(databaseUrl);
      parsed.host = u.hostname;
      parsed.port = u.port ? parseInt(u.port, 10) : 5432;
      parsed.database = u.pathname.replace(/^\//, '');
      parsed.user = decodeURIComponent(u.username);
      parsed.password = decodeURIComponent(u.password);
      parsed.isLocalhost =
        u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '::1';
    } catch (parseErr) {
      console.error('[DB] Failed to parse DATABASE_URL:', parseErr);
      // Fall back to connectionString if URL parsing fails
      return new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false }, max: 5 });
    }

    // Always enable SSL with rejectUnauthorized:false for remote hosts.
    // We pass ssl as a separate object (NOT via connectionString) so pg-connection-string
    // cannot override it with the URL's sslmode param.
    const sslConfig = parsed.isLocalhost ? undefined : { rejectUnauthorized: false };

    console.log(
      `[DB] Connecting via parsed DATABASE_URL (host=${parsed.host}, port=${parsed.port}, db=${parsed.database}, ssl=${!parsed.isLocalhost})`
    );

    return new Pool({
      host: parsed.host,
      port: parsed.port,
      database: parsed.database,
      user: parsed.user,
      password: parsed.password,
      ssl: sslConfig,
      max: 5,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 5000,
    });
  }

  // --- Option 2: Individual PG* env vars ---
  if (pgHost && !isPlaceholder(pgHost)) {
    const isLocalhost = pgHost === 'localhost' || pgHost === '127.0.0.1' || pgHost === '::1';
    const sslConfig = isLocalhost
      ? undefined
      : { rejectUnauthorized: false };
    const port = Number(process.env.PGPORT || 5432);
    console.log(
      `[DB] Connecting via PGHOST=${pgHost}, PGDATABASE=${process.env.PGDATABASE ?? 'satosphere'}, ssl=${!isLocalhost}`
    );
    return new Pool({
      host: pgHost,
      port: Number.isFinite(port) ? port : 5432,
      database: process.env.PGDATABASE?.trim() || 'satosphere',
      user: process.env.PGUSER?.trim() || 'postgres',
      password: process.env.PGPASSWORD ?? '',
      ssl: sslConfig,
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
