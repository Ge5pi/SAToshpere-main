import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PROMO } from '../config';
import { LandingPricing } from '../i18n/landing';
import { formatKzt } from '../lib/validation';
import { PaymentMode, PlanId } from '../types';
import { Reveal } from './Reveal';

interface PricingComparisonProps {
  copy: LandingPricing;
  promoActive: boolean;
  paymentMode: PaymentMode;
  onPaymentModeChange: (mode: PaymentMode) => void;
  onSelectPlan: (planId: PlanId, mode: PaymentMode) => void;
}

const salePrice = (value: number): number =>
  Math.round((value * (100 - PROMO.discountPercent)) / 100);

export const PricingComparison: React.FC<PricingComparisonProps> = ({
  copy,
  promoActive,
  paymentMode,
  onPaymentModeChange,
  onSelectPlan,
}) => {
  const isPerLessonView = paymentMode === 'per_lesson_view';

  return (
    <section
      id="pricing"
      className="overflow-x-clip border-t border-[#D3E3FC] bg-[#FFFFFF] py-10 sm:py-12"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-xl min-w-0">
              <p className="text-xs font-semibold text-[#00887A]">{copy.kicker}</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                {copy.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted sm:text-base">
                {copy.subtitle}
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-1 rounded-lg bg-[#D3E3FC]/70 p-1 sm:inline-flex sm:w-auto">
              <button
                type="button"
                onClick={() => onPaymentModeChange('package_total')}
                className={`min-w-0 truncate rounded-md px-3 py-2 text-[11px] font-semibold transition-all sm:px-4 sm:text-xs ${
                  !isPerLessonView
                    ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                    : 'text-brand-muted hover:text-brand-ink'
                }`}
              >
                {copy.packageLabel}
              </button>
              <button
                type="button"
                onClick={() => onPaymentModeChange('per_lesson_view')}
                className={`min-w-0 truncate rounded-md px-3 py-2 text-[11px] font-semibold transition-all sm:px-4 sm:text-xs ${
                  isPerLessonView
                    ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                    : 'text-brand-muted hover:text-brand-ink'
                }`}
              >
                {copy.perLessonLabel}
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 lg:grid-cols-3 lg:items-stretch">
          {copy.tariffs.map((tariff, idx) => {
            const base = isPerLessonView ? tariff.perLessonPrice : tariff.price;
            const displayed = promoActive ? salePrice(base) : base;
            const crossed = promoActive
              ? base
              : isPerLessonView
                ? tariff.oldPerLessonPrice
                : tariff.oldPrice;
            const showInstallment = !isPerLessonView && displayed >= 40_000;
            const installment = Math.round(displayed / 4);

            return (
              <Reveal key={tariff.id} delay={idx * 0.06} className="flex min-w-0">
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex w-full min-w-0 flex-col justify-between rounded-2xl p-5 transition-colors sm:p-6 ${
                    tariff.featured
                      ? 'border-2 border-[#00887A] bg-[#D3E3FC]/35 shadow-[0_16px_40px_-24px_rgba(0,136,122,0.55)]'
                      : 'border border-[#D3E3FC] bg-[#FFFFFF] hover:border-[#77A6F7]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] font-medium text-brand-muted">{tariff.tag}</p>
                      {promoActive ? (
                        <span className="shrink-0 rounded-full bg-[#FFCCBC] px-2 py-0.5 text-[10px] font-bold text-[#0D2628]">
                          {copy.promoBadge}
                        </span>
                      ) : tariff.featured ? (
                        <span className="shrink-0 rounded-full bg-[#00887A] px-2 py-0.5 text-[10px] font-bold text-white">
                          {copy.featuredLabel}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-brand-ink">
                      {tariff.name}
                    </h3>

                    <div className="mt-4 border-t border-[#D3E3FC] pt-4">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={`${isPerLessonView ? 'lesson' : 'package'}-${promoActive ? 'promo' : 'base'}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-brand-ink sm:text-3xl">
                              {formatKzt(displayed)}
                            </span>
                            {crossed && (
                              <span className="font-mono text-sm line-through tabular-nums text-brand-muted/80">
                                {formatKzt(crossed)}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-brand-muted">
                            {isPerLessonView ? copy.perLessonUnit : tariff.unit}
                          </p>
                          {showInstallment && (
                            <p className="mt-2 inline-flex rounded-md bg-[#D3E3FC]/50 px-2 py-1 text-[11px] font-semibold text-brand-ink">
                              {copy.installmentPrefix} {formatKzt(installment)}
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <p className="mt-4 text-[11px] font-medium text-brand-muted">
                      <span className="text-[#00887A]">{copy.targetLabel}</span> {tariff.target}
                    </p>

                    <ul className="mt-3 space-y-2 text-[13px] leading-snug text-brand-ink">
                      {tariff.points.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00887A]"
                            aria-hidden="true"
                          />
                          <span className="min-w-0">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectPlan(tariff.id, isPerLessonView ? 'per_lesson_view' : 'package_total')
                    }
                    className={`mt-6 flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] sm:text-sm ${
                      tariff.featured
                        ? 'bg-[#00887A] text-white hover:bg-[#006E63]'
                        : 'border border-[#77A6F7] bg-[#D3E3FC]/55 text-brand-ink hover:bg-[#77A6F7]/30'
                    }`}
                  >
                    <span className="truncate">{tariff.cta}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </motion.article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#FFCCBC] bg-[#FFCCBC]/40 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-brand-ink sm:text-lg">
                {copy.diagnosticTitle}
              </h3>
              <p className="mt-1 text-sm text-brand-muted">{copy.diagnosticText}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectPlan('diagnostic', 'package_total')}
              className="h-11 w-full shrink-0 rounded-lg bg-[#00887A] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#006E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] focus-visible:ring-offset-2 sm:w-auto sm:text-sm"
            >
              {copy.diagnosticCta}
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-7 hidden md:block">
            <h3 className="font-display text-lg font-bold tracking-tight text-brand-ink">
              {copy.comparisonTitle}
            </h3>

            <div className="mt-4 w-full max-w-full min-w-0 overflow-x-auto rounded-xl border border-[#D3E3FC] bg-white">
              <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#D3E3FC] bg-[#D3E3FC]/40 text-[11px] font-semibold text-brand-muted">
                    <th className="w-2/5 px-4 py-3"> </th>
                    <th className="w-1/5 px-4 py-3">{copy.tariffs[0].name}</th>
                    <th className="w-1/5 bg-[#D3E3FC]/60 px-4 py-3 font-bold text-[#00887A]">
                      {copy.tariffs[1].name}
                    </th>
                    <th className="w-1/5 px-4 py-3">{copy.tariffs[2].name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3E3FC]">
                  {copy.comparison.map((row) => (
                    <tr key={row.label} className="transition-colors hover:bg-[#D3E3FC]/20">
                      <td className="px-4 py-3 font-medium text-brand-ink">{row.label}</td>
                      <td className="px-4 py-3 text-brand-muted">{row.perLesson}</td>
                      <td className="bg-[#D3E3FC]/25 px-4 py-3 font-semibold text-brand-ink">
                        {row.course2m}
                      </td>
                      <td className="px-4 py-3 text-brand-ink">{row.course1m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
