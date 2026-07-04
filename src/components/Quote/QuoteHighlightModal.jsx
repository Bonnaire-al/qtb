import React from 'react';

/**
 * Modal mis en avant (wizard 2 prestations, wizard changement tableau).
 */
export default function QuoteHighlightModal({
  isRendered,
  animState = 'in',
  title,
  subtitle,
  onClose,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  nextLabel = 'Suivant',
  hidePrev = false,
  hideNext = false,
  maxWidth = 'max-w-6xl',
  children
}) {
  if (!isRendered) return null;

  const panelClass =
    animState === 'in'
      ? 'animate-slide-in-right'
      : animState === 'out'
        ? 'animate-slide-out-left'
        : '';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/55 backdrop-blur-[2px]">
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ring-2 ring-cyan-300/80 w-full ${maxWidth} max-h-[92vh] flex flex-col overflow-hidden modal-animation-ready ${panelClass}`}
      >
        <div className="flex items-start justify-between gap-3 px-4 sm:px-6 py-4 border-b border-cyan-100 bg-gradient-to-r from-cyan-50 to-white shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{subtitle}</p>
            <h2 className="text-lg sm:text-xl font-bold text-cyan-900 truncate">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 text-2xl leading-none"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">{children}</div>

        {(!hidePrev || !hideNext) && (
          <div className="flex flex-wrap justify-between gap-2 px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/90 shrink-0">
            {!hidePrev ? (
              <button
                type="button"
                onClick={onPrev}
                disabled={prevDisabled}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white disabled:opacity-40"
              >
                Précédent
              </button>
            ) : (
              <span />
            )}
            {!hideNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className="px-5 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:bg-gray-300 ml-auto"
              >
                {nextLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
