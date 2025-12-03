import React, { useMemo } from 'react';

// ==================== COMPOSANTS UTILITAIRES ====================

// Composant pour les boutons de sélection
const SelectionButtons = ({ onSelectAll, onDeselectAll }) => (
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
);

// Composant pour les groupes de radio buttons
const RadioGroup = ({ title, name, options, value, onChange }) => (
  <div className="mt-4">
    <h4 className="text-sm font-semibold text-cyan-800 mb-2">{title}</h4>
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
            id={`${name}-${option.value}`}
          />
          <span className="text-gray-700" htmlFor={`${name}-${option.value}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

// Composant pour les checkboxes de services
const ServiceCheckbox = ({ service, isSelected, onToggle }) => (
  <label className="flex items-center space-x-2 p-2 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer text-sm">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onToggle(service.value)}
      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-1"
      id={`service-${service.value}`}
    />
    <span className="text-gray-700 text-sm" htmlFor={`service-${service.value}`}>
      {service.label}
    </span>
  </label>
);

// Composant pour l'affichage des services
const ServicesList = ({ services, selectedServices, onServiceToggle }) => (
  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
    {services.map((service) => (
      <ServiceCheckbox
        key={service.value}
        service={service}
        isSelected={selectedServices.includes(service.value)}
        onToggle={onServiceToggle}
      />
    ))}
  </div>
);

// Composant pour le message de sécurité
const SecurityMessage = () => (
  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p className="text-yellow-800 text-sm text-center">
      Veuillez d'abord sélectionner un type d'installation pour voir les prestations disponibles.
    </p>
  </div>
);

// Composant pour l'affichage du nombre de prestations sélectionnées
const SelectedCount = ({ count }) => (
  <div className="mt-3 p-2 bg-cyan-50 border border-cyan-200 rounded-lg">
    <p className="text-cyan-800 font-medium text-sm">
      {count} prestation{count > 1 ? 's' : ''} sélectionnée{count > 1 ? 's' : ''}
    </p>
  </div>
);

const ServiceCheckboxList = ({
  hasRooms,
  hasSpecificServices,
  selectedRoom,
  currentRooms,
  currentSpecificServices,
  getServicesForRoom,
  config,
  selectedServices,
  selectedInstallationType,
  selectedSecurityType,
  onServiceToggle,
  onSelectAll,
  onDeselectAll,
  onInstallationTypeChange,
  onSecurityTypeChange
}) => {
  // ==================== VARIABLES DÉRIVÉES OPTIMISÉES ====================
  
  // Variables booléennes pour améliorer la lisibilité
  const isSecurity = config.categoryLabel === 'Sécurité';
  const isSecurityWithoutType = isSecurity && !selectedSecurityType;
  const hasSelectedServices = selectedServices.length > 0;

  // Conditions d'affichage simplifiées
  const shouldShowServices = (hasRooms && selectedRoom) || hasSpecificServices;

  const shouldShowSelectionButtons = !isSecurityWithoutType;
  const shouldShowServicesList = !isSecurityWithoutType;
  const shouldShowInstallationType = (hasRooms && selectedRoom && hasSelectedServices) || 
                                      (hasSpecificServices && hasSelectedServices && config.categoryLabel === 'Portail / Volet') ||
                                      (hasSpecificServices && hasSelectedServices && isSecurity && selectedSecurityType === 'filaire');

  // Services mémorisés pour éviter les recalculs (triés par ordre alphabétique)
  const services = useMemo(() => {
    let servicesList = [];
    if (hasRooms && selectedRoom) {
      servicesList = getServicesForRoom(selectedRoom);
    } else if (hasSpecificServices) {
      servicesList = currentSpecificServices;
    }
    
    // Trier par ordre alphabétique (au cas où getServicesForRoom ne l'aurait pas fait)
    return servicesList.sort((a, b) => {
      const labelA = (a.label || '').toLowerCase();
      const labelB = (b.label || '').toLowerCase();
      return labelA.localeCompare(labelB, 'fr', { sensitivity: 'base' });
    });
  }, [hasRooms, selectedRoom, hasSpecificServices, currentSpecificServices, getServicesForRoom]);

  // Titre mémorisé
  const title = useMemo(() => {
    if (hasRooms && selectedRoom) {
      const roomLabel = currentRooms.find(r => r.value === selectedRoom)?.label;
      return `Prestations pour ${roomLabel}`;
    } else {
      return `Prestations ${config.categoryLabel.toLowerCase()}`;
    }
  }, [hasRooms, selectedRoom, config.categoryLabel, currentRooms]);

  // Options des radio groups mémorisées
  const installationOptions = useMemo(() => [
    { value: 'saignee_encastre', label: 'Saignée/Encastré' },
    { value: 'saillie_moulure', label: 'Saillie/Moulure' },
    { value: 'cloison_creuse', label: 'Cloison creuse' },
    { value: 'alimentation_existante', label: 'Alimentation existante' }
  ], []);

  const securityOptions = useMemo(() => [
    { value: 'wifi', label: 'Wifi (système connecté)' },
    { value: 'filaire', label: 'Filaire (système en local)' }
  ], []);

  if (!shouldShowServices) return null;

  return (
    <div>
      {/* Type d'installation pour la sécurité */}
      {hasSpecificServices && isSecurity && (
        <RadioGroup
          title="Type d'installation :"
          name="securityType"
          options={securityOptions}
          value={selectedSecurityType}
          onChange={onSecurityTypeChange}
        />
      )}

      {/* Titre principal */}
      <h3 className="text-base font-semibold text-cyan-800 mb-3">
        {title}
      </h3>
      
      {/* Boutons de sélection */}
      {shouldShowSelectionButtons && (
        <SelectionButtons 
          onSelectAll={onSelectAll} 
          onDeselectAll={onDeselectAll} 
        />
      )}

      {/* Liste des services */}
      {shouldShowServicesList && (
        <ServicesList 
          services={services}
          selectedServices={selectedServices}
          onServiceToggle={onServiceToggle}
        />
      )}
      
      {/* Message de sécurité */}
      {isSecurityWithoutType && <SecurityMessage />}

      {/* Compteur de prestations sélectionnées */}
      {hasSelectedServices && <SelectedCount count={selectedServices.length} />}

      {/* Type d'installation pour domotique/installation */}
      {shouldShowInstallationType && (
        <RadioGroup
          title="Type d'installation :"
          name="installationType"
          options={installationOptions}
          value={selectedInstallationType}
          onChange={onInstallationTypeChange}
        />
      )}
    </div>
  );
};

export default ServiceCheckboxList;
