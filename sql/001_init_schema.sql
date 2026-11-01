-- =============================================================================
-- SATosphere — Схема базы данных PostgreSQL (Миграция 001)
-- Назначение: хранение заявок с лендинга и управление воронкой в CRM куратора
-- Ручной запуск: psql "$DATABASE_URL" -f sql/001_init_schema.sql
-- (Также автоматически выполняется сервером при старте, если AUTO_MIGRATE="true")
-- =============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  student_name VARCHAR(80) NOT NULL
    CHECK (char_length(btrim(student_name)) BETWEEN 2 AND 80),
  phone VARCHAR(16) NOT NULL
    CHECK (phone ~ '^\+7[0-9]{10}$'),
  grade VARCHAR(4) NOT NULL
    CHECK (grade IN ('9', '10', '11')),
  selected_plan VARCHAR(32) NOT NULL
    CHECK (selected_plan IN (
      'diagnostic',
      'per_lesson',
      'course_1m',
      'course_2m',
      'standard_group',
      'intensive_pro',
      'individual_vip'
    )),
  payment_mode VARCHAR(32) NOT NULL DEFAULT 'package_total'
    CHECK (payment_mode IN (
      'package_total',
      'per_lesson_view',
      'full_3m',
      'monthly'
    )),
  locale VARCHAR(4) NOT NULL DEFAULT 'ru'
    CHECK (locale IN ('ru', 'kz')),
  status VARCHAR(32) NOT NULL DEFAULT 'new'
    CHECK (status IN (
      'new',
      'contacted',
      'diagnostic_scheduled',
      'enrolled',
      'archived'
    )),
  notes VARCHAR(500) NOT NULL DEFAULT '',
  utm_source VARCHAR(64) NOT NULL DEFAULT 'direct',
  utm_medium VARCHAR(64) NOT NULL DEFAULT 'none',
  utm_campaign VARCHAR(96) NOT NULL DEFAULT 'satosphere_landing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индексы для быстрой сортировки и фильтрации в CRM
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_selected_plan ON leads (selected_plan);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign ON leads (utm_campaign);

-- Триггер автоматического обновления поля updated_at при любом изменении строки
CREATE OR REPLACE FUNCTION update_leads_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_updated_at ON leads;

CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_leads_updated_at_column();
