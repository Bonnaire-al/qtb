import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  WizardChoiceButton,
  WizardChoiceList,
  WizardStepTitle,
  WizardStepSubtitle
} from '../Quote/WizardChoiceButton';

const TABLEAU_FIGURES = {
  porteFusible: {
    src: '/image/porte-fusible.jpg',
    alt: 'Exemple de porte-fusible dans un tableau électrique',
    legend: 'Porte-fusible',
    hint: 'Ancien appareil à fusible remplaçable : signe d\'un tableau à moderniser.'
  },
  differentiel: {
    src: '/image/differentiel.jpg',
    alt: 'Exemple d\'interrupteur différentiel 30 mA',
    legend: 'Interrupteur différentiel (30 mA)',
    hint: 'Coupe le courant en cas de fuite : un tableau aux normes en possède au minimum un.'
  }
};

function ImageIconSvg() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function TableauImageLightbox({ figure, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={figure.legend}
    >
      <div
        className="relative max-w-[240px] sm:max-w-[280px] w-full bg-white rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 text-lg leading-none"
          aria-label="Fermer"
        >
          ×
        </button>
        <div className="flex items-center justify-center p-4 pt-9 bg-gray-100">
          <img
            src={figure.src}
            alt={figure.alt}
            className="max-w-full max-h-[38vh] w-auto h-auto object-contain"
          />
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-sm font-bold text-cyan-900">{figure.legend}</p>
          <p className="text-xs text-gray-600 mt-1">{figure.hint}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function TableauImageTrigger({ figure }) {
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <span
        className="relative inline-flex align-middle mx-0.5"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm align-middle transition-colors"
          onClick={() => setLightbox(true)}
          aria-label={`Voir ${figure.legend}`}
          title={figure.legend}
        >
          <ImageIconSvg />
        </button>

        {hovered && (
          <button
            type="button"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 rounded-lg border-2 border-white shadow-xl overflow-hidden bg-white animate-fade-in cursor-zoom-in"
            onClick={() => setLightbox(true)}
            aria-label={`Agrandir : ${figure.legend}`}
          >
            <img
              src={figure.src}
              alt=""
              className="block w-16 h-16 sm:w-20 sm:h-20 object-contain object-center bg-gray-50 p-1"
            />
            <span className="block px-1.5 py-0.5 text-[0.55rem] font-semibold text-cyan-900 bg-cyan-50 truncate max-w-[4.5rem] sm:max-w-[5.5rem]">
              {figure.legend}
            </span>
          </button>
        )}
      </span>

      {lightbox && <TableauImageLightbox figure={figure} onClose={() => setLightbox(false)} />}
    </>
  );
}

/** Contenu du choix tableau — utilisable en modal ou inline dans le wizard */
export function TableauElectriqueStep({ selectedChoice, onChoice }) {
  return (
    <>
      <WizardStepTitle>Choix du tableau électrique</WizardStepTitle>
      <WizardStepSubtitle>
        Indiquez la situation de votre tableau avant de composer les prestations.
      </WizardStepSubtitle>

      <WizardChoiceList className="mb-4">
        {[
          { key: 'inexistant', label: 'Nouveau tableau' },
          { key: 'changer', label: 'Remplacer mon tableau' },
          { key: 'garder', label: 'Garder mon tableau' }
        ].map(({ key, label }) => (
          <WizardChoiceButton
            key={key}
            selected={selectedChoice === key}
            onClick={() => onChoice(key)}
          >
            <span className="block text-center">{label}</span>
          </WizardChoiceButton>
        ))}
      </WizardChoiceList>

      <div className="mt-4 p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <ul className="text-yellow-900 text-sm space-y-4 list-none pl-0 min-w-0 flex-1">
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-yellow-800">1.</span>
              <p>
                Il est très conseillé de changer de tableau si vous avez des porte-fusibles{' '}
                <TableauImageTrigger figure={TABLEAU_FIGURES.porteFusible} />
                et si vous n&apos;avez pas minimum 1 différentiel{' '}
                <TableauImageTrigger figure={TABLEAU_FIGURES.differentiel} />.
              </p>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-yellow-800">2.</span>
              <p>
                Attention : si vous gardez votre tableau et qu&apos;il est plein, la facturation d&apos;un
                nouveau peut être faite sur place.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

const TableauElectriqueModal = ({
  onChoice,
  onClose,
  animState = 'in',
  isMainModalRendered = true
}) => {
  if (!isMainModalRendered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-xl relative transition-transform duration-400 modal-animation-ready ${
          animState === 'in' ? 'animate-slide-in-right' : animState === 'out' ? 'animate-slide-out-left' : ''
        }`}
      >
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <TableauElectriqueStep onChoice={onChoice} />
      </div>
    </div>
  );
};

export default TableauElectriqueModal;
