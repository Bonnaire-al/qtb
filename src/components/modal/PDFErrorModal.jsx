import React from 'react';

const PDFErrorModal = ({ 
  showError, 
  errorMessage, 
  onRetry, 
  onBack 
}) => {
  if (!showError) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Erreur de génération</h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFErrorModal;
