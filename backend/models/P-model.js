const db = require('../config/database');
const LiaisonModel = require('./Liaison-model');
const MaterielModel = require('./M-model');

class PrestationModel {
  // Récupérer toutes les prestations
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM prestations ORDER BY code, service_label', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Récupérer les prestations par catégorie
  static getByCategorie(categorie) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM prestations WHERE categorie = ? ORDER BY code, service_label', [categorie], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Récupérer une prestation par son code
  static getByCode(code) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM prestations WHERE code = ?', [code], (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
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

  // NOUVELLE : Récupérer les matériels d'une prestation par code et type d'installation
  static getMaterielsByPrestationCode(prestationCode, typeInstallation) {
    return (async () => {
      const liaisons = await LiaisonModel.getByPrestationAndType(prestationCode, typeInstallation);
      if (!liaisons || liaisons.length === 0) {
        return [];
      }

      const codes = new Set();
      liaisons.forEach(liaison => (liaison.materiel_codes || []).forEach(code => codes.add(code)));

      const materiels = await MaterielModel.getManyByCodes(Array.from(codes));
      const map = new Map(materiels.map(m => [m.code, m]));

      const rows = [];
      liaisons.forEach(liaison => {
        (liaison.materiel_codes || []).forEach(code => {
          const materiel = map.get(code);
          if (!materiel) return;
          rows.push({
            config_code: liaison.code,
            type_installation,
            materiel_code: materiel.code,
            designation: materiel.designation,
            prix_ht: materiel.prix_ht,
            qte_dynamique: materiel.qte_dynamique,
            type_produit: 'materiel'
          });
        });
      });

      return rows;
    })();
  }

  // Générer un code unique pour une prestation
  static async generateCode(categorie) {
    return new Promise((resolve, reject) => {
      const abbrev = {
        'domotique': 'dom',
        'installation': 'inst',
        'portail': 'port',
        'securite': 'sec'
      };
      const prefix = abbrev[categorie] || (categorie || 'pre').substring(0, 3).toLowerCase();
      
      // Chercher tous les codes de cette catégorie pour trouver le numéro maximum
      db.all(
        `SELECT code FROM prestations WHERE code LIKE ?`,
        [`P${prefix}%`],
        (err, rows) => {
          if (err) return reject(err);
          
          let maxNum = 0;
          if (rows && rows.length > 0) {
            // Extraire tous les numéros et trouver le maximum
            rows.forEach(row => {
              const match = row.code.match(/\d+$/);
              if (match) {
                const num = parseInt(match[0], 10);
                if (num > maxNum) {
                  maxNum = num;
                }
              }
            });
          }
          
          // Le prochain numéro est maxNum + 1
          const nextNum = maxNum + 1;
          const code = `P${prefix}${String(nextNum).padStart(3, '0')}`;
          
          // Vérifier que le code n'existe pas déjà (sécurité supplémentaire)
          db.get('SELECT id FROM prestations WHERE code = ?', [code], (checkErr, existing) => {
            if (checkErr) return reject(checkErr);
            if (existing) {
              // Si existe (cas très rare), incrémenter encore
              const fallbackCode = `P${prefix}${String(nextNum + 1).padStart(3, '0')}`;
              console.log(`⚠️ Code ${code} existe déjà, utilisation de ${fallbackCode}`);
              resolve(fallbackCode);
            } else {
              resolve(code);
            }
          });
        }
      );
    });
  }

  // Ajouter une prestation
  static async create(data) {
    const { code, categorie, piece, service_value, service_label, prix_ht, pieces_applicables } = data;
    
    // Si code non fourni, générer un code automatique unique
    let finalCode = (code || '').trim();
    if (!finalCode) {
      if (!categorie) {
        return Promise.reject(new Error('La catégorie est obligatoire pour générer un code automatique'));
      }
      try {
        finalCode = await this.generateCode(categorie);
        console.log(`✅ Code généré automatiquement : ${finalCode} pour catégorie ${categorie}`);
      } catch (genErr) {
        console.error(`❌ Erreur génération code pour catégorie ${categorie}:`, genErr);
        return Promise.reject(new Error(`Erreur lors de la génération du code : ${genErr.message}`));
      }
    }
    
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO prestations (code, categorie, piece, service_value, service_label, prix_ht, pieces_applicables) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.run(query, [finalCode, categorie, piece, service_value, service_label, prix_ht || 0, pieces_applicables || null], function(err) {
        if (err) {
          // Si erreur de duplication de code, suggérer un nouveau code
          if (err.message.includes('UNIQUE constraint failed')) {
            return reject(new Error(`Le code ${finalCode} existe déjà. Veuillez en choisir un autre.`));
          }
          reject(err);
        } else {
          // Retourner la prestation créée avec son code
          db.get('SELECT * FROM prestations WHERE id = ?', [this.lastID], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      });
    });
  }

  // Mettre à jour une prestation
  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { code, categorie, piece, service_value, service_label, prix_ht, pieces_applicables } = data;
      
      console.log(`📝 UPDATE Prestation #${id}:`, {
        code,
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
      
      // Construire la requête dynamiquement selon les champs fournis
      const fields = [];
      const values = [];
      
      if (code !== undefined) {
        fields.push('code = ?');
        values.push(code);
      }
      if (categorie !== undefined) {
        fields.push('categorie = ?');
        values.push(categorie);
      }
      if (piece !== undefined) {
        fields.push('piece = ?');
        values.push(piece);
      }
      if (service_value !== undefined) {
        fields.push('service_value = ?');
        values.push(service_value);
      }
      if (service_label !== undefined) {
        fields.push('service_label = ?');
        values.push(service_label);
      }
      if (prix_ht !== undefined) {
        fields.push('prix_ht = ?');
        values.push(finalPrixHt);
      }
      if (pieces_applicables !== undefined) {
        fields.push('pieces_applicables = ?');
        values.push(pieces_applicables || null);
      }
      
      if (fields.length === 0) {
        return reject(new Error('Aucun champ à mettre à jour'));
      }
      
      values.push(id);
      const query = `UPDATE prestations SET ${fields.join(', ')} WHERE id = ?`;
      
      db.run(query, values, function(err) {
        if (err) {
          // Si erreur de duplication de code, informer l'utilisateur
          if (err.message.includes('UNIQUE constraint failed') && err.message.includes('code')) {
            return reject(new Error(`Le code ${code} existe déjà pour une autre prestation.`));
          }
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

  // Lier une prestation à du matériel (ancienne méthode - conservée pour compatibilité)
  static linkMateriel(prestationId, materielId) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES (?, ?)';
      db.run(query, [prestationId, materielId], function(err) {
        if (err) reject(err);
        else resolve({ prestationId, materielId });
      });
    });
  }

  // Délier une prestation d'un matériel (ancienne méthode - conservée pour compatibilité)
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
