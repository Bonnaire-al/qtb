const db = require('../config/database');

/**
 * Migration : Table des avis clients (commentaires + notation sur 5, compte Google)
 */
function createAvisTable() {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS avis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_name TEXT NOT NULL,
        comment TEXT NOT NULL,
        stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
        google_account TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )`,
      (err) => {
        if (err) return reject(err);
        console.log('✅ Table avis prête');
        resolve();
      }
    );
  });
}

if (require.main === module) {
  createAvisTable()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Erreur migration avis:', err);
      process.exit(1);
    });
}

module.exports = createAvisTable;
