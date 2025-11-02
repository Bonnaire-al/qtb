const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.db');

console.log('🗑️ Suppression du matériel appareillage...\n');

// Fonction pour supprimer le matériel appareillage
function deleteAppareillageMateriel() {
  return new Promise((resolve, reject) => {
    // D'abord, récupérer tous les IDs du matériel appareillage
    db.all('SELECT id FROM materiel WHERE categorie = "appareillage"', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const ids = rows.map(row => row.id);
      console.log(`📋 Matériel à supprimer (IDs): ${ids.join(', ')}`);

      if (ids.length === 0) {
        console.log('ℹ️ Aucun matériel appareillage trouvé à supprimer.');
        resolve();
        return;
      }

      // Supprimer les liaisons prestation_materiel d'abord
      const placeholders = ids.map(() => '?').join(',');
      const deleteLiaisonsQuery = `DELETE FROM prestation_materiel WHERE materiel_id IN (${placeholders})`;
      
      db.run(deleteLiaisonsQuery, ids, function(err) {
        if (err) {
          console.error('❌ Erreur lors de la suppression des liaisons:', err);
          reject(err);
          return;
        }
        console.log(`✅ ${this.changes} liaisons prestation_materiel supprimées`);

        // Ensuite, supprimer le matériel
        const deleteMaterielQuery = `DELETE FROM materiel WHERE id IN (${placeholders})`;
        
        db.run(deleteMaterielQuery, ids, function(err) {
          if (err) {
            console.error('❌ Erreur lors de la suppression du matériel:', err);
            reject(err);
            return;
          }
          console.log(`✅ ${this.changes} éléments de matériel appareillage supprimés`);
          resolve();
        });
      });
    });
  });
}

// Fonction pour vérifier la suppression
function verifyDeletion() {
  return new Promise((resolve, reject) => {
    db.all('SELECT COUNT(*) as count FROM materiel WHERE categorie = "appareillage"', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      const count = rows[0].count;
      console.log(`\n🔍 Vérification: ${count} éléments de matériel appareillage restants`);
      
      if (count === 0) {
        console.log('✅ Suppression réussie ! Tous les éléments de matériel appareillage ont été supprimés.');
      } else {
        console.log('⚠️ Il reste des éléments de matériel appareillage dans la base.');
      }
      
      resolve();
    });
  });
}

// Fonction pour afficher les catégories restantes
function showRemainingCategories() {
  return new Promise((resolve, reject) => {
    db.all('SELECT DISTINCT categorie FROM materiel ORDER BY categorie', (err, categories) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log('\n📂 Catégories de matériel restantes:');
      categories.forEach(cat => {
        console.log(`   - ${cat.categorie}`);
      });
      
      resolve();
    });
  });
}

// Exécuter la suppression
async function main() {
  try {
    await deleteAppareillageMateriel();
    await verifyDeletion();
    await showRemainingCategories();
    
    console.log('\n🎉 Opération terminée !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    db.close();
  }
}

main();


