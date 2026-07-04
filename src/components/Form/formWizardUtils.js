/** Utilitaires UI wizard — aucune modification des prestations en base (filtre côté API) */

/** Pièces retirées du catalogue (obsolètes) */
export const EXCLUDED_PIECE_VALUES = ['exterieur'];

export const ZONE_INTERIOR = 'interieur';
export const ZONE_EXTERIOR = 'exterieur';

export const WIZARD_STEPS = [
  { id: 1, label: 'Où ?' },
  { id: 2, label: 'Pose des câbles' },
  { id: 3, label: 'Prestations' }
];

export const INTERIOR_ROOM_VALUES = [
  'chambre', 'salon', 'cuisine', 'salle_de_bain', 'toilette',
  'couloir', 'escalier', 'cellier', 'cave', 'garage', 'grenier'
];

/** Emplacements extérieurs (wizard étape 1) */
export const EXTERIOR_ROOM_OPTIONS = [
  { value: 'jardin', label: 'Jardin' },
  { value: 'terrasse', label: 'Terrasse' },
  { value: 'veranda', label: 'Véranda' },
  { value: 'securite', label: 'Sécurité' },
  { value: 'portail', label: 'Portail / Volet roulant' }
];

export const EXTERIOR_ROOM_VALUES = EXTERIOR_ROOM_OPTIONS.map((r) => r.value);

/** Jardin, terrasse, véranda — prestations installation extérieures */
export const EXTERIOR_OUTDOOR_ROOMS = ['jardin', 'terrasse', 'veranda'];

export function getExteriorRoomLabel(roomValue) {
  return EXTERIOR_ROOM_OPTIONS.find((r) => r.value === roomValue)?.label || roomValue;
}

/** Retire les pièces obsolètes du catalogue (ex. exterieur). */
export function filterCatalogPieces(pieces) {
  return (pieces || []).filter((p) => !EXCLUDED_PIECE_VALUES.includes(p.value));
}

export function filterServicesByRoom(servicesByRoom) {
  const filtered = {};
  Object.entries(servicesByRoom || {}).forEach(([room, list]) => {
    if (EXCLUDED_PIECE_VALUES.includes(room)) return;
    filtered[room] = list;
  });
  return filtered;
}

/** Pièces zone extérieur : jardin/terrasse/véranda (API) + sécurité/portail si prestations chargées. */
export function buildExteriorRoomOptions(
  roomsFromApi,
  { hasSecurite = false, hasPortail = false } = {}
) {
  const catalog = filterCatalogPieces(roomsFromApi);
  const outdoor = catalog.filter((r) => EXTERIOR_OUTDOOR_ROOMS.includes(r.value));
  const special = [];
  if (hasSecurite) {
    special.push(EXTERIOR_ROOM_OPTIONS.find((o) => o.value === 'securite'));
  }
  if (hasPortail) {
    special.push(EXTERIOR_ROOM_OPTIONS.find((o) => o.value === 'portail'));
  }
  return [...outdoor, ...special.filter(Boolean)];
}

/** Prestations interrupteur retirées du formulaire (comptées via éclairage) */
export const EXCLUDED_SERVICE_VALUES = ['interrupteurs', 'interrupteur_double', 'interrupteur_eclairage'];

export const INSTALLATION_OPTIONS = [
  {
    value: 'saignee_encastre',
    label: 'Encastré dans les murs',
    description:
      'Les câbles sont insérés dans les murs (saignée ou encastrement). Solution la plus discrète, nécessite des travaux de maçonnerie ou de plâtrerie.'
  },
  {
    value: 'saillie_moulure',
    label: 'Saillie / Moulure',
    description:
      'Les câbles passent en apparent via moulures ou goulottes. Plus rapide à mettre en œuvre, visible sur les murs.'
  },
  {
    value: 'alimentation_existante',
    label: 'Alimentation existante',
    description:
      'Raccordement sur une alimentation déjà en place (prise ou point existant). Pas de nouveau passage de câble principal.'
  }
];

export const SECURITY_OPTIONS = [
  { value: 'wifi', label: 'Wifi (système connecté — sans passage de câble)' }
];

