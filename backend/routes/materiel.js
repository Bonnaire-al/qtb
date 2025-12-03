const express = require('express');
const router = express.Router();
const MaterielController = require('../controllers/M-controller');

router.get('/', MaterielController.getAll);
router.get('/code/:code', MaterielController.getByCode);
router.post('/batch', MaterielController.getManyByCodes);
router.post('/', MaterielController.create);
router.put('/:id', MaterielController.update);
router.delete('/:id', MaterielController.delete);

module.exports = router;
