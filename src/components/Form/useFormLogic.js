import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import ApiService from '../../services/api';
import {
  ZONE_INTERIOR,
  ZONE_EXTERIOR,
  INTERIOR_ROOM_VALUES,
  EXTERIOR_OUTDOOR_ROOMS,
  getExteriorRoomLabel,
  filterCatalogPieces,
  filterServicesByRoom,
  buildExteriorRoomOptions,
  tagServices,
  dedupeServicesByValue,
  groupServicesByWizardCategory,
  WIZARD_INSTALLATION_CATEGORIES,
  sortServicesByLabel,
  isEclairageService,
  applyRoomNumbering,
  getNextRoomInstance,
  stripRoomNumber,
  buildCopyTargetRooms
} from './formWizardUtils';
import {
  applyTableauMainOeuvre,
  normalizeTableauChoice,
  resolveTableauMoRates
} from './tableauMainOeuvreUtils';

const serviceConfig = {
  domotique: { title: 'Projet rénovation / installation neuf', categoryLabel: 'Domotique' },
  installation: { title: 'Installation électrique générale', categoryLabel: 'Installation' },
  portail: { title: 'Portail électrique / Volet roulant', categoryLabel: 'Portail / Volet' },
  securite: { title: 'Système de sécurité', categoryLabel: 'Sécurité' }
};

