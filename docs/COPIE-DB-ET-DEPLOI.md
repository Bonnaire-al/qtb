# Copier la base locale et faire fonctionner le déploiement

## Pourquoi le déploiement ne fonctionne pas ?

Plusieurs causes possibles :

### 1. Chemin de la base en production (corrigé)

Le code utilisait **`/data/database.db`** en production. Sur Railway (et la plupart des hébergeurs) :
- le dossier **`/data`** n’existe pas ou n’est pas inscriptible ;
- le serveur ne trouvait donc pas la base ou ne pouvait pas l’écrire → erreurs.

**Modif appliquée** : la base est maintenant toujours en **`backend/data/database.db`** (chemin relatif au projet), comme en local. Tu peux éventuellement surcharger avec la variable d’environnement **`DATABASE_PATH`** sur Railway.

### 2. Base vide à chaque déploiement (Railway)

Sur Railway, à chaque **nouveau déploiement** (push Git, redéploiement), le conteneur est recréé et le disque est **remis à zéro**. Donc :
- la base **`backend/data/database.db`** est recréée vide par les migrations ;
- tes données (prestations, matériel, etc.) **ne sont pas** sur le serveur sauf si tu les y mets explicitement.

Pour que “déployer” fonctionne avec tes données, il faut soit **inclure la DB dans le déploiement**, soit utiliser un **volume persistant** (voir ci‑dessous).

### 3. Autres causes possibles

- **CORS** : le front doit appeler l’URL du back ; si le domaine du front n’est pas autorisé côté back, les requêtes échouent.
- **Variables d’environnement** : sur Railway, il faut définir **`ADMIN_PASSWORD`** (et optionnellement **`DATABASE_PATH`**) dans les variables d’environnement du projet.

---

## Comment copier ta base locale pour l’utiliser en prod

### Option A – Inclure la DB dans Git (simple, pour petite base)

1. Copie ta base locale dans le repo :
   - Fichier source : **`backend/data/database.db`** (ta base locale avec prestations, matériel, etc.).
   - Il doit rester à l’emplacement : **`backend/data/database.db`** dans le projet.

2. Vérifie que ce fichier **n’est pas ignoré** par Git :
   - Dans le `.gitignore` à la racine, il ne doit **pas** y avoir de règle du type `*.db` ou `backend/data/*.db` qui ignorerait ce fichier.
   - Si une de ces règles existe, tu peux la retirer uniquement pour ce fichier (ou ne pas ignorer `backend/data/`).

3. Commit et push :
   ```bash
   git add backend/data/database.db
   git commit -m "Ajout base de données pour déploiement"
   git push
   ```
   Au prochain déploiement Railway, le serveur utilisera cette base (tables + données).

**Inconvénient** : à chaque modification de la base en prod, il faudrait la retélécharger, la modifier en local, puis la re-commiter. Pas idéal si beaucoup de données changent en prod.

### Option B – Volume persistant Railway (recommandé si tu utilises Railway)

Oui : le dossier **data** (en pratique le fichier **database.db**) peut être utilisé via un **volume** Railway. Les données restent alors entre les déploiements.

1. **Créer le volume**  
   Dans le dashboard Railway : ton service (backend) → onglet **Volumes** → **Add Volume**. Choisir un **mount path**, par ex. **`/data`**.

2. **Indiquer le chemin de la base**  
   Dans **Variables** du service, ajouter :
   ```env
   DATABASE_PATH=/data/database.db
   ```
   Le backend utilise cette variable : la base sera lue/écrite sur le volume et **conservée** entre les déploiements.

3. **Première fois : remplir le volume**  
   Si tu déploies **avec** `backend/data/database.db` dans le repo (Option A), au premier démarrage le backend **copie automatiquement** ce fichier vers `/data/database.db` si le volume est vide. Les déploiements suivants utiliseront alors la base du volume (persistante).  
   Sinon, tu peux copier la base vers le volume manuellement (CLI Railway, script, etc.).

Documentation Railway : [Railway – Volumes](https://docs.railway.app/reference/volumes).

### Option C – Copier la DB “à la main” après déploiement

1. En local, récupère le fichier **`backend/data/database.db`** (ta base complète).

2. Sur Railway, si tu as un shell ou un moyen d’upload :
   - place ce fichier dans **`backend/data/database.db`** (ou au chemin défini par **`DATABASE_PATH`**).

Sans volume, au prochain **redéploiement** cette base sera de nouveau perdue (disque éphémère).

---

## Récapitulatif

| Problème | Solution |
|----------|----------|
| Erreur “table doesn’t exist” ou chemin base | Utiliser le chemin relatif `backend/data/database.db` (déjà en place) ou `DATABASE_PATH` sur Railway. |
| Base vide après déploiement | Inclure `backend/data/database.db` dans Git (Option A) ou utiliser un volume Railway (Option B). |
| Où “copier” la DB | Soit dans le repo (`backend/data/database.db`) puis `git add` / `git push`, soit sur un volume Railway (`DATABASE_PATH=/data/database.db`). |

En résumé : **pourquoi le déploiement ne fonctionnait pas** = mauvais chemin en prod (`/data/database.db`) et/ou base absente ou effacée à chaque déploiement. **Comment copier la DB** = Option A (fichier dans Git) ou Option B (volume Railway + variable `DATABASE_PATH`).
