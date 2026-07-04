/**
 * Prestation spéciale PINT001 (interrupteur éclairage) + comptage Int / télérupteur.
 * Source unique côté serveur : prix MO + matériel via admin, qty Int saisie par pièce au wizard.
 */

const SPECIAL_INTERRUPTEUR_ECLAIRAGE = {
  code: 'PINT001',
  service_value: 'interrupteur_eclairage',
  service_label: 'Installation interrupteur(s) — éclairage',
  categorie: 'installation',
  piece: 'commun',
  default_prix_ht: 45
};

const ECLAIRAGE_LABEL_RE = /éclairage|eclairage|spot|applique|bandeau|led|luminaire|plafonnier/;

function isEclairageServiceLabel(label) {
  return ECLAIRAGE_LABEL_RE.test((label || '').toLowerCase());
}

function isSpecialInterrupteurLine(service) {
  if (!service) return false;
  return (
    service.isSpecialInterrupteur === true
    || service.service_value === 'interrupteur_eclairage'
    || (service.code && String(service.code).toUpperCase() === 'PINT001')
  );
}

function isInstallationDevisItem(item) {
  return item && item.type !== 'tableau' && item.serviceType === 'installation';
}

function isSpecialInterrupteurService(service) {
  return isSpecialInterrupteurLine(service);
}

/** Somme des Int saisis par type d'éclairage (indépendant de la qté prestation). */
function getInterrupteursPerPiece(item) {
  if (!item || item.type === 'tableau') return 0;

  let sum = 0;
  let hasEclairage = false;
  (item.services || []).forEach((service) => {
    if (isSpecialInterrupteurLine(service)) return;
    if (!isEclairageServiceLabel(service.label)) return;
    hasEclairage = true;
    sum += service.interrupteurs != null ? service.interrupteurs : 1;
  });

  return hasEclairage ? sum : 0;
}

function countInterrupteursForInstallationItem(item) {
  return getInterrupteursPerPiece(item);
}

function countInterrupteursInstallation(devisItems) {
  if (!devisItems?.length) return 0;
  let total = 0;
  devisItems.forEach((item) => {
    if (!isInstallationDevisItem(item)) return;
    total += getInterrupteursPerPiece(item);
  });
  return total;
}

/** 1 télérupteur par pièce si au moins une ligne éclairage a Int ≥ 3. */
function pieceNeedsTelerupteur(item) {
  if (!isInstallationDevisItem(item)) return false;
  return (item.services || []).some((service) => {
    if (isSpecialInterrupteurLine(service)) return false;
    if (!isEclairageServiceLabel(service.label)) return false;
    const intVal = service.interrupteurs != null ? service.interrupteurs : 1;
    return intVal >= 3;
  });
}

function countTelerupteursFromPrestations(devisItems) {
  if (!devisItems?.length) return 0;
  let count = 0;
  devisItems.forEach((item) => {
    if (pieceNeedsTelerupteur(item)) count += 1;
  });
  return count;
}

function shouldAddTelerupteurFromPrestations(devisItems) {
  return countTelerupteursFromPrestations(devisItems) > 0;
}

/** Ajoute PINT001 (qty = Int pièce) sur chaque ligne installation ayant de l'éclairage. */
function expandDevisWithSpecialInterrupteur(devisItems, prestationMeta) {
  const meta = prestationMeta || SPECIAL_INTERRUPTEUR_ECLAIRAGE;
  if (!devisItems?.length) return devisItems || [];

  return devisItems.map((item) => {
    if (!isInstallationDevisItem(item)) return item;

    const intCount = getInterrupteursPerPiece(item);
    if (intCount <= 0) return item;

    const alreadyHas = (item.services || []).some(isSpecialInterrupteurService);
    if (alreadyHas) return item;

    return {
      ...item,
      services: [
        ...(item.services || []),
        {
          label: meta.service_label || SPECIAL_INTERRUPTEUR_ECLAIRAGE.service_label,
          service_value: meta.service_value || SPECIAL_INTERRUPTEUR_ECLAIRAGE.service_value,
          code: meta.code || SPECIAL_INTERRUPTEUR_ECLAIRAGE.code,
          quantity: intCount,
          isSpecialInterrupteur: true
        }
      ]
    };
  });
}

module.exports = {
  SPECIAL_INTERRUPTEUR_ECLAIRAGE,
  isEclairageServiceLabel,
  isSpecialInterrupteurLine,
  isSpecialInterrupteurService,
  isInstallationDevisItem,
  getInterrupteursPerPiece,
  countInterrupteursForInstallationItem,
  countInterrupteursInstallation,
  pieceNeedsTelerupteur,
  countTelerupteursFromPrestations,
  shouldAddTelerupteurFromPrestations,
  expandDevisWithSpecialInterrupteur
};