export const SUBCATEGORY_ORDER_INTERIOR = [
  'eclairage', 'prises', 'chauffage', 'domotique', 'securite', 'portail', 'autres'
];

export const SUBCATEGORY_ORDER_EXTERIOR = ['securite', 'portail', 'autres'];

/** 3 catégories wizard (pièces intérieur + extérieur jardin/terrasse/véranda) */
export const WIZARD_INSTALLATION_CATEGORIES = ['eclairage', 'prises', 'ligne_speciale'];

export const WIZARD_CATEGORY_LABELS = {
  eclairage: 'Éclairage',
  prises: 'Prise',
  ligne_speciale: 'Ligne spéciale',
  securite: 'Sécurité',
  portail: 'Portail / Volet roulant'
};

export const SUBCATEGORY_LABELS = {
  eclairage: 'Éclairage',
  prises: 'Prises & alimentation',
  chauffage: 'Chauffage & radiateurs',
  domotique: 'Domotique & connecté',
  securite: 'Sécurité',
  portail: 'Volet / Portail',
  autres: 'Autres prestations',
  ligne_speciale: 'Ligne spéciale'
};

export const INSTALLATION_TYPE_LABELS = {
  saignee_encastre: 'Encastré dans les murs',
  saillie_moulure: 'Saillie / Moulure',
  alimentation_existante: 'Alimentation existante',
  wifi: 'Wifi'
};

export function getInstallationLabel(value) {
  return INSTALLATION_TYPE_LABELS[value] || value;
}

export function isExcludedPrestation(service) {
  if (!service) return false;
  if (EXCLUDED_SERVICE_VALUES.includes(service.value)) return true;
  const label = (service.label || '').toLowerCase();
  if (/^installation interrupteur/.test(label)) return true;
  return false;
}

export function filterExcludedServices(services) {
  return (services || []).filter((s) => !isExcludedPrestation(s));
}

export function tagServices(servicesByRoom, backendServiceType) {
  const tagged = {};
  Object.entries(servicesByRoom || {}).forEach(([room, list]) => {
    tagged[room] = filterExcludedServices(list).map((s) => ({ ...s, backendServiceType }));
  });
  return tagged;
}

export function dedupeServicesByValue(services) {
  const map = new Map();
  filterExcludedServices(services).forEach((s) => {
    if (!map.has(s.value)) map.set(s.value, s);
  });
  return Array.from(map.values());
}

export function getSubCategory(service) {
  const backend = service.backendServiceType;
  if (backend === 'securite') return 'securite';
  if (backend === 'portail') return 'portail';

  const label = (service.label || '').toLowerCase();
  if (/éclairage|eclairage|spot|applique|led|luminaire|plafonnier|bandeau/.test(label)) return 'eclairage';
  if (/prise|rj45|usb|multiprise/.test(label)) return 'prises';
  if (/radiateur|chauffage|chauffe-eau|chauffeau|thermostat/.test(label)) return 'chauffage';
  if (/domotique|connect|volets roulants|motorisation/.test(label)) return 'domotique';
  if (/alarme|caméra|camera|detecteur|sécurité|securite|interphone|badge|sirène/.test(label)) return 'securite';
  if (/volet|portail|store|battant|coulissant/.test(label)) return 'portail';
  return 'autres';
}

export function isEclairageService(service) {
  return getSubCategory(service) === 'eclairage';
}

/** Catégorie affichée au wizard (3 blocs bleu + sécurité + portail). */
export function getWizardCategory(service) {
  const explicit = service?.wizard_category;
  if (explicit && WIZARD_CATEGORY_LABELS[explicit]) return explicit;

  const sub = getSubCategory(service);
  if (sub === 'securite') return 'securite';
  if (sub === 'portail') return 'portail';
  if (sub === 'eclairage') return 'eclairage';
  if (sub === 'prises') return 'prises';
  return 'ligne_speciale';
}

