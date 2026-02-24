const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// En prod, utiliser DATABASE_PATH si défini (ex: volume Railway /data/database.db),
// sinon /data/database.db. En dev : backend/data/database.db.
const defaultProdPath = '/data/database.db';
const defaultDevPath = path.join(__dirname, '..', 'data', 'database.db');
const dbPath = process.env.DATABASE_PATH
  ? process.env.DATABASE_PATH
  : (process.env.NODE_ENV === 'production' ? defaultProdPath : defaultDevPath);

// Premier déploiement avec volume : si la base cible n'existe pas mais backend/data/database.db oui (ex. fourni par Git), la copier.
const localDbPath = path.join(__dirname, '..', 'data', 'database.db');
if (dbPath !== localDbPath && !fs.existsSync(dbPath) && fs.existsSync(localDbPath)) {
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.copyFileSync(localDbPath, dbPath);
    console.log('✅ Base locale copiée vers', dbPath);
  } catch (e) {
    console.warn('⚠️ Copie base vers volume ignorée:', e.message);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('✅ Connecté à la base de données SQLite');
  }
});

module.exports = db;