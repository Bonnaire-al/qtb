const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authAdmin');
const PrestationController = require('../controllers/P-controller');

// GET /api/prestations - Récupérer toutes les prestations (public)
router.get('/', PrestationController.getAll);

// Routes spécifiques AVANT les routes génériques
// GET /api/prestations/structure/:serviceType - Structure pour formulaire
router.get('/structure/:serviceType', PrestationController.getFormStructure);

// GET /api/prestations/:id/materiel - Récupérer une prestation avec son matériel
router.get('/:id/materiel', PrestationController.getWithMateriel);

// POST /api/prestations/:id/materiel/:materielId - Lier une prestation à du matériel (admin)
router.post('/:id/materiel/:materielId', requireAuth, PrestationController.linkMateriel);

// DELETE /api/prestations/:id/materiel/:materielId - Délier une prestation d'un matériel (admin)
router.delete('/:id/materiel/:materielId', requireAuth, PrestationController.unlinkMateriel);

// GET /api/prestations/:categorie - Récupérer les prestations par catégorie
router.get('/:categorie', PrestationController.getByCategorie);

// POST /api/prestations - Créer une prestation (admin)
router.post('/', requireAuth, PrestationController.create);

// PUT /api/prestations/:id - Mettre à jour une prestation (admin)
router.put('/:id', requireAuth, PrestationController.update);

// DELETE /api/prestations/:id - Supprimer une prestation (admin)
router.delete('/:id', requireAuth, PrestationController.delete);

module.exports = router;
