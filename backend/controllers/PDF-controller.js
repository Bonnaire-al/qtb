const { generatePDFBuffer, generatePDFBase64 } = require('../utils/pdfGenerator');
const MaterielModel = require('../models/M-model');
const PrestationModel = require('../models/P-model');
const PrixCalculs = require('../utils/prixCalculs');

class PDFController {
  // Calculer les prix pour tous les services du devis
  static async calculateDevisItemsPrices(devisItems) {
    const itemsWithPrices = await Promise.all(
      devisItems.map(async (item) => {
        const servicesWithPrices = await Promise.all(
          item.services.map(async (service) => {
            try {
              // Trouver les métadonnées du service pour récupérer le prix
              const prixData = await this.findServicePrixData(
                item.serviceType,
                item.roomValue,
                service.label
              );
              
              if (!prixData) {
                console.warn(`Prix non trouvé pour: ${service.label}`);
                return { ...service, prixBase: 0, priceHT: 0 };
              }

              // Calculer le prix total selon le type de service et la quantité
              const totalPrice = this.calculateServicePrice(
                service.label,
                item.serviceType,
                prixData.prix_ht,
                service.quantity,
                item.coefficient
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

  // POST /api/pdf/generate - Générer un PDF de devis
  static async generatePDF(req, res) {
    try {
      const { formData, devisItems } = req.body;
      
      if (!formData || !devisItems) {
        return res.status(400).json({ 
          error: 'Données manquantes. formData et devisItems sont requis.' 
        });
      }

      // ✅ CALCULER LES PRIX ICI (backend) avant de générer le PDF
      const devisItemsWithPrices = await PDFController.calculateDevisItemsPrices(devisItems);
      
      const allMaterials = await MaterielModel.getAll();
      const materielsData = PDFController.organizeMaterialsData(allMaterials);
      const pdfBase64 = await generatePDFBase64(formData, devisItemsWithPrices, materielsData);
      
      res.json({
        success: true,
        pdfData: `data:application/pdf;base64,${pdfBase64}`,
        message: 'PDF généré avec succès'
      });
      
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

      // ✅ CALCULER LES PRIX ICI (backend) avant de générer le PDF
      const devisItemsWithPrices = await PDFController.calculateDevisItemsPrices(devisItems);
      
      const allMaterials = await MaterielModel.getAll();
      const materielsData = PDFController.organizeMaterialsData(allMaterials);
      const pdfBuffer = await generatePDFBuffer(formData, devisItemsWithPrices, materielsData);
      
      const clientName = formData.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'client';
      const date = new Date().toISOString().split('T')[0];
      const fileName = `devis_${clientName}_${date}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(pdfBuffer);
      
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

