-- =============================================================================
-- SATosphere — Готовые аналитические SQL-запросы для владельца школы
-- =============================================================================

-- 1. Сводка воронки по статусам заявок
SELECT
  status,
  COUNT(*) AS leads_count,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 1) AS share_percent
FROM leads
GROUP BY status
ORDER BY leads_count DESC;

-- 2. Эффективность рекламных кампаний (UTM Source / Campaign -> Оплаты)
SELECT
  utm_source,
  utm_campaign,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE status = 'diagnostic_scheduled') AS diagnostics_scheduled,
  COUNT(*) FILTER (WHERE status = 'enrolled') AS enrolled_students
FROM leads
GROUP BY utm_source, utm_campaign
ORDER BY total_leads DESC;

-- 3. Спрос по индивидуальным тарифам и оценка потенциальной выручки (в тенге)
SELECT
  selected_plan,
  COUNT(*) AS total_requests,
  SUM(
    CASE selected_plan
      WHEN 'course_2m' THEN 210000
      WHEN 'course_1m' THEN 110000
      WHEN 'per_lesson' THEN 10000
      ELSE 0
    END
  ) AS potential_package_kzt
FROM leads
WHERE status <> 'archived'
GROUP BY selected_plan
ORDER BY total_requests DESC;

-- 4. Динамика входящих заявок по дням за последние 30 дней (время Астаны / Алматы UTC+5)
SELECT
  DATE(created_at AT TIME ZONE 'Asia/Almaty') AS lead_date,
  COUNT(*) AS leads_per_day,
  COUNT(*) FILTER (WHERE locale = 'ru') AS ru_leads,
  COUNT(*) FILTER (WHERE locale = 'kz') AS kz_leads
FROM leads
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY lead_date
ORDER BY lead_date DESC;
