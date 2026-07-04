const db = require('../config/database');
const { inferWizardCategoryFromLabel } = require('../utils/wizardCategory');

/**
 * Ajoute wizard_category sur prestations et remplit les lignes existantes (repli libellé).
 */
async function migrateWizardCategory20260616() {
  const columnExists = () =>
    new Promise((resolve, reject) => {
      db.all('PRAGMA table_info(prestations)', [], (err, cols) => {
        if (err) return reject(err);
        resolve((cols || []).some((c) => c.name === 'wizard_category'));
      });
    });

  const runSql = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.run(sql, params, (err) => (err ? reject(err) : resolve()));
    });

  const getAll = () =>
    new Promise((resolve, reject) => {
      db.all('SELECT id, service_label, categorie, wizard_category FROM prestations', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

  if (!(await columnExists())) {
    await runSql('ALTER TABLE prestations ADD COLUMN wizard_category TEXT');
  }

  const rows = await getAll();
  for (const row of rows) {
    if (row.wizard_category) continue;
    const inferred = inferWizardCategoryFromLabel(row.service_label, row.categorie);
    await runSql('UPDATE prestations SET wizard_category = ? WHERE id = ?', [inferred, row.id]);
  }

  console.log('✅ Colonne wizard_category prête sur prestations');
}

module.exports = migrateWizardCategory20260616;
