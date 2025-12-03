const db = require('../config/database');

/**
 * Migration : Ajouter la colonne code aux prestations
 * Génère automatiquement un code unique pour chaque prestation existante
 * Format : P + abréviation catégorie + numéro séquentiel
 */
async function addCodesToPrestations() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('🔄 Début migration : Ajout des codes aux prestations');
      
      // 1. Ajouter la colonne code si elle n'existe pas (nullable d'abord)
      db.run(`
        ALTER TABLE prestations 
        ADD COLUMN code TEXT
      `, (err) => {
        if (err) {
          // Si la colonne existe déjà, ce n'est pas grave
          if (err.message.includes('duplicate column')) {
            console.log('⚠️ Colonne code existe déjà');
          } else {
            console.error('❌ Erreur ajout colonne code:', err);
            return reject(err);
          }
        } else {
          console.log('✅ Colonne code ajoutée');
        }
        
        // 2. Générer les codes pour toutes les prestations existantes
        db.all('SELECT id, categorie, service_value FROM prestations WHERE code IS NULL ORDER BY id', [], (err, rows) => {
          if (err) {
            console.error('❌ Erreur récupération prestations:', err);
            return reject(err);
          }
          
          if (rows.length === 0) {
            console.log('✅ Toutes les prestations ont déjà un code');
            return resolve();
          }
          
          console.log(`📦 ${rows.length} prestations à migrer`);
          
          // Mapping des catégories vers abréviations
          const categorieAbbrev = {
            'domotique': 'dom',
            'installation': 'inst',
            'portail': 'port',
            'securite': 'sec'
          };
          
          // Compteur par catégorie pour séquence
          const counters = {};
          
          // Générer les codes
          const updates = [];
          rows.forEach((row) => {
            const abbrev = categorieAbbrev[row.categorie] || row.categorie.substring(0, 3);
            counters[abbrev] = (counters[abbrev] || 0) + 1;
            const code = `P${abbrev}${String(counters[abbrev]).padStart(3, '0')}`;
            updates.push({ id: row.id, code });
          });
          
          // Mettre à jour les codes
          let completed = 0;
          updates.forEach(({ id, code }) => {
            db.run('UPDATE prestations SET code = ? WHERE id = ?', [code, id], (err) => {
              if (err) {
                console.error(`❌ Erreur mise à jour prestation #${id}:`, err);
                return reject(err);
              }
              
              completed++;
              if (completed === updates.length) {
                console.log(`✅ ${completed} codes générés et assignés`);
                
                // 3. Ajouter la contrainte UNIQUE sur code
                db.run(`
                  CREATE UNIQUE INDEX IF NOT EXISTS idx_prestations_code 
                  ON prestations(code)
                `, (err) => {
                  if (err) {
                    console.error('❌ Erreur création index:', err);
                    return reject(err);
                  }
                  
                  console.log('✅ Index unique créé sur code');
                  console.log('✅ Migration terminée avec succès');
                  resolve();
                });
              }
            });
          });
        });
      });
    });
  });
}

// Exécuter la migration si appelé directement
if (require.main === module) {
  addCodesToPrestations()
    .then(() => {
      console.log('✅ Migration réussie');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Erreur migration:', err);
      process.exit(1);
    });
}

module.exports = addCodesToPrestations;

