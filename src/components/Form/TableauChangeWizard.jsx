import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import TableauQuestionnaireFields, {
  EMPTY_QUESTIONNAIRE,
  isTableauQuestionnairePart1Valid,
  isTableauQuestionnaireValid
} from './TableauQuestionnaireFields';

const WIZARD_STEPS = [
  { id: 1, label: 'Objectif' },
  { id: 2, label: 'Composition' },
  { id: 3, label: 'Ligne spéciale' }
];

const TableauChangeWizard = forwardRef(function TableauChangeWizard(
  {
    embedded = false,
    animState = 'in',
    initialStep = 1,
    initialChangeType = null,
    initialQuestionnaire = null,
    onClose,
    onComplete,
    onAddAnotherTableau,
    onStateChange
  },
  ref
) {
  const [wizardStep, setWizardStep] = useState(initialStep);
  const [changeType, setChangeType] = useState(initialChangeType);
  const [questionnaire, setQuestionnaire] = useState(
    initialQuestionnaire ? { ...EMPTY_QUESTIONNAIRE, ...initialQuestionnaire } : { ...EMPTY_QUESTIONNAIRE }
  );

  const handleQuestionnaireChange = (field, value) => {
    setQuestionnaire((prev) => ({ ...prev, [field]: value }));
  };

  const handleLigneSpecialeToggle = (ligne) => {
    setQuestionnaire((prev) => ({
      ...prev,
      lignesSpeciales: prev.lignesSpeciales.includes(ligne)
        ? prev.lignesSpeciales.filter((l) => l !== ligne)
        : [...prev.lignesSpeciales, ligne]
    }));
  };

  const handleValidateQuestionnaire = () => {
    if (!isTableauQuestionnaireValid(questionnaire)) return false;
    onComplete({
      choice: 'changer',
      changeType,
      questionnaire
    });
    return true;
  };

  const handleSelectChangeType = (type) => {
    setChangeType(type);
    setWizardStep(2);
  };

  useEffect(() => {
    onStateChange?.({ wizardStep, changeType, questionnaire });
  }, [wizardStep, changeType, questionnaire, onStateChange]);

  useImperativeHandle(ref, () => ({
    goPrev: () => {
      if (wizardStep > 1) {
        setWizardStep((s) => s - 1);
        return true;
      }
      return false;
    },
    goNext: () => {
      if (wizardStep === 1) return false;
      if (wizardStep === 2) {
        if (!isTableauQuestionnairePart1Valid(questionnaire)) return false;
        setWizardStep(3);
        return true;
      }
      if (wizardStep === 3) {
        return handleValidateQuestionnaire();
      }
      return false;
    },
    canGoNext: () => {
      if (wizardStep === 1) return Boolean(changeType);
      if (wizardStep === 2) return isTableauQuestionnairePart1Valid(questionnaire);
      if (wizardStep === 3) return isTableauQuestionnaireValid(questionnaire);
      return false;
    },
    getStep: () => wizardStep,
    getNextLabel: () => {
      if (wizardStep === 3) {
        return changeType === 'uniquement' ? 'Générer mon devis' : 'Continuer vers les prestations';
      }
      return 'Suivant';
    }
  }));

  const handleClose = () => {
    if (!embedded && wizardStep > 1) {
      setWizardStep((s) => s - 1);
      return;
    }
    onClose?.();
  };

  const helpBlock = (
    <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-2 text-xs text-gray-700 text-center sm:text-left">
      Besoin d&apos;aide ?{' '}
      <a href="tel:+33777117178" className="text-blue-900 font-semibold hover:underline">
        07 77 11 71 78
      </a>
    </div>
  );

  const inner = (
    <>
      {!embedded && (
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl z-10"
          onClick={handleClose}
          aria-label="Fermer"
        >
          &times;
        </button>
      )}

      {!embedded && (
        <h2 className="text-xl sm:text-2xl font-bold text-cyan-800 mb-2 text-center">
          Changement / pose tableau électrique
        </h2>
      )}
      <p className="text-xs text-gray-500 text-center mb-4">
        Étape {wizardStep} / {WIZARD_STEPS.length}
      </p>

      <div className="flex items-center justify-between mb-6 gap-1">
        {WIZARD_STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  wizardStep >= s.id ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s.id}
              </div>
              <span className="text-[0.6rem] sm:text-xs mt-1 text-center truncate w-full text-gray-600">
                {s.label}
              </span>
            </div>
            {i < WIZARD_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mb-4 ${wizardStep > s.id ? 'bg-cyan-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {wizardStep === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-700 text-center mb-4">Que souhaitez-vous faire ?</p>
          <button
            type="button"
            className={`w-full py-4 rounded-lg border-2 font-semibold text-base transition-colors ${
              changeType === 'uniquement'
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
            }`}
            onClick={() => handleSelectChangeType('uniquement')}
          >
            Changer mon tableau uniquement
          </button>
          <button
            type="button"
            className={`w-full py-4 rounded-lg border-2 font-semibold text-base transition-colors ${
              changeType === 'commencer'
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
            }`}
            onClick={() => handleSelectChangeType('commencer')}
          >
            Changer mon tableau et ajouter d&apos;autres prestations
          </button>
        </div>
      )}

      {wizardStep === 2 && (
        <>
          <h3 className="text-lg font-bold text-cyan-800 mb-4 text-center">Composition</h3>
          <TableauQuestionnaireFields
            section="part1"
            questionnaire={questionnaire}
            onChange={handleQuestionnaireChange}
            onLigneSpecialeToggle={handleLigneSpecialeToggle}
          />
          {helpBlock}
          {!embedded && onAddAnotherTableau && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onAddAnotherTableau({ changeType, questionnaire }, () =>
                    setQuestionnaire({ ...EMPTY_QUESTIONNAIRE })
                  )
                }
                disabled={!isTableauQuestionnairePart1Valid(questionnaire)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium py-2 px-4 rounded-lg disabled:bg-gray-400"
              >
                + Autre tableau
              </button>
            </div>
          )}
        </>
      )}

      {wizardStep === 3 && (
        <>
          <h3 className="text-lg font-bold text-cyan-800 mb-4 text-center">Ligne spéciale</h3>
          <TableauQuestionnaireFields
            section="part2"
            questionnaire={questionnaire}
            onChange={handleQuestionnaireChange}
            onLigneSpecialeToggle={handleLigneSpecialeToggle}
          />
          {helpBlock}
        </>
      )}
    </>
  );

  if (embedded) {
    return <div className="w-full">{inner}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transition-transform duration-400 modal-animation-ready ${
          animState === 'in' ? 'animate-slide-in-right' : animState === 'out' ? 'animate-slide-out-left' : ''
        }`}
      >
        {inner}
      </div>
    </div>
  );
});

export default TableauChangeWizard;
