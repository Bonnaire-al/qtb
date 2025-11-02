const db = require('../config/database');

class PrestationModel {
  // Récupérer toutes les prestations
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM prestations', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Récupérer les prestations par catégorie
  static getByCategorie(categorie) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM prestations WHERE categorie = ?', [categorie], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Récupérer une prestation avec son matériel
  static getWithMateriel(prestationId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.*,
          m.id as materiel_id,
          m.nom as materiel_nom,
          m.quantite as materiel_quantite,
          m.prix_ht as materiel_prix_ht
        FROM prestations p
        LEFT JOIN prestation_materiel pm ON p.id = pm.prestation_id
        LEFT JOIN materiel m ON pm.materiel_id = m.id
        WHERE p.id = ?
      `;
      db.all(query, [prestationId], (err, rows) => {
        if (err) reject(err);
        else {
          if (rows.length === 0) resolve(null);
          else {
            const prestation = {
              id: rows[0].id,
              categorie: rows[0].categorie,
              piece: rows[0].piece,
              service_value: rows[0].service_value,
              service_label: rows[0].service_label,
              prix_ht: rows[0].prix_ht,
              materiels: rows.filter(r => r.materiel_id).map(r => ({
                id: r.materiel_id,
                nom: r.materiel_nom,
                quantite: r.materiel_quantite,
                prix_ht: r.materiel_prix_ht
              }))
            };
            resolve(prestation);
          }
        }
      });
    });
  }

  // Ajouter une prestation
  static create(data) {
    return new Promise((resolve, reject) => {
      const { categorie, piece, service_value, service_label, prix_ht, pieces_applicables } = data;
      const query = 'INSERT INTO prestations (categorie, piece, service_value, service_label, prix_ht, pieces_applicables) VALUES (?, ?, ?, ?, ?, ?)';
      db.run(query, [categorie, piece, service_value, service_label, prix_ht || 0, pieces_applicables || null], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      });
    });
  }

  // Mettre à jour une prestation
  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { categorie, piece, service_value, service_label, prix_ht, pieces_applicables } = data;
      
      console.log(`📝 UPDATE Prestation #${id}:`, {
        categorie,
        piece,
        service_value,
        service_label,
        prix_ht: prix_ht !== undefined ? prix_ht : 0,
        pieces_applicables,
        prix_ht_type: typeof prix_ht
      });
      
      // Utiliser prix_ht directement, ne pas le remplacer par 0 si c'est 0
      const finalPrixHt = prix_ht !== undefined ? prix_ht : 0;
      
      const query = 'UPDATE prestations SET categorie = ?, piece = ?, service_value = ?, service_label = ?, prix_ht = ?, pieces_applicables = ? WHERE id = ?';
      db.run(query, [categorie, piece, service_value, service_label, finalPrixHt, pieces_applicables || null, id], function(err) {
        if (err) {
          console.error('❌ Erreur UPDATE:', err);
          reject(err);
        } else {
          console.log(`✅ Prestation #${id} mise à jour (${this.changes} changements)`);
          
          // Relire les données depuis la base pour retourner les vraies valeurs
          db.get('SELECT * FROM prestations WHERE id = ?', [id], (err, row) => {
            if (err) {
              console.error('❌ Erreur SELECT après UPDATE:', err);
              reject(err);
            } else {
              console.log(`✅ Données relues depuis la base:`, row);
              resolve(row);
            }
          });
        }
      });
    });
  }

  // Supprimer une prestation
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM prestations WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }

  // Lier une prestation à du matériel
  static linkMateriel(prestationId, materielId) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES (?, ?)';
      db.run(query, [prestationId, materielId], function(err) {
        if (err) reject(err);
        else resolve({ prestationId, materielId });
      });
    });
  }

  // Délier une prestation d'un matériel
  static unlinkMateriel(prestationId, materielId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM prestation_materiel WHERE prestation_id = ? AND materiel_id = ?';
      db.run(query, [prestationId, materielId], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }

  // Récupérer la structure complète pour le formulaire
  static async getFormStructure(serviceType) {
    const prestations = await this.getByCategorie(serviceType);

      // Organiser les prestations par pièce
      const servicesByRoom = {};
      const piecesSet = new Set();
      
      prestations.forEach(prestation => {
        // Gérer les 3 types de prestations
        if (prestation.piece === 'commun') {
          // Commun : ajouter à toutes les pièces
          const allPieces = ['chambre', 'salon', 'cuisine', 'salle_de_bain', 'toilette', 'couloir', 'escalier', 'cellier', 'cave', 'garage', 'grenier', 'exterieur'];
          allPieces.forEach(piece => {
            if (!servicesByRoom[piece]) {
              servicesByRoom[piece] = [];
            }
            servicesByRoom[piece].push({
              value: prestation.service_value,
              label: prestation.service_label,
              prix_ht: prestation.prix_ht
            });
            piecesSet.add(piece);
          });
        } else if (prestation.piece === 'selection' && prestation.pieces_applicables) {
          // Sélection : ajouter aux pièces spécifiées
          const piecesApplicables = prestation.pieces_applicables.split(',');
          piecesApplicables.forEach(piece => {
            const trimmedPiece = piece.trim();
            if (!servicesByRoom[trimmedPiece]) {
              servicesByRoom[trimmedPiece] = [];
            }
            servicesByRoom[trimmedPiece].push({
              value: prestation.service_value,
              label: prestation.service_label,
              prix_ht: prestation.prix_ht
            });
            piecesSet.add(trimmedPiece);
          });
        } else {
          // Pièce unique : ajouter à la pièce spécifique
          const room = prestation.piece || 'specific';
          
          if (prestation.piece) {
            piecesSet.add(prestation.piece);
          }
          
          if (!servicesByRoom[room]) {
            servicesByRoom[room] = [];
          }
          servicesByRoom[room].push({
            value: prestation.service_value,
            label: prestation.service_label,
            prix_ht: prestation.prix_ht
          });
        }
      });

      // Mapper les pièces en format {value, label}
      const piecesLabels = {
        chambre: 'Chambre',
        salon: 'Salon',
        cuisine: 'Cuisine',
        salle_de_bain: 'Salle de bain',
        toilette: 'Toilette',
        couloir: 'Couloir',
        escalier: 'Escalier',
        cellier: 'Cellier',
        cave: 'Cave',
        garage: 'Garage',
        grenier: 'Grenier',
        exterieur: 'Extérieur',
        portail: 'Portail électrique',
        volet: 'Volet roulant'
      };

      // Pour domotique et installation, retourner TOUTES les pièces possibles
      let pieces = [];
      if (serviceType === 'domotique' || serviceType === 'installation') {
        // Toutes les pièces pour domotique et installation
        pieces = ['chambre', 'salon', 'cuisine', 'salle_de_bain', 'toilette', 'couloir', 'escalier', 'cellier', 'cave', 'garage', 'grenier', 'exterieur']
          .map(p => ({ value: p, label: piecesLabels[p] }));
      } else {
        // Pour portail et sécurité, utiliser les pièces de la BD
        pieces = Array.from(piecesSet)
          .filter(p => p !== 'commun')
          .map(p => ({ value: p, label: piecesLabels[p] || p }));
      }

    return {
      servicesByRoom,
      pieces
    };
  }
}

module.exports = PrestationModel;
