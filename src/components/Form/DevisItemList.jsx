import React, { useMemo, useState } from 'react';
import { isEclairageService, getDevisItemTheme } from './formWizardUtils';
import { DEFAULT_MO_CHANGEMENT, DEFAULT_MO_POSE } from './tableauMainOeuvreUtils';

const SPECIAL_INTERRUPTEUR_LABEL = 'Installation interrupteur(s) — éclairage';

function sumInterrupteursPiece(services) {
  let sum = 0;
  (services || []).forEach((s) => {
    if (s.isSpecialInterrupteur) return;
    if (!isEclairageService({ label: s.label })) return;
    sum += s.interrupteurs != null ? s.interrupteurs : 1;
  });
  return sum;
}

/** Affichage récap : PINT001 = somme des Int par type (prix calculé côté backend). */
function withSpecialInterrupteurDisplay(items) {
  return (items || []).map((item) => {
    if (item.type === 'tableau' || item.serviceType !== 'installation') return item;
    const totalInt = sumInterrupteursPiece(item.services);
    if (totalInt <= 0) return item;
    if ((item.services || []).some((s) => s.isSpecialInterrupteur)) return item;

    return {
      ...item,
      services: [
        ...(item.services || []),
        {
          label: SPECIAL_INTERRUPTEUR_LABEL,
          quantity: totalInt,
          isSpecialInterrupteur: true
        }
      ]
    };
  });
}

