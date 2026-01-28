const db = require('../config/database');

/**
 * Migration : Supprimer les anciens disjoncteurs (DIS010, DIS016, DIS020, DIS032)
 * et s'assurer que DISDIV (Disjoncteur divisionnaire) existe avec le bon prix
 */

const anciensCodes = ['DIS010', 'DIS016', 'DIS020', 'DIS032'];
const nouveauCode = 'DISDIV';
const nouveauMateriel = {
  code: 'DISDIV',
  designation: 'Disjoncteur divisionnaire',
  prix_ht: 15.50
};

async function removeOldDisjoncteursAndAddDisdiv() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('🚀 Migration : Suppression des anciens disjoncteurs et ajout de DISDIV...\n');

      let deleted = 0;
      let errors = 0;

      // Étape 1 : Supprimer les anciens disjoncteurs
      const deleteNext = (index) => {
        if (index >= anciensCodes.length) {
          console.log(`\n✅ ${deleted} ancien(s) disjoncteur(s) supprimé(s)`);
          
          // Étape 2 : Vérifier et ajouter/mettre à jour DISDIV
          db.get(
            'SELECT id, prix_ht FROM materiel WHERE code = ?',
            [nouveauCode],
            (err, row) => {
              if (err) {
                console.error(`❌ Erreur lors de la vérification de ${nouveauCode}:`, err.message);
                reject(err);
                return;
              }

              if (row) {
                // DISDIV existe déjà, mettre à jour le prix si nécessaire
                if (row.prix_ht !== nouveauMateriel.prix_ht) {
                  db.run(
                    'UPDATE materiel SET prix_ht = ?, designation = ?, couleur = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?',
                    [nouveauMateriel.prix_ht, nouveauMateriel.designation, 'violet', nouveauCode],
                    (updateErr) => {
                      if (updateErr) {
                        console.error(`❌ Erreur lors de la mise à jour de ${nouveauCode}:`, updateErr.message);
                        reject(updateErr);
                      } else {
                        console.log(`✅ ${nouveauMateriel.designation} (${nouveauCode}) mis à jour - Prix: ${nouveauMateriel.prix_ht}€`);
                        console.log(`\n✅ Migration terminée avec succès !`);
                        resolve();
                      }
                    }
                  );
                } else {
                  // Le prix est déjà correct, juste mettre à jour la couleur si nécessaire
                  db.run(
                    'UPDATE materiel SET couleur = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?',
                    ['violet', nouveauCode],
                    (updateErr) => {
                      if (updateErr) {
                        console.error(`❌ Erreur lors de la mise à jour de ${nouveauCode}:`, updateErr.message);
                        reject(updateErr);
                      } else {
                        console.log(`✅ ${nouveauMateriel.designation} (${nouveauCode}) existe déjà avec le bon prix`);
                        console.log(`\n✅ Migration terminée avec succès !`);
                        resolve();
                      }
                    }
                  );
                }
              } else {
                // DISDIV n'existe pas, le créer
                db.run(
                  `INSERT INTO materiel (code, designation, qte_dynamique, prix_ht, couleur, created_at, updated_at)
                   VALUES (?, ?, 1, ?, 'violet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                  [nouveauMateriel.code, nouveauMateriel.designation, nouveauMateriel.prix_ht],
                  function(insertErr) {
                    if (insertErr) {
                      console.error(`❌ Erreur lors de l'insertion de ${nouveauCode}:`, insertErr.message);
                      reject(insertErr);
                    } else {
                      console.log(`✅ ${nouveauMateriel.designation} (${nouveauCode}) créé - Prix: ${nouveauMateriel.prix_ht}€`);
                      console.log(`\n✅ Migration terminée avec succès !`);
                      resolve();
                    }
                  }
                );
              }
            }
          );
        }

        const code = anciensCodes[index];
        
        // Vérifier si le matériel existe avant de le supprimer
        db.get(
          'SELECT id, designation FROM materiel WHERE code = ?',
          [code],
          (err, row) => {
            if (err) {
              console.error(`❌ Erreur lors de la vérification de ${code}:`, err.message);
              errors++;
              deleteNext(index + 1);
              return;
            }

            if (row) {
              // Le matériel existe, le supprimer
              db.run(
                'DELETE FROM materiel WHERE code = ?',
                [code],
                function(deleteErr) {
                  if (deleteErr) {
                    console.error(`❌ Erreur lors de la suppression de ${code}:`, deleteErr.message);
                    errors++;
                  } else {
                    console.log(`✅ ${row.designation} (${code}) supprimé`);
                    deleted++;
                  }
                  deleteNext(index + 1);
                }
              );
            } else {
              // Le matériel n'existe pas, passer au suivant
              console.log(`⚠️  ${code} n'existe pas, ignoré`);
              deleteNext(index + 1);
            }
          }
        );
      };

      // Démarrer la suppression
      deleteNext(0);
    });
  });
}

// Exécuter la migration si le fichier est appelé directement
if (require.main === module) {
  removeOldDisjoncteursAndAddDisdiv()
    .then(() => {
      console.log('\n✅ Migration terminée avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur lors de la migration:', error);
      process.exit(1);
    });
}

module.exports = removeOldDisjoncteursAndAddDisdiv;


