import React from 'react';
import { useFormLogic } from './useFormLogic';
import ServiceCheckboxList from './ServiceCheckboxList';
import DevisItemList from './DevisItemList';

export default function Form({ serviceType, onClose, onCancel }) {
  const {
    // États
    selectedRoom,
    selectedPortailCategory,
    selectedServices,
    selectedInstallationType,
    selectedAlimentation,
    selectedConnexion,
    selectedSecurityType,
    showDevisModal,
    devisItems,
    
    // Configuration
    config,
    currentRooms,
    currentServicesByRoom,
    currentSpecificServices,
    hasRooms,
    hasPortailCategories,
    hasSpecificServices,
    
    // Handlers
    handleSubmit,
    handleRoomChange,
    handlePortailCategoryChange,
    handleServiceToggle,
    handleSelectAll,
    handleDeselectAll,
    handleInstallationTypeChange,
    handleAlimentationChange,
    handleConnexionChange,
    handleSecurityTypeChange,
    handleAddToDevis,
    handleRemoveDevisItem,
    handleQuantityChange,
    handleGenerateDevis,
    setShowDevisModal
  } = useFormLogic(serviceType);

  const onSubmit = (e) => {
    handleSubmit(e);
    onClose();
  };

  const onGenerateDevisClick = () => {
    handleGenerateDevis(onClose);
  };

  return (
    <>
      <div className="max-h-[80vh] overflow-y-auto max-w-md mx-auto px-8">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Titre du projet */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-cyan-800">{config.title}</h2>
          </div>

          {/* Sélection de la pièce (seulement pour domotique et installation) */}
          {hasRooms && (
            <div>
              <select
                value={selectedRoom}
                onChange={handleRoomChange}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Choisissez la pièce</option>
                {currentRooms.map((room) => (
                  <option key={room.value} value={room.value}>
                    {room.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sélection de la catégorie portail/volet (seulement pour portail) */}
          {hasPortailCategories && (
            <div>
              <select
                value={selectedPortailCategory}
                onChange={handlePortailCategoryChange}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Choisissez le type</option>
                <option value="portail">Portail électrique</option>
                <option value="volet">Volet roulant</option>
              </select>
            </div>
          )}

          {/* ServiceCheckboxList consolidé */}
          <ServiceCheckboxList
            hasRooms={hasRooms}
            hasPortailCategories={hasPortailCategories}
            hasSpecificServices={hasSpecificServices}
            selectedRoom={selectedRoom}
            selectedPortailCategory={selectedPortailCategory}
            currentRooms={currentRooms}
            currentServicesByRoom={currentServicesByRoom}
            currentSpecificServices={currentSpecificServices}
            config={config}
            selectedServices={selectedServices}
            selectedInstallationType={selectedInstallationType}
            selectedAlimentation={selectedAlimentation}
            selectedConnexion={selectedConnexion}
            selectedSecurityType={selectedSecurityType}
            onServiceToggle={handleServiceToggle}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onInstallationTypeChange={handleInstallationTypeChange}
            onAlimentationChange={handleAlimentationChange}
            onConnexionChange={handleConnexionChange}
            onSecurityTypeChange={handleSecurityTypeChange}
          />

          {/* Boutons d'action */}
          <div className="flex justify-between items-center pt-2">
            {/* Div pour Ajouter prestation et Annuler devis */}
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={handleAddToDevis}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={selectedServices.length === 0 || (hasRooms && selectedRoom && !selectedInstallationType) || (hasPortailCategories && (!selectedPortailCategory || (selectedPortailCategory === 'portail' && !selectedAlimentation) || (selectedPortailCategory === 'volet' && !selectedConnexion))) || (hasSpecificServices && config.categoryLabel === 'Sécurité' && !selectedSecurityType)}
              >
                Ajouter prestation
              </button>
              <button 
                type="button"
                onClick={onCancel}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs"
              >
                Annuler devis
              </button>
            </div>
            
            {/* Div pour le bouton Visualiser devis à droite */}
            <div>
              <button
                type="button"
                onClick={() => setShowDevisModal(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center space-x-1 text-xs"
                disabled={devisItems.length === 0}
              >
                <span>Visualiser devis</span>
                <span className="bg-white text-cyan-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                  {devisItems.length}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal Devis */}
      <DevisItemList
        showDevisModal={showDevisModal}
        devisItems={devisItems}
        onCloseModal={() => setShowDevisModal(false)}
        onRemoveDevisItem={handleRemoveDevisItem}
        onQuantityChange={handleQuantityChange}
        onGenerateDevis={onGenerateDevisClick}
      />
    </>
  );
}
