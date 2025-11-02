const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');

console.log('🗑️  SUPPRESSION DE LA TABLE PRIX OBSOLÈTE\n');
console.log('='.repeat(80) + '\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données\n');
});

// Vérifier que la table prix existe
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='prix'", [], (err, row) => {
  if (err) {
    console.error('❌ Erreur:', err.message);
    db.close();
    process.exit(1);
  }
  
  if (!row) {
    console.log('ℹ️  La table prix n\'existe pas ou a déjà été supprimée');
    console.log('✅ Rien à faire!\n');
    db.close();
    return;
  }
  
  console.log('📦 Table prix trouvée\n');
  
  // Faire une sauvegarde avant suppression
  console.log('💾 Création d\'une sauvegarde de sécurité...');
  
  db.all('SELECT * FROM prix', [], (err, rows) => {
    if (err) {
      console.error('❌ Erreur lors de la lecture:', err.message);
      db.close();
      process.exit(1);
    }
    
    const backupPath = path.join(__dirname, '..', 'data', 'prix-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(rows, null, 2));
    
    console.log(`✅ Sauvegarde créée : data/prix-backup.json`);
    console.log(`   → ${rows.length} enregistrements sauvegardés\n`);
    
    // Supprimer la table
    console.log('🗑️  Suppression de la table prix...\n');
    
    db.run('DROP TABLE IF EXISTS prix', function(err) {
      if (err) {
        console.error('❌ Erreur lors de la suppression:', err.message);
        db.close();
        process.exit(1);
      }
      
      console.log('✅ Table prix supprimée avec succès!\n');
      
      // Vérifier les tables restantes
      db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
        if (err) {
          console.error('❌ Erreur:', err.message);
        } else {
          console.log('📋 TABLES RESTANTES DANS LA BASE:\n');
          tables.forEach(t => console.log(`   ✓ ${t.name}`));
          console.log('\n');
        }
        
        // Optimiser la base après suppression
        console.log('🔄 Optimisation de la base de données...\n');
        
        db.run('VACUUM', [], (err) => {
          if (err) {
            console.error('⚠️  Erreur VACUUM:', err.message);
          } else {
            console.log('✅ Base de données compactée\n');
          }
          
          // Afficher la nouvelle taille
          const stats = fs.statSync(dbPath);
          const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
          
          console.log('='.repeat(80));
          console.log('\n✅ SUPPRESSION TERMINÉE AVEC SUCCÈS!\n');
          console.log('📊 Résumé :');
          console.log(`   💾 Nouvelle taille : ${sizeInMB} MB`);
          console.log(`   📦 ${rows.length} prix sauvegardés`);
          console.log(`   🗑️  Table prix supprimée`);
          console.log(`   ✅ Migration complète terminée!\n`);
          console.log('💡 La table prestations contient maintenant tous les prix\n');
          
          db.close();
        });
      });
    });
  });
});








