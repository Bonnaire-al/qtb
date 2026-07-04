/**
 * Constantes UI pour le devis rapide.
 * La construction des devisItems est faite côté backend (POST /api/rapid/prepare).
 */

import { filterCatalogPieces } from '../formWizardUtils';

export const RAPID_GAMMES = [
  { value: 'classic', label: 'Classic' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxe', label: 'Luxe' }
];

export const RAPID_WIZARD_STEPS = [
  { id: 1, label: 'Pièces' },
  { id: 2, label: 'Alarme & portail' },
  { id: 3, label: 'Passage câbles' }
];

export const RAPID_GAMME_LEGEND = [
  { value: 'classic', label: 'Classic', text: 'Minimum de prises et points d’éclairage' },
  { value: 'premium', label: 'Premium', text: 'Plus de prises et de points d’éclairage' },
  { value: 'luxe', label: 'Luxe', text: 'Appareillages haut de gamme' }
];

export const GAMME_PILL_STYLES = {
  classic: {
    selected: 'bg-cyan-600 text-white border-cyan-600',
    unselected: 'bg-white text-cyan-800 border-cyan-200 hover:bg-cyan-50'
  },
  premium: {
    selected: 'bg-sky-600 text-white border-sky-600',
    unselected: 'bg-white text-sky-800 border-sky-200 hover:bg-sky-50'
  },
  luxe: {
    selected: 'bg-blue-700 text-white border-blue-700',
    unselected: 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
  }
};

/** Pièces proposées au devis rapide (sans pièces obsolètes). */
export function filterRapidPieces(pieces) {
  return filterCatalogPieces(pieces);
}

export function buildRoomInstanceLabel(baseLabel, roomValue, instances) {
  const count = (instances || []).filter((i) => i.roomValue === roomValue).length + 1;
  return `${baseLabel} ${count}`;
}

export function createRoomInstance(roomValue, baseLabel, instances) {
  return {
    id: `${roomValue}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    roomValue,
    gamme: 'classic',
    label: buildRoomInstanceLabel(baseLabel, roomValue, instances)
  };
}
