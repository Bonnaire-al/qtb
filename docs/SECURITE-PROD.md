# Sécurité et performance – mise en production

## Déjà en place

- **URL API** : `VITE_API_URL` en front, pas d’URL en dur.
- **Admin** : mot de passe via `VITE_ADMIN_PASSWORD` (à définir en prod).
- **Validation PDF** : nom et email contrôlés **côté backend** (generate + download) en plus du front.
- **Logique devis rapide** : construction des items faite **uniquement côté backend** (`POST /api/rapid/prepare`). Le front n’a plus que les constantes UI (gammes, types d’installation) dans `QuoteRapid/logic.js`.

## Recommandations pour aller plus loin

### 1. Authentification admin côté backend (sécurité)

Actuellement, le mot de passe admin est vérifié dans le front (variable d’environnement dans le bundle). Pour une vraie sécurité en prod :

- **Backend** : ajouter une route `POST /api/admin/login` avec `{ password }`, comparer à `process.env.ADMIN_PASSWORD`, renvoyer un **JWT** ou un token de session (cookie httpOnly).
- **Backend** : protéger les routes de **modification** (POST/PUT/DELETE sur prestations, matériel, liaisons, config rapide) avec un middleware qui vérifie le token. Les GET restent publics (formulaire, structure).
- **Front** : après login, appeler cette API, stocker le token (mémoire ou localStorage), et l’envoyer dans l’en-tête `Authorization: Bearer <token>` pour toutes les requêtes admin.

Le mot de passe ne sera plus présent dans le code ni dans le bundle front.

### 2. Config dynamique (optionnel, performance / cohérence)

Les listes **INSTALLATION_TYPES** et **RAPID_GAMMES** sont en dur dans le front. Pour un seul point de vérité et des mises à jour sans redéploiement :

- **Backend** : exposer par exemple `GET /api/config/installation-types` et `GET /api/config/rapid-gammes` (ou une seule route `GET /api/config`).
- **Front** : charger cette config au montage du formulaire devis rapide au lieu d’importer les constantes.

Ce n’est pas indispensable : les constantes actuelles restent correctes pour la perf.

### 3. Fichiers “logic” contrôlés

| Fichier | Rôle | Côté backend ? |
|--------|------|------------------|
| `pdfService.js` | Appel API + validation basique | Validation doublée côté backend (nom, email). Pas de logique métier à déplacer. |
| `useFormLogic.js` | State formulaire + `getServicesForRoom` (merge commun/spécifique) | Données déjà chargées via `getFormStructure`. Le merge côté front est léger ; on pourrait pré-calculer la structure par pièce en backend si besoin. |
| `QuoteRapid/logic.js` | Constantes UI (gammes, types d’installation) | Construction des items déjà en backend. Constantes peuvent rester en front ou être servies par une API config (voir §2). |

## Résumé

- **Sécurité** : validation PDF (nom, email) côté backend en place ; prochaine étape recommandée = **auth admin backend** (login + protection des routes d’écriture).
- **Performance** : pas de grosse logique à déplacer ; la partie lourde (prix, matériel, PDF) est déjà au backend.
- **Maintenabilité** : code mort supprimé dans `QuoteRapid/logic.js` ; une seule source de vérité pour les items du devis rapide (backend).
