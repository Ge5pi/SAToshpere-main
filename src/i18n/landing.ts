import { ActivePlanId, Locale } from '../types';

/**
 * Лёгкий копирайт лендинга: короткие фразы, минимум абзацев.
 * SEO-тексты живут отдельно в translations.ts и подставляются в JSON-LD.
 */

export type LandingTariffId = Exclude<ActivePlanId, 'diagnostic'>;

export interface LandingPromo {
  title: string;
  subtitle: string;
  timerLabel: string;
  cta: string;
  expiredTitle: string;
  expiredSubtitle: string;
  expiredCta: string;
  note: string;
}

export interface LandingNav {
  steps: string;
  results: string;
  pricing: string;
  faq: string;
  cta: string;
}

export interface LandingHero {
  chips: string[];
  headline: string;
  subheadline: string;
  formTitle: string;
  formSubtitle: string;
  formNote: string;
  imageAlt: string;
  imageCaption: string;
  stats: { value: string; label: string }[];
}

export interface LandingStep {
  index: string;
  tag: string;
  title: string;
  text: string;
  points: string[];
}

export interface LandingCase {
  label: string;
  before: number;
  after: number;
  math: number;
  rw: number;
  admitted: string;
  note: string;
}

export interface LandingDestination {
  id: string;
  label: string;
  schools: string;
  min: number;
  grant: number;
  grade: string;
  note: string;
}

export interface LandingResults {
  title: string;
  subtitle: string;
  cases: LandingCase[];
  benchmarksTitle: string;
  benchmarksSubtitle: string;
  destinations: LandingDestination[];
}

export interface LandingTariff {
  id: LandingTariffId;
  name: string;
  tag: string;
  price: number;
  oldPrice?: number;
  perLessonPrice: number;
  oldPerLessonPrice?: number;
  unit: string;
  target: string;
  points: string[];
  cta: string;
  featured?: boolean;
}

export interface LandingComparisonRow {
  label: string;
  perLesson: string;
  course1m: string;
  course2m: string;
}

export interface LandingPricing {
  kicker: string;
  title: string;
  subtitle: string;
  packageLabel: string;
  perLessonLabel: string;
  perLessonUnit: string;
  featuredLabel: string;
  targetLabel: string;
  tariffs: LandingTariff[];
  installmentPrefix: string;
  promoBadge: string;
  comparisonTitle: string;
  comparison: LandingComparisonRow[];
  diagnosticTitle: string;
  diagnosticText: string;
  diagnosticCta: string;
}

export interface LandingFaqItem {
  q: string;
  a: string;
}

export interface LandingFaq {
  kicker: string;
  title: string;
  subtitle: string;
  items: LandingFaqItem[];
  ctaTitle: string;
  ctaText: string;
}

export interface LandingFooter {
  tagline: string;
  geography: string;
  contactTitle: string;
  schedule: string;
}

export interface LandingContent {
  nav: LandingNav;
  promo: LandingPromo;
  hero: LandingHero;
  steps: {
    kicker: string;
    title: string;
    subtitle: string;
    items: LandingStep[];
    chips: string[];
  };
  results: LandingResults;
  pricing: LandingPricing;
  faq: LandingFaq;
  footer: LandingFooter;
}

