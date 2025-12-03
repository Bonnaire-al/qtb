const db = require('../config/database');

class MaterielModel {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT id, code, designation, qte_dynamique, prix_ht, couleur FROM materiel ORDER BY couleur, code',
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  static getByCode(code) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, code, designation, qte_dynamique, prix_ht, couleur FROM materiel WHERE code = ?',
        [code],
        (err, row) => {
          if (err) reject(err);
          else resolve(row || null);
        }
      );
    });
  }

  static getManyByCodes(codes = []) {
    return new Promise((resolve, reject) => {
      if (!codes || codes.length === 0) {
        return resolve([]);
      }

      const placeholders = codes.map(() => '?').join(',');
      // Vérifier si la colonne type_produit existe, sinon utiliser une valeur par défaut
      db.all(
        `SELECT id, code, designation, qte_dynamique, prix_ht, couleur
         FROM materiel
         WHERE code IN (${placeholders})
         ORDER BY couleur, code`,
        codes,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Ajouter type_produit basé sur le code (si commence par 'fou' = fourniture)
            const rowsWithType = (rows || []).map(row => {
              const code = row.code || '';
              return {
                ...row,
                type_produit: code.toLowerCase().startsWith('fou') ? 'fourniture' : 'materiel'
              };
            });
            resolve(rowsWithType);
          }
        }
      );
    });
  }

  static async create(data) {
    const { code, designation, qte_dynamique, prix_ht, couleur } = data;

    const finalDesignation = (designation || '').trim();
    if (!finalDesignation) {
      throw new Error('La désignation du matériel est obligatoire.');
    }

    const finalCode = (code || '').trim() || (await this.generateCode(finalDesignation));
    const qteDynamiqueFlag = qte_dynamique ? 1 : 0;
    const prix = typeof prix_ht === 'number' ? prix_ht : Number(prix_ht) || 0;
    
    // Validation de la couleur
    const validColors = ['gris', 'vert', 'orange', 'rouge', 'violet', 'bleu_fonce', 'bleu_moyen', 'bleu_clair', 'bleu_marine'];
    const finalCouleur = couleur && validColors.includes(couleur) ? couleur : 'gris';

    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO materiel (code, designation, qte_dynamique, prix_ht, couleur, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
        [finalCode, finalDesignation, qteDynamiqueFlag, prix, finalCouleur],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return reject(new Error(`Le code ${finalCode} existe déjà.`));
            }
            return reject(err);
          }

          db.get(
            'SELECT id, code, designation, qte_dynamique, prix_ht, couleur FROM materiel WHERE id = ?',
            [this.lastID],
            (selectErr, row) => {
              if (selectErr) reject(selectErr);
              else resolve(row);
            }
          );
        }
      );
    });
  }

  static update(id, data) {
    const updates = [];
    const values = [];

    if (data.code !== undefined) {
      updates.push('code = ?');
      values.push(data.code.trim());
    }
    if (data.designation !== undefined) {
      const designation = data.designation.trim();
      if (!designation) {
        return Promise.reject(new Error('La désignation du matériel est obligatoire.'));
      }
      updates.push('designation = ?');
      values.push(designation);
    }
    if (data.qte_dynamique !== undefined) {
      updates.push('qte_dynamique = ?');
      values.push(data.qte_dynamique ? 1 : 0);
    }
    if (data.prix_ht !== undefined) {
      const prix = typeof data.prix_ht === 'number' ? data.prix_ht : Number(data.prix_ht) || 0;
      updates.push('prix_ht = ?');
      values.push(prix);
    }
    if (data.couleur !== undefined) {
      // Validation de la couleur
      const validColors = ['gris', 'vert', 'orange', 'rouge', 'violet', 'bleu_fonce', 'bleu_moyen', 'bleu_clair', 'bleu_marine'];
      const couleur = validColors.includes(data.couleur) ? data.couleur : 'gris';
      updates.push('couleur = ?');
      values.push(couleur);
    }

    if (updates.length === 0) {
      return Promise.reject(new Error('Aucune modification à appliquer.'));
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    values.push(id);

    return new Promise((resolve, reject) => {
      const query = `UPDATE materiel SET ${updates.join(', ')} WHERE id = ?`;
      db.run(query, values, function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed') && data.code) {
            return reject(new Error(`Le code ${data.code} existe déjà.`));
          }
          return reject(err);
        }

        db.get(
          'SELECT id, code, designation, qte_dynamique, prix_ht, couleur FROM materiel WHERE id = ?',
          [id],
          (selectErr, row) => {
            if (selectErr) reject(selectErr);
            else resolve(row);
          }
        );
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM materiel WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }

  static generateCode(baseDesignation) {
    return new Promise((resolve, reject) => {
      const prefix = baseDesignation
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '')
        .toUpperCase()
        .slice(0, 3)
        .padEnd(3, 'M');

      db.get('SELECT MAX(id) as maxId FROM materiel', [], (err, row) => {
        if (err) return reject(err);
        const next = (row?.maxId || 0) + 1;
        resolve(`${prefix}${String(next).padStart(4, '0')}`);
      });
    });
  }
}

module.exports = MaterielModel;
