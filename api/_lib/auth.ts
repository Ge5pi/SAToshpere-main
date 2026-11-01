import crypto from 'node:crypto';

export function getAdminPassword(): string {
  const raw = process.env.ADMIN_PASSWORD;
  if (!raw || raw.trim().startsWith('CHANGE_ME') || raw.trim() === '') {
    return 'satosphere2026';
  }
  return raw;
}

export function getSessionSecret(): string {
  const raw = process.env.ADMIN_SESSION_SECRET;
  if (!raw || raw.trim().startsWith('CHANGE_ME') || raw.trim() === '') {
    return 'satosphere-default-hmac-secret-key-2026';
  }
  return raw;
}

export function signAdminToken(): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `admin:${expiresAt}`;
  const sig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}:${sig}`, 'utf-8').toString('base64url');
}

export function verifyAdminToken(token: string | undefined): boolean {
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
