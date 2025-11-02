const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  }
});

console.log('🔍 Vérification de la migration des prix\n');
console.log('='.repeat(80) + '\n');

// Afficher quelques exemples de prestations avec prix
db.all(`
  SELECT categorie, piece, service_value, service_label, prix_ht 
  FROM prestations 
  WHERE prix_ht > 0 
  LIMIT 10
`, [], (err, rows) => {
  if (err) {
    console.error('❌ Erreur:', err.message);
  } else {
    console.log('📦 EXEMPLES DE PRESTATIONS AVEC PRIX:\n');
    console.table(rows);
  }
  
  // Afficher les prestations sans prix
  db.all(`
    SELECT categorie, piece, service_value, service_label, prix_ht 
    FROM prestations 
    WHERE prix_ht = 0 OR prix_ht IS NULL 
    LIMIT 10
  `, [], (err, rows) => {
    if (err) {
      console.error('❌ Erreur:', err.message);
    } else {
      console.log('\n⚠️  EXEMPLES DE PRESTATIONS SANS PRIX:\n');
      console.table(rows);
    }
    
    // Statistiques par catégorie
    db.all(`
      SELECT 
        categorie,
        COUNT(*) as total,
        SUM(CASE WHEN prix_ht > 0 THEN 1 ELSE 0 END) as avec_prix,
        SUM(CASE WHEN prix_ht = 0 OR prix_ht IS NULL THEN 1 ELSE 0 END) as sans_prix
      FROM prestations
      GROUP BY categorie
    `, [], (err, rows) => {
      if (err) {
        console.error('❌ Erreur:', err.message);
      } else {
        console.log('\n📊 STATISTIQUES PAR CATÉGORIE:\n');
        console.table(rows);
      }
      
      db.close();
    });
  });
});


