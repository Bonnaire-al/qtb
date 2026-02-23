# Accès à l’administration

## Comment accéder à l’admin

1. **URL**  
   - En local : [http://localhost:5173/admin](http://localhost:5173/admin) (ou le port de votre front React).  
   - En production : `https://votre-domaine.com/admin`.

2. **Connexion**  
   La page affiche un formulaire avec un champ **Mot de passe**.  
   Entrez le mot de passe configuré côté backend (voir ci‑dessous).  
   Après connexion, vous accédez au panneau (matériel, prestations, devis, avis, etc.).

---

## Configuration du mot de passe

Le mot de passe est lu **uniquement côté backend** via la variable d’environnement **`ADMIN_PASSWORD`**.

### En local (avant déploiement)

1. Dans le dossier **backend**, créez un fichier **`.env`** (s’il n’existe pas).
2. Copiez le contenu de **`backend/.env.example`** dans **`backend/.env`**.
3. Remplacez la valeur de `ADMIN_PASSWORD` par le mot de passe que vous voulez utiliser pour vous connecter à `/admin` :

   ```env
   ADMIN_PASSWORD=MonMotDePasseSecret123
   ```

4. Redémarrez le serveur backend.  
   Dès que le backend tourne avec ce `.env`, vous pouvez vous connecter à `/admin` avec ce mot de passe.

### En déploiement (production)

- Ne **jamais** mettre le mot de passe dans le code ni dans un fichier versionné.
- Définir **`ADMIN_PASSWORD`** dans l’environnement du serveur qui exécute le backend, par exemple :
  - **Vercel / Netlify (serverless)** : variable d’environnement dans le dashboard (ex. `ADMIN_PASSWORD`).
  - **VPS / Node sur un serveur** : exporter dans le shell ou dans le système d’init (systemd, etc.) :  
    `export ADMIN_PASSWORD=votre_mot_de_passe_secret`
  - **Docker** : `-e ADMIN_PASSWORD=votre_mot_de_passe_secret` ou dans un fichier env non versionné.

Le frontend appelle `POST /api/admin/login` avec le mot de passe saisi ; le backend compare avec `process.env.ADMIN_PASSWORD`. En prod, assurez-vous aussi que l’API est en HTTPS et que l’URL de l’API (`VITE_API_URL`) pointe vers votre backend déployé.

---

## Résumé

| Étape | Action |
|-------|--------|
| 1 | Créer `backend/.env` à partir de `backend/.env.example` |
| 2 | Mettre dans `.env` : `ADMIN_PASSWORD=votre_mot_de_passe` |
| 3 | Démarrer le backend (et le front) |
| 4 | Aller sur `/admin` et entrer ce mot de passe |

Si `ADMIN_PASSWORD` n’est pas défini, le backend renverra une erreur du type *« Configuration serveur manquante (ADMIN_PASSWORD non défini) »* au moment de la connexion.
