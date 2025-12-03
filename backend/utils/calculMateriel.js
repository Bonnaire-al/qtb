const PrestationModel = require('../models/P-model');
const MaterielModel = require('../models/M-model');
const LiaisonModel = require('../models/Liaison-model');

/**
 * Trouver le code d'une prestation à partir de son label
 * @param {string} serviceLabel - Le label de la prestation
 * @param {string} serviceType - La catégorie (domotique, installation, etc.)
 * @returns {Promise<string|null>} Le code de la prestation ou null
 */
async function findPrestationCodeByLabel(serviceLabel, serviceType) {
  try {
    const prestations = await PrestationModel.getByCategorie(serviceType);
    
    // Chercher par correspondance exacte
    let found = prestations.find(p => p.service_label === serviceLabel);
    if (found && found.code) {
      return found.code;
    }
    
    // Chercher par correspondance partielle (insensible à la casse)
    const normalizedSearchLabel = serviceLabel.toLowerCase().trim();
    found = prestations.find(p => {
      const normalizedDbLabel = p.service_label.toLowerCase().trim();
      return normalizedDbLabel.includes(normalizedSearchLabel) || 
             normalizedSearchLabel.includes(normalizedDbLabel);
    });
    
    if (found && found.code) {
      return found.code;
    }
    
    // Chercher par mots-clés communs
    const searchKeywords = normalizedSearchLabel.split(/[\s/_-]+/).filter(k => k.length > 2);
    found = prestations.find(p => {
      const dbKeywords = p.service_label.toLowerCase().split(/[\s/_-]+/).filter(k => k.length > 2);
      return searchKeywords.some(searchKw => 
        dbKeywords.some(dbKw => dbKw.includes(searchKw) || searchKw.includes(dbKw))
      );
    });
    
    return found && found.code ? found.code : null;
  } catch (error) {
    console.error(`❌ Erreur recherche code prestation pour ${serviceLabel}:`, error);
    return null;
  }
}

/**
 * Calculer les matériels nécessaires pour un devis en utilisant prestation_materiel_config
 * @param {Array} devisItems - Les items du devis avec services, quantités et type d'installation
 * @returns {Promise<Object>} { materiels: Array, totalHT: number }
 */
async function calculateMaterielsFromPrestations(devisItems) {
  const materielsMap = new Map(); // Utiliser une Map pour agréger les matériels
  
  if (!devisItems || devisItems.length === 0) {
    return {
      materiels: [],
      totalHT: 0
    };
  }
  
  // Parcourir tous les items du devis
  for (const item of devisItems) {
    // Parcourir tous les services de chaque item
    for (const service of item.services) {
      try {
        // Trouver le code de la prestation
        const prestationCode = await findPrestationCodeByLabel(
          service.label,
          item.serviceType
        );
        
        if (!prestationCode) {
          console.warn(`⚠️ Code prestation non trouvé pour: ${service.label}`);
          continue;
        }
        
        // Récupérer le type d'installation
        const typeInstallation = item.installationType || 'saignee_encastre';
        
        // Récupérer les matériels liés via prestation_materiel_config
        const liaisons = await LiaisonModel.getByPrestationAndType(
          prestationCode,
          typeInstallation
        );
        
        if (liaisons.length === 0) {
          console.warn(`⚠️ Aucun matériel trouvé pour prestation ${prestationCode} avec type ${typeInstallation}`);
          continue;
        }

        const codesSet = new Set();
        liaisons.forEach(liaison => {
          (liaison.materiel_codes || []).forEach(code => codesSet.add(code));
        });

        const materiels = await MaterielModel.getManyByCodes(Array.from(codesSet));
        const materielMap = new Map(materiels.map(m => [m.code, m]));

        for (const code of codesSet) {
          const materiel = materielMap.get(code);
          if (!materiel) {
            console.warn(`⚠️ Matériel ${code} introuvable en base.`);
            continue;
          }

          // Identifier les fournitures par leur code qui commence par "fou"
          const materielCode = materiel.code || '';
          const isFourniture = materielCode.toLowerCase().startsWith('fou');
          
          let quantiteNecessaire;
          
          if (isFourniture) {
            // Fourniture : toujours quantité = 1 (une seule fois par devis)
            quantiteNecessaire = 1;
          } else if (materiel.qte_dynamique === true || materiel.qte_dynamique === 1) {
            // Matériel dynamique : multiplier par quantité du service
            quantiteNecessaire = service.quantity || 1;
          } else {
            // Matériel fixe : quantité = 1 (peu importe la quantité du service)
            quantiteNecessaire = 1;
          }
          
          const materielKey = materiel.code;
          
          if (materielsMap.has(materielKey)) {
            // Matériel déjà présent
            const existing = materielsMap.get(materielKey);
            
            if (isFourniture) {
              // Pour les fournitures : garder quantité = 1 (ne pas additionner)
              // Le totalHT reste le même
              existing.quantite = 1;
              existing.totalHT = existing.prixHT;
            } else {
              // Pour les matériels : additionner les quantités
              existing.quantite += quantiteNecessaire;
              existing.totalHT = existing.quantite * existing.prixHT;
            }
          } else {
            // Nouveau matériel, l'ajouter
            const prixHT = materiel.prix_ht || 0;
            materielsMap.set(materielKey, {
              code: materiel.code,
              designation: materiel.designation,
              quantite: quantiteNecessaire,
              prixHT: prixHT,
              totalHT: quantiteNecessaire * prixHT,
              qte_dynamique: materiel.qte_dynamique,
              type_produit: isFourniture ? 'fourniture' : 'materiel'
            });
          }
        }
      } catch (error) {
        console.error(`❌ Erreur calcul matériels pour ${service.label}:`, error);
      }
    }
  }
  
  // Convertir la Map en tableau
  const materiels = Array.from(materielsMap.values());
  
  // Calculer le total HT
  const totalHT = materiels.reduce((total, materiel) => {
    return total + materiel.totalHT;
  }, 0);
  
  return {
    materiels: materiels,
    totalHT: totalHT
  };
}

