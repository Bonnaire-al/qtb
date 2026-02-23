const AvisModel = require('../models/Avis-model');

class AvisController {
  static async getList(req, res) {
    try {
      const list = await AvisModel.getAll();
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOne(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const avis = await AvisModel.getById(id);
      if (!avis) return res.status(404).json({ error: 'Avis introuvable' });
      res.json(avis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /** Regex : email valide (format uniquement, pas de vérification d'existence) */
  static _isValidEmail(str) {
    if (!str || typeof str !== 'string') return false;
    const trimmed = str.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254;
  }

  static async create(req, res) {
    try {
      const { author_name, comment, stars, google_account } = req.body || {};
      if (!author_name || !String(author_name).trim()) {
        return res.status(400).json({ error: 'Le nom est requis' });
      }
      if (!comment || !String(comment).trim()) {
        return res.status(400).json({ error: 'Le commentaire est requis' });
      }
      if (!google_account || !String(google_account).trim()) {
        return res.status(400).json({ error: 'L\'email (compte Google) est requis' });
      }
      const emailTrimmed = String(google_account).trim();
      if (!AvisController._isValidEmail(emailTrimmed)) {
        return res.status(400).json({ error: 'Veuillez entrer une adresse email valide.' });
      }
      const result = await AvisModel.create({
        author_name: String(author_name).trim(),
        comment: String(comment).trim(),
        stars: stars != null ? Math.min(5, Math.max(1, parseInt(stars, 10) || 1)) : 5,
        google_account: emailTrimmed
      });
      const avis = await AvisModel.getById(result.id);
      res.status(201).json(avis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { author_name, comment, stars, google_account } = req.body || {};
      if (google_account != null && String(google_account).trim() !== '' && !AvisController._isValidEmail(String(google_account).trim())) {
        return res.status(400).json({ error: 'Veuillez entrer une adresse email valide.' });
      }
      await AvisModel.update(id, { author_name, comment, stars, google_account });
      const avis = await AvisModel.getById(id);
      res.json(avis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      await AvisModel.delete(id);
      res.json({ success: true, deleted: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AvisController;
