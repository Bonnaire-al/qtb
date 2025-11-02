const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const sqlFile = path.join(__dirname, 'complete-prestations.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log('🚀 Complétion des prestations...\n');

let completed = 0;

statements.forEach((statement) => {
  db.run(statement, (err) => {
    if (err && !err.message.includes('UNIQUE')) {
      console.error('❌', err.message);
    }
    completed++;
    
    if (completed === statements.length) {
      console.log(`\n✅ ${completed} prestations ajoutées!`);
      db.close();
    }
  });
});


