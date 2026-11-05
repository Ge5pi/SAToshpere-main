import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { TranslationContent } from '../i18n/translations';
import { Locale, PaymentMode, PlanId, UtmParams } from '../types';
import { LeadForm } from './LeadForm';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  copy: TranslationContent;
  utm: UtmParams;
  selectedPlan: PlanId;
  paymentMode: PaymentMode;
  promo?: { active: boolean; code: string; note: string };
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  locale,
  copy,
  utm,
  selectedPlan,
  paymentMode,
  promo,
}) => {
  const [currentPlan, setCurrentPlan] = useState<PlanId>(selectedPlan);

  useEffect(() => {
    setCurrentPlan(selectedPlan);
  }, [selectedPlan, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enrollment-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[#0D2628]/55 p-3 sm:p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative my-auto w-full max-w-xl min-w-0 rounded-2xl border border-[#77A6F7]/50 bg-[#FFFFFF] p-5 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#D3E3FC] pb-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#00887A]">
                  {copy.modal.selectedFormatPrefix} {copy.form.planNames[currentPlan]}
                </p>
                <h2
                  id="enrollment-modal-title"
                  className="mt-1 font-display text-lg font-bold tracking-tight text-brand-ink sm:text-xl"
                >
                  {currentPlan === 'diagnostic'
                    ? copy.modal.titleDiagnostic
                    : copy.modal.titleCourse}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={copy.modal.closeAria}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-[#D3E3FC]/55 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 sm:mt-6">
              <LeadForm
                locale={locale}
                copy={copy}
                utm={utm}
                defaultPlan={selectedPlan}
                defaultPaymentMode={paymentMode}
                showPlanSelector={true}
                onPlanChange={setCurrentPlan}
                promo={promo}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
