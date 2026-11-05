import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  GraduationCap,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import heroSatImg from './assets/images/hero_sat_kazakhstan.webp';
import { AdminCrm } from './components/AdminCrm';
import { EnrollmentModal } from './components/EnrollmentModal';
import { LeadForm } from './components/LeadForm';
import { PricingComparison } from './components/PricingComparison';
import { PromoBar } from './components/PromoBar';
import { ResilientImage } from './components/ResilientImage';
import { Reveal, ScrollProgressBar } from './components/Reveal';
import { StickyCta } from './components/StickyCta';
import { CONTACTS, PROMO } from './config';
import { usePromo } from './hooks/usePromo';
import { useSeoAndUtm } from './hooks/useSeoAndUtm';
import { LANDING } from './i18n/landing';
import { TRANSLATIONS } from './i18n/translations';
import { track } from './lib/analytics';
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(-1);
  const [showSticky, setShowSticky] = useState(false);

  const copy = TRANSLATIONS[locale];
  const L = LANDING[locale];
  const utm = useSeoAndUtm(locale, copy);
  const promo = usePromo();
  const promoForm = {
    active: promo.active,
    code: PROMO.code,
    note: L.promo.note,
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage error
    }
  }, [locale]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 620);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openModal = (plan: PlanId, mode?: PaymentMode) => {
    setModalPlan(plan);
    if (mode) setPaymentMode(mode);
    setModalOpen(true);
  };

  const handlePromoCta = () => {
    track('promo_cta', { promo: promo.active ? PROMO.code : 'none' });
    openModal('diagnostic');
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
    L.results.destinations.find((d) => d.id === activeDestId) ?? L.results.destinations[0];

  return (
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-[#FFFFFF] text-brand-ink">
      <ScrollProgressBar />

      {!promo.dismissed && promo.status !== 'disabled' && (
        <PromoBar
          copy={L.promo}
          active={promo.active}
          deadline={promo.deadline}
          onCta={handlePromoCta}
          onClose={promo.dismiss}
        />
      )}

      <header className="sticky top-0 z-40 h-16 border-b border-[#D3E3FC] bg-[#FFFFFF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
          <a
            href="#top"
            className="shrink-0 font-display text-lg font-extrabold tracking-tight text-[#00887A] transition-colors hover:text-brand-teal-hover"
          >
            {copy.nav.brand}
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 text-sm font-medium text-brand-muted md:flex"
          >
            <a href="#how" className="transition-colors hover:text-brand-ink">
              {L.nav.steps}
            </a>
            <a href="#results" className="transition-colors hover:text-brand-ink">
              {L.nav.results}
            </a>
            <a href="#pricing" className="transition-colors hover:text-brand-ink">
              {L.nav.pricing}
            </a>
            <a href="#faq" className="transition-colors hover:text-brand-ink">
              {L.nav.faq}
            </a>
          </nav>

          <div className="flex min-w-0 items-center gap-2">
            <div className="hidden items-center rounded-lg bg-[#D3E3FC]/70 p-0.5 sm:flex">
              <button
                type="button"
                onClick={() => setLocale('ru')}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                  locale === 'ru' ? 'bg-white text-brand-ink shadow-xs' : 'text-brand-muted'
                }`}
              >
                РУС
              </button>
              <button
                type="button"
                onClick={() => setLocale('kz')}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                  locale === 'kz' ? 'bg-white text-brand-ink shadow-xs' : 'text-brand-muted'
                }`}
              >
                ҚАЗ
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.12 }}
              type="button"
              onClick={() => openModal('diagnostic')}
              className="h-10 shrink-0 rounded-lg bg-[#00887A] px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] focus-visible:ring-offset-2 sm:px-4"
            >
              {L.nav.cta}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="w-full overflow-x-clip">
        {/* HERO */}
        <section id="hero" className="relative overflow-x-clip bg-gradient-to-b from-[#D3E3FC]/45 via-[#FFFFFF] to-[#FFFFFF] py-5 sm:py-7 lg:py-10">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
              <Reveal direction="up" className="min-w-0 lg:col-span-6">
                <div className="flex flex-wrap gap-1.5">
                  {L.hero.chips.map((chip, index) => (
                    <span
                      key={chip}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        index === 0
                          ? 'bg-[#00887A] text-white'
                          : 'bg-[#D3E3FC]/70 text-brand-ink'
                      }`}
                    >
                      {index === 0 && <Sparkles className="h-3 w-3" aria-hidden="true" />}
                      {chip}
                    </span>
                  ))}
                </div>

                <h1 className="mt-4 font-display text-[clamp(2rem,5.4vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight text-brand-ink [text-wrap:balance]">
                  {L.hero.headline}
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-brand-muted sm:text-base">
                  {L.hero.subheadline}
                </p>

                <div className="mt-5 rounded-2xl border border-[#77A6F7]/45 bg-white p-4 shadow-[0_18px_50px_-32px_rgba(13,38,40,0.45)] sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-bold text-brand-ink">
                        {L.hero.formTitle}
                      </h2>
                      <p className="mt-0.5 text-[11px] text-brand-muted">{L.hero.formSubtitle}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#FFCCBC] px-2.5 py-1 text-[11px] font-bold text-[#0D2628]">
                      0 ₸
                    </span>
                  </div>

                  <div className="mt-4">
                    <LeadForm
                      locale={locale}
                      copy={copy}
                      utm={utm}
                      defaultPlan="diagnostic"
                      defaultPaymentMode={paymentMode}
                      compact={true}
                      promo={promoForm}
                    />
                  </div>

                </div>
              </Reveal>

              <Reveal
                direction="right"
                delay={0.08}
                className="relative min-w-0 lg:col-span-6 lg:pt-2"
              >
                <div className="relative overflow-hidden rounded-2xl border border-[#77A6F7]/40 bg-[#D3E3FC]">
                  <ResilientImage
                    src={heroSatImg}
                    alt={L.hero.imageAlt}
                    className="h-[260px] w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02] sm:h-[380px] lg:h-[520px]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-16 sm:p-5 sm:pt-20">
                    <p className="text-xs font-medium text-white">{L.hero.imageCaption}</p>
                  </div>

                  <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
                    <p className="font-mono text-xl font-bold leading-none text-[#00887A]">
                      {L.hero.stats[1].value}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-brand-muted">
                      {L.hero.stats[1].label}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-4 sm:gap-3">
                {L.hero.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[#FFCCBC] bg-[#FFCCBC]/25 px-3 py-3 sm:px-4"
                  >
                    <p className="font-mono text-lg font-semibold tabular-nums text-[#00887A] sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium leading-snug text-brand-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how"
          className="overflow-x-clip border-t border-[#D3E3FC] bg-[#D3E3FC]/20 py-10 sm:py-12"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <Reveal>
              <div className="max-w-xl">
                <p className="text-xs font-semibold text-[#00887A]">{L.steps.kicker}</p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                  {L.steps.title}
                </h2>
                <p className="mt-2 text-sm text-brand-muted">{L.steps.subtitle}</p>
              </div>
            </Reveal>

            <div className="relative mt-5 grid grid-cols-1 gap-3.5 lg:grid-cols-3">
              <div
                className="pointer-events-none absolute left-8 right-8 top-9 hidden h-px bg-[#77A6F7]/50 lg:block"
                aria-hidden="true"
              />
              {L.steps.items.map((step, index) => (
                <Reveal key={step.index} delay={index * 0.07} className="min-w-0">
                  <article className="relative flex h-full flex-col rounded-2xl border border-[#D3E3FC] bg-white p-5 transition-colors hover:border-[#77A6F7]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00887A] font-mono text-xs font-bold text-white">
                        {step.index}
                      </span>
                      <span className="rounded-full bg-[#D3E3FC]/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-muted">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold text-brand-ink sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted">{step.text}</p>
                    <ul className="mt-3 space-y-1.5 text-[13px] text-brand-ink">
                      {step.points.map((point) => (
                        <li key={point} className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#00887A]" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {L.steps.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[#D3E3FC] bg-white px-2.5 py-1 text-[11px] font-medium text-brand-muted"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* RESULTS */}
        <section
          id="results"
          className="overflow-x-clip border-t border-[#D3E3FC] bg-white py-10 sm:py-12"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <Reveal>
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                  {L.results.title}
                </h2>
                <p className="mt-2 text-sm text-brand-muted">{L.results.subtitle}</p>
              </div>
            </Reveal>

            <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {L.results.cases.map((item, index) => {
                const delta = item.after - item.before;
                return (
                  <Reveal key={`${item.label}-${index}`} delay={index * 0.06} className="min-w-0">
                    <article className="flex h-full flex-col rounded-2xl border border-[#D3E3FC] bg-[#D3E3FC]/15 p-5 transition-colors hover:border-[#77A6F7]">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-medium text-brand-muted">
                          {item.label}
                        </p>
                        <span className="shrink-0 rounded-full bg-[#00887A]/10 px-2 py-0.5 font-mono text-[11px] font-bold text-[#00887A]">
                          +{delta}
                        </span>
                      </div>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-mono text-xl font-semibold tabular-nums text-brand-muted line-through decoration-brand-muted/40">
                          {item.before}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-brand-muted" aria-hidden="true" />
                        <span className="font-mono text-3xl font-bold tabular-nums text-brand-ink">
                          {item.after}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] text-brand-muted">
                          <span className="w-8 shrink-0">было</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#D3E3FC]">
                            <div
                              className="h-full rounded-full bg-[#77A6F7]"
                              style={{ width: `${(item.before / 1600) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-brand-muted">
                          <span className="w-8 shrink-0">стало</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#D3E3FC]">
                            <div
                              className="h-full rounded-full bg-[#00887A]"
                              style={{ width: `${(item.after / 1600) * 100}%` }}
                            />
                          </div>
                        </div>
                        <p className="pt-0.5 text-[10px] text-brand-muted">
                          Math {item.math} · RW {item.rw} · {item.note}
                        </p>
                      </div>

                      <div className="mt-4 flex items-start gap-2 border-t border-[#D3E3FC] pt-3">
                        <GraduationCap
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#00887A]"
                          aria-hidden="true"
                        />
                        <p className="text-[12px] font-semibold leading-snug text-brand-ink">
                          {item.admitted}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-5 rounded-2xl border border-[#77A6F7]/45 bg-[#D3E3FC]/30 p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-brand-ink">
                      {L.results.benchmarksTitle}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-brand-muted">
                      {L.results.benchmarksSubtitle}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 rounded-lg bg-white p-1">
                    {L.results.destinations.map((dest) => (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => setActiveDestId(dest.id)}
                        className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                          activeDestination.id === dest.id
                            ? 'bg-[#00887A] text-white'
                            : 'text-brand-muted hover:text-brand-ink'
                        }`}
                      >
                        {dest.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#77A6F7]/40 pt-4 sm:grid-cols-12 sm:items-center">
                  <div className="min-w-0 sm:col-span-5">
                    <p className="text-sm font-bold text-brand-ink">{activeDestination.schools}</p>
                    <p className="mt-1 text-[11px] text-brand-muted">{activeDestination.note}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:col-span-7">
                    <div>
                      <p className="text-[10px] text-brand-muted">Порог</p>
                      <p className="font-mono text-lg font-semibold tabular-nums text-brand-ink">
                        {activeDestination.min}+
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-muted">Грант</p>
                      <p className="font-mono text-lg font-semibold tabular-nums text-[#00887A]">
                        {activeDestination.grant}+
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-muted">Старт</p>
                      <p className="text-[12px] font-bold text-brand-ink">
                        {activeDestination.grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <PricingComparison
          copy={L.pricing}
          promoActive={promo.active}
          paymentMode={paymentMode}
          onPaymentModeChange={setPaymentMode}
          onSelectPlan={(planId, mode) => openModal(planId, mode)}
        />

        {/* FAQ + FINAL CTA */}
        <section
          id="faq"
          className="overflow-x-clip border-t border-[#D3E3FC] bg-[#D3E3FC]/20 py-10 sm:py-12"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
              <Reveal className="min-w-0 lg:col-span-7">
                <p className="text-xs font-semibold text-[#00887A]">{L.faq.kicker}</p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                  {L.faq.title}
                </h2>
                <p className="mt-2 text-sm text-brand-muted">{L.faq.subtitle}</p>

                <div className="mt-4 divide-y divide-[#D3E3FC] overflow-hidden rounded-2xl border border-[#D3E3FC] bg-white">
                  {L.faq.items.map((item, index) => {
                    const isOpen = openFaqIndex === index;
                    const answerId = `faq-answer-${index}`;
                    return (
                      <div key={item.q}>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={answerId}
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#D3E3FC]/20 sm:px-5"
                        >
                          <span className="min-w-0 text-[13px] font-semibold text-brand-ink sm:text-sm">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-[#00887A]' : 'text-brand-muted'
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          id={answerId}
                          className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="px-4 pb-4 text-[13px] leading-relaxed text-brand-muted sm:px-5">
                              {item.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>

              <Reveal delay={0.08} className="min-w-0 lg:col-span-5">
                <div className="rounded-2xl border-2 border-[#FFCCBC] bg-white p-4 sm:p-5">
                  <h3 className="font-display text-lg font-bold text-brand-ink">
                    {L.faq.ctaTitle}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-brand-muted">{L.faq.ctaText}</p>
                  <div className="mt-3">
                    <LeadForm
                      locale={locale}
                      copy={copy}
                      utm={utm}
                      defaultPlan="diagnostic"
                      defaultPaymentMode={paymentMode}
                      promo={promoForm}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="overflow-x-clip border-t border-[#D3E3FC] bg-white py-8 pb-24 md:pb-8">
        <Reveal direction="none" className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="min-w-0 md:col-span-5">
              <a href="#top" className="font-display text-lg font-extrabold text-[#00887A]">
                {copy.nav.brand}
              </a>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-muted">
                {L.footer.tagline}
              </p>
              <p className="mt-2 text-[11px] text-brand-muted">{L.footer.geography}</p>
            </div>

            <div className="min-w-0 md:col-span-3">
              <p className="text-xs font-semibold text-brand-ink">{copy.footer.navTitle}</p>
              <ul className="mt-2 space-y-1.5 text-sm text-brand-muted">
                <li>
                  <a href="#how" className="transition-colors hover:text-[#00887A]">
                    {L.nav.steps}
                  </a>
                </li>
                <li>
                  <a href="#results" className="transition-colors hover:text-[#00887A]">
                    {L.nav.results}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition-colors hover:text-[#00887A]">
                    {L.nav.pricing}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-[#00887A]">
                    {L.nav.faq}
                  </a>
                </li>
              </ul>
            </div>

            <div className="min-w-0 md:col-span-4">
              <p className="text-xs font-semibold text-brand-ink">{L.footer.contactTitle}</p>
              <p className="mt-2 text-sm text-brand-muted">{L.footer.schedule}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {CONTACTS.whatsapp && (
                  <a
                    href={`https://wa.me/${CONTACTS.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('whatsapp_click', { location: 'footer' })}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#00887A] px-3 text-xs font-semibold text-white hover:bg-[#006E63]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    WhatsApp
                  </a>
                )}
                {CONTACTS.phone && (
                  <a
                    href={`tel:${CONTACTS.phone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex h-9 items-center rounded-lg border border-[#D3E3FC] px-3 text-xs font-semibold text-brand-ink hover:border-[#77A6F7]"
                  >
                    {CONTACTS.phone}
                  </a>
                )}
                {CONTACTS.telegram && (
                  <a
                    href={`https://t.me/${CONTACTS.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center rounded-lg border border-[#D3E3FC] px-3 text-xs font-semibold text-brand-ink hover:border-[#77A6F7]"
                  >
                    Telegram
                  </a>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-lg bg-[#D3E3FC]/70 p-0.5">
                  <button
                    type="button"
                    onClick={() => setLocale('ru')}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                      locale === 'ru' ? 'bg-white text-brand-ink shadow-xs' : 'text-brand-muted'
                    }`}
                  >
                    РУС
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale('kz')}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                      locale === 'kz' ? 'bg-white text-brand-ink shadow-xs' : 'text-brand-muted'
                    }`}
                  >
                    ҚАЗ
                  </button>
                </div>
                <button
                  type="button"
                  onClick={switchToCrm}
                  className="text-[11px] font-medium text-brand-muted underline-offset-4 hover:text-[#00887A] hover:underline"
                >
                  {copy.footer.adminButton}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#D3E3FC] pt-4 text-[11px] text-brand-muted">
            {copy.footer.copyright}
          </div>
        </Reveal>
      </footer>

      {showSticky && (
        <StickyCta
          copy={L.promo}
          active={promo.active}
          deadline={promo.deadline}
          visible={showSticky}
          onCta={handlePromoCta}
        />
      )}

      <EnrollmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        locale={locale}
        copy={copy}
        utm={utm}
        selectedPlan={modalPlan}
        paymentMode={paymentMode}
        promo={promoForm}
      />
    </div>
  );
}
