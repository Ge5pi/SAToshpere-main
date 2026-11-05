import { useCallback, useEffect, useMemo, useState } from 'react';
import { PROMO } from '../config';

const DEADLINE_KEY = 'satosphere_promo_deadline';
const DISMISS_KEY = 'satosphere_promo_dismissed';

export type PromoStatus = 'active' | 'expired' | 'disabled';

function readDeadline(): number | null {
  try {
    const raw = localStorage.getItem(DEADLINE_KEY);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeDeadline(value: number): void {
  try {
    localStorage.setItem(DEADLINE_KEY, String(value));
  } catch {
    // ignore
  }
}

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function resolveInitialDeadline(): number | null {
  if (!PROMO.enabled) return null;

  const fixedDeadline = PROMO.deadline ? new Date(PROMO.deadline).getTime() : NaN;
  if (Number.isFinite(fixedDeadline) && fixedDeadline > 0) return fixedDeadline;

  const stored = readDeadline();
  if (stored) return stored;

  const next = Date.now() + PROMO.durationMinutes * 60_000;
  writeDeadline(next);
  return next;
}

export interface PromoState {
  status: PromoStatus;
  active: boolean;
  deadline: number | null;
  dismissed: boolean;
  dismiss: () => void;
}

/**
 * Таймер стартует один раз при первом визите и сохраняется.
 * После истечения не сбрасывается — иначе это выглядит как обман.
 * Тикает только на границе истечения, чтобы не перерисовывать страницу каждую секунду.
 */
export function usePromo(): PromoState {
  const [deadline] = useState<number | null>(() => resolveInitialDeadline());
  const [active, setActive] = useState<boolean>(() =>
    deadline ? deadline - Date.now() > 0 : false
  );
  const [dismissed, setDismissed] = useState<boolean>(() => readDismissed());

  useEffect(() => {
    if (!PROMO.enabled || !deadline) return;

    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      setActive(false);
      return;
    }

    setActive(true);
    const timer = window.setTimeout(() => setActive(false), remaining);
    return () => window.clearTimeout(timer);
  }, [deadline]);

  const status: PromoStatus = useMemo(() => {
    if (!PROMO.enabled) return 'disabled';
    return active ? 'active' : 'expired';
  }, [active]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  return { status, active, deadline, dismissed, dismiss };
}
