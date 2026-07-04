const db = require('../config/database');
const { SPECIAL_INTERRUPTEUR_ECLAIRAGE } = require('./specialPrestation');

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => (err ? reject(err) : resolve()));
  });
}

function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row || null)));
  });
}

async function ensureColumn(name, definition) {
  await runSql(`ALTER TABLE prestations ADD COLUMN ${name} ${definition}`).catch((err) => {
    if (!/duplicate column name/i.test(err.message)) throw err;
  });
}

/**
 * Garantit le schéma minimal + la prestation PINT001 (idempotent).
 */
async function ensureSpecialInterrupteurPrestation() {
  await runSql(`
    CREATE TABLE IF NOT EXISTS prestations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categorie TEXT NOT NULL,
      piece TEXT,
      service_value TEXT NOT NULL,
      service_label TEXT NOT NULL
    )
  `);

  await ensureColumn('code', 'TEXT');
  await ensureColumn('prix_ht', 'REAL DEFAULT 0');
  await ensureColumn('is_special', 'INTEGER DEFAULT 0');
  await ensureColumn('wizard_category', 'TEXT');

  const existing = await getRow(
    'SELECT id FROM prestations WHERE code = ? OR service_value = ?',
    [SPECIAL_INTERRUPTEUR_ECLAIRAGE.code, SPECIAL_INTERRUPTEUR_ECLAIRAGE.service_value]
  );

  if (existing) {
    await runSql(
      `UPDATE prestations SET
        code = ?,
        categorie = ?,
        piece = ?,
        service_value = ?,
        service_label = ?,
        is_special = 1,
        wizard_category = 'eclairage'
      WHERE id = ?`,
      [
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.code,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.categorie,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.piece,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.service_value,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.service_label,
        existing.id
      ]
    );
  } else {
    await runSql(
      `INSERT INTO prestations (code, categorie, piece, service_value, service_label, prix_ht, is_special, wizard_category)
       VALUES (?, ?, ?, ?, ?, ?, 1, 'eclairage')`,
      [
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.code,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.categorie,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.piece,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.service_value,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.service_label,
        SPECIAL_INTERRUPTEUR_ECLAIRAGE.default_prix_ht
      ]
    );
  }

  const row = await getRow('SELECT * FROM prestations WHERE code = ?', [SPECIAL_INTERRUPTEUR_ECLAIRAGE.code]);
  if (!row) {
    throw new Error('Impossible de créer la prestation spéciale PINT001');
  }
  return row;
}

module.exports = { ensureSpecialInterrupteurPrestation };
