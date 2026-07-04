/** Applique le tarif main d'œuvre selon le type de tableau (pose vs changement). */

export const DEFAULT_MO_POSE = 200;
export const DEFAULT_MO_CHANGEMENT = 360;

export function normalizeTableauChoice(tableauData) {
  if (!tableauData) return null;
  if (tableauData.choice === 'inexistant') {
    return { ...tableauData, questionnaire: null, changeType: null };
  }
  return tableauData;
}

export function resolveTableauMoRates(config) {
  const pose = Number(config?.main_oeuvre_pose_par_rangee ?? config?.main_oeuvre_par_rangee);
  const changement = Number(config?.main_oeuvre_changement_par_rangee);
  return {
    pose: Number.isFinite(pose) && pose > 0 ? pose : DEFAULT_MO_POSE,
    changement: Number.isFinite(changement) && changement > 0 ? changement : DEFAULT_MO_CHANGEMENT
  };
}

/**
 * Recalcule mainOeuvre / mainOeuvreType / mainOeuvreParRangee à partir du choice (source de vérité UI).
 */
export function applyTableauMainOeuvre(tableauData, result, rates) {
  const data = normalizeTableauChoice(tableauData);
  if (!data || data.choice === 'garder') return result;

  const rangees = Number(result?.rangees) || 0;
  if (rangees <= 0) return result;

  const isPose = data.choice === 'inexistant';
  const rate = isPose ? rates.pose : rates.changement;

  return {
    ...result,
    rangees,
    mainOeuvre: rangees * rate,
    mainOeuvreType: isPose ? 'pose' : 'changement',
    mainOeuvreParRangee: rate
  };
}

export function applyTableauMainOeuvreToItem(item, rates) {
  if (!item || item.type !== 'tableau' || !item.tableauData) return item;
  const adjusted = applyTableauMainOeuvre(item.tableauData, item, rates);
  return {
    ...item,
    mainOeuvre: adjusted.mainOeuvre ?? item.mainOeuvre,
    rangees: adjusted.rangees ?? item.rangees,
    mainOeuvreType: adjusted.mainOeuvreType ?? item.mainOeuvreType,
    mainOeuvreParRangee: adjusted.mainOeuvreParRangee ?? item.mainOeuvreParRangee
  };
}

export function applyTableauMainOeuvreToItems(devisItems, rates) {
  return (devisItems || []).map((item) =>
    item.type === 'tableau' ? applyTableauMainOeuvreToItem(item, rates) : item
  );
}
