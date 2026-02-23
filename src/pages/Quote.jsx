import React, { useState, useRef, useEffect } from 'react';
import Form from '../components/Form/Form';
import ModalQuote from '../components/modal-pdf/ModalQuote';
import TableauElectriqueModal from '../components/Form/TableauElectriqueModal';
import TableauChangeModal from '../components/Form/TableauChangeModal';
import { useTableauLogic } from '../components/Form/useTableauLogic';
import ApiService from '../services/api';
import { useModalAnimation } from '../hooks/useModalAnimation';
import QuoteRapid from '../components/Form/QuoteRapid/QuoteRapid';

const ANIMATION_DURATION = 400;


const SERVICES = [
  { key: 'domotique', label: 'Domotique', icon: '🏠' },
  { key: 'installation', label: 'Installation électrique générale', icon: '💡' },
  { key: 'securite', label: 'Système de sécurité', icon: '🔒' },
  { key: 'portail', label: 'Portail électrique / Volet roulant', icon: '🚪' },
];

function Quote() {
  // Remonter en haut de la page à l'arrivée sur le devis
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    company: '',
    service: '',
  });
  // Nouvel enchaînement: centre (Grand/Petit) -> droite (Personnalisé/Rapide) -> droite (4 services) ou (devis rapide)
  const [showWorkTypeModal, setShowWorkTypeModal] = useState(false); // centre
  const [showQuoteModeModal, setShowQuoteModeModal] = useState(false); // droite
  const [showServiceChoiceModal, setShowServiceChoiceModal] = useState(false); // droite (4 services)
  const [serviceChoiceReturnTo, setServiceChoiceReturnTo] = useState('workType'); // 'workType' | 'quoteMode'
  const [showRapidModal, setShowRapidModal] = useState(false); // droite

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [devisItems, setDevisItems] = useState([]);
  const [tableauData, setTableauData] = useState(null);
  const lastFormServiceRef = useRef(null);

  // Hook pour gérer la logique du tableau électrique
  const tableauLogic = useTableauLogic();

  // Animations des modals avec le hook
  const serviceModalAnim = useModalAnimation(showServiceModal);
  const quoteModeModalAnim = useModalAnimation(showQuoteModeModal);
  const serviceChoiceModalAnim = useModalAnimation(showServiceChoiceModal);
  const rapidModalAnim = useModalAnimation(showRapidModal);
  const tableauModalAnim = useModalAnimation(tableauLogic.showTableauModal);
  const changeSubModalAnim = useModalAnimation(tableauLogic.showChangeSubModal);
  const questionnaireModalAnim = useModalAnimation(tableauLogic.showQuestionnaireModal);

  // Animation du modal centre (Grand/Petit)
  const [workTypeModalAnim, setWorkTypeModalAnim] = useState('in');

  // Gestion des champs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Étape 1 : validation et passage au choix service
  const handleContinue = (e) => {
    e.preventDefault();
    setShowWorkTypeModal(true);
    setWorkTypeModalAnim('in');
  };

  const openWorkTypeModal = () => {
    setShowWorkTypeModal(true);
    setWorkTypeModalAnim('in');
  };

  const handleCloseWorkTypeModal = () => {
    setWorkTypeModalAnim('out');
    setTimeout(() => {
      setShowWorkTypeModal(false);
      setShowQuoteModeModal(false);
      setShowServiceChoiceModal(false);
      setShowRapidModal(false);
      setFormData(prev => ({ ...prev, service: '' }));
      setStep(1);
    }, ANIMATION_DURATION);
  };

  const handleSelectWorkType = (type) => {
    setWorkTypeModalAnim('out');
    setTimeout(() => {
      setShowWorkTypeModal(false);

      if (type === 'petit') {
        setServiceChoiceReturnTo('workType');
        setShowServiceChoiceModal(true);
      } else {
        setShowQuoteModeModal(true);
      }
    }, ANIMATION_DURATION);
  };

  const handleCloseQuoteModeModal = () => {
    quoteModeModalAnim.closeWithAnimation(() => {
      setShowQuoteModeModal(false);
      openWorkTypeModal();
    });
  };

  const handleSelectQuoteMode = (mode) => {
    // mode: 'personnalise' | 'rapide'
    if (mode === 'personnalise') {
      quoteModeModalAnim.closeWithAnimation(() => {
        setShowQuoteModeModal(false);
        setServiceChoiceReturnTo('quoteMode');
        setFormData(prev => ({ ...prev, quoteMode: undefined }));
        setShowServiceChoiceModal(true);
      });
      return;
    }

    // rapide
    quoteModeModalAnim.closeWithAnimation(() => {
      setShowQuoteModeModal(false);
      setShowRapidModal(true);
    });
  };

  // Sélection du service (personnalisé) — retirer quoteMode pour ne pas rester en "rapide"
  const handleServiceSelect = (key) => {
    setFormData({ ...formData, service: key, quoteMode: undefined });
  };

  // Réinitialiser devis + tableau quand on ouvre le formulaire pour un autre service
  const resetFormStateIfServiceChanged = (serviceKey) => {
    if (lastFormServiceRef.current !== serviceKey) {
      lastFormServiceRef.current = serviceKey;
      setDevisItems([]);
      setTableauData(null);
    }
  };

  // Validation du service
  const handleValidateService = () => {
    if (formData.service) {
      const serviceKey = formData.service;
      serviceChoiceModalAnim.closeWithAnimation(() => {
        setShowServiceChoiceModal(false);
        if (serviceKey === 'domotique' || serviceKey === 'installation') {
          resetFormStateIfServiceChanged(serviceKey);
          tableauLogic.setShowTableauModal(true);
        } else {
          resetFormStateIfServiceChanged(serviceKey);
          setShowServiceModal(true);
        }
      });
    }
  };

  // Quand on valide le formulaire spécifique : slide out left puis afficher aperçu
  const handleCloseServiceModal = async (items) => {
    // Si on a un choix de tableau, calculer les matériaux avant de passer à l'aperçu
    const finalItems = await calculateFinalTableauItems(items || [], tableauData);
    setDevisItems(finalItems);
    serviceModalAnim.closeWithAnimation(() => {
      setShowServiceModal(false);
      setStep(2);
    });
  };

  // Fonction pour calculer les items finaux du tableau avant de générer le devis
  const calculateFinalTableauItems = async (prestationsItems, tableauData) => {
    // Pas de tableau électrique pour sécurité et portail
    if (formData.service === 'securite' || formData.service === 'portail') {
      return (prestationsItems || []).filter(item => item.type !== 'tableau');
    }
    // Si "garder mon tableau", ne rien ajouter
    if (!tableauData || tableauData.choice === 'garder') {
      return prestationsItems;
    }

    // Séparer les prestations et les tableaux
    const prestationsOnly = prestationsItems.filter(item => item.type !== 'tableau');
    const existingTableaux = prestationsItems.filter(item => item.type === 'tableau');

    // Si "nouveau tableau", calculer uniquement à partir des prestations
    if (tableauData.choice === 'inexistant') {
      try {
        const response = await ApiService.calculateTableau(prestationsOnly, {
          choice: 'inexistant',
          questionnaire: null
        });
        const result = response;
      
      // ID fixe pour "nouveau tableau" (même que dans useFormLogic)
      const tableauItemId = `tableau-inexistant-${formData.service}`;
      
      const tableauItem = {
        id: tableauItemId,
        type: 'tableau',
        room: 'Tableau électrique',
        serviceType: formData.service,
        tableauData: tableauData,
        services: result.materiels,
        mainOeuvre: result.mainOeuvre,
        completed: false
      };
      
      // Supprimer tous les anciens tableaux et ajouter le nouveau tableau calculé
      // (car le calcul du tableau gère déjà toutes les prestations)
      return [...prestationsOnly, tableauItem];
      } catch (error) {
        console.error('Erreur calcul tableau:', error);
        return prestationsItems;
      }
    }

    // Si "changer mon tableau"
    if (tableauData.choice === 'changer' && tableauData.questionnaire) {
      if (tableauData.changeType === 'uniquement') {
        // "Changer uniquement" : utiliser la même logique que "commencer" mais sans prestations
        try {
          // Utiliser calculateTableau avec un tableau vide de prestations
          const response = await ApiService.calculateTableau([], {
            choice: 'changer',
            questionnaire: tableauData.questionnaire,
            changeType: 'uniquement'
          });
          const result = response;
        
        // ID fixe pour "changer uniquement"
        const tableauItemId = `tableau-changer-uniquement-${formData.service}`;
        
        // Trouver le tableau existant pour "changer uniquement" parmi les tableaux existants
        const existingTableauIndex = existingTableaux.findIndex(item => 
          item.id === tableauItemId ||
          (item.tableauData?.choice === 'changer' &&
           item.tableauData?.changeType === 'uniquement')
        );
        
        const tableauItem = {
          id: existingTableauIndex >= 0 ? existingTableaux[existingTableauIndex].id : tableauItemId,
          type: 'tableau',
          room: 'Tableau électrique',
          serviceType: formData.service,
          tableauData: tableauData,
          services: result.materiels,
          mainOeuvre: result.mainOeuvre,
          completed: false
        };
        
        // Supprimer tous les anciens tableaux et ajouter le nouveau tableau calculé
        return [...prestationsOnly, tableauItem];
        } catch (error) {
          console.error('Erreur calcul tableau:', error);
          return prestationsItems;
        }
      } else if (tableauData.changeType === 'commencer') {
        // "Changer + ajouter prestation" : fusionner questionnaires + prestations
        try {
          // Utiliser calculateTableau avec questionnaires et prestations
          const response = await ApiService.calculateTableau(prestationsOnly, {
            choice: 'changer',
            questionnaire: tableauData.questionnaire,
            changeType: 'commencer'
          });
          const result = response;
        
        // ID fixe pour "changer + commencer" (même que dans useFormLogic)
        const tableauItemId = `tableau-changer-commencer-${formData.service}`;
        
        const tableauItem = {
          id: tableauItemId,
          type: 'tableau',
          room: 'Tableau électrique',
          serviceType: formData.service,
          tableauData: tableauData,
          services: result.materiels,
          mainOeuvre: result.mainOeuvre,
          completed: false
        };
        
        // Supprimer tous les anciens tableaux et ajouter le nouveau tableau calculé
        // (car calculateTableau calcule déjà pour tous les questionnaires)
        return [...prestationsOnly, tableauItem];
        } catch (error) {
          console.error('Erreur calcul tableau:', error);
          return prestationsItems;
        }
      }
    }

    return prestationsItems;
  };

  // Fonction pour retourner à la saisie des identifiants
  const handleCancelToStep1 = () => {
    serviceModalAnim.closeWithAnimation(() => {
      setShowServiceModal(false);
      setStep(1);
    });
  };

  // Fermeture du modal service - retour à l'étape 1
  const handleCloseServiceModalDirect = () => {
    serviceModalAnim.closeWithAnimation(() => {
      setShowServiceModal(false);
      setShowWorkTypeModal(false);
      setShowQuoteModeModal(false);
      setShowServiceChoiceModal(false);
      setShowRapidModal(false);
      setStep(1);
    });
  };

  const handleCloseServiceChoiceModal = () => {
    // Retour au bon écran (Petit -> Grand/Petit, Grand-personnalisé -> Personnalisé/Rapide)
    serviceChoiceModalAnim.closeWithAnimation(() => {
      setShowServiceChoiceModal(false);
      setFormData(prev => ({ ...prev, service: '' }));

      if (serviceChoiceReturnTo === 'quoteMode') {
        setShowQuoteModeModal(true);
      } else {
        openWorkTypeModal();
      }
    });
  };

  const handleRapidBack = () => {
    rapidModalAnim.closeWithAnimation(() => {
      setShowRapidModal(false);
      setShowQuoteModeModal(true);
    });
  };

  const handleRapidGenerate = (items) => {
    setDevisItems(items);
    // pour cohérence / affichage "Type" côté PDF (optionnel)
    setFormData(prev => ({ ...prev, service: 'installation', serviceType: 'Devis rapide', quoteMode: 'rapide' }));
    rapidModalAnim.closeWithAnimation(() => {
      setShowRapidModal(false);
      setStep(2);
    });
  };

  // Gestion du choix du tableau électrique
  const handleTableauChoice = (choice) => {
    if (choice === 'garder' || choice === 'inexistant') {
      // Pour "garder" ou "inexistant", fermer le modal et ouvrir le formulaire de service
      tableauLogic.handleTableauChoice(choice);
      tableauModalAnim.closeWithAnimation(() => {
        resetFormStateIfServiceChanged(formData.service);
        setTableauData({
          choice,
          questionnaire: null,
          changeType: choice === 'inexistant' ? 'commencer' : null
        });
        tableauLogic.setShowTableauModal(false);
        setShowServiceModal(true);
      });
    } else if (choice === 'changer') {
      // Pour "changer", gérer via le hook (ouvre le sous-modal)
      tableauLogic.handleTableauChoice(choice);
    }
  };

  // Fermeture du modal tableau principal - retour à l'étape 1
  const handleCloseTableauModal = () => {
    tableauModalAnim.closeWithAnimation(() => {
      tableauLogic.setShowTableauModal(false);
      tableauLogic.resetTableauLogic();
      setShowWorkTypeModal(false);
      setShowQuoteModeModal(false);
      setShowServiceChoiceModal(false);
      setShowRapidModal(false);
      setStep(1);
    });
  };

  // Fermeture du sous-modal "Changer mon tableau" - retour à l'étape 1
  const handleCloseChangeSubModal = () => {
    changeSubModalAnim.closeWithAnimation(() => {
      tableauLogic.setShowChangeSubModal(false);
      tableauLogic.setShowTableauModal(false);
      tableauLogic.resetTableauLogic();
      setShowWorkTypeModal(false);
      setShowQuoteModeModal(false);
      setShowServiceChoiceModal(false);
      setShowRapidModal(false);
      setStep(1);
    });
  };

  // Gestion du sous-choix "Changer mon tableau"
  const handleChangeType = (type) => {
    changeSubModalAnim.closeWithAnimation(() => {
      tableauLogic.handleChangeType(type);
    });
  };

  // Fermeture du modal questionnaire avec animation - retour à l'étape 1
  const handleCloseQuestionnaireModal = () => {
    questionnaireModalAnim.closeWithAnimation(() => {
      tableauLogic.setShowQuestionnaireModal(false);
      tableauLogic.resetTableauLogic();
      setShowWorkTypeModal(false);
      setShowQuoteModeModal(false);
      setShowServiceChoiceModal(false);
      setShowRapidModal(false);
      setStep(1);
    });
  };

  // Handler pour ajouter un autre tableau (sauvegarde le questionnaire actuel et réinitialise)
  const handleAddAnotherTableau = async () => {
    const data = tableauLogic.getTableauData();
    if (data.questionnaire) {
      try {
        // Calculer les matériels du tableau actuel (avec les prestations actuelles pour compter les interrupteurs)
        const response = await ApiService.calculateTableau(
          devisItems.filter(item => item.type !== 'tableau'),
          {
            choice: 'changer',
            questionnaire: data.questionnaire,
            changeType: 'uniquement'
          }
        );
        const result = response;
      
      // Créer l'item tableau
      const tableauItem = {
        id: `tableau-${Date.now()}`,
        type: 'tableau',
        room: 'Tableau électrique',
        serviceType: formData.service,
        tableauData: data,
        services: result.materiels,
        mainOeuvre: result.mainOeuvre,
        completed: false
      };

      // Ajouter le tableau aux devisItems existants (ne pas écraser - sauvegarde en mémoire)
      setDevisItems(prev => [...prev, tableauItem]);
      } catch (error) {
        console.error('Erreur calcul tableau:', error);
      }
    }

    // Réinitialiser le questionnaire et les états pour en ajouter un nouveau
    // On garde la mémoire des tableaux déjà ajoutés dans devisItems
    questionnaireModalAnim.closeWithAnimation(() => {
      tableauLogic.setShowQuestionnaireModal(false);
      // Réinitialiser le questionnaire
      tableauLogic.setQuestionnaire({
        nombrePhase: '',
        appareilTriphase: '',
        nombreRangees: '',
        nombreDifferentiels: '',
        nombreDisjoncteurs: '',
        lignesSpeciales: [],
        radiateurElectrique: '',
        telerupteur: false
      });
      // Réinitialiser les choix pour permettre de choisir un nouveau type de tableau
      tableauLogic.setTableauChoice(null);
      tableauLogic.setChangeType(null);
      // Rouvrir le modal de choix initial pour choisir un nouveau tableau
      setTimeout(() => {
        tableauLogic.setShowTableauModal(true);
      }, 50);
    });
  };

  // Validation du questionnaire
  const handleQuestionnaireValidate = () => {
    const data = tableauLogic.getTableauData();
    setTableauData(data);

    // Gérer selon le type de changement
    if (tableauLogic.changeType === 'uniquement') {
      // Pour "uniquement", ne pas créer le tableau ici
      // Le tableau sera créé dans calculateFinalTableauItems avec la même logique que "commencer"
      // mais sans prestations
      // Recalculer les items finaux avant de passer à step 2
      calculateFinalTableauItems([], data).then(finalItems => {
        setDevisItems(finalItems);
      }).catch(error => {
        console.error('Erreur calcul tableau:', error);
      });
      
      // Fermer le questionnaire puis le modal principal et générer le devis
      questionnaireModalAnim.closeWithAnimation(() => {
        tableauLogic.setShowQuestionnaireModal(false);
        tableauLogic.resetTableauLogic();
        // Fermer aussi le modal principal du tableau
        tableauModalAnim.closeWithAnimation(() => {
          tableauLogic.setShowTableauModal(false);
          setStep(2);
        });
      });
    } else if (tableauLogic.changeType === 'commencer' || tableauLogic.tableauChoice === 'inexistant') {
      // Pour "commencer" ou "inexistant", ne pas créer de tableau ici
      // Le tableau sera créé dans calculateFinalTableauItems avec les prestations
      // Fermer le questionnaire puis le modal principal et ouvrir le formulaire de service
      questionnaireModalAnim.closeWithAnimation(() => {
        tableauLogic.setShowQuestionnaireModal(false);
        // Ne pas réinitialiser tableauLogic pour garder les données du questionnaire
        // Fermer aussi le modal principal du tableau
        tableauModalAnim.closeWithAnimation(() => {
          tableauLogic.setShowTableauModal(false);
          setShowServiceModal(true);
        });
      });
    }
  };

  // Rendu dynamique du formulaire selon le service (key pour remonter le form à chaque changement de service)
  const renderServiceForm = () => {
    return <Form 
      key={formData.service}
      serviceType={formData.service} 
      onClose={handleCloseServiceModal} 
      onCancel={handleCancelToStep1}
      tableauData={tableauData}
    />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Demander un Devis</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Remplissez ce formulaire pour recevoir un devis personnalisé pour votre projet
          </p>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 flex flex-wrap items-center justify-center gap-2">
            Pour vous aider à remplir notre formulaire, regardez le tuto sur notre{' '}
            <a
              href="https://www.tiktok.com/@qtb.electrotech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
              aria-label="TikTok QTB Electrotech"
            >
              <img src="/image/tiktok-logo.png" alt="" className="h-6 w-6 object-contain" />
              TikTok
            </a>
          </p>
        </div>

        {/* Étape 1 : Formulaire infos de base */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleContinue} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise (optionnel)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
                >
                  Continuer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal centre : Grand/Petit travaux */}
        {showWorkTypeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative transition-transform duration-400 ${workTypeModalAnim === 'in' ? 'animate-slide-in-center' : 'animate-slide-out-left'}`}>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={handleCloseWorkTypeModal}
                aria-label="Fermer"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Type de travaux</h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                  className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors flex items-center justify-start gap-4 bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100"
                  onClick={() => handleSelectWorkType('grand')}
                >
                  <span className="text-2xl">🏗️</span>
                  <span>Grand travaux</span>
                </button>
                <button
                  className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors flex items-center justify-start gap-4 bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100"
                  onClick={() => handleSelectWorkType('petit')}
                >
                  <span className="text-2xl">🛠️</span>
                  <span>Petit travaux</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal slide droite : Personnalisé / Rapide (Grand travaux) */}
        {quoteModeModalAnim.isRendered && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div
              className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative transition-transform duration-400 modal-animation-ready ${
                quoteModeModalAnim.animState === 'in' ? 'animate-slide-in-right' : quoteModeModalAnim.animState === 'out' ? 'animate-slide-out-left' : ''
              }`}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={handleCloseQuoteModeModal}
                aria-label="Fermer"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Grand travaux</h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                  className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors flex items-center justify-start gap-4 bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100"
                  onClick={() => handleSelectQuoteMode('personnalise')}
                >
                  <span className="text-2xl">🧩</span>
                  <span>Devis personnalisé</span>
                </button>
                <button
                  className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors flex items-center justify-start gap-4 bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100"
                  onClick={() => handleSelectQuoteMode('rapide')}
                >
                  <span className="text-2xl">⚡</span>
                  <span>Devis rapide</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal slide droite : choix des 4 services */}
        {serviceChoiceModalAnim.isRendered && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div
              className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative transition-transform duration-400 modal-animation-ready ${
                serviceChoiceModalAnim.animState === 'in' ? 'animate-slide-in-right' : serviceChoiceModalAnim.animState === 'out' ? 'animate-slide-out-left' : ''
              }`}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={handleCloseServiceChoiceModal}
                aria-label="Fermer"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Choisissez un service</h2>
              <div className="grid grid-cols-1 gap-4">
                {SERVICES.map((srv) => (
                  <button
                    key={srv.key}
                    className={`w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors flex items-center justify-start gap-4 ${
                      formData.service === srv.key
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
                    }`}
                    onClick={() => handleServiceSelect(srv.key)}
                  >
                    <span className="text-2xl">{srv.icon}</span>
                    <span>{srv.label}</span>
                  </button>
                ))}
              </div>
              <div className="text-center mt-6">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                  onClick={handleValidateService}
                  disabled={!formData.service}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal slide droite : devis rapide */}
        {rapidModalAnim.isRendered && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div
              className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative transition-transform duration-400 modal-animation-ready ${
                rapidModalAnim.animState === 'in' ? 'animate-slide-in-right' : rapidModalAnim.animState === 'out' ? 'animate-slide-out-left' : ''
              }`}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl z-10"
                onClick={handleRapidBack}
                aria-label="Fermer"
              >
                &times;
              </button>
              <QuoteRapid onGenerate={handleRapidGenerate} onBack={handleRapidBack} />
            </div>
          </div>
        )}

        {/* Modal formulaire spécifique au service (slide-in depuis la droite) */}
        {serviceModalAnim.isRendered && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div 
              className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative transition-transform duration-400 modal-animation-ready ${
                serviceModalAnim.animState === 'in' ? 'animate-slide-in-right' : serviceModalAnim.animState === 'out' ? 'animate-slide-out-left' : ''
              }`}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl z-10"
                onClick={handleCloseServiceModalDirect}
                aria-label="Fermer"
              >
                &times;
              </button>
              {/* Titre du service uniquement */}
              <div className="mb-6 border-b pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{SERVICES.find(s => s.key === formData.service)?.icon}</span>
                  <span className="text-xl font-bold text-cyan-800">{SERVICES.find(s => s.key === formData.service)?.label}</span>
                </div>
              </div>
              {/* Formulaire spécifique */}
              {renderServiceForm()}
            </div>
          </div>
        )}

        {/* Modal tableau électrique */}
        {(tableauModalAnim.isRendered || changeSubModalAnim.isRendered) && (
          <TableauElectriqueModal
            onChoice={handleTableauChoice}
            onClose={handleCloseTableauModal}
            showChangeSubModal={tableauLogic.showChangeSubModal}
            onChangeType={handleChangeType}
            onCloseChangeSubModal={handleCloseChangeSubModal}
            animState={tableauModalAnim.animState}
            changeSubModalAnimState={changeSubModalAnim.animState}
            isMainModalRendered={tableauModalAnim.isRendered}
            isSubModalRendered={changeSubModalAnim.isRendered}
          />
        )}

        {/* Modal questionnaire changement tableau */}
        {questionnaireModalAnim.isRendered && (
          <TableauChangeModal
            showModal={tableauLogic.showQuestionnaireModal}
            questionnaire={tableauLogic.questionnaire}
            onChange={tableauLogic.handleQuestionnaireChange}
            onLigneSpecialeToggle={tableauLogic.handleLigneSpecialeToggle}
            onValidate={handleQuestionnaireValidate}
            onClose={handleCloseQuestionnaireModal}
            changeType={tableauLogic.changeType}
            animState={questionnaireModalAnim.animState}
            onAddAnotherTableau={handleAddAnotherTableau}
          />
        )}

        {/* Étape 2 : Aperçu du devis au format A4 */}
        {step === 2 && (
          <ModalQuote 
            formData={formData} 
            onBackToStep1={() => {
              setFormData(prev => ({ ...prev, quoteMode: undefined }));
              setStep(1);
            }} 
            devisItems={devisItems}
          />
        )}
      </div>
    </div>
  );
}

export default Quote;
