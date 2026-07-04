import React from 'react';

/** Boutons de choix uniformes pour toutes les étapes du wizard 1 */
export function WizardChoiceList({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-1 gap-3 max-w-xl mx-auto w-full ${className}`}>
      {children}
    </div>
  );
}

export function WizardChoiceButton({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      className={`w-full py-4 px-4 rounded-lg border-2 font-semibold text-base transition-colors ${
        selected
          ? 'bg-cyan-600 text-white border-cyan-600'
          : 'bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function WizardStepTitle({ children }) {
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-cyan-800 mb-2 text-center">{children}</h2>
  );
}

export function WizardStepSubtitle({ children }) {
  return <p className="text-sm text-gray-600 text-center mb-6">{children}</p>;
}
