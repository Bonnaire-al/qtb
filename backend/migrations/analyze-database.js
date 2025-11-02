const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  }
});

console.log('🔍 ANALYSE COMPLÈTE DE LA BASE DE DONNÉES\n');
console.log('='.repeat(80) + '\n');

// 1. Lister toutes les tables
function listTables() {
  return new Promise((resolve, reject) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, rows) => {
      if (err) reject(err);
      else {
        console.log('📋 TABLES EXISTANTES:\n');
        rows.forEach(row => console.log(`   - ${row.name}`));
        console.log('\n');
        resolve(rows.map(r => r.name));
      }
    });
  });
}

// 2. Analyser la structure de chaque table
function analyzeTableStructure(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, [], (err, rows) => {
      if (err) reject(err);
      else {
        console.log(`📊 STRUCTURE DE LA TABLE: ${tableName}\n`);
        console.table(rows.map(r => ({
          Colonne: r.name,
          Type: r.type,
          'Non NULL': r.notnull ? 'Oui' : 'Non',
          'Valeur par défaut': r.dflt_value || '-',
          'Clé primaire': r.pk ? 'Oui' : 'Non'
        })));
        console.log('\n');
        resolve(rows);
      }
    });
  });
}

// 3. Compter les enregistrements
function countRecords(tableName) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as count FROM ${tableName}`, [], (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

// 4. Détecter les doublons dans prestations
function checkPrestationsDuplicates() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        categorie, piece, service_value, service_label,
        COUNT(*) as count,
        GROUP_CONCAT(id) as ids
      FROM prestations
      GROUP BY categorie, piece, service_value
      HAVING COUNT(*) > 1
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else {
        console.log('🔍 DOUBLONS DANS PRESTATIONS:\n');
        if (rows.length === 0) {
          console.log('   ✅ Aucun doublon détecté\n');
        } else {
          console.log(`   ⚠️  ${rows.length} doublons trouvés:\n`);
          console.table(rows);
        }
        resolve(rows);
      }
    });
  });
}

// 5. Détecter les doublons dans materiel
function checkMaterielDuplicates() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        categorie, sous_categorie, service, nom,
        COUNT(*) as count,
        GROUP_CONCAT(id) as ids
      FROM materiel
      GROUP BY categorie, sous_categorie, service, nom
      HAVING COUNT(*) > 1
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else {
        console.log('🔍 DOUBLONS DANS MATERIEL:\n');
        if (rows.length === 0) {
          console.log('   ✅ Aucun doublon détecté\n');
        } else {
          console.log(`   ⚠️  ${rows.length} doublons trouvés:\n`);
          console.table(rows);
        }
        resolve(rows);
      }
    });
  });
}

// 6. Vérifier les index
function checkIndexes() {
  return new Promise((resolve, reject) => {
    db.all("SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL", [], (err, rows) => {
      if (err) reject(err);
      else {
        console.log('📇 INDEX EXISTANTS:\n');
        if (rows.length === 0) {
          console.log('   ⚠️  Aucun index trouvé - Optimisation recommandée!\n');
        } else {
          rows.forEach(row => {
            console.log(`   - ${row.name} sur ${row.tbl_name}`);
            console.log(`     ${row.sql}\n`);
          });
        }
        resolve(rows);
      }
    });
  });
}

// 7. Vérifier l'intégrité des données prestations
function checkPrestationsIntegrity() {
  return new Promise((resolve, reject) => {
    const checks = {
      null_categorie: `SELECT COUNT(*) as count FROM prestations WHERE categorie IS NULL OR categorie = ''`,
      null_service_value: `SELECT COUNT(*) as count FROM prestations WHERE service_value IS NULL OR service_value = ''`,
      null_service_label: `SELECT COUNT(*) as count FROM prestations WHERE service_label IS NULL OR service_label = ''`,
      negative_prix: `SELECT COUNT(*) as count FROM prestations WHERE prix_ht < 0`
    };
    
    console.log('🔍 INTÉGRITÉ DES DONNÉES PRESTATIONS:\n');
    
    Promise.all(
      Object.entries(checks).map(([key, query]) => 
        new Promise((res, rej) => {
          db.get(query, [], (err, row) => {
            if (err) rej(err);
            else res({ check: key, count: row.count });
          });
        })
      )
    ).then(results => {
      results.forEach(r => {
        const status = r.count === 0 ? '✅' : '⚠️ ';
        const label = r.check.replace(/_/g, ' ').toUpperCase();
        console.log(`   ${status} ${label}: ${r.count}`);
      });
      console.log('\n');
      resolve(results);
    }).catch(reject);
  });
}

// 8. Statistiques par catégorie
function getStatsByCategory() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        categorie,
        COUNT(*) as total,
        COUNT(DISTINCT piece) as pieces_differentes,
        COUNT(DISTINCT service_value) as services_differents,
        AVG(prix_ht) as prix_moyen,
        MIN(prix_ht) as prix_min,
        MAX(prix_ht) as prix_max,
        SUM(CASE WHEN prix_ht = 0 OR prix_ht IS NULL THEN 1 ELSE 0 END) as sans_prix
      FROM prestations
      GROUP BY categorie
      ORDER BY categorie
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else {
        console.log('📊 STATISTIQUES PAR CATÉGORIE:\n');
        console.table(rows.map(r => ({
          Catégorie: r.categorie,
          Total: r.total,
          Pièces: r.pieces_differentes,
          Services: r.services_differents,
          'Prix moyen': r.prix_moyen ? r.prix_moyen.toFixed(2) + ' €' : '-',
          'Prix min': r.prix_min + ' €',
          'Prix max': r.prix_max + ' €',
          'Sans prix': r.sans_prix
        })));
        console.log('\n');
        resolve(rows);
      }
    });
  });
}

// 9. Recommandations d'optimisation
function generateRecommendations(analysis) {
  console.log('💡 RECOMMANDATIONS D\'OPTIMISATION:\n');
  
  const recommendations = [];
  
  // Doublons
  if (analysis.prestationsDuplicates.length > 0) {
    recommendations.push({
      priorité: '🔴 HAUTE',
      problème: `${analysis.prestationsDuplicates.length} doublons dans prestations`,
      action: 'Supprimer les doublons via script de nettoyage'
    });
  }
  
  if (analysis.materielDuplicates.length > 0) {
    recommendations.push({
      priorité: '🔴 HAUTE',
      problème: `${analysis.materielDuplicates.length} doublons dans materiel`,
      action: 'Supprimer les doublons via script de nettoyage'
    });
  }
  
  // Index
  if (analysis.indexes.length === 0) {
    recommendations.push({
      priorité: '🟡 MOYENNE',
      problème: 'Aucun index sur les tables',
      action: 'Créer des index sur les colonnes fréquemment utilisées'
    });
  }
  
  // Table prix
  if (analysis.tables.includes('prix')) {
    recommendations.push({
      priorité: '🟢 BASSE',
      problème: 'Ancienne table prix toujours présente',
      action: 'Supprimer la table prix après vérification'
    });
  }
  
  if (recommendations.length === 0) {
    console.log('   ✅ Aucune optimisation nécessaire - Base de données propre!\n');
  } else {
    console.table(recommendations);
  }
}

// Exécution principale
async function main() {
  try {
    const analysis = {};
    
    analysis.tables = await listTables();
    
    // Analyser les tables principales
    if (analysis.tables.includes('prestations')) {
      await analyzeTableStructure('prestations');
      const count = await countRecords('prestations');
      console.log(`   📦 Total: ${count} prestations\n`);
      
      analysis.prestationsDuplicates = await checkPrestationsDuplicates();
      await checkPrestationsIntegrity();
      await getStatsByCategory();
    }
    
    if (analysis.tables.includes('materiel')) {
      await analyzeTableStructure('materiel');
      const count = await countRecords('materiel');
      console.log(`   📦 Total: ${count} matériels\n`);
      
      analysis.materielDuplicates = await checkMaterielDuplicates();
    }
    
    analysis.indexes = await checkIndexes();
    
    generateRecommendations(analysis);
    
    console.log('='.repeat(80));
    console.log('✅ Analyse terminée!');
    
    db.close();
  } catch (error) {
    console.error('❌ Erreur:', error);
    db.close();
    process.exit(1);
  }
}

main();