export const LANDING: Record<Locale, LandingContent> = {
  ru: {
    nav: {
      steps: 'Как это работает',
      results: 'Результаты',
      pricing: 'Тарифы',
      faq: 'FAQ',
      cta: 'Диагностика',
    },
    promo: {
      title: '−15% + гайд',
      subtitle: 'при записи за 15 минут',
      timerLabel: 'осталось',
      cta: 'Забрать',
      expiredTitle: 'Диагностика бесплатно',
      expiredSubtitle: '40 минут · онлайн · 0 ₸',
      expiredCta: 'Записаться',
      note: '−15% + гайд закреплены за вами.',
    },
    hero: {
      chips: ['9–11 класс', 'Преподаватели 1550+', 'Онлайн · Казахстан'],
      headline: 'SAT 1500+ за 8 недель — 1-на-1',
      subheadline:
        'Для 9–11 классов. Онлайн, с преподавателями 1550+. Бесплатная диагностика — 40 минут.',
      formTitle: 'Бесплатная диагностика',
      formSubtitle: '40 минут · онлайн · 0 ₸',
      formNote: 'Напишем в WhatsApp за 15 минут. Без звонков и спама.',
      imageAlt: 'Индивидуальные занятия по подготовке к Digital SAT',
      imageCaption: 'Занятия 1-на-1 · онлайн',
      stats: [
        { value: '1-на-1', label: 'все занятия' },
        { value: '+210', label: 'средний рост за 2 месяца' },
        { value: '1500+', label: 'цель для гранта NU' },
        { value: '800+', label: 'учеников за 5 лет' },
      ],
    },
    steps: {
      kicker: 'Как это работает',
      title: '3 шага до целевого балла',
      subtitle: 'Без общих групп и лишних тем.',
      items: [
        {
          index: '01',
          tag: '40 минут',
          title: 'Диагностика',
          text: 'Определяем балл по Math и RW и 3 точки роста.',
          points: ['Точный балл', '3 слабые темы', 'План на 8 недель'],
        },
        {
          index: '02',
          tag: '8 недель',
          title: 'Подготовка 1-на-1',
          text: '24 урока под слабые темы и 5 симуляций Bluebook.',
          points: ['24 урока', '5 симуляций', 'Error Log'],
        },
        {
          index: '03',
          tag: 'Экзамен',
          title: 'Выход на 1500+',
          text: 'Стратегия, тайминг и регистрация на SAT.',
          points: ['Пробный экзамен', 'Стратегия', 'Регистрация'],
        },
      ],
      chips: ['Desmos', 'Bluebook', 'Error Log', 'Отчёты родителям', 'Домашка', 'Регистрация'],
    },
    results: {
      title: 'Рост на 170–250 баллов',
      subtitle: 'За 1–2 месяца занятий 1-на-1.',
      cases: [
        {
          label: 'Ученик 11 класса',
          before: 1290,
          after: 1540,
          math: 790,
          rw: 750,
          admitted: 'NU, Computer Science · грант',
          note: 'За 2 месяца',
        },
        {
          label: 'Ученица 11 класса',
          before: 1360,
          after: 1550,
          math: 780,
          rw: 770,
          admitted: 'NYU Abu Dhabi · full ride',
          note: 'За 1 месяц',
        },
        {
          label: 'Ученик 10 класса',
          before: 1210,
          after: 1470,
          math: 780,
          rw: 690,
          admitted: 'Грантовый балл NU в 10 классе',
          note: 'За 2 месяца',
        },
      ],
      benchmarksTitle: 'Баллы для вузов и грантов',
      benchmarksSubtitle: 'Выберите направление.',
      destinations: [
        {
          id: 'nu',
          label: 'NU',
          schools: 'Nazarbayev University',
          min: 1350,
          grant: 1470,
          grade: '10–11 класс',
          note: 'Direct Entry: 1460+ и Math 750+.',
        },
        {
          id: 'usa',
          label: 'США',
          schools: 'Ivy League, Stanford, MIT, NYUAD',
          min: 1480,
          grant: 1540,
          grade: '9–10 класс',
          note: 'Для Financial Aid в топ-вузах.',
        },
        {
          id: 'europe',
          label: 'Европа',
          schools: 'Bocconi, KU Leuven, Aalto',
          min: 1380,
          grant: 1480,
          grade: '10–11 класс',
          note: 'Освобождает от внутреннего теста.',
        },
        {
          id: 'asia',
          label: 'Азия',
          schools: 'HKU, HKUST, KAIST, NUS',
          min: 1450,
          grant: 1530,
          grade: '10 класс',
          note: 'Стипендия привязана к 1500+.',
        },
      ],
    },
    pricing: {
      kicker: 'Тарифы',
      title: 'Выберите формат',
      subtitle: 'Все занятия 1-на-1. Оплата частями — 4 платежа.',
      packageLabel: 'Пакет',
      perLessonLabel: 'За урок',
      perLessonUnit: 'за 1 урок',
      featuredLabel: 'Выгоднее всего',
      targetLabel: 'Цель:',
      tariffs: [
        {
          id: 'per_lesson',
          name: 'Поурочно',
          tag: '1 урок · 60 мин',
          price: 10000,
          perLessonPrice: 10000,
          unit: 'за 1 урок',
          target: 'Точечный разбор',
          points: ['Персональный урок 1-на-1', 'Desmos и сложные темы', 'Домашка с проверкой'],
          cta: 'Записаться',
        },
        {
          id: 'course_2m',
          name: 'Курс на 2 месяца',
          tag: '24 урока · 5 симуляций',
          price: 210000,
          oldPrice: 240000,
          perLessonPrice: 8750,
          oldPerLessonPrice: 10000,
          unit: 'за 24 урока',
          target: '+180–250 баллов',
          points: ['24 урока 1-на-1', '5 симуляций Bluebook', 'Отчёты родителям'],
          cta: 'Выбрать курс',
          featured: true,
        },
        {
          id: 'course_1m',
          name: 'Курс на 1 месяц',
          tag: '12 уроков · 2 симуляции',
          price: 110000,
          oldPrice: 120000,
          perLessonPrice: 9167,
          oldPerLessonPrice: 10000,
          unit: 'за 12 уроков',
          target: '+90–140 баллов',
          points: ['12 уроков 1-на-1', '2 симуляции Bluebook', 'План под дедлайн'],
          cta: 'Выбрать курс',
        },
      ],
      installmentPrefix: 'или 4 платежа по',
      promoBadge: '−15% по промо',
      comparisonTitle: 'Что отличается',
      comparison: [
        { label: 'Уроков', perLesson: '1', course1m: '12', course2m: '24' },
        { label: 'Симуляций', perLesson: '—', course1m: '2', course2m: '5' },
        { label: 'Цена урока (база)', perLesson: '10 000 ₸', course1m: '9 167 ₸', course2m: '8 750 ₸' },
        { label: 'Отчёты', perLesson: '—', course1m: '2', course2m: 'каждые 2 недели' },
      ],
      diagnosticTitle: 'Сначала — бесплатная диагностика',
      diagnosticText: '40 минут. Без обязательств.',
      diagnosticCta: 'Записаться',
    },
    faq: {
      kicker: 'FAQ',
      title: 'Частые вопросы',
      subtitle: 'Коротко о формате, оплате и результате.',
      items: [
        {
          q: 'Почему только 1-на-1?',
          a: 'В группе сильные скучают, слабые не успевают. Программа строится под ученика.',
        },
        {
          q: 'Сколько нужно заниматься?',
          a: 'Обычно 2 месяца: 24 урока и 5 симуляций. Если дедлайн близко — 1 месяц.',
        },
        {
          q: 'Можно оплатить частями?',
          a: 'Да, 4 платежа без процентов. Первый — после диагностики.',
        },
        {
          q: 'Что если результата не будет?',
          a: 'После диагностики честно скажем, нужен ли курс. Без навязывания.',
        },
        {
          q: 'Как проходит диагностика?',
          a: '40 минут онлайн: тест, разбор ошибок и план на 8 недель.',
        },
      ],
      ctaTitle: 'Бесплатная диагностика',
      ctaText: '40 минут · онлайн · 0 ₸',
    },
    footer: {
      tagline: 'Подготовка к Digital SAT 1-на-1 для 9–11 классов.',
      geography: 'Онлайн по всему Казахстану',
      contactTitle: 'Связь',
      schedule: 'Ежедневно 09:00–21:00',
    },
  },
  kz: {
    nav: {
      steps: 'Қалай жұмыс істейді',
      results: 'Нәтижелер',
      pricing: 'Тарифтер',
      faq: 'FAQ',
      cta: 'Диагностика',
    },
    promo: {
      title: '−15% + гайд',
      subtitle: '15 минут ішінде жазылса',
      timerLabel: 'қалды',
      cta: 'Алу',
      expiredTitle: 'Диагностика тегін',
      expiredSubtitle: '40 минут · онлайн · 0 ₸',
      expiredCta: 'Жазылу',
      note: '−15% + гайд сізге бекітілді.',
    },
    hero: {
      chips: ['9–11 сынып', 'Оқытушылар 1550+', 'Онлайн · Қазақстан'],
      headline: 'SAT 1500+ 8 аптада — 1-де-1',
      subheadline:
        '9–11 сыныптар үшін. Онлайн, 1550+ оқытушылармен. Тегін диагностика — 40 минут.',
      formTitle: 'Тегін диагностика',
      formSubtitle: '40 минут · онлайн · 0 ₸',
      formNote: '15 минут ішінде WhatsApp-қа жазамыз. Қоңырау мен спам жоқ.',
      imageAlt: 'Digital SAT-қа жеке дайындық сабақтары',
      imageCaption: '1-де-1 сабақтар · онлайн',
      stats: [
        { value: '1-де-1', label: 'барлық сабақ' },
        { value: '+210', label: '2 айдағы орташа өсім' },
        { value: '1500+', label: 'NU грантына мақсат' },
        { value: '800+', label: '5 жылдағы оқушылар' },
      ],
    },
    steps: {
      kicker: 'Қалай жұмыс істейді',
      title: 'Мақсатты ұпайға 3 қадам',
      subtitle: 'Топтар мен артық тақырыптар жоқ.',
      items: [
        {
          index: '01',
          tag: '40 минут',
          title: 'Диагностика',
          text: 'Math және RW бойынша ұпайды және 3 әлсіз тақырыпты анықтаймыз.',
          points: ['Нақты ұпай', '3 әлсіз тақырып', '8 апталық жоспар'],
        },
        {
          index: '02',
          tag: '8 апта',
          title: '1-де-1 дайындық',
          text: '24 сабақ және 5 Bluebook симуляциясы.',
          points: ['24 сабақ', '5 симуляция', 'Error Log'],
        },
        {
          index: '03',
          tag: 'Емтихан',
          title: '1500+ шығу',
          text: 'Стратегия, тайминг және SAT-қа тіркелу.',
          points: ['Сынақ емтихан', 'Стратегия', 'Тіркелу'],
        },
      ],
      chips: ['Desmos', 'Bluebook', 'Error Log', 'Ата-анаға есеп', 'Үй тапсырмасы', 'Тіркелу'],
    },
    results: {
      title: '170–250 ұпай өсім',
      subtitle: '1–2 айда 1-де-1 сабақтармен.',
      cases: [
        {
          label: '11 сынып оқушысы',
          before: 1290,
          after: 1540,
          math: 790,
          rw: 750,
          admitted: 'NU, Computer Science · грант',
          note: '2 айда',
        },
        {
          label: '11 сынып оқушысы',
          before: 1360,
          after: 1550,
          math: 780,
          rw: 770,
          admitted: 'NYU Abu Dhabi · толық грант',
          note: '1 айда',
        },
        {
          label: '10 сынып оқушысы',
          before: 1210,
          after: 1470,
          math: 780,
          rw: 690,
          admitted: '10 сыныпта NU гранттық ұпайы',
          note: '2 айда',
        },
      ],
      benchmarksTitle: 'ЖОО мен грант ұпайлары',
      benchmarksSubtitle: 'Бағытты таңдаңыз.',
      destinations: [
        {
          id: 'nu',
          label: 'NU',
          schools: 'Nazarbayev University',
          min: 1350,
          grant: 1470,
          grade: '10–11 сынып',
          note: 'Direct Entry: 1460+ және Math 750+.',
        },
        {
          id: 'usa',
          label: 'АҚШ',
          schools: 'Ivy League, Stanford, MIT, NYUAD',
          min: 1480,
          grant: 1540,
          grade: '9–10 сынып',
          note: 'Financial Aid үшін жоғары SAT.',
        },
        {
          id: 'europe',
          label: 'Еуропа',
          schools: 'Bocconi, KU Leuven, Aalto',
          min: 1380,
          grant: 1480,
          grade: '10–11 сынып',
          note: 'Ішкі емтиханнан босатады.',
        },
        {
          id: 'asia',
          label: 'Азия',
          schools: 'HKU, HKUST, KAIST, NUS',
          min: 1450,
          grant: 1530,
          grade: '10 сынып',
          note: 'Стипендия 1500+ ұпайға байланысты.',
        },
      ],
    },
    pricing: {
      kicker: 'Тарифтер',
      title: 'Форматты таңдаңыз',
      subtitle: 'Барлық сабақ 1-де-1. Төлемді 4 бөлікке бөлуге болады.',
      packageLabel: 'Пакет',
      perLessonLabel: 'Сабаққа',
      perLessonUnit: '1 сабақ үшін',
      featuredLabel: 'Ең тиімді',
      targetLabel: 'Мақсат:',
      tariffs: [
        {
          id: 'per_lesson',
          name: 'Сабақ сайын',
          tag: '1 сабақ · 60 мин',
          price: 10000,
          perLessonPrice: 10000,
          unit: '1 сабақ үшін',
          target: 'Нақты тақырыпты талдау',
          points: ['Жеке сабақ 1-де-1', 'Desmos және қиын тақырыптар', 'Үй тапсырмасын тексеру'],
          cta: 'Жазылу',
        },
        {
          id: 'course_2m',
          name: '2 айлық курс',
          tag: '24 сабақ · 5 симуляция',
          price: 210000,
          oldPrice: 240000,
          perLessonPrice: 8750,
          oldPerLessonPrice: 10000,
          unit: '24 сабақ үшін',
          target: '+180–250 ұпай',
          points: ['24 сабақ 1-де-1', '5 Bluebook симуляциясы', 'Ата-анаға есеп'],
          cta: 'Курсты таңдау',
          featured: true,
        },
        {
          id: 'course_1m',
          name: '1 айлық курс',
          tag: '12 сабақ · 2 симуляция',
          price: 110000,
          oldPrice: 120000,
          perLessonPrice: 9167,
          oldPerLessonPrice: 10000,
          unit: '12 сабақ үшін',
          target: '+90–140 ұпай',
          points: ['12 сабақ 1-де-1', '2 Bluebook симуляциясы', 'Дедлайнға жоспар'],
          cta: 'Курсты таңдау',
        },
      ],
      installmentPrefix: 'немесе 4 төлем',
      promoBadge: '−15% промо',
      comparisonTitle: 'Айырмашылығы',
      comparison: [
        { label: 'Сабақ саны', perLesson: '1', course1m: '12', course2m: '24' },
        { label: 'Симуляция', perLesson: '—', course1m: '2', course2m: '5' },
        { label: 'Сабақ бағасы (база)', perLesson: '10 000 ₸', course1m: '9 167 ₸', course2m: '8 750 ₸' },
        { label: 'Ата-анаға есеп', perLesson: '—', course1m: '2', course2m: 'әр 2 апта' },
      ],
      diagnosticTitle: 'Алдымен — тегін диагностика',
      diagnosticText: '40 минут. Міндеттемесіз.',
      diagnosticCta: 'Жазылу',
    },
    faq: {
      kicker: 'FAQ',
      title: 'Жиі қойылатын сұрақтар',
      subtitle: 'Формат, төлем және нәтиже туралы қысқаша.',
      items: [
        {
          q: 'Неге тек 1-де-1?',
          a: 'Топта мықтылар зерігеді, әлсіздер үлгермейді. Бағдарлама оқушыға бейімделеді.',
        },
        {
          q: 'Қанша уақыт керек?',
          a: 'Әдетте 2 ай: 24 сабақ және 5 симуляция. Дедлайн жақын болса — 1 ай.',
        },
        {
          q: 'Төлемді бөліп төлеуге бола ма?',
          a: 'Иә, 4 төлем, пайызсыз. Біріншісі диагностикадан кейін.',
        },
        {
          q: 'Нәтиже болмаса ше?',
          a: 'Диагностикадан кейін курс керек пе, шынымен айтамыз. Күштеусіз.',
        },
        {
          q: 'Диагностика қалай өтеді?',
          a: '40 минут онлайн: тест, қате талдау және 8 апталық жоспар.',
        },
      ],
      ctaTitle: 'Тегін диагностика',
      ctaText: '40 минут · онлайн · 0 ₸',
    },
    footer: {
      tagline: '9–11 сыныптарға Digital SAT-қа 1-де-1 дайындық.',
      geography: 'Қазақстан бойынша онлайн',
      contactTitle: 'Байланыс',
      schedule: 'Күн сайын 09:00–21:00',
    },
  },
};
