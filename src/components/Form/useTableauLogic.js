import { useState } from 'react';

/**
 * Hook pour gérer la logique du tableau électrique
 */
export const useTableauLogic = () => {
  // États du modal initial
  const [showTableauModal, setShowTableauModal] = useState(false);
  const [tableauChoice, setTableauChoice] = useState(null); // 'inexistant' | 'changer' | 'garder'
  
  // États du sous-choix "Changer mon tableau"
  const [showChangeSubModal, setShowChangeSubModal] = useState(false);
  const [changeType, setChangeType] = useState(null); // 'uniquement' | 'commencer'
  
  // États du modal questionnaire
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [questionnaire, setQuestionnaire] = useState({
    nombrePhase: '',
    appareilTriphase: '',
    nombreRangees: '',
    nombreDifferentiels: '',
    nombreDisjoncteurs: '',
    lignesSpeciales: [],
    radiateurElectrique: '',
    telerupteur: false
  });

  // Réinitialiser tous les états
  const resetTableauLogic = () => {
    setTableauChoice(null);
    setChangeType(null);
    setShowChangeSubModal(false);
    setShowQuestionnaireModal(false);
    setQuestionnaire({
      nombrePhase: '',
      appareilTriphase: '',
      nombreRangees: '',
      nombreDifferentiels: '',
      nombreDisjoncteurs: '',
      lignesSpeciales: [],
      radiateurElectrique: '',
      telerupteur: false
    });
  };

  // Handlers pour le modal initial
  const handleTableauChoice = (choice) => {
    setTableauChoice(choice);
    
    if (choice === 'changer') {
      // Afficher le sous-modal de choix
      setShowChangeSubModal(true);
    } else if (choice === 'inexistant') {
      // Pour "inexistant", ne pas ouvrir le questionnaire, aller directement aux pièces
      // On ferme le modal, le formulaire de service s'ouvrira
      setChangeType('commencer');
      setShowTableauModal(false);
    } else {
      // Pour "garder", fermer le modal
      setShowTableauModal(false);
    }
  };

  // Handlers pour le sous-choix "Changer mon tableau"
  const handleChangeType = (type) => {
    setChangeType(type);
    setShowChangeSubModal(false);
    // Ouvrir le modal questionnaire
    setShowQuestionnaireModal(true);
  };

  // Handlers pour le questionnaire
  const handleQuestionnaireChange = (field, value) => {
    setQuestionnaire(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLigneSpecialeToggle = (ligne) => {
    setQuestionnaire(prev => ({
      ...prev,
      lignesSpeciales: prev.lignesSpeciales.includes(ligne)
        ? prev.lignesSpeciales.filter(l => l !== ligne)
        : [...prev.lignesSpeciales, ligne]
    }));
  };

  const handleTelerupteurToggle = () => {
    setQuestionnaire(prev => ({
      ...prev,
      telerupteur: !prev.telerupteur
    }));
  };

  // Valider le questionnaire
  const isQuestionnaireValid = () => {
    return (
      questionnaire.nombrePhase &&
      questionnaire.appareilTriphase !== '' &&
      questionnaire.nombreRangees &&
      questionnaire.nombreDisjoncteurs !== ''
    );
  };

  // Obtenir les données complètes du tableau
  const getTableauData = () => {
    return {
      choice: tableauChoice,
      // Le questionnaire est disponible pour "changer" et "inexistant"
      questionnaire: (tableauChoice === 'changer' || tableauChoice === 'inexistant') ? questionnaire : null,
      changeType: tableauChoice === 'changer' ? changeType : (tableauChoice === 'inexistant' ? 'commencer' : null)
    };
  };

  return {
    // États
    showTableauModal,
    tableauChoice,
    showChangeSubModal,
    changeType,
    showQuestionnaireModal,
    questionnaire,
    
    // Setters
    setShowTableauModal,
    setShowQuestionnaireModal,
    setQuestionnaire,
    setTableauChoice,
    setChangeType,
    
    // Handlers
    handleTableauChoice,
    handleChangeType,
    handleQuestionnaireChange,
    handleLigneSpecialeToggle,
    handleTelerupteurToggle,
    
    // Utilitaires
    resetTableauLogic,
    isQuestionnaireValid,
    getTableauData
  };
};


