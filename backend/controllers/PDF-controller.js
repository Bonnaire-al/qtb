const { generatePDFBuffer, generatePDFBase64 } = require('../utils/pdfGenerator');
const MaterielModel = require('../models/M-model');
const PrestationModel = require('../models/P-model');
const PrixCalculs = require('../utils/prixCalculs');
const CalculMateriel = require('../utils/calculMateriel');
const RapidConfigModel = require('../models/RapidConfig-model');
const TableauConfigModel = require('../models/TableauConfig-model');
const TableauCalcul = require('../utils/tableauCalcul');
const { expandDevisWithSpecialInterrupteur } = require('../utils/specialPrestation');
const { calculateDiscount } = require('../utils/pdfCalculs');

class PDFController {
  static async refreshTableauMainOeuvre(devisItems) {
    const rates = await TableauConfigModel.getMainOeuvreRates();
    return TableauCalcul.refreshTableauItemsInDevis(devisItems, {
      mainOeuvrePoseParRangee: rates.pose,
      mainOeuvreChangementParRangee: rates.changement
    });
  }

  static async expandDevisForCalculation(devisItems) {
    let specialPrestation = await PrestationModel.getSpecialInterrupteurEclairage();
    if (!specialPrestation) {
      try {
        specialPrestation = await PrestationModel.ensureSpecialInterrupteurEclairage();
      } catch (e) {
        console.warn('⚠️ Prestation spéciale interrupteur non disponible:', e.message);
      }
    }
    return expandDevisWithSpecialInterrupteur(devisItems, specialPrestation || undefined);
  }

  // Calculer les prix pour tous les services du devis
  static async calculateDevisItemsPrices(devisItems) {
    const itemsWithPrices = await Promise.all(
      devisItems.map(async (item) => {
        // Pour les items de type "tableau", les matériels n'ont pas de prix dans le système de prestations
        // Leurs prix sont gérés directement dans la base de données des matériels
        if (item.type === 'tableau') {
          return {
            ...item,
            services: item.services.map(service => ({
              ...service,
              prixBase: 0,
              priceHT: 0 // Les prix des matériels du tableau sont calculés via calculMateriel
            }))
          };
        }

        // Pour les autres items, calculer les prix normalement
        const servicesWithPrices = await Promise.all(
          item.services.map(async (service) => {
            try {
              // Trouver les métadonnées du service pour récupérer le prix
              let prixData = await this.findServicePrixData(
                item.serviceType,
                item.roomValue,
                service.label
              );

              if (!prixData && service.code) {
                prixData = await PrestationModel.getByCode(service.code);
              }
              
              if (!prixData) {
                console.warn(`Prix non trouvé pour: ${service.label}`);
                return { ...service, prixBase: 0, priceHT: 0 };
              }

              // Calculer le coefficient d'installation
              const coefficient = PrixCalculs.getInstallationCoefficient(item.serviceType, item.installationType);

              // Calculer le prix total selon le type de service et la quantité
              const totalPrice = this.calculateServicePrice(
                service.label,
                item.serviceType,
                prixData.prix_ht,
                service.quantity,
                coefficient
              );

              return {
                ...service,
                prixBase: prixData.prix_ht,
                priceHT: totalPrice
              };
            } catch (error) {
              console.error(`Erreur calcul prix pour ${service.label}:`, error);
              return { ...service, prixBase: 0, priceHT: 0 };
            }
          })
        );

        return {
          ...item,
          services: servicesWithPrices
        };
      })
    );

    return itemsWithPrices;
  }

  // Trouver le prix d'un service dans la base de données
  static async findServicePrixData(serviceType, roomValue, serviceLabel) {
    try {
      console.log(`🔍 Recherche prix pour: ${serviceType} / ${roomValue} / ${serviceLabel}`);
      
      // Récupérer toutes les prestations de la catégorie (avec leurs prix intégrés)
      const allPrestations = await PrestationModel.getByCategorie(serviceType);
      console.log(`📦 Prestations trouvées pour ${serviceType}:`, allPrestations.length);
      
      // Chercher la prestation exacte par service_label
      const found = allPrestations.find(p => {
        const match = p.service_label === serviceLabel;
        if (match) {
          console.log(`✅ Prix trouvé:`, p);
        }
        return match;
      });
      
      if (!found) {
        console.warn(`❌ Prix non trouvé pour: ${serviceLabel}`);
        console.log('Prestations disponibles:', allPrestations.map(p => p.service_label));
      }
      
      return found || null;
    } catch (error) {
      console.error('❌ Erreur recherche prix:', error);
      return null;
    }
  }

