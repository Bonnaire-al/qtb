const addCodesToPrestations = require('./add-codes-to-prestations');
const restructureMaterielWithCodes = require('./restructure-materiel-with-codes');
const createPrestationMaterielConfig = require('./create-prestation-materiel-config');

/**
 * Migration complète : Exécute toutes les migrations dans l'ordre
 */
async function migrateAllCodes() {
  try {
    console.log('🚀 Début migration complète vers système avec codes\n');
    
    // Étape 1 : Ajouter codes aux prestations
    console.log('📋 Étape 1/3 : Ajout codes aux prestations');
    await addCodesToPrestations();
    console.log('✅ Étape 1 terminée\n');
    
    // Étape 2 : Restructurer table materiel
    console.log('📋 Étape 2/3 : Restructuration table materiel');
    await restructureMaterielWithCodes();
    console.log('✅ Étape 2 terminée\n');
    
    // Étape 3 : Créer table config
    console.log('📋 Étape 3/3 : Création table prestation_materiel_config');
    await createPrestationMaterielConfig();
    console.log('✅ Étape 3 terminée\n');
    
    console.log('🎉 Migration complète réussie !');
    console.log('\n⚠️ IMPORTANT :');
    console.log('   - Les prestations ont maintenant un code unique');
    console.log('   - Les matériels ont maintenant : code, designation, type_pose, qte_dynamique');
    console.log('   - La table prestation_materiel_config est prête');
    console.log('   - Vous devez maintenant créer les liaisons dans prestation_materiel_config');
    console.log('   - L\'ancienne table prestation_materiel peut être supprimée après migration des données');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  migrateAllCodes()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Migration échouée:', err);
      process.exit(1);
    });
}

module.exports = migrateAllCodes;