export function groupServicesByWizardCategory(services, categoryOrder) {
  const order = categoryOrder || WIZARD_INSTALLATION_CATEGORIES;
  const groups = {};
  order.forEach((key) => {
    groups[key] = [];
  });

  filterExcludedServices(services).forEach((service) => {
    const key = getWizardCategory(service);
    if (!groups[key]) groups[key] = [];
    groups[key].push(service);
  });

  return order
    .filter((key) => groups[key]?.length > 0)
    .map((key) => ({
      key,
      label: WIZARD_CATEGORY_LABELS[key] || SUBCATEGORY_LABELS[key] || key,
      services: groups[key]
    }));
}

/** Couleurs récap devis selon type de ligne (installation / sécurité / portail). */
export function getDevisItemTheme(item) {
  if (!item || item.type === 'tableau') {
    return { card: 'border border-gray-200 bg-white', title: 'text-gray-900' };
  }
  if (item.serviceType === 'securite') {
    return {
      card: 'border-2 border-sky-400 bg-sky-50/70',
      title: 'text-sky-900'
    };
  }
  if (item.serviceType === 'portail') {
    return {
      card: 'border-2 border-blue-500 bg-blue-50/70',
      title: 'text-blue-900'
    };
  }
  return {
    card: 'border-2 border-cyan-300 bg-cyan-50/60',
    title: 'text-cyan-900'
  };
}

export function groupServicesBySubCategory(services, order) {
  const groups = {};
  (order || SUBCATEGORY_ORDER_INTERIOR).forEach((key) => {
    groups[key] = [];
  });

  filterExcludedServices(services).forEach((service) => {
    const key = getSubCategory(service);
    if (!groups[key]) groups[key] = [];
    groups[key].push(service);
  });

  return order
    .filter((key) => groups[key]?.length > 0)
    .map((key) => ({ key, label: SUBCATEGORY_LABELS[key], services: groups[key] }));
}

export function mergeServicesByRoom(base, extraTagged) {
  const merged = { ...base };
  Object.entries(extraTagged).forEach(([room, list]) => {
    if (!merged[room]) merged[room] = [];
    const existing = new Set(merged[room].map((s) => s.value));
    filterExcludedServices(list).forEach((s) => {
      if (!existing.has(s.value)) merged[room].push(s);
    });
  });
  return merged;
}

export function sortServicesByLabel(services) {
  return filterExcludedServices(services).sort((a, b) =>
    (a.label || '').localeCompare(b.label || '', 'fr', { sensitivity: 'base' })
  );
}

export function stripRoomNumber(label) {
  return (label || '').replace(/\s+\d+$/, '').trim();
}

/** Renumérote Chambre → Chambre 1, Chambre 2… quand plusieurs lignes ont le même roomValue */
export function applyRoomNumbering(items) {
  const byValue = {};
  (items || []).forEach((item) => {
    if (item.type === 'tableau') return;
    if (!byValue[item.roomValue]) byValue[item.roomValue] = [];
    byValue[item.roomValue].push(item);
  });

  return (items || []).map((item) => {
    if (item.type === 'tableau') return item;

    const group = byValue[item.roomValue] || [item];
    const base = item.roomBaseLabel || stripRoomNumber(item.room);

    if (group.length <= 1) {
      return { ...item, roomBaseLabel: base, roomInstance: 1, room: base };
    }

    const sorted = [...group].sort((a, b) => {
      const ia = a.roomInstance || 1;
      const ib = b.roomInstance || 1;
      if (ia !== ib) return ia - ib;
      return String(a.id).localeCompare(String(b.id));
    });
    const instance = sorted.findIndex((i) => i.id === item.id) + 1;

    return {
      ...item,
      roomBaseLabel: base,
      roomInstance: instance,
      room: `${base} ${instance}`
    };
  });
}

export function getNextRoomInstance(items, roomValue) {
  const same = (items || []).filter((i) => i.type !== 'tableau' && i.roomValue === roomValue);
  if (same.length === 0) return 1;
  return Math.max(...same.map((i) => i.roomInstance || 1)) + 1;
}

/** Pièces intérieures disponibles pour copier des prestations */
export function buildCopyTargetRooms(interiorRooms) {
  return (interiorRooms || []).map((r) => ({
    value: r.value,
    label: r.label,
    zone: ZONE_INTERIOR
  }));
}
