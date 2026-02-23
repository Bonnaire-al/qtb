/**
 * Constantes UI pour le devis rapide.
 * La construction des devisItems est faite côté backend (POST /api/rapid/prepare).
 */

export const RAPID_GAMMES = [
  { value: 'classic', label: 'Classic' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxe', label: 'Luxe' }
];

export const INSTALLATION_TYPES = [
  { value: 'saignee_encastre', label: 'Saignée / Encastré' },
  { value: 'saillie_moulure', label: 'Saillie / Moulure' },
  { value: 'cloison_creuse', label: 'Cloison creuse' },
  { value: 'alimentation_existante', label: 'Alimentation existante' }
];
