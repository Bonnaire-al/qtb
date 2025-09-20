import { useState, useMemo } from 'react';
import { roomsByService, servicesByRoom, specificServices, serviceConfig, portailCategories, servicesByPortailCategory } from '../../data/servicesData';
import { prixPrestations } from '../../data/prix';

export const useFormLogic = (serviceType) => {
  // ==================== ÉTATS ====================
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedPortail, setSelectedPortail] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedInstallationType, setSelectedInstallationType] = useState('');
  const [selectedAlimentation, setSelectedAlimentation] = useState('');
  const [selectedConnexion, setSelectedConnexion] = useState('');
  const [selectedSecurityType, setSelectedSecurityType] = useState('');
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [devisItems, setDevisItems] = useState([]);

  // ==================== CONFIGURATION MÉMORISÉE ====================
  const config = useMemo(() => serviceConfig[serviceType], [serviceType]);
  const currentRooms = useMemo(() => roomsByService[serviceType], [serviceType]);
  const currentServicesByRoom = useMemo(() => servicesByRoom[serviceType], [serviceType]);
  const currentSpecificServices = useMemo(() => specificServices[serviceType], [serviceType]);

  // ==================== FONCTIONS UTILITAIRES ====================
  
  // Fonction de reset centralisée
  const resetForm = () => {
    setSelectedRoom('');
    setSelectedPortail('');
    setSelectedServices([]);
    setSelectedInstallationType('');
    setSelectedAlimentation('');
    setSelectedConnexion('');
    setSelectedSecurityType('');
  };

  // Fonctions de calcul de prix spécialisées
  const calculateRadiateurPrice = (service, quantity, coefficient) => {
    if (quantity === 1) {
      return service.prixBase * coefficient;
    } else if (quantity >= 2) {
      const firstUnitPrice = service.prixBase * coefficient;
      const secondUnitPrice = service.prixBase * 0.5;
      const additionalUnitsPrice = service.prixBase * (quantity - 2);
      return firstUnitPrice + secondUnitPrice + additionalUnitsPrice;
    }
    return 0;
  };

  const calculateCameraPrice = (service, quantity, coefficient) => {
    if (quantity === 1) {
      return service.prixBase * coefficient;
    } else if (quantity >= 2) {
      const firstUnitPrice = service.prixBase * coefficient;
      const additionalUnitsPrice = service.prixBase * (quantity - 1);
      return firstUnitPrice + additionalUnitsPrice;
    }
    return 0;
  };

  const calculateEclairagePrice = (service, quantity, coefficient) => {
    if (quantity === 1) {
      return service.prixBase * coefficient;
    } else if (quantity >= 2 && quantity <= 4) {
      const firstUnitPrice = service.prixBase * coefficient;
      const additionalUnitsPrice = service.prixBase * 0.25 * (quantity - 1);
      return firstUnitPrice + additionalUnitsPrice;
    } else if (quantity >= 5 && quantity <= 6) {
      const firstUnitPrice = service.prixBase * coefficient;
      const middleUnitsPrice = service.prixBase * 0.25 * 3;
      return firstUnitPrice + middleUnitsPrice;
    } else if (quantity >= 7) {
      const firstUnitPrice = service.prixBase * coefficient;
      const middleUnitsPrice = service.prixBase * 0.25 * 3;
      const highQuantityPrice = service.prixBase * 0.25 * (quantity - 6);
      return firstUnitPrice + middleUnitsPrice + highQuantityPrice;
    }
    return 0;
  };

  const calculateMiroirPrice = (service, quantity, coefficient) => {
    if (quantity === 1) {
      return service.prixBase * coefficient;
    } else if (quantity >= 2 && quantity <= 4) {
      // 2ème, 3ème, 4ème au prix de base uniquement
      const firstUnitPrice = service.prixBase * coefficient;
      const additionalUnitsPrice = service.prixBase * (quantity - 1);
      return firstUnitPrice + additionalUnitsPrice;
    } else if (quantity >= 5) {
      // 5ème et plus : prix de base pour toutes les unités supplémentaires
      const firstUnitPrice = service.prixBase * coefficient;
      const additionalUnitsPrice = service.prixBase * (quantity - 1);
      return firstUnitPrice + additionalUnitsPrice;
    }
    return 0;
  };

  // Fonction utilitaire pour obtenir le prix HT d'un service
  const getPrixHT = (serviceLabel, room = selectedRoom, portailCategory = selectedPortail) => {
    if (hasRooms && room && prixPrestations[serviceType]) {
      if (serviceType === 'appareillage' || serviceType === 'domotique' || serviceType === 'installation') {
        let prixSection = serviceType === 'appareillage' 
          ? (room === 'exterieur' ? prixPrestations[serviceType].exterieur : prixPrestations[serviceType].commun)
          : prixPrestations[serviceType].commun;
        
        let serviceKey = Object.keys(prixSection).find(key => 
          prixSection[key].description === serviceLabel
        );
        
        if (!serviceKey && (serviceType === 'domotique' || serviceType === 'installation') && prixPrestations[serviceType][room]) {
          prixSection = prixPrestations[serviceType][room];
          serviceKey = Object.keys(prixSection).find(key => 
            prixSection[key].description === serviceLabel
          );
        }
        
        if (serviceKey) {
          return prixSection[serviceKey].prixHT;
        }
      } else {
        const serviceKey = Object.keys(prixPrestations[serviceType][room]).find(key => 
          prixPrestations[serviceType][room][key].description === serviceLabel
        );
        if (serviceKey) {
          return prixPrestations[serviceType][room][serviceKey].prixHT;
        }
      }
    } else if (hasPortailCategories && portailCategory && prixPrestations[serviceType] && prixPrestations[serviceType][portailCategory]) {
      const serviceKey = Object.keys(prixPrestations[serviceType][portailCategory]).find(key => 
        prixPrestations[serviceType][portailCategory][key].description === serviceLabel
      );
      if (serviceKey) {
        return prixPrestations[serviceType][portailCategory][serviceKey].prixHT;
      }
    } else if (hasSpecificServices && prixPrestations[serviceType]) {
      const serviceKey = Object.keys(prixPrestations[serviceType]).find(key => 
        prixPrestations[serviceType][key].description === serviceLabel
      );
      if (serviceKey) {
        return prixPrestations[serviceType][serviceKey].prixHT;
      }
    }
    return 0;
  };

  // ==================== FONCTIONS DE CALCUL DE PRIX ====================

  // Fonction helper pour obtenir les services selon la pièce (gère la structure optimisée)
  const getServicesForRoom = (roomValue) => {
    if (!currentServicesByRoom || !roomValue) return [];
    
    // Pour l'appareillage, utiliser la structure optimisée existante
    if (serviceType === 'appareillage') {
      return roomValue === 'exterieur' 
        ? currentServicesByRoom.exterieur 
        : currentServicesByRoom.commun;
    }
    
    // Pour la domotique et l'installation, utiliser la nouvelle structure optimisée
    if (serviceType === 'domotique' || serviceType === 'installation') {
      const commonServices = currentServicesByRoom.commun || [];
      const specificServices = currentServicesByRoom[roomValue] || [];
      
      // Créer un map des services spécifiques par leur value pour un remplacement rapide
      const specificServicesMap = new Map();
      specificServices.forEach(service => {
        specificServicesMap.set(service.value, service);
      });
      
      // Remplacer les services communs par les services spécifiques s'ils existent
      const mergedServices = commonServices.map(commonService => {
        return specificServicesMap.has(commonService.value) 
          ? specificServicesMap.get(commonService.value)
          : commonService;
      });
      
      // Ajouter les services spécifiques qui n'existent pas dans commun
      const remainingSpecificServices = specificServices.filter(specificService => 
        !commonServices.some(commonService => commonService.value === specificService.value)
      );
      
      return [...mergedServices, ...remainingSpecificServices];
    }
    
    // Pour les autres services, utiliser la structure classique
    return currentServicesByRoom[roomValue] || [];
  };

  // Fonction utilitaire simplifiée pour calculer le prix total selon la quantité et le type de service
  const calculateServicePrice = (service, quantity, coefficient) => {
    const isSpecialService = (serviceType === 'domotique' || serviceType === 'installation') && 
      (service.label.toLowerCase().includes('éclairage') || 
       service.label.toLowerCase().includes('pris') ||
       service.label.toLowerCase().includes('internet') ||
       service.label.toLowerCase().includes('tv') ||
       service.label.toLowerCase().includes('radiateur') ||
       service.label.toLowerCase().includes('caméra') ||
       service.label.toLowerCase().includes('miroir'));
    
    if (isSpecialService) {
      const isRadiateur = service.label.toLowerCase().includes('radiateur');
      const isCamera = service.label.toLowerCase().includes('caméra');
      const isMiroir = service.label.toLowerCase().includes('miroir');
      
      if (isRadiateur) {
        return calculateRadiateurPrice(service, quantity, coefficient);
      } else if (isCamera) {
        return calculateCameraPrice(service, quantity, coefficient);
      } else if (isMiroir) {
        // Logique spéciale pour les miroirs : 2ème, 3ème, 4ème au prix de base uniquement
        return calculateMiroirPrice(service, quantity, coefficient);
      } else {
        return calculateEclairagePrice(service, quantity, coefficient);
      }
    }
    
    // Pour tous les autres services : prix de base avec coefficient pour toutes les unités
    return service.prixBase * coefficient * quantity;
  };

  // ==================== CONFIGURATION DÉRIVÉE ====================
  const hasRooms = useMemo(() => currentRooms && currentRooms.length > 0, [currentRooms]);
  const hasPortailCategories = useMemo(() => serviceType === 'portail', [serviceType]);
  const hasSpecificServices = useMemo(() => currentSpecificServices && currentSpecificServices.length > 0, [currentSpecificServices]);

  // ==================== HANDLERS ====================
  const handlers = {
    submit: (e) => {
      e.preventDefault();
      console.log('Prestations sélectionnées:', selectedServices);
    },

    roomChange: (e) => {
    setSelectedRoom(e.target.value);
    setSelectedServices([]);
    setSelectedInstallationType('');
    setSelectedSecurityType('');
    },

    portailChange: (e) => {
      setSelectedPortail(e.target.value);
    setSelectedServices([]);
    setSelectedInstallationType('');
    setSelectedAlimentation('');
    setSelectedConnexion('');
    setSelectedSecurityType('');
    },

    serviceToggle: (serviceValue) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceValue)) {
        return prev.filter(service => service !== serviceValue);
      } else {
        return [...prev, serviceValue];
      }
    });
    },

    selectAll: () => {
      let allServices = [];

    if (hasRooms && selectedRoom) {
      const services = getServicesForRoom(selectedRoom);
        allServices = services.map(service => service.value);
      } else if (hasPortailCategories && selectedPortail && servicesByPortailCategory[selectedPortail]) {
        allServices = servicesByPortailCategory[selectedPortail].map(service => service.value);
    } else if (hasSpecificServices) {
        allServices = currentSpecificServices.map(service => service.value);
      }
      
      setSelectedServices(allServices);
    },

    deselectAll: () => {
    setSelectedServices([]);
    },

    installationTypeChange: (e) => {
    setSelectedInstallationType(e.target.value);
    },

    alimentationChange: (e) => {
    setSelectedAlimentation(e.target.value);
    },

    connexionChange: (e) => {
    setSelectedConnexion(e.target.value);
    },

    securityTypeChange: (e) => {
    setSelectedSecurityType(e.target.value);
      setSelectedServices([]);
    }
  };

  // ==================== GESTION DES DEVIS ====================
  const addToDevis = () => {
    if (selectedServices.length === 0) return;

    // Déterminer le label de la pièce/catégorie
      let roomLabel = '';
      let selectedServiceLabels = [];

      if (hasRooms && selectedRoom) {
        roomLabel = currentRooms.find(r => r.value === selectedRoom)?.label;
        const services = getServicesForRoom(selectedRoom);
        selectedServiceLabels = selectedServices.map(serviceValue => 
          services.find(s => s.value === serviceValue)?.label
        ).filter(Boolean);
    } else if (hasPortailCategories && selectedPortail) {
      roomLabel = portailCategories.find(c => c.value === selectedPortail)?.label;
        selectedServiceLabels = selectedServices.map(serviceValue => 
        servicesByPortailCategory[selectedPortail].find(s => s.value === serviceValue)?.label
        ).filter(Boolean);
      } else if (hasSpecificServices) {
        roomLabel = config.categoryLabel;
        selectedServiceLabels = selectedServices.map(serviceValue => 
          currentSpecificServices.find(s => s.value === serviceValue)?.label
        ).filter(Boolean);
      }

    // Coefficients selon le type d'installation
      const installationCoefficients = {
      'saignee_encastre': 2.25,
      'saillie_moulure': 1.75,
      'cloison_creuse': 1.50,
      'alimentation_existante': 1.0
    };

      const coefficient = serviceType === 'appareillage' ? 1.0 : (installationCoefficients[selectedInstallationType] || 1.0);

      const newDevisItem = {
        id: Date.now(),
        room: roomLabel,
        installationType: selectedInstallationType,
        alimentation: selectedAlimentation,
        connexion: selectedConnexion,
        coefficient: coefficient,
      services: selectedServiceLabels.map(serviceLabel => {
        const prixHT = getPrixHT(serviceLabel);
        const serviceData = {
          label: serviceLabel,
            quantity: 1,
          prixBase: prixHT
          };
        serviceData.priceHT = calculateServicePrice(serviceData, 1, coefficient);
        return serviceData;
        }),
        completed: false
      };

      setDevisItems(prev => [...prev, newDevisItem]);
    resetForm();
  };

  const removeDevisItem = (itemId) => {
    setDevisItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, serviceIndex, quantity) => {
    const qty = parseInt(quantity) || 1;
    
    setDevisItems(prev => prev.map(item => 
      item.id === itemId 
        ? {
            ...item,
            services: item.services.map((service, index) => {
              if (index === serviceIndex) {
                const totalPrice = calculateServicePrice(service, qty, item.coefficient);
                return { 
                  ...service, 
                  quantity: qty,
                  priceHT: totalPrice
                };
              }
              return service;
            })
          }
        : item
    ));
  };

  const generateDevis = (onClose) => {
    if (devisItems.length === 0) return;
    setShowDevisModal(false);
    onClose(devisItems);
  };

  // ==================== EXPORT ====================
  return {
    // États
    selectedRoom,
    selectedPortail,
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
    getServicesForRoom,
    
    // Handlers regroupés
    handlers,
    
    // Fonctions de gestion des devis
    addToDevis,
    removeDevisItem,
    updateQuantity,
    generateDevis,
    setShowDevisModal,
    
    // Fonctions utilitaires
    resetForm
  };
};
