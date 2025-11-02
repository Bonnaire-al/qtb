const express = require('express');
const router = express.Router();
const MaterielController = require('../controllers/M-controller');

// GET /api/materiel - Récupérer tout le matériel
router.get('/', MaterielController.getAll);

// GET /api/materiel/prestations - Récupérer toutes les prestations disponibles
router.get('/prestations', MaterielController.getAvailablePrestations);

// GET /api/materiel/categorie/:categorie - Récupérer le matériel par catégorie
router.get('/categorie/:categorie', MaterielController.getByCategorie);

// GET /api/materiel/prestation/:serviceValue - Récupérer le matériel pour une prestation (via service_value)
router.get('/prestation/:serviceValue', MaterielController.getByPrestationServiceValue);

// GET /api/materiel/service/:serviceValue - Récupérer le matériel par service_value
router.get('/service/:serviceValue', MaterielController.getByServiceValue);

// GET /api/materiel/type-application/:type - Récupérer le matériel par type_application
router.get('/type-application/:type', MaterielController.getByTypeApplication);

// GET /api/materiel/type-produit/:type - Récupérer le matériel par type_produit
router.get('/type-produit/:type', MaterielController.getByTypeProduit);

// POST /api/materiel - Créer du matériel
router.post('/', MaterielController.create);

// PUT /api/materiel/:id - Mettre à jour du matériel
router.put('/:id', MaterielController.update);

// DELETE /api/materiel/:id - Supprimer du matériel
router.delete('/:id', MaterielController.delete);

module.exports = router;
