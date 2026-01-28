const db = require('../config/database');

/**
 * Migration : Ajouter les 13 matériels du tableau électrique
 * - Couleur : violet (marqueur spécial)
 * - Prix initial : 1 (modifiable depuis l'admin)
 * - Non modifiable/supprimable depuis l'admin (sauf prix)
 */

const materielsTableau = [
  { code: 'TAB001', designation: 'Tableau', prix_ht: 1 },
  { code: 'TAB002', designation: 'Tableau', prix_ht: 1 },
  { code: 'TAB003', designation: 'Tableau', prix_ht: 1 },
  { code: 'TAB004', designation: 'Tableau', prix_ht: 1 },
  { code: 'DIF001', designation: 'Disjoncteur différentiel monophasé', prix_ht: 70 },
  { code: 'DIF002', designation: 'Disjoncteur différentiel triphasé', prix_ht: 1 },
  { code: 'DIS002', designation: 'Disjoncteur 2A', prix_ht: 1 },
  { code: 'DISDIV', designation: 'Disjoncteur divisionnaire', prix_ht: 15.50 },
  // Anciens codes DIS010, DIS016, DIS020, DIS032 supprimés - utiliser DISDIV à la place
  { code: 'DIS3PH', designation: 'Disjoncteur triphasé', prix_ht: 1 },
  { code: 'HOR001', designation: 'Horloge/contacteur heure creuse', prix_ht: 1 },
  { code: 'TEL001', designation: 'Telerupteur', prix_ht: 1 },
  { code: 'FOU001', designation: 'Fourniture tableau électrique', prix_ht: 50 }
];

async function addTableauElectriqueMateriels() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('🚀 Ajout des matériels du tableau électrique...\n');

      let inserted = 0;
      let skipped = 0;
      let errors = 0;

      const insertNext = (index) => {
        if (index >= materielsTableau.length) {
          console.log(`\n✅ Migration terminée !`);
          console.log(`   - ${inserted} matériel(s) inséré(s)`);
          console.log(`   - ${skipped} matériel(s) déjà existant(s)`);
          if (errors > 0) {
            console.log(`   - ${errors} erreur(s)`);
          }
          resolve();
          return;
        }

        const materiel = materielsTableau[index];
        
        // Vérifier si le code existe déjà
        db.get(
          'SELECT id FROM materiel WHERE code = ?',
          [materiel.code],
          (err, row) => {
            if (err) {
              console.error(`❌ Erreur lors de la vérification de ${materiel.code}:`, err.message);
              errors++;
              insertNext(index + 1);
              return;
            }

            if (row) {
              // Le matériel existe déjà, mettre à jour la couleur si nécessaire (sauf pour les fournitures)
              const isFourniture = materiel.code.toLowerCase().startsWith('fou');
              if (!isFourniture) {
                db.run(
                  'UPDATE materiel SET couleur = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?',
                  ['violet', materiel.code],
                (updateErr) => {
                  if (updateErr) {
                    console.error(`❌ Erreur lors de la mise à jour de ${materiel.code}:`, updateErr.message);
                    errors++;
                  } else {
                    console.log(`⚠️  ${materiel.designation} (${materiel.code}) existe déjà - couleur mise à jour`);
                    skipped++;
                  }
                });
              } else {
                // Pour les fournitures existantes, ne pas modifier la couleur
                console.log(`⚠️  ${materiel.designation} (${materiel.code}) existe déjà`);
                skipped++;
              }
              insertNext(index + 1);
            } else {
              // Insérer le nouveau matériel
              // Pour les fournitures (code commençant par FOU), ne pas mettre la couleur violette
              const isFourniture = materiel.code.toLowerCase().startsWith('fou');
              const couleur = isFourniture ? 'gris' : 'violet';
              
              db.run(
                `INSERT INTO materiel (code, designation, qte_dynamique, prix_ht, couleur, created_at, updated_at)
                 VALUES (?, ?, 1, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [materiel.code, materiel.designation, materiel.prix_ht, couleur],
                function(insertErr) {
                  if (insertErr) {
                    console.error(`❌ Erreur lors de l'insertion de ${materiel.code}:`, insertErr.message);
                    errors++;
                  } else {
                    console.log(`✅ ${materiel.designation} (${materiel.code}) ajouté`);
                    inserted++;
                  }
                  insertNext(index + 1);
                }
              );
            }
          }
        );
      };

      // Démarrer l'insertion
      insertNext(0);
    });
  });
}

// Exécuter la migration si le fichier est appelé directement
if (require.main === module) {
  addTableauElectriqueMateriels()
    .then(() => {
      console.log('\n✅ Migration terminée avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur lors de la migration:', error);
      process.exit(1);
    });
}

module.exports = addTableauElectriqueMateriels;





