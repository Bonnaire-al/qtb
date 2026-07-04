const db = require('../config/database');

const DEFAULT_POSE = 200;
const DEFAULT_CHANGEMENT = 360;

class TableauConfigModel {
  static parseRate(value, fallback) {
    const v = Number(value);
    return Number.isFinite(v) && v > 0 ? v : fallback;
  }

  static getConfig() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id,
                main_oeuvre_par_rangee,
                main_oeuvre_pose_par_rangee,
                main_oeuvre_changement_par_rangee,
                updated_at
         FROM tableau_config WHERE id = 1`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(
            row || {
              id: 1,
              main_oeuvre_par_rangee: DEFAULT_POSE,
              main_oeuvre_pose_par_rangee: DEFAULT_POSE,
              main_oeuvre_changement_par_rangee: DEFAULT_CHANGEMENT,
              updated_at: null
            }
          );
        }
      );
    });
  }

  static async getMainOeuvrePoseParRangee() {
    const row = await this.getConfig();
    return this.parseRate(row.main_oeuvre_pose_par_rangee, DEFAULT_POSE);
  }

  static async getMainOeuvreChangementParRangee() {
    const row = await this.getConfig();
    return this.parseRate(row.main_oeuvre_changement_par_rangee, DEFAULT_CHANGEMENT);
  }

  /** @deprecated Utiliser getMainOeuvrePoseParRangee ou getMainOeuvreChangementParRangee */
  static async getMainOeuvreParRangee() {
    return this.getMainOeuvrePoseParRangee();
  }

  static async getMainOeuvreRates() {
    const row = await this.getConfig();
    const pose = this.parseRate(
      row.main_oeuvre_pose_par_rangee ?? row.main_oeuvre_par_rangee,
      DEFAULT_POSE
    );
    const changement = this.parseRate(row.main_oeuvre_changement_par_rangee, DEFAULT_CHANGEMENT);
    return { pose, changement };
  }

  static updateConfig({
    main_oeuvre_pose_par_rangee,
    main_oeuvre_changement_par_rangee,
    main_oeuvre_par_rangee
  }) {
    return new Promise((resolve, reject) => {
      const pose = this.parseRate(
        main_oeuvre_pose_par_rangee ?? main_oeuvre_par_rangee,
        null
      );
      const changement = this.parseRate(main_oeuvre_changement_par_rangee, null);

      if (pose == null) {
        return reject(
          new Error(
            'main_oeuvre_pose_par_rangee (ou main_oeuvre_par_rangee) doit être un nombre strictement positif'
          )
        );
      }
      if (changement == null) {
        return reject(
          new Error('main_oeuvre_changement_par_rangee doit être un nombre strictement positif')
        );
      }

      db.run(
        `
        UPDATE tableau_config
        SET
          main_oeuvre_pose_par_rangee = ?,
          main_oeuvre_changement_par_rangee = ?,
          main_oeuvre_par_rangee = ?,
          updated_at = datetime('now')
        WHERE id = 1
        `,
        [pose, changement, pose],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes });
        }
      );
    });
  }
}

module.exports = TableauConfigModel;
