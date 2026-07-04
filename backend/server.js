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
const createTableauConfig = require('./migrations/create-tableau-config');
const migrateFormUpdates = require('./migrations/20260612-form-updates');
const migrateTableauMoDual = require('./migrations/20260613-tableau-mo-dual');
const migrateTableauMoSync = require('./migrations/20260614-sync-tableau-mo-columns');
const migrateSpecialPrestationInterrupteur = require('./migrations/20260615-special-prestation-interrupteur');
const migrateWizardCategory = require('./migrations/20260616-wizard-category');
const { ensureSpecialInterrupteurPrestation } = require('./utils/ensureSpecialPrestation');

async function runStartupMigrations() {
  await createAvisTable();
  await addGoogleAccountToAvis();
  await createRapidDevisConfig();
  await createTableauConfig();
  await migrateFormUpdates();
  await migrateTableauMoDual();
  await migrateTableauMoSync();
  await migrateSpecialPrestationInterrupteur();
  await migrateWizardCategory();
  await ensureSpecialInterrupteurPrestation();
  console.log('✅ Migrations démarrage terminées');
}

// Route test + healthcheck Railway
app.get('/', (req, res) => {
  res.json({ message: 'API QTBE - Backend Railway OK' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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

async function startServer() {
  try {
    await runStartupMigrations();
  } catch (err) {
    console.error('❌ Migrations démarrage:', err.message);
    console.error(err.stack);
    try {
      await ensureSpecialInterrupteurPrestation();
      console.log('✅ Prestation spéciale PINT001 créée (rattrapage après erreur migration)');
    } catch (ensureErr) {
      console.error('❌ Rattrapage PINT001 impossible:', ensureErr.message);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT} (0.0.0.0)`);
  });
}

startServer();
