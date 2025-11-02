const express = require('express');
const router = express.Router();
const PDFController = require('../controllers/PDF-controller');

// POST /api/pdf/generate - Générer un PDF (retourne base64)
router.post('/generate', PDFController.generatePDF);

// POST /api/pdf/download - Générer et télécharger un PDF
router.post('/download', PDFController.downloadPDF);

module.exports = router;


