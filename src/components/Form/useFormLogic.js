import { useState, useMemo, useEffect } from 'react';
import ApiService from '../../services/api';

// Configuration statique
const serviceConfig = {
  domotique: { title: 'Projet rénovation / installation neuf', categoryLabel: 'Domotique' },
  installation: { title: 'Installation électrique générale', categoryLabel: 'Installation' },
  portail: { title: 'Portail électrique / Volet roulant', categoryLabel: 'Portail / Volet' },
  securite: { title: 'Système de sécurité', categoryLabel: 'Sécurité' }
};

export const useFormLogic = (serviceType, tableauData = null) => {
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    // Valeurs par défaut pour activer l'ajout au devis : Sécurité → wifi, Portail → saignée
    if (serviceType === 'securite') {
      setSelectedSecurityType('wifi');
    }
    if (serviceType === 'portail') {
      setSelectedInstallationType('saignee_encastre');
    }
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
      
      // Trier par ordre alphabétique selon le label
      const allServices = [...mergedServices, ...remainingSpecific];
      return allServices.sort((a, b) => {
        const labelA = (a.label || '').toLowerCase();
        const labelB = (b.label || '').toLowerCase();
        return labelA.localeCompare(labelB, 'fr', { sensitivity: 'base' });
      });
    }
    
    // Pour les autres types, trier aussi par ordre alphabétique
    const services = currentServicesByRoom[roomValue] || [];
    return services.sort((a, b) => {
      const labelA = (a.label || '').toLowerCase();
      const labelB = (b.label || '').toLowerCase();
      return labelA.localeCompare(labelB, 'fr', { sensitivity: 'base' });
    });
  };


  // ==================== HANDLERS ====================
  const handlers = {
    submit: (e) => {
      e.preventDefault();
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
  
  // Fonction pour calculer et mettre à jour l'item tableau
  const updateTableauItem = async (currentDevisItems) => {
    // Pas de tableau électrique pour sécurité et portail
    if (serviceType === 'securite' || serviceType === 'portail') {
      return currentDevisItems;
    }
    // Vérifier si on doit calculer le tableau
    if (!tableauData || tableauData.choice === 'garder') {
      return currentDevisItems;
    }

    // Filtrer les items non-tableau pour le calcul
    const prestationsItems = currentDevisItems.filter(item => item.type !== 'tableau');
    
    try {
      // Calculer les matériels du tableau via le backend
      const response = await ApiService.calculateTableau(prestationsItems, tableauData);
      const result = response;
      
      // Trouver le tableau existant selon le type de choix
      let existingTableauIndex = -1;
      let tableauItemId = '';
      
      if (tableauData.choice === 'inexistant') {
        // Pour "nouveau tableau", utiliser un ID fixe
        tableauItemId = `tableau-inexistant-${serviceType}`;
        existingTableauIndex = currentDevisItems.findIndex(item => 
          item.type === 'tableau' && 
          item.tableauData?.choice === 'inexistant' &&
          !item.tableauData?.questionnaire
        );
      } else if (tableauData.choice === 'changer') {
        // Pour "changer mon tableau", utiliser un ID basé sur le questionnaire
        if (tableauData.changeType === 'commencer') {
          tableauItemId = `tableau-changer-commencer-${serviceType}`;
          existingTableauIndex = currentDevisItems.findIndex(item => 
            item.type === 'tableau' && 
            item.tableauData?.choice === 'changer' &&
            item.tableauData?.changeType === 'commencer'
          );
        } else {
          // "uniquement" - tableau créé lors de la validation du questionnaire, pas ici
          return currentDevisItems;
        }
      }
      
      const tableauItem = {
        id: existingTableauIndex >= 0 ? currentDevisItems[existingTableauIndex].id : tableauItemId,
        type: 'tableau',
        room: 'Tableau électrique',
        serviceType: serviceType,
        tableauData: tableauData,
        services: result.materiels,
        mainOeuvre: result.mainOeuvre,
        rangees: result.rangees,
        completed: false
      };

      let updatedItems;
      if (existingTableauIndex >= 0) {
        // Mettre à jour l'item existant
        updatedItems = [...currentDevisItems];
        updatedItems[existingTableauIndex] = tableauItem;
      } else {
        // Ajouter le nouvel item
        updatedItems = [...currentDevisItems, tableauItem];
      }

      return updatedItems;
    } catch (error) {
      console.error('❌ Erreur calcul tableau:', error);
      // En cas d'erreur, retourner les items sans modification
      return currentDevisItems;
    }
  };

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

    // Sécurité : "Wifi" → type wifi ; "Filaire" → un des 4 types (passage des câbles)
    const effectiveInstallationType = serviceType === 'securite' && selectedSecurityType === 'wifi'
      ? 'wifi'
      : selectedInstallationType;

    // Stocker uniquement les données brutes - le backend calculera les prix et coefficients
    const newDevisItem = {
      id: Date.now(),
      room: roomLabel,
      roomValue: roomValue,
      installationType: effectiveInstallationType,
      serviceType: serviceType,
      services: selectedServiceLabels.map(label => ({
        label,
        quantity: 1
      })),
      completed: false
    };

    // Ajouter la nouvelle prestation (sécurité/portail : pas de tableau, une seule mise à jour state)
    if (serviceType === 'securite' || serviceType === 'portail') {
      setDevisItems(prev => [...prev, newDevisItem]);
    } else {
      setDevisItems(prev => {
        const updated = [...prev, newDevisItem];
        updateTableauItem(updated).then(result => {
          setDevisItems(result);
        }).catch(error => {
          console.error('Erreur mise à jour tableau:', error);
        });
        return updated;
      });
    }
    
    resetForm();
    
    // Afficher le message de succès
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); // Le message disparaît après 3 secondes
  };

  const removeDevisItem = (itemId) => {
    if (serviceType === 'securite' || serviceType === 'portail') {
      setDevisItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setDevisItems(prev => {
        const filtered = prev.filter(item => item.id !== itemId);
        updateTableauItem(filtered).then(result => {
          setDevisItems(result);
        }).catch(error => {
          console.error('Erreur mise à jour tableau:', error);
        });
        return filtered;
      });
    }
  };

  const updateQuantity = (itemId, serviceIndex, quantity) => {
    const qty = parseInt(quantity) || 1;
    
    // Mettre à jour la quantité
    setDevisItems(prev => {
      const updated = prev.map(item => {
        if (item.id !== itemId) return item;
        
        return {
          ...item,
          services: item.services.map((service, index) => {
            if (index !== serviceIndex) return service;
            return { ...service, quantity: qty };
          })
        };
      });
      
      // Si on a un choix de tableau et qu'on modifie une prestation (pas un tableau), recalculer le tableau (asynchrone)
      if (serviceType !== 'securite' && serviceType !== 'portail' && tableauData && tableauData.choice !== 'garder') {
        updateTableauItem(updated).then(result => {
          setDevisItems(result);
        }).catch(error => {
          console.error('Erreur mise à jour tableau:', error);
        });
      }
      return updated;
    });
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
    showSuccessMessage,
    
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
