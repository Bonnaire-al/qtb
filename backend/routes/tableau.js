const express = require('express');
const router = express.Router();
const TableauController = require('../controllers/tableau-controller');

// POST /api/tableau/calculate - Calculer les matériels du tableau électrique
router.post('/calculate', TableauController.calculateTableau);

module.exports = router;

