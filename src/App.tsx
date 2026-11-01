import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import heroSatImg from './assets/images/hero_sat_kazakhstan_1792866290534.jpg';
import mentorWorkshopImg from './assets/images/mentor_workshop_session_1792866291396.jpg';
import studentMockImg from './assets/images/student_mock_exam_1792866293514.jpg';
import { AdminCrm } from './components/AdminCrm';
import { EnrollmentModal } from './components/EnrollmentModal';
import { LeadForm } from './components/LeadForm';
import { PricingComparison } from './components/PricingComparison';
import { ResilientImage } from './components/ResilientImage';
import { Reveal, ScrollProgressBar } from './components/Reveal';
import { useSeoAndUtm } from './hooks/useSeoAndUtm';
import { TRANSLATIONS } from './i18n/translations';
import { Locale, PaymentMode, PlanId } from './types';

const LOCALE_STORAGE_KEY = 'satosphere_locale';

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved === 'kz' || saved === 'ru') return saved;
    } catch {
      // Ignore storage error
    }
    return 'ru';
  });

  const [view, setView] = useState<'landing' | 'crm'>(() =>
    typeof window !== 'undefined' && window.location.hash === '#crm' ? 'crm' : 'landing'
  );

  const [paymentMode, setPaymentMode] = useState<PaymentMode>('package_total');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState<PlanId>('diagnostic');
  const [activeDestId, setActiveDestId] = useState<string>('nu');
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  const copy = TRANSLATIONS[locale];
  const utm = useSeoAndUtm(locale, copy);

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage error
    }
  }, [locale]);

  const openModal = (plan: PlanId, mode?: PaymentMode) => {
    setModalPlan(plan);
    if (mode) setPaymentMode(mode);
    setModalOpen(true);
  };

  const switchToCrm = () => {
    setView('crm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToLanding = () => {
    if (window.location.hash === '#crm') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setView('landing');
  };

  if (view === 'crm') {
    return <AdminCrm copy={copy} onBackToSite={switchToLanding} />;
  }

  const activeDestination =
    copy.results.destinations.find((d) => d.id === activeDestId) ??
    copy.results.destinations[0];

  return (
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-[#FFFFFF] text-brand-ink">
      {/* Smooth Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Strict 3-Zone Top Bar Contract (64px height <= 15% mobile viewport) */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#D3E3FC] bg-[#FFFFFF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:gap-8 sm:px-6">
          {/* Zone 1: Single text element brand wordmark */}
          <a
            href="#top"
            className="font-display text-lg font-extrabold tracking-tight text-[#00887A] transition-colors hover:text-brand-teal-hover whitespace-nowrap shrink-0"
          >
            {copy.nav.brand}
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 text-sm font-medium text-brand-muted md:flex"
          >
            <a
              href="#program"
              className="decoration-[#77A6F7] decoration-2 underline-offset-4 transition-colors hover:text-brand-ink hover:underline whitespace-nowrap shrink-0"
            >
              {copy.nav.program}
            </a>
            <a
              href="#results"
              className="decoration-[#77A6F7] decoration-2 underline-offset-4 transition-colors hover:text-brand-ink hover:underline whitespace-nowrap shrink-0"
            >
              {copy.nav.results}
            </a>
            <a
              href="#pricing"
              className="decoration-[#77A6F7] decoration-2 underline-offset-4 transition-colors hover:text-brand-ink hover:underline whitespace-nowrap shrink-0"
            >
              {copy.nav.pricing}
            </a>
            <a
              href="#faq"
              className="decoration-[#77A6F7] decoration-2 underline-offset-4 transition-colors hover:text-brand-ink hover:underline whitespace-nowrap shrink-0"
            >
              {copy.nav.faq}
            </a>
          </nav>

          {/* Zone 3: 1 primary CTA action */}
          <div className="flex min-w-0 items-center">
            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.12 }}
              type="button"
              onClick={() => openModal('diagnostic')}
              className="h-10 max-w-[190px] truncate rounded-lg bg-[#00887A] px-3 text-xs font-semibold text-[#FFFFFF] transition-colors duration-150 hover:bg-brand-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] focus-visible:ring-offset-2 sm:max-w-none sm:px-4 whitespace-nowrap"
            >
              {copy.nav.cta}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="w-full overflow-x-clip">
        {/* 1. HERO SECTION — Proposition + KZ/RU Switcher + Fast Diagnostic Lead Capture */}
        <section className="overflow-x-clip bg-gradient-to-b from-[#D3E3FC]/35 via-[#FFFFFF] to-[#FFFFFF] py-8 sm:py-10 lg:py-16">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            {/* Hero Utility Bar: Unboxed regional line + KZ/RU interactive switch */}
            <Reveal direction="none">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#D3E3FC] pb-4">
                <p className="min-w-0 text-xs font-semibold leading-relaxed text-brand-muted">
                  {copy.hero.regionalLine}
                </p>

                <div
                  role="group"
                  aria-label="Language switcher"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#D3E3FC]/75 p-1"
                >
                  <button
                    type="button"
                    onClick={() => setLocale('ru')}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      locale === 'ru'
                        ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                        : 'text-brand-muted hover:text-brand-ink'
                    }`}
                  >
                    РУС
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale('kz')}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      locale === 'kz'
                        ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                        : 'text-brand-muted hover:text-brand-ink'
                    }`}
                  >
                    ҚАЗ
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Balanced 2-Column Hero Split */}
            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:items-stretch">
              <Reveal direction="up" className="flex min-w-0 flex-col justify-between lg:col-span-6">
                <div className="min-w-0">
                  <h1 className="font-display text-[clamp(1.85rem,5.5vw,3.4rem)] leading-[1.12] font-extrabold tracking-tight text-brand-ink [text-wrap:balance]">
                    {copy.hero.headline}
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-muted sm:mt-5 sm:text-base">
                    {copy.hero.subheadline}
                  </p>
                </div>

                {/* Inline Fast-Conversion Diagnostic Form */}
                <div className="mt-7 min-w-0 rounded-xl border border-[#77A6F7]/50 bg-[#D3E3FC]/25 p-5 sm:mt-8 sm:p-7">
                  <h2 className="font-display text-base font-bold text-brand-ink">
                    {copy.hero.formTitle}
                  </h2>
                  <p className="mt-1 mb-5 text-xs leading-relaxed text-brand-muted">
                    {copy.hero.formSubtitle}
                  </p>
                  <LeadForm
                    locale={locale}
                    copy={copy}
                    utm={utm}
                    defaultPlan="diagnostic"
                    defaultPaymentMode={paymentMode}
                    compact={true}
                  />
                </div>
              </Reveal>

              {/* Focal Visual Anchor */}
              <Reveal
                direction="right"
                delay={0.08}
                className="relative min-w-0 overflow-hidden rounded-xl border border-[#77A6F7]/45 bg-[#D3E3FC] lg:col-span-6"
              >
                <ResilientImage
                  src={heroSatImg}
                  alt={copy.hero.imageAlt}
                  className="h-full min-h-[280px] w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02] sm:min-h-[360px] lg:min-h-[560px]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16 sm:p-6 sm:pt-20">
                  <p className="text-xs font-medium leading-relaxed text-[#FFFFFF]">
                    {copy.hero.imageCaption}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Full-Width 4-Column Quantitative Proof Strip with Warm Peach (#FFCCBC) Surface */}
            <Reveal delay={0.12}>
              <div className="mt-8 grid grid-cols-1 gap-5 rounded-xl border border-[#FFCCBC] bg-[#FFCCBC]/35 p-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 sm:p-8 lg:grid-cols-4">
                {copy.hero.stats.map((stat, idx) => (
                  <Reveal
                    key={idx}
                    delay={0.14 + idx * 0.06}
                    distance={14}
                    className={
                      idx > 0
                        ? 'border-t border-[#FFCCBC] pt-4 sm:border-t-0 sm:pt-0 lg:border-l lg:pl-6'
                        : ''
                    }
                  >
                    <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-[#00887A] sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-brand-ink">{stat.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-muted">{stat.context}</p>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 2. MECHANISM — 1-on-1 Methodology Asymmetric Bento Grid */}
        <section
          id="program"
          className="overflow-x-clip border-t border-[#D3E3FC] bg-[#D3E3FC]/25 py-16 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <Reveal>
              <div className="max-w-2xl min-w-0">
                <p className="text-xs font-semibold text-[#00887A]">{copy.program.kicker}</p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-4xl [text-wrap:balance]">
                  {copy.program.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-brand-muted">
                  {copy.program.subtitle}
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-12">
              {/* Stage 1 (7 cols) + Mentor Photo (5 cols) */}
              <Reveal className="flex min-w-0 lg:col-span-7">
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-full min-w-0 flex-col justify-between rounded-xl border border-[#D3E3FC] bg-[#FFFFFF] p-5 transition-colors hover:border-[#77A6F7] sm:p-7"
                >
                  <div>
                    <p className="text-xs font-medium text-brand-muted">
                      <span className="font-mono font-semibold text-[#00887A]">
                        {copy.program.months[0].index}.
                      </span>{' '}
                      {copy.program.months[0].period}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-brand-ink sm:text-xl">
                      {copy.program.months[0].title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                      {copy.program.months[0].description}
                    </p>
                  </div>
                  <ul className="mt-6 space-y-2 border-t border-[#D3E3FC] pt-5 text-sm text-brand-ink">
                    {copy.program.months[0].deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="shrink-0 font-semibold text-[#00887A]">
                          —
                        </span>
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </Reveal>

              <Reveal
                direction="right"
                delay={0.08}
                className="relative min-w-0 overflow-hidden rounded-xl border border-[#77A6F7]/45 bg-[#D3E3FC] lg:col-span-5"
              >
                <ResilientImage
                  src={mentorWorkshopImg}
                  alt={copy.program.mentorImageAlt}
                  className="h-full min-h-[240px] w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03] sm:min-h-[280px]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
                  <p className="text-xs font-medium text-[#FFFFFF]">
                    {copy.program.mentorImageCaption}
                  </p>
                </div>
              </Reveal>

              {/* Mock Exam Photo (5 cols) + Stage 2 (7 cols) */}
              <Reveal
                direction="left"
                className="relative min-w-0 overflow-hidden rounded-xl border border-[#77A6F7]/45 bg-[#D3E3FC] lg:col-span-5"
              >
                <ResilientImage
                  src={studentMockImg}
                  alt={copy.program.mockImageAlt}
                  className="h-full min-h-[240px] w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03] sm:min-h-[280px]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
                  <p className="text-xs font-medium text-[#FFFFFF]">
                    {copy.program.mockImageCaption}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="flex min-w-0 lg:col-span-7">
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-full min-w-0 flex-col justify-between rounded-xl border border-[#D3E3FC] bg-[#FFFFFF] p-5 transition-colors hover:border-[#77A6F7] sm:p-7"
                >
                  <div>
                    <p className="text-xs font-medium text-brand-muted">
                      <span className="font-mono font-semibold text-[#00887A]">
                        {copy.program.months[1].index}.
                      </span>{' '}
                      {copy.program.months[1].period}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-brand-ink sm:text-xl">
                      {copy.program.months[1].title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                      {copy.program.months[1].description}
                    </p>
                  </div>
                  <ul className="mt-6 space-y-2 border-t border-[#D3E3FC] pt-5 text-sm text-brand-ink">
                    {copy.program.months[1].deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="shrink-0 font-semibold text-[#00887A]">
                          —
                        </span>
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </Reveal>

              {/* Stage 3 Full-Span Peak Execution Block in Warm Peach (#FFCCBC) & White */}
              <Reveal delay={0.1} className="min-w-0 lg:col-span-12">
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-xl border border-[#FFCCBC] bg-[#FFCCBC]/40 p-5 text-brand-ink sm:p-8"
                >
                  <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="min-w-0 lg:col-span-7">
                      <p className="text-xs font-semibold text-brand-muted">
                        <span className="font-mono font-bold text-[#00887A]">
                          {copy.program.months[2].index}.
                        </span>{' '}
                        {copy.program.months[2].period}
                      </p>
                      <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-brand-ink sm:text-2xl">
                        {copy.program.months[2].title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                        {copy.program.months[2].description}
                      </p>
                    </div>
                    <ul className="min-w-0 space-y-3 border-t border-[#FFCCBC] pt-5 text-sm text-brand-ink sm:pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                      {copy.program.months[2].deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span aria-hidden="true" className="shrink-0 font-bold text-[#00887A]">
                            —
                          </span>
                          <span className="min-w-0">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. PROOF / EVIDENCE — Kazakhstani Student Cases & Target University Benchmarks */}
        <section
          id="results"
          className="overflow-x-clip border-t border-[#D3E3FC] bg-[#FFFFFF] py-16 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <Reveal>
              <div className="max-w-2xl min-w-0">
                <p className="text-xs font-semibold text-[#00887A]">{copy.results.kicker}</p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-4xl [text-wrap:balance]">
                  {copy.results.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-brand-muted">
                  {copy.results.subtitle}
                </p>
              </div>
            </Reveal>

            {/* Attributable Student Case Cards */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-3 lg:items-stretch">
              {copy.results.cases.map((student, idx) => {
                const delta = student.scoreAfter - student.scoreBefore;
                return (
                  <Reveal key={idx} delay={idx * 0.08} className="flex min-w-0">
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="flex w-full min-w-0 flex-col justify-between rounded-xl border border-[#D3E3FC] bg-[#D3E3FC]/15 p-5 transition-colors hover:border-[#77A6F7] hover:bg-[#D3E3FC]/25 sm:p-7"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-brand-muted">
                          {student.cityAndSchool} · {student.grade} · {student.duration}
                        </p>
                        <h3 className="mt-2 font-display text-lg font-bold text-brand-ink">
                          {student.name}
                        </h3>

                        {/* Score Progression Row */}
                        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-y border-[#D3E3FC] py-4">
                          <div>
                            <p className="text-xs text-brand-muted">
                              {copy.results.beforeAfterLabel}
                            </p>
                            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-brand-ink sm:text-2xl">
                              {student.scoreBefore} → {student.scoreAfter}{' '}
                              <span className="text-sm font-bold text-[#00887A]">(+{delta})</span>
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-brand-muted">
                              {copy.results.breakdownLabel}
                            </p>
                            <p className="mt-1 font-mono text-xs font-medium tabular-nums text-brand-ink">
                              M {student.mathScore} / RW {student.rwScore}
                            </p>
                          </div>
                        </div>

                        <p className="mt-5 text-sm leading-relaxed text-brand-muted">
                          «{student.quote}»
                        </p>
                      </div>

                      <div className="mt-6 border-t border-[#D3E3FC] pt-4">
                        <p className="text-xs text-brand-muted">{copy.results.admittedLabel}</p>
                        <p className="mt-1 text-sm font-semibold text-brand-ink">
                          {student.admittedTo}
                        </p>
                      </div>
                    </motion.article>
                  </Reveal>
                );
              })}
            </div>

            {/* Interactive University Score Benchmarks */}
            <Reveal delay={0.1}>
              <div className="mt-12 min-w-0 rounded-xl border border-[#77A6F7]/50 bg-[#D3E3FC]/35 p-5 sm:mt-14 sm:p-8">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="max-w-xl min-w-0">
                    <h3 className="font-display text-lg font-bold tracking-tight text-brand-ink sm:text-xl">
                      {copy.results.benchmarksTitle}
                    </h3>
                    <p className="mt-1 text-sm text-brand-muted">
                      {copy.results.benchmarksSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#FFFFFF] p-1 sm:flex sm:flex-wrap">
                    {copy.results.destinations.map((dest) => (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => setActiveDestId(dest.id)}
                        className={`min-w-0 truncate rounded-md px-3 py-2 text-xs font-semibold transition-all duration-150 sm:px-3.5 ${
                          activeDestination.id === dest.id
                            ? 'bg-[#00887A] text-[#FFFFFF]'
                            : 'text-brand-muted hover:text-brand-ink'
                        }`}
                      >
                        {dest.regionLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeDestination.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 grid grid-cols-1 gap-6 border-t border-[#77A6F7]/40 pt-6 lg:grid-cols-12 lg:items-center"
                  >
                    <div className="min-w-0 lg:col-span-5">
                      <p className="font-display text-base font-bold text-brand-ink">
                        {activeDestination.universities}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                        {activeDestination.note}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
                      <div>
                        <p className="text-xs text-brand-muted">{copy.results.colMinScore}</p>
                        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-brand-ink">
                          {activeDestination.minCompetitiveScore}+
                        </p>
                      </div>
                      <div className="border-t border-[#77A6F7]/40 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                        <p className="text-xs text-brand-muted">{copy.results.colGrantScore}</p>
                        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#00887A]">
                          {activeDestination.fullGrantScore}+
                        </p>
                      </div>
                      <div className="border-t border-[#77A6F7]/40 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                        <p className="text-xs text-brand-muted">{copy.results.colStartGrade}</p>
                        <p className="mt-1 font-display text-lg font-bold text-brand-ink">
                          {activeDestination.recommendedGrade}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. INTERACTIVE 1-ON-1 PACKAGE COMPARISON & TRANSPARENT PRICING */}
        <PricingComparison
          copy={copy}
          paymentMode={paymentMode}
          onPaymentModeChange={setPaymentMode}
          onSelectPlan={(planId, mode) => openModal(planId, mode)}
        />

        {/* 5. SEO FAQ WITH SMOOTH DROPDOWN ANIMATIONS & FINAL CONVERSION CAPTURE */}
        <section
          id="faq"
          className="overflow-x-clip border-t border-[#D3E3FC] bg-[#D3E3FC]/25 py-16 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:items-start">
              {/* SEO FAQ Accordion with Smooth Expand/Collapse Animation (7 cols) */}
              <Reveal className="min-w-0 lg:col-span-7">
                <p className="text-xs font-semibold text-[#00887A]">{copy.faq.kicker}</p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl [text-wrap:balance]">
                  {copy.faq.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  {copy.faq.subtitle}
                </p>

                <div className="mt-8 divide-y divide-[#D3E3FC] overflow-hidden rounded-xl border border-[#D3E3FC] bg-[#FFFFFF]">
                  {copy.faq.items.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    const answerId = `faq-answer-${idx}`;
                    const questionId = `faq-question-${idx}`;
                    return (
                      <div
                        key={idx}
                        className={`transition-colors duration-200 ${
                          isOpen ? 'bg-[#D3E3FC]/15' : 'bg-[#FFFFFF]'
                        }`}
                      >
                        <button
                          id={questionId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={answerId}
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#D3E3FC]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00887A] sm:px-6 sm:py-5"
                        >
                          <span className="min-w-0 font-display text-sm font-semibold text-brand-ink sm:text-base">
                            {item.question}
                          </span>
                          <ChevronDown
                            aria-hidden="true"
                            className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              isOpen ? 'rotate-180 text-[#00887A]' : 'text-brand-muted'
                            }`}
                          />
                        </button>

                        {/* Smooth Animated Dropdown Panel — Keeps FAQ Text in DOM for SEO */}
                        <div
                          id={answerId}
                          role="region"
                          aria-labelledby={questionId}
                          aria-hidden={!isOpen}
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="px-5 pb-5 text-sm leading-relaxed text-brand-muted sm:px-6">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>

              {/* Final Diagnostic Booking Card framed with Warm Peach (#FFCCBC) */}
              <Reveal delay={0.1} className="min-w-0 lg:col-span-5">
                <div className="min-w-0 rounded-xl border-2 border-[#FFCCBC] bg-[#FFFFFF] p-5 sm:p-8">
                  <h3 className="font-display text-xl font-bold tracking-tight text-brand-ink [text-wrap:balance]">
                    {copy.faq.bottomCtaTitle}
                  </h3>
                  <p className="mt-2 mb-6 text-sm leading-relaxed text-brand-muted">
                    {copy.faq.bottomCtaDesc}
                  </p>
                  <LeadForm
                    locale={locale}
                    copy={copy}
                    utm={utm}
                    defaultPlan="diagnostic"
                    defaultPaymentMode={paymentMode}
                    showPlanSelector={true}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer with Language Mirror & Protected CRM Entry */}
      <footer className="overflow-x-clip border-t border-[#D3E3FC] bg-[#FFFFFF] py-12">
        <Reveal direction="none" className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="min-w-0 md:col-span-5">
              <a
                href="#top"
                className="font-display text-lg font-extrabold tracking-tight text-[#00887A]"
              >
                {copy.nav.brand}
              </a>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-muted">
                {copy.footer.tagline}
              </p>
              <p className="mt-3 text-xs text-brand-muted">{copy.footer.geography}</p>
            </div>

            <div className="min-w-0 md:col-span-3">
              <p className="text-xs font-semibold text-brand-ink">{copy.footer.navTitle}</p>
              <ul className="mt-3 space-y-2 text-sm text-brand-muted">
                <li>
                  <a href="#program" className="transition-colors hover:text-[#00887A]">
                    {copy.nav.program}
                  </a>
                </li>
                <li>
                  <a href="#results" className="transition-colors hover:text-[#00887A]">
                    {copy.nav.results}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition-colors hover:text-[#00887A]">
                    {copy.nav.pricing}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-[#00887A]">
                    {copy.nav.faq}
                  </a>
                </li>
              </ul>
            </div>

            <div className="min-w-0 md:col-span-4">
              <p className="text-xs font-semibold text-brand-ink">{copy.footer.contactTitle}</p>
              <p className="mt-3 text-sm text-brand-muted">{copy.footer.scheduleLine}</p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="inline-flex rounded-lg bg-[#D3E3FC]/70 p-1">
                  <button
                    type="button"
                    onClick={() => setLocale('ru')}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                      locale === 'ru'
                        ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                        : 'text-brand-muted hover:text-brand-ink'
                    }`}
                  >
                    РУС
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale('kz')}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                      locale === 'kz'
                        ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                        : 'text-brand-muted hover:text-brand-ink'
                    }`}
                  >
                    ҚАЗ
                  </button>
                </div>

                <button
                  type="button"
                  onClick={switchToCrm}
                  className="text-xs font-semibold text-[#00887A] underline-offset-4 transition-colors hover:underline"
                >
                  {copy.footer.adminButton}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#D3E3FC] pt-6 text-xs text-brand-muted">
            {copy.footer.copyright}
          </div>
        </Reveal>
      </footer>

      <EnrollmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        locale={locale}
        copy={copy}
        utm={utm}
        selectedPlan={modalPlan}
        paymentMode={paymentMode}
      />
    </div>
  );
}
