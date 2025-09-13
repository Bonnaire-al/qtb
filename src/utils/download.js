// Fonction pour télécharger un fichier PDF
export const downloadPDF = (pdfData, clientName) => {
  if (!pdfData) {
    console.error('Aucune donnée PDF à télécharger');
    return;
  }
  
  const fileName = `devis_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  const link = document.createElement('a');
  link.href = pdfData;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fonction pour générer un nom de fichier unique
export const generateFileName = (clientName, prefix = 'devis') => {
  const sanitizedName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${sanitizedName}_${date}.pdf`;
};

// Fonction pour valider les données avant téléchargement
export const validateDownloadData = (pdfData, clientName) => {
  if (!pdfData) {
    return { isValid: false, error: 'Aucune donnée PDF disponible' };
  }
  
  if (!clientName || clientName.trim() === '') {
    return { isValid: false, error: 'Nom du client requis pour le téléchargement' };
  }
  
  if (!pdfData.startsWith('data:application/pdf')) {
    return { isValid: false, error: 'Format de données PDF invalide' };
  }
  
  return { isValid: true };
};