const DevisItemList = ({
  variant = 'modal',
  showDevisModal,
  devisItems,
  onCloseModal,
  onRemoveDevisItem,
  onEditItem,
  copyTargetRooms = [],
  onCopyToRoom,
  onGenerateDevis
}) => {
  const isPanel = variant === 'panel';
  const [copySourceId, setCopySourceId] = useState(null);

  const prestationItems = useMemo(
    () => withSpecialInterrupteurDisplay(devisItems.filter((item) => item.type !== 'tableau')),
    [devisItems]
  );
  const totalServiceLines = useMemo(
    () => prestationItems.reduce((n, item) => n + (item.services?.length || 0), 0),
    [prestationItems]
  );
  const tableauItems = useMemo(
    () => devisItems.filter((item) => item.type === 'tableau'),
    [devisItems]
  );

  const copySourceItem = useMemo(
    () => prestationItems.find((i) => i.id === copySourceId),
    [prestationItems, copySourceId]
  );

  if (!isPanel && !showDevisModal) return null;

  const showInterrupteur = (service) =>
    !service.isSpecialInterrupteur && isEclairageService({ label: service.label });

  const btnClass =
    'text-[0.6rem] leading-tight px-1.5 py-1 rounded border shrink-0 font-medium';
  const btnNeutral = `${btnClass} border-gray-300 text-gray-700 hover:bg-gray-100`;
  const btnDanger = `${btnClass} border-red-200 text-red-600 hover:bg-red-50`;

  const handleCopySelect = (targetRoomValue) => {
    if (copySourceId && onCopyToRoom) {
      onCopyToRoom(copySourceId, targetRoomValue);
    }
    setCopySourceId(null);
  };

  const renderCopyModal = () => {
    if (!copySourceId || !copySourceItem) return null;

    const overlayClass = isPanel
      ? 'fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4'
      : 'absolute inset-0 z-20 flex items-center justify-center bg-black/30 rounded-lg p-4';

    return (
      <div className={overlayClass}>
        <div className="bg-white rounded-xl shadow-xl border-2 border-cyan-200 w-full max-w-md flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-base font-semibold text-cyan-900 leading-snug">
              Copier vers quelle pièce ?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Depuis : {copySourceItem.room}
            </p>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {copyTargetRooms.map((room) => (
                <button
                  key={room.value}
                  type="button"
                  onClick={() => handleCopySelect(room.value)}
                  className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:border-cyan-600 transition-colors text-center leading-tight"
                >
                  {room.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setCopySourceId(null)}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTableauItem = (item) => {
    const services = item.services || [];
    const typeLabel =
      item.tableauData?.choice === 'inexistant'
        ? 'Nouveau tableau'
        : item.tableauData?.changeType === 'uniquement'
          ? 'Remplacement'
          : 'Tableau + prestations';
    const moTypeLabel =
      item.mainOeuvreType === 'pose'
        ? 'Pose'
        : item.mainOeuvreType === 'changement'
          ? 'Changement'
          : null;
    const rangees = Number(item.rangees) || 0;
    const isNouveau = item.tableauData?.choice === 'inexistant';
    const fallbackRate = isNouveau ? DEFAULT_MO_POSE : DEFAULT_MO_CHANGEMENT;
    const tarif =
      isNouveau && item.mainOeuvreType !== 'pose'
        ? DEFAULT_MO_POSE
        : Number(item.mainOeuvreParRangee) || fallbackRate;
    let mainOeuvre = Number(item.mainOeuvre) || 0;
    if (isNouveau && item.mainOeuvreType !== 'pose' && rangees > 0) {
      mainOeuvre = rangees * DEFAULT_MO_POSE;
    } else if (!mainOeuvre && rangees > 0 && tarif > 0) {
      mainOeuvre = rangees * tarif;
    }
    const moTypeLabelDisplay =
      isNouveau || item.mainOeuvreType === 'pose'
        ? 'Pose'
        : item.mainOeuvreType === 'changement'
          ? 'Changement'
          : moTypeLabel;

    return (
      <div key={item.id} className="rounded border border-purple-200 bg-white/80 px-1.5 py-1 mb-1">
        <p className="text-[0.55rem] font-semibold text-purple-900 leading-tight">{typeLabel}</p>
        {mainOeuvre > 0 && (
          <p className="text-[0.5rem] text-purple-800 mt-0.5 leading-snug">
            Main d&apos;œuvre{moTypeLabelDisplay ? ` (${moTypeLabelDisplay})` : ''}
            {rangees > 0 && tarif > 0
              ? ` : ${rangees} rang. × ${tarif} € = ${mainOeuvre} € HT`
              : ` : ${mainOeuvre} € HT`}
          </p>
        )}
        {services.length > 0 ? (
          <>
            <div className="grid grid-cols-[minmax(0,1fr)_1.25rem] gap-x-1 text-[0.5rem] text-purple-700/80 px-0.5 mt-1 mb-0.5">
              <span>Matériel</span>
              <span className="text-center">Qté</span>
            </div>
            <ul className="space-y-0.5">
              {services.map((service, index) => (
                <li
                  key={`${service.code || service.label}-${index}`}
                  className="grid grid-cols-[minmax(0,1fr)_1.25rem] gap-x-1 items-center text-[0.55rem] text-purple-900 px-0.5"
                >
                  <span className="min-w-0 truncate leading-tight" title={service.label}>
                    {service.label}
                  </span>
                  <span className="text-center tabular-nums">{service.quantity ?? 1}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-[0.5rem] text-purple-600/70 italic mt-0.5">Matériel en cours de calcul…</p>
        )}
      </div>
    );
  };

  const renderPrestationItem = (item) => {
    const services = item.services || [];
    const hasInterrupteurCol = services.some(showInterrupteur);
    const gridCols = hasInterrupteurCol
      ? 'grid-cols-[minmax(0,1fr)_1.25rem_1.75rem]'
      : 'grid-cols-[minmax(0,1fr)_1.25rem]';
    const theme = getDevisItemTheme(item);

    return (
      <div
        key={item.id}
        className={`rounded px-1.5 py-1 hover:brightness-[0.98] ${theme.card}`}
      >
        <div className="flex items-center gap-0.5 mb-0.5 flex-wrap">
          {onEditItem && (
            <button
              type="button"
              onClick={() => onEditItem(item.id)}
              className={btnNeutral}
            >
              Modif.
            </button>
          )}
          <button
            type="button"
            onClick={() => setCopySourceId(item.id)}
            className={btnNeutral}
          >
            Copier
          </button>
          <button
            type="button"
            onClick={() => onRemoveDevisItem(item.id)}
            className={btnDanger}
          >
            Suppr.
          </button>
          <p className={`font-semibold truncate text-[0.6rem] flex-1 min-w-0 ml-0.5 ${theme.title}`}>
            {item.room}
          </p>
        </div>

        {services.length > 0 && (
          <div className={`grid ${gridCols} gap-x-1 text-[0.5rem] text-gray-500 px-0.5 mb-0.5`}>
            <span>Prestation</span>
            <span className="text-center">Qté</span>
            {hasInterrupteurCol && <span className="text-center leading-none">Int.</span>}
          </div>
        )}
        <ul className="space-y-0.5">
          {services.map((service, index) => (
            <li
              key={index}
              className={`grid ${gridCols} gap-x-1 items-center text-[0.55rem] text-gray-700 px-0.5`}
            >
              <span className="min-w-0 truncate leading-tight" title={service.label}>
                {service.label}
              </span>
              <span className="text-center tabular-nums">{service.quantity ?? 1}</span>
              {hasInterrupteurCol && (
                <span className="text-center tabular-nums text-purple-700">
                  {showInterrupteur(service)
                    ? service.interrupteurs != null
                      ? service.interrupteurs
                      : 1
                    : '—'}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const content = (
    <>
      <div className={`${isPanel ? 'px-3 py-2.5 border-b border-gray-200' : 'p-3 border-b border-gray-200 flex-shrink-0'}`}>
        <div className="flex justify-between items-start gap-1">
          <div>
            <h2 className={`font-bold text-cyan-800 leading-tight ${isPanel ? 'text-sm' : 'text-xs'}`}>
              Mon devis
            </h2>
            <p className={`text-gray-500 leading-tight mt-0.5 ${isPanel ? 'text-xs' : 'text-[0.5rem]'}`}>
              {prestationItems.length} pièce{prestationItems.length !== 1 ? 's' : ''}
              {totalServiceLines > 0 && ` · ${totalServiceLines} prest.`}
              {tableauItems.length > 0 && ` · ${tableauItems.length} tabl.`}
            </p>
          </div>
          {!isPanel && (
            <button
              onClick={onCloseModal}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              type="button"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div
        className={`overflow-y-auto flex-1 min-h-0 ${
          isPanel ? 'px-3 py-2 min-h-[320px]' : 'px-2 py-1.5 flex-1 min-h-0'
        }`}
      >
        {devisItems.length === 0 ? (
          <p className="text-gray-400 text-center py-3 text-[0.55rem]">
            Aucune prestation
          </p>
        ) : (
          <>
            {prestationItems.length > 0 && (
              <div className="space-y-1">{prestationItems.map(renderPrestationItem)}</div>
            )}
            {tableauItems.length > 0 && (
              <div
                className={`${prestationItems.length > 0 ? 'mt-2 pt-2 border-t border-purple-200' : ''}`}
              >
                <p className="text-[0.55rem] font-bold text-purple-900 mb-1">Tableau électrique</p>
                {tableauItems.map(renderTableauItem)}
              </div>
            )}
          </>
        )}
      </div>

      <div
        className={`border-t border-gray-200 space-y-1.5 ${
          isPanel ? 'px-3 py-2.5 bg-white rounded-b-xl' : 'px-2 py-1.5 flex-shrink-0 bg-white'
        }`}
      >
        <button
          type="button"
          onClick={onGenerateDevis}
          disabled={devisItems.length === 0}
          className={`w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded disabled:bg-gray-300 disabled:cursor-not-allowed ${
            isPanel ? 'py-2 text-sm' : 'py-1 text-[0.6rem]'
          }`}
        >
          Générer le devis
        </button>
      </div>
    </>
  );

  if (isPanel) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-14 lg:top-16 flex flex-col min-h-[min(72vh,560px)] max-h-[min(88vh,780px)] text-[0.55rem]">
        {content}
        {renderCopyModal()}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {content}
        {renderCopyModal()}
      </div>
    </div>
  );
};

export default DevisItemList;
