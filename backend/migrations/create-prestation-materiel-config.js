const db = require('../config/database');

/**
 * Migration : Créer la table prestation_materiel_config
 * Cette table remplace l'ancienne prestation_materiel et inclut le type_installation
 */
async function createPrestationMaterielConfig() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('🔄 Début migration : Création table prestation_materiel_config');
      
      // 1. Créer la nouvelle table
      db.run(`
        CREATE TABLE IF NOT EXISTS prestation_materiel_config (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          prestation_code TEXT NOT NULL,
          materiel_code TEXT NOT NULL,
          type_installation TEXT NOT NULL,
          FOREIGN KEY (prestation_code) REFERENCES prestations(code) ON DELETE CASCADE,
          FOREIGN KEY (materiel_code) REFERENCES materiel(code) ON DELETE CASCADE,
          UNIQUE(prestation_code, materiel_code, type_installation)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Erreur création table:', err);
          return reject(err);
        }
        
        console.log('✅ Table prestation_materiel_config créée');
        
        // 2. Créer l'index unique sur code
        db.run(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_config_code 
          ON prestation_materiel_config(code)
        `, (err) => {
          if (err) {
            console.error('❌ Erreur création index:', err);
            return reject(err);
          }
          
          console.log('✅ Index unique créé sur code');
          
          // 3. Créer index pour recherches rapides
          db.run(`
            CREATE INDEX IF NOT EXISTS idx_config_prestation_type 
            ON prestation_materiel_config(prestation_code, type_installation)
          `, (err) => {
            if (err) {
              console.error('❌ Erreur création index recherche:', err);
              return reject(err);
            }
            
            console.log('✅ Index de recherche créé');
            console.log('✅ Migration terminée avec succès');
            resolve();
          });
        });
      });
    });
  });
}

// Exécuter la migration si appelé directement
if (require.main === module) {
  createPrestationMaterielConfig()
    .then(() => {
      console.log('✅ Migration réussie');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Erreur migration:', err);
      process.exit(1);
    });
}

module.exports = createPrestationMaterielConfig;

