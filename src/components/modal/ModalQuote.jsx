import React, { useState, useCallback, useEffect } from 'react';
import { generatePDF } from '../../utils/pdfGenerator';
import { downloadPDF, validateDownloadData } from '../../utils/download';
import LoadingScreen from './LoadingScreen';
import PDFViewer from './PDFViewer';
import PDFErrorModal from './PDFErrorModal';

export default function ModalQuote({ formData, onBackToStep1, devisItems = [] }) {
  const [pdfData, setPdfData] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // Fonction pour générer le PDF
  const handleGeneratePDF = useCallback(async () => {
    try {
      setIsGenerating(true);
      setPdfError(null);
      
      const pdfBase64 = await generatePDF(formData, devisItems);
      setPdfData(pdfBase64);
      setShowViewer(true);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      setPdfError(error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [formData, devisItems]);

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = () => {
    if (!pdfData) {
      console.error('Aucune donnée PDF disponible pour le téléchargement');
      setPdfError('Aucune donnée PDF disponible pour le téléchargement');
      return;
    }
    
    const clientName = formData?.name || 'client';
    const validation = validateDownloadData(pdfData, clientName);
    
    if (!validation.isValid) {
      setPdfError(validation.error);
      return;
    }
    
    try {
      downloadPDF(pdfData, clientName);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setPdfError('Erreur lors du téléchargement du PDF');
    }
  };

  // Fonction pour fermer le viewer
  const handleCloseViewer = () => {
    setShowViewer(false);
  };


  // Fonction pour réessayer la génération
  const handleRetry = () => {
    setPdfError(null);
    handleGeneratePDF();
  };

  // Générer automatiquement le PDF au chargement du composant
  useEffect(() => {
    handleGeneratePDF();
  }, [handleGeneratePDF]);

  // Afficher l'écran de chargement pendant la génération
  if (isGenerating && !pdfError) {
    return <LoadingScreen onBackToStep1={onBackToStep1} />;
  }

  return (
    <>
      {/* Interface simple avec bouton retour */}
      <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-in-right">
        <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Génération du devis</h2>
        
        <div className="text-center">
          <div className="mb-6">
            {pdfData ? (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                PDF généré avec succès
              </div>
            ) : (
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                Génération en cours...
              </div>
            )}
          </div>
          
          <div className="flex gap-4 justify-center">
            {pdfData && (
              <>
                <button
                  onClick={() => setShowViewer(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
                >
                  Voir le PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
                >
                  Télécharger
                </button>
              </>
            )}
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
              onClick={onBackToStep1}
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>

      {/* Viewer PDF Modal */}
      <PDFViewer
        showViewer={showViewer}
        pdfData={pdfData}
        onDownload={handleDownloadPDF}
        onClose={handleCloseViewer}
      />

      {/* Modal d'erreur */}
      <PDFErrorModal
        showError={!!pdfError}
        errorMessage={pdfError}
        onRetry={handleRetry}
        onBack={onBackToStep1}
      />
    </>
  );
}
