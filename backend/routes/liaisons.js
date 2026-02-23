const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authAdmin');
const LiaisonController = require('../controllers/Liaison-controller');

router.get('/', LiaisonController.getAll);
router.get('/prestation/:prestationCode/:typeInstallation', LiaisonController.getByPrestationAndType);
router.get('/:code', LiaisonController.getByCode);
router.post('/', requireAuth, LiaisonController.create);
router.put('/:id', requireAuth, LiaisonController.update);
router.delete('/:id', requireAuth, LiaisonController.delete);

module.exports = router;



