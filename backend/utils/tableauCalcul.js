/**
 * Fonctions de calcul pour le tableau électrique
 * LOGIQUE CENTRALISÉE POUR GÉRER TOUS LES CAS
 * Version backend - Logique identique au frontend
 */

const {
  countInterrupteursInstallation,
  countInterrupteursForInstallationItem,
  countTelerupteursFromPrestations,
  shouldAddTelerupteurFromPrestations,
  isInstallationDevisItem
} = require('./specialPrestation');

// ==================== FONCTIONS DE COMPTAGE ====================

/**
 * Compter le nombre de prises dans les prestations
 * Exclut les prestations avec "alimentation_existante"
 * Prise double = 2, Prise triple = 3
 * @param {Array} devisItems - Les items du devis
 * @returns {number} Nombre total de prises
 */
function countPrises(devisItems) {
  if (!devisItems || devisItems.length === 0) return 0;

  let totalPrises = 0;

  devisItems.forEach(item => {
    // Exclure les items de type "tableau" et les items avec "alimentation_existante"
    if (item.type === 'tableau') return;
    if (item.installationType === 'alimentation_existante') return;

    item.services.forEach(service => {
      const label = service.label.toLowerCase();
      const quantity = service.quantity || 1;

      // Détecter les prises dans le label
      if (label.includes('prise')) {
        // Détecter les prises doubles/triples
        if (label.includes('double') || label.includes('2x')) {
          totalPrises += 2 * quantity;
        } else if (label.includes('triple') || label.includes('3x')) {
          totalPrises += 3 * quantity;
        } else {
        // Extraire le nombre de prises si mentionné (ex: "2 prises", "prise 2", "2x prise")
        const priseMatch = label.match(/(\d+)\s*(?:x\s*)?prise/i) || label.match(/prise\s*(?:de\s*)?(\d+)/i);
        if (priseMatch) {
          const nombrePrises = parseInt(priseMatch[1]);
          totalPrises += nombrePrises * quantity;
        } else {
          // Si "prise" est mentionné mais pas de nombre, compter 1 prise par prestation
          totalPrises += quantity;
        }
      }
      }
    });
  });

  return totalPrises;
}

/**
 * Compter le nombre d'éclairages dans les prestations
 * Inclut spots, appliques, bandeaux LED, éclairages
 * @param {Array} devisItems - Les items du devis
 * @returns {number} Nombre total d'éclairages
 */
function countEclairages(devisItems) {
  if (!devisItems || devisItems.length === 0) return 0;

  let totalEclairages = 0;

  devisItems.forEach(item => {
    // Exclure les items de type "tableau" et les items avec "alimentation_existante"
    if (item.type === 'tableau') return;
    if (item.installationType === 'alimentation_existante') return;

    item.services.forEach(service => {
      const label = service.label.toLowerCase();
      const quantity = service.quantity || 1;

      // Détecter tous les types d'éclairages
      if (
        label.includes('éclairage') || 
        label.includes('eclairage') ||
        label.includes('spot') ||
        label.includes('applique') ||
        label.includes('bandeau') ||
        label.includes('led')
      ) {
        // Extraire le nombre d'éclairages si mentionné
        const eclairageMatch = label.match(/(\d+)\s*(?:x\s*)?(?:éclairage|eclairage|spot|applique|bandeau|led)/i);
        if (eclairageMatch) {
          const nombreEclairages = parseInt(eclairageMatch[1]);
          totalEclairages += nombreEclairages * quantity;
        } else {
          // Si éclairage est mentionné mais pas de nombre, compter 1 éclairage par prestation
          totalEclairages += quantity;
        }
      }
    });
  });

  return totalEclairages;
}

function countInterrupteurs(devisItems) {
  return countInterrupteursInstallation(devisItems);
}

function appendTelerupteurMaterial(materiels, quantity = 1) {
  const qty = Math.max(0, parseInt(quantity, 10) || 0);
  if (qty <= 0) return;

  const existing = materiels.find((m) => m.code === 'TEL001');
  if (existing) {
    existing.quantity = Math.max(existing.quantity || 0, qty);
    return;
  }

  materiels.push({
    label: 'Telerupteur',
    quantity: qty,
    code: 'TEL001',
    category: 'tableau',
    serviceType: 'tableau'
  });
}

/**
 * Compter le nombre de radiateurs électriques
 * @param {Array} devisItems - Les items du devis
 * @returns {number} Nombre total de radiateurs
 */
function countRadiateurs(devisItems) {
  if (!devisItems || devisItems.length === 0) return 0;

  let totalRadiateurs = 0;

  devisItems.forEach(item => {
    if (item.type === 'tableau') return;
    if (item.installationType === 'alimentation_existante') return;

    item.services.forEach(service => {
      const label = service.label.toLowerCase();
      const quantity = service.quantity || 1;

      if (label.includes('radiateur')) {
        const radiateurMatch = label.match(/(\d+)\s*radiateur/i);
        if (radiateurMatch) {
          totalRadiateurs += parseInt(radiateurMatch[1]) * quantity;
        } else {
          totalRadiateurs += quantity;
        }
      }
    });
  });

  return totalRadiateurs;
}

/**
 * Compter les appareils électroménagers
 * @param {Array} devisItems - Les items du devis
 * @returns {Object} { laveLinge: number, laveVaisselle: number, four: number, frigo: number, plaqueCuisson: number, vmc: number }
 */
