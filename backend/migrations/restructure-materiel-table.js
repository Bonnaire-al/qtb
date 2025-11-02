const db = require('../config/database');

/**
 * Migration pour restructurer la table materiel
 * Nouvelles colonnes :
 * - nom (nom du matériel)
 * - service_value (service_value de la prestation)
 * - type_application (commun, selection, unique)
 * - type_produit (fourniture, materiel)
 * - prix_ht (prix)
 */
async function restructureMaterielTable() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Créer une table temporaire avec la nouvelle structure
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
        // On va essayer de mapper les anciennes données vers la nouvelle structure
        db.run(`
          INSERT INTO materiel_new (nom, service_value, type_produit, prix_ht)
          SELECT 
            nom,
            service AS service_value,
            'materiel' AS type_produit,
            prix_ht
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
              
              // 5. Supprimer et recréer la table de liaison si elle existe
              db.run('DROP TABLE IF EXISTS prestation_materiel', (err) => {
                if (err) {
                  console.error('❌ Erreur suppression ancienne table liaison:', err);
                  return reject(err);
                }
                console.log('✅ Ancienne table liaison supprimée');
                
                db.run(`
                  CREATE TABLE IF NOT EXISTS prestation_materiel (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    prestation_service_value TEXT NOT NULL,
                    materiel_id INTEGER NOT NULL,
                    FOREIGN KEY (materiel_id) REFERENCES materiel(id) ON DELETE CASCADE,
                    UNIQUE(prestation_service_value, materiel_id)
                  )
                `, (err) => {
                  if (err) {
                    console.error('❌ Erreur création table liaison:', err);
                    return reject(err);
                  }
                  console.log('✅ Table liaison créée');
                  resolve();
                });
              });
            });
          });
        });
      });
    });
  });
}

// Exécuter la migration
if (require.main === module) {
  restructureMaterielTable()
    .then(() => {
      console.log('✅ Migration terminée avec succès');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Erreur migration:', err);
      process.exit(1);
    });
}

module.exports = restructureMaterielTable;

