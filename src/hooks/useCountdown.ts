import { useEffect, useState } from 'react';

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1_000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Тикает только внутри компонента с таймером, не перерисовывая всю страницу.
 */
export function useCountdown(deadline: number | null, active: boolean): string {
  const [label, setLabel] = useState(() =>
    formatCountdown(deadline ? deadline - Date.now() : 0)
  );

  useEffect(() => {
    if (!active || !deadline) return;

    const tick = () => setLabel(formatCountdown(deadline - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1_000);
    return () => window.clearInterval(timer);
  }, [deadline, active]);

  return label;
}
