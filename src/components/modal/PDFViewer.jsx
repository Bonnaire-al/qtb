import React from 'react';

const PDFViewer = ({ 
  showViewer, 
  pdfData, 
  onDownload, 
  onClose 
}) => {
  if (!showViewer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* En-tête du viewer */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Aperçu du Devis</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Télécharger
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Contenu du PDF */}
        <div className="flex-1 overflow-hidden">
          {pdfData ? (
            <iframe
              src={pdfData}
              className="w-full h-full border-0"
              title="Aperçu du devis"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement du PDF...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
