const db = require('../config/database');

class LiaisonModel {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, code, prestation_code, types_installation, materiel_codes
         FROM liaisons
         ORDER BY code`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve((rows || []).map(this.hydrateLists));
        }
      );
    });
  }

  static getByCode(code) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, code, prestation_code, types_installation, materiel_codes
         FROM liaisons
         WHERE code = ?`,
        [code],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? this.hydrateLists(row) : null);
        }
      );
    });
  }

  static getByPrestationAndType(prestationCode, typeInstallation) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, code, prestation_code, types_installation, materiel_codes
         FROM liaisons
         WHERE prestation_code = ?`,
        [prestationCode],
        (err, rows) => {
          if (err) return reject(err);
          const typeLower = (typeInstallation || '').toLowerCase();
          const matches = (rows || [])
            .map(this.hydrateLists)
            .filter(liaison => (liaison.types_installation || []).some(t => (t || '').toLowerCase() === typeLower));
          resolve(matches);
        }
      );
    });
  }

  /** Toutes les liaisons pour une prestation (pour fallback si aucun type ne matche) */
  static getByPrestation(prestationCode) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, code, prestation_code, types_installation, materiel_codes
         FROM liaisons
         WHERE prestation_code = ?`,
        [prestationCode],
        (err, rows) => {
          if (err) return reject(err);
          resolve((rows || []).map(this.hydrateLists));
        }
      );
    });
  }

  static async create(data) {
    const { code, prestation_code, types_installation, materiel_codes } = this.normalizePayload(data);

    if (!prestation_code) {
      throw new Error('Le code prestation est obligatoire.');
    }
    if (types_installation.length === 0) {
      throw new Error('Au moins un type d\'installation est requis.');
    }
    if (materiel_codes.length === 0) {
      throw new Error('Au moins un matériel doit être sélectionné.');
    }

    const finalCode = code || (await this.generateCode());

    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO liaisons (code, prestation_code, types_installation, materiel_codes, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
        [
          finalCode,
          prestation_code,
          JSON.stringify(types_installation),
          JSON.stringify(materiel_codes)
        ],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return reject(new Error(`Le code liaison ${finalCode} existe déjà.`));
            }
            return reject(err);
          }

          LiaisonModel.getById(this.lastID)
            .then(resolve)
            .catch(reject);
        }
      );
    });
  }

  static update(id, data) {
    const { code, prestation_code, types_installation, materiel_codes } = this.normalizePayload(data);

    const updates = [];
    const values = [];

    if (code !== undefined) {
      updates.push('code = ?');
      values.push(code);
    }
    if (prestation_code !== undefined) {
      updates.push('prestation_code = ?');
      values.push(prestation_code);
    }
    if (types_installation !== undefined) {
      if (!types_installation || types_installation.length === 0) {
        return Promise.reject(new Error('Au moins un type d\'installation est requis.'));
      }
      updates.push('types_installation = ?');
      values.push(JSON.stringify(types_installation));
    }
    if (materiel_codes !== undefined) {
      if (!materiel_codes || materiel_codes.length === 0) {
        return Promise.reject(new Error('Au moins un matériel doit être sélectionné.'));
      }
      updates.push('materiel_codes = ?');
      values.push(JSON.stringify(materiel_codes));
    }

    if (updates.length === 0) {
      return Promise.reject(new Error('Aucune modification à appliquer.'));
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    return new Promise((resolve, reject) => {
      const query = `UPDATE liaisons SET ${updates.join(', ')} WHERE id = ?`;
      db.run(query, values, function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed') && code) {
            return reject(new Error(`Le code liaison ${code} est déjà utilisé.`));
          }
          return reject(err);
        }

        LiaisonModel.getById(id)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM liaisons WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, code, prestation_code, types_installation, materiel_codes
         FROM liaisons
         WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? this.hydrateLists(row) : null);
        }
      );
    });
  }

  static normalizePayload(data) {
    const payload = { ...data };

    if (payload.types_installation !== undefined) {
      payload.types_installation = Array.isArray(payload.types_installation)
        ? payload.types_installation
        : (payload.types_installation || '')
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
    }

    if (payload.materiel_codes !== undefined) {
      payload.materiel_codes = Array.isArray(payload.materiel_codes)
        ? payload.materiel_codes
        : (payload.materiel_codes || '')
            .split(',')
            .map(c => c.trim())
            .filter(Boolean);
    }

    return payload;
  }

  static hydrateLists(row) {
    return {
      ...row,
      types_installation: safeParse(row.types_installation),
      materiel_codes: safeParse(row.materiel_codes)
    };
  }

  static generateCode() {
    return new Promise((resolve, reject) => {
      // Chercher le dernier code de liaison
      db.all(
        `SELECT code FROM liaisons WHERE code LIKE 'LIA%' ORDER BY code DESC LIMIT 1`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          
          let nextNum = 1;
          if (rows && rows.length > 0) {
            // Extraire le numéro du dernier code
            const lastCode = rows[0].code;
            const match = lastCode.match(/\d+$/);
            if (match) {
              nextNum = parseInt(match[0], 10) + 1;
            }
          }
          
          const code = `LIA${String(nextNum).padStart(3, '0')}`;
          
          // Vérifier que le code n'existe pas déjà (sécurité)
          db.get('SELECT id FROM liaisons WHERE code = ?', [code], (checkErr, existing) => {
            if (checkErr) return reject(checkErr);
            if (existing) {
              // Si existe, incrémenter
              resolve(`LIA${String(nextNum + 1).padStart(3, '0')}`);
            } else {
              resolve(code);
            }
          });
        }
      );
    });
  }
}

function safeParse(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

module.exports = LiaisonModel;



