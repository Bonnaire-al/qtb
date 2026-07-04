const { ensureSpecialInterrupteurPrestation } = require('../utils/ensureSpecialPrestation');

/**
 * Prestation spéciale interrupteur éclairage (libellé / value / code fixes, is_special = 1).
 */
async function migrateSpecialPrestationInterrupteur() {
  await ensureSpecialInterrupteurPrestation();
  console.log('✅ Prestation spéciale interrupteur éclairage (PINT001) prête');
}

module.exports = migrateSpecialPrestationInterrupteur;