export const useFormLogic = (serviceType, tableauData = null, tableauServiceKey = null) => {
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardZone, setWizardZone] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceQuantities, setServiceQuantities] = useState({});
  const [serviceInterrupteurs, setServiceInterrupteurs] = useState({});
  const [selectedInstallationType, setSelectedInstallationType] = useState('');
  const [selectedSecurityType, setSelectedSecurityType] = useState('');
  const [devisItems, setDevisItems] = useState([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [servicesByRoom, setServicesByRoom] = useState({});
  const [roomsByService, setRoomsByService] = useState([]);
  const [exteriorPortailServices, setExteriorPortailServices] = useState([]);
  const [exteriorSecuriteServices, setExteriorSecuriteServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [pendingEditServices, setPendingEditServices] = useState(null);
  const idSeqRef = useRef(0);
  const devisItemsRef = useRef([]);
  const moRatesRef = useRef(resolveTableauMoRates(null));

  const createItemId = useCallback(() => {
    idSeqRef.current += 1;
    return `devis-${Date.now()}-${idSeqRef.current}`;
  }, []);

  const config = useMemo(() => serviceConfig[serviceType] || serviceConfig.installation, [serviceType]);
  const effectiveTableauKey = tableauServiceKey || serviceType;
  const interiorRooms = useMemo(
    () =>
      filterCatalogPieces(roomsByService).filter((r) => INTERIOR_ROOM_VALUES.includes(r.value)),
    [roomsByService]
  );

  const exteriorRooms = useMemo(
    () =>
      buildExteriorRoomOptions(roomsByService, {
        hasSecurite: exteriorSecuriteServices.length > 0,
        hasPortail: exteriorPortailServices.length > 0
      }),
    [roomsByService, exteriorSecuriteServices, exteriorPortailServices]
  );

  useEffect(() => {
    devisItemsRef.current = devisItems;
  }, [devisItems]);

  useEffect(() => {
    ApiService.getTableauConfig()
      .then((cfg) => {
        moRatesRef.current = resolveTableauMoRates(cfg);
        if (tableauData && tableauData.choice !== 'garder') {
          updateTableauItem(devisItemsRef.current)
            .then((items) => setDevisItems(applyRoomNumbering(items)))
            .catch((err) => console.error('Erreur resync tarifs tableau:', err));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setIsLoadingPrices(true);
      setIsLoadingServices(true);

      const [mainStructure, portailStructure, securiteStructure] = await Promise.all([
        ApiService.getFormStructure(serviceType),
        ApiService.getFormStructure('portail'),
        ApiService.getFormStructure('securite')
      ]);

      const mainTagged = tagServices(
        filterServicesByRoom(mainStructure.servicesByRoom || {}),
        serviceType
      );
      setServicesByRoom(mainTagged);
      setRoomsByService(filterCatalogPieces(mainStructure.pieces || []));

      const portailList = dedupeServicesByValue([
        ...(portailStructure.servicesByRoom?.portail || []),
        ...(portailStructure.servicesByRoom?.volet || [])
      ].map((s) => ({ ...s, backendServiceType: 'portail' })));

      const securiteList = dedupeServicesByValue(
        (securiteStructure.servicesByRoom?.specific || []).map((s) => ({
          ...s,
          backendServiceType: 'securite'
        }))
      );

      setExteriorPortailServices(sortServicesByLabel(portailList));
      setExteriorSecuriteServices(sortServicesByLabel(securiteList));
    } catch (error) {
      console.error('❌ Erreur chargement des données:', error);
      setServicesByRoom({});
      setRoomsByService([]);
      setExteriorPortailServices([]);
      setExteriorSecuriteServices([]);
    } finally {
      setIsLoadingPrices(false);
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    loadData();
    setWizardStep(1);
    setWizardZone('');
    setSelectedRoom('');
    setSelectedServices([]);
    setServiceQuantities({});
    setServiceInterrupteurs({});
    setSelectedInstallationType('');
    setSelectedSecurityType('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  const getServicesForRoom = useCallback((roomValue) => {
    if (!servicesByRoom || !roomValue) return [];

    if (serviceType === 'domotique' || serviceType === 'installation') {
      const commonServices = servicesByRoom.commun || [];
      const specificServices = servicesByRoom[roomValue] || [];
      const specificMap = new Map(specificServices.map((s) => [s.value, s]));
      const mergedServices = commonServices.map((common) => specificMap.get(common.value) || common);
      const remainingSpecific = specificServices.filter(
        (specific) => !commonServices.some((common) => common.value === specific.value)
      );
      return sortServicesByLabel([...mergedServices, ...remainingSpecific]);
    }

    return sortServicesByLabel(servicesByRoom[roomValue] || []);
  }, [servicesByRoom, serviceType]);

  const getOutdoorServicesForRoom = useCallback(
    (roomValue) => getServicesForRoom(roomValue),
    [getServicesForRoom]
  );

  const availableServicesStep3 = useMemo(() => {
    if (wizardZone === ZONE_EXTERIOR && selectedRoom) {
      if (selectedRoom === 'securite') return exteriorSecuriteServices;
      if (selectedRoom === 'portail') return exteriorPortailServices;
      if (EXTERIOR_OUTDOOR_ROOMS.includes(selectedRoom)) {
        return getOutdoorServicesForRoom(selectedRoom);
      }
      return getServicesForRoom(selectedRoom);
    }
    if (wizardZone === ZONE_INTERIOR && selectedRoom) {
      return getServicesForRoom(selectedRoom);
    }
    return [];
  }, [
    wizardZone,
    selectedRoom,
    getServicesForRoom,
    getOutdoorServicesForRoom,
    exteriorSecuriteServices,
    exteriorPortailServices
  ]);

  const groupedServicesStep3 = useMemo(() => {
    let order = WIZARD_INSTALLATION_CATEGORIES;
    if (selectedRoom === 'securite') order = ['securite'];
    else if (selectedRoom === 'portail') order = ['portail'];
    return groupServicesByWizardCategory(availableServicesStep3, order);
  }, [availableServicesStep3, selectedRoom]);

  useEffect(() => {
    if (!pendingEditServices) return;
    if (!selectedRoom) return;

    const matched = [];
    const qty = {};
    const int = {};

    pendingEditServices.forEach((saved) => {
      const svc = availableServicesStep3.find((s) => s.label === saved.label);
      if (svc) {
        matched.push(svc.value);
        qty[svc.value] = saved.quantity || 1;
        if (isEclairageService(svc)) {
          int[svc.value] = saved.interrupteurs != null ? saved.interrupteurs : 1;
        }
      }
    });

    setSelectedServices(matched);
    setServiceQuantities(qty);
    setServiceInterrupteurs(int);
    setPendingEditServices(null);
  }, [pendingEditServices, availableServicesStep3, wizardZone, selectedRoom]);

  const resetStepSelections = () => {
    setSelectedServices([]);
    setServiceQuantities({});
    setServiceInterrupteurs({});
    setSelectedInstallationType('');
    setSelectedSecurityType('');
    setPendingEditServices(null);
  };

  const resetWizard = () => {
    setWizardStep(1);
    setWizardZone('');
    setSelectedRoom('');
    setEditingItemId(null);
    resetStepSelections();
  };

  const canGoStep2 = useMemo(() => {
    if (!wizardZone) return false;
    return Boolean(selectedRoom);
  }, [wizardZone, selectedRoom]);

  const canAddToDevis = useMemo(() => {
    if (selectedServices.length === 0) return false;
    if (selectedSecurityType === 'wifi') return true;
    return Boolean(selectedInstallationType);
  }, [selectedServices, selectedInstallationType, selectedSecurityType]);

  const handlers = {
    submit: (e) => e.preventDefault(),

    setZone: (zone) => {
      setWizardZone(zone);
      setSelectedRoom('');
      resetStepSelections();
    },

    selectRoom: (roomValue) => {
      setSelectedRoom(roomValue);
      resetStepSelections();
    },

    serviceToggle: (serviceValue) => {
      const svc = availableServicesStep3.find((s) => s.value === serviceValue);
      const isRemoving = selectedServices.includes(serviceValue);
      const nextSelected = isRemoving
        ? selectedServices.filter((s) => s !== serviceValue)
        : [...selectedServices, serviceValue];

      setSelectedServices(nextSelected);

      if (isRemoving) {
        setServiceQuantities((q) => {
          const copy = { ...q };
          delete copy[serviceValue];
          return copy;
        });
        setServiceInterrupteurs((q) => {
          const copy = { ...q };
          delete copy[serviceValue];
          return copy;
        });
        return;
      }

      setServiceQuantities((q) => ({ ...q, [serviceValue]: q[serviceValue] || 1 }));
      if (svc && isEclairageService(svc)) {
        setServiceInterrupteurs((q) => ({
          ...q,
          [serviceValue]: q[serviceValue] ?? 1
        }));
      }
    },

    quantityChange: (serviceValue, quantity) => {
      const qty = Math.max(1, parseInt(quantity, 10) || 1);
      setServiceQuantities((prev) => ({ ...prev, [serviceValue]: qty }));
    },

    interrupteursChange: (serviceValue, count) => {
      const parsed = parseInt(count, 10);
      const nb = Math.max(0, Number.isFinite(parsed) ? parsed : 0);
      setServiceInterrupteurs((prev) => ({ ...prev, [serviceValue]: nb }));
    },

    selectAllVisible: () => {
      const all = availableServicesStep3.map((s) => s.value);
      setSelectedServices(all);
      setServiceQuantities((prev) => {
        const next = { ...prev };
        all.forEach((v) => {
          if (!next[v]) next[v] = 1;
        });
        return next;
      });
      setServiceInterrupteurs((prev) => {
        const next = { ...prev };
        availableServicesStep3.forEach((s) => {
          if (isEclairageService(s) && all.includes(s.value) && !next[s.value]) {
            next[s.value] = 1;
          }
        });
        return next;
      });
    },

    deselectAll: () => {
      setSelectedServices([]);
      setServiceQuantities({});
      setServiceInterrupteurs({});
    },

    installationTypeChange: (value) => setSelectedInstallationType(value),
    securityTypeChange: (value) => {
      setSelectedSecurityType(value);
      if (value === 'wifi') {
        setSelectedInstallationType('wifi');
      } else {
        setSelectedInstallationType('');
      }
    }
  };

  const updateTableauItem = async (currentDevisItems) => {
    if (!tableauData || tableauData.choice === 'garder') {
      return currentDevisItems.filter((item) => item.type !== 'tableau');
    }

    const payloadTableauData = normalizeTableauChoice(tableauData);
    const prestationsItems = currentDevisItems.filter((item) => item.type !== 'tableau');

    try {
      const rawResult = await ApiService.calculateTableau(prestationsItems, payloadTableauData);
      const result = applyTableauMainOeuvre(
        payloadTableauData,
        rawResult,
        moRatesRef.current
      );
      const materiels = result.materiels || [];

      let tableauItemId = '';
      if (payloadTableauData.choice === 'inexistant') {
        tableauItemId = `tableau-inexistant-${effectiveTableauKey}`;
      } else if (payloadTableauData.choice === 'changer') {
        if (payloadTableauData.changeType === 'commencer') {
          tableauItemId = `tableau-changer-commencer-${effectiveTableauKey}`;
        } else if (payloadTableauData.changeType === 'uniquement') {
          tableauItemId = `tableau-changer-uniquement-${effectiveTableauKey}`;
        } else {
          return currentDevisItems.filter((item) => item.type !== 'tableau');
        }
      } else {
        return currentDevisItems.filter((item) => item.type !== 'tableau');
      }

      const existingTableauIndex = currentDevisItems.findIndex((item) => item.type === 'tableau');

      const tableauItem = {
        id:
          existingTableauIndex >= 0
            ? currentDevisItems[existingTableauIndex].id
            : tableauItemId,
        type: 'tableau',
        room: 'Tableau électrique',
        serviceType: effectiveTableauKey,
        tableauData: payloadTableauData,
        services: materiels,
        mainOeuvre: result.mainOeuvre ?? 0,
        rangees: result.rangees ?? 0,
        mainOeuvreType: result.mainOeuvreType,
        mainOeuvreParRangee: result.mainOeuvreParRangee,
        completed: false
      };

      return [...prestationsItems, tableauItem];
    } catch (error) {
      console.error('❌ Erreur calcul tableau:', error);
      return currentDevisItems;
    }
  };

  useEffect(() => {
    if (!tableauData || tableauData.choice === 'garder') return undefined;

    let cancelled = false;
    updateTableauItem(devisItemsRef.current)
      .then((items) => {
        if (!cancelled) setDevisItems(applyRoomNumbering(items));
      })
      .catch((err) => console.error('Erreur sync tableau:', err));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableauData?.choice,
    tableauData?.changeType,
    JSON.stringify(tableauData?.questionnaire),
    effectiveTableauKey
  ]);

  const commitDevisItems = useCallback(
    (nextItems) => {
      const numbered = applyRoomNumbering(nextItems);
      setDevisItems(numbered);

      if (tableauData && tableauData.choice !== 'garder') {
        updateTableauItem(numbered)
          .then((result) => setDevisItems(applyRoomNumbering(result)))
          .catch((err) => console.error('Erreur mise à jour tableau:', err));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableauData, effectiveTableauKey]
  );

  const resolveRoomMeta = () => {
    if (wizardZone === ZONE_EXTERIOR) {
      return {
        roomLabel: getExteriorRoomLabel(selectedRoom),
        roomValue: selectedRoom
      };
    }

    const roomLabel = interiorRooms.find((r) => r.value === selectedRoom)?.label || selectedRoom;
    return { roomLabel, roomValue: selectedRoom };
  };

  const buildPieceKey = (roomValue, zone, installationType, itemServiceType) =>
    `${roomValue}|${zone}|${installationType}|${itemServiceType}`;

  const mergeServiceLists = (existing, incoming) => {
    const merged = existing.map((s) => ({ ...s }));
    incoming.forEach((ns) => {
      const idx = merged.findIndex((s) => s.label === ns.label);
      if (idx >= 0) {
        merged[idx] = {
          ...merged[idx],
          quantity: (merged[idx].quantity || 1) + (ns.quantity || 1),
          interrupteurs: ns.interrupteurs ?? merged[idx].interrupteurs
        };
      } else {
        merged.push({ ...ns });
      }
    });
    return merged;
  };

  const addToDevis = () => {
    if (!canAddToDevis) return;

    const servicesToAdd = selectedServices
      .map((value) => availableServicesStep3.find((s) => s.value === value))
      .filter(Boolean);

    const buildServiceEntries = (services) =>
      services.map((svc) => {
        const entry = {
          label: svc.label,
          quantity: serviceQuantities[svc.value] || 1
        };
        if (isEclairageService(svc)) {
          entry.interrupteurs = serviceInterrupteurs[svc.value] != null
            ? serviceInterrupteurs[svc.value]
            : 1;
        }
        return entry;
      });

    if (editingItemId) {
      const existing = devisItems.find((i) => i.id === editingItemId && i.type !== 'tableau');
      if (!existing) {
        setEditingItemId(null);
        return;
      }

      const filtered = servicesToAdd.filter(
        (svc) => (svc.backendServiceType || serviceType) === existing.serviceType
      );
      const effectiveInstallationType =
        existing.serviceType === 'securite' && selectedSecurityType === 'wifi'
          ? 'wifi'
          : selectedInstallationType;

      const nextItems = devisItems.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              installationType: effectiveInstallationType,
              services: buildServiceEntries(filtered)
            }
          : item
      );

      commitDevisItems(nextItems);
      setEditingItemId(null);
      resetWizard();
      setSuccessMessage('Modifications enregistrées.');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
      return;
    }

    const groups = new Map();

    servicesToAdd.forEach((svc) => {
      const backendType = svc.backendServiceType || serviceType;
      const effectiveInstallationType =
        backendType === 'securite' && selectedSecurityType === 'wifi'
          ? 'wifi'
          : selectedInstallationType;
      const { roomLabel, roomValue } = resolveRoomMeta();
      const pieceKey = buildPieceKey(roomValue, wizardZone, effectiveInstallationType, backendType);

      const serviceEntry = {
        label: svc.label,
        quantity: serviceQuantities[svc.value] || 1
      };
      if (isEclairageService(svc)) {
        serviceEntry.interrupteurs = serviceInterrupteurs[svc.value] != null
          ? serviceInterrupteurs[svc.value]
          : 1;
      }

      if (!groups.has(pieceKey)) {
        groups.set(pieceKey, {
          roomLabel,
          roomValue,
          backendType,
          effectiveInstallationType,
          services: []
        });
      }
      groups.get(pieceKey).services.push(serviceEntry);
    });

    let nextItems = [...devisItems];

    groups.forEach((group) => {
      const roomBaseLabel = stripRoomNumber(group.roomLabel);
      nextItems.push({
        id: createItemId(),
        room: group.roomLabel,
        roomBaseLabel,
        roomInstance: getNextRoomInstance(nextItems, group.roomValue),
        roomValue: group.roomValue,
        zone: wizardZone,
        installationType: group.effectiveInstallationType,
        serviceType: group.backendType,
        services: group.services,
        completed: false
      });
    });

    commitDevisItems(nextItems);

    resetWizard();
    setSuccessMessage('Prestation(s) ajoutée(s) au devis.');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2500);
  };

  const startEditDevisItem = (itemId) => {
    const item = devisItems.find((i) => i.id === itemId && i.type !== 'tableau');
    if (!item) return;

    setEditingItemId(itemId);
    setWizardZone(item.zone);
    setSelectedRoom(item.roomValue || '');

    if (item.installationType === 'wifi') {
      setSelectedSecurityType('wifi');
      setSelectedInstallationType('wifi');
    } else {
      setSelectedSecurityType('');
      setSelectedInstallationType(item.installationType || '');
    }

    setSelectedServices([]);
    setServiceQuantities({});
    setServiceInterrupteurs({});
    setPendingEditServices(
      (item.services || []).filter(
        (s) => !s.isSpecialInterrupteur && s.service_value !== 'interrupteur_eclairage'
      )
    );
    setWizardStep(3);
  };

  const removeDevisItem = (itemId) => {
    const filtered = devisItems.filter((item) => item.id !== itemId);
    commitDevisItems(filtered);
  };

  const updateQuantity = (itemId, serviceIndex, quantity) => {
    const qty = parseInt(quantity, 10) || 1;
    const updated = devisItems.map((item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        services: item.services.map((service, index) =>
          index !== serviceIndex ? service : { ...service, quantity: qty }
        )
      };
    });
    commitDevisItems(updated);
  };

  const updateInterrupteurs = (itemId, serviceIndex, count) => {
    const parsed = parseInt(count, 10);
    const nb = Math.max(0, Number.isFinite(parsed) ? parsed : 0);
    const updated = devisItems.map((item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        services: item.services.map((service, index) =>
          index === serviceIndex ? { ...service, interrupteurs: nb } : service
        )
      };
    });
    commitDevisItems(updated);
  };

  const copyTargetRooms = useMemo(
    () => buildCopyTargetRooms(interiorRooms),
    [interiorRooms]
  );

  const copyDevisItemToRoom = (sourceItemId, targetRoomValue) => {
    const source = devisItems.find((item) => item.id === sourceItemId && item.type !== 'tableau');
    if (!source || !targetRoomValue) return;

    const target = copyTargetRooms.find((r) => r.value === targetRoomValue);
    if (!target) return;

    const pieceKey = buildPieceKey(
      target.value,
      target.zone,
      source.installationType,
      source.serviceType
    );
    const isSameRoomValue = target.value === source.roomValue;
    const existingMatches = devisItems.filter(
      (item) =>
        item.type !== 'tableau' &&
        item.id !== sourceItemId &&
        buildPieceKey(item.roomValue, item.zone, item.installationType, item.serviceType) ===
          pieceKey
    );

    let nextItems = [...devisItems];

    if (!isSameRoomValue && existingMatches.length === 1) {
      const targetId = existingMatches[0].id;
      nextItems = nextItems.map((item) =>
        item.id === targetId
          ? {
              ...item,
              services: mergeServiceLists(
                item.services,
                source.services.map((s) => ({ ...s }))
              )
            }
          : item
      );
    } else {
      const roomBaseLabel = stripRoomNumber(target.label);
      nextItems.push({
        ...source,
        id: createItemId(),
        room: target.label,
        roomBaseLabel,
        roomInstance: getNextRoomInstance(nextItems, target.value),
        roomValue: target.value,
        zone: target.zone,
        services: source.services.map((s) => ({ ...s }))
      });
    }

    commitDevisItems(nextItems);
  };

  const generateDevis = (onClose) => {
    if (devisItems.length === 0) return;
    onClose(devisItems);
  };

  return {
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
    availableServicesStep3,
    canGoStep2,
    canAddToDevis,
    editingItemId,
    handlers,
    addToDevis,
    startEditDevisItem,
    removeDevisItem,
    updateQuantity,
    updateInterrupteurs,
    copyTargetRooms,
    copyDevisItemToRoom,
    generateDevis,
    resetWizard,
    reloadData: loadData,
    // compat
    hasRooms: true,
    currentRooms: interiorRooms,
    showDevisModal: false,
    setShowDevisModal: () => {}
  };
};

export { ZONE_INTERIOR, ZONE_EXTERIOR };
