import React from 'react';
import { useFormLogic } from './useFormLogic';
import ServiceCheckboxList from './ServiceCheckboxList';
import DevisItemList from './DevisItemList';

export default function Form({ serviceType, onClose, onCancel, tableauData = null }) {
  const {
    // États
    selectedRoom,
    selectedServices,
    selectedInstallationType,
    selectedSecurityType,
    showDevisModal,
    devisItems,
    isLoadingPrices,
    isLoadingServices,
    showSuccessMessage,
    
    // Configuration
    config,
    currentRooms,
    currentSpecificServices,
    hasRooms,
    hasSpecificServices,
    getServicesForRoom,
    
    // Handlers regroupés
    handlers,
    
    // Fonctions de gestion des devis
    addToDevis,
    removeDevisItem,
    updateQuantity,
    generateDevis,
    setShowDevisModal,
    reloadData
  } = useFormLogic(serviceType, tableauData);

  const onSubmit = (e) => {
    handlers.submit(e);
    onClose();
  };

  const onGenerateDevisClick = () => {
    generateDevis(onClose);
  };

  // Afficher un loader pendant le chargement
  if (isLoadingPrices || isLoadingServices) {
    return (
      <div className="max-h-[80vh] overflow-y-auto max-w-md mx-auto px-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-gray-600">Chargement du formulaire...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-h-[80vh] overflow-y-auto max-w-md mx-auto px-8">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Titre du projet avec bouton refresh */}
          <div className="text-center mb-4 relative">
            <h2 className="text-xl font-bold text-cyan-800">{config.title}</h2>
            <button
              type="button"
              onClick={reloadData}
              className="absolute right-0 top-0 text-gray-400 hover:text-cyan-600 transition-colors"
              title="Rafraîchir les données"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Sélection de la pièce (seulement pour domotique et installation) */}
          {hasRooms && (
            <div>
              <select
                value={selectedRoom}
                onChange={handlers.roomChange}
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

          {/* ServiceCheckboxList consolidé */}
          {!showSuccessMessage && (
            <ServiceCheckboxList
              hasRooms={hasRooms}
              hasSpecificServices={hasSpecificServices}
              selectedRoom={selectedRoom}
              currentRooms={currentRooms}
              currentSpecificServices={currentSpecificServices}
              getServicesForRoom={getServicesForRoom}
              config={config}
              selectedServices={selectedServices}
              selectedInstallationType={selectedInstallationType}
              selectedSecurityType={selectedSecurityType}
              onServiceToggle={handlers.serviceToggle}
              onSelectAll={handlers.selectAll}
              onDeselectAll={handlers.deselectAll}
              onInstallationTypeChange={handlers.installationTypeChange}
              onSecurityTypeChange={handlers.securityTypeChange}
              serviceType={serviceType}
            />
          )}

          {/* Message de succès */}
          {showSuccessMessage && (
            <div className="mt-3 mb-2 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              <p className="text-green-800 text-sm text-center font-medium">
                ✓ Prestation ajoutée avec succès. Vous pouvez ajouter une autre prestation.
              </p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-between items-center pt-2">
            {/* Div pour Ajouter prestation et Annuler devis */}
            <div className="flex flex-col items-start">
              {/* Message "ajouter au devis" avec flèche animée (domotique/installation) */}
              {!showSuccessMessage && 
               (serviceType === 'domotique' || serviceType === 'installation') && 
               selectedServices.length > 0 && 
               selectedInstallationType && (
                <div className="mb-1 flex items-center gap-1 text-green-600 text-xs">
                  <span>ajouter au devis</span>
                  <svg 
                    className="w-3 h-3 animate-bounce" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 10l7 7m0 0l7-7m-7 7V3" 
                    />
                  </svg>
                </div>
              )}
              <div className="flex space-x-2">
                <button 
                  type="button"
                  onClick={addToDevis}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={
                    selectedServices.length === 0 || 
                    (hasRooms && selectedRoom && !selectedInstallationType) ||
                    (config.categoryLabel === 'Portail / Volet' && !selectedInstallationType) ||
                    (config.categoryLabel === 'Sécurité' && (!selectedSecurityType || (selectedSecurityType === 'filaire' && !selectedInstallationType)))
                  }
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
        onRemoveDevisItem={removeDevisItem}
        onQuantityChange={updateQuantity}
        onGenerateDevis={onGenerateDevisClick}
      />
    </>
  );
}
