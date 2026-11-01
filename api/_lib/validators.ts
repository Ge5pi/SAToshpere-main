export const VALID_GRADES = new Set(['9', '10', '11']);
export const VALID_PLANS = new Set([
  'diagnostic',
  'per_lesson',
  'course_1m',
  'course_2m',
  'standard_group',
  'intensive_pro',
  'individual_vip',
]);
export const VALID_PAYMENT_MODES = new Set([
  'package_total',
  'per_lesson_view',
  'full_3m',
  'monthly',
]);
export const VALID_LOCALES = new Set(['ru', 'kz']);
export const VALID_STATUSES = new Set([
  'new',
  'contacted',
  'diagnostic_scheduled',
  'enrolled',
  'archived',
]);
export const PHONE_REGEX = /^\+7[0-9]{10}$/;
export const ID_REGEX = /^[a-zA-Z0-9_-]{4,64}$/;

export function cleanText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

export function normalizePhone(raw: unknown): string {
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