function countAppareilsElectromenagers(devisItems) {
  if (!devisItems || devisItems.length === 0) {
    return { laveLinge: 0, laveVaisselle: 0, four: 0, frigo: 0, plaqueCuisson: 0, vmc: 0 };
  }

  let laveLinge = 0;
  let laveVaisselle = 0;
  let four = 0;
  let frigo = 0;
  let plaqueCuisson = 0;
  let vmc = 0;

  devisItems.forEach(item => {
    if (item.type === 'tableau') return;
    if (item.installationType === 'alimentation_existante') return;

    item.services.forEach(service => {
      const label = service.label.toLowerCase();
      const quantity = service.quantity || 1;

      if (label.includes('lave-linge') || label.includes('lave linge')) {
        laveLinge += quantity;
      } else if (label.includes('lave-vaisselle') || label.includes('lave vaisselle')) {
        laveVaisselle += quantity;
      } else if (label.includes('four')) {
        four += quantity;
      } else if (label.includes('frigo') || label.includes('réfrigérateur') || label.includes('refrigerateur')) {
        frigo += quantity;
      } else if (label.includes('plaque') && (label.includes('cuisson') || label.includes('cuisinière'))) {
        plaqueCuisson += quantity;
      } else if (label.includes('vmc')) {
        vmc += quantity;
      }
    });
  });

  return { laveLinge, laveVaisselle, four, frigo, plaqueCuisson, vmc };
}

/**
 * Compter les appareils triphasés
 * @param {Array} devisItems - Les items du devis
 * @returns {number} Nombre d'appareils triphasés
 */
function countAppareilsTriphases(devisItems) {
  if (!devisItems || devisItems.length === 0) return 0;

  let totalTriphases = 0;

  devisItems.forEach(item => {
    if (item.type === 'tableau') return;
    if (item.installationType === 'alimentation_existante') return;

    item.services.forEach(service => {
      const label = service.label.toLowerCase();
      const quantity = service.quantity || 1;

      // Détecter les appareils triphasés (piscine, pompe, etc.)
      if (
        label.includes('triphasé') ||
        label.includes('triphase') ||
        label.includes('piscine') ||
        label.includes('pompe') ||
        (label.includes('relevage') && label.includes('pompe'))
      ) {
        totalTriphases += quantity;
      }
    });
  });

  return totalTriphases;
}

/**
 * Vérifier si "chauffe-eau" est présent dans les prestations
 * @param {Array} devisItems - Les items du devis
 * @returns {boolean}
 */
function hasChauffeau(devisItems) {
  if (!devisItems || devisItems.length === 0) return false;

  return devisItems.some(item => {
    if (item.type === 'tableau') return false;
    return item.services.some(service => 
      service.label.toLowerCase().includes('chauffeau') ||
      service.label.toLowerCase().includes('chauffe-eau')
    );
  });
}

/**
 * Vérifier si "chauffe-eau" est sélectionné dans le questionnaire
 * @param {Object} questionnaire - Données du questionnaire
 * @returns {boolean}
 */
function hasChauffeauInQuestionnaire(questionnaire) {
  if (!questionnaire || !questionnaire.lignesSpeciales) return false;
  return questionnaire.lignesSpeciales.includes('chauffeau');
}

// ==================== FONCTIONS DE CALCUL DES DISJONCTEURS ====================

/**
 * Calculer le nombre de disjoncteurs 16A nécessaires pour les prises
 * 1 disjoncteur tous les 5 prises
 * @param {number} nombrePrises - Nombre total de prises
 * @returns {number} Nombre de disjoncteurs 16A
 */
function calculateDisjoncteurs16A(nombrePrises) {
  if (nombrePrises <= 0) return 0;
  return Math.ceil(nombrePrises / 5);
}

/**
 * Calculer le nombre de disjoncteurs nécessaires pour les éclairages
 * 1 disjoncteur tous les 8 éclairages (calibre à déterminer selon contexte)
 * @param {number} nombreEclairages - Nombre total d'éclairages
 * @returns {number} Nombre de disjoncteurs
 */
function calculateDisjoncteursEclairages(nombreEclairages) {
  if (nombreEclairages <= 0) return 0;
  return Math.ceil(nombreEclairages / 8);
}

/**
 * Calculer tous les disjoncteurs nécessaires à partir des prestations
 * @param {Array} devisItems - Les items du devis (prestations)
 * @returns {Object} { d2: number, d10: number, d16: number, d20: number, d32: number, triphase: number }
 */
function calculateDisjoncteursFromPrestations(devisItems) {
  const result = {
    d2: 0,    // VMC
    d10: 0,   // Éclairages (tous les 8)
    d16: 0,   // Prises (tous les 5)
    d20: 0,   // Radiateurs, lave-linge, lave-vaisselle, four, frigo, chauffe-eau
    d32: 0,   // Plaque de cuisson
    triphase: 0  // Appareils triphasés
  };

  // Compter les différents éléments
  const nombrePrises = countPrises(devisItems);
  const nombreEclairages = countEclairages(devisItems);
  const nombreRadiateurs = countRadiateurs(devisItems);
  const appareils = countAppareilsElectromenagers(devisItems);
  const nombreAppareilsTriphases = countAppareilsTriphases(devisItems);
  const hasChauffeauInPresta = hasChauffeau(devisItems);

  // Calculer les disjoncteurs selon les règles
  result.d16 = calculateDisjoncteurs16A(nombrePrises);
  result.d10 = calculateDisjoncteursEclairages(nombreEclairages);
  
  // Radiateurs : 1 D20 par radiateur (domotique et installation)
  result.d20 += nombreRadiateurs;

  // Appareils électroménagers : 1 D20 chacun
  result.d20 += appareils.laveLinge;
  result.d20 += appareils.laveVaisselle;
  result.d20 += appareils.four;
  result.d20 += appareils.frigo;

  // Plaque de cuisson : 1 D32
  result.d32 += appareils.plaqueCuisson;

  // VMC : 1 D2
  result.d2 += appareils.vmc;

  // Chauffe-eau : 1 D2 et 1 D20
  if (hasChauffeauInPresta) {
    result.d2 += 1;
    result.d20 += 1;
  }

  // Appareils triphasés : 1 disjoncteur triphasé par appareil
  result.triphase = nombreAppareilsTriphases;

  return result;
}

