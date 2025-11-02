const express = require('express');
const cors = require('cors');
const PrestationController = require('./controllers/P-controller');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Routes de test
app.get('/api/prestations/:categorie', PrestationController.getByCategorie);
app.put('/api/prestations/:id', PrestationController.update);

app.listen(PORT, () => {
  console.log(`🧪 Serveur de TEST démarré sur http://localhost:${PORT}`);
  console.log('Ce serveur utilise le NOUVEAU code mis à jour\n');
});












