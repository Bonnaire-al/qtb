import { useState } from 'react';

/**
 * Hook pour gérer la logique du tableau électrique (domotique / installation)
 */
export const useTableauLogic = () => {
  const [showTableauModal, setShowTableauModal] = useState(false);
  const [tableauChoice, setTableauChoice] = useState(null);

  const resetTableauLogic = () => {
    setTableauChoice(null);
    setShowTableauModal(false);
  };

  const handleTableauChoice = (choice) => {
    setTableauChoice(choice);
    if (choice === 'inexistant' || choice === 'garder') {
      setShowTableauModal(false);
    }
  };

  const getTableauData = (changeTypeOverride = null) => {
    return {
      choice: tableauChoice,
      questionnaire: null,
      changeType:
        changeTypeOverride ||
        (tableauChoice === 'inexistant' ? null : tableauChoice === 'garder' ? null : null)
    };
  };

  return {
    showTableauModal,
    tableauChoice,
    setShowTableauModal,
    handleTableauChoice,
    resetTableauLogic,
    getTableauData
  };
};
