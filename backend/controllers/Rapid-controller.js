const RapidConfigModel = require('../models/RapidConfig-model');
const PrestationModel = require('../models/P-model');
const TableauCalcul = require('../utils/tableauCalcul');

class RapidController {
  // GET /api/rapid-config
  static async getConfig(req, res) {
    try {
      const config = await RapidConfigModel.getConfig();
      const packs = await RapidConfigModel.getPacksWithItems();
      res.json({ config, packs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/rapid-config
  static async updateConfig(req, res) {
    try {
      const { coef_classic, coef_premium, coef_luxe } = req.body || {};
      const toNumber = (v, fallback = 1.0) => {
        const n = typeof v === 'number' ? v : parseFloat(v);
        return Number.isFinite(n) ? n : fallback;
      };

      const result = await RapidConfigModel.updateConfig({
        coef_classic: toNumber(coef_classic, 1.0),
        coef_premium: toNumber(coef_premium, 1.0),
        coef_luxe: toNumber(coef_luxe, 1.0)
      });
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/rapid-config/packs/:packId/items
  static async addPackItem(req, res) {
    try {
      const { packId } = req.params;
      const { prestation_code, quantity } = req.body || {};
      if (!prestation_code) {
        return res.status(400).json({ error: 'prestation_code requis' });
      }
      const qty = Math.max(1, parseInt(quantity, 10) || 1);
      const result = await RapidConfigModel.addPackItem(parseInt(packId, 10), prestation_code, qty);
      res.status(201).json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/rapid-config/items/:itemId
  static async updatePackItem(req, res) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body || {};
      const qty = Math.max(1, parseInt(quantity, 10) || 1);
      const result = await RapidConfigModel.updatePackItem(parseInt(itemId, 10), qty);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/rapid-config/items/:itemId
  static async deletePackItem(req, res) {
    try {
      const { itemId } = req.params;
      const result = await RapidConfigModel.deletePackItem(parseInt(itemId, 10));
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/rapid/prepare
  // Construit les devisItems (packs expand -> prestations) + ajoute tableau (inexistant obligatoire)
  static async prepare(req, res) {
    try {
      const {
        installationType,
        pieceGammes = {}, // { chambre:'premium', ... } inclut cuisine
        securitySelections = [], // [{label,quantity}]
        portailSelections = [],
        voletSelections = []
      } = req.body || {};

      if (!installationType) {
        return res.status(400).json({ error: 'installationType requis' });
      }

      // Récupérer mapping des libellés de pièces
      const structure = await PrestationModel.getFormStructure('installation');
      const pieces = structure?.pieces || [];
      const pieceLabelMap = new Map(pieces.map(p => [p.value, p.label]));

      // Charger les packs configurés
      const packs = await RapidConfigModel.getPacksWithItems();
      const byTypeGamme = new Map();
      packs.forEach(p => {
        byTypeGamme.set(`${p.pack_type}:${p.gamme}`, p);
      });

      const devisItems = [];
      const nowId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const buildPackItem = (roomValue, gamme, packType) => {
        const key = `${packType}:${gamme}`;
        const pack = byTypeGamme.get(key);
        if (!pack || pack.enabled !== 1) {
          throw new Error(`Pack introuvable ou désactivé: ${packType} ${gamme}`);
        }
        if (!pack.items || pack.items.length === 0) {
          throw new Error(`Pack vide: ${packType} ${gamme} (configurez-le dans l'admin)`);
        }

        const roomLabel = pieceLabelMap.get(roomValue) || roomValue;
        const services = pack.items.map(it => ({
          label: it.service_label || it.prestation_code,
          code: it.prestation_code || null,
          quantity: Math.max(1, parseInt(it.quantity, 10) || 1)
        }));

        return {
          id: `pack-${roomValue}-${nowId()}`,
          room: roomLabel,
          roomValue,
          installationType,
          serviceType: 'installation',
          services,
          completed: false,
          rapid: { group: 'pack', gamme, packType }
        };
      };

      // Packs par pièce
      Object.entries(pieceGammes || {}).forEach(([roomValue, gamme]) => {
        if (!gamme) return;
        const isCuisine = roomValue === 'cuisine';
        const packType = isCuisine ? 'cuisine' : 'piece';
        devisItems.push(buildPackItem(roomValue, gamme, packType));
      });

      // Sécurité / Portail / Volet : prestations existantes (non-pack)
      const normalizeSelections = (arr) =>
        (Array.isArray(arr) ? arr : [])
          .map(s => ({ label: s.label, quantity: parseInt(s.quantity, 10) || 0 }))
          .filter(s => s.label && s.quantity > 0);

      const security = normalizeSelections(securitySelections);
      if (security.length > 0) {
        devisItems.push({
          id: `securite-${nowId()}`,
          room: 'Sécurité',
          roomValue: 'securite',
          installationType: 'wifi', // Devis rapide : sécurité toujours en wifi, choix en bas n'impacte pas
          serviceType: 'securite',
          services: security.map(s => ({ label: s.label, quantity: s.quantity })),
          completed: false,
          rapid: { group: 'securite' }
        });
      }

      const portail = normalizeSelections(portailSelections);
      if (portail.length > 0) {
        devisItems.push({
          id: `portail-${nowId()}`,
          room: 'Portail électrique',
          roomValue: 'portail',
          installationType,
          serviceType: 'portail',
          services: portail.map(s => ({ label: s.label, quantity: s.quantity })),
          completed: false,
          rapid: { group: 'portail' }
        });
      }

      const volet = normalizeSelections(voletSelections);
      if (volet.length > 0) {
        devisItems.push({
          id: `volet-${nowId()}`,
          room: 'Volet roulant',
          roomValue: 'volet',
          installationType,
          serviceType: 'portail',
          services: volet.map(s => ({ label: s.label, quantity: s.quantity })),
          completed: false,
          rapid: { group: 'volet' }
        });
      }

      // Tableau électrique : obligatoire, "inexistant"
      const tableauData = { choice: 'inexistant', questionnaire: null, changeType: 'commencer' };
      const tableauResult = TableauCalcul.calculateTableauMateriels(devisItems, tableauData);

      const tableauItem = {
        id: `tableau-inexistant-rapid-${nowId()}`,
        type: 'tableau',
        room: 'Tableau électrique',
        serviceType: 'installation',
        tableauData,
        services: tableauResult.materiels || [],
        mainOeuvre: tableauResult.mainOeuvre || 0,
        rangees: tableauResult.rangees || 0,
        completed: false,
        rapid: { group: 'tableau' }
      };

      const finalItems = [...devisItems, tableauItem];

      res.json({
        success: true,
        devisItems: finalItems
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RapidController;

