const express = require('express');
const cors = require('cors');
const db = require('./config/database'); // Initialiser la connexion à la base de données

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const materielRoutes = require('./routes/materiel');
const prestationsRoutes = require('./routes/prestations');
const pdfRoutes = require('./routes/pdf');

// Routes de base
app.get('/', (req, res) => {
  res.json({ message: 'API QTBE - Backend avec SQLite' });
});

// Routes API
app.use('/api/materiel', materielRoutes);
app.use('/api/prestations', prestationsRoutes);
app.use('/api/pdf', pdfRoutes);

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

