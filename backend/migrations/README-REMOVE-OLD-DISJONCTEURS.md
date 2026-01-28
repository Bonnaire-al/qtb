# Migration : Suppression des anciens disjoncteurs et ajout de DISDIV

## Description

Cette migration supprime les anciens disjoncteurs spécifiques (DIS010, DIS016, DIS020, DIS032) et s'assure que le nouveau matériel **DISDIV** (Disjoncteur divisionnaire) existe avec le bon prix (15.50€).

## Matériels supprimés

- **DIS010** - Disjoncteur 10A
- **DIS016** - Disjoncteur 16A
- **DIS020** - Disjoncteur 20A
- **DIS032** - Disjoncteur 32A

## Matériel ajouté/mis à jour

- **DISDIV** - Disjoncteur divisionnaire (15.50€)

## Exécution de la migration

### Option 1 : Exécution directe

```bash
cd backend/migrations
node remove-old-disjoncteurs-add-disdiv.js
```

### Option 2 : Via Node.js depuis la racine

```bash
node backend/migrations/remove-old-disjoncteurs-add-disdiv.js
```

## Comportement

1. **Suppression** : Supprime les 4 anciens disjoncteurs s'ils existent
2. **Vérification** : Vérifie si DISDIV existe
3. **Création/Mise à jour** :
   - Si DISDIV n'existe pas : le crée avec prix 15.50€
   - Si DISDIV existe : met à jour le prix à 15.50€ si nécessaire
   - Met à jour la couleur à `violet` pour le marquage spécial

## Important

⚠️ **Cette migration est destructive** : elle supprime définitivement les anciens disjoncteurs de la base de données.

Assurez-vous que :
- Aucun devis en cours n'utilise les anciens codes (DIS010, DIS016, DIS020, DIS032)
- Tous les calculs utilisent maintenant DISDIV

## Vérification

Après l'exécution, vous pouvez vérifier :

```sql
-- Vérifier que les anciens disjoncteurs sont supprimés
SELECT code, designation FROM materiel WHERE code IN ('DIS010', 'DIS016', 'DIS020', 'DIS032');
-- Devrait retourner 0 lignes

-- Vérifier que DISDIV existe avec le bon prix
SELECT code, designation, prix_ht FROM materiel WHERE code = 'DISDIV';
-- Devrait retourner : DISDIV | Disjoncteur divisionnaire | 15.50
```


