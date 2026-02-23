const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authAdmin');
const AvisController = require('../controllers/Avis-controller');

// Public
router.get('/', AvisController.getList);
router.post('/', AvisController.create);

// Admin (protégé)
router.get('/:id', AvisController.getOne);
router.put('/:id', requireAuth, AvisController.update);
router.delete('/:id', requireAuth, AvisController.delete);

module.exports = router;
