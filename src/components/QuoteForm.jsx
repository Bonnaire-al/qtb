import React, { useState } from 'react';
import { rooms, servicesByRoom, specificServices, serviceConfig } from '../data/servicesData';
import { prixPrestations } from '../data/prix';

export default function Form({ serviceType, onClose, onCancel }) {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [devisItems, setDevisItems] = useState([]);

  // Configuration du service actuel
  const config = serviceConfig[serviceType];
  const currentRooms = rooms[serviceType];
  const currentServicesByRoom = servicesByRoom[serviceType];
  const currentSpecificServices = specificServices[serviceType];

  // Détermine si le service utilise des pièces ou des services spécifiques
  const hasRooms = currentRooms && currentRooms.length > 0;
  const hasSpecificServices = currentSpecificServices && currentSpecificServices.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Prestations sélectionnées:', selectedServices);
    onClose();
  };

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
    setSelectedServices([]);
  };

  const handleServiceToggle = (serviceValue) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceValue)) {
        return prev.filter(service => service !== serviceValue);
      } else {
        return [...prev, serviceValue];
      }
    });
  };

  const handleSelectAll = () => {
    if (hasRooms && selectedRoom && currentServicesByRoom[selectedRoom]) {
      const allServices = currentServicesByRoom[selectedRoom].map(service => service.value);
      setSelectedServices(allServices);
    } else if (hasSpecificServices) {
      const allServices = currentSpecificServices.map(service => service.value);
      setSelectedServices(allServices);
    }
  };

  const handleDeselectAll = () => {
    setSelectedServices([]);
  };

  const handleAddToDevis = () => {
    if (selectedServices.length > 0) {
      let roomLabel = '';
      let selectedServiceLabels = [];

      if (hasRooms && selectedRoom) {
        roomLabel = currentRooms.find(r => r.value === selectedRoom)?.label;
        selectedServiceLabels = selectedServices.map(serviceValue => 
          currentServicesByRoom[selectedRoom].find(s => s.value === serviceValue)?.label
        ).filter(Boolean);
      } else if (hasSpecificServices) {
        roomLabel = config.categoryLabel;
        selectedServiceLabels = selectedServices.map(serviceValue => 
          currentSpecificServices.find(s => s.value === serviceValue)?.label
        ).filter(Boolean);
      }

      const newDevisItem = {
        id: Date.now(),
        room: roomLabel,
        services: selectedServiceLabels.map(service => {
          // Récupérer le prix automatiquement
          let prixHT = 0;
          if (hasRooms && selectedRoom && prixPrestations[serviceType] && prixPrestations[serviceType][selectedRoom]) {
            const serviceKey = Object.keys(prixPrestations[serviceType][selectedRoom]).find(key => 
              prixPrestations[serviceType][selectedRoom][key].description === service
            );
            if (serviceKey) {
              prixHT = prixPrestations[serviceType][selectedRoom][serviceKey].prixHT;
            }
          } else if (hasSpecificServices && prixPrestations[serviceType]) {
            const serviceKey = Object.keys(prixPrestations[serviceType]).find(key => 
              prixPrestations[serviceType][key].description === service
            );
            if (serviceKey) {
              prixHT = prixPrestations[serviceType][serviceKey].prixHT;
            }
          }
          
          return {
            label: service,
            quantity: 1,
            priceHT: prixHT
          };
        }),
        completed: false
      };

      setDevisItems(prev => [...prev, newDevisItem]);
      
      // Reset form
      setSelectedRoom('');
      setSelectedServices([]);
    }
  };

  const handleRemoveDevisItem = (itemId) => {
    setDevisItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, serviceIndex, quantity) => {
    setDevisItems(prev => prev.map(item => 
      item.id === itemId 
        ? {
            ...item,
            services: item.services.map((service, index) => 
              index === serviceIndex 
                ? { ...service, quantity: parseInt(quantity) || 1 }
                : service
            )
          }
        : item
    ));
  };


  const handleGenerateDevis = () => {
    if (devisItems.length === 0) return;
    setShowDevisModal(false);
    onClose(devisItems); // Passer les devisItems au composant parent
  };

  // Rendu des services selon le type
  const renderServices = () => {
    if (hasRooms && selectedRoom && currentServicesByRoom[selectedRoom]) {
      return currentServicesByRoom[selectedRoom].map((service) => (
        <label key={service.value} className="flex items-center space-x-2 p-2 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={selectedServices.includes(service.value)}
            onChange={() => handleServiceToggle(service.value)}
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
            onChange={() => handleServiceToggle(service.value)}
            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-1"
          />
          <span className="text-gray-700 text-sm">{service.label}</span>
        </label>
      ));
    }
    return null;
  };

  return (
    <>
      <div className="max-h-[80vh] overflow-y-auto max-w-md mx-auto px-8">
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Checklist des prestations */}
          {(hasRooms && selectedRoom) || hasSpecificServices ? (
            <div>
              <h3 className="text-base font-semibold text-cyan-800 mb-3">
                {hasRooms && selectedRoom 
                  ? `Prestations pour ${currentRooms.find(r => r.value === selectedRoom)?.label}`
                  : `Prestations ${config.categoryLabel.toLowerCase()}`
                }
              </h3>
              
              {/* Boutons Tout sélectionner / Tout désélectionner */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3 py-1 bg-white border-2 border-blue-400 hover:bg-blue-50 text-blue-600 text-xs rounded-lg transition-colors"
                >
                  Tout sélectionner
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-3 py-1 bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-700 text-xs rounded-lg transition-colors"
                >
                  Tout désélectionner
                </button>
              </div>

              {/* Checklist des prestations avec scroll */}
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                {renderServices()}
              </div>

              {/* Affichage du nombre de prestations sélectionnées */}
              {selectedServices.length > 0 && (
                <div className="mt-3 p-2 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <p className="text-cyan-800 font-medium text-sm">
                    {selectedServices.length} prestation(s) sélectionnée(s)
                  </p>
                </div>
              )}
            </div>
          ) : null}

          <div className="flex justify-between items-center pt-2">
            {/* Div pour Ajouter prestation et Annuler devis */}
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={handleAddToDevis}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs"
                disabled={selectedServices.length === 0}
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
      {showDevisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header avec bouton fermer */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-cyan-800">Devis - Prestations ajoutées</h2>
              <button
                onClick={() => setShowDevisModal(false)}
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
                        <h3 className="font-semibold text-cyan-800">{item.room}</h3>
                        <button
                          onClick={() => handleRemoveDevisItem(item.id)}
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
                                onChange={(e) => handleQuantityChange(item.id, index, e.target.value)}
                                className="w-12 h-6 px-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              />
                              <span className="text-xs text-gray-500">Prix HT:</span>
                              <span className="text-xs font-medium text-green-600">
                                {service.priceHT > 0 ? `${service.priceHT.toFixed(2)} €` : 'À définir'}
                              </span>
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
                onClick={() => setShowDevisModal(false)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Autre prestation
              </button>
              <button
                onClick={handleGenerateDevis}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                disabled={devisItems.length === 0}
              >
                Générer le devis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
