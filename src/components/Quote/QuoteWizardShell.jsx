import React from 'react';

const STEP_ANIM_MS = 350;
const WIZARD_BG = "url('/image/fond-form.png')";

/**
 * Wizard 1 — pleine page avec fond intégré.
 */
export default function QuoteWizardShell({
  activePhase = 1,
  configStepLabel = '',
  configStepIndex = 0,
  configStepTotal = 1,
  stepAnimClass = 'animate-wizard-step-in',
  pageHeader = null,
  footerHint = null,
  onClose,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  nextLabel = 'Suivant',
  hideNext = false,
  hidePrev = false,
  contentMaxWidth = 'max-w-xl',
  className = '',
  children
}) {
  return (
    <div
      className={`flex-1 min-h-0 w-full flex flex-col bg-cover bg-center bg-no-repeat overflow-hidden ${className}`}
      style={{ backgroundImage: WIZARD_BG }}
    >
      {pageHeader && (
        <div className="shrink-0 px-4 sm:px-8 pt-2 pb-1">{pageHeader}</div>
      )}

      <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-8 py-3 border-y border-white/50 bg-white/65 backdrop-blur-[2px]">
        <div className="min-w-0 max-w-4xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-bold uppercase tracking-wide text-cyan-800">
              Votre devis
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span
                className={`text-sm px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  activePhase === 1 ? 'bg-cyan-600 text-white' : 'bg-white/80 text-gray-600'
                }`}
              >
                1. Projet
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={`text-sm px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  activePhase === 2 ? 'bg-cyan-600 text-white' : 'bg-white/80 text-gray-600'
                }`}
              >
                2. Prestations
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={`text-sm px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  activePhase === 3 ? 'bg-cyan-600 text-white' : 'bg-white/80 text-gray-600'
                }`}
              >
                3. Devis PDF
              </span>
            </div>
            {configStepLabel && (
              <p className="text-xs text-gray-600 mt-1.5 truncate">
                Étape {configStepIndex + 1}/{configStepTotal} — {configStepLabel}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/80 text-2xl leading-none"
            aria-label="Revenir à vos informations"
          >
            ×
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-0 bg-white/55 backdrop-blur-[1px]">
        <div
          className={`h-full overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 ${stepAnimClass}`}
          style={{ animationDuration: `${STEP_ANIM_MS}ms` }}
        >
          <div className={`${contentMaxWidth} mx-auto w-full min-h-full flex flex-col`}>{children}</div>
        </div>
      </div>

      {(!hidePrev || !hideNext || footerHint) && (
        <div className="shrink-0 px-4 sm:px-8 py-3 border-t border-white/50 bg-white/70 backdrop-blur-[2px]">
          <div className="max-w-xl mx-auto w-full flex items-center gap-2 sm:gap-3">
            <div className="shrink-0 w-[5.5rem] sm:w-28">
              {!hidePrev ? (
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={prevDisabled}
                  className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white/90 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Précédent
                </button>
              ) : null}
            </div>

            {footerHint && (
              <div className="flex-1 min-w-0 flex justify-center text-center">{footerHint}</div>
            )}

            <div className="shrink-0 w-[5.5rem] sm:w-28 flex justify-end">
              {!hideNext ? (
                <button
                  type="button"
                  onClick={onNext}
                  disabled={nextDisabled}
                  className="px-3 sm:px-5 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {nextLabel}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { STEP_ANIM_MS };
