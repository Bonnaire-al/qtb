const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authAdmin');
const TableauController = require('../controllers/tableau-controller');

router.get('/config', TableauController.getConfig);
router.put('/config', requireAuth, TableauController.updateConfig);
router.post('/calculate', TableauController.calculateTableau);

module.exports = router;

