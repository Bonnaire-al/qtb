const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');

console.log('🚀 Ajout de la colonne prix_ht à la table prestations...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données\n');
});

// Étape 1 : Ajouter la colonne prix_ht
db.run('ALTER TABLE prestations ADD COLUMN prix_ht REAL DEFAULT 0', function(err) {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('⚠️  La colonne prix_ht existe déjà\n');
      checkAndMigrate();
    } else {
      console.error('❌ Erreur lors de l\'ajout de la colonne:', err.message);
      db.close();
      process.exit(1);
    }
  } else {
    console.log('✅ Colonne prix_ht ajoutée avec succès\n');
    checkAndMigrate();
  }
});

function checkAndMigrate() {
  // Vérifier si la table prix existe
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='prix'", [], (err, row) => {
    if (err) {
      console.error('❌ Erreur:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (!row) {
      console.log('⚠️  La table prix n\'existe pas ou a déjà été supprimée');
      console.log('✅ Structure de la table prestations mise à jour');
      db.close();
      return;
    }
    
    console.log('📦 Table prix trouvée, migration des données...\n');
    migratePrix();
  });
}

function migratePrix() {
  // Migrer les données de prix vers prestations
  const query = `
    UPDATE prestations
    SET prix_ht = (
        SELECT prix.prix_ht 
        FROM prix 
        WHERE prix.categorie = prestations.categorie 
          AND (prix.sous_categorie = prestations.piece OR (prix.sous_categorie = 'commun' AND prestations.piece = 'commun'))
          AND prix.service = prestations.service_value
    )
    WHERE EXISTS (
        SELECT 1 
        FROM prix 
        WHERE prix.categorie = prestations.categorie 
          AND (prix.sous_categorie = prestations.piece OR (prix.sous_categorie = 'commun' AND prestations.piece = 'commun'))
          AND prix.service = prestations.service_value
    )
  `;
  
  db.run(query, [], function(err) {
    if (err) {
      console.error('❌ Erreur lors de la migration:', err.message);
      db.close();
      process.exit(1);
    }
    
    console.log(`✅ ${this.changes} prestations mises à jour avec leurs prix\n`);
    showResults();
  });
}

function showResults() {
  // Afficher les résultats
  db.all('SELECT COUNT(*) as total FROM prestations WHERE prix_ht > 0', [], (err, rows) => {
    if (err) {
      console.error('❌ Erreur:', err.message);
    } else {
      console.log(`📊 Prestations avec prix: ${rows[0].total}`);
    }
    
    db.all('SELECT COUNT(*) as total FROM prestations WHERE prix_ht = 0 OR prix_ht IS NULL', [], (err, rows) => {
      if (err) {
        console.error('❌ Erreur:', err.message);
      } else {
        console.log(`⚠️  Prestations sans prix: ${rows[0].total}\n`);
      }
      
      console.log('✅ Migration terminée avec succès !');
      console.log('\n💡 Vous pouvez maintenant supprimer la table prix si vous le souhaitez :');
      console.log('   node migrations/drop-prix-table.js');
      db.close();
    });
  });
}


