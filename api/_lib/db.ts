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

function createPgPool(): pg.Pool {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
  const sslMode = (process.env.PGSSLMODE ?? '').trim().toLowerCase();

  const needsSsl =
    sslMode === 'require' ||
    databaseUrl.includes('sslmode=require') ||
    databaseUrl.includes('neon.tech') ||
    databaseUrl.includes('supabase.co') ||
    databaseUrl.includes('render.com') ||
    databaseUrl.includes('aivencloud.com');

  return new Pool({
    connectionString: databaseUrl,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 5000,
  });
}

// Singleton pool reused across warm function invocations
let _pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!_pool) {
    _pool = createPgPool();
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
