const LiaisonModel = require('../models/Liaison-model');

class LiaisonController {
  static async getAll(req, res) {
    try {
      const liaisons = await LiaisonModel.getAll();
      res.json(liaisons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByCode(req, res) {
    try {
      const { code } = req.params;
      const liaison = await LiaisonModel.getByCode(code);
      if (!liaison) {
        return res.status(404).json({ error: 'Liaison non trouvée' });
      }
      res.json(liaison);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByPrestationAndType(req, res) {
    try {
      const { prestationCode, typeInstallation } = req.params;
      const liaisons = await LiaisonModel.getByPrestationAndType(
        prestationCode,
        typeInstallation
      );
      res.json(liaisons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const liaison = await LiaisonModel.create(req.body);
      res.status(201).json(liaison);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const liaison = await LiaisonModel.update(Number(id), req.body);
      res.json(liaison);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await LiaisonModel.delete(Number(id));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LiaisonController;



