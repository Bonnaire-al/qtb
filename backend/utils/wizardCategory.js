const VALID_WIZARD_CATEGORIES = ['eclairage', 'prises', 'ligne_speciale', 'securite', 'portail'];

/**
 * Déduit la catégorie wizard à partir du libellé / catégorie admin (repli legacy).
 */
function inferWizardCategoryFromLabel(serviceLabel, categorie) {
  if (categorie === 'securite') return 'securite';
  if (categorie === 'portail') return 'portail';

  const label = (serviceLabel || '').toLowerCase();
  if (/éclairage|eclairage|spot|applique|led|luminaire|plafonnier|bandeau/.test(label)) return 'eclairage';
  if (/prise|rj45|usb|multiprise/.test(label)) return 'prises';
  return 'ligne_speciale';
}

function resolveWizardCategory(prestation) {
  const explicit = prestation?.wizard_category;
  if (explicit && VALID_WIZARD_CATEGORIES.includes(explicit)) return explicit;
  return inferWizardCategoryFromLabel(prestation?.service_label, prestation?.categorie);
}

module.exports = {
  VALID_WIZARD_CATEGORIES,
  inferWizardCategoryFromLabel,
  resolveWizardCategory
};
