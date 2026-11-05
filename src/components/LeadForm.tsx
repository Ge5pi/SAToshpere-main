import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { TranslationContent } from '../i18n/translations';
import { createLeadRequest } from '../lib/api';
import { track, trackAdsConversion } from '../lib/analytics';
import {
  formatKzPhoneInput,
  formatKzt,
  generateSafeLeadId,
  isValidKzPhone,
  LEAD_CONSTRAINTS,
  sanitizeLeadCreateInput,
  sanitizeText,
} from '../lib/validation';
import { PROMO } from '../config';
import { GradeLevel, Locale, PaymentMode, PlanId, UtmParams } from '../types';

const PLAN_BASE_PRICES: Record<string, number> = {
  diagnostic: 0,
  per_lesson: 10_000,
  course_1m: 110_000,
  course_2m: 210_000,
};

interface LeadFormProps {
  locale: Locale;
  copy: TranslationContent;
  utm: UtmParams;
  defaultPlan?: PlanId;
  defaultPaymentMode?: PaymentMode;
  showPlanSelector?: boolean;
  compact?: boolean;
  onPlanChange?: (plan: PlanId) => void;
  onSuccess?: () => void;
  promo?: { active: boolean; code: string; note: string };
}

export const LeadForm: React.FC<LeadFormProps> = ({
  locale,
  copy,
  utm,
  defaultPlan = 'diagnostic',
  defaultPaymentMode = 'package_total',
  showPlanSelector = false,
  compact = false,
  onPlanChange,
  onSuccess,
  promo,
}) => {
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('+7 ');
  const [grade, setGrade] = useState<GradeLevel>('10');
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(defaultPlan);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setSelectedPlan(defaultPlan);
  }, [defaultPlan]);

  const handleSelectPlan = (plan: PlanId) => {
    setSelectedPlan(plan);
    if (onPlanChange) {
      onPlanChange(plan);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatKzPhoneInput(e.target.value));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = sanitizeText(studentName, LEAD_CONSTRAINTS.NAME_MAX);
    if (trimmedName.length < LEAD_CONSTRAINTS.NAME_MIN) {
      setErrorMsg(copy.form.errorName);
      return;
    }

    if (!isValidKzPhone(phone)) {
      setErrorMsg(copy.form.errorPhone);
      return;
    }

    setSubmitting(true);
    const leadId = generateSafeLeadId();

    try {
      const cleanPayload = sanitizeLeadCreateInput({
        studentName: trimmedName,
        phone,
        grade,
        selectedPlan,
        paymentMode: defaultPaymentMode,
        locale,
        utm,
        promoCode: promo?.active ? promo.code : '',
      });

      await createLeadRequest({
        id: leadId,
        ...cleanPayload,
      });

      track('lead_success', {
        plan: selectedPlan,
        promo: promo?.active ? promo.code : 'none',
        value: selectedPlan === 'diagnostic' ? 0 : 1,
      });
      if (selectedPlan === 'diagnostic') trackAdsConversion();

      setSubmitted(true);
      setStudentName('');
      setPhone('+7 ');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      setErrorMsg(copy.form.errorNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="min-w-0 rounded-xl border border-[#77A6F7]/55 bg-[#D3E3FC]/40 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00887A]" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold text-brand-ink">
              {copy.form.successTitle}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
              {copy.form.successBody}
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 text-xs font-semibold text-[#00887A] underline-offset-4 hover:underline"
            >
              {copy.form.successReset}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const grades: GradeLevel[] = ['9', '10', '11'];

  return (
    <form onSubmit={handleSubmit} noValidate className="min-w-0 space-y-4">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="min-w-0">
          <label className="mb-1.5 block text-xs font-semibold text-brand-ink">
            {copy.form.nameLabel}
          </label>
          <input
            type="text"
            required
            maxLength={LEAD_CONSTRAINTS.NAME_MAX}
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder={copy.form.namePlaceholder}
            className="h-11 w-full min-w-0 rounded-lg border border-[#77A6F7]/55 bg-[#FFFFFF] px-3.5 text-sm text-brand-ink placeholder:text-brand-muted/60 transition-colors focus:border-[#00887A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A]/25"
          />
        </div>

        <div className="min-w-0">
          <label className="mb-1.5 block text-xs font-semibold text-brand-ink">
            {copy.form.phoneLabel}
          </label>
          <input
            type="tel"
            required
            inputMode="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={copy.form.phonePlaceholder}
            className="h-11 w-full min-w-0 rounded-lg border border-[#77A6F7]/55 bg-[#FFFFFF] px-3.5 font-mono text-sm tabular-nums text-brand-ink placeholder:font-sans placeholder:text-brand-muted/60 transition-colors focus:border-[#00887A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A]/25"
          />
        </div>
      </div>

      {/* Dedicated Full-Width Grade Selector */}
      <div className="min-w-0">
        <span className="mb-1.5 block text-xs font-semibold text-brand-ink">
          {copy.form.gradeLabel}
        </span>
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#D3E3FC]/65 p-1">
          {grades.map((g) => {
            const active = grade === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`h-9 min-w-0 truncate rounded-md px-2 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] sm:px-3 ${
                  active
                    ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                    : 'text-brand-muted hover:text-brand-ink'
                }`}
              >
                <span className="font-mono tabular-nums">{g}</span> {copy.form.gradeSuffix}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom 2x2 Interactive Card Selector for Individual Tutoring Format */}
      {showPlanSelector && (
        <div className="min-w-0">
          <span
            id="individual-plan-group-label"
            className="mb-2 block text-xs font-semibold text-brand-ink"
          >
            {copy.form.planLabel}
          </span>
          <div
            role="radiogroup"
            aria-labelledby="individual-plan-group-label"
            className={`grid grid-cols-1 gap-2.5 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}
          >
            {copy.form.planCardOptions.map((opt) => {
              const isSelected = selectedPlan === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectPlan(opt.id)}
                  className={`group flex min-w-0 flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] ${
                    isSelected
                      ? 'border-[#00887A] bg-[#D3E3FC]/45 ring-1 ring-[#00887A]'
                      : 'border-[#D3E3FC] bg-[#FFFFFF] hover:border-[#77A6F7] hover:bg-[#D3E3FC]/20'
                  }`}
                >
                  <div className="flex w-full min-w-0 items-start gap-2">
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? 'border-[#00887A] bg-[#00887A] text-[#FFFFFF]'
                          : 'border-[#77A6F7] bg-[#FFFFFF]'
                      }`}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xs font-bold leading-snug text-brand-ink">
                        {opt.title}
                      </p>
                      <p
                        className={`mt-0.5 font-mono text-xs font-semibold tabular-nums ${
                          isSelected ? 'text-[#00887A]' : 'text-brand-ink'
                        }`}
                      >
                        {(() => {
                          const basePrice = PLAN_BASE_PRICES[opt.id] ?? 0;
                          const hasPromo = Boolean(promo?.active && basePrice > 0);
                          if (!hasPromo) return opt.price;
                          const promoPrice = Math.round(
                            (basePrice * (100 - PROMO.discountPercent)) / 100
                          );
                          return (
                            <>
                              {formatKzt(promoPrice)}
                              <span className="ml-1 text-[11px] font-normal line-through text-brand-muted/80">
                                {formatKzt(basePrice)}
                              </span>
                            </>
                          );
                        })()}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-brand-muted">{opt.meta}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {promo?.active && (
        <div className="flex items-start gap-2 rounded-lg border border-[#FFCCBC] bg-[#FFCCBC]/35 px-3 py-2">
          <Gift className="mt-0.5 h-4 w-4 shrink-0 text-[#00887A]" aria-hidden="true" />
          <p className="text-[11px] font-semibold leading-snug text-brand-ink">{promo.note}</p>
        </div>
      )}

      {errorMsg && (
        <p
          role="alert"
          className="rounded-lg bg-[#FFCCBC]/65 px-3 py-2 text-xs font-semibold text-brand-ink"
        >
          {errorMsg}
        </p>
      )}

      <motion.button
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.12 }}
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-lg bg-[#00887A] px-3.5 text-xs font-semibold text-[#FFFFFF] transition-colors duration-150 hover:bg-brand-teal-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] focus-visible:ring-offset-2 sm:px-5 sm:text-sm"
      >
        <span className="truncate">
          {submitting
            ? copy.form.submitting
            : selectedPlan === 'diagnostic'
              ? copy.form.submitDiagnostic
              : copy.form.submitCourse}
        </span>
        {!submitting && <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
      </motion.button>

      <p className="text-xs leading-normal text-brand-muted">{copy.form.privacyNote}</p>
    </form>
  );
};
