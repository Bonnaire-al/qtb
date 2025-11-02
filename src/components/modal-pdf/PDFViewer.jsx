import React from 'react';

const PDFViewer = ({ showViewer, pdfData, onDownload, onClose }) => {
  if (!showViewer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Aperçu du Devis</h3>
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Télécharger
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={pdfData}
            className="w-full h-full border-0"
            title="Aperçu du devis"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
