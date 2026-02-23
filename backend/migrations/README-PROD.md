# Migrations et déploiement en production

## Migrations exécutées au démarrage du serveur

Au lancement du backend (`node server.js` ou `npm start`), **3 migrations** sont exécutées automatiquement dans cet ordre :

| Migration | Rôle |
|-----------|------|
| `create-avis-table.js` | Crée la table `avis` (commentaires clients, notation 5 étoiles, email). |
| `add-google-account-to-avis.js` | Ajoute la colonne `google_account` à `avis` si elle n’existe pas. |
| `20260130_create-rapid-devis-config.js` | Crée les tables Devis rapide : `rapid_config`, `rapid_pack`, `rapid_pack_prestation` et insère les 6 packs (piece/cuisine × classic/premium/luxe). |

Ces migrations sont **idempotentes** (CREATE TABLE IF NOT EXISTS, INSERT OR IGNORE) : on peut redémarrer le serveur sans risque, elles ne modifient que ce qui manque.

**En production** : rien à faire de plus. Dès que le backend démarre, les tables avis et devis rapide sont prêtes.

---

## Base de données « de base »

Le backend suppose que la base SQLite contient déjà les tables principales :

- `prestations`, `materiel`, `liaisons`, etc.

Ces tables viennent en général :

- soit d’une **copie** d’une base de dev déjà migrée,
- soit d’un **script ou processus** de création initiale (hors de ce dossier de migrations).

Les autres fichiers dans `migrations/` (restructure-materiel, simplify-schema, add-prix-column, etc.) sont des **migrations ponctuelles** déjà appliquées en dev ; on ne les relance pas en prod au démarrage.

---

## Vérifier que tout est en place

Après le premier démarrage en prod :

1. **Avis** : un avis peut être créé depuis le site et apparaît dans l’admin.
2. **Devis rapide** : la page « Devis rapide » charge sans erreur et les packs (Classic / Premium / Luxe) sont disponibles.

En cas d’erreur au démarrage (ex. `table already exists`), les migrations concernées sont conçues pour ne pas échouer ; vérifier les logs et que le fichier `backend/data/database.db` est accessible en écriture.
