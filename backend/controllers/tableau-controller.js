const TableauCalcul = require('../utils/tableauCalcul');
const TableauConfigModel = require('../models/TableauConfig-model');

class TableauController {
  /**
   * GET /api/tableau/config — Tarif main d'œuvre par rangée (public)
   */
  static async getConfig(req, res) {
    try {
      const row = await TableauConfigModel.getConfig();
      const main_oeuvre_par_rangee = await TableauConfigModel.getMainOeuvreParRangee();
      res.json({
        main_oeuvre_par_rangee,
        updated_at: row.updated_at || null
      });
    } catch (error) {
      console.error('❌ Erreur config tableau:', error);
      res.status(500).json({ error: 'Erreur lors de la lecture de la configuration tableau' });
    }
  }

  /**
   * PUT /api/tableau/config — Admin
   */
  static async updateConfig(req, res) {
    try {
      const { main_oeuvre_par_rangee } = req.body || {};
      await TableauConfigModel.updateConfig({ main_oeuvre_par_rangee });
      const row = await TableauConfigModel.getConfig();
      res.json({
        success: true,
        main_oeuvre_par_rangee: await TableauConfigModel.getMainOeuvreParRangee(),
        updated_at: row.updated_at
      });
    } catch (error) {
      console.error('❌ Erreur mise à jour config tableau:', error);
      res.status(400).json({
        error: error.message || 'Erreur lors de la mise à jour de la configuration tableau'
      });
    }
  }

  /**
   * POST /api/tableau/calculate
   */
  static async calculateTableau(req, res) {
    try {
      const { devisItems, tableauData } = req.body;

      if (!devisItems) {
        return res.status(400).json({
          error: 'devisItems est requis'
        });
      }

      if (!tableauData) {
        return res.status(400).json({
          error: 'tableauData est requis'
        });
      }

      const mainOeuvreParRangee = await TableauConfigModel.getMainOeuvreParRangee();
      const result = TableauCalcul.calculateTableauMateriels(devisItems, tableauData, {
        mainOeuvreParRangee
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('❌ Erreur calcul tableau:', error);
      res.status(500).json({
        error: 'Erreur lors du calcul du tableau',
        details: error.message
      });
    }
  }
}

module.exports = TableauController;
