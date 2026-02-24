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

// Premier déploiement avec volume : copier la base locale vers le volume si besoin.
// - Cible absente → copie.
// - Cible présente mais très petite (< 60 Ko) et source plus grosse → base vide, on recopie.
const localDbPath = path.join(__dirname, '..', 'data', 'database.db');
const MIN_VALID_DB_SIZE = 60 * 1024; // 60 Ko

if (dbPath !== localDbPath && fs.existsSync(localDbPath)) {
  const needCopy = !fs.existsSync(dbPath) ||
    (fs.statSync(dbPath).size < MIN_VALID_DB_SIZE && fs.statSync(localDbPath).size >= MIN_VALID_DB_SIZE);
  if (needCopy) {
    try {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      fs.copyFileSync(localDbPath, dbPath);
      console.log('✅ Base locale copiée vers', dbPath);
    } catch (e) {
      console.warn('⚠️ Copie base vers volume ignorée:', e.message);
    }
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