// ==================== FONCTIONS DE CALCUL DES RANGÉES ET TABLEAUX ====================

/**
 * Calculer le nombre de places nécessaires pour une liste de disjoncteurs
 * Un disjoncteur triphasé occupe 3 places, les autres 1 place
 * Contacteur HC et télérupteur = 1 place chacun
 * @param {Object} disjoncteurs - { d2, d10, d16, d20, d32, triphase }
 * @param {boolean} hasContacteurHC - Présence d'un contacteur HC (chauffe-eau)
 * @param {number} telerupteurCount - Nombre de télérupteurs (1 place chacun)
 * @returns {number} Nombre total de places nécessaires
 */
function calculatePlacesNecessaires(disjoncteurs, hasContacteurHC = false, telerupteurCount = 0) {
  const placesDisjoncteurs = disjoncteurs.d2 + disjoncteurs.d10 + disjoncteurs.d16 + 
                             disjoncteurs.d20 + disjoncteurs.d32;
  const placesTriphases = disjoncteurs.triphase * 3; // 3 places par disjoncteur triphasé
  const placesContacteurHC = hasContacteurHC ? 1 : 0; // 1 place pour le contacteur HC
  const placesTelerupteur = Math.max(0, parseInt(telerupteurCount, 10) || 0);
  return placesDisjoncteurs + placesTriphases + placesContacteurHC + placesTelerupteur;
}

/**
 * Calculer le nombre de rangées nécessaires
 * Maximum 10 places par rangée
 * @param {number} nombrePlaces - Nombre total de places nécessaires
 * @returns {number} Nombre de rangées
 */
function calculateRangees(nombrePlaces) {
  if (nombrePlaces <= 0) return 1; // Minimum 1 rangée
  return Math.ceil(nombrePlaces / 10);
}

/**
 * Calculer la main d'œuvre (tarif par rangée configurable, défaut 260 € HT)
 * @param {number} nombreRangees - Nombre de rangées
 * @param {number} [prixParRangee=260] - € HT par rangée
 * @returns {number} Prix de la main d'œuvre
 */
function calculateMainOeuvre(nombreRangees, prixParRangee = 200) {
  const p = Number(prixParRangee);
  const rate = Number.isFinite(p) && p > 0 ? p : 200;
  return rate * nombreRangees;
}

/**
 * Calculer les tableaux et rangées nécessaires en tenant compte des questionnaires existants
 * @param {Array} questionnaires - Tableau des questionnaires (peut contenir plusieurs tableaux)
 * @param {Object} disjoncteursPrestations - Disjoncteurs nécessaires pour les prestations ajoutées
 * @param {Array} devisItems - Les items du devis pour calculer contacteur HC et télérupteur
 * @returns {Array} Tableau d'objets { tableau: number, rangees: number, placesUtilisees: number, placesDisponibles: number }
 */
