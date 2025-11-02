const db = require('../config/database');

class MaterielModel {
  // Récupérer tout le matériel avec les prestations associées
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM materiel ORDER BY service_value, nom', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Récupérer le matériel par catégorie (via les prestations)
  static getByCategorie(categorie) {
    return new Promise((resolve, reject) => {
      // D'abord, vérifier si la table materiel existe et récupérer tout le matériel
      // Ensuite, filtrer côté backend selon les prestations de la catégorie
      db.all('SELECT * FROM materiel ORDER BY service_value, nom', [], (err, allMateriel) => {
        if (err) {
          console.error('❌ Erreur lors de la récupération de tout le matériel:', err);
          // Si la table n'existe pas encore, retourner un tableau vide
          if (err.message && err.message.includes('no such table')) {
            console.warn('⚠️ Table materiel n\'existe pas encore');
            return resolve([]);
          }
          return reject(err);
        }
        
        // Si aucun matériel, retourner un tableau vide
        if (allMateriel.length === 0) {
          return resolve([]);
        }
        
        // Récupérer les prestations de cette catégorie
        db.all('SELECT DISTINCT service_value FROM prestations WHERE categorie = ?', [categorie], (err, prestations) => {
          if (err) {
            console.error('❌ Erreur lors de la récupération des prestations:', err);
            // En cas d'erreur, retourner quand même tout le matériel filtré côté serveur
            const processedRows = allMateriel.map(row => ({
              ...row,
              service_values: row.service_value ? row.service_value.split(',').map(s => s.trim()).filter(s => s) : []
            }));
            return resolve(processedRows);
          }
          
          if (prestations.length === 0) {
            // Aucune prestation pour cette catégorie, retourner un tableau vide
            return resolve([]);
          }
          
          // Récupérer les service_values des prestations
          const serviceValues = prestations.map(p => p.service_value);
          
          // Filtrer le matériel dont le service_value contient au moins un service_value des prestations
          const filteredMateriel = allMateriel.filter(m => {
            if (!m.service_value) return false;
            const materielServiceValues = m.service_value.split(',').map(s => s.trim()).filter(s => s);
            // Vérifier si au moins un service_value du matériel correspond à une prestation
            return materielServiceValues.some(msv => serviceValues.includes(msv));
          });
          
          try {
            // Convertir service_value en array pour faciliter l'affichage
            const processedRows = filteredMateriel.map(row => ({
              ...row,
              service_values: row.service_value ? row.service_value.split(',').map(s => s.trim()).filter(s => s) : []
            }));
            resolve(processedRows);
          } catch (processErr) {
            console.error('❌ Erreur lors du traitement des données:', processErr);
            // Retourner les données brutes en cas d'erreur de traitement
            resolve(filteredMateriel);
          }
        });
      });
    });
  }

  // Récupérer le matériel par service_value
  static getByServiceValue(serviceValue) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM materiel WHERE service_value LIKE ? ORDER BY nom', [`%${serviceValue}%`], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Récupérer le matériel pour une prestation (via service_value)
  static getByPrestationServiceValue(serviceValue) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.* FROM materiel m
        WHERE m.service_value = ?
        ORDER BY m.nom
      `;
      db.all(query, [serviceValue], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Récupérer le matériel par type_application
  static getByTypeApplication(typeApplication) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM materiel WHERE type_application = ? ORDER BY service_value, nom', [typeApplication], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Récupérer le matériel par type_produit
  static getByTypeProduit(typeProduit) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM materiel WHERE type_produit = ? ORDER BY service_value, nom', [typeProduit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Ajouter du matériel
  static create(data) {
    return new Promise((resolve, reject) => {
      const { nom, service_value, type_produit, prix_ht, categorie } = data;
      // service_value peut être une chaîne de valeurs séparées par des virgules
      const query = 'INSERT INTO materiel (nom, service_value, type_produit, prix_ht) VALUES (?, ?, ?, ?)';
      db.run(query, [nom, service_value || '', type_produit || 'materiel', prix_ht || 0], function(err) {
        if (err) reject(err);
        else {
          // Retourner les données créées
          db.get('SELECT * FROM materiel WHERE id = ?', [this.lastID], (err, row) => {
            if (err) reject(err);
            else {
              const processedRow = {
                ...row,
                service_values: row.service_value ? row.service_value.split(',').map(s => s.trim()) : []
              };
              resolve(processedRow);
            }
          });
        }
      });
    });
  }

  // Mettre à jour du matériel
  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { nom, service_value, type_produit, prix_ht } = data;
      const query = 'UPDATE materiel SET nom = ?, service_value = ?, type_produit = ?, prix_ht = ? WHERE id = ?';
      db.run(query, [nom, service_value || '', type_produit || 'materiel', prix_ht || 0, id], function(err) {
        if (err) reject(err);
        else {
          // Retourner les données mises à jour
          db.get('SELECT * FROM materiel WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else {
              const processedRow = {
                ...row,
                service_values: row.service_value ? row.service_value.split(',').map(s => s.trim()) : []
              };
              resolve(processedRow);
            }
          });
        }
      });
    });
  }

  // Supprimer du matériel
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM materiel WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }

  // Récupérer toutes les prestations disponibles pour les select
  static async getAvailablePrestations() {
    return new Promise((resolve, reject) => {
      db.all('SELECT DISTINCT service_value, service_label FROM prestations ORDER BY service_value', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = MaterielModel;
