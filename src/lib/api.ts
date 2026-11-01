import { GradeLevel, LeadRecord, LeadStatus, Locale, PaymentMode, PlanId } from '../types';

const ADMIN_TOKEN_STORAGE_KEY = 'satosphere_admin_token';

export function getStoredAdminToken(): string {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setStoredAdminToken(token: string): void {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage error
  }
}

export async function createLeadRequest(payload: {
  id: string;
  studentName: string;
  phone: string;
  grade: GradeLevel;
  selectedPlan: PlanId;
  paymentMode: PaymentMode;
  locale: Locale;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}): Promise<LeadRecord> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  const data = (await res.json()) as { lead: LeadRecord };
  return data.lead;
}

export async function loginAdminRequest(password: string): Promise<string> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    throw new Error('INVALID_PASSWORD');
  }

  const data = (await res.json()) as { token: string };
  return data.token;
}

export async function verifyAdminSessionRequest(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchLeadsRequest(token: string): Promise<LeadRecord[]> {
  const res = await fetch('/api/leads', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error('FETCH_FAILED');
  }

  const data = (await res.json()) as { leads: LeadRecord[] };
  return data.leads;
}

export async function updateLeadRequest(
  token: string,
  leadId: string,
  patch: { status?: LeadStatus; notes?: string }
): Promise<LeadRecord> {
  const res = await fetch(`/api/leads/${encodeURIComponent(leadId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error('UPDATE_FAILED');
  }

  const data = (await res.json()) as { lead: LeadRecord };
  return data.lead;
}

export async function deleteLeadRequest(token: string, leadId: string): Promise<void> {
  const res = await fetch(`/api/leads/${encodeURIComponent(leadId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error('DELETE_FAILED');
  }
}
