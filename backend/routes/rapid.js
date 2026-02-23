const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authAdmin');
const RapidController = require('../controllers/Rapid-controller');

// Config (admin) — protégé
router.get('/config', requireAuth, RapidController.getConfig);
router.put('/config', requireAuth, RapidController.updateConfig);
router.post('/config/packs/:packId/items', requireAuth, RapidController.addPackItem);
router.put('/config/items/:itemId', requireAuth, RapidController.updatePackItem);
router.delete('/config/items/:itemId', requireAuth, RapidController.deletePackItem);

// Devis rapide (public)
router.post('/prepare', RapidController.prepare);

module.exports = router;

