import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export const TABLEAU_FIELD_TOOLTIPS = {
  nombrePhase:
    "Pour savoir, regardez la largeur de votre disjoncteur d'abonné (généralement à côté du Linky ou tableau principal) : 7 cm = monophasé ; 12 cm = triphasé",
  appareilTriphase:
    "Nombre d'appareils triphasés dans votre installation (piscine, pompe de relevage, ballon d'eau chaude…)",
  nombreRangees: 'Nombre de rangées nécessaires pour votre tableau électrique (1 à 4)',
  nombreDisjoncteurs: 'Nombre total de disjoncteurs ou porte-fusibles à remplacer',
  lignesSpeciales: 'Sélectionnez les lignes spéciales nécessaires pour votre installation',
  radiateurElectrique: 'Nombre de radiateurs électriques dans votre installation'
};

export function TableauFieldTooltip({ field }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const anchorRef = useRef(null);

  const updatePosition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(rect.left + rect.width / 2, 136), window.innerWidth - 136);
    setCoords({ x, y: rect.bottom + 6 });
  }, []);

  const show = () => {
    updatePosition();
    setOpen(true);
  };

  const hide = () => setOpen(false);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (open) {
      setOpen(false);
    } else {
      updatePosition();
      setOpen(true);
    }
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className="inline-flex ml-2 shrink-0 align-middle text-gray-400 hover:text-cyan-700 cursor-help"
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={toggle}
        aria-label={`Aide : ${field}`}
        title={TABLEAU_FIELD_TOOLTIPS[field]}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            role="tooltip"
            className="fixed z-[99999] w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-left text-xs leading-snug text-white shadow-xl"
            style={{ left: coords.x, top: coords.y }}
          >
            {TABLEAU_FIELD_TOOLTIPS[field]}
          </div>,
          document.body
        )}
    </>
  );
}

export function TableauFieldLabel({ field, children }) {
  return (
    <div className="mb-2 flex items-center text-sm font-medium text-gray-700">
      <span>{children}</span>
      <TableauFieldTooltip field={field} />
    </div>
  );
}
