import type { VercelRequest, VercelResponse } from '../_lib/types.js';
import { getPool } from '../_lib/db.js';

export default async function handler(_req: VercelRequest, res: VercelResponse): Promise<void> {
  const checks: Record<string, string> = {};

  checks.DATABASE_URL = process.env.DATABASE_URL
    ? `set (starts with: ${process.env.DATABASE_URL.slice(0, 20)}...)`
    : 'NOT SET';
  checks.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ? 'set' : 'NOT SET';
  checks.NODE_VERSION = process.version;

  try {
    const pool = getPool();
    const result = await pool.query('SELECT NOW() as now');
    checks.db = `connected — server time: ${result.rows[0].now}`;
    res.json({ status: 'ok', checks });
  } catch (err: any) {
    checks.db = `FAILED: ${err?.message ?? String(err)}`;
    res.status(500).json({ status: 'error', checks });
  }
}
