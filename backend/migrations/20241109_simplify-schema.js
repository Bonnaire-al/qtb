const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.db');

const db = new sqlite3.Database(dbPath);

function run(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function all(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function tableExists(tableName) {
  const rows = await all(
    "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
    [tableName]
  );
  return rows.length > 0;
}

function generateCode(base, index) {
  const sanitized = (base || 'MAT').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${sanitized.slice(0, 3).padEnd(3, 'M')}${String(index).padStart(4, '0')}`;
}

async function migrateMateriel() {
  const exists = await tableExists('materiel');
  if (!exists) {
    console.log('ℹ️  Table materiel absente, création directe du nouveau schéma.');
    await run(`
      CREATE TABLE IF NOT EXISTS materiel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        designation TEXT NOT NULL,
        qte_dynamique INTEGER NOT NULL DEFAULT 1,
        prix_ht REAL NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    return;
  }

  const columns = await all(`PRAGMA table_info(materiel)`);
  const columnNames = columns.map(col => col.name);

  const rows = await all('SELECT * FROM materiel');

  const alreadySimple =
    columnNames.includes('designation') &&
    columnNames.includes('code') &&
    !columnNames.includes('service_value') &&
    !columnNames.includes('type_pose') &&
    !columnNames.includes('type_produit');

  if (alreadySimple && columnNames.includes('qte_dynamique') && columnNames.includes('prix_ht') && rows.length === 0) {
    console.log('ℹ️  Table materiel déjà dans le nouveau format (aucune donnée). Migration non nécessaire.');
    return;
  }

  await run('ALTER TABLE materiel RENAME TO materiel_old');

  await run(`
    CREATE TABLE materiel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      designation TEXT NOT NULL,
      qte_dynamique INTEGER NOT NULL DEFAULT 1,
      prix_ht REAL NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  let index = 1;
  for (const row of rows) {
    let code = row.code;
    if (!code || !code.trim) {
      code = null;
    }

    const designationSource =
      row.designation ??
      (columnNames.includes('nom') ? row.nom : null) ??
      (columnNames.includes('label') ? row.label : null);

    const designation = designationSource && designationSource.trim
      ? designationSource.trim()
      : `Matériel ${index}`;

    const qteValue = columnNames.includes('qte_dynamique') ? row.qte_dynamique : row.qte || 0;
    const qteDynamique = qteValue === true || qteValue === 1 || qteValue === '1';

    const prixValue = columnNames.includes('prix_ht')
      ? row.prix_ht
      : (columnNames.includes('prix') ? row.prix : 0);
    const prix = typeof prixValue === 'number' ? prixValue : Number(prixValue) || 0;

    if (!code) {
      code = generateCode(designation, index);
    }

    try {
      await run(
        `
        INSERT OR IGNORE INTO materiel (code, designation, qte_dynamique, prix_ht)
        VALUES (?, ?, ?, ?)
      `,
        [code.trim(), designation, qteDynamique ? 1 : 0, prix]
      );
    } catch (err) {
      console.error(`❌ Échec insertion matériel ${code}:`, err.message);
    }
    index += 1;
  }

  await run('DROP TABLE IF EXISTS materiel_old');
  console.log(`✅ Table materiel migrée (${rows.length} entrées traitées)`);
}

async function migrateLiaisons() {
  const pmcExists = await tableExists('prestation_materiel_config');
  const liaisonExists = await tableExists('liaisons');

  if (liaisonExists) {
    console.log('ℹ️  Table liaisons déjà présente, aucune migration nécessaire.');
    if (pmcExists) {
      await run('DROP TABLE IF EXISTS prestation_materiel_config');
    }
    return;
  }

  await run(`
    CREATE TABLE IF NOT EXISTS liaisons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      prestation_code TEXT NOT NULL,
      types_installation TEXT NOT NULL,
      materiel_codes TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  if (!pmcExists) {
    console.log('ℹ️  Table prestation_materiel_config absente, aucune donnée à migrer.');
    return;
  }

  const rows = await all(`
    SELECT code, prestation_code, materiel_code, type_installation
    FROM prestation_materiel_config
    ORDER BY code
  `);

  const grouped = new Map();

  for (const row of rows) {
    const key = row.code || `${row.prestation_code}_${row.type_installation}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        code: row.code || null,
        prestation_code: row.prestation_code,
        types: new Set(),
        materiels: new Set()
      });
    }

    const entry = grouped.get(key);
    if (row.type_installation) {
      entry.types.add(row.type_installation);
    }
    if (row.materiel_code) {
      entry.materiels.add(row.materiel_code);
    }
    if (!entry.code && row.code) {
      entry.code = row.code;
    }
  }

  let index = 1;
  for (const entry of grouped.values()) {
    const code =
      entry.code && entry.code.trim()
        ? entry.code.trim()
        : `LIA${String(index).padStart(4, '0')}`;
    const types = JSON.stringify(Array.from(entry.types));
    const materiels = JSON.stringify(Array.from(entry.materiels));

    try {
      await run(
        `
        INSERT OR IGNORE INTO liaisons (code, prestation_code, types_installation, materiel_codes)
        VALUES (?, ?, ?, ?)
      `,
        [code, entry.prestation_code, types, materiels]
      );
    } catch (err) {
      console.error(`❌ Échec insertion liaison ${code}:`, err.message);
    }
    index += 1;
  }

  await run('DROP TABLE IF EXISTS prestation_materiel_config');
  console.log(`✅ Table liaisons migrée (${grouped.size} liaisons créées)`);
}

async function main() {
  try {
    await run('BEGIN TRANSACTION');
    await migrateMateriel();
    await migrateLiaisons();
    await run('COMMIT');
    console.log('✅ Migration simplifiée terminée');
  } catch (error) {
    console.error('❌ Erreur durant la migration:', error.message);
    await run('ROLLBACK');
  } finally {
    db.close();
  }
}

main();

