import React from 'react';
import { Gift, Timer, X } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { LandingPromo } from '../i18n/landing';

interface PromoBarProps {
  copy: LandingPromo;
  active: boolean;
  deadline: number | null;
  onCta: () => void;
  onClose: () => void;
}

export const PromoBar: React.FC<PromoBarProps> = ({ copy, active, deadline, onCta, onClose }) => {
  const label = useCountdown(deadline, active);

  return (
    <div className="relative z-30 bg-[#0D2628] text-white">
      <div className="mx-auto flex h-10 max-w-[1280px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <Gift className="h-3.5 w-3.5 shrink-0 text-[#FFCCBC]" aria-hidden="true" />

        <p className="min-w-0 flex-1 truncate text-[11px] font-semibold leading-none sm:text-xs">
          {active ? (
            <>
              <span className="text-[#FFCCBC]">{copy.title}</span>
              <span className="ml-1.5 hidden text-white/60 sm:inline">{copy.subtitle}</span>
            </>
          ) : (
            <>
              {copy.expiredTitle}
              <span className="ml-1.5 hidden text-white/60 sm:inline">{copy.expiredSubtitle}</span>
            </>
          )}
        </p>

        {active && (
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-white/10 px-2 py-1 font-mono text-[11px] font-semibold tabular-nums text-[#FFCCBC]">
            <Timer className="h-3 w-3" aria-hidden="true" />
            {label}
          </span>
        )}

        <button
          type="button"
          onClick={onCta}
          className="shrink-0 rounded-md bg-[#00887A] px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[#006E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCCBC] sm:px-3"
        >
          {active ? copy.cta : copy.expiredCta}
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть промо-баннер"
          className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
