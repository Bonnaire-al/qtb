const express = require('express');
const router = express.Router();
const LiaisonController = require('../controllers/Liaison-controller');

router.get('/', LiaisonController.getAll);
router.get('/prestation/:prestationCode/:typeInstallation', LiaisonController.getByPrestationAndType);
router.get('/:code', LiaisonController.getByCode);
router.post('/', LiaisonController.create);
router.put('/:id', LiaisonController.update);
router.delete('/:id', LiaisonController.delete);

module.exports = router;