function calculateTableauxRangees(questionnaires = [], disjoncteursPrestations = { d2: 0, d10: 0, d16: 0, d20: 0, d32: 0, triphase: 0 }, devisItems = []) {
  const tableaux = [];
  
  // Calculer si contacteur HC et télérupteur sont nécessaires
  const hasContacteurHCPrestations = hasChauffeau(devisItems); // Contacteur HC nécessaire à cause des prestations
  const hasContacteurHCQuestionnaire = questionnaires.some(q => q.lignesSpeciales && q.lignesSpeciales.includes('chauffeau')); // Contacteur HC dans questionnaire
  const hasTelerupteurPrestations = countTelerupteursFromPrestations(devisItems);
  const hasTelerupteurQuestionnaire = questionnaires.some(q => q.telerupteur === true); // Télérupteur dans questionnaire
  
  // Si pas de questionnaires, calculer à partir des prestations uniquement
  if (!questionnaires || questionnaires.length === 0) {
    const placesPrestations = calculatePlacesNecessaires(
      disjoncteursPrestations,
      hasContacteurHCPrestations,
      hasTelerupteurPrestations
    );
    const rangeesPrestations = calculateRangees(placesPrestations);
    
    // Maximum 4 rangées par tableau
    if (rangeesPrestations <= 4) {
      tableaux.push({
        tableau: 1,
        rangees: rangeesPrestations,
        placesUtilisees: placesPrestations,
        placesDisponibles: 0,
        placesMax: rangeesPrestations * 10
      });
    } else {
      // Plusieurs tableaux nécessaires
      let placesRestantes = placesPrestations;
      let numeroTableau = 1;
      
      while (placesRestantes > 0) {
        const rangeesPourCeTableau = Math.min(4, calculateRangees(placesRestantes));
        const placesPourCeTableau = Math.min(rangeesPourCeTableau * 10, placesRestantes);
        
        tableaux.push({
          tableau: numeroTableau,
          rangees: rangeesPourCeTableau,
          placesUtilisees: placesPourCeTableau,
          placesDisponibles: 0,
          placesMax: rangeesPourCeTableau * 10
        });
        
        placesRestantes -= placesPourCeTableau;
        numeroTableau++;
      }
    }
    
    return tableaux;
  }

  // Avec questionnaires existants
  // Pour les prestations, ne compter le contacteur HC et télérupteur que s'ils ne sont pas déjà dans le questionnaire
  // Calculer les places nécessaires pour les prestations (sans contacteur HC et télérupteur si déjà dans questionnaire)
  let placesRestantesPrestations = calculatePlacesNecessaires(
    disjoncteursPrestations, 
    hasContacteurHCPrestations && !hasContacteurHCQuestionnaire, 
    !hasTelerupteurQuestionnaire ? hasTelerupteurPrestations : 0
  );
  
  // Parcourir les questionnaires existants pour utiliser les places disponibles
  questionnaires.forEach((questionnaire, index) => {
    const nombreRangees = parseInt(questionnaire.nombreRangees) || 1;
    const nombreDisjoncteursQuestionnaire = parseInt(questionnaire.nombreDisjoncteurs) || 0;
    const appareilsTriphases = parseInt(questionnaire.appareilTriphase) || 0;
    
    // Calculer les places utilisées dans ce tableau
    // - Disjoncteurs du questionnaire (D10 et D20)
    const placesDisjoncteursQ = nombreDisjoncteursQuestionnaire;
    // - Disjoncteurs triphasés (3 places chacun)
    const placesTriphasesQ = appareilsTriphases * 3;
    // - Différentiels : NE PAS COMPTER dans les places (ajoutés automatiquement, 1 par rangée)
    // - Lignes spéciales (D20 ou D32) - exclure chauffe-eau car déjà compté séparément
    let placesLignesSpeciales = 0;
    if (questionnaire.lignesSpeciales && Array.isArray(questionnaire.lignesSpeciales)) {
      placesLignesSpeciales = questionnaire.lignesSpeciales.filter(ligne => ligne !== 'chauffeau').length;
    }
    // - Radiateurs (4 ou 8 D20 selon le nombre)
    const nombreRadiateursQ = parseInt(questionnaire.radiateurElectrique) || 0;
    const placesRadiateurs = nombreRadiateursQ > 0 ? (nombreRadiateursQ <= 5 ? 4 : 8) : 0;
    // - Chauffe-eau : contacteur HC (1 place) + D2 (1 place) + D20 (1 place)
    // Ne compter que si chauffe-eau est dans le questionnaire ET pas déjà compté dans les prestations
    const hasChauffeauQ = questionnaire.lignesSpeciales && questionnaire.lignesSpeciales.includes('chauffeau');
    const placesContacteurHC = (hasChauffeauQ && !hasContacteurHCPrestations) ? 1 : 0; // Contacteur HC = 1 place (seulement si pas déjà dans prestations)
    const placesD2Chauffeau = (hasChauffeauQ && !hasContacteurHCPrestations) ? 1 : 0; // D2 pour chauffe-eau = 1 place
    const placesD20Chauffeau = (hasChauffeauQ && !hasContacteurHCPrestations) ? 1 : 0; // D20 pour chauffe-eau = 1 place
    // - Télérupteur (1 place si présent dans ce questionnaire, ou si >= 3 interrupteurs ET premier tableau)
    // Ne compter qu'une seule fois : si nécessaire à cause des prestations, il est déjà dans placesRestantesPrestations
    const hasTelerupteurQ = questionnaire.telerupteur === true
      || (index === 0 && hasTelerupteurPrestations > 0 && !hasTelerupteurQuestionnaire);
    const placesTelerupteur = questionnaire.telerupteur === true
      ? Math.max(1, index === 0 ? hasTelerupteurPrestations : 0)
      : (index === 0 && hasTelerupteurPrestations > 0 && !hasTelerupteurQuestionnaire
        ? hasTelerupteurPrestations
        : 0);
    
    const placesUtiliseesQ = placesDisjoncteursQ + placesTriphasesQ + 
                             placesLignesSpeciales + placesRadiateurs + 
                             placesContacteurHC + placesD2Chauffeau + placesD20Chauffeau + 
                             placesTelerupteur;
    
    // Places disponibles dans ce tableau
    const placesMaxQ = nombreRangees * 10;
    const placesDisponiblesQ = Math.max(0, placesMaxQ - placesUtiliseesQ);
    
    // Utiliser les places disponibles pour les prestations
    const placesUtiliseesPourPrestations = Math.min(placesDisponiblesQ, placesRestantesPrestations);
    
    // Calculer le nombre total de places utilisées (questionnaire + prestations)
    const placesTotalesUtilisees = placesUtiliseesQ + placesUtiliseesPourPrestations;
    
    // Utiliser le nombre de rangées du questionnaire comme minimum
    // Si les places totales nécessitent plus de rangées, utiliser le maximum
    const nombreRangeesNecessaires = Math.max(nombreRangees, calculateRangees(placesTotalesUtilisees));
    
    tableaux.push({
      tableau: index + 1,
      rangees: nombreRangeesNecessaires,
      placesUtilisees: placesTotalesUtilisees,
      placesDisponibles: (nombreRangeesNecessaires * 10) - placesTotalesUtilisees,
      placesMax: nombreRangeesNecessaires * 10,
      fromQuestionnaire: true
    });
    
    placesRestantesPrestations -= placesUtiliseesPourPrestations;
  });
  
  // Si il reste des places à allouer, créer de nouveaux tableaux
  while (placesRestantesPrestations > 0) {
    const rangeesPourCeTableau = Math.min(4, calculateRangees(placesRestantesPrestations));
    const placesPourCeTableau = Math.min(rangeesPourCeTableau * 10, placesRestantesPrestations);
    
    tableaux.push({
      tableau: questionnaires.length + tableaux.filter(t => !t.fromQuestionnaire).length + 1,
      rangees: rangeesPourCeTableau,
      placesUtilisees: placesPourCeTableau,
      placesDisponibles: 0,
      placesMax: rangeesPourCeTableau * 10,
      fromQuestionnaire: false
    });
    
    placesRestantesPrestations -= placesPourCeTableau;
  }
  
  return tableaux;
}

