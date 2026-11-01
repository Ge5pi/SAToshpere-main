import type { VercelRequest, VercelResponse } from '../_lib/types.js';
import { getPool, mapPgRowToLead } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { cleanText, VALID_STATUSES, ID_REGEX } from '../_lib/validators.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Auth check for all routes
  const authHeader = (req.headers.authorization as string) ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const id = cleanText(req.query.id as string, 64);
  if (!ID_REGEX.test(id)) {
    res.status(400).json({ error: 'Invalid lead id' });
    return;
  }

  const pool = getPool();

  // PATCH /api/leads/:id — update status/notes
  if (req.method === 'PATCH') {
    try {
      const hasStatus = typeof req.body?.status === 'string';
      const hasNotes = typeof req.body?.notes === 'string';

      if (hasStatus && !VALID_STATUSES.has(req.body.status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const nextStatus = hasStatus ? req.body.status : undefined;
      const nextNotes = hasNotes ? cleanText(req.body.notes, 500) : undefined;

      const currentRes = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
      if (currentRes.rowCount === 0) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      const curr = currentRes.rows[0] as Record<string, unknown>;

      const updatedRes = await pool.query(
        `UPDATE leads
         SET status = $1, notes = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [nextStatus ?? curr.status, nextNotes ?? curr.notes, id]
      );
      res.json({ lead: mapPgRowToLead(updatedRes.rows[0] as Record<string, unknown>) });
    } catch (err) {
      console.error('[PATCH /api/leads/:id] Error:', err);
      res.status(500).json({ error: 'Failed to update lead' });
    }
    return;
  }

  // DELETE /api/leads/:id
  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM leads WHERE id = $1', [id]);
      res.json({ deleted: true });
    } catch (err) {
      console.error('[DELETE /api/leads/:id] Error:', err);
      res.status(500).json({ error: 'Failed to delete lead' });
    }
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
