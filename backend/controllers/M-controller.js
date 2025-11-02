const MaterielModel = require('../models/M-model');

class MaterielController {
  // GET /api/materiel - Récupérer tout le matériel
  static async getAll(req, res) {
    try {
      const materiel = await MaterielModel.getAll();
      res.json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/materiel/prestations - Récupérer toutes les prestations disponibles
  static async getAvailablePrestations(req, res) {
    try {
      const prestations = await MaterielModel.getAvailablePrestations();
      res.json(prestations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/materiel/categorie/:categorie - Récupérer le matériel par catégorie
  static async getByCategorie(req, res) {
    try {
      const { categorie } = req.params;
      console.log(`🔍 Récupération du matériel pour la catégorie: ${categorie}`);
      const materiel = await MaterielModel.getByCategorie(categorie);
      console.log(`✅ ${materiel.length} matériel(s) trouvé(s) pour ${categorie}`);
      res.json(materiel);
    } catch (error) {
      console.error(`❌ Erreur getByCategorie pour ${req.params.categorie}:`, error);
      res.status(500).json({ 
        error: error.message || 'Erreur lors de la récupération du matériel',
        details: error.stack 
      });
    }
  }

  // GET /api/materiel/service/:serviceValue - Récupérer le matériel par service_value
  static async getByServiceValue(req, res) {
    try {
      const { serviceValue } = req.params;
      const materiel = await MaterielModel.getByServiceValue(serviceValue);
      res.json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/materiel/prestation/:serviceValue - Récupérer le matériel pour une prestation (via service_value)
  static async getByPrestationServiceValue(req, res) {
    try {
      const { serviceValue } = req.params;
      const materiel = await MaterielModel.getByPrestationServiceValue(serviceValue);
      res.json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/materiel/type-application/:type - Récupérer le matériel par type_application
  static async getByTypeApplication(req, res) {
    try {
      const { type } = req.params;
      const materiel = await MaterielModel.getByTypeApplication(type);
      res.json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/materiel/type-produit/:type - Récupérer le matériel par type_produit
  static async getByTypeProduit(req, res) {
    try {
      const { type } = req.params;
      const materiel = await MaterielModel.getByTypeProduit(type);
      res.json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/materiel - Créer du matériel
  static async create(req, res) {
    try {
      const materiel = await MaterielModel.create(req.body);
      res.status(201).json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/materiel/:id - Mettre à jour du matériel
  static async update(req, res) {
    try {
      const { id } = req.params;
      const materiel = await MaterielModel.update(id, req.body);
      res.json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/materiel/:id - Supprimer du matériel
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await MaterielModel.delete(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MaterielController;
