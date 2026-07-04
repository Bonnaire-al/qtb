import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import ApiService from '../../../services/api';
import { WizardProgress, InstallationOptionRow, NumberStepper } from '../FormWizardSteps';
import { INSTALLATION_OPTIONS } from '../formWizardUtils';
import {
  RAPID_GAMMES,
  RAPID_WIZARD_STEPS,
  RAPID_GAMME_LEGEND,
  GAMME_PILL_STYLES,
  filterRapidPieces,
  createRoomInstance
} from './logic';

const GammeLegend = () => (
  <div className="rounded-lg border-2 border-cyan-300 bg-gradient-to-b from-white to-cyan-50/90 p-2 shadow-sm space-y-1.5">
    <p className="text-xs font-bold text-cyan-900 text-center">Gammes — choisissez pour chaque pièce ajoutée</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
      {RAPID_GAMME_LEGEND.map(({ value, label, text }) => {
        const styles = GAMME_PILL_STYLES[value] || GAMME_PILL_STYLES.classic;
        return (
          <div
            key={value}
            className="flex flex-col items-center text-center gap-1 p-1.5 rounded-md bg-white/80 border border-cyan-100"
          >
            <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[0.65rem] font-bold ${styles.selected}`}>
              {label}
            </span>
            <p className="text-[0.55rem] text-gray-600 leading-snug">{text}</p>
          </div>
        );
      })}
    </div>
  </div>
);

const RadioPills = ({ name, value, onChange, compact = false }) => (
  <div className={`flex flex-wrap ${compact ? 'gap-1 mt-0.5' : 'gap-2 mt-2'}`}>
    {RAPID_GAMMES.map((g) => {
      const styles = GAMME_PILL_STYLES[g.value] || GAMME_PILL_STYLES.classic;
      return (
      <label
        key={g.value}
        className={`rounded-lg border font-semibold cursor-pointer transition-colors ${
          compact ? 'px-2 py-0.5 text-[0.65rem]' : 'px-3 py-1.5 text-xs'
        } ${value === g.value ? styles.selected : styles.unselected}`}
      >
        <input
          className="sr-only"
          type="radio"
          name={name}
          value={g.value}
          checked={value === g.value}
          onChange={() => onChange(g.value)}
        />
        {g.label}
      </label>
      );
    })}
  </div>
);

const QtyRow = ({ label, value, onChange }) => (
  <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-gray-100 bg-white/80 text-sm">
    <span className="flex-1 text-gray-800 min-w-[6rem]">{label}</span>
    <NumberStepper label="Qté" min={0} value={value ?? 0} onChange={onChange} />
  </div>
);

const ServiceQtyGroup = ({ title, icon, themeClass, services, qtyByValue, onQtyChange, emptyText }) => (
  <div className={`border-2 rounded-xl p-3 shadow-sm ${themeClass}`}>
    <p className="text-sm font-bold mb-2">
      {icon} {title}
    </p>
    {(services || []).length === 0 ? (
      <p className="text-xs text-gray-500">{emptyText}</p>
    ) : (
      <div className="space-y-2">
        {(services || []).map((s) => (
          <QtyRow
            key={s.value}
            label={s.label}
            value={qtyByValue[s.value]}
            onChange={(n) => onQtyChange(s.value, n)}
          />
        ))}
        <p className="text-xs text-gray-500 mt-2">Qté à 0 = non inclus.</p>
      </div>
    )}
  </div>
);

const QuoteRapid = forwardRef(function QuoteRapid({ onGenerate, onStateChange }, ref) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [wizardStep, setWizardStep] = useState(1);

  const [pieces, setPieces] = useState([]);
  const [securityServices, setSecurityServices] = useState([]);
  const [portailServices, setPortailServices] = useState([]);
  const [voletServices, setVoletServices] = useState([]);

  const [roomInstances, setRoomInstances] = useState([]);
  const [installationType, setInstallationType] = useState('');

  const [securityQtyByValue, setSecurityQtyByValue] = useState({});
  const [portailQtyByValue, setPortailQtyByValue] = useState({});
  const [voletQtyByValue, setVoletQtyByValue] = useState({});

  const wizardStepRef = useRef(wizardStep);
  const roomInstancesRef = useRef(roomInstances);
  const installationTypeRef = useRef(installationType);
  const securityQtyRef = useRef(securityQtyByValue);
  const portailQtyRef = useRef(portailQtyByValue);
  const voletQtyRef = useRef(voletQtyByValue);

  wizardStepRef.current = wizardStep;
  roomInstancesRef.current = roomInstances;
  installationTypeRef.current = installationType;
  securityQtyRef.current = securityQtyByValue;
  portailQtyRef.current = portailQtyByValue;
  voletQtyRef.current = voletQtyByValue;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError('');

        const [installationStructure, securiteStructure, portailStructure] = await Promise.all([
          ApiService.getFormStructure('installation'),
          ApiService.getFormStructure('securite'),
          ApiService.getFormStructure('portail')
        ]);

        if (cancelled) return;

        setPieces(filterRapidPieces(installationStructure?.pieces || []));
        setSecurityServices(securiteStructure?.servicesByRoom?.specific || []);
        setPortailServices(portailStructure?.servicesByRoom?.portail || []);
        setVoletServices(portailStructure?.servicesByRoom?.volet || []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || 'Erreur lors du chargement du devis rapide');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    onStateChange?.({ wizardStep });
  }, [wizardStep, onStateChange]);

  const allPieces = useMemo(() => filterRapidPieces(pieces), [pieces]);

  const addRoomInstance = (roomValue) => {
    const baseLabel = allPieces.find((p) => p.value === roomValue)?.label || roomValue;
    setRoomInstances((prev) => [...prev, createRoomInstance(roomValue, baseLabel, prev)]);
  };

  const removeRoomInstance = (id) => {
    setRoomInstances((prev) => prev.filter((i) => i.id !== id));
  };

  const updateRoomGamme = (id, gamme) => {
    setRoomInstances((prev) => prev.map((i) => (i.id === id ? { ...i, gamme } : i)));
  };

  const buildSelectionsFromRefs = useCallback(() => {
    const securityQty = securityQtyRef.current;
    const portailQty = portailQtyRef.current;
    const voletQty = voletQtyRef.current;

    const securitySelections = (securityServices || [])
      .map((s) => ({
        label: s.label,
        quantity: parseInt(securityQty[s.value], 10) || 0
      }))
      .filter((s) => s.quantity > 0);

    const portailSelections = (portailServices || [])
      .map((s) => ({
        label: s.label,
        quantity: parseInt(portailQty[s.value], 10) || 0
      }))
      .filter((s) => s.quantity > 0);

    const voletSelections = (voletServices || [])
      .map((s) => ({
        label: s.label,
        quantity: parseInt(voletQty[s.value], 10) || 0
      }))
      .filter((s) => s.quantity > 0);

    return { securitySelections, portailSelections, voletSelections };
  }, [securityServices, portailServices, voletServices]);

  const handleGenerate = useCallback(async () => {
    try {
      setError('');

      const instType = installationTypeRef.current;
      const instances = roomInstancesRef.current;

      if (!instType) {
        setError('Veuillez sélectionner le passage des câbles.');
        return false;
      }

      const { securitySelections, portailSelections, voletSelections } = buildSelectionsFromRefs();
      const hasAnyPiece = instances.length > 0;
      const hasAnyOther =
        securitySelections.length > 0 ||
        portailSelections.length > 0 ||
        voletSelections.length > 0;

      if (!hasAnyPiece && !hasAnyOther) {
        setError('Sélectionnez au moins une pièce (étape 1) ou une quantité sécurité / portail / volet (étape 2).');
        return false;
      }

      const result = await ApiService.prepareRapidDevis({
        installationType: instType,
        pieceEntries: instances.map(({ roomValue, gamme, label }) => ({
          roomValue,
          gamme,
          label
        })),
        securitySelections,
        portailSelections,
        voletSelections
      });

      const items = result?.devisItems || [];
      if (!items.length) {
        setError('Impossible de préparer le devis (packs vides ?).');
        return false;
      }

      onGenerate(items);
      return true;
    } catch (e) {
      setError(e?.message || 'Impossible de générer le devis');
      return false;
    }
  }, [buildSelectionsFromRefs, onGenerate]);

  useImperativeHandle(
    ref,
    () => ({
      goPrev: () => {
        if (wizardStepRef.current > 1) {
          setWizardStep((s) => s - 1);
          setError('');
          return true;
        }
        return false;
      },
      goNext: async () => {
        const step = wizardStepRef.current;
        if (step === 1) {
          setWizardStep(2);
          setError('');
          return true;
        }
        if (step === 2) {
          setWizardStep(3);
          setError('');
          return true;
        }
        if (step === 3) {
          return handleGenerate();
        }
        return false;
      },
      canGoNext: () => {
        if (wizardStepRef.current === 3) return Boolean(installationTypeRef.current);
        return true;
      },
      getNextLabel: () => (wizardStepRef.current === 3 ? 'Générer le devis' : 'Suivant')
    }),
    [handleGenerate]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4" />
        <p className="text-gray-600">Chargement du devis rapide...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <img
          src="/image/logo.png"
          alt="QTB Electrotech"
          className="h-11 w-11 object-contain shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-cyan-800">Devis rapide</h2>
          <p className="text-xs text-gray-600">Packs par pièce — Classic, Premium ou Luxe</p>
        </div>
      </div>

      <WizardProgress step={wizardStep} steps={RAPID_WIZARD_STEPS} />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {wizardStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-cyan-800">Quelles pièces équiper ?</h3>
          <GammeLegend />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[min(38vh,340px)]">
            <div className="flex flex-col min-h-0 border border-cyan-200 rounded-xl bg-white/80 p-3">
              <p className="text-sm font-semibold text-cyan-900 mb-2 shrink-0">Ajouter une pièce</p>
              <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0 max-h-[min(32vh,300px)]">
                {allPieces.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => addRoomInstance(p.value)}
                    className="inline-flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-cyan-300 bg-white text-cyan-800 text-sm font-medium hover:bg-cyan-50 transition-colors text-left"
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded bg-cyan-100 text-cyan-700 text-xs font-bold shrink-0">
                      +
                    </span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col min-h-0 border border-cyan-300 rounded-xl bg-cyan-50/40 p-3">
              <p className="text-sm font-semibold text-cyan-900 mb-2 shrink-0">
                Pièces ajoutées
                {roomInstances.length > 0 && (
                  <span className="ml-1.5 text-xs font-normal text-gray-600">({roomInstances.length})</span>
                )}
              </p>
              {roomInstances.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6 border border-dashed border-cyan-200 rounded-lg bg-white/60 flex-1 flex items-center justify-center px-3">
                  Cliquez à gauche pour ajouter Chambre 1, Salon 1…
                </p>
              ) : (
                <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0 max-h-[min(32vh,300px)]">
                  {roomInstances.map((inst) => (
                    <div
                      key={inst.id}
                      className="border border-cyan-400 bg-white rounded-lg p-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="text-xs font-bold text-cyan-900">{inst.label}</span>
                        <button
                          type="button"
                          onClick={() => removeRoomInstance(inst.id)}
                          className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-gray-500 hover:text-red-600 hover:bg-red-50 text-base leading-none"
                          aria-label={`Retirer ${inst.label}`}
                        >
                          ×
                        </button>
                      </div>
                      <RadioPills
                        compact
                        name={`gamme-${inst.id}`}
                        value={inst.gamme}
                        onChange={(v) => updateRoomGamme(inst.id, v)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {wizardStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-cyan-800">Sécurité, portail & volet</h3>
          <p className="text-sm text-gray-600">Optionnel — indiquez les quantités souhaitées.</p>
          <ServiceQtyGroup
            title="Sécurité"
            icon="🔒"
            themeClass="border-sky-400 bg-sky-50/80"
            services={securityServices}
            qtyByValue={securityQtyByValue}
            onQtyChange={(value, qty) =>
              setSecurityQtyByValue((prev) => ({ ...prev, [value]: qty }))
            }
            emptyText="Aucune prestation sécurité trouvée en base."
          />
          <ServiceQtyGroup
            title="Portail"
            icon="🚪"
            themeClass="border-blue-500 bg-blue-50/80"
            services={portailServices}
            qtyByValue={portailQtyByValue}
            onQtyChange={(value, qty) =>
              setPortailQtyByValue((prev) => ({ ...prev, [value]: qty }))
            }
            emptyText="Aucune prestation portail trouvée en base."
          />
          <ServiceQtyGroup
            title="Volet roulant"
            icon="🪟"
            themeClass="border-indigo-400 bg-indigo-50/80"
            services={voletServices}
            qtyByValue={voletQtyByValue}
            onQtyChange={(value, qty) =>
              setVoletQtyByValue((prev) => ({ ...prev, [value]: qty }))
            }
            emptyText="Aucune prestation volet trouvée en base."
          />
        </div>
      )}

      {wizardStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-cyan-800">Comment poser les câbles ?</h3>
          <div className="space-y-2">
            {INSTALLATION_OPTIONS.map((opt) => (
              <InstallationOptionRow
                key={opt.value}
                opt={opt}
                selected={installationType === opt.value}
                onSelect={setInstallationType}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default QuoteRapid;
