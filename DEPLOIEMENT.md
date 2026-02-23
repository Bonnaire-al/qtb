# Mise en production – QTB Electrotech

Ce guide décrit comment lancer le site en production (frontend + backend).

---

## Démarrage rapide (tout sur une machine)

```bash
# 1. À la racine : build du frontend (API sur le même serveur)
# Windows (PowerShell) :
$env:VITE_API_URL="/api"; npm run build

# Windows (CMD) :
set VITE_API_URL=/api && npm run build

# Linux / Mac :
export VITE_API_URL=/api && npm run build

# 2. Backend (créer backend/.env avec ADMIN_PASSWORD=ton_mot_de_passe)
cd backend
# Servir le site + l’API sur le même port (production) :
# Windows : set NODE_ENV=production && node server.js
# Linux/Mac : NODE_ENV=production node server.js
node server.js
```

Puis ouvrir **http://localhost:5000**. Pour que le **site React** s’affiche (et pas seulement l’API), il faut lancer le backend avec **NODE_ENV=production** : ainsi le serveur envoie le contenu de `dist/` pour toutes les URLs hors `/api`.

---

## En bref

1. **Backend** : Node.js + Express + SQLite. À héberger sur un serveur (VPS, Render, Railway, etc.).
2. **Frontend** : React (Vite). À builder puis servir (même serveur que le backend, ou Vercel/Netlify).
3. **Variables d’environnement** : à configurer côté backend et frontend (URL de l’API, mot de passe admin).

---

## 1. Build du frontend (production)

À la racine du projet :

```bash
npm run build
```

Cela crée le dossier **`dist/`** avec les fichiers statiques (HTML, JS, CSS). Ce dossier est à déployer sur un hébergeur web ou à servir par le même serveur que le backend.

---

## 2. Configurer le frontend pour la prod

À la **racine** du projet, crée un fichier **`.env`** (ou configure les variables sur ton hébergeur) :

```env
# URL de ton API en production (sans slash final)
VITE_API_URL=https://ton-api.com/api
```

Remplace `https://ton-api.com/api` par l’URL réelle de ton backend (ex. `https://backend.qtbelectrotech.fr/api`).

**Important** : `VITE_API_URL` doit être défini **au moment du build** (`npm run build`). Si tu changes l’URL après, il faut refaire un build.

---

## 3. Lancer le backend en production

Dans le dossier **`backend/`** :

### 3.1 Variables d’environnement

Le fichier **`backend/.env`** doit contenir au minimum :

```env
ADMIN_PASSWORD=TonMotDePasseSecretPourAdmin
PORT=5000
```

En production, utilise un mot de passe fort et ne commite jamais ce fichier.

### 3.2 Base de données

- Le fichier **`backend/data/database.db`** est la base SQLite.
- En prod : soit tu copies une base déjà remplie (prestations, matériel, etc.) depuis ta machine, soit tu déploies une base vide ; les migrations au démarrage créeront les tables **avis** et **devis rapide**.
- Assure-toi que le dossier **`backend/data/`** existe et que le processus Node peut **écrire** dedans (création/mise à jour de `database.db`).

### 3.3 Démarrer le serveur

```bash
cd backend
npm install --production
node server.js
```

Ou avec un outil pour garder le processus actif (PM2, systemd, etc.) :

```bash
# Exemple avec PM2
npm install -g pm2
cd backend
pm2 start server.js --name qtbe-api
pm2 save
pm2 startup
```

Le backend écoute sur le port défini par `PORT` (défaut 5000).

---

## 4. Servir le frontend en production

Deux options courantes :

### Option A – Tout sur le même serveur (recommandé pour démarrer)

Le backend est déjà configuré pour servir le frontend quand `NODE_ENV=production`.

1. **Build du frontend** à la racine, avec une variable d’environnement pour l’API :
   ```bash
   # L’API sera sur le même domaine, donc on utilise /api
   set VITE_API_URL=/api
   npm run build
   ```
   (Sous Linux/Mac : `export VITE_API_URL=/api` puis `npm run build`.)

2. **Lancer le backend** depuis la racine du projet (pour que `backend/` et `dist/` soient au bon endroit) :
   ```bash
   cd backend
   set NODE_ENV=production
   set PORT=5000
   node server.js
   ```
   (Sous Linux/Mac : `NODE_ENV=production PORT=5000 node server.js`.)

3. Ouvrir **http://localhost:5000** (ou ton domaine) : le site s’affiche et l’API est en **http://localhost:5000/api**.

### Option B – Frontend et backend séparés

- **Frontend** : déployer le contenu de **`dist/`** sur Vercel, Netlify, ou un hébergement statique. Configurer **VITE_API_URL** au build vers l’URL du backend.
- **Backend** : déployer sur Render, Railway, un VPS, etc. Configurer **CORS** pour autoriser l’origine de ton frontend (déjà présent avec `cors()` dans le projet).
- **Base SQLite** : sur Render/Railway, le disque peut être éphémère ; prévoir une base persistante ou un add-on stockage selon l’hébergeur.

---

## 5. Checklist avant mise en ligne

- [ ] **Backend** : `backend/.env` avec `ADMIN_PASSWORD` et `PORT` (et `NODE_ENV=production` si tu l’utilises).
- [ ] **Frontend** : build avec `VITE_API_URL` pointant vers l’URL réelle de l’API.
- [ ] **Base de données** : `backend/data/database.db` présent et accessible en écriture (ou migrations qui créent les tables au premier démarrage).
- [ ] **HTTPS** : en production, utiliser HTTPS pour le site et l’API (certificat Let’s Encrypt, proxy Nginx, etc.).
- [ ] **Admin** : tester la connexion à `/admin` avec le mot de passe défini dans `ADMIN_PASSWORD`.

---

## 6. Résumé des commandes (même machine)

```bash
# 1. Build du frontend (à la racine, avec .env contenant VITE_API_URL)
npm run build

# 2. Backend (dans backend/)
cd backend
npm install --production
# Vérifier que .env existe (ADMIN_PASSWORD, PORT)
node server.js
```

Ensuite, soit tu serves `dist/` avec le même Node (Option A), soit tu déploies `dist/` et le backend sur deux hébergements (Option B).

Si tu indiques où tu veux héberger (VPS, Render, Vercel, etc.), on peut adapter les étapes précisément.
