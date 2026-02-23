// En prod : définir VITE_API_URL dans .env (ex: https://ton-domaine.com/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders(extra = {}) {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

class ApiService {
  // ==================== ADMIN AUTH (backend) ====================
  static async loginAdmin(password) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Connexion refusée');
    if (data.token) localStorage.setItem('adminToken', data.token);
    return data;
  }

  static logoutAdmin() {
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.removeItem('adminToken');
  }

  // ==================== MATÉRIEL ====================
  static async getAllMateriel() {
    const response = await fetch(`${API_BASE_URL}/materiel`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération du matériel');
    return response.json();
  }

  static async getMaterielByCode(code) {
    const response = await fetch(`${API_BASE_URL}/materiel/code/${code}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error(`Matériel ${code} introuvable`);
    return response.json();
  }

  static async getMaterielByCodes(codes = []) {
    const response = await fetch(`${API_BASE_URL}/materiel/batch`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ codes })
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des matériels');
    return response.json();
  }

  static async createMateriel(data) {
    const response = await fetch(`${API_BASE_URL}/materiel`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création du matériel');
    return response.json();
  }

  static async updateMateriel(id, data) {
    const response = await fetch(`${API_BASE_URL}/materiel/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du matériel');
    return response.json();
  }

  static async deleteMateriel(id) {
    const response = await fetch(`${API_BASE_URL}/materiel/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du matériel');
    return response.json();
  }

  // ==================== PRESTATIONS ====================
  
  static async getAllPrestations() {
    const response = await fetch(`${API_BASE_URL}/prestations`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération des prestations');
    return response.json();
  }

  static async getPrestationsByCategorie(categorie) {
    const response = await fetch(`${API_BASE_URL}/prestations/${categorie}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération des prestations');
    return response.json();
  }

  static async getPrestationWithMateriel(prestationId) {
    const response = await fetch(`${API_BASE_URL}/prestations/${prestationId}/materiel`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération de la prestation');
    return response.json();
  }

  static async createPrestation(data) {
    const response = await fetch(`${API_BASE_URL}/prestations`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors de la création de la prestation');
    }
    return response.json();
  }

  static async updatePrestation(id, data) {
    const response = await fetch(`${API_BASE_URL}/prestations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la prestation');
    return response.json();
  }

  static async deletePrestation(id) {
    const response = await fetch(`${API_BASE_URL}/prestations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la prestation');
    return response.json();
  }

  static async linkPrestationMateriel(prestationId, materielId) {
    const response = await fetch(`${API_BASE_URL}/prestations/${prestationId}/materiel/${materielId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la liaison prestation-matériel');
    return response.json();
  }

  static async unlinkPrestationMateriel(prestationId, materielId) {
    const response = await fetch(`${API_BASE_URL}/prestations/${prestationId}/materiel/${materielId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la liaison');
    return response.json();
  }

  // ==================== STRUCTURE FORMULAIRE ====================
  
  static async getFormStructure(serviceType) {
    const response = await fetch(`${API_BASE_URL}/prestations/structure/${serviceType}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération de la structure');
    return response.json();
  }

  // ==================== LIAISONS PRESTATION/MATÉRIEL ====================
  static async getAllLiaisons() {
    const response = await fetch(`${API_BASE_URL}/liaisons`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération des liaisons');
    return response.json();
  }

  static async getLiaisonByCode(code) {
    const response = await fetch(`${API_BASE_URL}/liaisons/${code}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération de la liaison');
    return response.json();
  }

  static async getLiaisonsByPrestation(prestationCode, typeInstallation) {
    const response = await fetch(`${API_BASE_URL}/liaisons/prestation/${prestationCode}/${typeInstallation}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération des liaisons');
    return response.json();
  }

  static async createLiaison(data) {
    const response = await fetch(`${API_BASE_URL}/liaisons`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la liaison');
    return response.json();
  }

  static async updateLiaison(id, data) {
    const response = await fetch(`${API_BASE_URL}/liaisons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la liaison');
    return response.json();
  }

  static async deleteLiaison(id) {
    const response = await fetch(`${API_BASE_URL}/liaisons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la liaison');
    return response.json();
  }

  // ==================== PRESTATIONS PAR CODE ====================
  
  static async getPrestationByCode(code) {
    const response = await fetch(`${API_BASE_URL}/prestations/code/${code}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Erreur lors de la récupération de la prestation');
    return response.json();
  }

  // ==================== MATÉRIEL PAR CODE ====================
  
  // ==================== TABLEAU ====================
  
  static async calculateTableau(devisItems, tableauData) {
    const response = await fetch(`${API_BASE_URL}/tableau/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        devisItems,
        tableauData
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors du calcul du tableau');
    }
    return response.json();
  }

  // ==================== PDF ====================
  
  static async generatePDF(formData, devisItems, serviceType) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min pour grosse génération PDF
    try {
      const response = await fetch(`${API_BASE_URL}/pdf/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: { ...formData, quoteMode: formData?.quoteMode || (devisItems?.some?.(i => i?.rapid?.group) ? 'rapide' : undefined) },
          devisItems,
          serviceType
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Erreur lors de la génération du PDF');
      }
      return response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') throw new Error('La génération du PDF a pris trop de temps. Réessayez.');
      throw err;
    }
  }

  // ==================== DEVIS RAPIDE (CONFIG + PREPARE) ====================

  static async getRapidConfig() {
    const response = await fetch(`${API_BASE_URL}/rapid/config`, { headers: getAuthHeaders() });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Erreur lors de la récupération de la config devis rapide');
    }
    return response.json();
  }

  static async updateRapidConfig(config) {
    const response = await fetch(`${API_BASE_URL}/rapid/config`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(config)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la config devis rapide');
    return response.json();
  }

  static async addRapidPackItem(packId, prestation_code, quantity = 1) {
    const response = await fetch(`${API_BASE_URL}/rapid/config/packs/${packId}/items`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ prestation_code, quantity })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors de l’ajout au pack');
    }
    return response.json();
  }

  static async updateRapidPackItem(itemId, quantity = 1) {
    const response = await fetch(`${API_BASE_URL}/rapid/config/items/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du pack');
    return response.json();
  }

  static async deleteRapidPackItem(itemId) {
    const response = await fetch(`${API_BASE_URL}/rapid/config/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression dans le pack');
    return response.json();
  }

  static async prepareRapidDevis(payload) {
    const response = await fetch(`${API_BASE_URL}/rapid/prepare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors de la préparation du devis rapide');
    }
    return response.json();
  }

  // ==================== AVIS CLIENTS ====================
  static async getAvis() {
    const response = await fetch(`${API_BASE_URL}/avis`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des avis');
    return response.json();
  }

  static async createAvis(data) {
    const response = await fetch(`${API_BASE_URL}/avis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors de l\'envoi de l\'avis');
    }
    return response.json();
  }

  static async updateAvis(id, data) {
    const response = await fetch(`${API_BASE_URL}/avis/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'avis');
    return response.json();
  }

  static async deleteAvis(id) {
    const response = await fetch(`${API_BASE_URL}/avis/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'avis');
    return response.json();
  }
}

export default ApiService;