// ==================== FONCTIONS DE CALCUL DES MATÉRIELS ====================

/**
 * Regrouper les matériaux par code et additionner les quantités
 * @param {Array} materiels - Tableau de matériaux
 * @returns {Array} Matériaux regroupés par code
 */
function groupMaterielsByCode(materiels) {
  const grouped = new Map();
  
  materiels.forEach(materiel => {
    const code = materiel.code;
    if (grouped.has(code)) {
      // Additionner les quantités
      const existing = grouped.get(code);
      existing.quantity += materiel.quantity || 1;
    } else {
      // Créer une nouvelle entrée
      grouped.set(code, { ...materiel, quantity: materiel.quantity || 1 });
    }
  });
  
  return Array.from(grouped.values());
}

/**
 * Calculer les matériels du tableau selon le questionnaire (pour "Changer mon tableau uniquement")
 * @param {Object} questionnaire - Données du questionnaire
 * @param {Array} devisItems - Les items du devis pour compter les interrupteurs (optionnel)
 * @param {number} [prixParRangee=260] - € HT main d'œuvre par rangée
 * @returns {Object} { materiels: Array, mainOeuvre: number, rangees: number }
 */
function calculateTableauFromQuestionnaire(questionnaire, devisItems = [], prixParRangee = 260) {
  const materiels = [];
  
  if (!questionnaire) return { materiels: [], mainOeuvre: 0, rangees: 0 };
  
  const nombreRangees = parseInt(questionnaire.nombreRangees) || 1;
  const nombreDisjoncteurs = parseInt(questionnaire.nombreDisjoncteurs) || 0;
  const nombrePhase = questionnaire.nombrePhase || 'monophaser';
  const isTriphase = nombrePhase === 'triphaser';
  const appareilsTriphases = parseInt(questionnaire.appareilTriphase) || 0;
  
    // Ajouter le tableau (codes: TAB001, TAB002, TAB003, TAB004)
    const tableauCode = `TAB${String(nombreRangees).padStart(3, '0')}`;
    materiels.push({
      label: 'Tableau',
      quantity: 1,
      code: tableauCode,
      category: 'tableau',
      serviceType: 'tableau'
    });
  
  // Ajouter les différentiels (codes: DIF001 monophasé, DIF002 triphasé)
  // 1 rangée = 1 disjoncteur différentiel monophasé
  // Si triphasé ET au moins 1 appareil triphasé, ajouter différentiel triphasé
  materiels.push({
    label: 'Disjoncteur différentiel monophasé',
    quantity: nombreRangees,
    code: 'DIF001',
    category: 'tableau',
    serviceType: 'tableau',
    prix_ht: 70
  });

  // Ajouter différentiel triphasé seulement si triphasé ET au moins 1 appareil triphasé
  if (isTriphase && appareilsTriphases > 0) {
    materiels.push({
      label: 'Disjoncteur différentiel triphasé',
      quantity: 1,
      code: 'DIF002',
      category: 'tableau',
      serviceType: 'tableau'
    });
  }
  
  // Ajouter les disjoncteurs du questionnaire : ajouter directement le nombre saisi comme disjoncteurs divisionnaires
  if (nombreDisjoncteurs > 0) {
    materiels.push({
      label: 'Disjoncteur divisionnaire',
      quantity: nombreDisjoncteurs,
      code: 'DISDIV',
      category: 'tableau',
      serviceType: 'tableau',
      prix_ht: 15.50
    });
  }

  // Lignes spéciales : disjoncteur divisionnaire par sélection (sauf chauffe-eau qui est géré séparément)
  if (questionnaire.lignesSpeciales && Array.isArray(questionnaire.lignesSpeciales)) {
    questionnaire.lignesSpeciales.forEach(ligne => {
      // Chauffe-eau est géré séparément avec D2 + disjoncteur divisionnaire + contacteur
      if (ligne !== 'chauffeau') {
        materiels.push({
          label: 'Disjoncteur divisionnaire',
          quantity: 1,
          code: 'DISDIV',
          category: 'tableau',
          serviceType: 'tableau',
          prix_ht: 15.50
        });
      }
    });
  }

  // Radiateur : 4 disjoncteurs divisionnaires si 5 ou moins, 8 si plus de 5
  const nombreRadiateurs = parseInt(questionnaire.radiateurElectrique) || 0;
  if (nombreRadiateurs > 0) {
    const qteRadiateurs = nombreRadiateurs <= 5 ? 4 : 8;
    materiels.push({
      label: 'Disjoncteur divisionnaire',
      quantity: qteRadiateurs,
      code: 'DISDIV',
      category: 'tableau',
      serviceType: 'tableau',
      prix_ht: 15.50
    });
  }

  // Ajouter disjoncteurs triphasés si appareils triphasés
  if (appareilsTriphases > 0) {
    materiels.push({
      label: 'Disjoncteur triphasé',
      quantity: appareilsTriphases,
      code: 'DIS3PH',
      category: 'tableau',
      serviceType: 'tableau'
    });
  }
  
  // Ajouter horloge/contacteur si chauffe-eau sélectionné
  if (questionnaire.lignesSpeciales && questionnaire.lignesSpeciales.includes('chauffeau')) {
    materiels.push({
      label: 'Horloge/contacteur heure creuse',
      quantity: 1,
      code: 'HOR001',
      category: 'tableau',
      serviceType: 'tableau'
    });
    
    // Ajouter 1 D2 et 1 disjoncteur divisionnaire pour chauffe-eau
    materiels.push({
      label: 'Disjoncteur 2A',
      quantity: 1,
      code: 'DIS002',
      category: 'tableau',
      serviceType: 'tableau'
    });
    
    materiels.push({
      label: 'Disjoncteur divisionnaire',
      quantity: 1,
      code: 'DISDIV',
      category: 'tableau',
      serviceType: 'tableau',
      prix_ht: 15.50
    });
  }
  
  // Ajouter télérupteur si sélectionné dans le questionnaire OU ≥ 3 interrupteurs (prestations récap)
  const telQtyPrestations = countTelerupteursFromPrestations(devisItems);
  const telQty = Math.max(questionnaire.telerupteur === true ? 1 : 0, telQtyPrestations);
  if (telQty > 0) {
    appendTelerupteurMaterial(materiels, telQty);
  }
  
  // Ajouter 50€ de fourniture pour chaque tableau
  materiels.push({
    label: 'Fourniture tableau électrique',
    quantity: 1,
    code: 'FOU001',
    category: 'tableau',
    serviceType: 'tableau',
    prix_ht: 50,
    type_produit: 'fourniture'
  });
  
  const mainOeuvre = calculateMainOeuvre(nombreRangees, prixParRangee);
  
  // Regrouper les matériaux par code pour éviter les doublons
  const materielsGroupes = groupMaterielsByCode(materiels);
  
  return {
    materiels: materielsGroupes,
    mainOeuvre,
    rangees: nombreRangees
  };
}

