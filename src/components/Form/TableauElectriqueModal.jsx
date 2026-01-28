import React from 'react';

const TableauElectriqueModal = ({
  onChoice,
  onClose,
  showChangeSubModal,
  onChangeType,
  onCloseChangeSubModal,
  animState = 'in', // 'in' | 'out' pour le modal principal
  changeSubModalAnimState = 'in', // 'in' | 'out' pour le sous-modal
  isMainModalRendered = true,
  isSubModalRendered = false
}) => {
  if (!isMainModalRendered && !isSubModalRendered) return null;

  // Modal sous-choix "Changer mon tableau"
  if (showChangeSubModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div 
          className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative transition-transform duration-400 modal-animation-ready ${
            changeSubModalAnimState === 'in' ? 'animate-slide-in-right' : changeSubModalAnimState === 'out' ? 'animate-slide-out-left' : ''
          }`}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onCloseChangeSubModal}
            aria-label="Fermer"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">
            Changer mon tableau
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <button
              className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100"
              onClick={() => onChangeType('uniquement')}
            >
              Changer mon tableau uniquement
            </button>
            <button
              className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100"
              onClick={() => onChangeType('commencer')}
            >
              Ajouter d'autre prestation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal principal avec 3 choix
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div 
        className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative transition-transform duration-400 modal-animation-ready ${
          animState === 'in' ? 'animate-slide-in-right' : animState === 'out' ? 'animate-slide-out-left' : ''
        }`}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">
          Choix du tableau électrique
        </h2>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <button
            className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100"
            onClick={() => onChoice('inexistant')}
          >
            Nouveau tableau
          </button>
          <button
            className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100"
            onClick={() => onChoice('changer')}
          >
            Changer mon tableau
          </button>
          <button
            className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100 relative group"
            onClick={() => onChoice('garder')}
          >
            Garder mon tableau
            {/* Message au survol */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-red-50 border-2 border-red-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="text-red-800 text-sm text-center font-medium">
                Attention si le tableau est plein la facturation d'un nouveau peut être faite sur place
              </p>
            </div>
          </button>
        </div>

        {/* Message d'avertissement */}
        <div className="mt-4 p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
          <div className="flex items-start gap-2">
            <svg 
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <p className="text-yellow-900 text-sm">
              Il est très conseillé de changer de tableau si vous avez des porte fusible et si vous n'avez pas minimum 1 différentiel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauElectriqueModal;


