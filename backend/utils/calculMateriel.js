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
    if (!serviceLabel || typeof serviceLabel !== 'string') return null;
    const labelTrim = serviceLabel.trim();
    if (!labelTrim) return null;

    let prestations = await PrestationModel.getByCategorie(serviceType);
    if (!prestations || prestations.length === 0) {
      const all = await PrestationModel.getAll();
      const typeLower = (serviceType || '').toLowerCase();
      prestations = (all || []).filter(p => (p.categorie || '').toLowerCase() === typeLower);
    }

    // Si le "label" est en fait un code prestation (ex: Pinst001, Pdom002), l'utiliser directement
    const byCode = prestations.find(p => (p.code || '').toLowerCase() === labelTrim.toLowerCase());
    if (byCode && byCode.code) return byCode.code;

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
    if (found && found.code) return found.code;

    // Fallback devis rapide : chercher dans TOUTES les prestations (packs peuvent mélanger Installation/Domotique)
    const all = await PrestationModel.getAll();
    const allList = all || [];
    const byCodeAll = allList.find(p => (p.code || '').toLowerCase() === labelTrim.toLowerCase());
    if (byCodeAll && byCodeAll.code) return byCodeAll.code;
    const byLabelAll = allList.find(p => (p.service_label || '').trim() === labelTrim || 
      (p.service_label || '').toLowerCase().trim() === labelTrim.toLowerCase());
    if (byLabelAll && byLabelAll.code) return byLabelAll.code;
    
    return null;
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

  console.log('📋 Calcul matériel: entrée', devisItems.length, 'items (serviceTypes:', [...new Set(devisItems.map(i => i.serviceType))].join(', ') + ')');
  
  // Parcourir tous les items du devis
  for (const item of devisItems) {
    // Gérer les items de type "tableau" différemment : rechercher les matériels directement par code
    if (item.type === 'tableau' && item.services && item.services.length > 0) {
      try {
        // Pour les tableaux, les services contiennent déjà les codes des matériels
        const codesSet = new Set();
        item.services.forEach(service => {
          if (service.code) {
            codesSet.add(service.code);
          }
        });

        if (codesSet.size > 0) {
          const materiels = await MaterielModel.getManyByCodes(Array.from(codesSet));
          const materielMap = new Map(materiels.map(m => [m.code, m]));

          // Parcourir les services du tableau pour récupérer les quantités
          item.services.forEach(service => {
            if (!service.code) {
              console.warn(`⚠️ Service sans code dans tableau:`, service);
              return;
            }
            
            const materiel = materielMap.get(service.code);
            if (!materiel) {
              console.warn(`⚠️ Matériel ${service.code} (tableau) introuvable en base. Service:`, service);
              return;
            }

            const quantiteNecessaire = service.quantity || 1;
            const materielKey = materiel.code;
            
            // Debug: vérifier les matériels du tableau
            console.log(`📦 Traitement matériel tableau:`, {
              code: service.code,
              label: service.label,
              quantity: quantiteNecessaire,
              materielFound: !!materiel,
              prixHT: materiel.prix_ht,
              prixHTFromService: service.prix_ht
            });

            if (materielsMap.has(materielKey)) {
              // Matériel déjà présent, additionner les quantités
              const existing = materielsMap.get(materielKey);
              existing.quantite += quantiteNecessaire;
              // Utiliser le prix du service si défini (pour les prix hardcodés)
              const prixHT = service.prix_ht !== undefined ? service.prix_ht : existing.prixHT;
              existing.prixHT = prixHT;
              existing.totalHT = existing.quantite * prixHT;
            } else {
              // Nouveau matériel, l'ajouter
              // Utiliser le prix du service si défini (pour les prix hardcodés comme DISDIV à 15.50€)
              // Sinon utiliser le prix de la base de données
              const prixHT = service.prix_ht !== undefined ? service.prix_ht : (materiel.prix_ht || 0);
              materielsMap.set(materielKey, {
                code: materiel.code,
                designation: materiel.designation,
                quantite: quantiteNecessaire,
                prixHT: prixHT,
                totalHT: quantiteNecessaire * prixHT,
                qte_dynamique: materiel.qte_dynamique,
                type_produit: 'materiel' // Les matériels du tableau sont toujours des matériels
              });
              
              console.log(`✅ Matériel ajouté au devis:`, {
                code: materiel.code,
                designation: materiel.designation,
                quantite: quantiteNecessaire,
                prixHT: prixHT,
                totalHT: quantiteNecessaire * prixHT
              });
            }
          });
        }
      } catch (error) {
        console.error(`❌ Erreur calcul matériels tableau:`, error);
      }
      continue; // Passer au prochain item
    }

    // Pour les autres items, traiter normalement via prestation_materiel_config
    const itemServiceType = item.serviceType || 'installation';
    const defaultInstallType = itemServiceType === 'securite' ? 'wifi' : 'saignee_encastre';
    const typeInstallation = item.installationType || defaultInstallType;

    for (const service of item.services) {
      try {
        // Code prestation : priorité au code envoyé (devis rapide / packs), sinon recherche par label
        let prestationCode = (service.code && String(service.code).trim()) || null;
        if (!prestationCode) {
          prestationCode = await findPrestationCodeByLabel(
            service.label || service.service_label,
            itemServiceType
          );
        }
        if (!prestationCode) {
          console.warn(`⚠️ Code prestation non trouvé pour: ${service.label || service.code} (catégorie: ${itemServiceType})`);
          continue;
        }
        
        // Récupérer les matériels liés via prestation_materiel_config
        let liaisons = await LiaisonModel.getByPrestationAndType(
          prestationCode,
          typeInstallation
        );
        if (liaisons.length === 0) {
          const anyLiaisons = await LiaisonModel.getByPrestation(prestationCode);
          if (anyLiaisons.length > 0) {
            liaisons = [anyLiaisons[0]];
            console.log(`📋 Matériel: fallback liaison pour ${prestationCode} (type demandé: ${typeInstallation})`);
          }
        }
        if (liaisons.length === 0) {
          console.warn(`⚠️ Aucun matériel trouvé pour prestation ${prestationCode} (type ${typeInstallation}). Créez des liaisons en Admin > Configuration.`);
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
  
  if (materiels.length === 0 && devisItems.length > 0) {
    console.warn('📋 Calcul matériel: 0 matériel trouvé. Vérifiez Admin > Configuration > Liaisons : au moins une liaison (prestation + type d\'installation + matériels) par prestation utilisée.');
  }

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