/**
 * Calculer les matériels du tableau pour "Nouveau tableau" ou "Changer + ajouter prestation"
 * Combine questionnaire(s) + prestations
 * Même logique ; tarif par rangée configurable (défaut 260 € HT)
 * @param {Array} questionnaires - Tableau des questionnaires (vide pour "Nouveau tableau")
 * @param {Array} devisItems - Les prestations ajoutées
 * @param {number} [prixParRangee=260] - € HT main d'œuvre par rangée
 * @returns {Object} { materiels: Array, mainOeuvre: number, tableaux: Array }
 */
function calculateTableauFromQuestionnaireAndPrestations(questionnaires = [], devisItems = [], prixParRangee = 260) {
  const materiels = [];
  let totalMainOeuvre = 0;
  
  // Calculer les disjoncteurs nécessaires pour les prestations
  const disjoncteursPrestations = calculateDisjoncteursFromPrestations(devisItems);
  
  // Calculer les tableaux et rangées nécessaires
  const tableauxConfig = calculateTableauxRangees(questionnaires, disjoncteursPrestations, devisItems);
  
  const telerupteurQtyPrestations = countTelerupteursFromPrestations(devisItems);
  
  // Variable pour suivre si les disjoncteurs des prestations ont déjà été ajoutés
  let disjoncteursPrestationsAjoutes = false;
  
  // Compteur pour suivre l'index du questionnaire actuel
  let questionnaireIndexCounter = 0;
  
  // Pour chaque tableau, ajouter les matériaux
  tableauxConfig.forEach((config, index) => {
    const nombreRangees = config.rangees;
    
    // Ajouter le tableau
    const tableauCode = `TAB${String(nombreRangees).padStart(3, '0')}`;
    materiels.push({
      label: 'Tableau',
      quantity: 1,
      code: tableauCode,
      category: 'tableau',
      serviceType: 'tableau'
    });
    
    // Trouver le questionnaire correspondant à ce tableau AVANT de déterminer le type de phase
    let questionnaire = null;
    if (config.fromQuestionnaire) {
      questionnaire = questionnaires[questionnaireIndexCounter];
    }
    
    // Déterminer le type de phase (monophasé par défaut, triphasé si appareils triphasés)
    // Utiliser le questionnaire trouvé si disponible, sinon utiliser l'index
    const hasAppareilsTriphases = disjoncteursPrestations.triphase > 0 || 
      (questionnaire && parseInt(questionnaire.appareilTriphase) > 0) ||
      (questionnaires[index] && parseInt(questionnaires[index].appareilTriphase) > 0);
    const isTriphase = hasAppareilsTriphases;
    
    // Ajouter les différentiels
    // 1 différentiel monophasé par rangée
    materiels.push({
      label: 'Disjoncteur différentiel monophasé',
      quantity: nombreRangees,
      code: 'DIF001',
      category: 'tableau',
      serviceType: 'tableau',
      prix_ht: 70
    });
    
    // Ajouter différentiel triphasé seulement si triphasé ET au moins 1 appareil triphasé
    if (isTriphase && (disjoncteursPrestations.triphase > 0 || 
        (questionnaire && parseInt(questionnaire.appareilTriphase) > 0) ||
        (questionnaires[index] && parseInt(questionnaires[index].appareilTriphase) > 0))) {
      materiels.push({
        label: 'Disjoncteur différentiel triphasé',
        quantity: 1,
        code: 'DIF002',
        category: 'tableau',
        serviceType: 'tableau'
      });
    }
    
    // Ajouter les disjoncteurs du questionnaire si présent (seulement pour les tableaux du questionnaire)
    if (config.fromQuestionnaire && questionnaire) {
      if (questionnaire) {
        // Parser la valeur - utiliser la même logique que calculateTableauFromQuestionnaire
        // pour être cohérent
        const nombreDisjoncteursQ = parseInt(questionnaire.nombreDisjoncteurs) || 0;
        
        // Ajouter les disjoncteurs divisionnaires du questionnaire
        // IMPORTANT: Ajouter même si nombreDisjoncteursQ est 0, car c'est ce qui a été saisi
        // Mais en fait, on ne doit ajouter que si > 0
        if (nombreDisjoncteursQ > 0) {
          materiels.push({
            label: 'Disjoncteur divisionnaire',
            quantity: nombreDisjoncteursQ,
            code: 'DISDIV',
            category: 'tableau',
            serviceType: 'tableau',
            prix_ht: 15.50
          });
        }
        
        // Lignes spéciales du questionnaire
        if (questionnaire.lignesSpeciales && Array.isArray(questionnaire.lignesSpeciales)) {
          questionnaire.lignesSpeciales.forEach(ligne => {
          if (ligne === 'chauffeau') {
            materiels.push({
              label: 'Disjoncteur 2A',
              quantity: 1,
              code: 'DIS002',
              category: 'tableau',
              serviceType: 'tableau'
            });
            materiels.push({
              label: 'Disjoncteur divisionnaire',
              quantity: 1,
              code: 'DISDIV',
              category: 'tableau',
              serviceType: 'tableau',
              prix_ht: 15.50
            });
            materiels.push({
              label: 'Horloge/contacteur heure creuse',
              quantity: 1,
              code: 'HOR001',
              category: 'tableau',
              serviceType: 'tableau'
            });
          } else {
            materiels.push({
              label: 'Disjoncteur divisionnaire',
              quantity: 1,
              code: 'DISDIV',
              category: 'tableau',
              serviceType: 'tableau',
              prix_ht: 15.50
            });
          }
        });
        }
      
        // Radiateurs du questionnaire
        const nombreRadiateursQ = parseInt(questionnaire.radiateurElectrique) || 0;
        if (nombreRadiateursQ > 0) {
          const qteRadiateurs = nombreRadiateursQ <= 5 ? 4 : 8;
          materiels.push({
            label: 'Disjoncteur divisionnaire',
            quantity: qteRadiateurs,
            code: 'DISDIV',
            category: 'tableau',
            serviceType: 'tableau',
            prix_ht: 15.50
          });
        }
        
        // Ajouter disjoncteurs triphasés du questionnaire si présents
        const appareilsTriphasesQ = parseInt(questionnaire.appareilTriphase) || 0;
        if (appareilsTriphasesQ > 0) {
          materiels.push({
            label: 'Disjoncteur triphasé',
            quantity: appareilsTriphasesQ,
            code: 'DIS3PH',
            category: 'tableau',
            serviceType: 'tableau'
          });
        }
        
        // Ajouter télérupteur si sélectionné dans le questionnaire (au moins 1)
        if (questionnaire.telerupteur === true) {
          appendTelerupteurMaterial(materiels, 1);
        }
        
        // Incrémenter le compteur pour le prochain tableau du questionnaire
        questionnaireIndexCounter++;
      }
    }
    
    // Ajouter les disjoncteurs des prestations UNE SEULE FOIS dans le premier tableau
    if (!disjoncteursPrestationsAjoutes) {
      // Calculer le total des disjoncteurs divisionnaires nécessaires (d10, d16, d20, d32)
      // d2 reste séparé car c'est pour VMC et chauffe-eau
      const totalDisjoncteursDivisionnaires = disjoncteursPrestations.d10 + 
                                               disjoncteursPrestations.d16 + 
                                               disjoncteursPrestations.d20 + 
                                               disjoncteursPrestations.d32;
      
      if (totalDisjoncteursDivisionnaires > 0) {
        materiels.push({
          label: 'Disjoncteur divisionnaire',
          quantity: totalDisjoncteursDivisionnaires,
          code: 'DISDIV',
          category: 'tableau',
          serviceType: 'tableau',
          prix_ht: 15.50
        });
        disjoncteursPrestationsAjoutes = true;
      }
      
      // Ajouter disjoncteur 2A pour VMC et chauffe-eau (gardé séparément)
      if (disjoncteursPrestations.d2 > 0) {
        materiels.push({
          label: 'Disjoncteur 2A',
          quantity: disjoncteursPrestations.d2,
          code: 'DIS002',
          category: 'tableau',
          serviceType: 'tableau'
        });
      }
      
      // Ajouter disjoncteurs triphasés si présents
      if (disjoncteursPrestations.triphase > 0) {
        materiels.push({
          label: 'Disjoncteur triphasé',
          quantity: disjoncteursPrestations.triphase,
          code: 'DIS3PH',
          category: 'tableau',
          serviceType: 'tableau'
        });
      }
      
      // Ajouter horloge/contacteur si chauffe-eau dans prestations
      if (hasChauffeau(devisItems)) {
        materiels.push({
          label: 'Horloge/contacteur heure creuse',
          quantity: 1,
          code: 'HOR001',
          category: 'tableau',
          serviceType: 'tableau'
        });
      }
    }
    
    // Ajouter télérupteur si ≥ 3 interrupteurs dans le récap (premier tableau)
    if (telerupteurQtyPrestations > 0 && index === 0) {
      appendTelerupteurMaterial(materiels, telerupteurQtyPrestations);
    }
    
    // Ajouter 50€ de fourniture pour chaque tableau
    materiels.push({
      label: 'Fourniture tableau électrique',
      quantity: 1,
      code: 'FOU001',
      category: 'tableau',
      serviceType: 'tableau',
      prix_ht: 50,
      type_produit: 'fourniture'
    });
    
    totalMainOeuvre += calculateMainOeuvre(nombreRangees, prixParRangee);
  });
  
  // Regrouper les matériaux par code pour éviter les doublons
  const materielsGroupes = groupMaterielsByCode(materiels);
  
  return {
    materiels: materielsGroupes,
    mainOeuvre: totalMainOeuvre,
    tableaux: tableauxConfig
  };
}

