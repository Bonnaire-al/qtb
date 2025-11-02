-- Migration : Fusionner la table prix dans prestations
-- Date : 2025-10-12

-- Étape 1 : Ajouter la colonne prix_ht dans la table prestations (si elle n'existe pas déjà)
ALTER TABLE prestations ADD COLUMN prix_ht REAL DEFAULT 0;

-- Étape 2 : Migrer les prix de la table prix vers prestations
-- Mise à jour basée sur la correspondance : categorie + piece (sous_categorie) + service_value (service)
UPDATE prestations
SET prix_ht = (
    SELECT prix.prix_ht 
    FROM prix 
    WHERE prix.categorie = prestations.categorie 
      AND prix.sous_categorie = prestations.piece 
      AND prix.service = prestations.service_value
)
WHERE EXISTS (
    SELECT 1 
    FROM prix 
    WHERE prix.categorie = prestations.categorie 
      AND prix.sous_categorie = prestations.piece 
      AND prix.service = prestations.service_value
);

-- Étape 3 : Pour les prestations avec piece = 'commun', chercher le prix avec sous_categorie = 'commun'
UPDATE prestations
SET prix_ht = (
    SELECT prix.prix_ht 
    FROM prix 
    WHERE prix.categorie = prestations.categorie 
      AND prix.sous_categorie = 'commun'
      AND prix.service = prestations.service_value
)
WHERE piece = 'commun'
  AND prix_ht = 0
  AND EXISTS (
    SELECT 1 
    FROM prix 
    WHERE prix.categorie = prestations.categorie 
      AND prix.sous_categorie = 'commun'
      AND prix.service = prestations.service_value
);

-- Étape 4 : Vérification - Afficher les prestations qui n'ont pas trouvé de prix
SELECT 'Prestations sans prix après migration:' as message;
SELECT id, categorie, piece, service_value, service_label, prix_ht 
FROM prestations 
WHERE prix_ht = 0 OR prix_ht IS NULL;

-- Étape 5 : Optionnel - Supprimer la table prix (commenté par sécurité)
-- DROP TABLE IF EXISTS prix;

-- Étape 6 : Vérification finale - Compter les enregistrements
SELECT 'Nombre total de prestations:' as message, COUNT(*) as total FROM prestations;
SELECT 'Nombre de prestations avec prix:' as message, COUNT(*) as total FROM prestations WHERE prix_ht > 0;


