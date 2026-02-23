const db = require('../config/database');

class RapidConfigModel {
  static getConfig() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, coef_classic, coef_premium, coef_luxe, updated_at FROM rapid_config WHERE id = 1`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(
            row || {
              id: 1,
              coef_classic: 1.0,
              coef_premium: 1.0,
              coef_luxe: 1.0,
              updated_at: null
            }
          );
        }
      );
    });
  }

  static updateConfig({ coef_classic, coef_premium, coef_luxe }) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE rapid_config
        SET coef_classic = ?, coef_premium = ?, coef_luxe = ?, updated_at = datetime('now')
        WHERE id = 1
        `,
        [coef_classic, coef_premium, coef_luxe],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes });
        }
      );
    });
  }

  static getPacks() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, pack_type, gamme, enabled FROM rapid_pack ORDER BY pack_type, gamme`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  static getPackItems(packId) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT rpp.id, rpp.prestation_code, rpp.quantity, p.service_label
        FROM rapid_pack_prestation rpp
        LEFT JOIN prestations p ON p.code = rpp.prestation_code
        WHERE rpp.pack_id = ?
        ORDER BY p.service_label
        `,
        [packId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  static async getPacksWithItems() {
    const packs = await this.getPacks();
    const withItems = [];
    for (const pack of packs) {
      const items = await this.getPackItems(pack.id);
      withItems.push({ ...pack, items });
    }
    return withItems;
  }

  static addPackItem(packId, prestation_code, quantity = 1) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO rapid_pack_prestation (pack_id, prestation_code, quantity)
        VALUES (?, ?, ?)
        `,
        [packId, prestation_code, quantity],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  static updatePackItem(itemId, quantity) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE rapid_pack_prestation SET quantity = ? WHERE id = ?`,
        [quantity, itemId],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes });
        }
      );
    });
  }

  static deletePackItem(itemId) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM rapid_pack_prestation WHERE id = ?`, [itemId], function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      });
    });
  }
}

module.exports = RapidConfigModel;

