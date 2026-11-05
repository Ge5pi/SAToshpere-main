import { ADS } from '../config';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
    ym?: (...args: unknown[]) => void;
  }
}

/** Безопасная отправка события в gtag/Метрику. Ничего не ломает, если счётчиков нет. */
export function track(event: string, params: Record<string, unknown> = {}): void {
  try {
    window.gtag?.('event', event, params);
    window.dataLayer?.push({ event, ...params });
  } catch {
    // ignore
  }
}

/** Конверсия Google Ads — вызывать только после успешной заявки. */
export function trackAdsConversion(value = 0): void {
  try {
    window.gtag?.('event', 'conversion', {
      send_to: `${ADS.conversionId}/${ADS.conversionLabel}`,
      value,
      currency: 'KZT',
    });
  } catch {
    // ignore
  }
}
