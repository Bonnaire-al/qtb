/** Identifiants des sous-étapes wizard 1 (projet — sur la page) */
export const CONFIG_STEP = {
  CLIENT: 'client',
  QUOTE_MODE: 'quoteMode',
  SERVICE: 'service',
  RAPID: 'rapid',
  TABLEAU: 'tableau'
};

export const CONFIG_STEP_LABELS = {
  [CONFIG_STEP.CLIENT]: 'Vos informations',
  [CONFIG_STEP.QUOTE_MODE]: 'Mode de devis',
  [CONFIG_STEP.SERVICE]: 'Type de projet',
  [CONFIG_STEP.RAPID]: 'Devis rapide',
  [CONFIG_STEP.TABLEAU]: 'Changement / pose tableau électrique'
};

/** Séquence wizard 1 (sans changement tableau — modal séparé) */
export function buildConfigSequence(ctx) {
  const { quoteMode, service } = ctx;
  const seq = [CONFIG_STEP.CLIENT, CONFIG_STEP.QUOTE_MODE];

  if (quoteMode === 'rapide') {
    return seq;
  }

  seq.push(CONFIG_STEP.SERVICE);

  if (service && service !== 'changer_tableau') {
    seq.push(CONFIG_STEP.TABLEAU);
  }

  return seq;
}

export function getConfigStepIndex(sequence, stepId) {
  const idx = sequence.indexOf(stepId);
  return idx >= 0 ? idx : 0;
}
