const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const readline = require('readline');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('⚠️  ATTENTION : SUPPRESSION DÉFINITIVE DE LA TABLE PRIX\n');
console.log('Cette action est IRRÉVERSIBLE !');
console.log('Assurez-vous que la migration a bien fonctionné avant de continuer.\n');
console.log('Pour vérifier, exécutez : node migrations/verify-migration.js\n');

rl.question('Voulez-vous vraiment supprimer la table prix ? (oui/non) : ', (answer) => {
  if (answer.toLowerCase() !== 'oui') {
    console.log('\n❌ Opération annulée');
    rl.close();
    process.exit(0);
  }
  
  console.log('\n🗑️  Suppression de la table prix...\n');
  
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Erreur de connexion:', err.message);
      rl.close();
      process.exit(1);
    }
  });
  
  // Faire une sauvegarde avant suppression
  db.all('SELECT * FROM prix', [], (err, rows) => {
    if (err) {
      console.error('❌ Erreur:', err.message);
      db.close();
      rl.close();
      process.exit(1);
    }
    
    const fs = require('fs');
    const backupPath = path.join(__dirname, '..', 'data', 'prix-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(rows, null, 2));
    console.log(`✅ Sauvegarde créée : ${backupPath}`);
    console.log(`   (${rows.length} enregistrements)\n`);
    
    // Supprimer la table
    db.run('DROP TABLE IF EXISTS prix', function(err) {
      if (err) {
        console.error('❌ Erreur lors de la suppression:', err.message);
        db.close();
        rl.close();
        process.exit(1);
      }
      
      console.log('✅ Table prix supprimée avec succès\n');
      console.log('📋 Résumé :');
      console.log(`   - ${rows.length} enregistrements sauvegardés`);
      console.log(`   - Table prix supprimée`);
      console.log(`   - Fichier de sauvegarde : prix-backup.json\n`);
      console.log('✅ Migration complète terminée !');
      
      db.close();
      rl.close();
    });
  });
});


