/**
 * Calculer les matériels du tableau électrique (ancienne fonction, conservée pour compatibilité)
 * @param {Array} devisItems - Les items du devis (prestations)
 * @param {Object} tableauData - Données du tableau (choice, questionnaire)
 * @param {Object} [options]
 * @param {number} [options.mainOeuvreParRangee=260] - € HT par rangée (config admin)
 * @returns {Object} { materiels: Array, mainOeuvre: number, rangees: number }
 */
function resolveMainOeuvreRates(options = {}) {
  const pose =
    options.mainOeuvrePoseParRangee != null && Number(options.mainOeuvrePoseParRangee) > 0
      ? Number(options.mainOeuvrePoseParRangee)
      : 200;
  const changement =
    options.mainOeuvreChangementParRangee != null && Number(options.mainOeuvreChangementParRangee) > 0
      ? Number(options.mainOeuvreChangementParRangee)
      : 360;
  return { pose, changement };
}

function normalizeTableauData(tableauData) {
  if (!tableauData) return null;
  if (tableauData.choice === 'inexistant') {
    return { ...tableauData, questionnaire: null, changeType: null };
  }
  return tableauData;
}

function getMainOeuvreRateForTableau(tableauData, rates) {
  const data = normalizeTableauData(tableauData);
  if (!data || data.choice === 'garder') return null;
  if (data.choice === 'inexistant') return rates.pose;
  if (data.choice === 'changer') return rates.changement;
  return rates.pose;
}

