import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Form from '../components/Form/Form';
import ModalQuote from '../components/modal-pdf/ModalQuote';
import { TableauElectriqueStep } from '../components/Form/TableauElectriqueModal';
import TableauChangeWizard from '../components/Form/TableauChangeWizard';
import { useTableauLogic } from '../components/Form/useTableauLogic';
import ApiService from '../services/api';
import QuoteRapid from '../components/Form/QuoteRapid/QuoteRapid';
import QuoteWizardShell, { STEP_ANIM_MS } from '../components/Quote/QuoteWizardShell';
import QuoteHighlightModal from '../components/Quote/QuoteHighlightModal';
import {
  WizardChoiceButton,
  WizardChoiceList,
  WizardStepTitle,
  WizardStepSubtitle
} from '../components/Quote/WizardChoiceButton';
import { useModalAnimation } from '../hooks/useModalAnimation';
import {
  CONFIG_STEP,
  CONFIG_STEP_LABELS,
  buildConfigSequence,
  getConfigStepIndex
} from '../components/Quote/quoteWizardFlow';
import {
  applyTableauMainOeuvre,
  applyTableauMainOeuvreToItems,
  normalizeTableauChoice,
  resolveTableauMoRates
} from '../components/Form/tableauMainOeuvreUtils';

const SERVICES = [
  { key: 'domotique', label: 'Domotique', icon: '🏠', description: 'Rénovation, neuf, connecté' },
  { key: 'installation', label: 'Installation électrique générale', icon: '💡', description: 'Éclairage, prises, sécurité, volets…' },
  { key: 'changer_tableau', label: 'Changement / pose tableau électrique', icon: '⚡', description: 'Remplacement, pose ou mise aux normes' }
];

