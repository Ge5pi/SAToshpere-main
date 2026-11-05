import React from 'react';
import { ArrowRight, Timer } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { LandingPromo } from '../i18n/landing';

interface StickyCtaProps {
  copy: LandingPromo;
  active: boolean;
  deadline: number | null;
  visible: boolean;
  onCta: () => void;
}

export const StickyCta: React.FC<StickyCtaProps> = ({ copy, active, deadline, visible, onCta }) => {
  const label = useCountdown(deadline, active);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D3E3FC] bg-white/95 px-3 pt-2.5 backdrop-blur md:hidden"
      style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-brand-muted">
            {active ? copy.title : copy.expiredTitle}
          </p>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-sm font-bold tabular-nums text-brand-ink">
            {active ? (
              <>
                <Timer className="h-3.5 w-3.5 text-[#00887A]" aria-hidden="true" />
                {label}
              </>
            ) : (
              copy.expiredSubtitle
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onCta}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-[#00887A] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#006E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A] focus-visible:ring-offset-2"
        >
          {active ? copy.cta : copy.expiredCta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
