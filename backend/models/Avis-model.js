const db = require('../config/database');

class AvisModel {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, author_name, comment, stars, google_account, created_at FROM avis ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT id, author_name, comment, stars, google_account, created_at FROM avis WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }

  static create({ author_name, comment, stars, google_account }) {
    return new Promise((resolve, reject) => {
      const starsVal = Math.min(5, Math.max(1, parseInt(stars, 10) || 1));
      db.run(
        `INSERT INTO avis (author_name, comment, stars, google_account) VALUES (?, ?, ?, ?)`,
        [author_name.trim(), comment.trim(), starsVal, (google_account && String(google_account).trim()) || null],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  static update(id, { author_name, comment, stars, google_account }) {
    return new Promise((resolve, reject) => {
      const starVal = stars != null ? Math.min(5, Math.max(1, parseInt(stars, 10) || 1)) : 1;
      const google = (google_account != null && String(google_account).trim() !== '') ? String(google_account).trim() : null;
      db.run(
        `UPDATE avis SET author_name = ?, comment = ?, stars = ?, google_account = ? WHERE id = ?`,
        [(author_name != null && author_name !== '') ? author_name.trim() : 'Anonyme', (comment != null && comment !== '') ? comment.trim() : '', starVal, google, id],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM avis WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      });
    });
  }
}

module.exports = AvisModel;
