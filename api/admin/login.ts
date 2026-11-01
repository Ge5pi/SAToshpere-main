import crypto from 'node:crypto';
import type { VercelRequest, VercelResponse } from '../_lib/types.js';
import { getAdminPassword, signAdminToken } from '../_lib/auth.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

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
}
