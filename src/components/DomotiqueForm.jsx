import React, { useState } from 'react';

export default function DomotiqueForm1({ onClose, onCancel }) {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [devisItems, setDevisItems] = useState([]);
  const [showOtherServicesModal, setShowOtherServicesModal] = useState(false);

  const rooms = [
    { value: 'chambre', label: 'Chambre' },
    { value: 'salon', label: 'Salon' },
    { value: 'cuisine', label: 'Cuisine' },
    { value: 'salle_de_bain', label: 'Salle de bain' },
    { value: 'toilette', label: 'Toilette' },
    { value: 'couloir', label: 'Couloir' },
    { value: 'cellier', label: 'Cellier' },
    { value: 'cave', label: 'Cave' },
    { value: 'exterieur', label: 'Extérieur' }
  ];

  const servicesByRoom = {
    chambre: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' }
    ],
    salon: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' }
    ],
    cuisine: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' },
      { value: 'plaque_cuisson', label: 'Plaque cuisson connectée' },
      { value: 'four', label: 'Four connecté' },
      { value: 'lave_linge_vaisselle', label: 'Lave linge/vaisselle connecté' },
      { value: 'applique', label: 'Applique connectée' }
    ],
    salle_de_bain: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'sèche serviette connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'applique_miroir', label: 'Applique/miroir connecté' }
    ],
    toilette: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prise connectée/détecteur' },
      { value: 'applique_miroir', label: 'Applique/miroir connecté' }
    ],
    couloir: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' }
    ],
    cellier: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' },
      { value: 'lave_linge_vaisselle', label: 'Lave linge/vaisselle connecté' }
    ],
    cave: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'lave_linge_seche_linge', label: 'Lave-linge/sèche-linge connecté' }
    ],
         exterieur: [
       { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
       { value: 'prises', label: 'Prise connectée/commandée' },
       { value: 'interphone', label: 'Interphone connecté' }
     ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Prestations sélectionnées:', selectedServices);
    onClose();
  };

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
    setSelectedServices([]); // Reset services selection when room changes
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
    if (selectedRoom && servicesByRoom[selectedRoom]) {
      const allServices = servicesByRoom[selectedRoom].map(service => service.value);
      setSelectedServices(allServices);
    }
  };

  const handleDeselectAll = () => {
    setSelectedServices([]);
  };

  const handleAddToDevis = () => {
    if (selectedRoom && selectedServices.length > 0) {
      const roomLabel = rooms.find(r => r.value === selectedRoom)?.label;
      const selectedServiceLabels = selectedServices.map(serviceValue => 
        servicesByRoom[selectedRoom].find(s => s.value === serviceValue)?.label
      ).filter(Boolean);

      const newDevisItem = {
        id: Date.now(),
        room: roomLabel,
        services: selectedServiceLabels,
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

  const handleGenerateDevis = () => {
    console.log('Devis généré:', devisItems);
    setShowDevisModal(false);
    onClose();
  };



  return (
    <>
      <div className="max-h-[80vh] overflow-y-auto max-w-md mx-auto px-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre du projet */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-cyan-800">Projet rénovation / installation neuf</h2>
          </div>

          {/* Première partie : Sélection de la pièce */}
          <div>
            <select
              value={selectedRoom}
              onChange={handleRoomChange}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              required
            >
              <option value="">Choisissez la pièce</option>
              {rooms.map((room) => (
                <option key={room.value} value={room.value}>
                  {room.label}
                </option>
              ))}
            </select>
          </div>

          {/* Deuxième partie : Checklist des prestations (apparaît seulement si une pièce est sélectionnée) */}
          {selectedRoom && (
            <div>
              <h3 className="text-base font-semibold text-cyan-800 mb-3">
                Prestations pour {rooms.find(r => r.value === selectedRoom)?.label}
              </h3>
              
              {/* Boutons Tout sélectionner / Tout désélectionner */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                >
                  Tout sélectionner
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                >
                  Tout désélectionner
                </button>
              </div>

              {/* Checklist des prestations avec scroll */}
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                {servicesByRoom[selectedRoom]?.map((service) => (
                  <label key={service.value} className="flex items-center space-x-2 p-2 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.value)}
                      onChange={() => handleServiceToggle(service.value)}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-1"
                    />
                    <span className="text-gray-700 text-sm">{service.label}</span>
                  </label>
                ))}
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
          )}

                     <div className="flex justify-center space-x-4 pt-2">
             {/* Div pour le bouton Devis seul */}
             <div>
               <button
                 type="button"
                 onClick={() => setShowDevisModal(true)}
                 className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center space-x-1 text-xs"
                 disabled={devisItems.length === 0}
               >
                 <span>Devis</span>
                 <span className="bg-white text-cyan-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                   {devisItems.length}
                 </span>
               </button>
             </div>
             
                           {/* Div pour Ajouter pièce et Annuler devis */}
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
           </div>
        </form>
      </div>

      {/* Modal Devis */}
      {showDevisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
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
                <p className="text-gray-500 text-center py-8">Aucune pièce ajoutée au devis</p>
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
                             <div className="flex items-center">
                               <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                               {service}
                             </div>
                             <div className="flex items-center space-x-2">
                               <span className="text-xs text-gray-500">Qté:</span>
                               <input
                                 type="number"
                                 min="1"
                                 defaultValue="1"
                                 className="w-12 h-6 px-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                 placeholder="1"
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
                  onClick={() => setShowDevisModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Retour
                </button>
                                 <button
                   onClick={() => setShowOtherServicesModal(true)}
                   className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                 >
                   Autre service
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

               {/* Modal Autres Services */}
        {showOtherServicesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              {/* Header avec bouton fermer */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-cyan-800">Autres Services</h2>
                <button
                  onClick={() => setShowOtherServicesModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Contenu du modal */}
              <div className="p-6">
                <div className="space-y-4">
                  <div 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setShowOtherServicesModal(false);
                      // Navigation vers InstallationForm
                      window.location.href = '/quote?service=installation';
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <h3 className="font-semibold text-cyan-800 text-lg">Installation électrique générale</h3>
                        <p className="text-sm text-gray-600">Installation complète ou rénovation électrique</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setShowOtherServicesModal(false);
                      // Navigation vers SecuriteForm
                      window.location.href = '/quote?service=securite';
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <h3 className="font-semibold text-cyan-800 text-lg">Système de sécurité</h3>
                        <p className="text-sm text-gray-600">Alarmes, caméras et systèmes de surveillance</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setShowOtherServicesModal(false);
                      // Navigation vers PortailForm
                      window.location.href = '/quote?service=portail';
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🚪</span>
                      <div>
                        <h3 className="font-semibold text-cyan-800 text-lg">Portail électrique / Volet roulant</h3>
                        <p className="text-sm text-gray-600">Installation et maintenance de portails et volets</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowOtherServicesModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}


     </>
   );
 } 