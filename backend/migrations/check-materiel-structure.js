const db = require('../config/database');

/**
 * Script pour vérifier la structure de la table materiel
 */
async function checkMaterielStructure() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Vérifier si la table existe
      db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='materiel'", [], (err, tables) => {
        if (err) {
          console.error('❌ Erreur lors de la vérification:', err);
          return reject(err);
        }
        
        if (tables.length === 0) {
          console.log('⚠️ La table materiel n\'existe pas');
          return resolve({ exists: false, needsMigration: true });
        }
        
        console.log('✅ La table materiel existe');
        
        // Vérifier la structure de la table
        db.all("PRAGMA table_info(materiel)", [], (err, columns) => {
          if (err) {
            console.error('❌ Erreur lors de la lecture de la structure:', err);
            return reject(err);
          }
          
          console.log('\n📋 Structure actuelle de la table materiel:');
          columns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
          });
          
          // Vérifier si les colonnes de l'ancienne structure existent
          const oldColumns = ['categorie', 'sous_categorie', 'service', 'quantite'];
          const hasOldColumns = oldColumns.some(col => columns.find(c => c.name === col));
          
          // Vérifier si les colonnes de la nouvelle structure existent
          const newColumns = ['nom', 'service_value', 'type_produit'];
          const hasNewColumns = newColumns.every(col => columns.find(c => c.name === col));
          
          const needsMigration = hasOldColumns || !hasNewColumns;
          
          if (hasOldColumns) {
            console.log('\n⚠️ La table contient encore les anciennes colonnes (categorie, sous_categorie, service, quantite)');
          }
          
          if (!hasNewColumns) {
            console.log('\n⚠️ La table ne contient pas toutes les nouvelles colonnes (nom, service_value, type_produit)');
          }
          
          if (needsMigration) {
            console.log('\n💡 Migration nécessaire:');
            console.log('   Exécutez: node backend/migrations/restructure-materiel-table.js');
          } else {
            console.log('\n✅ La structure de la table est correcte');
          }
          
          resolve({ 
            exists: true, 
            needsMigration,
            columns: columns.map(c => c.name),
            hasOldColumns,
            hasNewColumns
          });
        });
      });
    });
  });
}

// Exécuter la vérification
if (require.main === module) {
  checkMaterielStructure()
    .then((result) => {
      if (result.needsMigration) {
        console.log('\n⚠️ Une migration est nécessaire');
        process.exit(1);
      } else {
        console.log('\n✅ Tout est OK');
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error('❌ Erreur:', err);
      process.exit(1);
    });
}

module.exports = checkMaterielStructure;








