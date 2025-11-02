# Migration : Fusion des Prix dans Prestations

## Description
Cette migration fusionne la table `prix` dans la table `prestations` pour simplifier la base de données. Les prix sont maintenant stockés directement dans les prestations, comme pour le matériel.

## Changements effectués

### 1. Modèle de données
- ✅ Ajout de la colonne `prix_ht` dans la table `prestations`
- ✅ Migration des données de la table `prix` vers `prestations`
- ✅ Suppression de la table `prix` (optionnelle)

### 2. Backend
- ✅ Mise à jour de `P-model.js` pour inclure `prix_ht`
- ✅ Suppression de `Prix-model.js`
- ✅ Suppression de `Prix-controller.js`
- ✅ Déplacement des fonctions de calcul vers `utils/prixCalculs.js`
- ✅ Mise à jour de `PDF-controller.js` pour utiliser `PrestationModel` et `PrixCalculs`
- ✅ Suppression des routes `/api/prix`
- ✅ Mise à jour de `server.js`

### 3. Frontend
- ✅ Suppression de l'onglet "Prix" dans Admin
- ✅ Ajout de la colonne prix dans l'onglet "Prestations"
- ✅ Mise à jour des formulaires d'ajout/modification
- ✅ Nettoyage de l'ApiService (suppression des méthodes prix)

## Exécution de la migration

### Prérequis
- Node.js installé
- Base de données SQLite existante

### Étapes

1. **Faire une sauvegarde de la base de données**
   ```bash
   cp backend/data/database.db backend/data/database.backup.db
   ```

2. **Exécuter le script de migration**
   ```bash
   cd backend
   node migrations/run-migration.js
   ```

3. **Vérifier les résultats**
   Le script affichera :
   - Le nombre de prestations migrées
   - Les prestations sans prix (si applicable)
   - Un résumé de la migration

4. **Redémarrer le serveur**
   ```bash
   npm start
   ```

## Vérification manuelle

### Vérifier les données
```sql
-- Afficher les prestations avec leurs prix
SELECT id, categorie, piece, service_value, service_label, prix_ht 
FROM prestations 
LIMIT 10;

-- Compter les prestations avec prix
SELECT COUNT(*) as total_avec_prix 
FROM prestations 
WHERE prix_ht > 0;

-- Trouver les prestations sans prix
SELECT * 
FROM prestations 
WHERE prix_ht = 0 OR prix_ht IS NULL;
```

### Supprimer définitivement la table prix (optionnel)
⚠️ **Attention** : Cette action est irréversible !

```sql
DROP TABLE IF EXISTS prix;
```

## Rollback (en cas de problème)

Si la migration pose problème :

1. Arrêter le serveur
2. Restaurer la sauvegarde :
   ```bash
   cp backend/data/database.backup.db backend/data/database.db
   ```
3. Restaurer les fichiers depuis Git :
   ```bash
   git checkout backend/models/Prix-model.js
   git checkout backend/controllers/Prix-controller.js
   git checkout backend/routes/prix.js
   git checkout backend/server.js
   git checkout src/services/api.js
   git checkout src/pages/Admin.jsx
   ```

## Structure finale

### Table prestations
```sql
CREATE TABLE prestations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  categorie TEXT NOT NULL,
  piece TEXT,
  service_value TEXT NOT NULL,
  service_label TEXT NOT NULL,
  prix_ht REAL DEFAULT 0
);
```

### API disponible
- `GET /api/prestations` - Toutes les prestations (avec prix)
- `GET /api/prestations/:categorie` - Prestations par catégorie
- `POST /api/prestations` - Créer une prestation (avec prix)
- `PUT /api/prestations/:id` - Mettre à jour une prestation (avec prix)
- `DELETE /api/prestations/:id` - Supprimer une prestation

## Avantages de cette migration

✅ **Simplicité** : Une seule table au lieu de deux  
✅ **Cohérence** : Même structure que le matériel  
✅ **Performance** : Moins de jointures nécessaires  
✅ **Maintenance** : Code plus simple et plus clair  
✅ **Évolutivité** : Plus facile d'ajouter de nouveaux champs  

## Support

En cas de problème, vérifiez :
1. Les logs du serveur backend
2. Les erreurs dans la console du navigateur
3. La structure de la base de données avec un outil comme DB Browser for SQLite

