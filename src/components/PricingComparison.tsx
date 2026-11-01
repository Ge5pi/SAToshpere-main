import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { TranslationContent } from '../i18n/translations';
import { formatKzt } from '../lib/validation';
import { PaymentMode, PlanId } from '../types';
import { Reveal } from './Reveal';

interface PricingComparisonProps {
  copy: TranslationContent;
  paymentMode: PaymentMode;
  onPaymentModeChange: (mode: PaymentMode) => void;
  onSelectPlan: (planId: PlanId, mode: PaymentMode) => void;
}

export const PricingComparison: React.FC<PricingComparisonProps> = ({
  copy,
  paymentMode,
  onPaymentModeChange,
  onSelectPlan,
}) => {
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  const isPerLessonView = paymentMode === 'per_lesson_view';
  const visibleRows = onlyDifferences
    ? copy.pricing.rows.filter((r) => r.isDifference)
    : copy.pricing.rows;

  return (
    <section
      id="pricing"
      className="overflow-x-clip border-t border-[#D3E3FC] bg-[#FFFFFF] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl min-w-0">
              <p className="text-xs font-semibold text-[#00887A]">{copy.pricing.kicker}</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-4xl [text-wrap:balance]">
                {copy.pricing.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-brand-muted">
                {copy.pricing.subtitle}
              </p>
            </div>

            {/* Interactive Price Calculation Mode Switcher — Responsive Grid on Mobile */}
            <div className="grid w-full grid-cols-2 gap-1 rounded-lg bg-[#D3E3FC]/70 p-1 sm:inline-flex sm:w-auto lg:self-auto">
              <button
                type="button"
                onClick={() => onPaymentModeChange('package_total')}
                className={`min-w-0 truncate rounded-md px-2.5 py-2 text-[11px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] sm:px-4 sm:text-xs ${
                  !isPerLessonView
                    ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                    : 'text-brand-muted hover:text-brand-ink'
                }`}
              >
                {copy.pricing.modePackageTotal}
              </button>
              <button
                type="button"
                onClick={() => onPaymentModeChange('per_lesson_view')}
                className={`min-w-0 truncate rounded-md px-2.5 py-2 text-[11px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] sm:px-4 sm:text-xs ${
                  isPerLessonView
                    ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                    : 'text-brand-muted hover:text-brand-ink'
                }`}
              >
                {copy.pricing.modePerLesson}
              </button>
            </div>
          </div>
        </Reveal>

        {/* 1-on-1 Individual Tariff Cards — 2-Month Course Centered in Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 lg:grid-cols-3 lg:items-stretch">
          {copy.pricing.tariffs.map((tariff, idx) => {
            const displayedPrice = isPerLessonView
              ? tariff.perLessonPrice
              : tariff.packagePrice;
            const crossedOutPrice = isPerLessonView
              ? tariff.oldPerLessonPrice
              : tariff.oldPackagePrice;

            return (
              <Reveal key={tariff.id} delay={idx * 0.08} className="flex min-w-0">
                <motion.article
                  whileHover={{ y: tariff.isFeatured ? -10 : -4 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex w-full min-w-0 flex-col justify-between rounded-xl p-5 transition-colors sm:p-7 ${
                    tariff.isFeatured
                      ? 'border-2 border-[#00887A] bg-[#D3E3FC]/40 text-brand-ink lg:-translate-y-2'
                      : 'border border-[#D3E3FC] bg-[#FFFFFF] text-brand-ink hover:border-[#77A6F7]'
                  }`}
                >
                  <div className="min-w-0">
                    {tariff.isFeatured ? (
                      <p className="text-xs font-bold tracking-wide text-[#00887A]">
                        {copy.pricing.featuredLabel}
                      </p>
                    ) : (
                      <p className="text-xs font-medium text-brand-muted">{tariff.formatLine}</p>
                    )}

                    <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-brand-ink">
                      {tariff.name}
                    </h3>

                    {tariff.isFeatured && (
                      <p className="mt-1 text-xs font-medium text-brand-muted">
                        {tariff.formatLine}
                      </p>
                    )}

                    <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                      {tariff.subtitle}
                    </p>

                    {/* Price Block with Smooth Value Crossfade */}
                    <div
                      className={`mt-6 border-t pt-6 ${
                        tariff.isFeatured ? 'border-[#77A6F7]/50' : 'border-[#D3E3FC]'
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={isPerLessonView ? 'per-lesson' : 'package'}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="flex flex-wrap items-baseline gap-2.5">
                            <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-brand-ink sm:text-3xl">
                              {formatKzt(displayedPrice)}
                            </span>
                            {crossedOutPrice && (
                              <span className="font-mono text-sm line-through tabular-nums text-brand-muted/70">
                                {formatKzt(crossedOutPrice)}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-brand-muted">
                            {isPerLessonView
                              ? copy.pricing.perLessonSuffix
                              : tariff.packageUnitLabel}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Schedule & Target */}
                    <div
                      className={`mt-6 border-t pt-5 text-xs ${
                        tariff.isFeatured ? 'border-[#77A6F7]/50' : 'border-[#D3E3FC]'
                      }`}
                    >
                      <p className="font-semibold text-brand-ink">{tariff.scheduleSummary}</p>
                      <p className="mt-1.5 font-mono font-medium tabular-nums text-[#00887A]">
                        {copy.pricing.targetLabel} {tariff.targetScore}
                      </p>
                    </div>

                    {/* Feature List */}
                    <ul className="mt-5 space-y-2.5 text-sm leading-snug text-brand-ink">
                      {tariff.highlights.map((item, highlightIdx) => (
                        <li key={highlightIdx} className="flex items-start gap-2.5">
                          <span aria-hidden="true" className="shrink-0 font-semibold text-[#00887A]">
                            —
                          </span>
                          <span className="min-w-0">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2">
                    <motion.button
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.12 }}
                      type="button"
                      onClick={() =>
                        onSelectPlan(
                          tariff.id,
                          isPerLessonView ? 'per_lesson_view' : 'package_total'
                        )
                      }
                      className={`flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-lg px-3.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] sm:px-4 sm:text-sm ${
                        tariff.isFeatured
                          ? 'bg-[#00887A] text-[#FFFFFF] hover:bg-brand-teal-hover'
                          : 'border border-[#77A6F7] bg-[#D3E3FC]/65 text-brand-ink hover:bg-[#77A6F7]/35'
                      }`}
                    >
                      <span className="truncate">{tariff.ctaLabel}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </motion.button>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>

        {/* Free Entry Diagnostic Callout Strip in Warm Peach (#FFCCBC) */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-stretch justify-between gap-5 rounded-xl border border-[#FFCCBC] bg-[#FFCCBC]/45 p-5 sm:p-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl min-w-0">
              <h3 className="font-display text-lg font-bold text-brand-ink">
                {copy.pricing.diagnosticBannerTitle}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-brand-muted">
                {copy.pricing.diagnosticBannerDesc}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.12 }}
              type="button"
              onClick={() =>
                onSelectPlan(
                  'diagnostic',
                  isPerLessonView ? 'per_lesson_view' : 'package_total'
                )
              }
              className="h-11 w-full min-w-0 truncate rounded-lg bg-[#00887A] px-4 text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-brand-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] focus-visible:ring-offset-2 sm:w-auto sm:px-5 sm:text-sm"
            >
              {copy.pricing.diagnosticBannerCta}
            </motion.button>
          </div>
        </Reveal>

        {/* Detailed 1-on-1 Package Comparison Matrix — Contained Horizontal Scroll on Mobile */}
        <Reveal delay={0.12}>
          <div className="mt-14 min-w-0 sm:mt-16">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h3 className="font-display text-xl font-bold tracking-tight text-brand-ink">
                {copy.pricing.matrixTitle}
              </h3>

              <div className="grid w-full grid-cols-2 gap-1 rounded-lg bg-[#D3E3FC]/70 p-1 sm:inline-flex sm:w-auto">
                <button
                  type="button"
                  onClick={() => setOnlyDifferences(false)}
                  className={`min-w-0 truncate rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors sm:px-3.5 sm:text-xs ${
                    !onlyDifferences
                      ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                      : 'text-brand-muted hover:text-brand-ink'
                  }`}
                >
                  {copy.pricing.filterAll}
                </button>
                <button
                  type="button"
                  onClick={() => setOnlyDifferences(true)}
                  className={`min-w-0 truncate rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors sm:px-3.5 sm:text-xs ${
                    onlyDifferences
                      ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                      : 'text-brand-muted hover:text-brand-ink'
                  }`}
                >
                  {copy.pricing.filterDiffs}
                </button>
              </div>
            </div>

            <div className="mt-6 w-full max-w-full min-w-0 overflow-x-auto rounded-xl border border-[#D3E3FC] bg-[#FFFFFF]">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#D3E3FC] bg-[#D3E3FC]/45 text-xs font-semibold text-brand-muted">
                    <th className="w-2/5 px-4 py-4 sm:px-5">{copy.pricing.colParameter}</th>
                    <th className="w-1/5 px-4 py-4 text-brand-ink sm:px-5">
                      {copy.pricing.colPerLesson}
                    </th>
                    <th className="w-1/5 bg-[#D3E3FC]/65 px-4 py-4 font-bold text-[#00887A] sm:px-5">
                      {copy.pricing.colCourse2m}
                    </th>
                    <th className="w-1/5 px-4 py-4 text-brand-ink sm:px-5">
                      {copy.pricing.colCourse1m}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3E3FC] font-sans tabular-nums">
                  {visibleRows.map((row, index) => (
                    <tr key={index} className="transition-colors hover:bg-[#D3E3FC]/20">
                      <td className="px-4 py-4 font-medium text-brand-ink sm:px-5">{row.feature}</td>
                      <td className="px-4 py-4 text-brand-muted sm:px-5">{row.perLesson}</td>
                      <td className="bg-[#D3E3FC]/30 px-4 py-4 font-semibold text-brand-ink sm:px-5">
                        {row.course2m}
                      </td>
                      <td className="px-4 py-4 text-brand-ink sm:px-5">{row.course1m}</td>
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
