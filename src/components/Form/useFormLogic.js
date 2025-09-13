import { useState } from 'react';
import { roomsByService, servicesByRoom, specificServices, serviceConfig, portailCategories, servicesByPortailCategory } from '../../data/servicesData';
import { prixPrestations } from '../../data/prix';

export const useFormLogic = (serviceType) => {
  // États
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedPortailCategory, setSelectedPortailCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedInstallationType, setSelectedInstallationType] = useState('');
  const [selectedAlimentation, setSelectedAlimentation] = useState('');
  const [selectedConnexion, setSelectedConnexion] = useState('');
  const [selectedSecurityType, setSelectedSecurityType] = useState('');
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [devisItems, setDevisItems] = useState([]);

  // Configuration du service actuel
  const config = serviceConfig[serviceType];
  const currentRooms = roomsByService[serviceType];
  const currentServicesByRoom = servicesByRoom[serviceType];
  const currentSpecificServices = specificServices[serviceType];

  // Détermine si le service utilise des pièces, des catégories portail/volet ou des services spécifiques
  const hasRooms = currentRooms && currentRooms.length > 0;
  const hasPortailCategories = serviceType === 'portail';
  const hasSpecificServices = currentSpecificServices && currentSpecificServices.length > 0;

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Prestations sélectionnées:', selectedServices);
  };

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
    setSelectedServices([]);
    setSelectedInstallationType('');
    setSelectedSecurityType('');
  };

  const handlePortailCategoryChange = (e) => {
    setSelectedPortailCategory(e.target.value);
    setSelectedServices([]);
    setSelectedInstallationType('');
    setSelectedAlimentation('');
    setSelectedConnexion('');
    setSelectedSecurityType('');
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
    } else if (hasPortailCategories && selectedPortailCategory && servicesByPortailCategory[selectedPortailCategory]) {
      const allServices = servicesByPortailCategory[selectedPortailCategory].map(service => service.value);
      setSelectedServices(allServices);
    } else if (hasSpecificServices) {
      const allServices = currentSpecificServices.map(service => service.value);
      setSelectedServices(allServices);
    }
  };

  const handleDeselectAll = () => {
    setSelectedServices([]);
  };

  const handleInstallationTypeChange = (e) => {
    setSelectedInstallationType(e.target.value);
  };

  const handleAlimentationChange = (e) => {
    setSelectedAlimentation(e.target.value);
  };

  const handleConnexionChange = (e) => {
    setSelectedConnexion(e.target.value);
  };

  const handleSecurityTypeChange = (e) => {
    setSelectedSecurityType(e.target.value);
    setSelectedServices([]); // Reset des services sélectionnés
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
      } else if (hasPortailCategories && selectedPortailCategory) {
        roomLabel = portailCategories.find(c => c.value === selectedPortailCategory)?.label;
        selectedServiceLabels = selectedServices.map(serviceValue => 
          servicesByPortailCategory[selectedPortailCategory].find(s => s.value === serviceValue)?.label
        ).filter(Boolean);
      } else if (hasSpecificServices) {
        roomLabel = config.categoryLabel;
        selectedServiceLabels = selectedServices.map(serviceValue => 
          currentSpecificServices.find(s => s.value === serviceValue)?.label
        ).filter(Boolean);
      }

      // Coefficients selon le type d'installation
      const installationCoefficients = {
        'saignee_encastre': 1.3,     // +30% pour saignée/encastré
        'saillie_moulure': 1.15,     // +15% pour saillie/moulure
        'cloison_creuse': 1.0        // +0% pour cloison creuse
      };

      const coefficient = installationCoefficients[selectedInstallationType] || 1.0;

      const newDevisItem = {
        id: Date.now(),
        room: roomLabel,
        installationType: selectedInstallationType,
        alimentation: selectedAlimentation,
        connexion: selectedConnexion,
        coefficient: coefficient,
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
          } else if (hasPortailCategories && selectedPortailCategory && prixPrestations[serviceType] && prixPrestations[serviceType][selectedPortailCategory]) {
            const serviceKey = Object.keys(prixPrestations[serviceType][selectedPortailCategory]).find(key => 
              prixPrestations[serviceType][selectedPortailCategory][key].description === service
            );
            if (serviceKey) {
              prixHT = prixPrestations[serviceType][selectedPortailCategory][serviceKey].prixHT;
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
            priceHT: prixHT * coefficient // Appliquer le coefficient
          };
        }),
        completed: false
      };

      setDevisItems(prev => [...prev, newDevisItem]);
      
      // Reset form
      setSelectedRoom('');
      setSelectedPortailCategory('');
      setSelectedServices([]);
      setSelectedInstallationType('');
      setSelectedAlimentation('');
      setSelectedConnexion('');
      setSelectedSecurityType('');
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

  const handleGenerateDevis = (onClose) => {
    if (devisItems.length === 0) return;
    setShowDevisModal(false);
    onClose(devisItems); // Passer les devisItems au composant parent
  };

  return {
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
  };
};