  // Calculer le prix selon le type de service - Utilise les fonctions de PrixCalculs
  static calculateServicePrice(serviceLabel, serviceType, prixBase, quantity, coefficient) {
    return PrixCalculs.calculateServicePrice(serviceLabel, serviceType, prixBase, quantity, coefficient);
  }

  // Fonction utilitaire pour organiser les matériels par structure
  static organizeMaterialsData(allMaterials) {
    const materielsData = {};
    
    allMaterials.forEach(material => {
      const room = material.sous_categorie || 'general';
      const service = material.service || 'default';
      
      if (!materielsData[room]) {
        materielsData[room] = {};
      }
      if (!materielsData[room][service]) {
        materielsData[room][service] = [];
      }
      
      materielsData[room][service].push({
        nom: material.nom,
        quantite: material.quantite,
        prixHT: material.prix_ht
      });
    });
    
    return materielsData;
  }

  static isRapidMode(formData, devisItems = []) {
    // Décider uniquement d'après les items : évite de traiter un devis classique en rapide si quoteMode est resté "rapide"
    const hasRapidItems = Array.isArray(devisItems) && devisItems.some(i => i?.rapid?.group);
    return !!hasRapidItems;
  }

  static formatMoney(n) {
    const v = Number.isFinite(n) ? n : 0;
    return `${v.toFixed(2)} €`;
  }

  static async buildRapidSummary(formData, devisItemsWithPrices) {
    const config = await RapidConfigModel.getConfig();
    const coefMap = {
      classic: Number(config.coef_classic) || 1.0,
      premium: Number(config.coef_premium) || 1.0,
      luxe: Number(config.coef_luxe) || 1.0
    };

    const isCompany = formData?.company && formData.company.trim() !== '';
    const tvaRateMO = isCompany ? 0.20 : 0.10;
    const tvaLabelMO = isCompany ? '20%' : '10%';
    const tvaRateMat = 0.20;
    const tvaLabelMat = '20%';

    const packs = devisItemsWithPrices.filter(i => i?.rapid?.group === 'pack');
    const securite = devisItemsWithPrices.filter(i => i?.rapid?.group === 'securite');
    const portail = devisItemsWithPrices.filter(i => i?.rapid?.group === 'portail');
    const volet = devisItemsWithPrices.filter(i => i?.rapid?.group === 'volet');
    const tableau = devisItemsWithPrices.filter(i => i?.type === 'tableau');

    const sumServicesHT = (items) =>
      (items || []).reduce((sum, item) => {
        if (item?.type === 'tableau') return sum;
        const s = (item.services || []).reduce((a, srv) => a + (srv.priceHT || 0), 0);
        return sum + s;
      }, 0);

    // Main d'œuvre (packs) avec coef par gamme
    const packMoByGamme = { classic: 0, premium: 0, luxe: 0 };
    packs.forEach((item) => {
      const gamme = item?.rapid?.gamme;
      const base = (item.services || []).reduce((a, srv) => a + (srv.priceHT || 0), 0);
      if (gamme && packMoByGamme[gamme] !== undefined) {
        packMoByGamme[gamme] += base;
      }
    });
    const packMoHT = Object.entries(packMoByGamme).reduce((sum, [gamme, base]) => {
      return sum + base * (coefMap[gamme] || 1.0);
    }, 0);

    const securiteMoHT = sumServicesHT(securite);
    const portailMoHT = sumServicesHT(portail);
    const voletMoHT = sumServicesHT(volet);
    const tableauMoHT = (tableau || []).reduce((sum, t) => sum + (t.mainOeuvre || 0), 0);

    const totalMainOeuvreHT = packMoHT + securiteMoHT + portailMoHT + voletMoHT + tableauMoHT;
    const discount = calculateDiscount(totalMainOeuvreHT);
    const totalMainOeuvreHTAfterDiscount = totalMainOeuvreHT - discount.discountAmount;

    // Matériel (packs) : calculer total par gamme puis appliquer coef, liste globale agrégée sans prix
    const packMatByGamme = { classic: 0, premium: 0, luxe: 0 };
    for (const gamme of ['classic', 'premium', 'luxe']) {
      const items = packs.filter(p => p?.rapid?.gamme === gamme);
      if (items.length === 0) continue;
      const res = await CalculMateriel.calculateDevisMateriels(items, true);
      packMatByGamme[gamme] = res.totalHT || 0;
    }
    const packMaterielHT = Object.entries(packMatByGamme).reduce((sum, [gamme, base]) => {
      return sum + base * (coefMap[gamme] || 1.0);
    }, 0);
    const packMaterielsAgg = packs.length > 0
      ? await CalculMateriel.calculateDevisMateriels(packs, true)
      : { materiels: [], totalHT: 0 };

    const securiteMaterielsAgg = securite.length > 0
      ? await CalculMateriel.calculateDevisMateriels(securite, true)
      : { materiels: [], totalHT: 0 };
    const portailMaterielsAgg = portail.length > 0
      ? await CalculMateriel.calculateDevisMateriels(portail, true)
      : { materiels: [], totalHT: 0 };
    const voletMaterielsAgg = volet.length > 0
      ? await CalculMateriel.calculateDevisMateriels(volet, true)
      : { materiels: [], totalHT: 0 };
    const tableauMaterielsAgg = tableau.length > 0
      ? await CalculMateriel.calculateDevisMateriels(tableau, true)
      : { materiels: [], totalHT: 0 };

    const securiteMaterielHT = securiteMaterielsAgg.totalHT || 0;
    const portailMaterielHT = portailMaterielsAgg.totalHT || 0;
    const voletMaterielHT = voletMaterielsAgg.totalHT || 0;
    const tableauMaterielHT = tableauMaterielsAgg.totalHT || 0;

    const totalMaterielHT = packMaterielHT + securiteMaterielHT + portailMaterielHT + voletMaterielHT + tableauMaterielHT;

    const totalHT = totalMaterielHT + totalMainOeuvreHTAfterDiscount;
    const totalTVA = totalHT * tvaRateMO;
    const totalTTC = totalHT + totalTVA;

    const pieceGammes = packs.map(p => {
      const g = p?.rapid?.gamme || '';
      const gLabel = g ? g.charAt(0).toUpperCase() + g.slice(1) : '—';
      return `${p.room}: ${gLabel}`;
    });

    const asListNoPrice = (agg) =>
      (agg?.materiels || []).map(m => ({
        designation: m.designation,
        quantite: m.quantite
      }));

    return {
      coefs: coefMap,
      tva: {
        moRate: tvaRateMO,
        moLabel: tvaLabelMO,
        matRate: tvaRateMat,
        matLabel: tvaLabelMat
      },
      discount,
      mainOeuvre: {
        packHT: packMoHT,
        securiteHT: securiteMoHT,
        portailHT: portailMoHT,
        voletHT: voletMoHT,
        tableauHT: tableauMoHT,
        totalHT: totalMainOeuvreHT,
        totalHTAfterDiscount: totalMainOeuvreHTAfterDiscount
      },
      materiel: {
        packHT: packMaterielHT,
        securiteHT: securiteMaterielHT,
        portailHT: portailMaterielHT,
        voletHT: voletMaterielHT,
        tableauHT: tableauMaterielHT,
        totalHT: totalMaterielHT,
        packList: asListNoPrice(packMaterielsAgg),
        securiteList: asListNoPrice(securiteMaterielsAgg),
        portailList: asListNoPrice(portailMaterielsAgg),
        voletList: asListNoPrice(voletMaterielsAgg),
        tableauList: asListNoPrice(tableauMaterielsAgg)
      },
      pieceGammes,
      totals: {
        totalHT,
        totalTVA,
        totalTTC
      }
    };
  }

