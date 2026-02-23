const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authAdmin');
const MaterielController = require('../controllers/M-controller');

router.get('/', MaterielController.getAll);
router.get('/code/:code', MaterielController.getByCode);
router.post('/batch', MaterielController.getManyByCodes);
router.post('/', requireAuth, MaterielController.create);
router.put('/:id', requireAuth, MaterielController.update);
router.delete('/:id', requireAuth, MaterielController.delete);

module.exports = router;
