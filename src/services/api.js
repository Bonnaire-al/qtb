const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // ==================== MATÉRIEL ====================
  
  static async getAllMateriel() {
    const response = await fetch(`${API_BASE_URL}/materiel`);
    if (!response.ok) throw new Error('Erreur lors de la récupération du matériel');
    return response.json();
  }

  static async getAvailablePrestations() {
    const response = await fetch(`${API_BASE_URL}/materiel/prestations`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des prestations');
    return response.json();
  }

  static async getMaterielByCategorie(categorie) {
    try {
      const response = await fetch(`${API_BASE_URL}/materiel/categorie/${categorie}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('❌ Erreur API getMaterielByCategorie:', error);
      throw error;
    }
  }

  static async getMaterielByServiceValue(serviceValue) {
    const response = await fetch(`${API_BASE_URL}/materiel/service/${serviceValue}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération du matériel');
    return response.json();
  }

  static async getMaterielByPrestationServiceValue(serviceValue) {
    const response = await fetch(`${API_BASE_URL}/materiel/prestation/${serviceValue}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération du matériel');
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
    if (!response.ok) throw new Error('Erreur lors de la création de la prestation');
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
