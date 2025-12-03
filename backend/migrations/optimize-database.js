const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');

console.log('🚀 OPTIMISATION DE LA BASE DE DONNÉES\n');
console.log('='.repeat(80) + '\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données\n');
});

// Liste des index à créer
const indexes = [
  {
    name: 'idx_prestations_categorie',
    table: 'prestations',
    columns: 'categorie',
    description: 'Recherche par catégorie'
  },
  {
    name: 'idx_prestations_piece',
    table: 'prestations',
    columns: 'piece',
    description: 'Recherche par pièce'
  },
  {
    name: 'idx_prestations_service_value',
    table: 'prestations',
    columns: 'service_value',
    description: 'Recherche par service'
  },
  {
    name: 'idx_prestations_cat_piece_service',
    table: 'prestations',
    columns: 'categorie, piece, service_value',
    description: 'Recherche combinée (optimise PDF-controller)'
  },
  {
    name: 'idx_materiel_categorie',
    table: 'materiel',
    columns: 'categorie',
    description: 'Recherche par catégorie'
  },
  {
    name: 'idx_materiel_sous_categorie',
    table: 'materiel',
    columns: 'sous_categorie',
    description: 'Recherche par sous-catégorie'
  },
  {
    name: 'idx_materiel_service',
    table: 'materiel',
    columns: 'service',
    description: 'Recherche par service'
  }
];

let indexesCreated = 0;
let indexesSkipped = 0;

function createIndex(index) {
  return new Promise((resolve, reject) => {
    const sql = `CREATE INDEX IF NOT EXISTS ${index.name} ON ${index.table}(${index.columns})`;
    
    db.run(sql, [], function(err) {
      if (err) {
        if (err.message.includes('already exists')) {
          console.log(`⚠️  Index ${index.name} existe déjà - ignoré`);
          indexesSkipped++;
        } else {
          console.error(`❌ Erreur création index ${index.name}:`, err.message);
          reject(err);
        }
      } else {
        console.log(`✅ Index créé: ${index.name}`);
        console.log(`   Table: ${index.table}`);
        console.log(`   Colonnes: ${index.columns}`);
        console.log(`   Usage: ${index.description}\n`);
        indexesCreated++;
      }
      resolve();
    });
  });
}

async function createAllIndexes() {
  console.log('📇 CRÉATION DES INDEX D\'OPTIMISATION\n');
  
  for (const index of indexes) {
    await createIndex(index);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 RÉSUMÉ:`);
  console.log(`   ✅ ${indexesCreated} index créés`);
  console.log(`   ⚠️  ${indexesSkipped} index déjà existants`);
  console.log(`   📈 Total: ${indexesCreated + indexesSkipped} index\n`);
}

async function analyzePerformance() {
  console.log('📊 ANALYSE DES PERFORMANCES\n');
  
  // Taille de la base de données
  const fs = require('fs');
  const stats = fs.statSync(dbPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`   💾 Taille de la base: ${sizeInMB} MB`);
  
  // Nombre d'enregistrements par table
  const tables = ['prestations', 'materiel', 'prestation_materiel'];
  
  for (const table of tables) {
    await new Promise((resolve) => {
      db.get(`SELECT COUNT(*) as count FROM ${table}`, [], (err, row) => {
        if (!err) {
          console.log(`   📦 ${table}: ${row.count} enregistrements`);
        }
        resolve();
      });
    });
  }
  
  console.log('\n');
}

async function showOptimizationTips() {
  console.log('💡 CONSEILS D\'OPTIMISATION SUPPLÉMENTAIRES\n');
  
  const tips = [
    {
      emoji: '🔍',
      tip: 'Les index sont maintenant créés pour accélérer les recherches',
      impact: 'Performance améliorée de 2-10x sur les requêtes'
    },
    {
      emoji: '🗑️',
      tip: 'Pensez à supprimer la table prix obsolète',
      impact: 'Libère de l\'espace et simplifie la base'
    },
    {
      emoji: '🔄',
      tip: 'Exécutez VACUUM pour compacter la base de données',
      impact: 'Réduit la taille du fichier'
    },
    {
      emoji: '📊',
      tip: 'Utilisez ANALYZE pour mettre à jour les statistiques',
      impact: 'Optimise le planificateur de requêtes SQLite'
    }
  ];
  
  tips.forEach(t => {
    console.log(`   ${t.emoji} ${t.tip}`);
    console.log(`      → Impact: ${t.impact}\n`);
  });
}

async function runVacuumAndAnalyze() {
  console.log('🔄 OPTIMISATION FINALE\n');
  
  return new Promise((resolve, reject) => {
    console.log('   ⏳ Exécution de VACUUM (compactage)...');
    db.run('VACUUM', [], (err) => {
      if (err) {
        console.error('   ❌ Erreur VACUUM:', err.message);
        reject(err);
      } else {
        console.log('   ✅ VACUUM terminé\n');
        
        console.log('   ⏳ Exécution de ANALYZE (statistiques)...');
        db.run('ANALYZE', [], (err) => {
          if (err) {
            console.error('   ❌ Erreur ANALYZE:', err.message);
            reject(err);
          } else {
            console.log('   ✅ ANALYZE terminé\n');
            resolve();
          }
        });
      }
    });
  });
}

// Exécution principale
async function main() {
  try {
    await createAllIndexes();
    await analyzePerformance();
    await runVacuumAndAnalyze();
    await showOptimizationTips();
    
    const fs = require('fs');
    const stats = fs.statSync(dbPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('='.repeat(80));
    console.log('\n✅ OPTIMISATION TERMINÉE AVEC SUCCÈS!\n');
    console.log(`   💾 Taille finale: ${sizeInMB} MB`);
    console.log(`   📇 ${indexesCreated + indexesSkipped} index actifs`);
    console.log(`   🚀 Base de données optimisée et prête à l'emploi!\n`);
    
    db.close();
  } catch (error) {
    console.error('❌ Erreur:', error);
    db.close();
    process.exit(1);
  }
}

main();


















