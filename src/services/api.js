const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // ==================== MATÉRIEL ====================
  static async getAllMateriel() {
    const response = await fetch(`${API_BASE_URL}/materiel`);
    if (!response.ok) throw new Error('Erreur lors de la récupération du matériel');
    return response.json();
  }

  static async getMaterielByCode(code) {
    const response = await fetch(`${API_BASE_URL}/materiel/code/${code}`);
    if (!response.ok) throw new Error(`Matériel ${code} introuvable`);
    return response.json();
  }

  static async getMaterielByCodes(codes = []) {
    const response = await fetch(`${API_BASE_URL}/materiel/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codes })
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des matériels');
    return response.json();
  }

  static async createMateriel(data) {
    const response = await fetch(`${API_BASE_URL}/materiel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création du matériel');
    return response.json();
  }

  static async updateMateriel(id, data) {
    const response = await fetch(`${API_BASE_URL}/materiel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du matériel');
    return response.json();
  }

  static async deleteMateriel(id) {
    const response = await fetch(`${API_BASE_URL}/materiel/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du matériel');
    return response.json();
  }

  // ==================== PRESTATIONS ====================
  
  static async getAllPrestations() {
    const response = await fetch(`${API_BASE_URL}/prestations`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des prestations');
    return response.json();
  }

  static async getPrestationsByCategorie(categorie) {
    const response = await fetch(`${API_BASE_URL}/prestations/${categorie}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des prestations');
    return response.json();
  }

  static async getPrestationWithMateriel(prestationId) {
    const response = await fetch(`${API_BASE_URL}/prestations/${prestationId}/materiel`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de la prestation');
    return response.json();
  }

  static async createPrestation(data) {
    const response = await fetch(`${API_BASE_URL}/prestations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la prestation');
    return response.json();
  }

  static async deletePrestation(id) {
    const response = await fetch(`${API_BASE_URL}/prestations/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la prestation');
    return response.json();
  }

  static async linkPrestationMateriel(prestationId, materielId) {
    const response = await fetch(`${API_BASE_URL}/prestations/${prestationId}/materiel/${materielId}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Erreur lors de la liaison prestation-matériel');
    return response.json();
  }

  static async unlinkPrestationMateriel(prestationId, materielId) {
    const response = await fetch(`${API_BASE_URL}/prestations/${prestationId}/materiel/${materielId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la liaison');
    return response.json();
  }

  // ==================== STRUCTURE FORMULAIRE ====================
  
  static async getFormStructure(serviceType) {
    const response = await fetch(`${API_BASE_URL}/prestations/structure/${serviceType}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de la structure');
    return response.json();
  }

  // ==================== LIAISONS PRESTATION/MATÉRIEL ====================
  static async getAllLiaisons() {
    const response = await fetch(`${API_BASE_URL}/liaisons`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des liaisons');
    return response.json();
  }

  static async getLiaisonByCode(code) {
    const response = await fetch(`${API_BASE_URL}/liaisons/${code}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de la liaison');
    return response.json();
  }

  static async getLiaisonsByPrestation(prestationCode, typeInstallation) {
    const response = await fetch(`${API_BASE_URL}/liaisons/prestation/${prestationCode}/${typeInstallation}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des liaisons');
    return response.json();
  }

  static async createLiaison(data) {
    const response = await fetch(`${API_BASE_URL}/liaisons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la liaison');
    return response.json();
  }

  static async updateLiaison(id, data) {
    const response = await fetch(`${API_BASE_URL}/liaisons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la liaison');
    return response.json();
  }

  static async deleteLiaison(id) {
    const response = await fetch(`${API_BASE_URL}/liaisons/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la liaison');
    return response.json();
  }

  // ==================== PRESTATIONS PAR CODE ====================
  
  static async getPrestationByCode(code) {
    const response = await fetch(`${API_BASE_URL}/prestations/code/${code}`);
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
    const response = await fetch(`${API_BASE_URL}/pdf/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData,
        devisItems,
        serviceType
      })
    });
    if (!response.ok) throw new Error('Erreur lors de la génération du PDF');
    return response.json();
  }
}

export default ApiService;
