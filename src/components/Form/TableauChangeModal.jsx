import React, { useState } from 'react';

const TableauChangeModal = ({
  showModal,
  questionnaire,
  onChange,
  onLigneSpecialeToggle,
  onValidate,
  onClose,
  changeType, // 'uniquement' | 'commencer'
  animState = 'in', // 'in' | 'out'
  onAddAnotherTableau // Nouvelle prop pour ajouter un autre tableau
}) => {
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  if (!showModal) return null;

  const tooltips = {
    nombrePhase: 'Pour savoir regarder la largeur de votre disjoncteur d\'abonné (généralement à côté du linky ou tableau principal) 7cm=monophasé; 12cm triphasé',
    appareilTriphase: 'Nombre d\'appareils triphasés dans votre installation (piscine, pompe de relevage, ballon d\'eau chaude..)',
    nombreRangees: 'Nombre de rangées nécessaires pour votre tableau électrique (1 à 4)',
    nombreDisjoncteurs: 'Nombre total de disjoncteurs ou porte-fusibles à remplacer',
    lignesSpeciales: 'Sélectionnez les lignes spéciales nécessaires pour votre installation',
    radiateurElectrique: 'Nombre de radiateurs électriques dans votre installation'
  };

  const TooltipIcon = ({ field }) => (
    <div 
      className="relative inline-block ml-2"
      onMouseEnter={() => setHoveredTooltip(field)}
      onMouseLeave={() => setHoveredTooltip(null)}
    >
      <svg 
        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      {hoveredTooltip === field && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg z-50">
          {tooltips[field]}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );

  const isFormValid = () => {
    return (
      questionnaire.nombrePhase &&
      questionnaire.appareilTriphase !== '' &&
      questionnaire.nombreRangees &&
      questionnaire.nombreDisjoncteurs !== ''
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div 
        className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transition-transform duration-400 modal-animation-ready ${
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
          Changement tableau
        </h2>

        <div className="space-y-6">
          {/* 1. Nombre de phase */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              Nombre de phase ?
              <TooltipIcon field="nombrePhase" />
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="nombrePhase"
                  value="monophaser"
                  checked={questionnaire.nombrePhase === 'monophaser'}
                  onChange={(e) => onChange('nombrePhase', e.target.value)}
                  className="w-4 h-4 text-cyan-600"
                />
                <span>Monophasé</span>
              </label>
              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="nombrePhase"
                  value="triphaser"
                  checked={questionnaire.nombrePhase === 'triphaser'}
                  onChange={(e) => onChange('nombrePhase', e.target.value)}
                  className="w-4 h-4 text-cyan-600"
                />
                <span>Triphasé</span>
              </label>
            </div>
          </div>

          {/* 2. Appareil triphasé */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              Appareil triphasé ?
              <TooltipIcon field="appareilTriphase" />
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map(num => (
                <label
                  key={num}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    questionnaire.appareilTriphase === num.toString()
                      ? 'border-cyan-600 bg-cyan-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="appareilTriphase"
                    value={num}
                    checked={questionnaire.appareilTriphase === num.toString()}
                    onChange={(e) => onChange('appareilTriphase', e.target.value)}
                    className="w-4 h-4 text-cyan-600"
                  />
                  <span className="ml-2">{num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Nombre de rangées */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              Nombre de rangées ?
              <TooltipIcon field="nombreRangees" />
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(num => (
                <label
                  key={num}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    questionnaire.nombreRangees === num.toString()
                      ? 'border-cyan-600 bg-cyan-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="nombreRangees"
                    value={num}
                    checked={questionnaire.nombreRangees === num.toString()}
                    onChange={(e) => onChange('nombreRangees', e.target.value)}
                    className="w-4 h-4 text-cyan-600"
                  />
                  <span className="ml-2">{num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Nombre de disjoncteur/porte fusible */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              Nombre de disjoncteur/porte fusible ?
              <TooltipIcon field="nombreDisjoncteurs" />
            </label>
            <input
              type="number"
              min="0"
              value={questionnaire.nombreDisjoncteurs}
              onChange={(e) => onChange('nombreDisjoncteurs', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Saisir le nombre"
            />
          </div>

          {/* 6. Ligne spéciale */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              Ligne spéciale ?
              <TooltipIcon field="lignesSpeciales" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['plaque_cuisson', 'lave_vaisselle', 'machine_laver', 'chauffeau'].map(ligne => {
                const labels = {
                  plaque_cuisson: 'Plaque de cuisson',
                  lave_vaisselle: 'Lave vaisselle',
                  machine_laver: 'Machine à laver',
                  chauffeau: 'Chauffeau'
                };
                return (
                  <label
                    key={ligne}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      questionnaire.lignesSpeciales.includes(ligne)
                        ? 'border-cyan-600 bg-cyan-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={questionnaire.lignesSpeciales.includes(ligne)}
                      onChange={() => onLigneSpecialeToggle(ligne)}
                      className="w-4 h-4 text-cyan-600"
                    />
                    <span>{labels[ligne]}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 7. Radiateur électrique */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              Radiateur électrique ?
              <TooltipIcon field="radiateurElectrique" />
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="radiateurElectrique"
                  value="0"
                  checked={questionnaire.radiateurElectrique === '0'}
                  onChange={(e) => onChange('radiateurElectrique', e.target.value)}
                  className="w-4 h-4 text-cyan-600"
                />
                <span>0</span>
              </label>
              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="radiateurElectrique"
                  value="5_ou_moins"
                  checked={questionnaire.radiateurElectrique === '5_ou_moins'}
                  onChange={(e) => onChange('radiateurElectrique', e.target.value)}
                  className="w-4 h-4 text-cyan-600"
                />
                <span>5 ou moins</span>
              </label>
              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="radiateurElectrique"
                  value="plus_de_5"
                  checked={questionnaire.radiateurElectrique === 'plus_de_5'}
                  onChange={(e) => onChange('radiateurElectrique', e.target.value)}
                  className="w-4 h-4 text-cyan-600"
                />
                <span>Plus de 5</span>
              </label>
            </div>
          </div>

        </div>

        {/* Bouton de validation et aide */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="bg-gray-100 border-2 border-black rounded-lg p-2 w-full sm:w-auto">
              <p className="text-xs text-gray-700">
                Pour plus d'aide appeler le{' '}
                <a href="tel:0777117178" className="text-blue-900 font-semibold hover:underline">
                  07.77.11.71.78
                </a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {onAddAnotherTableau && (
                <button
                  onClick={onAddAnotherTableau}
                  disabled={!isFormValid()}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v16m8-8H4" 
                    />
                  </svg>
                  Changer/Ajouter un nouveau tableau
                </button>
              )}
              <button
                onClick={onValidate}
                disabled={!isFormValid()}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {changeType === 'uniquement' ? 'Générer mon devis' : 'Ajouter d\'autre prestation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauChangeModal;


