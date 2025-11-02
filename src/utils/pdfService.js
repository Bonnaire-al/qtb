import ApiService from '../services/api';

// Fonction pour générer un PDF via l'API backend
export const generatePDFFromAPI = async (formData, devisItems, serviceType = 'domotique') => {
  try {
    const result = await ApiService.generatePDF(formData, devisItems, serviceType);
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de la génération du PDF');
    }
    
    return result.pdfData;
  } catch (error) {
    console.error('❌ Génération PDF:', error);
    throw error;
  }
};

// Fonction pour valider les données avant génération
export const validatePDFData = (formData, devisItems) => {
  if (!formData) {
    return { isValid: false, error: 'Données du formulaire manquantes' };
  }
  
  if (!formData.name || formData.name.trim() === '') {
    return { isValid: false, error: 'Nom du client requis' };
  }
  
  if (!formData.email || formData.email.trim() === '') {
    return { isValid: false, error: 'Email du client requis' };
  }
  
  if (!devisItems || devisItems.length === 0) {
    return { isValid: false, error: 'Aucun service sélectionné' };
  }
  
  return { isValid: true };
};

