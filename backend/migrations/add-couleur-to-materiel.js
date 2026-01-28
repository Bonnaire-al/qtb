const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');

console.log('🚀 Ajout de la colonne couleur à la table materiel...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données\n');
});

// Fonction pour vérifier si une colonne existe
function columnExists(tableName, columnName) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const exists = rows.some(row => row.name === columnName);
        resolve(exists);
      }
    });
  });
}

// Fonction pour vérifier si un index existe
function indexExists(indexName) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='index' AND name = ?",
      [indexName],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      }
    );
  });
}

async function runMigration() {
  try {
    // Vérifier si la colonne existe déjà
    const couleurExists = await columnExists('materiel', 'couleur');
    
    if (couleurExists) {
      console.log('⚠️  La colonne couleur existe déjà\n');
    } else {
      // SQLite ne supporte pas directement CHECK dans ALTER TABLE
      // On doit créer une nouvelle table avec la contrainte
      console.log('📦 Création de la colonne couleur avec contrainte...\n');
      
      // Étape 1 : Créer une table temporaire avec la nouvelle structure
      await new Promise((resolve, reject) => {
        db.run(`
          CREATE TABLE materiel_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            designation TEXT NOT NULL,
            qte_dynamique INTEGER NOT NULL DEFAULT 1,
            prix_ht REAL NOT NULL DEFAULT 0,
            couleur TEXT NOT NULL DEFAULT 'gris' CHECK(couleur IN (
              'gris', 'vert', 'orange', 'rouge', 'violet',
              'bleu_fonce', 'bleu_moyen', 'bleu_clair', 'bleu_marine'
            )),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      console.log('✅ Table temporaire créée\n');
      
      // Étape 2 : Copier les données existantes avec valeur par défaut 'gris'
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO materiel_new (id, code, designation, qte_dynamique, prix_ht, couleur, created_at, updated_at)
          SELECT id, code, designation, qte_dynamique, prix_ht, 'gris' as couleur, 
                 COALESCE(created_at, CURRENT_TIMESTAMP) as created_at,
                 COALESCE(updated_at, CURRENT_TIMESTAMP) as updated_at
          FROM materiel
        `, function(err) {
          if (err) reject(err);
          else {
            console.log(`✅ ${this.changes} enregistrements copiés\n`);
            resolve();
          }
        });
      });
      
      // Étape 3 : Supprimer l'ancienne table
      await new Promise((resolve, reject) => {
        db.run('DROP TABLE materiel', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Étape 4 : Renommer la nouvelle table
      await new Promise((resolve, reject) => {
        db.run('ALTER TABLE materiel_new RENAME TO materiel', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      console.log('✅ Colonne couleur ajoutée avec succès\n');
    }
    
    // Créer l'index pour optimiser les tris/filtres
    const indexExistsResult = await indexExists('idx_materiel_couleur');
    
    if (indexExistsResult) {
      console.log('⚠️  L\'index idx_materiel_couleur existe déjà\n');
    } else {
      await new Promise((resolve, reject) => {
        db.run('CREATE INDEX IF NOT EXISTS idx_materiel_couleur ON materiel(couleur)', (err) => {
          if (err) reject(err);
          else {
            console.log('✅ Index idx_materiel_couleur créé\n');
            resolve();
          }
        });
      });
    }
    
    // Afficher un résumé
    db.all('SELECT couleur, COUNT(*) as count FROM materiel GROUP BY couleur', [], (err, rows) => {
      if (err) {
        console.error('❌ Erreur lors de la récupération des statistiques:', err.message);
      } else {
        console.log('📊 Répartition des couleurs:');
        rows.forEach(row => {
          console.log(`   ${row.couleur}: ${row.count} matériel(s)`);
        });
        console.log('');
      }
      
      console.log('✅ Migration terminée avec succès !');
      db.close();
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    db.close();
    process.exit(1);
  }
}

runMigration();



















