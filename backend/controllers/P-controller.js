const PrestationModel = require('../models/P-model');

class PrestationController {
  // GET /api/prestations - Récupérer toutes les prestations
  static async getAll(req, res) {
    try {
      const prestations = await PrestationModel.getAll();
      res.json(prestations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/prestations/:categorie - Récupérer les prestations par catégorie
  static async getByCategorie(req, res) {
    try {
      const { categorie } = req.params;
      const prestations = await PrestationModel.getByCategorie(categorie);
      res.json(prestations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/prestations/:id/materiel - Récupérer une prestation avec son matériel
  static async getWithMateriel(req, res) {
    try {
      const { id } = req.params;
      const prestation = await PrestationModel.getWithMateriel(id);
      if (prestation) {
        res.json(prestation);
      } else {
        res.status(404).json({ error: 'Prestation non trouvée' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/prestations - Créer une prestation
  static async create(req, res) {
    try {
      console.log('📝 Création prestation avec données:', req.body);
      const prestation = await PrestationModel.create(req.body);
      console.log('✅ Prestation créée:', prestation);
      res.status(201).json(prestation);
    } catch (error) {
      console.error('❌ Erreur création prestation:', error);
      // Erreurs de validation -> 400, autres erreurs -> 500
      const statusCode = error.message.includes('obligatoire') || 
                        error.message.includes('existe déjà') || 
                        error.message.includes('génération') 
                        ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  // PUT /api/prestations/:id - Mettre à jour une prestation
  static async update(req, res) {
    try {
      const { id } = req.params;
      const prestation = await PrestationModel.update(id, req.body);
      res.json(prestation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/prestations/:id - Supprimer une prestation
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await PrestationModel.delete(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/prestations/:id/materiel/:materielId - Lier une prestation à du matériel
  static async linkMateriel(req, res) {
    try {
      const { id, materielId } = req.params;
      const result = await PrestationModel.linkMateriel(id, materielId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/prestations/:id/materiel/:materielId - Délier une prestation d'un matériel
  static async unlinkMateriel(req, res) {
    try {
      const { id, materielId } = req.params;
      const result = await PrestationModel.unlinkMateriel(id, materielId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/prestations/structure/:serviceType - Structure complète pour le formulaire
  static async getFormStructure(req, res) {
    try {
      const { serviceType } = req.params;
      const structure = await PrestationModel.getFormStructure(serviceType);
      res.json(structure);
    } catch (error) {
      console.error('❌ Erreur récupération structure:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PrestationController;
