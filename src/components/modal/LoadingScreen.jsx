import React from 'react';

const LoadingScreen = ({ onBackToStep1 }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-in-right">
      <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Génération du devis</h2>
      
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 mr-2"></div>
            Génération du PDF en cours...
          </div>
        </div>
        
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
          onClick={onBackToStep1}
        >
          ← Retour
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;
