const express = require('express');
const router = express.Router();
const PrestationController = require('../controllers/P-controller');

// GET /api/prestations - Récupérer toutes les prestations
router.get('/', PrestationController.getAll);

// Routes spécifiques AVANT les routes génériques
// GET /api/prestations/structure/:serviceType - Structure pour formulaire
router.get('/structure/:serviceType', PrestationController.getFormStructure);

// GET /api/prestations/:id/materiel - Récupérer une prestation avec son matériel
router.get('/:id/materiel', PrestationController.getWithMateriel);

// POST /api/prestations/:id/materiel/:materielId - Lier une prestation à du matériel
router.post('/:id/materiel/:materielId', PrestationController.linkMateriel);

// DELETE /api/prestations/:id/materiel/:materielId - Délier une prestation d'un matériel
router.delete('/:id/materiel/:materielId', PrestationController.unlinkMateriel);

// GET /api/prestations/:categorie - Récupérer les prestations par catégorie
router.get('/:categorie', PrestationController.getByCategorie);

// POST /api/prestations - Créer une prestation
router.post('/', PrestationController.create);

// PUT /api/prestations/:id - Mettre à jour une prestation
router.put('/:id', PrestationController.update);

// DELETE /api/prestations/:id - Supprimer une prestation
router.delete('/:id', PrestationController.delete);

module.exports = router;
