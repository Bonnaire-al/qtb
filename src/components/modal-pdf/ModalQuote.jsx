import React, { useState, useEffect, useRef } from 'react';
import { generatePDFFromAPI, validatePDFData } from '../../utils/pdfService';
import LoadingScreen from './LoadingScreen';
import PDFViewer from './PDFViewer';
import PDFErrorModal from './PDFErrorModal';

export default function ModalQuote({ formData, onBackToStep1, devisItems = [] }) {
  const [pdfData, setPdfData] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const hasGeneratedRef = useRef(false);

  // Fonction pour sauvegarder le devis
  const saveQuoteToLocalStorage = (pdfUrl) => {
    try {
      const existingQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
      const newQuote = {
        id: Date.now(),
        date: new Date().toISOString(),
        formData,
        devisItems,
        pdfUrl,
      };
      existingQuotes.push(newQuote);
      localStorage.setItem('savedQuotes', JSON.stringify(existingQuotes));
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du devis:', error);
    }
  };

  // Fonction pour télécharger le PDF depuis les données base64
  const downloadPDFFromBase64 = (base64Data) => {
    try {
      const clientName = formData?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'client';
      const date = new Date().toISOString().split('T')[0];
      const fileName = `devis_${clientName}_${date}.pdf`;
      
      const link = document.createElement('a');
      link.href = base64Data;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      throw new Error('Impossible de télécharger le PDF');
    }
  };

  // Fonction pour générer le PDF
  const handleGeneratePDF = async () => {
    if (hasGeneratedRef.current) return;
    
    try {
      setIsGenerating(true);
      setPdfError(null);
      
      // Valider les données avant génération
      const validation = validatePDFData(formData, devisItems);
      if (!validation.isValid) {
        setPdfError(validation.error);
        return;
      }
      
      const serviceType = formData?.service || 'domotique';
      const pdfBase64 = await generatePDFFromAPI(formData, devisItems, serviceType);
      
      setPdfData(pdfBase64);
      setShowViewer(true);
      saveQuoteToLocalStorage(pdfBase64);
      hasGeneratedRef.current = true;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération du PDF:', error);
      setPdfError(error.message || 'Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = () => {
    if (!pdfData) {
      setPdfError('Aucune donnée PDF disponible pour le téléchargement');
      return;
    }
    
    try {
      downloadPDFFromBase64(pdfData);
    } catch (error) {
      setPdfError(error.message);
    }
  };

  // Fonction pour réessayer la génération
  const handleRetry = () => {
    hasGeneratedRef.current = false;
    setPdfError(null);
    handleGeneratePDF();
  };

  // Générer automatiquement le PDF au montage du composant (une seule fois)
  useEffect(() => {
    handleGeneratePDF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionnellement vide - on veut générer une seule fois

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
        onClose={() => setShowViewer(false)}
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
