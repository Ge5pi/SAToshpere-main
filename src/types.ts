export type Locale = 'ru' | 'kz';

export type GradeLevel = '9' | '10' | '11';

export type ActivePlanId = 'diagnostic' | 'per_lesson' | 'course_1m' | 'course_2m';

export type LegacyPlanId = 'standard_group' | 'intensive_pro' | 'individual_vip';

export type PlanId = ActivePlanId | LegacyPlanId;

export type PaymentMode = 'package_total' | 'per_lesson_view' | 'full_3m' | 'monthly';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'diagnostic_scheduled'
  | 'enrolled'
  | 'archived';

export interface UtmParams {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export interface LeadRecord {
  id: string;
  studentName: string;
  phone: string;
  grade: GradeLevel;
  selectedPlan: PlanId;
  paymentMode: PaymentMode;
  locale: Locale;
  status: LeadStatus;
  notes: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  createdAtMillis: number;
  updatedAtMillis: number;
}

export interface UniversityDestination {
  id: string;
  regionLabel: string;
  universities: string;
  minCompetitiveScore: number;
  fullGrantScore: number;
  recommendedGrade: string;
  note: string;
}

export interface StudentCase {
  name: string;
  cityAndSchool: string;
  grade: string;
  scoreBefore: number;
  scoreAfter: number;
  mathScore: number;
  rwScore: number;
  duration: string;
  admittedTo: string;
  quote: string;
}

export interface TariffCardData {
  id: Exclude<ActivePlanId, 'diagnostic'>;
  name: string;
  subtitle: string;
  formatLine: string;
  lessonsCount: number;
  packagePrice: number;
  oldPackagePrice?: number;
  savingsBadge?: string;
  perLessonPrice: number;
  oldPerLessonPrice?: number;
  packageUnitLabel: string;
  scheduleSummary: string;
  targetScore: string;
  isFeatured?: boolean;
  highlights: string[];
  ctaLabel: string;
}

export interface ComparisonRow {
  feature: string;
  isDifference: boolean;
  perLesson: string;
  course1m: string;
  course2m: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