function Quote() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [view, setView] = useState('wizard');
  const [configStepId, setConfigStepId] = useState(CONFIG_STEP.CLIENT);
  const [lastConfigStepId, setLastConfigStepId] = useState(CONFIG_STEP.CLIENT);
  const [stepAnimClass, setStepAnimClass] = useState('animate-wizard-step-in');

  const [quoteMode, setQuoteMode] = useState(null);
  const [pendingTableauChoice, setPendingTableauChoice] = useState(null);
  const [showPrestationsModal, setShowPrestationsModal] = useState(false);
  const [showChangerModal, setShowChangerModal] = useState(false);
  const [showRapidModal, setShowRapidModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    company: '',
    service: ''
  });

  const [devisItems, setDevisItems] = useState([]);
  const [tableauData, setTableauData] = useState(null);
  const [activeTableauData, setActiveTableauData] = useState(null);
  const lastFormServiceRef = useRef(null);
  const changerWizardRef = useRef(null);
  const rapidWizardRef = useRef(null);
  const [changerWizardKey, setChangerWizardKey] = useState(0);
  const [rapidWizardKey, setRapidWizardKey] = useState(0);
  const [changerSubStep, setChangerSubStep] = useState(1);
  const [rapidSubStep, setRapidSubStep] = useState(1);
  const [, setChangerNavTick] = useState(0);
  const [, setRapidNavTick] = useState(0);

  const tableauLogic = useTableauLogic();
  const prestationsModalAnim = useModalAnimation(showPrestationsModal);
  const changerModalAnim = useModalAnimation(showChangerModal);
  const rapidModalAnim = useModalAnimation(showRapidModal);

  const configSequence = useMemo(
    () =>
      buildConfigSequence({
        quoteMode,
        service: formData.service
      }),
    [quoteMode, formData.service]
  );

  const configStepIndex = getConfigStepIndex(configSequence, configStepId);
  const configStepTotal = configSequence.length;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFormStateIfServiceChanged = (serviceKey) => {
    if (lastFormServiceRef.current !== serviceKey) {
      lastFormServiceRef.current = serviceKey;
      setDevisItems([]);
      setTableauData(null);
      setActiveTableauData(null);
      setPendingTableauChoice(null);
    }
  };

  const isClientInfoValid = () =>
    Boolean(
      formData.name.trim() &&
        formData.email.trim() &&
        formData.address.trim() &&
        formData.phone.trim()
    );

  const navigateConfigStep = useCallback((nextId, direction = 'next') => {
    setStepAnimClass(direction === 'next' ? 'animate-wizard-step-out' : 'animate-wizard-step-out-back');
    window.setTimeout(() => {
      setConfigStepId(nextId);
      setStepAnimClass(direction === 'next' ? 'animate-wizard-step-in' : 'animate-wizard-step-in-back');
    }, STEP_ANIM_MS);
  }, []);

  const resetToClient = useCallback(() => {
    setView('wizard');
    setShowPrestationsModal(false);
    setShowChangerModal(false);
    setShowRapidModal(false);
    setConfigStepId(CONFIG_STEP.CLIENT);
    setLastConfigStepId(CONFIG_STEP.CLIENT);
    setStepAnimClass('animate-wizard-step-in');
    setQuoteMode(null);
    setPendingTableauChoice(null);
    setFormData((prev) => ({
      ...prev,
      service: '',
      quoteMode: undefined
    }));
    setDevisItems([]);
    setTableauData(null);
    setActiveTableauData(null);
    tableauLogic.resetTableauLogic();
    lastFormServiceRef.current = null;
    setChangerWizardKey((k) => k + 1);
    setRapidWizardKey((k) => k + 1);
  }, [tableauLogic]);

  const getTableauServiceKey = () =>
    formData.service === 'changer_tableau' ? 'changer_tableau' : formData.service;

  const calculateFinalTableauItems = async (prestationsItems, currentTableauData) => {
    if (!currentTableauData || currentTableauData.choice === 'garder') {
      return prestationsItems;
    }

    let rates = resolveTableauMoRates(null);
    try {
      const cfg = await ApiService.getTableauConfig();
      rates = resolveTableauMoRates(cfg);
    } catch (_) {
      /* tarifs par défaut */
    }

    const serviceKey = getTableauServiceKey();
    const prestationsOnly = prestationsItems.filter((item) => item.type !== 'tableau');
    const existingTableaux = prestationsItems.filter((item) => item.type === 'tableau');
    const payloadTableauData = normalizeTableauChoice(currentTableauData);

    if (payloadTableauData.choice === 'inexistant') {
      try {
        const rawResult = await ApiService.calculateTableau(prestationsOnly, payloadTableauData);
        const result = applyTableauMainOeuvre(payloadTableauData, rawResult, rates);
        return [
          ...prestationsOnly,
          {
            id: `tableau-inexistant-${serviceKey}`,
            type: 'tableau',
            room: 'Tableau électrique',
            serviceType: serviceKey,
            tableauData: payloadTableauData,
            services: result.materiels || [],
            mainOeuvre: result.mainOeuvre ?? 0,
            rangees: result.rangees ?? 0,
            mainOeuvreType: result.mainOeuvreType,
            mainOeuvreParRangee: result.mainOeuvreParRangee,
            completed: false
          }
        ];
      } catch (error) {
        console.error('Erreur calcul tableau:', error);
        return prestationsItems;
      }
    }

    if (payloadTableauData.choice === 'changer' && payloadTableauData.questionnaire) {
      if (payloadTableauData.changeType === 'uniquement') {
        try {
          const rawResult = await ApiService.calculateTableau([], {
            choice: 'changer',
            questionnaire: payloadTableauData.questionnaire,
            changeType: 'uniquement'
          });
          const result = applyTableauMainOeuvre(payloadTableauData, rawResult, rates);
          const tableauItemId = `tableau-changer-uniquement-${serviceKey}`;
          const existingTableauIndex = existingTableaux.findIndex(
            (item) =>
              item.id === tableauItemId ||
              (item.tableauData?.choice === 'changer' &&
                item.tableauData?.changeType === 'uniquement')
          );
          return [
            ...prestationsOnly,
            {
              id:
                existingTableauIndex >= 0
                  ? existingTableaux[existingTableauIndex].id
                  : tableauItemId,
              type: 'tableau',
              room: 'Tableau électrique',
              serviceType: serviceKey,
              tableauData: payloadTableauData,
              services: result.materiels || [],
              mainOeuvre: result.mainOeuvre ?? 0,
              rangees: result.rangees ?? 0,
              mainOeuvreType: result.mainOeuvreType,
              mainOeuvreParRangee: result.mainOeuvreParRangee,
              completed: false
            }
          ];
        } catch (error) {
          console.error('Erreur calcul tableau:', error);
          return prestationsItems;
        }
      }

      if (payloadTableauData.changeType === 'commencer') {
        try {
          const rawResult = await ApiService.calculateTableau(prestationsOnly, {
            choice: 'changer',
            questionnaire: payloadTableauData.questionnaire,
            changeType: 'commencer'
          });
          const result = applyTableauMainOeuvre(payloadTableauData, rawResult, rates);
          return [
            ...prestationsOnly,
            {
              id: `tableau-changer-commencer-${serviceKey}`,
              type: 'tableau',
              room: 'Tableau électrique',
              serviceType: serviceKey,
              tableauData: payloadTableauData,
              services: result.materiels || [],
              mainOeuvre: result.mainOeuvre ?? 0,
              rangees: result.rangees ?? 0,
              mainOeuvreType: result.mainOeuvreType,
              mainOeuvreParRangee: result.mainOeuvreParRangee,
              completed: false
            }
          ];
        } catch (error) {
          console.error('Erreur calcul tableau:', error);
          return prestationsItems;
        }
      }
    }

    return prestationsItems;
  };

  const goToPreview = async (items, dataOverride = null) => {
    const finalItems = await calculateFinalTableauItems(items || [], dataOverride ?? tableauData);
    setDevisItems(finalItems);
    setShowPrestationsModal(false);
    setShowChangerModal(false);
    setView('preview');
  };

  const openPrestationsModal = (tableauOverride = null) => {
    setLastConfigStepId(configStepId);
    resetFormStateIfServiceChanged(formData.service);
    if (tableauOverride) {
      setTableauData(tableauOverride);
      setActiveTableauData(tableauOverride);
    }
    setShowPrestationsModal(true);
  };

  const closePrestationsModal = () => {
    prestationsModalAnim.closeWithAnimation(() => {
      setShowPrestationsModal(false);
      setActiveTableauData(null);
    });
  };

  const openChangerModal = () => {
    setChangerWizardKey((k) => k + 1);
    setChangerSubStep(1);
    setShowChangerModal(true);
  };

  const closeChangerModal = () => {
    changerModalAnim.closeWithAnimation(() => setShowChangerModal(false));
  };

  const openRapidModal = () => {
    setRapidWizardKey((k) => k + 1);
    setRapidSubStep(1);
    setShowRapidModal(true);
  };

  const closeRapidModal = () => {
    rapidModalAnim.closeWithAnimation(() => setShowRapidModal(false));
  };

  const handleCloseServiceModal = async (items) => {
    prestationsModalAnim.closeWithAnimation(async () => {
      setShowPrestationsModal(false);
      await goToPreview(items);
    });
  };

  const handleChangerWizardComplete = async (data) => {
    setTableauData(data);
    setActiveTableauData(data);
    changerModalAnim.closeWithAnimation(async () => {
      setShowChangerModal(false);
      if (data.choice === 'inexistant') {
        openPrestationsModal(data);
        return;
      }
      if (data.changeType === 'uniquement') {
        await goToPreview([], data);
      } else {
        openPrestationsModal(data);
      }
    });
  };

  const handleRapidGenerate = async (items) => {
    let rates = resolveTableauMoRates(null);
    try {
      const cfg = await ApiService.getTableauConfig();
      rates = resolveTableauMoRates(cfg);
    } catch (_) {
      /* tarifs par défaut */
    }
    rapidModalAnim.closeWithAnimation(() => {
      setShowRapidModal(false);
      setDevisItems(applyTableauMainOeuvreToItems(items, rates));
      setFormData((prev) => ({
        ...prev,
        service: 'installation',
        serviceType: 'Devis rapide',
        quoteMode: 'rapide'
      }));
      setView('preview');
    });
  };

  const handleServiceSelect = (key) => {
    setFormData((prev) => ({ ...prev, service: key }));
  };

  const changerCanNext = changerWizardRef.current?.canGoNext?.() ?? false;
  const changerNextLabel = changerWizardRef.current?.getNextLabel?.() || 'Suivant';
  const rapidCanNext = rapidWizardRef.current?.canGoNext?.() ?? false;
  const rapidNextLabel = rapidWizardRef.current?.getNextLabel?.() || 'Suivant';

  const canConfigNext = () => {
    switch (configStepId) {
      case CONFIG_STEP.CLIENT:
        return isClientInfoValid();
      case CONFIG_STEP.QUOTE_MODE:
        return Boolean(quoteMode);
      case CONFIG_STEP.SERVICE:
        return Boolean(formData.service);
      case CONFIG_STEP.TABLEAU:
        return Boolean(pendingTableauChoice);
      default:
        return false;
    }
  };

  const handleConfigNext = () => {
    if (!canConfigNext()) return;

    if (configStepId === CONFIG_STEP.CLIENT) {
      navigateConfigStep(CONFIG_STEP.QUOTE_MODE, 'next');
      return;
    }

    if (configStepId === CONFIG_STEP.QUOTE_MODE) {
      if (quoteMode === 'rapide') {
        openRapidModal();
        return;
      }
      navigateConfigStep(CONFIG_STEP.SERVICE, 'next');
      return;
    }

    if (configStepId === CONFIG_STEP.SERVICE) {
      resetFormStateIfServiceChanged(formData.service);
      if (formData.service === 'changer_tableau') {
        openChangerModal();
      } else {
        setPendingTableauChoice(null);
        navigateConfigStep(CONFIG_STEP.TABLEAU, 'next');
      }
      return;
    }

    if (configStepId === CONFIG_STEP.TABLEAU) {
      if (pendingTableauChoice === 'changer') {
        setTableauData({ choice: 'changer', questionnaire: null, changeType: null });
        openChangerModal();
        return;
      }
      if (pendingTableauChoice === 'inexistant') {
        const newTableauData = {
          choice: 'inexistant',
          questionnaire: null,
          changeType: null
        };
        setTableauData(newTableauData);
        openPrestationsModal(newTableauData);
        return;
      }
      if (pendingTableauChoice === 'garder') {
        const garderData = { choice: 'garder', questionnaire: null, changeType: null };
        setTableauData(garderData);
        openPrestationsModal(garderData);
      }
    }
  };

  const handleConfigPrev = () => {
    const idx = configStepIndex;
    if (idx <= 0) return;
    navigateConfigStep(configSequence[idx - 1], 'prev');
  };

  const handleChangerPrev = () => {
    const handled = changerWizardRef.current?.goPrev?.();
    if (!handled) closeChangerModal();
    setChangerNavTick((n) => n + 1);
  };

  const handleChangerNext = () => {
    changerWizardRef.current?.goNext?.();
    setChangerNavTick((n) => n + 1);
  };

  const handleRapidPrev = () => {
    const handled = rapidWizardRef.current?.goPrev?.();
    if (!handled) closeRapidModal();
    setRapidNavTick((n) => n + 1);
  };

  const handleRapidNext = async () => {
    await rapidWizardRef.current?.goNext?.();
    setRapidNavTick((n) => n + 1);
  };

  const renderQuoteTikTokHint = () => (
    <p className="text-[0.65rem] sm:text-xs text-gray-700 leading-snug flex flex-wrap items-center justify-center gap-1">
      Tutoriel sur notre{' '}
      <a
        href="https://www.tiktok.com/@qtb.electrotech"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 text-cyan-700 hover:text-cyan-900 font-semibold transition-colors underline-offset-2 hover:underline"
        aria-label="TikTok QTB Electrotech"
      >
        <img src="/image/tiktok-logo.png" alt="" className="h-4 w-4 sm:h-5 sm:w-5 object-contain" />
        TikTok
      </a>
    </p>
  );

  const renderConfigStep = () => {
    switch (configStepId) {
      case CONFIG_STEP.CLIENT:
        return (
          <>
            <WizardStepTitle>Vos coordonnées</WizardStepTitle>
            <WizardStepSubtitle>Ces informations figureront sur votre devis.</WizardStepSubtitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 w-full">
              {[
                { id: 'name', label: 'Nom complet *', type: 'text', required: true },
                { id: 'phone', label: 'Téléphone *', type: 'tel', required: true },
                { id: 'email', label: 'Email *', type: 'email', required: true },
                { id: 'address', label: 'Adresse *', type: 'text', required: true }
              ].map(({ id, label, type, required }) => (
                <div key={id}>
                  <label htmlFor={`wizard-${id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={`wizard-${id}`}
                    name={id}
                    value={formData[id]}
                    onChange={handleChange}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label htmlFor="wizard-company" className="block text-sm font-medium text-gray-700 mb-1">
                  Entreprise (optionnel)
                </label>
                <input
                  type="text"
                  id="wizard-company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </>
        );

      case CONFIG_STEP.QUOTE_MODE:
        return (
          <>
            <WizardStepTitle>Type de devis</WizardStepTitle>
            <WizardChoiceList>
              {[
                { key: 'personnalise', label: 'Devis personnalisé', icon: '🧩' },
                { key: 'rapide', label: 'Devis rapide', icon: '⚡' }
              ].map(({ key, label, icon }) => (
                <WizardChoiceButton
                  key={key}
                  selected={quoteMode === key}
                  onClick={() => setQuoteMode(key)}
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    {label}
                  </span>
                </WizardChoiceButton>
              ))}
            </WizardChoiceList>
          </>
        );

      case CONFIG_STEP.SERVICE:
        return (
          <>
            <WizardStepTitle>Type de projet</WizardStepTitle>
            <WizardStepSubtitle>
              Sécurité et volet/portail sont inclus dans le parcours installation (zone extérieur).
            </WizardStepSubtitle>
            <WizardChoiceList>
              {SERVICES.map((srv) => (
                <WizardChoiceButton
                  key={srv.key}
                  selected={formData.service === srv.key}
                  onClick={() => handleServiceSelect(srv.key)}
                  className="text-left"
                >
                  <span className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{srv.icon}</span>
                    <span>
                      <span className="block">{srv.label}</span>
                      {srv.description && (
                        <span
                          className={`block text-xs font-normal mt-0.5 ${
                            formData.service === srv.key ? 'text-cyan-100' : 'text-gray-600'
                          }`}
                        >
                          {srv.description}
                        </span>
                      )}
                    </span>
                  </span>
                </WizardChoiceButton>
              ))}
            </WizardChoiceList>
          </>
        );

      case CONFIG_STEP.TABLEAU:
        return (
          <TableauElectriqueStep
            selectedChoice={pendingTableauChoice}
            onChoice={setPendingTableauChoice}
          />
        );

      default:
        return null;
    }
  };

  const configStepLabel = CONFIG_STEP_LABELS[configStepId] || '';

  const renderServiceForm = () => {
    const formServiceType =
      formData.service === 'changer_tableau' ? 'installation' : formData.service;

    return (
      <Form
        key={`${formData.service}-${tableauData?.choice || 'none'}-prestations`}
        embedded
        serviceType={formServiceType}
        tableauServiceKey={getTableauServiceKey()}
        onClose={handleCloseServiceModal}
        onCancel={closePrestationsModal}
        onPrevPhase={() => {
          closePrestationsModal();
          setConfigStepId(lastConfigStepId);
        }}
        tableauData={activeTableauData ?? tableauData}
      />
    );
  };

  const shellActivePhase = showPrestationsModal || showRapidModal ? 2 : 1;

  return (
    <>
      {view === 'wizard' && (
        <div className="flex flex-col min-h-[calc(100dvh-5rem)]">
          <QuoteWizardShell
            footerHint={renderQuoteTikTokHint()}
            contentMaxWidth={configStepId === CONFIG_STEP.CLIENT ? 'max-w-2xl' : 'max-w-xl'}
            activePhase={shellActivePhase}
          configStepLabel={configStepLabel}
          configStepIndex={configStepIndex}
          configStepTotal={configStepTotal}
          stepAnimClass={stepAnimClass}
          onClose={resetToClient}
          onPrev={handleConfigPrev}
          onNext={handleConfigNext}
          prevDisabled={configStepIndex === 0}
          nextDisabled={!canConfigNext()}
        >
          {renderConfigStep()}
        </QuoteWizardShell>
        </div>
      )}

      {prestationsModalAnim.isRendered && (
          <QuoteHighlightModal
            isRendered
            animState={prestationsModalAnim.animState}
            subtitle="Étape 2 — Prestations"
            title="Composer votre devis"
            maxWidth="max-w-7xl"
            onClose={closePrestationsModal}
            hidePrev
            hideNext
          >
            {renderServiceForm()}
          </QuoteHighlightModal>
        )}

        {rapidModalAnim.isRendered && (
          <QuoteHighlightModal
            isRendered
            animState={rapidModalAnim.animState}
            subtitle={`Devis rapide — ${rapidSubStep}/3`}
            title="Composer votre devis rapide"
            maxWidth="max-w-4xl"
            onClose={closeRapidModal}
            onPrev={handleRapidPrev}
            onNext={handleRapidNext}
            prevDisabled={false}
            nextDisabled={!rapidCanNext}
            nextLabel={rapidNextLabel}
          >
            <QuoteRapid
              key={rapidWizardKey}
              ref={rapidWizardRef}
              onGenerate={handleRapidGenerate}
              onStateChange={({ wizardStep }) => {
                setRapidSubStep(wizardStep);
                setRapidNavTick((n) => n + 1);
              }}
            />
          </QuoteHighlightModal>
        )}

        {changerModalAnim.isRendered && (
          <QuoteHighlightModal
            isRendered
            animState={changerModalAnim.animState}
            subtitle={`Questionnaire tableau — ${changerSubStep}/3`}
            title="Changement / pose tableau électrique"
            maxWidth="max-w-2xl"
            onClose={closeChangerModal}
            onPrev={handleChangerPrev}
            onNext={handleChangerNext}
            prevDisabled={false}
            nextDisabled={!changerCanNext}
            nextLabel={changerNextLabel}
          >
            <TableauChangeWizard
              key={changerWizardKey}
              ref={changerWizardRef}
              embedded
              onComplete={handleChangerWizardComplete}
              onStateChange={({ wizardStep }) => {
                setChangerSubStep(wizardStep);
                setChangerNavTick((n) => n + 1);
              }}
            />
          </QuoteHighlightModal>
        )}

      {view === 'preview' && (
        <div
          className="min-h-screen py-8 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/image/fond-form.png')" }}
        >
          <div className="max-w-5xl mx-auto w-full">
            <ModalQuote
              formData={formData}
              onBackToStep1={() => {
                setFormData((prev) => ({ ...prev, quoteMode: undefined }));
                resetToClient();
              }}
              devisItems={devisItems}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Quote;
