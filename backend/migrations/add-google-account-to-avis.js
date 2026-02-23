const db = require('../config/database');

/**
 * Ajoute la colonne google_account à la table avis si elle n'existe pas.
 */
function addGoogleAccountToAvis() {
  return new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(avis)", [], (err, columns) => {
      if (err) return reject(err);
      const hasGoogle = columns && columns.some((c) => c.name === 'google_account');
      if (hasGoogle) {
        console.log('✅ Colonne google_account déjà présente dans avis');
        return resolve();
      }
      db.run('ALTER TABLE avis ADD COLUMN google_account TEXT', (err2) => {
        if (err2) return reject(err2);
        console.log('✅ Colonne google_account ajoutée à avis');
        resolve();
      });
    });
  });
}

if (require.main === module) {
  addGoogleAccountToAvis()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Erreur migration:', err);
      process.exit(1);
    });
}

module.exports = addGoogleAccountToAvis;
