import React from 'react';
import { useFormLogic } from './useFormLogic';
import { WizardProgress, StepZoneRoom, StepInstallation, StepPrestations } from './FormWizardSteps';
import DevisItemList from './DevisItemList';
import { ZONE_EXTERIOR } from './formWizardUtils';

export default function Form({
  serviceType,
  onClose,
  onCancel,
  tableauData = null,
  tableauServiceKey = null,
  embedded = false,
  onPrevPhase
}) {
  const {
    wizardStep,
    setWizardStep,
    wizardZone,
    selectedRoom,
    selectedServices,
    serviceQuantities,
    serviceInterrupteurs,
    selectedInstallationType,
    selectedSecurityType,
    devisItems,
    isLoadingPrices,
    isLoadingServices,
    showSuccessMessage,
    successMessage,
    config,
    interiorRooms,
    exteriorRooms,
    groupedServicesStep3,
    canGoStep2,
    canAddToDevis,
    editingItemId,
    handlers,
    addToDevis,
    startEditDevisItem,
    removeDevisItem,
    copyTargetRooms,
    copyDevisItemToRoom,
    generateDevis
  } = useFormLogic(serviceType, tableauData, tableauServiceKey);

  const canGoStep3 = () => {
    if (wizardZone === ZONE_EXTERIOR && selectedSecurityType === 'wifi') return true;
    return Boolean(selectedInstallationType);
  };

  if (isLoadingPrices || isLoadingServices) {
    return (
      <div className="max-h-[85vh] overflow-y-auto max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4" />
          <p className="text-gray-600">Chargement du formulaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? 'w-full' : 'max-h-[85vh] overflow-y-auto max-w-5xl mx-auto px-4 py-4'}>
      {!embedded && (
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-cyan-800">{config.title}</h2>
          <p className="text-sm text-gray-600 mt-1">Composez votre devis en 3 étapes</p>
        </div>
      )}

      <div className={`flex flex-col lg:flex-row gap-4 ${embedded ? '' : 'lg:gap-6'}`}>
        <div className={`flex-1 min-w-0 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 ${embedded ? '' : 'shadow-sm'}`}>
          <WizardProgress step={wizardStep} />

          {wizardStep === 1 && (
            <StepZoneRoom
              wizardZone={wizardZone}
              selectedRoom={selectedRoom}
              interiorRooms={interiorRooms}
              exteriorRooms={exteriorRooms}
              handlers={handlers}
            />
          )}

          {wizardStep === 2 && (
            <StepInstallation
              wizardZone={wizardZone}
              selectedInstallationType={selectedInstallationType}
              selectedSecurityType={selectedSecurityType}
              handlers={handlers}
            />
          )}

          {wizardStep === 3 && (
            <StepPrestations
              groupedServices={groupedServicesStep3}
              selectedServices={selectedServices}
              serviceQuantities={serviceQuantities}
              serviceInterrupteurs={serviceInterrupteurs}
              handlers={handlers}
            />
          )}

          {showSuccessMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm text-center font-medium">{successMessage}</p>
            </div>
          )}

          {editingItemId && (
            <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-900 text-xs text-center">
                Modification en cours — enregistrez ou annulez pour recommencer une nouvelle pièce.
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-2 mt-6 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              {(wizardStep > 1 || (embedded && onPrevPhase)) && (
                <button
                  type="button"
                  onClick={() => {
                    if (wizardStep > 1) setWizardStep((s) => s - 1);
                    else onPrevPhase?.();
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Précédent
                </button>
              )}
              {!embedded && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Annuler
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {wizardStep < 3 && (
                <button
                  type="button"
                  disabled={wizardStep === 1 ? !canGoStep2 : !canGoStep3()}
                  onClick={() => setWizardStep((s) => s + 1)}
                  className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              )}
              {wizardStep === 3 && (
                <button
                  type="button"
                  disabled={!canAddToDevis}
                  onClick={addToDevis}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingItemId ? 'Enregistrer' : 'Ajouter au devis'}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className={`lg:w-[26rem] xl:w-[28rem] shrink-0 ${embedded ? 'mt-4 lg:mt-0' : 'mt-8 lg:mt-0'}`}>
          <DevisItemList
            variant="panel"
            devisItems={devisItems}
            onRemoveDevisItem={removeDevisItem}
            onEditItem={startEditDevisItem}
            copyTargetRooms={copyTargetRooms}
            onCopyToRoom={copyDevisItemToRoom}
            onGenerateDevis={() => generateDevis(onClose)}
          />
        </aside>
      </div>
    </div>
  );
}
