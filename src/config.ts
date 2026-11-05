/**
 * Единая точка настроек лендинга.
 * Меняйте значения здесь — UI подхватит автоматически.
 */

export const PROMO = {
  /** Включить/выключить промо-бар и скидку. */
  enabled: true,
  /** Длительность персонального таймера в минутах (если deadline не задан). */
  durationMinutes: 15,
  /** Скидка на пакеты, %. */
  discountPercent: 15,
  /** Промокод, который уходит в заявку. */
  code: 'START15',
  /**
   * Реальный дедлайн акции в ISO-формате, например '2026-11-20T23:59:59+05:00'.
   * Если задан — используется вместо персонального 15-минутного таймера.
   * Рекомендуется для честной срочности: таймер не сбрасывается.
   */
  deadline: '',
} as const;

/**
 * Контакты. Пустая строка = блок скрыт.
 * WhatsApp — только цифры, например '77011234567'.
 */
export interface ContactsConfig {
  whatsapp: string;
  phone: string;
  telegram: string;
  instagram: string;
  email: string;
}

export const CONTACTS: ContactsConfig = {
  whatsapp: '',
  phone: '',
  telegram: '',
  instagram: '',
  email: '',
};

/** ID Google Ads (уже стоит в index.html) и метка конверсии. */
export const ADS = {
  conversionId: 'AW-17664583252',
  conversionLabel: '4MbXCNe-i7AdENTMkOdB',
} as const;