  // POST /api/pdf/generate - Générer un PDF de devis
  static async generatePDF(req, res) {
    try {
      const { formData, devisItems } = req.body;
      
      if (!formData || !devisItems) {
        return res.status(400).json({ 
          error: 'Données manquantes. formData et devisItems sont requis.' 
        });
      }
      const name = (formData.name || '').toString().trim();
      const email = (formData.email || '').toString().trim();
      if (!name) return res.status(400).json({ error: 'Nom du client requis.' });
      if (!email) return res.status(400).json({ error: 'Email du client requis.' });

      const devisItemsRefreshed = await PDFController.refreshTableauMainOeuvre(devisItems);
      const devisItemsExpanded = await PDFController.expandDevisForCalculation(devisItemsRefreshed);
      const devisItemsWithPrices = await PDFController.calculateDevisItemsPrices(devisItemsExpanded);
      
      // ✅ NOUVEAU : Calculer les matériels via prestation_materiel_config selon les quantités
      try {
        const materielsCalcules = await CalculMateriel.calculateDevisMateriels(devisItemsWithPrices, true);
        const isRapid = PDFController.isRapidMode(formData, devisItemsWithPrices);
        console.log(`📦 Matériels calculés: ${materielsCalcules.materiels.length} matériels, Total HT: ${materielsCalcules.totalHT}€${isRapid ? ' (devis rapide)' : ''}`);
        if (isRapid && materielsCalcules.materiels.length === 0 && devisItemsWithPrices.length > 0) {
          console.warn('⚠️ Devis rapide: 0 matériel. Vérifiez que les prestations des packs ont des liaisons (Admin > Configuration > Liaisons).');
        }
        // Pour compatibilité, créer la structure materielsData (vide, juste pour la signature)
        const materielsData = {};

        // Mode devis rapide (résumé) : détection par formData.quoteMode ou par présence de rapid.group dans les items
        const rapidSummary = isRapid
          ? await PDFController.buildRapidSummary(formData, devisItemsWithPrices)
          : null;
        
        // Passer les matériels calculés au générateur PDF (via materielsData vide + materielsCalcules)
        const pdfBase64 = await generatePDFBase64(formData, devisItemsWithPrices, materielsData, materielsCalcules, rapidSummary);
        
        res.json({
          success: true,
          pdfData: `data:application/pdf;base64,${pdfBase64}`,
          message: 'PDF généré avec succès'
        });
      } catch (materielError) {
        console.warn('⚠️ Erreur calcul matériels via nouvelle méthode, utilisation méthode legacy:', materielError);
        // Fallback vers ancienne méthode si nouvelle méthode échoue
        const allMaterials = await MaterielModel.getAll();
        const materielsData = PDFController.organizeMaterialsData(allMaterials);
        const pdfBase64 = await generatePDFBase64(formData, devisItemsWithPrices, materielsData);
        
        res.json({
          success: true,
          pdfData: `data:application/pdf;base64,${pdfBase64}`,
          message: 'PDF généré avec succès (méthode legacy)'
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur génération PDF:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la génération du PDF',
        details: error.message 
      });
    }
  }

  // POST /api/pdf/download - Générer et télécharger un PDF
  static async downloadPDF(req, res) {
    try {
      const { formData, devisItems } = req.body;
      
      if (!formData || !devisItems) {
        return res.status(400).json({ 
          error: 'Données manquantes. formData et devisItems sont requis.' 
        });
      }
      const name = (formData.name || '').toString().trim();
      const email = (formData.email || '').toString().trim();
      if (!name) return res.status(400).json({ error: 'Nom du client requis.' });
      if (!email) return res.status(400).json({ error: 'Email du client requis.' });

      const devisItemsRefreshed = await PDFController.refreshTableauMainOeuvre(devisItems);
      const devisItemsExpanded = await PDFController.expandDevisForCalculation(devisItemsRefreshed);
      const devisItemsWithPrices = await PDFController.calculateDevisItemsPrices(devisItemsExpanded);
      
      // ✅ NOUVEAU : Calculer les matériels via prestation_materiel_config selon les quantités
      try {
        const materielsCalcules = await CalculMateriel.calculateDevisMateriels(devisItemsWithPrices, true);
        const isRapidDownload = PDFController.isRapidMode(formData, devisItemsWithPrices);
        console.log(`📦 Matériels calculés: ${materielsCalcules.materiels.length} matériels, Total HT: ${materielsCalcules.totalHT}€${isRapidDownload ? ' (devis rapide)' : ''}`);
        if (isRapidDownload && materielsCalcules.materiels.length === 0 && devisItemsWithPrices.length > 0) {
          console.warn('⚠️ Devis rapide: 0 matériel. Vérifiez que les prestations des packs ont des liaisons (Admin > Configuration > Liaisons).');
        }
        // Pour compatibilité, créer la structure materielsData (vide, juste pour la signature)
        const materielsData = {};

        const rapidSummary = isRapidDownload
          ? await PDFController.buildRapidSummary(formData, devisItemsWithPrices)
          : null;
        
        // Passer les matériels calculés au générateur PDF
        const pdfBuffer = await generatePDFBuffer(formData, devisItemsWithPrices, materielsData, materielsCalcules, rapidSummary);
        
        const clientName = formData.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'client';
        const date = new Date().toISOString().split('T')[0];
        const fileName = `devis_${clientName}_${date}.pdf`;
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(pdfBuffer);
      } catch (materielError) {
        console.warn('⚠️ Erreur calcul matériels via nouvelle méthode, utilisation méthode legacy:', materielError);
        // Fallback vers ancienne méthode si nouvelle méthode échoue
        const allMaterials = await MaterielModel.getAll();
        const materielsData = PDFController.organizeMaterialsData(allMaterials);
        const pdfBuffer = await generatePDFBuffer(formData, devisItemsWithPrices, materielsData);
        
        const clientName = formData.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'client';
        const date = new Date().toISOString().split('T')[0];
        const fileName = `devis_${clientName}_${date}.pdf`;
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(pdfBuffer);
      }
      
    } catch (error) {
      console.error('❌ Erreur téléchargement PDF:', error);
      res.status(500).json({ 
        error: 'Erreur lors du téléchargement du PDF',
        details: error.message 
      });
    }
  }
}

module.exports = PDFController;

