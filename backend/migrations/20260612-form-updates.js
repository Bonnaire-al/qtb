const db = require('../config/database');

const EXCLUDED_SERVICE_VALUES = ['interrupteurs', 'interrupteur_double'];

/**
 * Retire les prestations interrupteur du catalogue et nettoie les anciens types d'installation obsolètes.
 */
async function migrateFormUpdates20260612() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(
        `DELETE FROM prestations WHERE service_value IN (${EXCLUDED_SERVICE_VALUES.map(() => '?').join(',')})`,
        EXCLUDED_SERVICE_VALUES,
        (err) => {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }

          db.run(
            "UPDATE materiel SET couleur = 'bleu_fonce' WHERE couleur = 'bleu_clair'",
            [],
            (errMateriel) => {
              if (errMateriel) {
                db.run('ROLLBACK');
                return reject(errMateriel);
              }

              db.all('SELECT id, types_installation FROM liaisons', [], (err2, rows) => {
                if (err2) {
                  db.run('ROLLBACK');
                  return reject(err2);
                }

                const updates = (rows || []).map((row) => {
                  let types = [];
                  try {
                    types = JSON.parse(row.types_installation || '[]');
                  } catch {
                    types = [];
                  }
                  const mapped = [...new Set(
                    types
                      .map((t) => (t === 'cloison_creuse' ? 'saignee_encastre' : t))
                      .filter((t) => t !== 'cloison_creuse')
                  )];
                  return { id: row.id, types: mapped.length ? mapped : ['saignee_encastre'] };
                });

                let pending = updates.length;
                if (pending === 0) {
                  db.run('COMMIT', (e) => (e ? reject(e) : resolve()));
                  return;
                }

                updates.forEach(({ id, types }) => {
                  db.run(
                    'UPDATE liaisons SET types_installation = ? WHERE id = ?',
                    [JSON.stringify(types), id],
                    (err3) => {
                      if (err3) {
                        db.run('ROLLBACK');
                        return reject(err3);
                      }
                      pending -= 1;
                      if (pending === 0) {
                        db.run('COMMIT', (e) => (e ? reject(e) : resolve()));
                      }
                    }
                  );
                });
              });
            }
          );
        }
      );
    });
  });
}

module.exports = migrateFormUpdates20260612;
