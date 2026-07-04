const db = require('../config/database');

/**
 * Aligne main_oeuvre_pose_par_rangee sur main_oeuvre_par_rangee si les colonnes divergent
 * (ex. sauvegarde via l'ancien champ unique).
 */
async function migrateTableauMoSync20260614() {
  const runSql = (sql) =>
    new Promise((resolve, reject) => {
      db.run(sql, [], (err) => (err ? reject(err) : resolve()));
    });

  await runSql(`
    UPDATE tableau_config
    SET main_oeuvre_pose_par_rangee = main_oeuvre_par_rangee
    WHERE id = 1
      AND main_oeuvre_par_rangee IS NOT NULL
      AND main_oeuvre_par_rangee > 0
      AND ABS(COALESCE(main_oeuvre_pose_par_rangee, 0) - main_oeuvre_par_rangee) > 0.001
  `);
}

module.exports = migrateTableauMoSync20260614;
