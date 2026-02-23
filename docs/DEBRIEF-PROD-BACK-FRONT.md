# Debrief : Backend / Frontend dissociés en production

## 1. Dépendances backend manquantes dans `backend/package.json`

### Manquant (cause d’erreur sur le serveur back)

| Package   | Où c’est utilisé                          | Dans `backend/package.json` |
|----------|--------------------------------------------|------------------------------|
| **pdfmake** | `backend/utils/pdfGenerator.js` : `require('pdfmake/build/pdfmake')` et `require('pdfmake/build/vfs_fonts')` | **Non** |

Sans `pdfmake` dans les dépendances du backend, dès qu’une route utilise la génération PDF (devis, etc.), le serveur plante avec une erreur du type « Cannot find module 'pdfmake/build/pdfmake' » quand seul le dossier **backend** est déployé.

### Déjà présentes (OK)

- `cors`, `dotenv`, `express`, `sqlite3` → bien dans `backend/package.json`.
- `path`, `fs`, `crypto`, `readline` → modules Node intégrés, rien à ajouter.

**Action à faire :** ajouter **pdfmake** dans `backend/package.json` (dependencies), puis sur le serveur back faire `npm install` (ou équivalent) dans le dossier backend.

---

## 2. Chemins d’accès côté backend

### Base de données (`backend/config/database.js`)

- **En prod** : `dbPath = '/data/database.db'` (chemin absolu).
- **En dev** : `path.join(__dirname, '..', 'data', 'database.db')` → `backend/data/database.db`.

Risque en prod : si sur le serveur le répertoire `/data` n’existe pas ou n’est pas monté, la base ne sera pas trouvée / créée au bon endroit. Selon l’hébergeur, il faut soit créer `/data` et y mettre `database.db`, soit adapter pour rester dans l’arborescence du backend (ex. garder un chemin relatif à `__dirname` pour avoir `backend/data/database.db`).

### Servir le frontend (`backend/server.js`)

- En prod le serveur fait `path.join(__dirname, '..', 'dist')` pour servir le build React.
- Si tu déploies **uniquement le dossier backend** (sans dossier parent ni `dist`), ce chemin pointe vers un dossier inexistant. Les routes `/api/*` continueront de fonctionner, mais toute requête qui tombe dans le bloc « servir le frontend » (ex. GET `/` ou autre URL non-API) peut provoquer une erreur (fichier introuvable). En déploiement **back + front séparés**, ce bloc ne devrait pas être utilisé pour les vraies requêtes (le front est sur un autre domaine) ; le seul souci reste le risque d’erreur si une requête non-API arrive quand même sur le back.

### Autres chemins dans le backend

- Tous les `require('../...')` et `path.join(__dirname, '..', 'data', ...)` sont relatifs au dossier **backend** et à sa structure. Tant que tu déploies le backend avec la même arborescence (config, data, migrations, models, routes, utils, etc.), ces chemins restent valides.

---

## 3. Chemins d’accès côté frontend (appels API)

- Les appels API passent par **`src/services/api.js`** :
  - `API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.
- Aucun chemin physique vers le backend dans le code front : uniquement une **URL** (env ou fallback localhost).
- En prod, il suffit de **builder le front** avec **`VITE_API_URL`** défini vers l’URL réelle du backend (ex. `https://api.tondomaine.com/api`). Pas de dépendance à l’emplacement du dossier backend sur le disque.

Donc : **front et back sont bien dissociés côté chemins d’accès** ; le point critique est que **VITE_API_URL** soit correct au moment du build du frontend.

---

## 4. Récapitulatif des points à corriger pour la prod (back seul + front ailleurs)

1. **Backend**
   - Ajouter **pdfmake** dans `backend/package.json` et réinstaller les dépendances sur le serveur (`npm install` dans le dossier backend).
   - Vérifier le chemin de la base en prod (`/data/database.db` vs `backend/data/database.db`) et adapter si besoin (créer `/data`, ou utiliser un chemin relatif à `__dirname`).
   - Si le backend est déployé seul (sans `dist`), savoir que le bloc qui sert `dist` peut provoquer des erreurs pour les requêtes non-API ; en pratique, si le front est sur un autre domaine, ces requêtes ne devraient pas arriver sur le back.

2. **Frontend**
   - Au build, définir **VITE_API_URL** vers l’URL complète de l’API (ex. `https://api.tondomaine.com/api`) pour que tous les appels aillent vers le bon backend.

3. **Résumé**
   - **Dépendances utilisées dans le back** : tout est dans `backend/package.json` **sauf pdfmake** → à ajouter.
   - **Chemins** : back autonome côté chemins internes ; seul le chemin de la base en prod et le fait de servir ou non `dist` sont à valider. Front autonome tant que `VITE_API_URL` est correct au build.
