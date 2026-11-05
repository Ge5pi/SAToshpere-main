import { ActivePlanId, GradeLevel, Locale, PaymentMode, PlanId, UtmParams } from '../types';

/**
 * Validation constraints synchronized with sql/001_init_schema.sql PostgreSQL CHECK constraints
 */
export const LEAD_CONSTRAINTS = {
  NAME_MIN: 2,
  NAME_MAX: 80,
  PHONE_REGEX: /^\+7[0-9]{10}$/,
  NOTES_MAX: 500,
  UTM_SOURCE_MAX: 64,
  UTM_MEDIUM_MAX: 64,
  UTM_CAMPAIGN_MAX: 96,
  ID_REGEX: /^[a-zA-Z0-9_-]+$/,
} as const;

export const ACTIVE_PLANS: ActivePlanId[] = [
  'diagnostic',
  'per_lesson',
  'course_1m',
  'course_2m',
];

/**
 * Formats user typing into a clean Kazakhstan phone mask: +7 (7XX) XXX-XX-XX
 */
export function formatKzPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (!digits) return '+7 ';

  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  } else if (!digits.startsWith('7')) {
    digits = '7' + digits;
  }

  digits = digits.slice(0, 11);
  const local = digits.slice(1);

  if (local.length === 0) return '+7 ';
  if (local.length <= 3) return `+7 (${local}`;
  if (local.length <= 6) return `+7 (${local.slice(0, 3)}) ${local.slice(3)}`;
  if (local.length <= 8) {
    return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8, 10)}`;
}

/**
 * Normalizes formatted phone string into strict E.164 (+7XXXXXXXXXX) matching PostgreSQL CHECK
 */
export function normalizeKzPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('8') && digits.length === 11) {
    digits = '7' + digits.slice(1);
  }
  if (digits.length === 10) {
    digits = '7' + digits;
  }
  return `+${digits}`;
}

export function isValidKzPhone(input: string): boolean {
  const normalized = normalizeKzPhone(input);
  return LEAD_CONSTRAINTS.PHONE_REGEX.test(normalized);
}

export function sanitizeText(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

export function generateSafeLeadId(): string {
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/[^a-zA-Z0-9_-]/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  const id = `lead_${randomPart}`.slice(0, 64);
  if (!LEAD_CONSTRAINTS.ID_REGEX.test(id)) {
    return `lead_${Date.now()}`;
  }
  return id;
}

export function sanitizeLeadCreateInput(params: {
  studentName: string;
  phone: string;
  grade: GradeLevel;
  selectedPlan: PlanId;
  paymentMode: PaymentMode;
  locale: Locale;
  utm: UtmParams;
  promoCode?: string;
}) {
  const cleanName = sanitizeText(params.studentName, LEAD_CONSTRAINTS.NAME_MAX);
  const cleanPhone = normalizeKzPhone(params.phone);
  const validGrades: GradeLevel[] = ['9', '10', '11'];
  const validPlans: PlanId[] = [
    'diagnostic',
    'per_lesson',
    'course_1m',
    'course_2m',
    'standard_group',
    'intensive_pro',
    'individual_vip',
  ];
  const validPayments: PaymentMode[] = [
    'package_total',
    'per_lesson_view',
    'full_3m',
    'monthly',
  ];
  const validLocales: Locale[] = ['ru', 'kz'];

  return {
    studentName: cleanName,
    phone: cleanPhone,
    grade: validGrades.includes(params.grade) ? params.grade : '10',
    selectedPlan: validPlans.includes(params.selectedPlan) ? params.selectedPlan : 'diagnostic',
    paymentMode: validPayments.includes(params.paymentMode)
      ? params.paymentMode
      : 'package_total',
    locale: validLocales.includes(params.locale) ? params.locale : 'ru',
    utmSource: sanitizeText(params.utm.utmSource || 'direct', LEAD_CONSTRAINTS.UTM_SOURCE_MAX),
    utmMedium: sanitizeText(params.utm.utmMedium || 'none', LEAD_CONSTRAINTS.UTM_MEDIUM_MAX),
    utmCampaign: sanitizeText(
      params.utm.utmCampaign || 'satosphere_landing',
      LEAD_CONSTRAINTS.UTM_CAMPAIGN_MAX
    ),
    promoCode: sanitizeText(params.promoCode || '', 32),
  };
}

export function formatKzt(amount: number): string {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₸`;
}
