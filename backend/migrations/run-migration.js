const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');
const migrationPath = path.join(__dirname, 'migrate-prix-to-prestations.sql');

console.log('🚀 Début de la migration...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données\n');
});

// Lire le fichier SQL
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Séparer les commandes SQL
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

// Exécuter les commandes une par une
let currentStep = 0;

function executeNext() {
  if (currentStep >= statements.length) {
    console.log('\n✅ Migration terminée avec succès !');
    
    // Optionnel : Supprimer la table prix
    console.log('\n⚠️  Pour supprimer définitivement la table prix, exécutez :');
    console.log('   DROP TABLE IF EXISTS prix;');
    
    db.close();
    return;
  }

  const statement = statements[currentStep];
  
  // Ignorer les commentaires
  if (statement.startsWith('--')) {
    currentStep++;
    executeNext();
    return;
  }

  // Exécuter SELECT (pour affichage)
  if (statement.trim().toUpperCase().startsWith('SELECT')) {
    db.all(statement, [], (err, rows) => {
      if (err) {
        console.error(`❌ Erreur à l'étape ${currentStep + 1}:`, err.message);
      } else {
        console.log(`📊 Résultat de la requête ${currentStep + 1}:`);
        console.table(rows);
      }
      currentStep++;
      executeNext();
    });
  } 
  // Exécuter ALTER/UPDATE
  else {
    db.run(statement, [], function(err) {
      if (err) {
        // Ignorer l'erreur si la colonne existe déjà
        if (err.message.includes('duplicate column name')) {
          console.log(`⚠️  Colonne prix_ht existe déjà, on continue...`);
        } else {
          console.error(`❌ Erreur à l'étape ${currentStep + 1}:`, err.message);
          db.close();
          process.exit(1);
        }
      } else {
        console.log(`✅ Étape ${currentStep + 1} réussie (${this.changes} modifications)`);
      }
      currentStep++;
      executeNext();
    });
  }
}

executeNext();


