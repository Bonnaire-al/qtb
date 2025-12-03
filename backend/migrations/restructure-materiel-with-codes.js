const db = require('../config/database');

/**
 * Migration : Restructurer la table materiel avec codes, designation, type_pose, qte_dynamique
 * Préserve toutes les données existantes
 */
async function restructureMaterielWithCodes() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('🔄 Début migration : Restructuration table materiel');
      
      // 1. Créer une table temporaire avec la nouvelle structure
      db.run(`
        CREATE TABLE IF NOT EXISTS materiel_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          designation TEXT NOT NULL,
          type_pose TEXT CHECK(type_pose IN ('encastré', 'saigné', 'moulure', 'commun')),
          prix_ht REAL NOT NULL,
          qte_dynamique BOOLEAN DEFAULT 1,
          type_produit TEXT NOT NULL CHECK(type_produit IN ('fourniture', 'materiel')) DEFAULT 'materiel'
        )
      `, (err) => {
        if (err) {
          console.error('❌ Erreur création table temporaire:', err);
          return reject(err);
        }
        
        console.log('✅ Table temporaire créée');
        
        // 2. Migrer les données existantes
        db.all('SELECT * FROM materiel ORDER BY id', [], (err, rows) => {
          if (err) {
            console.error('❌ Erreur récupération matériels:', err);
            return reject(err);
          }
          
          if (rows.length === 0) {
            console.log('⚠️ Aucun matériel à migrer');
            // Supprimer l'ancienne table et renommer
            return dropAndRename();
          }
          
          console.log(`📦 ${rows.length} matériels à migrer`);
          
          // Générer les codes et migrer
          let completed = 0;
          let codeCounter = 0;
          
          rows.forEach((row) => {
            // Générer un code unique basé sur le nom
            codeCounter++;
            const nomClean = row.nom
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '')
              .substring(0, 5);
            const code = `M${nomClean}${String(codeCounter).padStart(3, '0')}`;
            
            // Déduire type_pose depuis nom si possible, sinon 'commun'
            let typePose = 'commun';
            const nomLower = row.nom.toLowerCase();
            if (nomLower.includes('encastré') || nomLower.includes('encastre')) {
              typePose = 'encastré';
            } else if (nomLower.includes('saigné') || nomLower.includes('saigne')) {
              typePose = 'saigné';
            } else if (nomLower.includes('moulure')) {
              typePose = 'moulure';
            }
            
            // qte_dynamique par défaut à true (1)
            const qteDynamique = 1; // true par défaut
            
            db.run(`
              INSERT INTO materiel_new (code, designation, type_pose, prix_ht, qte_dynamique, type_produit)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [
              code,
              row.nom, // nom devient designation
              typePose,
              row.prix_ht,
              qteDynamique,
              row.type_produit || 'materiel'
            ], function(err) {
              if (err) {
                console.error(`❌ Erreur insertion matériel #${row.id}:`, err);
                return reject(err);
              }
              
              completed++;
              if (completed === rows.length) {
                console.log(`✅ ${completed} matériels migrés`);
                dropAndRename();
              }
            });
          });
          
          function dropAndRename() {
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
                console.log('✅ Migration terminée avec succès');
                resolve();
              });
            });
          }
        });
      });
    });
  });
}

// Exécuter la migration si appelé directement
if (require.main === module) {
  restructureMaterielWithCodes()
    .then(() => {
      console.log('✅ Migration réussie');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Erreur migration:', err);
      process.exit(1);
    });
}

module.exports = restructureMaterielWithCodes;

