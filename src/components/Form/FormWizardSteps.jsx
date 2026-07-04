import React, { useState } from 'react';
import {
  WIZARD_STEPS,
  ZONE_INTERIOR,
  ZONE_EXTERIOR,
  INSTALLATION_OPTIONS,
  SECURITY_OPTIONS,
  isEclairageService
} from './formWizardUtils';

const WizardProgress = ({ step, steps = WIZARD_STEPS }) => (
  <div className="flex items-center justify-between mb-6 gap-1">
    {steps.map((s, i) => (
      <React.Fragment key={s.id}>
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              step >= s.id ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {s.id}
          </div>
          <span
            className={`text-[0.65rem] sm:text-xs mt-1 text-center truncate w-full ${
              step >= s.id ? 'text-cyan-800 font-medium' : 'text-gray-500'
            }`}
          >
            {s.label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`h-0.5 flex-1 mb-5 ${step > s.id ? 'bg-cyan-500' : 'bg-gray-200'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const InstallationOptionRow = ({ opt, selected, onSelect }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <label
      className={`flex items-center justify-between gap-2 p-2.5 border rounded-lg cursor-pointer ${
        selected ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200'
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-gray-900 min-w-0">
        <input
          type="radio"
          name="installationType"
          value={opt.value}
          checked={selected}
          onChange={() => onSelect(opt.value)}
          className="text-cyan-600 shrink-0"
        />
        <span className="truncate">{opt.label}</span>
      </span>
      <button
        type="button"
        className="relative shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-cyan-700 border border-cyan-300 hover:bg-cyan-100"
        onMouseEnter={() => setShowHelp(true)}
        onMouseLeave={() => setShowHelp(false)}
        onFocus={() => setShowHelp(true)}
        onBlur={() => setShowHelp(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowHelp((v) => !v);
        }}
        aria-label={`Aide : ${opt.label}`}
      >
        ?
        {showHelp && opt.description && (
          <span className="absolute right-0 top-full mt-1 z-20 w-56 p-2 bg-gray-800 text-white text-xs rounded-lg text-left font-normal shadow-lg">
            {opt.description}
          </span>
        )}
      </button>
    </label>
  );
};

const StepZoneRoom = ({ wizardZone, selectedRoom, interiorRooms, exteriorRooms, handlers }) => (
  <div className="space-y-4">
    <h3 className="text-base font-semibold text-cyan-800">Où se situent les travaux ?</h3>
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => handlers.setZone(ZONE_INTERIOR)}
        className={`p-4 rounded-xl border-2 text-left transition-colors ${
          wizardZone === ZONE_INTERIOR
            ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-200'
            : 'border-gray-200 hover:border-cyan-300'
        }`}
      >
        <span className="text-2xl block mb-1">🏠</span>
        <span className="font-semibold text-gray-900 text-sm">Intérieur</span>
        <p className="text-xs text-gray-600 mt-1">Pièces de la maison</p>
      </button>
      <button
        type="button"
        onClick={() => handlers.setZone(ZONE_EXTERIOR)}
        className={`p-4 rounded-xl border-2 text-left transition-colors ${
          wizardZone === ZONE_EXTERIOR
            ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-200'
            : 'border-gray-200 hover:border-cyan-300'
        }`}
      >
        <span className="text-2xl block mb-1">🌳</span>
        <span className="font-semibold text-gray-900 text-sm">Extérieur</span>
        <p className="text-xs text-gray-600 mt-1">Jardin, terrasse, sécurité…</p>
      </button>
    </div>

    {wizardZone === ZONE_INTERIOR && (
      <div>
        <p className="text-sm text-gray-700 mb-2 font-medium">Choisissez la pièce</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {interiorRooms.map((room) => (
            <button
              key={room.value}
              type="button"
              onClick={() => handlers.selectRoom(room.value)}
              className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                selectedRoom === room.value
                  ? 'border-cyan-600 bg-cyan-600 text-white'
                  : 'border-gray-200 text-gray-800 hover:bg-gray-50'
              }`}
            >
              {room.label}
            </button>
          ))}
        </div>
      </div>
    )}

    {wizardZone === ZONE_EXTERIOR && (
      <div>
        <p className="text-sm text-gray-700 mb-2 font-medium">Choisissez l&apos;emplacement</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {exteriorRooms.map((room) => (
            <button
              key={room.value}
              type="button"
              onClick={() => handlers.selectRoom(room.value)}
              className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                selectedRoom === room.value
                  ? 'border-cyan-600 bg-cyan-600 text-white'
                  : 'border-gray-200 text-gray-800 hover:bg-gray-50'
              }`}
            >
              {room.label}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

const StepInstallation = ({
  wizardZone,
  selectedInstallationType,
  selectedSecurityType,
  handlers
}) => (
  <div className="space-y-4">
    <h3 className="text-base font-semibold text-cyan-800">Comment poser les câbles ?</h3>

    {wizardZone === ZONE_EXTERIOR && (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Sécurité (si concerné)</p>
        <label
          className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer text-sm ${
            selectedSecurityType === 'wifi' ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200'
          }`}
        >
          <input
            type="checkbox"
            checked={selectedSecurityType === 'wifi'}
            onChange={(e) => handlers.securityTypeChange(e.target.checked ? 'wifi' : '')}
            className="text-cyan-600 rounded"
          />
          <span>{SECURITY_OPTIONS[0].label}</span>
        </label>
      </div>
    )}

    {!(wizardZone === ZONE_EXTERIOR && selectedSecurityType === 'wifi') && (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Passage des câbles</p>
        <div className="space-y-2">
          {INSTALLATION_OPTIONS.map((opt) => (
            <InstallationOptionRow
              key={opt.value}
              opt={opt}
              selected={selectedInstallationType === opt.value}
              onSelect={handlers.installationTypeChange}
            />
          ))}
        </div>
      </div>
    )}

    {wizardZone === ZONE_EXTERIOR && selectedSecurityType === 'wifi' && (
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
        Système connecté en Wifi — pas de passage de câbles filaire nécessaire.
      </p>
    )}
  </div>
);

const GROUP_ICONS = {
  securite: '🔒',
  portail: '🚪',
  eclairage: '💡',
  prises: '🔌',
  ligne_speciale: '⚡',
  chauffage: '🌡️',
  domotique: '📱',
  autres: '📋'
};

const getGroupTheme = (groupKey) => {
  switch (groupKey) {
    case 'securite':
      return {
        wrapper: 'border-2 border-sky-400 bg-sky-50/80 rounded-xl p-3 shadow-sm',
        title: 'text-sky-900'
      };
    case 'portail':
      return {
        wrapper: 'border-2 border-blue-500 bg-blue-50/80 rounded-xl p-3 shadow-sm',
        title: 'text-blue-900'
      };
    default:
      return {
        wrapper: 'border-2 border-cyan-400 bg-cyan-50/80 rounded-xl p-3 shadow-sm',
        title: 'text-cyan-900'
      };
  }
};

const StepperButton = ({ onClick, disabled, children, ariaLabel, side }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`w-4 h-6 flex items-center justify-center text-[0.65rem] font-bold leading-none shrink-0 select-none transition-colors ${
      side === 'minus'
        ? 'border-r border-cyan-200 bg-cyan-50/80 text-cyan-700 hover:bg-cyan-100'
        : 'bg-cyan-50/80 text-cyan-700 hover:bg-cyan-100'
    } disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-cyan-50/80`}
  >
    {children}
  </button>
);

const NumberStepper = ({ label, value, onChange, min = 1 }) => {
  const parsed = parseInt(value, 10);
  const current = Math.max(min, Number.isFinite(parsed) ? parsed : min);

  return (
    <div className="flex flex-col gap-0.5 shrink-0">
      <span className="text-[0.65rem] font-semibold text-cyan-800 leading-none">{label}</span>
      <div className="inline-flex items-stretch rounded-md border border-cyan-300 bg-white overflow-hidden shadow-sm">
        <StepperButton
          side="minus"
          ariaLabel={`Diminuer ${label}`}
          disabled={current <= min}
          onClick={() => onChange(current - 1)}
        >
          −
        </StepperButton>
        <span className="min-w-[1.75rem] px-1.5 flex items-center justify-center text-sm font-bold tabular-nums text-gray-900 border-x border-cyan-200 bg-white">
          {current}
        </span>
        <StepperButton
          side="plus"
          ariaLabel={`Augmenter ${label}`}
          onClick={() => onChange(current + 1)}
        >
          +
        </StepperButton>
      </div>
    </div>
  );
};

const ServiceListItem = ({
  service,
  checked,
  serviceQuantities,
  serviceInterrupteurs,
  handlers
}) => (
  <li
    className={`flex flex-wrap items-center gap-2 p-2 rounded-lg border text-sm ${
      checked ? 'border-cyan-500 bg-white' : 'border-gray-100 bg-white/80'
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={() => handlers.serviceToggle(service.value)}
      className="rounded text-cyan-600 shrink-0"
    />
    <span className="flex-1 text-gray-800 min-w-[6rem]">{service.label}</span>
    {checked && (
      <div className="flex flex-wrap items-end gap-3 shrink-0">
        <NumberStepper
          label="Qté"
          value={serviceQuantities[service.value] || 1}
          onChange={(n) => handlers.quantityChange(service.value, n)}
        />
        {isEclairageService(service) && (
          <NumberStepper
            label="Interrupteur"
            min={0}
            value={serviceInterrupteurs[service.value] ?? 1}
            onChange={(n) => handlers.interrupteursChange(service.value, n)}
          />
        )}
      </div>
    )}
  </li>
);

const ServiceGroupCard = ({
  group,
  selectedServices,
  serviceQuantities,
  serviceInterrupteurs,
  handlers
}) => {
  const theme = getGroupTheme(group.key);
  const icon = GROUP_ICONS[group.key];

  return (
    <div className={theme.wrapper}>
      <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${theme.title}`}>
        {icon && <span>{icon}</span>}
        {group.label}
      </h4>
      <ul className="space-y-2">
        {group.services.map((service) => (
          <ServiceListItem
            key={service.value}
            service={service}
            checked={selectedServices.includes(service.value)}
            serviceQuantities={serviceQuantities}
            serviceInterrupteurs={serviceInterrupteurs}
            handlers={handlers}
          />
        ))}
      </ul>
    </div>
  );
};

const StepPrestations = ({
  groupedServices,
  selectedServices,
  serviceQuantities,
  serviceInterrupteurs,
  handlers
}) => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2 justify-between items-center">
      <h3 className="text-base font-semibold text-cyan-800">Quelles prestations ?</h3>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlers.selectAllVisible}
          className="text-xs px-2 py-1 border border-blue-400 text-blue-600 rounded"
        >
          Tout
        </button>
        <button
          type="button"
          onClick={handlers.deselectAll}
          className="text-xs px-2 py-1 border border-gray-400 text-gray-600 rounded"
        >
          Aucun
        </button>
      </div>
    </div>

    <div className="space-y-3 max-h-[min(50vh,420px)] overflow-y-auto pr-1">
      {groupedServices.map((group) => (
        <ServiceGroupCard
          key={group.key}
          group={group}
          selectedServices={selectedServices}
          serviceQuantities={serviceQuantities}
          serviceInterrupteurs={serviceInterrupteurs}
          handlers={handlers}
        />
      ))}
    </div>
  </div>
);

export { WizardProgress, StepZoneRoom, StepInstallation, StepPrestations, InstallationOptionRow, NumberStepper };
