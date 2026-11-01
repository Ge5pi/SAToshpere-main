import {
  ComparisonRow,
  FaqItem,
  LeadStatus,
  Locale,
  PlanId,
  StudentCase,
  TariffCardData,
  UniversityDestination,
} from '../types';

export interface TranslationContent {
  seo: {
    htmlLang: string;
    title: string;
    description: string;
  };
  nav: {
    brand: string;
    program: string;
    results: string;
    pricing: string;
    faq: string;
    cta: string;
  };
  hero: {
    regionalLine: string;
    headline: string;
    subheadline: string;
    formTitle: string;
    formSubtitle: string;
    imageAlt: string;
    imageCaption: string;
    stats: {
      value: string;
      label: string;
      context: string;
    }[];
  };
  form: {
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    gradeLabel: string;
    gradeSuffix: string;
    planLabel: string;
    submitDiagnostic: string;
    submitCourse: string;
    submitting: string;
    privacyNote: string;
    errorName: string;
    errorPhone: string;
    errorNetwork: string;
    successTitle: string;
    successBody: string;
    successReset: string;
    planNames: Record<PlanId, string>;
    planCardOptions: {
      id: 'diagnostic' | 'course_2m' | 'course_1m' | 'per_lesson';
      title: string;
      price: string;
      meta: string;
    }[];
  };
  program: {
    kicker: string;
    title: string;
    subtitle: string;
    mentorImageAlt: string;
    mentorImageCaption: string;
    mockImageAlt: string;
    mockImageCaption: string;
    months: {
      index: string;
      period: string;
      title: string;
      description: string;
      deliverables: string[];
    }[];
  };
  results: {
    kicker: string;
    title: string;
    subtitle: string;
    beforeAfterLabel: string;
    breakdownLabel: string;
    admittedLabel: string;
    cases: StudentCase[];
    benchmarksTitle: string;
    benchmarksSubtitle: string;
    colMinScore: string;
    colGrantScore: string;
    colStartGrade: string;
    destinations: UniversityDestination[];
  };
  pricing: {
    kicker: string;
    title: string;
    subtitle: string;
    modePackageTotal: string;
    modePerLesson: string;
    perLessonSuffix: string;
    diagnosticBannerTitle: string;
    diagnosticBannerDesc: string;
    diagnosticBannerCta: string;
    featuredLabel: string;
    targetLabel: string;
    tariffs: TariffCardData[];
    matrixTitle: string;
    filterAll: string;
    filterDiffs: string;
    colParameter: string;
    colPerLesson: string;
    colCourse1m: string;
    colCourse2m: string;
    rows: ComparisonRow[];
  };
  faq: {
    kicker: string;
    title: string;
    subtitle: string;
    items: FaqItem[];
    bottomCtaTitle: string;
    bottomCtaDesc: string;
  };
  footer: {
    tagline: string;
    geography: string;
    contactTitle: string;
    scheduleLine: string;
    navTitle: string;
    adminButton: string;
    copyright: string;
  };
  modal: {
    titleDiagnostic: string;
    titleCourse: string;
    selectedFormatPrefix: string;
    closeAria: string;
  };
  crm: {
    backToSite: string;
    title: string;
    subtitle: string;
    signInPromptTitle: string;
    signInPromptDesc: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signInButton: string;
    invalidPasswordError: string;
    refreshButton: string;
    signOutButton: string;
    kpiTotal: string;
    kpiNew: string;
    kpiDiagnostic: string;
    kpiEnrolled: string;
    searchPlaceholder: string;
    exportCsv: string;
    allStatuses: string;
    allPlans: string;
    statusLabels: Record<LeadStatus, string>;
    paymentModeLabels: Record<'package_total' | 'per_lesson_view' | 'full_3m' | 'monthly', string>;
    emptyLeads: string;
    colStudent: string;
    colContacts: string;
    colProgram: string;
    colSource: string;
    colStatus: string;
    colNotes: string;
    saveNote: string;
    savedNote: string;
    notesPlaceholder: string;
    whatsappAction: string;
    deleteAction: string;
    confirmDelete: string;
    cancelDelete: string;
  };
}

