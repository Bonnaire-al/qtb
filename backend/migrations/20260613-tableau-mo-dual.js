const db = require('../config/database');

/**
 * Ajoute les tarifs main d'œuvre pose (200 €) et changement (360 €) par rangée.
 */
async function migrateTableauMoDual20260613() {
  const columnExists = (name) =>
    new Promise((resolve, reject) => {
      db.all('PRAGMA table_info(tableau_config)', [], (err, cols) => {
        if (err) return reject(err);
        resolve((cols || []).some((c) => c.name === name));
      });
    });

  const runSql = (sql) =>
    new Promise((resolve, reject) => {
      db.run(sql, [], (err) => (err ? reject(err) : resolve()));
    });

  const hasPose = await columnExists('main_oeuvre_pose_par_rangee');
  const hasChangement = await columnExists('main_oeuvre_changement_par_rangee');

  if (!hasPose) {
    await runSql(
      'ALTER TABLE tableau_config ADD COLUMN main_oeuvre_pose_par_rangee REAL NOT NULL DEFAULT 200'
    );
  }
  if (!hasChangement) {
    await runSql(
      'ALTER TABLE tableau_config ADD COLUMN main_oeuvre_changement_par_rangee REAL NOT NULL DEFAULT 360'
    );
  }

  // Sync initial uniquement à l'ajout des colonnes (ne pas écraser les valeurs admin à chaque démarrage)
  if (!hasPose || !hasChangement) {
    await runSql(`
      UPDATE tableau_config
      SET
        main_oeuvre_pose_par_rangee = COALESCE(main_oeuvre_par_rangee, main_oeuvre_pose_par_rangee, 200),
        main_oeuvre_changement_par_rangee = COALESCE(main_oeuvre_changement_par_rangee, 360),
        updated_at = COALESCE(updated_at, datetime('now'))
      WHERE id = 1
    `);
  }
}

module.exports = migrateTableauMoDual20260613;
