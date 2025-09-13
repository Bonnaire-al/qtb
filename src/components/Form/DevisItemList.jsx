import React from 'react';

const DevisItemList = ({
  showDevisModal,
  devisItems,
  onCloseModal,
  onRemoveDevisItem,
  onQuantityChange,
  onGenerateDevis
}) => {
  if (!showDevisModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header avec bouton fermer */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-cyan-800">Devis - Prestations ajoutées</h2>
          <button
            onClick={onCloseModal}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {devisItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune prestation ajoutée au devis</p>
          ) : (
            <div className="space-y-4">
              {devisItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-cyan-800">{item.room}</h3>
                      {item.installationType && (
                        <p className="text-xs text-gray-600 mt-1">
                          Type: {item.installationType === 'saignee_encastre' ? 'Saignée/Encastré' : 
                                 item.installationType === 'saillie_moulure' ? 'Saillie/Moulure' :
                                 item.installationType === 'cloison_creuse' ? 'Cloison creuse' : item.installationType}
                          {item.coefficient > 1 && (
                            <span className="ml-2 text-green-600 font-medium">
                              (Coefficient: {item.coefficient}x)
                            </span>
                          )}
                        </p>
                      )}
                      {item.alimentation && (
                        <p className="text-xs text-gray-600 mt-1">
                          Alimentation: {item.alimentation === 'alimentation_existante' ? 'Existante' : 'Inexistante'}
                        </p>
                      )}
                      {item.connexion && (
                        <p className="text-xs text-gray-600 mt-1">
                          Connexion: {item.connexion === 'connecte' ? 'Connecté (app mobile)' : 'Classique'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveDevisItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {item.services.map((service, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                          <span className="flex-1">{service.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Qté:</span>
                          <input
                            type="number"
                            min="1"
                            value={service.quantity}
                            onChange={(e) => onQuantityChange(item.id, index, e.target.value)}
                            className="w-12 h-6 px-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec boutons */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onCloseModal}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Autre prestation
          </button>
          <button
            onClick={onGenerateDevis}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            disabled={devisItems.length === 0}
          >
            Générer le devis
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevisItemList;
