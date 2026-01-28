const TableauCalcul = require('../utils/tableauCalcul');

class TableauController {
  /**
   * POST /api/tableau/calculate - Calculer les matériels du tableau électrique
   * @param {Object} req.body - { devisItems: Array, tableauData: Object }
   * @returns {Object} { materiels: Array, mainOeuvre: number, rangees: number, tableaux?: Array }
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

      // Utiliser la fonction de calcul identique au frontend
      const result = TableauCalcul.calculateTableauMateriels(devisItems, tableauData);

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

