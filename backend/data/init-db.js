const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const sqlPath = path.join(__dirname, 'database.sql');

// Supprimer l'ancienne base de données si elle existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Ancienne base de données supprimée');
}

// Créer une nouvelle base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur lors de la création de la base de données:', err.message);
    return;
  }
  console.log('✅ Base de données créée');
});

// Lire le fichier SQL
const sql = fs.readFileSync(sqlPath, 'utf8');

// Exécuter le script SQL
db.exec(sql, (err) => {
  if (err) {
    console.error('❌ Erreur lors de l\'exécution du script SQL:', err.message);
    return;
  }
  console.log('✅ Tables créées et données insérées avec succès');
  
  // Vérifier les données
  db.get('SELECT COUNT(*) as count FROM materiel', [], (err, row) => {
    if (err) {
      console.error('❌ Erreur:', err.message);
      return;
    }
    console.log(`📦 Nombre d'articles de matériel: ${row.count}`);
  });
  
  db.get('SELECT COUNT(*) as count FROM prix', [], (err, row) => {
    if (err) {
      console.error('❌ Erreur:', err.message);
      return;
    }
    console.log(`💰 Nombre de prix: ${row.count}`);
  });
  
  db.get('SELECT COUNT(*) as count FROM prestations', [], (err, row) => {
    if (err) {
      console.error('❌ Erreur:', err.message);
      return;
    }
    console.log(`📋 Nombre de prestations: ${row.count}`);
    
    // Fermer la base de données
    db.close((err) => {
      if (err) {
        console.error('❌ Erreur lors de la fermeture:', err.message);
        return;
      }
      console.log('✅ Base de données initialisée avec succès!');
    });
  });
});
