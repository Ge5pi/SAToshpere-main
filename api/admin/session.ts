import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from '../_lib/auth.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const authHeader = (req.headers.authorization as string) ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({ authenticated: true });
}
