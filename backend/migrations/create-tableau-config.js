const db = require('../config/database');

/**
 * Table unique : tarif main d'œuvre par rangée pour le tableau électrique (€ HT).
 */
async function createTableauConfig() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
        CREATE TABLE IF NOT EXISTS tableau_config (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          main_oeuvre_par_rangee REAL NOT NULL DEFAULT 260,
          updated_at TEXT
        )
        `,
        (err) => {
          if (err) return reject(err);
          db.run(
            `
            INSERT OR IGNORE INTO tableau_config (id, main_oeuvre_par_rangee, updated_at)
            VALUES (1, 260, datetime('now'))
            `,
            (err2) => {
              if (err2) return reject(err2);
              resolve();
            }
          );
        }
      );
    });
  });
}

module.exports = createTableauConfig;