/**
 * Calculer le total HT des matériels
 * @param {Array} materiels - Liste des matériels avec quantités et prix
 * @returns {number} Total HT
 */
function calculateMaterielTotalHT(materiels) {
  if (!materiels || materiels.length === 0) return 0;
  
  return materiels.reduce((total, materiel) => {
    const quantite = materiel.quantite || 0;
    const prixHT = materiel.prixHT || materiel.prix_ht || 0;
    return total + (quantite * prixHT);
  }, 0);
}

/**
 * Agrégation des matériels identiques (même code)
 * @param {Array} materielsList - Liste de listes de matériels
 * @returns {Array} Matériels agrégés
 */
function aggregateMaterials(materielsList) {
  const materielsMap = new Map();
  
  materielsList.forEach(materiels => {
    materiels.forEach(materiel => {
      const key = materiel.code || materiel.materiel_code;
      
      if (materielsMap.has(key)) {
        const existing = materielsMap.get(key);
        existing.quantite += materiel.quantite || 0;
        existing.totalHT = existing.quantite * existing.prixHT;
      } else {
        materielsMap.set(key, {
          ...materiel,
          quantite: materiel.quantite || 0,
          totalHT: (materiel.quantite || 0) * (materiel.prixHT || materiel.prix_ht || 0)
        });
      }
    });
  });
  
  return Array.from(materielsMap.values());
}

/**
 * Fonction principale pour calculer les matériels d'un devis
 * @param {Array} devisItems - Items du devis avec prix calculés
 * @param {boolean} includeAllTypes - Si true, inclut tous les types. Si false, filtre
 * @returns {Promise<Object>} { materiels: Array, totalHT: number }
 */
async function calculateDevisMateriels(devisItems, includeAllTypes = true) {
  try {
    const result = await calculateMaterielsFromPrestations(devisItems);
    
    // Filtrer selon le type si nécessaire
    let materielsFiltres = result.materiels;
    if (!includeAllTypes) {
      // Filtrer seulement les matériels (pas les fournitures)
      materielsFiltres = result.materiels.filter(m => m.type_produit === 'materiel');
      const totalHT = calculateMaterielTotalHT(materielsFiltres);
      return {
        materiels: materielsFiltres,
        totalHT: totalHT
      };
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erreur calcul devis matériels:', error);
    return {
      materiels: [],
      totalHT: 0
    };
  }
}

module.exports = {
  findPrestationCodeByLabel,
  calculateMaterielsFromPrestations,
  calculateMaterielTotalHT,
  aggregateMaterials,
  calculateDevisMateriels
};