function withMainOeuvreMeta(result, mainOeuvreType, mainOeuvreParRangee) {
  return {
    ...result,
    mainOeuvreType,
    mainOeuvreParRangee
  };
}

function calculateTableauMateriels(devisItems, tableauData, options = {}) {
  const rates = resolveMainOeuvreRates(options);
  const data = normalizeTableauData(tableauData);

  if (!data || data.choice === 'garder') {
    return { materiels: [], mainOeuvre: 0, rangees: 0 };
  }

  // Nouveau tableau / devis rapide : tarif pose (prioritaire sur changeType)
  if (data.choice === 'inexistant') {
    const prixPose = getMainOeuvreRateForTableau(data, rates);
    const result = calculateTableauFromQuestionnaireAndPrestations([], devisItems, prixPose);
    const totalRangees = result.tableaux
      ? result.tableaux.reduce((sum, t) => sum + t.rangees, 0)
      : 0;
    return withMainOeuvreMeta({ ...result, rangees: totalRangees }, 'pose', prixPose);
  }

  // Changement / remplacement de tableau
  if (data.choice === 'changer' && data.questionnaire) {
    const prixChangement = getMainOeuvreRateForTableau(data, rates);
    if (data.changeType === 'uniquement') {
      return withMainOeuvreMeta(
        calculateTableauFromQuestionnaire(data.questionnaire, [], prixChangement),
        'changement',
        prixChangement
      );
    }
    if (data.changeType === 'commencer') {
      const result = calculateTableauFromQuestionnaireAndPrestations(
        [data.questionnaire],
        devisItems,
        prixChangement
      );
      const totalRangees = result.tableaux
        ? result.tableaux.reduce((sum, t) => sum + t.rangees, 0)
        : 0;
      return withMainOeuvreMeta({ ...result, rangees: totalRangees }, 'changement', prixChangement);
    }
  }

  return { materiels: [], mainOeuvre: 0, rangees: 0 };
}

/**
 * Recalcule main d'œuvre + matériels tableau sur les items existants (tarifs admin à jour).
 */
async function refreshTableauItemsInDevis(devisItems, options = {}) {
  const rates = resolveMainOeuvreRates(options);
  const prestationsOnly = (devisItems || []).filter((item) => item.type !== 'tableau');

  return (devisItems || []).map((item) => {
    if (item.type !== 'tableau' || !item.tableauData) return item;
    if (item.tableauData.choice === 'garder') return item;

    const result = calculateTableauMateriels(prestationsOnly, item.tableauData, rates);
    return {
      ...item,
      services: result.materiels || item.services,
      mainOeuvre: result.mainOeuvre ?? 0,
      rangees: result.rangees ?? item.rangees,
      mainOeuvreType: result.mainOeuvreType,
      mainOeuvreParRangee: result.mainOeuvreParRangee
    };
  });
}

module.exports = {
  countPrises,
  countEclairages,
  countInterrupteurs,
  countInterrupteursInstallation,
  countInterrupteursForInstallationItem,
  countTelerupteursFromPrestations,
  isInstallationDevisItem,
  shouldAddTelerupteurFromPrestations,
  countRadiateurs,
  countAppareilsElectromenagers,
  countAppareilsTriphases,
  hasChauffeau,
  hasChauffeauInQuestionnaire,
  calculateDisjoncteurs16A,
  calculateDisjoncteursEclairages,
  calculateDisjoncteursFromPrestations,
  calculatePlacesNecessaires,
  calculateRangees,
  calculateMainOeuvre,
  calculateTableauxRangees,
  groupMaterielsByCode,
  calculateTableauFromQuestionnaire,
  calculateTableauFromQuestionnaireAndPrestations,
  calculateTableauMateriels,
  normalizeTableauData,
  getMainOeuvreRateForTableau,
  refreshTableauItemsInDevis
};

