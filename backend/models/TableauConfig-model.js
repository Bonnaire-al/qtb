const db = require('../config/database');

const DEFAULT_MO = 260;

class TableauConfigModel {
  static getConfig() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, main_oeuvre_par_rangee, updated_at FROM tableau_config WHERE id = 1`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(
            row || {
              id: 1,
              main_oeuvre_par_rangee: DEFAULT_MO,
              updated_at: null
            }
          );
        }
      );
    });
  }

  static async getMainOeuvreParRangee() {
    const row = await this.getConfig();
    const v = Number(row.main_oeuvre_par_rangee);
    return Number.isFinite(v) && v > 0 ? v : DEFAULT_MO;
  }

  static updateConfig({ main_oeuvre_par_rangee }) {
    return new Promise((resolve, reject) => {
      const v = Number(main_oeuvre_par_rangee);
      if (!Number.isFinite(v) || v <= 0) {
        return reject(new Error('main_oeuvre_par_rangee doit être un nombre strictement positif'));
      }
      db.run(
        `
        UPDATE tableau_config
        SET main_oeuvre_par_rangee = ?, updated_at = datetime('now')
        WHERE id = 1
        `,
        [v],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes });
        }
      );
    });
  }
}

module.exports = TableauConfigModel;
