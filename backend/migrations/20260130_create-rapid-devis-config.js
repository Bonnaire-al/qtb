const db = require('../config/database');

/**
 * Migration : Ajouter la configuration "Devis rapide"
 * - rapid_config : coefficients Classic/Premium/Luxe
 * - rapid_pack : 6 packs (piece/cuisine × classic/premium/luxe)
 * - rapid_pack_prestation : composition des packs (référence vers prestations existantes)
 */
async function createRapidDevisConfig() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('🔄 Migration : Création tables Devis rapide');

      db.run(
        `
        CREATE TABLE IF NOT EXISTS rapid_config (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          coef_classic REAL NOT NULL DEFAULT 1.0,
          coef_premium REAL NOT NULL DEFAULT 1.0,
          coef_luxe REAL NOT NULL DEFAULT 1.0,
          updated_at TEXT
        )
        `,
        (err) => {
          if (err) return reject(err);

          db.run(
            `
            INSERT OR IGNORE INTO rapid_config (id, coef_classic, coef_premium, coef_luxe, updated_at)
            VALUES (1, 1.0, 1.0, 1.0, datetime('now'))
            `,
            (err2) => {
              if (err2) return reject(err2);

              db.run(
                `
                CREATE TABLE IF NOT EXISTS rapid_pack (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  pack_type TEXT NOT NULL, -- 'piece' | 'cuisine'
                  gamme TEXT NOT NULL,     -- 'classic' | 'premium' | 'luxe'
                  enabled INTEGER NOT NULL DEFAULT 1,
                  UNIQUE(pack_type, gamme)
                )
                `,
                (err3) => {
                  if (err3) return reject(err3);

                  db.run(
                    `
                    CREATE TABLE IF NOT EXISTS rapid_pack_prestation (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      pack_id INTEGER NOT NULL,
                      prestation_code TEXT NOT NULL,
                      quantity INTEGER NOT NULL DEFAULT 1,
                      FOREIGN KEY (pack_id) REFERENCES rapid_pack(id) ON DELETE CASCADE,
                      FOREIGN KEY (prestation_code) REFERENCES prestations(code) ON DELETE CASCADE,
                      UNIQUE(pack_id, prestation_code)
                    )
                    `,
                    (err4) => {
                      if (err4) return reject(err4);

                      // Seed 6 packs (idempotent)
                      const seeds = [
                        ['piece', 'classic'],
                        ['piece', 'premium'],
                        ['piece', 'luxe'],
                        ['cuisine', 'classic'],
                        ['cuisine', 'premium'],
                        ['cuisine', 'luxe']
                      ];

                      let idx = 0;
                      const insertNext = () => {
                        if (idx >= seeds.length) {
                          console.log('✅ Migration Devis rapide terminée');
                          return resolve();
                        }
                        const [pack_type, gamme] = seeds[idx++];
                        db.run(
                          `INSERT OR IGNORE INTO rapid_pack (pack_type, gamme, enabled) VALUES (?, ?, 1)`,
                          [pack_type, gamme],
                          (err5) => {
                            if (err5) return reject(err5);
                            insertNext();
                          }
                        );
                      };

                      insertNext();
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
}

if (require.main === module) {
  createRapidDevisConfig()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Erreur migration Devis rapide:', err);
      process.exit(1);
    });
}

module.exports = createRapidDevisConfig;

