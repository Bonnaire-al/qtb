require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const materielRoutes = require('./routes/materiel');
const prestationsRoutes = require('./routes/prestations');
const pdfRoutes = require('./routes/pdf');
const liaisonRoutes = require('./routes/liaisons');
const tableauRoutes = require('./routes/tableau');
const rapidRoutes = require('./routes/rapid');
const avisRoutes = require('./routes/avis');

const createAvisTable = require('./migrations/create-avis-table');
const addGoogleAccountToAvis = require('./migrations/add-google-account-to-avis');
const createRapidDevisConfig = require('./migrations/20260130_create-rapid-devis-config');

// Migrations au démarrage
createAvisTable()
  .then(() => addGoogleAccountToAvis())
  .then(() => createRapidDevisConfig())
  .catch((err) => console.warn('Migrations démarrage:', err.message));

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'API QTBE - Backend Railway OK' });
});

// Routes API
app.use('/api/admin', authRoutes);
app.use('/api/materiel', materielRoutes);
app.use('/api/prestations', prestationsRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/liaisons', liaisonRoutes);
app.use('/api/tableau', tableauRoutes);
app.use('/api/rapid', rapidRoutes);
app.use('/api/avis', avisRoutes);

// Start serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});