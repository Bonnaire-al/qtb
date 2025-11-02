const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.db');

console.log('🔍 Vérification du matériel appareillage...\n');

// Vérifier le matériel appareillage
db.all('SELECT * FROM materiel WHERE categorie = "appareillage"', (err, rows) => {
  if (err) {
    console.error('❌ Erreur:', err);
    return;
  }
  
  console.log(`📊 Matériel appareillage trouvé: ${rows.length} éléments\n`);
  
  if (rows.length > 0) {
    console.log('📋 Liste du matériel appareillage:');
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}`);
      console.log(`   Catégorie: ${row.categorie}`);
      console.log(`   Sous-catégorie: ${row.sous_categorie}`);
      console.log(`   Service: ${row.service}`);
      console.log(`   Nom: ${row.nom}`);
      console.log(`   Quantité: ${row.quantite}`);
      console.log(`   Prix HT: ${row.prix_ht} €`);
      console.log('');
    });
  } else {
    console.log('✅ Aucun matériel appareillage trouvé');
  }
  
  // Vérifier aussi les catégories de matériel disponibles
  db.all('SELECT DISTINCT categorie FROM materiel ORDER BY categorie', (err, categories) => {
    if (err) {
      console.error('❌ Erreur:', err);
      return;
    }
    
    console.log('📂 Catégories de matériel disponibles:');
    categories.forEach(cat => {
      console.log(`   - ${cat.categorie}`);
    });
    
    db.close();
  });
});


