const db = require('../config/database');

/**
 * Migration pour supprimer la colonne type_application de la table materiel
 */
async function removeTypeApplication() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Créer une table temporaire sans type_application
      db.run(`
        CREATE TABLE IF NOT EXISTS materiel_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nom TEXT NOT NULL,
          service_value TEXT NOT NULL,
          type_produit TEXT NOT NULL CHECK(type_produit IN ('fourniture', 'materiel')) DEFAULT 'materiel',
          prix_ht REAL NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error('❌ Erreur création table temporaire:', err);
          return reject(err);
        }
        console.log('✅ Table temporaire créée');

        // 2. Migrer les données existantes
        db.run(`
          INSERT INTO materiel_new (id, nom, service_value, type_produit, prix_ht)
          SELECT id, nom, service_value, type_produit, prix_ht
          FROM materiel
        `, (err) => {
          if (err) {
            console.error('❌ Erreur migration données:', err);
            return reject(err);
          }
          console.log('✅ Données migrées');

          // 3. Supprimer l'ancienne table
          db.run('DROP TABLE IF EXISTS materiel', (err) => {
            if (err) {
              console.error('❌ Erreur suppression ancienne table:', err);
              return reject(err);
            }
            console.log('✅ Ancienne table supprimée');

            // 4. Renommer la nouvelle table
            db.run('ALTER TABLE materiel_new RENAME TO materiel', (err) => {
              if (err) {
                console.error('❌ Erreur renommage table:', err);
                return reject(err);
              }
              console.log('✅ Table renommée avec succès');
              resolve();
            });
          });
        });
      });
    });
  });
}

// Exécuter la migration
if (require.main === module) {
  removeTypeApplication()
    .then(() => {
      console.log('✅ Migration terminée avec succès');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Erreur migration:', err);
      process.exit(1);
    });
}

module.exports = removeTypeApplication;


