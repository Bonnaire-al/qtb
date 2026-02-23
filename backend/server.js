require('dotenv').config(); // charge .env (ADMIN_PASSWORD, PORT, etc.)
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./config/database'); // Initialiser la connexion à la base de données

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes (requireAuth est utilisé dans chaque fichier de routes)
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

// Migrations exécutées au démarrage (idempotentes : créent les tables si besoin)
// Nécessaire pour la prod : avis clients + devis rapide
createAvisTable()
  .then(() => addGoogleAccountToAvis())
  .then(() => createRapidDevisConfig())
  .catch((err) => console.warn('Migrations démarrage:', err.message));

// Chemin du frontend buildé (pour servir en production)
const distPath = path.join(__dirname, '..', 'dist');

// Routes de base
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production' && distPath) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  res.json({ message: 'API QTBE - Backend avec SQLite' });
});

// Auth admin (login/logout, pas de requireAuth)
app.use('/api/admin', authRoutes);

// Routes API (écritures protégées par token admin)
app.use('/api/materiel', materielRoutes);
app.use('/api/prestations', prestationsRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/liaisons', liaisonRoutes);
app.use('/api/tableau', tableauRoutes);
app.use('/api/rapid', rapidRoutes);
app.use('/api/avis', avisRoutes);

// En production : servir les fichiers statiques du frontend (JS, CSS, etc.)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

// Fermeture propre de la base de données
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Base de données fermée');
    process.exit(0);
  });
});

