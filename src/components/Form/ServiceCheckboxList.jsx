import React from 'react';
import { portailCategories, servicesByPortailCategory } from '../../data/servicesData';

const ServiceCheckboxList = ({
  hasRooms,
  hasPortailCategories,
  hasSpecificServices,
  selectedRoom,
  selectedPortailCategory,
  currentRooms,
  currentServicesByRoom,
  currentSpecificServices,
  config,
  selectedServices,
  selectedInstallationType,
  selectedAlimentation,
  selectedConnexion,
  selectedSecurityType,
  onServiceToggle,
  onSelectAll,
  onDeselectAll,
  onInstallationTypeChange,
  onAlimentationChange,
  onConnexionChange,
  onSecurityTypeChange
}) => {
  // Rendu des services selon le type
  const renderServices = () => {
    if (hasRooms && selectedRoom && currentServicesByRoom[selectedRoom]) {
      return currentServicesByRoom[selectedRoom].map((service) => (
        <label key={service.value} className="flex items-center space-x-2 p-2 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={selectedServices.includes(service.value)}
            onChange={() => onServiceToggle(service.value)}
            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-1"
          />
          <span className="text-gray-700 text-sm">{service.label}</span>
        </label>
      ));
    } else if (hasPortailCategories && selectedPortailCategory && servicesByPortailCategory[selectedPortailCategory]) {
      return servicesByPortailCategory[selectedPortailCategory].map((service) => (
        <label key={service.value} className="flex items-center space-x-2 p-2 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={selectedServices.includes(service.value)}
            onChange={() => onServiceToggle(service.value)}
            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-1"
          />
          <span className="text-gray-700 text-sm">{service.label}</span>
        </label>
      ));
    } else if (hasSpecificServices) {
      return currentSpecificServices.map((service) => (
        <label key={service.value} className="flex items-center space-x-2 p-2 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={selectedServices.includes(service.value)}
            onChange={() => onServiceToggle(service.value)}
            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-1"
          />
          <span className="text-gray-700 text-sm">{service.label}</span>
        </label>
      ));
    }
    return null;
  };

  const getTitle = () => {
    if (hasRooms && selectedRoom) {
      return `Prestations pour ${currentRooms.find(r => r.value === selectedRoom)?.label}`;
    } else if (hasPortailCategories && selectedPortailCategory) {
      return `Prestations pour ${portailCategories.find(c => c.value === selectedPortailCategory)?.label}`;
    } else {
      return `Prestations ${config.categoryLabel.toLowerCase()}`;
    }
  };

  const shouldShow = (hasRooms && selectedRoom) || 
                    (hasPortailCategories && selectedPortailCategory) || 
                    (hasSpecificServices && !hasPortailCategories);

  if (!shouldShow) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-cyan-800 mb-3">
        {getTitle()}
      </h3>
      
      {/* Boutons Tout sélectionner / Tout désélectionner */}
      {!(config.categoryLabel === 'Sécurité' && !selectedSecurityType) && (
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-3 py-1 bg-white border-2 border-blue-400 hover:bg-blue-50 text-blue-600 text-xs rounded-lg transition-colors"
          >
            Tout sélectionner
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="px-3 py-1 bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-700 text-xs rounded-lg transition-colors"
          >
            Tout désélectionner
          </button>
        </div>
      )}

      {/* Choix du type d'installation pour la sécurité */}
      {hasSpecificServices && config.categoryLabel === 'Sécurité' && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-cyan-800 mb-2">Type d'installation :</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="securityType"
                value="wifi"
                checked={selectedSecurityType === 'wifi'}
                onChange={onSecurityTypeChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Wifi (système connecté)</span>
            </label>
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="securityType"
                value="filaire"
                checked={selectedSecurityType === 'filaire'}
                onChange={onSecurityTypeChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Filaire (système en local)</span>
            </label>
          </div>
        </div>
      )}

      {/* Checklist des prestations avec scroll */}
      {!(config.categoryLabel === 'Sécurité' && !selectedSecurityType) && (
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
          {renderServices()}
        </div>
      )}
      
      {/* Message pour la sécurité si aucun type n'est sélectionné */}
      {config.categoryLabel === 'Sécurité' && !selectedSecurityType && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm text-center">
            Veuillez d'abord sélectionner un type d'installation pour voir les prestations disponibles.
          </p>
        </div>
      )}

      {/* Affichage du nombre de prestations sélectionnées */}
      {selectedServices.length > 0 && (
        <div className="mt-3 p-2 bg-cyan-50 border border-cyan-200 rounded-lg">
          <p className="text-cyan-800 font-medium text-sm">
            {selectedServices.length} prestation(s) sélectionnée(s)
          </p>
        </div>
      )}

      {/* Choix du type d'installation (seulement pour domotique et installation avec pièces) */}
      {hasRooms && selectedRoom && selectedServices.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-cyan-800 mb-2">Type d'installation :</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="installationType"
                value="saignee_encastre"
                checked={selectedInstallationType === 'saignee_encastre'}
                onChange={onInstallationTypeChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Saignée/Encastré (+30%)</span>
            </label>
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="installationType"
                value="saillie_moulure"
                checked={selectedInstallationType === 'saillie_moulure'}
                onChange={onInstallationTypeChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Saillie/Moulure (+15%)</span>
            </label>
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="installationType"
                value="cloison_creuse"
                checked={selectedInstallationType === 'cloison_creuse'}
                onChange={onInstallationTypeChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Cloison creuse (+0%)</span>
            </label>
          </div>
        </div>
      )}

      {/* Choix de l'alimentation (seulement pour portail avec prestations sélectionnées) */}
      {hasPortailCategories && selectedPortailCategory === 'portail' && selectedServices.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-cyan-800 mb-2">Alimentation :</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="alimentation"
                value="alimentation_existante"
                checked={selectedAlimentation === 'alimentation_existante'}
                onChange={onAlimentationChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Alimentation existante</span>
            </label>
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="alimentation"
                value="alimentation_inexistante"
                checked={selectedAlimentation === 'alimentation_inexistante'}
                onChange={onAlimentationChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Alimentation inexistante</span>
            </label>
          </div>
        </div>
      )}

      {/* Choix de la connexion (seulement pour volet roulant avec prestations sélectionnées) */}
      {hasPortailCategories && selectedPortailCategory === 'volet' && selectedServices.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-cyan-800 mb-2">Connexion :</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="connexion"
                value="connecte"
                checked={selectedConnexion === 'connecte'}
                onChange={onConnexionChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Connecté (app mobile)</span>
            </label>
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
              <input
                type="radio"
                name="connexion"
                value="classique"
                checked={selectedConnexion === 'classique'}
                onChange={onConnexionChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-gray-700">Classique</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCheckboxList;