export const TRANSLATIONS: Record<Locale, TranslationContent> = {
  ru: {
    seo: {
      htmlLang: 'ru',
      title: 'SATosphere — Индивидуальная подготовка к Digital SAT в Казахстане',
      description:
        'Индивидуальная подготовка 1-на-1 к Digital SAT для 9–11 классов в Казахстане. Курсы на 1 и 2 месяца до 1450–1550+ для грантов NU и США. Бесплатная диагностика!',
    },
    nav: {
      brand: 'SATosphere',
      program: 'Формат 1-на-1',
      results: 'Кейсы',
      pricing: 'Тарифы',
      faq: 'Вопросы',
      cta: 'Бесплатная диагностика',
    },
    hero: {
      regionalLine: 'Казахстан · Только индивидуально 1-на-1 · 9–11 классы · Алматы, Астана и онлайн',
      headline: 'Индивидуальная подготовка 1-на-1 к Digital SAT до 1450–1550+ баллов',
      subheadline:
        'Никаких общих групп и потери времени на уже знакомые темы. Готовим школьников 9–11 классов Казахстана один на один с экспертом под гранты в Назарбаев Университет (NU), США, Европу и Азию. Начните с бесплатной диагностики уровня.',
      formTitle: 'Бесплатная диагностика Digital SAT 1-на-1 + персональный план',
      formSubtitle:
        'За 40 минут определим точный текущий балл по Math и Reading & Writing, найдем точки быстрого роста и рассчитаем план на 1 или 2 месяца.',
      imageAlt: 'Индивидуальная подготовка школьников 9–11 классов Казахстана к Digital SAT в SATosphere',
      imageCaption: 'Персональные занятия 1-на-1 с преподавателями 1550+ · Гибкий график под нагрузку в НИШ, РФМШ, БИЛ и школе',
      stats: [
        {
          value: '1-на-1',
          label: '100% внимания преподавателя на уроке',
          context: 'Темп, домашка и разбор ошибок строятся исключительно вокруг слабых зон вашего ребенка',
        },
        {
          value: '+210',
          label: 'средний прирост за курс из 24 уроков (2 месяца)',
          context: 'В 2 раза быстрее групповых курсов за счет точечной проработки ловушек College Board',
        },
        {
          value: '1500+',
          label: 'целевая планка для грантов NU и зарубежных вузов',
          context: 'Готовим на результат для Nazarbayev University, NYUAD, Bocconi, HKUST и KAIST',
        },
        {
          value: '8 750 ₸',
          label: 'стоимость индивидуального урока в курсе на 2 месяца',
          context: 'Прозрачные тарифы: 10 000 ₸ разово, 110 000 ₸ за 12 уроков или 210 000 ₸ за 24 урока',
        },
      ],
    },
    form: {
      nameLabel: 'Имя ученика или родителя',
      namePlaceholder: 'Например, Айгерим Сатпаева',
      phoneLabel: 'Номер WhatsApp для связи',
      phonePlaceholder: '+7 (701) 000-00-00',
      gradeLabel: 'Класс обучения',
      gradeSuffix: 'класс',
      planLabel: 'Формат индивидуальных занятий',
      submitDiagnostic: 'Записаться на бесплатную диагностику',
      submitCourse: 'Забронировать индивидуальный тариф',
      submitting: 'Отправляем заявку...',
      privacyNote: 'Контактные данные защищены и используются только для подбора удобного времени диагностики.',
      errorName: 'Укажите имя (минимум 2 символа).',
      errorPhone: 'Введите корректный казахстанский номер в формате +7 (7XX) XXX-XX-XX.',
      errorNetwork: 'Не удалось отправить заявку. Проверьте интернет-соединение и попробуйте еще раз.',
      successTitle: 'Заявка в SATosphere принята',
      successBody:
        'Куратор SATosphere напишет вам в WhatsApp в течение 15 минут в рабочее время, согласует удобный слот для бесплатной индивидуальной диагностики и ответит на все вопросы по программе.',
      successReset: 'Отправить еще одну заявку',
      planNames: {
        diagnostic: 'Бесплатная диагностика SAT 1-на-1 (0 ₸)',
        per_lesson: 'Базовый тариф — Поурочно (10 000 ₸ / урок)',
        course_1m: 'Курс 1 месяц — 12 уроков 1-на-1 (110 000 ₸)',
        course_2m: 'Курс 2 месяца — 24 урока 1-на-1 (210 000 ₸)',
        standard_group: 'Архивный тариф (Standard)',
        intensive_pro: 'Архивный тариф (Intensive)',
        individual_vip: 'Архивный тариф (VIP 1-на-1)',
      },
      planCardOptions: [
        {
          id: 'diagnostic',
          title: 'Диагностика 1-на-1',
          price: '0 ₸',
          meta: '40 мин · Бесплатный разбор уровня',
        },
        {
          id: 'course_2m',
          title: 'Курс на 2 месяца',
          price: '210 000 ₸',
          meta: '24 урока · Выгода 30 000 ₸',
        },
        {
          id: 'course_1m',
          title: 'Курс на 1 месяц',
          price: '110 000 ₸',
          meta: '12 уроков · Выгода 10 000 ₸',
        },
        {
          id: 'per_lesson',
          title: 'Поурочно · Базовый',
          price: '10 000 ₸',
          meta: '1 урок · Гибкий график',
        },
      ],
    },
    program: {
      kicker: 'Персональная траектория 1-на-1 · 12 или 24 индивидуальных урока',
      title: 'Как устроена индивидуальная подготовка в SATosphere без воды и ожидания группы',
      subtitle:
        'В группах сильные ученики скучают на простых задачах, а на сложных не успевают задать вопрос. На индивидуальных уроках в SATosphere каждая минута работает на ваш целевой балл в секциях Math и Reading & Writing.',
      mentorImageAlt: 'Индивидуальный разбор стратегий Digital SAT с преподавателем SATosphere',
      mentorImageCaption: 'Персональные тренеры с официальными сертификатами SAT 1550–1590 (99-й перцентиль)',
      mockImageAlt: 'Ученица решает адаптивный пробный экзамен Bluebook Digital SAT',
      mockImageCaption: 'Личный трекер прогресса и разбор каждого адаптивного пробника Bluebook один на один',
      months: [
        {
          index: '01',
          period: 'Этап 1 · Уроки 1–8',
          title: 'Точечное закрытие пробелов, скоростной Desmos и грамматика',
          description:
            'После входной диагностики мы пропускаем темы, которые ученик уже решает без ошибок, и сразу закрываем уязвимые разделы алгебры, геометрии и Standard English Conventions. Ставим навык решения до 40% задач Math за 15–20 секунд в калькуляторе Desmos.',
          deliverables: [
            'Персональный учебный план под дедлайн ближайшего официального экзамена',
            'Постановка скоростных техник Desmos и англоязычной математической терминологии',
            'Первые 2 адаптивные симуляции Bluebook с пошаговым разбором на уроке',
          ],
        },
        {
          index: '02',
          period: 'Этап 2 · Уроки 9–16',
          title: 'Логика Reading & Writing и стабильный выход в Hard Module 2',
          description:
            'Разбираем один на один сложные научные и гуманитарные отрывки, задачи Command of Evidence, Inferences и Vocabulary in Context. Тренируем безошибочное прохождение первого модуля, чтобы алгоритм экзамена гарантированно открывал верхний диапазон 700–800 баллов.',
          deliverables: [
            'Ведение персонального журнала ошибок (Error Log) — ни одна ошибка не остается без разбора',
            'Индивидуальная подборка сложных заданий College Board именно по вашим слабым типам вопросов',
            'Контрольный срез прогресса и промежуточный отчет для родителей в WhatsApp',
          ],
        },
        {
          index: '03',
          period: 'Этап 3 · Уроки 17–24 (Пик формы на курсе 2 месяца)',
          title: 'Задачи уровня 750–800, стресс-тайминг и полная готовность к сдаче',
          description:
            'На финальном блоке 2-месячного курса оттачиваем самые дорогие задачи повышенной сложности, убираем потери баллов по невнимательности и формируем запас 5–7 минут на проверку в каждой секции. Сопровождаем регистрацию в тест-центрах Казахстана.',
          deliverables: [
            'Серия финальных прокторинговых симуляций в точном интерфейсе официального Bluebook',
            'Персональная тактика распределения времени на реальном экзамене',
            'Помощь с регистрацией на Digital SAT (Алматы, Астана, Шымкент) и отправкой баллов в вузы',
          ],
        },
      ],
    },
    results: {
      kicker: 'Результаты индивидуальных учеников SATosphere из Казахстана',
      title: 'Реальный рост на 170–250 баллов благодаря работе один на один с тренером',
      subtitle:
        'Когда программа адаптирована под конкретного школьника 9–11 класса, результат достигается за 1–2 месяца вместо полугода общих лекций.',
      beforeAfterLabel: 'Рост баллов 1-на-1',
      breakdownLabel: 'Секции экзамена',
      admittedLabel: 'Результат поступления',
      cases: [
        {
          name: 'Алихан Нурланов',
          cityAndSchool: 'Алматы · РФМШ',
          grade: '11 класс',
          scoreBefore: 1290,
          scoreAfter: 1540,
          mathScore: 790,
          rwScore: 750,
          duration: 'Курс 2 месяца · 24 урока 1-на-1',
          admittedTo: 'Nazarbayev University (State Grant, Computer Science) и HKUST',
          quote:
            'В РФМШ математика сильная, поэтому в группе я бы просто терял время. В SATosphere мы за 3 урока довели Math с Desmos до 790, а остальные 21 занятие прицельно били по сложным текстам Reading.',
        },
        {
          name: 'Дария Касымова',
          cityAndSchool: 'Астана · НИШ IB',
          grade: '11 класс',
          scoreBefore: 1360,
          scoreAfter: 1550,
          mathScore: 780,
          rwScore: 770,
          duration: 'Курс 1 месяц · 12 уроков 1-на-1',
          admittedTo: 'NYU Abu Dhabi (Full Ride стипендия) и Bocconi University',
          quote:
            'До дедлайна оставался ровно месяц, нужно было пробить потолок с 1360 до 1530+. За 12 индивидуальных занятий разобрали каждую мою типовую ловушку во втором модуле Reading & Writing.',
        },
        {
          name: 'Санжар Тлеуберген',
          cityAndSchool: 'Шымкент · БИЛ',
          grade: '10 класс',
          scoreBefore: 1210,
          scoreAfter: 1470,
          mathScore: 780,
          rwScore: 690,
          duration: 'Курс 2 месяца · 24 урока 1-на-1',
          admittedTo: 'Досрочно закрыл грантовый балл для NU в 10 классе',
          quote:
            'Занимался 3 раза в неделю онлайн в удобное время после олимпиадных тренировок. На уроках 1-на-1 не отсидишься — преподаватель видит ход мысли в каждой задаче и сразу правит логику.',
        },
      ],
      benchmarksTitle: 'Ориентиры баллов Digital SAT для вузов и грантов (2026/2027)',
      benchmarksSubtitle:
        'Выберите направление поступления, чтобы увидеть конкурентный балл и рекомендуемый класс старта подготовки.',
      colMinScore: 'Конкурентный порог',
      colGrantScore: 'Цель для полного гранта',
      colStartGrade: 'Оптимальный старт',
      destinations: [
        {
          id: 'nu',
          regionLabel: 'Казахстан (NU)',
          universities: 'Nazarbayev University — Direct Entry & Foundation Grant',
          minCompetitiveScore: 1350,
          fullGrantScore: 1470,
          recommendedGrade: '10–11 класс',
          note: 'Для прямого поступления (Direct) и топовых специальностей SEDS/SSH рекомендуем целиться от 1460+ с Math не ниже 750.',
        },
        {
          id: 'usa',
          regionLabel: 'США и NYUAD',
          universities: 'Ivy League, Stanford, MIT, NYU Abu Dhabi, Top-50 Liberal Arts',
          minCompetitiveScore: 1480,
          fullGrantScore: 1540,
          recommendedGrade: '9–10 класс',
          note: 'Высокий SAT критичен для международных аппликантов из Казахстана, претендующих на Need-Based Financial Aid.',
        },
        {
          id: 'europe',
          regionLabel: 'Европа',
          universities: 'Bocconi (Италия), KU Leuven, Aalto (Финляндия), вузы Нидерландов',
          minCompetitiveScore: 1380,
          fullGrantScore: 1480,
          recommendedGrade: '10–11 класс',
          note: 'Во многих англоязычных программах Европы высокий балл Digital SAT освобождает от внутреннего вступительного теста и дает грант на обучение.',
        },
        {
          id: 'asia',
          regionLabel: 'Гонконг и Корея',
          universities: 'HKU, HKUST, CUHK, KAIST, Yonsei Underwood, NUS',
          minCompetitiveScore: 1450,
          fullGrantScore: 1530,
          recommendedGrade: '10 класс',
          note: 'Университеты Гонконга и Южной Кореи напрямую привязывают размер академической стипендии (Merit Scholarship) к баллу SAT от 1500+.',
        },
      ],
    },
    pricing: {
      kicker: 'Только индивидуальные занятия 1-на-1 · Прозрачные тарифы SATosphere',
      title: 'Выберите удобный пакет индивидуального обучения с преподавателем',
      subtitle:
        'На всех тарифах вы занимаетесь строго один на один с экспертом Digital SAT. Базовая ставка — 10 000 ₸ за урок, а при выборе курса на 1 или 2 месяца вы фиксируете скидку до 30 000 ₸ и получаете полный комплект симуляций Bluebook.',
      modePackageTotal: 'Стоимость пакета целиком',
      modePerLesson: 'В пересчете за 1 урок',
      perLessonSuffix: 'за 1 индивидуальный урок',
      diagnosticBannerTitle: 'Начните с бесплатной индивидуальной диагностики (0 ₸)',
      diagnosticBannerDesc:
        'Прежде чем выбирать пакет на 12 или 24 урока, пройдите 40-минутную диагностику Digital SAT: точно оценим текущий уровень и честно скажем, сколько занятий нужно под вашу цель.',
      diagnosticBannerCta: 'Пройти диагностику бесплатно (0 ₸)',
      featuredLabel: 'Самый выгодный пакет · Экономия 30 000 ₸',
      targetLabel: 'Оптимально для:',
      tariffs: [
        {
          id: 'per_lesson',
          name: 'Базовый · Поурочно',
          subtitle: 'Разовые индивидуальные уроки 1-на-1 без привязки к пакету — удобно для точечного разбора тем перед экзаменом.',
          formatLine: '1 урок 1-на-1 · Гибкая запись по запросу',
          lessonsCount: 1,
          packagePrice: 10000,
          perLessonPrice: 10000,
          packageUnitLabel: 'базовая цена за 1 индивидуальный урок',
          scheduleSummary: 'Индивидуальный урок 60 мин с экспертом Digital SAT',
          targetScore: 'Закрытие отдельных сложных тем или разбор пробника',
          highlights: [
            'Персональное занятие 1-на-1 по секции Math или Reading & Writing',
            'Разбор конкретных сложных задач ученика и техник Desmos',
            'Домашнее задание с проверкой по пройденной теме урока',
            'Возможность в любой момент перейти на пакет 12 или 24 уроков',
          ],
          ctaLabel: 'Записаться на разовый урок',
        },
        {
          id: 'course_2m',
          name: 'Курс на 2 месяца',
          subtitle: 'Полная системная подготовка 1-на-1 из 24 уроков от текущего уровня до целевых 1450–1550+ баллов под грант.',
          formatLine: '24 урока 1-на-1 · Выгода 30 000 ₸',
          lessonsCount: 24,
          packagePrice: 210000,
          oldPackagePrice: 240000,
          savingsBadge: 'Выгода 30 000 ₸',
          perLessonPrice: 8750,
          oldPerLessonPrice: 10000,
          packageUnitLabel: 'за 24 индивидуальных урока (2 месяца)',
          scheduleSummary: '3 занятия в неделю 1-на-1 + 5 полных симуляций Bluebook',
          targetScore: 'Системный рост +180–250 баллов до 1450–1550+',
          isFeatured: true,
          highlights: [
            '24 персональных урока 1-на-1 (цена урока снижается до 8 750 ₸)',
            'Комплексная проработка обеих секций: SAT Math + Reading & Writing',
            '5 полноформатных симуляций Bluebook + ведение личного Error Log',
            'Отчеты родителям каждые 2 недели и помощь с регистрацией на SAT в РК',
          ],
          ctaLabel: 'Выбрать курс на 2 месяца',
        },
        {
          id: 'course_1m',
          name: 'Курс на 1 месяц',
          subtitle: 'Интенсивный спринт из 12 индивидуальных занятий для быстрого рывка в баллах к ближайшей дате сдачи.',
          formatLine: '12 уроков 1-на-1 · Выгода 10 000 ₸',
          lessonsCount: 12,
          packagePrice: 110000,
          oldPackagePrice: 120000,
          savingsBadge: 'Выгода 10 000 ₸',
          perLessonPrice: 9167,
          oldPerLessonPrice: 10000,
          packageUnitLabel: 'за 12 индивидуальных уроков (1 месяц)',
          scheduleSummary: '3 занятия в неделю 1-на-1 + 2 полные симуляции Bluebook',
          targetScore: 'Спринт +90–140 баллов за 4 недели',
          highlights: [
            '12 персональных уроков 1-на-1 по индивидуальному расписанию',
            'Полный доступ к закрытой базе реальных заданий College Board',
            '2 адаптивных пробных экзамена Bluebook с личным разбором ошибок',
            'Итоговый аналитический отчет о прогрессе для родителей в WhatsApp',
          ],
          ctaLabel: 'Выбрать курс на 1 месяц',
        },
      ],
      matrixTitle: 'Сравнение пакетов индивидуального обучения 1-на-1',
      filterAll: 'Все параметры (9)',
      filterDiffs: 'Только отличия пакетов',
      colParameter: 'Параметр индивидуальной подготовки',
      colPerLesson: 'Поурочно (10 000 ₸)',
      colCourse1m: '1 месяц · 12 уроков (110 000 ₸)',
      colCourse2m: '2 месяца · 24 урока (210 000 ₸)',
      rows: [
        {
          feature: 'Формат работы с преподавателем',
          isDifference: false,
          perLesson: 'Строго 1-на-1',
          course1m: 'Строго 1-на-1',
          course2m: 'Строго 1-на-1',
        },
        {
          feature: 'Входная диагностика Digital SAT и персональный план',
          isDifference: false,
          perLesson: 'Бесплатно (0 ₸)',
          course1m: 'Бесплатно (0 ₸)',
          course2m: 'Бесплатно (0 ₸)',
        },
        {
          feature: 'Количество индивидуальных занятий в пакете',
          isDifference: true,
          perLesson: '1 урок (по запросу)',
          course1m: '12 уроков (4 недели)',
          course2m: '24 урока (8 недель)',
        },
        {
          feature: 'Стоимость в пересчете за 1 индивидуальный урок',
          isDifference: true,
          perLesson: '10 000 ₸ / урок',
          course1m: '9 167 ₸ / урок (−10 000 ₸)',
          course2m: '8 750 ₸ / урок (−30 000 ₸)',
        },
        {
          feature: 'Закрепление постоянного слота в расписании тренера',
          isDifference: true,
          perLesson: 'Свободные окна',
          course1m: 'Приоритетное закрепление',
          course2m: 'Приоритетное на весь поток',
        },
        {
          feature: 'Адаптивные пробные экзамены Bluebook с разбором',
          isDifference: true,
          perLesson: 'По запросу на уроке',
          course1m: '2 полные симуляции',
          course2m: '5 полных симуляций',
        },
        {
          feature: 'Персональный трекер ошибок (Error Log) и база задач',
          isDifference: true,
          perLesson: 'Материалы к уроку',
          course1m: 'Полный доступ на 1 месяц',
          course2m: 'Полный доступ до сдачи экзамена',
        },
        {
          feature: 'Отчетность для родителей в WhatsApp о динамике баллов',
          isDifference: true,
          perLesson: 'Краткий итог по запросу',
          course1m: 'Отчет в середине и финале месяца',
          course2m: 'Регулярный трекинг каждые 2 недели',
        },
        {
          feature: 'Помощь с регистрацией на тест-центр в РК и стратегией подачи',
          isDifference: true,
          perLesson: 'Консультация на уроке',
          course1m: 'Пошаговая инструкция',
          course2m: 'Полное сопровождение под ключ',
        },
      ],
    },
    faq: {
      kicker: 'Ответы на частые вопросы родителей и абитуриентов',
      title: 'Все об индивидуальной подготовке к Digital SAT в SATosphere',
      subtitle:
        'Отвечаем на главные вопросы учеников 9–11 классов и родителей о формате 1-на-1, сроках подготовки, стоимости и поступлении на грант.',
      items: [
        {
          question: 'Почему SATosphere фокусируется именно на индивидуальных уроках 1-на-1, а не на группах?',
          answer:
            'У каждого школьника 9–11 класса в Казахстане свой профиль: кто-то учится в РФМШ или НИШ и уже решает математику на 720+, но теряет баллы на длинных текстах Reading, а кому-то нужно подтянуть функции и грамматику с базы. В формате 1-на-1 мы не тратим ни минуты на чужие вопросы — за 12 или 24 урока ученик проходит дистанцию, на которую в группах уходит 4–6 месяцев.',
        },
        {
          question: 'Какой пакет лучше выбрать: 1 месяц (12 уроков) или 2 месяца (24 урока)?',
          answer:
            'Курс на 1 месяц (12 уроков за 110 000 ₸) идеально подходит тем, кто уже сдавал пробный SAT на 1320+ и хочет за 4 недели пробить планку 1450–1500+ перед близкой датой экзамена. Курс на 2 месяца (24 урока за 210 000 ₸, выгода 30 000 ₸) — это фундаментальная подготовка обеих секций с 5 симуляциями Bluebook для уверенного выхода на грантовые баллы с нуля.',
        },
        {
          question: 'Можно ли сначала попробовать, прежде чем оплачивать курс на месяц или два?',
          answer:
            'Да! Первый шаг для каждого ученика — бесплатная входная диагностика (0 ₸), где мы определяем точный стартовый балл и знакомим с методикой. Кроме того, вы всегда можете взять разовый индивидуальный урок по базовому тарифу 10 000 ₸ и затем перейти на выгодный пакет из 12 или 24 занятий.',
        },
        {
          question: 'В каком классе лучше начинать подготовку: в 9, 10 или 11?',
          answer:
            'В 9–10 классах индивидуальный формат позволяет спокойно сдать SAT на 1500+ заранее (сертификат действует 5 лет) и освободить 11 класс под эссе и IELTS. В 11 классе индивидуальный график 3 раза в неделю спасает при жестких дедлайнах подачи в Назарбаев Университет и зарубежные вузы.',
        },
        {
          question: 'Сколько баллов SAT нужно для гранта в Назарбаев Университет (NU) и зарубежные вузы?',
          answer:
            'Минимальный порог конкурса в NU начинается от 1240, но для уверенного получения государственного гранта Direct Entry рекомендуем целиться в 1460–1520+ баллов. Для стипендий в топ-вузах США, Гонконга (HKU, HKUST), Кореи (KAIST) и Европы (Bocconi) оптимальная цель — 1480–1550+.',
        },
        {
          question: 'Как согласуется расписание индивидуальных уроков и можно ли переносить занятия?',
          answer:
            'График составляется персонально под расписание школы, кружков и часовой пояс ученика в любом городе Казахстана (Алматы, Астана, Шымкент, Караганда, Атырау и др.). При предупреждении заранее индивидуальный урок бесплатно переносится на другой удобный день без сгорания.',
        },
        {
          question: 'Какой уровень английского языка нужен для старта занятий?',
          answer:
            'Оптимальный стартовый уровень для быстрого выхода на высокий балл — Intermediate (B1+ / IELTS 5.5+). На бесплатной диагностике мы проверим академический словарный запас и скорость чтения, чтобы сразу адаптировать сложность программы под ученика.',
        },
      ],
      bottomCtaTitle: 'Запишитесь на бесплатную диагностику 1-на-1 в SATosphere',
      bottomCtaDesc:
        'Оставьте имя и WhatsApp — проведем индивидуальную диагностику секций Math и Reading & Writing и подберем оптимальный план на 12 или 24 урока.',
    },
    footer: {
      tagline:
        'Школа индивидуальной подготовки 1-на-1 старшеклассников 9–11 классов Казахстана к экзамену Digital SAT для поступления на гранты в NU, США, Европу и Азию.',
      geography: 'Алматы · Астана · Шымкент · Онлайн 1-на-1 по всему Казахстану',
      contactTitle: 'Связь с куратором SATosphere',
      scheduleLine: 'Ежедневно с 09:00 до 21:00 (время Астаны, GMT+5)',
      navTitle: 'Навигация',
      adminButton: 'Кабинет куратора (CRM)',
      copyright:
        '© 2026 SATosphere. Все права защищены. SAT® является зарегистрированным товарным знаком College Board.',
    },
    modal: {
      titleDiagnostic: 'Запись на бесплатную диагностику Digital SAT 1-на-1',
      titleCourse: 'Бронирование индивидуального обучения в SATosphere',
      selectedFormatPrefix: 'Выбранный тариф:',
      closeAria: 'Закрыть окно записи',
    },
    crm: {
      backToSite: 'Вернуться на лендинг',
      title: 'CRM-панель заявок SATosphere',
      subtitle: 'Управление входящими заявками на диагностику и индивидуальные пакеты обучения.',
      signInPromptTitle: 'Вход в кабинет куратора SATosphere',
      signInPromptDesc:
        'Введите пароль администратора (переменная ADMIN_PASSWORD в .env) для доступа к заявкам и контактам учеников.',
      passwordLabel: 'Пароль администратора',
      passwordPlaceholder: 'Введите пароль доступа...',
      signInButton: 'Войти в CRM',
      invalidPasswordError: 'Неверный пароль администратора. Проверьте значение ADMIN_PASSWORD в .env.',
      refreshButton: 'Обновить',
      signOutButton: 'Выйти',
      kpiTotal: 'Всего заявок',
      kpiNew: 'Новые (ждут ответа)',
      kpiDiagnostic: 'Диагностика назначена',
      kpiEnrolled: 'Оплатили обучение',
      searchPlaceholder: 'Поиск по имени или номеру телефона...',
      exportCsv: 'Выгрузить CSV',
      allStatuses: 'Все статусы',
      allPlans: 'Все тарифы',
      statusLabels: {
        new: 'Новая заявка',
        contacted: 'Связались',
        diagnostic_scheduled: 'Диагностика назначена',
        enrolled: 'Оплатил курс',
        archived: 'В архиве',
      },
      paymentModeLabels: {
        package_total: 'Просмотр: Стоимость пакета',
        per_lesson_view: 'Просмотр: Цена за 1 урок',
        full_3m: 'Полный курс (архив)',
        monthly: 'Помесячно (архив)',
      },
      emptyLeads:
        'Заявок по выбранным фильтрам пока нет. Отправьте тестовую заявку с лендинга SATosphere, чтобы проверить воронку.',
      colStudent: 'Ученик и класс',
      colContacts: 'Телефон / WhatsApp',
      colProgram: 'Выбранный индивидуальный тариф',
      colSource: 'Источник рекламы (UTM)',
      colStatus: 'Статус воронки',
      colNotes: 'Заметка куратора',
      saveNote: 'Сохранить',
      savedNote: 'Сохранено',
      notesPlaceholder: 'Балл диагностики, удобные дни 1-на-1, цель вуза...',
      whatsappAction: 'Написать в WhatsApp',
      deleteAction: 'Удалить',
      confirmDelete: 'Подтвердить',
      cancelDelete: 'Отмена',
    },
  },
  kz: {
    seo: {
      htmlLang: 'kk',
      title: 'SATosphere — Қазақстанда Digital SAT емтиханына 1-де-1 жеке дайындық',
      description:
        'Қазақстанның 9–11 сынып оқушыларына арналған 1-де-1 жеке Digital SAT дайындығы. 1 және 2 айлық курстармен 1450–1550+ ұпай. Тегін диагностикаға жазылыңыз!',
    },
    nav: {
      brand: 'SATosphere',
      program: '1-де-1 форматы',
      results: 'Нәтижелер',
      pricing: 'Тарифтер',
      faq: 'Сұрақтар',
      cta: 'Тегін диагностика',
    },
    hero: {
      regionalLine: 'Қазақстан · Тек 1-де-1 жеке оқыту · 9–11 сыныптар · Алматы, Астана және онлайн',
      headline: 'Digital SAT емтиханына 1450–1550+ ұпайға дейін 1-де-1 жеке дайындық',
      subheadline:
        'Жалпы топтар мен таныс тақырыптарға уақыт жоғалту жоқ. Қазақстанның 9–11 сынып оқушыларын Назарбаев Университеті (NU), АҚШ, Еуропа және Азия гранттарына сарапшымен жеке дайындаймыз. Деңгейді анықтайтын тегін диагностикадан бастаңыз.',
      formTitle: 'Тегін 1-де-1 Digital SAT диагностикасы + жеке дайындық жоспары',
      formSubtitle:
        '40 минутта Math және Reading & Writing бөлімдері бойынша нақты ұпайыңызды анықтап, 1 немесе 2 айға жеке жоспар құрамыз.',
      imageAlt: 'SATosphere мектебінде Қазақстанның 9–11 сынып оқушыларын Digital SAT емтиханына жеке дайындау',
      imageCaption: '1550+ оқытушылармен 1-де-1 жеке сабақтар · НЗМ, РФМШ, БИЛ және мектеп кестесіне икемді уақыт',
      stats: [
        {
          value: '1-де-1',
          label: 'сабақта оқытушының 100% назары тек сізде',
          context: 'Оқу қарқыны, үй жұмысы және қатемен жұмыс тек оқушының әлсіз тұстарына бағытталады',
        },
        {
          value: '+210',
          label: '24 сабақтық курстағы (2 ай) орташа ұпай өсімі',
          context: 'College Board тұзақтарын жеке пысықтау арқылы топтық курстардан 2 есе жылдам нәтиже',
        },
        {
          value: '1500+',
          label: 'NU және шетелдік ЖОО гранттарына мақсатты меже',
          context: 'Nazarbayev University, NYUAD, Bocconi, HKUST және KAIST гранттарына дайындаймыз',
        },
        {
          value: '8 750 ₸',
          label: '2 айлық курстағы 1 жеке сабақтың құны',
          context: 'Ашық бағалар: 1 сабақ — 10 000 ₸, 12 сабақ (1 ай) — 110 000 ₸, 24 сабақ (2 ай) — 210 000 ₸',
        },
      ],
    },
    form: {
      nameLabel: 'Оқушының немесе ата-ананың аты-жөні',
      namePlaceholder: 'Мысалы, Әйгерім Сәтбаева',
      phoneLabel: 'WhatsApp байланыс нөмірі',
      phonePlaceholder: '+7 (701) 000-00-00',
      gradeLabel: 'Оқу сыныбы',
      gradeSuffix: 'сынып',
      planLabel: 'Жеке оқу форматы',
      submitDiagnostic: 'Тегін диагностикаға жазылу',
      submitCourse: 'Жеке тарифті брондау',
      submitting: 'Өтінім жіберілуде...',
      privacyNote: 'Байланыс деректері қорғалған және тек ыңғайлы диагностика уақытын белгілеу үшін қолданылады.',
      errorName: 'Аты-жөніңізді енгізіңіз (кемінде 2 таңба).',
      errorPhone: 'Қазақстандық нөмірді +7 (7XX) XXX-XX-XX форматында дұрыс енгізіңіз.',
      errorNetwork: 'Өтінімді жіберу мүмкін болмады. Интернет байланысын тексеріп, қайта көріңіз.',
      successTitle: 'SATosphere өтініміңіз қабылданды',
      successBody:
        'SATosphere кураторы жұмыс уақытында 15 минут ішінде WhatsApp арқылы хабарласып, тегін жеке диагностика уақытын келіседі және бағдарлама бойынша сұрақтарыңызға жауап береді.',
      successReset: 'Тағы бір өтінім жіберу',
      planNames: {
        diagnostic: 'Тегін 1-де-1 SAT диагностикасы (0 ₸)',
        per_lesson: 'Базалық тариф — 1 сабақ (10 000 ₸ / сабақ)',
        course_1m: '1 айлық курс — 12 жеке сабақ (110 000 ₸)',
        course_2m: '2 айлық курс — 24 жеке сабақ (210 000 ₸)',
        standard_group: 'Мұрағаттық тариф (Standard)',
        intensive_pro: 'Мұрағаттық тариф (Intensive)',
        individual_vip: 'Мұрағаттық тариф (VIP 1-де-1)',
      },
      planCardOptions: [
        {
          id: 'diagnostic',
          title: '1-де-1 диагностика',
          price: '0 ₸',
          meta: '40 мин · Деңгейді тегін анықтау',
        },
        {
          id: 'course_2m',
          title: '2 айлық курс',
          price: '210 000 ₸',
          meta: '24 сабақ · 30 000 ₸ үнем',
        },
        {
          id: 'course_1m',
          title: '1 айлық курс',
          price: '110 000 ₸',
          meta: '12 сабақ · 10 000 ₸ үнем',
        },
        {
          id: 'per_lesson',
          title: 'Сабақ сайын · Базалық',
          price: '10 000 ₸',
          meta: '1 сабақ · Икемді кесте',
        },
      ],
    },
    program: {
      kicker: '1-де-1 жеке траектория · 12 немесе 24 жеке сабақ',
      title: 'SATosphere мектебіндегі жеке дайындық топтық оқудан несімен тиімді',
      subtitle:
        'Топта мықты оқушылар оңай есептерде уақыт жоғалтады, ал қиын тақырыптарда сұрақ қоюға үлгермейді. SATosphere жеке сабақтарында әр минут сіздің Math және Reading & Writing ұпайыңызға жұмыс істейді.',
      mentorImageAlt: 'SATosphere оқытушысымен Digital SAT стратегияларын жеке талдау',
      mentorImageCaption: 'Ресми SAT 1550–1590 сертификаты бар жеке жаттықтырушылар (әлемдік 99-шы перцентиль)',
      mockImageAlt: 'Оқушы Bluebook Digital SAT сынақ емтиханын тапсыруда',
      mockImageCaption: 'Жеке прогресс трекері және әрбір Bluebook сынақ емтиханын 1-де-1 талдау',
      months: [
        {
          index: '01',
          period: '1-кезең · 1–8 сабақтар',
          title: 'Олқылықтарды нақты жабу, жылдам Desmos және грамматика',
          description:
            'Кіріспе диагностикадан кейін оқушы жақсы білетін тақырыптарды қайталамай, бірден алгебра, геометрия және Standard English Conventions әлсіз тұстарын жабамыз. Desmos калькуляторы арқылы Math есептерінің 40%-ын 15–20 секундта шығаруды үйретеміз.',
          deliverables: [
            'Жақын ресми емтихан күніне бейімделген жеке оқу жоспары',
            'Desmos жылдам тәсілдері мен ағылшынша математикалық терминологияны меңгеру',
            'Сабақта қадамдық талдауы бар алғашқы 2 адаптивті Bluebook симуляциясы',
          ],
        },
        {
          index: '02',
          period: '2-кезең · 9–16 сабақтар',
          title: 'Reading & Writing логикасы және Hard Module 2 деңгейіне тұрақты шығу',
          description:
            'Күрделі ғылыми және гуманитарлық мәтіндерді, Command of Evidence, Inferences және Vocabulary in Context тапсырмаларын 1-де-1 талдаймыз. 700–800 ұпайға жол ашатын екінші күрделі модульге қатесіз өтуді қалыптастырамыз.',
          deliverables: [
            'Жеке қателер журналын (Error Log) жүргізу — әрбір қате толық талданады',
            'Оқушының нақты әлсіз сұрақ түрлеріне арналған College Board есептер жинағы',
            'Аралық нәтиже бақылауы және ата-аналарға WhatsApp арқылы есеп беру',
          ],
        },
        {
          index: '03',
          period: '3-кезең · 17–24 сабақтар (2 айлық курстағы жоғары нәтиже)',
          title: '750–800 деңгейіндегі есептер, тайм-менеджмент және емтиханға толық дайындық',
          description:
            '2 айлық курстың шешуші кезеңінде ең жоғары ұпай беретін қиын тапсырмаларды шыңдап, мұқиятсыздықтан кететін қателерді жоямыз және әр бөлімде тексеруге 5–7 минут уақыт қорын қалдырамыз. Тест орталығына тіркелуді сүйемелдейміз.',
          deliverables: [
            'Ресми Bluebook интерфейсіндегі қорытынды прокторинг симуляциялары',
            'Нақты емтиханда уақытты тиімді бөлудің жеке тактикасы',
            'ҚР тест орталықтарына (Алматы, Астана, Шымкент) тіркелу және ЖОО-ға ұпай жіберу көмегі',
          ],
        },
      ],
    },
    results: {
      kicker: 'SATosphere жеке оқушыларының нәтижелері',
      title: 'Жаттықтырушымен 1-де-1 жұмыс арқасында 170–250 ұпайға нақты өсім',
      subtitle:
        'Бағдарлама 9–11 сынып оқушысына жеке бейімделгенде, жарты жылдық жалпы дәрістердің орнына нәтижеге 1–2 айда жетесіз.',
      beforeAfterLabel: '1-де-1 ұпай өсімі',
      breakdownLabel: 'Емтихан бөлімдері',
      admittedLabel: 'Түскен университеті',
      cases: [
        {
          name: 'Әлихан Нұрланов',
          cityAndSchool: 'Алматы · РФМШ',
          grade: '11 сынып',
          scoreBefore: 1290,
          scoreAfter: 1540,
          mathScore: 790,
          rwScore: 750,
          duration: '2 айлық курс · 24 жеке сабақ',
          admittedTo: 'Nazarbayev University (Мемлекеттік грант, Computer Science) және HKUST',
          quote:
            'РФМШ-да математикам мықты болғандықтан, топта уақыт жоғалтар едім. SATosphere-де 3 сабақта Desmos арқылы Math-ты 790-ға жеткізіп, қалған 21 сабақты толықтай Reading күрделі мәтіндеріне арнадық.',
        },
        {
          name: 'Дәрия Қасымова',
          cityAndSchool: 'Астана · НЗМ IB',
          grade: '11 сынып',
          scoreBefore: 1360,
          scoreAfter: 1550,
          mathScore: 780,
          rwScore: 770,
          duration: '1 айлық курс · 12 жеке сабақ',
          admittedTo: 'NYU Abu Dhabi (Толық грант) және Bocconi University',
          quote:
            'Дедлайнға дейін тура бір ай қалған еді, 1360-тан 1530+ деңгейіне шығу керек болды. 12 жеке сабақта Reading & Writing екінші модуліндегі барлық қателерімді толық жойдық.',
        },
        {
          name: 'Санжар Тілеуберген',
          cityAndSchool: 'Шымкент · БИЛ',
          grade: '10 сынып',
          scoreBefore: 1210,
          scoreAfter: 1470,
          mathScore: 780,
          rwScore: 690,
          duration: '2 айлық курс · 24 жеке сабақ',
          admittedTo: '10 сыныпта NU гранттық межесін мерзімінен бұрын орындады',
          quote:
            'Олимпиада дайындығынан кейін өзіме ыңғайлы уақытта аптасына 3 рет онлайн оқыдым. 1-де-1 сабақта оқытушы әр есептегі ойлау барысыңды көріп, қатені сол сәтте түзетеді.',
        },
      ],
      benchmarksTitle: 'ЖОО мен гранттарға арналған Digital SAT ұпай межелері (2026/2027)',
      benchmarksSubtitle:
        'Бәсекеге қабілетті ұпайды және дайындықты бастауға ұсынылатын сыныпты көру үшін бағытты таңдаңыз.',
      colMinScore: 'Бәсекелік шек',
      colGrantScore: 'Толық грант мақсаты',
      colStartGrade: 'Оңтайлы бастау',
      destinations: [
        {
          id: 'nu',
          regionLabel: 'Қазақстан (NU)',
          universities: 'Nazarbayev University — Direct Entry & Foundation Grant',
          minCompetitiveScore: 1350,
          fullGrantScore: 1470,
          recommendedGrade: '10–11 сынып',
          note: 'Тікелей түсу (Direct) және SEDS/SSH мамандықтарының гранты үшін кемінде 1460+ (Math 750+) ұпай жинауды ұсынамыз.',
        },
        {
          id: 'usa',
          regionLabel: 'АҚШ және NYUAD',
          universities: 'Ivy League, Stanford, MIT, NYU Abu Dhabi, Top-50 Liberal Arts',
          minCompetitiveScore: 1480,
          fullGrantScore: 1540,
          recommendedGrade: '9–10 сынып',
          note: 'Қазақстаннан толық қаржылық көмекке (Financial Aid) үміткер оқушылар үшін жоғары SAT шешуші рөл атқарады.',
        },
        {
          id: 'europe',
          regionLabel: 'Еуропа',
          universities: 'Bocconi (Италия), KU Leuven, Aalto (Финляндия), Нидерланд ЖОО-лары',
          minCompetitiveScore: 1380,
          fullGrantScore: 1480,
          recommendedGrade: '10–11 сынып',
          note: 'Еуропаның көптеген ағылшын тілді бағдарламаларында жоғары SAT ішкі емтиханнан босатады және оқу грантын береді.',
        },
        {
          id: 'asia',
          regionLabel: 'Гонконг және Корея',
          universities: 'HKU, HKUST, CUHK, KAIST, Yonsei Underwood, NUS',
          minCompetitiveScore: 1450,
          fullGrantScore: 1530,
          recommendedGrade: '10 сынып',
          note: 'Гонконг пен Оңтүстік Корея университеттері академиялық стипендия көлемін 1500+ SAT нәтижесіне тікелей байланыстырады.',
        },
      ],
    },
    pricing: {
      kicker: 'Тек 1-де-1 жеке сабақтар · SATosphere ашық тарифтері',
      title: 'Оқытушымен жеке дайындықтың ыңғайлы пакетін таңдаңыз',
      subtitle:
        'Барлық тарифте Digital SAT сарапшысымен тек жеке 1-де-1 оқисыз. Базалық баға — сабағына 10 000 ₸, ал 1 немесе 2 айлық курсты таңдағанда 30 000 ₸ дейін үнемдеп, толық Bluebook симуляциялар жинағын аласыз.',
      modePackageTotal: 'Толық пакет құны',
      modePerLesson: '1 сабаққа шаққандағы баға',
      perLessonSuffix: '1 жеке сабақ үшін',
      diagnosticBannerTitle: 'Тегін жеке диагностикадан бастаңыз (0 ₸)',
      diagnosticBannerDesc:
        '12 немесе 24 сабақтық пакетті таңдамас бұрын 40 минуттық Digital SAT диагностикасынан өтіңіз: ағымдағы деңгейді нақты есептеп, мақсатыңызға қанша сабақ қажет екенін айтамыз.',
      diagnosticBannerCta: 'Тегін диагностикадан өту (0 ₸)',
      featuredLabel: 'Ең тиімді пакет · 30 000 ₸ үнем',
      targetLabel: 'Кімге оңтайлы:',
      tariffs: [
        {
          id: 'per_lesson',
          name: 'Базалық · Сабақ сайын',
          subtitle: 'Пакетке байланбай 1-де-1 жеке сабақтар алу — емтихан алдында жекелеген қиын тақырыптарды талдауға ыңғайлы.',
          formatLine: '1 жеке сабақ · Икемді жазылу',
          lessonsCount: 1,
          packagePrice: 10000,
          perLessonPrice: 10000,
          packageUnitLabel: '1 жеке сабақтың базалық құны',
          scheduleSummary: 'Digital SAT сарапшысымен 60 минуттық жеке сабақ',
          targetScore: 'Жеке тақырыптарды жабу немесе сынақ тестін талдау',
          highlights: [
            'Math немесе Reading & Writing бойынша 1-де-1 жеке сабақ',
            'Оқушының нақты қиын есептері мен Desmos әдістерін талдау',
            'Өтілген тақырып бойынша тексерілетін үй тапсырмасы',
            'Кез келген сәтте 12 немесе 24 сабақтық пакетке ауысу мүмкіндігі',
          ],
          ctaLabel: 'Жеке сабаққа жазылу',
        },
        {
          id: 'course_2m',
          name: '2 айлық курс',
          subtitle: 'Ағымдағы деңгейден гранттық 1450–1550+ ұпайға дейін жеткізетін 24 сабақтық толық жүйелі 1-де-1 дайындық.',
          formatLine: '24 сабақ 1-де-1 · 30 000 ₸ үнем',
          lessonsCount: 24,
          packagePrice: 210000,
          oldPackagePrice: 240000,
          savingsBadge: '30 000 ₸ үнем',
          perLessonPrice: 8750,
          oldPerLessonPrice: 10000,
          packageUnitLabel: '24 жеке сабақ үшін (2 ай)',
          scheduleSummary: 'Аптасына 3 рет 1-де-1 сабақ + 5 толық Bluebook симуляциясы',
          targetScore: '1450–1550+ дейін +180–250 ұпай жүйелі өсім',
          isFeatured: true,
          highlights: [
            '24 жеке 1-де-1 сабақ (1 сабақ бағасы 8 750 ₸ дейін төмендейді)',
            'Екі бөлімді де кешенді меңгеру: SAT Math + Reading & Writing',
            '5 толық форматты Bluebook симуляциясы + жеке Error Log жүргізу',
            'Әр 2 апта сайын ата-анаға есеп және ҚР-да SAT-қа тіркелуге көмек',
          ],
          ctaLabel: '2 айлық курсты таңдау',
        },
        {
          id: 'course_1m',
          name: '1 айлық курс',
          subtitle: 'Жақын емтихан күніне дейін ұпайды жылдам көтеруге арналған 12 жеке сабақтан тұратын қарқынды спринт.',
          formatLine: '12 сабақ 1-де-1 · 10 000 ₸ үнем',
          lessonsCount: 12,
          packagePrice: 110000,
          oldPackagePrice: 120000,
          savingsBadge: '10 000 ₸ үнем',
          perLessonPrice: 9167,
          oldPerLessonPrice: 10000,
          packageUnitLabel: '12 жеке сабақ үшін (1 ай)',
          scheduleSummary: 'Аптасына 3 рет 1-де-1 сабақ + 2 толық Bluebook симуляциясы',
          targetScore: '4 аптада +90–140 ұпайлық спринт',
          highlights: [
            'Жеке кесте бойынша 12 дербес 1-де-1 сабақ',
            'Нақты College Board тапсырмалар базасына толық қолжетімділік',
            'Қателері жеке талданатын 2 адаптивті Bluebook сынақ емтиханы',
            'Ата-аналарға WhatsApp арқылы прогресс туралы қорытынды есеп',
          ],
          ctaLabel: '1 айлық курсты таңдау',
        },
      ],
      matrixTitle: '1-де-1 жеке оқыту пакеттерін салыстыру',
      filterAll: 'Барлық параметрлер (9)',
      filterDiffs: 'Тек пакет айырмашылықтары',
      colParameter: 'Жеке дайындық параметрі',
      colPerLesson: 'Сабақ сайын (10 000 ₸)',
      colCourse1m: '1 ай · 12 сабақ (110 000 ₸)',
      colCourse2m: '2 ай · 24 сабақ (210 000 ₸)',
      rows: [
        {
          feature: 'Оқытушымен жұмыс форматы',
          isDifference: false,
          perLesson: 'Тек 1-де-1 жеке',
          course1m: 'Тек 1-де-1 жеке',
          course2m: 'Тек 1-де-1 жеке',
        },
        {
          feature: 'Кіріспе Digital SAT диагностикасы және жеке жоспар',
          isDifference: false,
          perLesson: 'Тегін (0 ₸)',
          course1m: 'Тегін (0 ₸)',
          course2m: 'Тегін (0 ₸)',
        },
        {
          feature: 'Пакеттегі жеке сабақтар саны',
          isDifference: true,
          perLesson: '1 сабақ (сұраныс бойынша)',
          course1m: '12 сабақ (4 апта)',
          course2m: '24 сабақ (8 апта)',
        },
        {
          feature: '1 жеке сабаққа шаққандағы құны',
          isDifference: true,
          perLesson: '10 000 ₸ / сабақ',
          course1m: '9 167 ₸ / сабақ (−10 000 ₸)',
          course2m: '8 750 ₸ / сабақ (−30 000 ₸)',
        },
        {
          feature: 'Жаттықтырушы кестесінен тұрақты уақыт бекіту',
          isDifference: true,
          perLesson: 'Бос уақыттар',
          course1m: 'Басымдықпен бекіту',
          course2m: 'Толық курсқа басымдықпен',
        },
        {
          feature: 'Талдауы бар адаптивті Bluebook сынақ емтихандары',
          isDifference: true,
          perLesson: 'Сабақта сұраныс бойынша',
          course1m: '2 толық симуляция',
          course2m: '5 толық симуляция',
        },
        {
          feature: 'Жеке қателер трекері (Error Log) және есептер базасы',
          isDifference: true,
          perLesson: 'Сабақ материалдары',
          course1m: '1 айға толық қолжетімділік',
          course2m: 'Емтиханға дейін қолжетімділік',
        },
        {
          feature: 'Ата-аналарға WhatsApp арқылы ұпай динамикасы есебі',
          isDifference: true,
          perLesson: 'Сұраныс бойынша қысқаша қорытынды',
          course1m: 'Ай ортасында және соңында есеп',
          course2m: 'Әр 2 апта сайын тұрақты трекинг',
        },
        {
          feature: 'ҚР тест орталығына тіркелу және тапсыру стратегиясы',
          isDifference: true,
          perLesson: 'Сабақта кеңес беру',
          course1m: 'Қадамдық нұсқаулық',
          course2m: 'Толық сүйемелдеу',
        },
      ],
    },
    faq: {
      kicker: 'Ата-аналар мен талапкерлердің жиі қойылатын сұрақтары',
      title: 'SATosphere мектебінде Digital SAT-қа жеке дайындалу туралы',
      subtitle:
        '9–11 сынып оқушылары мен ата-аналардың 1-де-1 форматы, дайындық мерзімі, бағалар және грантқа түсу туралы негізгі сұрақтарына жауаптар.',
      items: [
        {
          question: 'Неліктен SATosphere топтық курстар емес, тек 1-де-1 жеке оқытуға басымдық береді?',
          answer:
            'Қазақстандағы әрбір 9–11 сынып оқушысының деңгейі әртүрлі: НЗМ немесе РФМШ оқушысы математиканы 720+ деңгейінде шығарып, тек Reading мәтіндерінде ұпай жоғалтуы мүмкін, ал басқа оқушыға функциялар мен грамматиканы базадан бастау керек. 1-де-1 форматында басқаларды күтуге уақыт кетпейді — топта 4–6 ай жүретін бағдарламаны жеке оқушы 12 немесе 24 сабақта меңгереді.',
        },
        {
          question: 'Қай пакетті таңдаған дұрыс: 1 ай (12 сабақ) әлде 2 ай (24 сабақ)?',
          answer:
            '1 айлық курс (12 сабақ — 110 000 ₸) сынақ тестінен 1320+ жинап жүрген және жақын емтихан алдында 4 аптада 1450–1500+ межесіне шыққысы келетіндерге арналған. 2 айлық курс (24 сабақ — 210 000 ₸, 30 000 ₸ үнем) — екі бөлімді де 5 Bluebook симуляциясымен жүйелі меңгеріп, гранттық ұпайға сенімді жетуге арналған толық бағдарлама.',
        },
        {
          question: 'Бір немесе екі айлық курсты төлемес бұрын байқап көруге бола ма?',
          answer:
            'Әрине! Әр оқушы үшін бірінші қадам — тегін кіріспе диагностика (0 ₸), онда бастапқы ұпайды анықтап, әдістемемен таныстырамыз. Сонымен қатар базалық 10 000 ₸ тарифпен жеке сабақ алып көріп, кейін 12 немесе 24 сабақтық тиімді пакетке ауыса аласыз.',
        },
        {
          question: 'Дайындықты 9, 10 немесе 11 сыныптың қайсысында бастаған тиімді?',
          answer:
            '9–10 сыныпта жеке дайындық арқылы SAT емтиханын 1500+ ұпайға ертерек тапсырып қойсаңыз (сертификат 5 жыл жарамды), 11 сыныпта мотивациялық эссе мен IELTS-қа еркін уақыт қалады. Ал 11 сыныпта аптасына 3 рет жеке кестемен оқу Назарбаев Университеті мен шетелдік ЖОО дедлайндарына үлгерудің ең жылдам жолы.',
        },
        {
          question: 'Назарбаев Университеті (NU) мен шетелдік гранттарға қанша SAT ұпайы қажет?',
          answer:
            'NU конкурсының ең төменгі шегі 1240 ұпайдан басталғанымен, Direct Entry мемлекеттік грантына сенімді түсу үшін 1460–1520+ жинауды ұсынамыз. АҚШ, Гонконг (HKU, HKUST), Оңтүстік Корея (KAIST) және Еуропа (Bocconi) гранттары үшін мақсатты ұпай — 1480–1550+.',
        },
        {
          question: 'Жеке сабақтар кестесі қалай құрылады және сабақты ауыстыруға бола ма?',
          answer:
            'Сабақ кестесі Қазақстанның кез келген қаласындағы (Алматы, Астана, Шымкент, Қарағанды, Атырау және т.б.) оқушының мектебі мен қосымша үйірмелеріне сай жеке бекітіледі. Алдын ала ескерткен жағдайда жеке сабақ күймейді және басқа ыңғайлы күнге тегін ауыстырылады.',
        },
        {
          question: 'Оқуды бастау үшін ағылшын тілінің қандай деңгейі қажет?',
          answer:
            'Жоғары ұпайға тез шығу үшін оңтайлы бастапқы деңгей — Intermediate (B1+ / IELTS 5.5+). Тегін диагностикада біз сөздік қор мен оқу жылдамдығын тексеріп, бағдарлама күрделілігін бірден оқушыға бейімдейміз.',
        },
      ],
      bottomCtaTitle: 'SATosphere мектебінде тегін 1-де-1 диагностикаға жазылыңыз',
      bottomCtaDesc:
        'Аты-жөніңіз бен WhatsApp нөміріңізді қалдырыңыз — Math және Reading & Writing бөлімдері бойынша жеке диагностика өткізіп, 12 немесе 24 сабаққа оңтайлы жоспар құрамыз.',
    },
    footer: {
      tagline:
        'Қазақстанның 9–11 сынып оқушыларын NU, АҚШ, Еуропа және Азия гранттарына түсу үшін Digital SAT емтиханына 1-де-1 жеке дайындайтын мектеп.',
      geography: 'Алматы · Астана · Шымкент · Бүкіл Қазақстан бойынша 1-де-1 онлайн',
      contactTitle: 'SATosphere кураторымен байланыс',
      scheduleLine: 'Күн сайын 09:00–21:00 (Астана уақытымен, GMT+5)',
      navTitle: 'Навигация',
      adminButton: 'Куратор кабинеті (CRM)',
      copyright:
        '© 2026 SATosphere. Барлық құқықтар қорғалған. SAT® — College Board тіркелген тауар белгісі.',
    },
    modal: {
      titleDiagnostic: 'Digital SAT тегін 1-де-1 диагностикасына жазылу',
      titleCourse: 'SATosphere жеке оқыту тарифін брондау',
      selectedFormatPrefix: 'Таңдалған тариф:',
      closeAria: 'Жазылу терезесін жабу',
    },
    crm: {
      backToSite: 'Лендингке оралу',
      title: 'SATosphere өтінімдер CRM-панелі',
      subtitle: 'Диагностика мен жеке оқыту пакеттеріне түскен өтінімдерді басқару.',
      signInPromptTitle: 'SATosphere куратор кабинетіне кіру',
      signInPromptDesc:
        'Оқушылардың байланыс деректерін көру үшін әкімші құпиясөзін (.env файлындағы ADMIN_PASSWORD) енгізіңіз.',
      passwordLabel: 'Әкімші құпиясөзі',
      passwordPlaceholder: 'Құпиясөзді енгізіңіз...',
      signInButton: 'CRM-ге кіру',
      invalidPasswordError: 'Құпиясөз қате. .env файлындағы ADMIN_PASSWORD мәнін тексеріңіз.',
      refreshButton: 'Жаңарту',
      signOutButton: 'Шығу',
      kpiTotal: 'Барлық өтінім',
      kpiNew: 'Жаңа (жауап күтуде)',
      kpiDiagnostic: 'Диагностика белгіленді',
      kpiEnrolled: 'Курсты төледі',
      searchPlaceholder: 'Аты немесе телефон нөмірі бойынша іздеу...',
      exportCsv: 'CSV жүктеу',
      allStatuses: 'Барлық мәртебелер',
      allPlans: 'Барлық тарифтер',
      statusLabels: {
        new: 'Жаңа өтінім',
        contacted: 'Хабарластық',
        diagnostic_scheduled: 'Диагностика белгіленді',
        enrolled: 'Курсты төледі',
        archived: 'Мұрағатта',
      },
      paymentModeLabels: {
        package_total: 'Көрініс: Толық пакет құны',
        per_lesson_view: 'Көрініс: 1 сабақ бағасы',
        full_3m: 'Толық курс (мұрағат)',
        monthly: 'Ай сайын (мұрағат)',
      },
      emptyLeads:
        'Таңдалған сүзгілер бойынша өтінімдер жоқ. Воронканы тексеру үшін SATosphere лендингінен тесттік өтінім жіберіңіз.',
      colStudent: 'Оқушы және сыныбы',
      colContacts: 'Телефон / WhatsApp',
      colProgram: 'Таңдалған жеке тариф',
      colSource: 'Жарнама көзі (UTM)',
      colStatus: 'Воронка мәртебесі',
      colNotes: 'Куратор жазбасы',
      saveNote: 'Сақтау',
      savedNote: 'Сақталды',
      notesPlaceholder: 'Диагностика ұпайы, 1-де-1 ыңғайлы күндер, мақсатты ЖОО...',
      whatsappAction: 'WhatsApp-қа жазу',
      deleteAction: 'Өшіру',
      confirmDelete: 'Растау',
      cancelDelete: 'Болдырмау',
    },
  },
};
