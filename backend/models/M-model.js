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

    // Bloquer la création de matériels violets (tableau électrique)
    // Ces matériels sont gérés automatiquement par le système
    if (couleur === 'violet') {
      throw new Error('Les matériels du tableau électrique (couleur violette) ne peuvent pas être créés manuellement. Ils sont générés automatiquement par le système.');
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
    return new Promise((resolve, reject) => {
      // D'abord, récupérer le matériel pour vérifier sa couleur
      db.get(
        'SELECT couleur FROM materiel WHERE id = ?',
        [id],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return reject(new Error('Matériel non trouvé'));

          // Si le matériel est violet (tableau électrique), on ne peut modifier que le prix
          if (row.couleur === 'violet') {
            // Vérifier si on essaie de modifier autre chose que le prix
            const modificationsNonAutorisees = [];
            if (data.code !== undefined && data.code !== row.code) {
              modificationsNonAutorisees.push('code');
            }
            if (data.designation !== undefined) {
              modificationsNonAutorisees.push('designation');
            }
            if (data.qte_dynamique !== undefined) {
              modificationsNonAutorisees.push('qte_dynamique');
            }
            if (data.couleur !== undefined && data.couleur !== 'violet') {
              modificationsNonAutorisees.push('couleur');
            }

            if (modificationsNonAutorisees.length > 0) {
              return reject(new Error(
                `Ce matériel (tableau électrique) ne peut pas être modifié. Seul le prix peut être modifié. Tentative de modification: ${modificationsNonAutorisees.join(', ')}`
              ));
            }

            // Si on modifie seulement le prix, c'est autorisé
            if (data.prix_ht === undefined) {
              return reject(new Error('Aucune modification autorisée pour ce matériel (sauf le prix).'));
            }
          }

          // Continuer avec la mise à jour normale
          const updates = [];
          const values = [];

          if (data.code !== undefined) {
            updates.push('code = ?');
            values.push(data.code.trim());
          }
          if (data.designation !== undefined) {
            const designation = data.designation.trim();
            if (!designation) {
              return reject(new Error('La désignation du matériel est obligatoire.'));
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
            return reject(new Error('Aucune modification à appliquer.'));
          }

          updates.push('updated_at = CURRENT_TIMESTAMP');
          values.push(id);

          const query = `UPDATE materiel SET ${updates.join(', ')} WHERE id = ?`;
          db.run(query, values, function (updateErr) {
            if (updateErr) {
              if (updateErr.message.includes('UNIQUE constraint failed') && data.code) {
                return reject(new Error(`Le code ${data.code} existe déjà.`));
              }
              return reject(updateErr);
            }

            db.get(
              'SELECT id, code, designation, qte_dynamique, prix_ht, couleur FROM materiel WHERE id = ?',
              [id],
              (selectErr, updatedRow) => {
                if (selectErr) reject(selectErr);
                else resolve(updatedRow);
              }
            );
          });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      // Vérifier d'abord si le matériel est violet (tableau électrique)
      db.get(
        'SELECT couleur FROM materiel WHERE id = ?',
        [id],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return reject(new Error('Matériel non trouvé'));

          // Bloquer la suppression si le matériel est violet
          if (row.couleur === 'violet') {
            return reject(new Error('Ce matériel (tableau électrique) ne peut pas être supprimé.'));
          }

          // Sinon, procéder à la suppression
          db.run('DELETE FROM materiel WHERE id = ?', [id], function (deleteErr) {
            if (deleteErr) reject(deleteErr);
            else resolve({ deleted: this.changes });
          });
        }
      );
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
