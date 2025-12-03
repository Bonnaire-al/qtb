const MaterielModel = require('../models/M-model');

class MaterielController {
  static async getAll(req, res) {
    try {
      const materiel = await MaterielModel.getAll();
      res.json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByCode(req, res) {
    try {
      const { code } = req.params;
      const materiel = await MaterielModel.getByCode(code);
      if (!materiel) {
        return res.status(404).json({ error: 'Matériel non trouvé' });
      }
      res.json(materiel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getManyByCodes(req, res) {
    try {
      const { codes } = req.body;
      if (!Array.isArray(codes) || codes.length === 0) {
        return res.json([]);
      }
      const materiels = await MaterielModel.getManyByCodes(codes);
      res.json(materiels);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const materiel = await MaterielModel.create(req.body);
      res.status(201).json(materiel);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const materiel = await MaterielModel.update(id, req.body);
      res.json(materiel);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await MaterielModel.delete(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MaterielController;
