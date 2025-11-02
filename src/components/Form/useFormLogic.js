import { useState, useMemo, useEffect } from 'react';
import ApiService from '../../services/api';

// Configuration statique
const serviceConfig = {
  domotique: { title: 'Projet rénovation / installation neuf', categoryLabel: 'Domotique' },
  installation: { title: 'Installation électrique générale', categoryLabel: 'Installation' },
  portail: { title: 'Portail électrique / Volet roulant', categoryLabel: 'Portail / Volet' },
  securite: { title: 'Système de sécurité', categoryLabel: 'Sécurité' }
};

export const useFormLogic = (serviceType) => {
  // ==================== ÉTATS ====================
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedInstallationType, setSelectedInstallationType] = useState('');
  const [selectedSecurityType, setSelectedSecurityType] = useState('');
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [devisItems, setDevisItems] = useState([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [servicesByRoom, setServicesByRoom] = useState({});
  const [roomsByService, setRoomsByService] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // ==================== CONFIGURATION MÉMORISÉE ====================
  const config = useMemo(() => serviceConfig[serviceType], [serviceType]);
  const currentRooms = useMemo(() => roomsByService, [roomsByService]);
  const currentServicesByRoom = useMemo(() => servicesByRoom, [servicesByRoom]);
  
  const allPortailServices = useMemo(() => {
    const portailServices = servicesByRoom.portail || [];
    const voletServices = servicesByRoom.volet || [];
    return [...portailServices, ...voletServices];
  }, [servicesByRoom]);

  const currentSpecificServices = useMemo(() => {
    if (serviceType === 'portail') return allPortailServices;
    return servicesByRoom.specific || [];
  }, [servicesByRoom, serviceType, allPortailServices]);

  // ==================== CHARGEMENT DES DONNÉES DEPUIS L'API ====================
  const loadData = async () => {
    try {
      setIsLoadingPrices(true);
      setIsLoadingServices(true);
      
      // Charger uniquement la structure des services
      const structure = await ApiService.getFormStructure(serviceType);
      
      setServicesByRoom(structure.servicesByRoom || {});
      setRoomsByService(structure.pieces || []);
      
    } catch (error) {
      console.error('❌ Erreur chargement des données:', error);
      setServicesByRoom({});
      setRoomsByService([]);
    } finally {
      setIsLoadingPrices(false);
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  // ==================== CONFIGURATION DÉRIVÉE ====================
  const hasRooms = useMemo(() => {
    if (serviceType === 'portail' || serviceType === 'securite') return false;
    return currentRooms?.length > 0;
  }, [currentRooms, serviceType]);
  
  const hasSpecificServices = useMemo(() => 
    currentSpecificServices?.length > 0, [currentSpecificServices]
  );

  // ==================== FONCTIONS UTILITAIRES ====================
  
  const resetForm = () => {
    setSelectedRoom('');
    setSelectedServices([]);
    setSelectedInstallationType('');
    setSelectedSecurityType('');
  };


  const getServicesForRoom = (roomValue) => {
    if (!currentServicesByRoom || !roomValue) return [];
    
    // Logique simplifiée : retourner les services de la pièce sélectionnée
    if (serviceType === 'domotique' || serviceType === 'installation') {
      const commonServices = currentServicesByRoom.commun || [];
      const specificServices = currentServicesByRoom[roomValue] || [];
      
      const specificMap = new Map(specificServices.map(s => [s.value, s]));
      
      const mergedServices = commonServices.map(common => 
        specificMap.get(common.value) || common
      );
      
      const remainingSpecific = specificServices.filter(specific => 
        !commonServices.some(common => common.value === specific.value)
      );
      
      return [...mergedServices, ...remainingSpecific];
    }
    
    return currentServicesByRoom[roomValue] || [];
  };


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

    serviceToggle: (serviceValue) => {
      setSelectedServices(prev => 
        prev.includes(serviceValue) 
          ? prev.filter(s => s !== serviceValue)
          : [...prev, serviceValue]
      );
    },

    selectAll: () => {
      let allServices = [];
      
      if (hasRooms && selectedRoom) {
        allServices = getServicesForRoom(selectedRoom).map(s => s.value);
      } else if (hasSpecificServices) {
        allServices = currentSpecificServices.map(s => s.value);
      }
      
      setSelectedServices(allServices);
    },

    deselectAll: () => {
      setSelectedServices([]);
    },

    installationTypeChange: (e) => {
      setSelectedInstallationType(e.target.value);
    },

    securityTypeChange: (e) => {
      setSelectedSecurityType(e.target.value);
      setSelectedServices([]);
      setSelectedInstallationType('');
    }
  };

  // ==================== GESTION DES DEVIS ====================
  const addToDevis = () => {
    if (selectedServices.length === 0) return;

    let roomLabel = '';
    let roomValue = '';
    let selectedServiceLabels = [];

    if (hasRooms && selectedRoom) {
      roomLabel = currentRooms.find(r => r.value === selectedRoom)?.label;
      roomValue = selectedRoom;
      const services = getServicesForRoom(selectedRoom);
      selectedServiceLabels = selectedServices
        .map(value => services.find(s => s.value === value)?.label)
        .filter(Boolean);
    } else if (hasSpecificServices) {
      roomLabel = config.categoryLabel;
      roomValue = serviceType;
      selectedServiceLabels = selectedServices
        .map(value => currentSpecificServices.find(s => s.value === value)?.label)
        .filter(Boolean);
    }

    // Stocker uniquement les données brutes - le backend calculera les prix et coefficients
    const newDevisItem = {
      id: Date.now(),
      room: roomLabel,
      roomValue: roomValue,
      installationType: selectedInstallationType,
      serviceType: serviceType,
      services: selectedServiceLabels.map(label => ({
        label,
        quantity: 1
      })),
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
    
    // Mettre à jour uniquement la quantité - le backend calculera les prix
    setDevisItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      return {
        ...item,
        services: item.services.map((service, index) => {
          if (index !== serviceIndex) return service;
          return { ...service, quantity: qty };
        })
      };
    }));
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
    selectedServices,
    selectedInstallationType,
    selectedSecurityType,
    showDevisModal,
    devisItems,
    isLoadingPrices,
    isLoadingServices,
    
    // Configuration
    config,
    currentRooms,
    currentServicesByRoom,
    currentSpecificServices,
    hasRooms,
    hasSpecificServices,
    getServicesForRoom,
    
    // Handlers
    handlers,
    
    // Gestion des devis
    addToDevis,
    removeDevisItem,
    updateQuantity,
    generateDevis,
    setShowDevisModal,
    
    // Utilitaires
    resetForm,
    reloadData: loadData
  };
};
