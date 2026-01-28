# Migration : Matériels du Tableau Électrique

## Description

Cette migration ajoute les 13 matériels nécessaires pour le calcul automatique du tableau électrique dans la base de données.

## Matériels ajoutés

Tous les matériels sont ajoutés avec :
- **Couleur** : `violet` (marqueur spécial)
- **Prix initial** : `1` (modifiable depuis l'admin)
- **qte_dynamique** : `1` (quantité dynamique)

### Liste des matériels

1. **TAB001** - Tableau 1 rangée
2. **TAB002** - Tableau 2 rangées
3. **TAB003** - Tableau 3 rangées
4. **TAB004** - Tableau 4 rangées
5. **DIF001** - Disjoncteur différentiel monophasé
6. **DIF002** - Disjoncteur différentiel triphasé
7. **DIS002** - Disjoncteur 2A
8. **DIS010** - Disjoncteur 10A
9. **DIS016** - Disjoncteur 16A
10. **DIS020** - Disjoncteur 20A
11. **DIS032** - Disjoncteur 32A
12. **HOR001** - Horloge/contacteur heure creuse
13. **TEL001** - Telerupteur

## Exécution de la migration

### Option 1 : Exécution directe

```bash
cd backend/migrations
node add-tableau-electrique-materiels.js
```

### Option 2 : Via Node.js

```bash
node backend/migrations/add-tableau-electrique-materiels.js
```

## Comportement

- Si un matériel avec le même code existe déjà, sa couleur sera mise à jour à `violet`
- Si un matériel n'existe pas, il sera créé avec toutes les propriétés
- La migration est idempotente (peut être exécutée plusieurs fois sans problème)

## Protection contre modification/suppression

**Note** : La protection contre la modification/suppression depuis l'admin doit être gérée côté application (dans le modèle Admin ou dans les routes API) en vérifiant la couleur `violet`.

Exemple de vérification :
```javascript
if (materiel.couleur === 'violet') {
  // Bloquer la modification/suppression (sauf prix)
}
```

## Vérification

Après l'exécution, vous pouvez vérifier les matériels ajoutés :

```sql
SELECT code, designation, prix_ht, couleur 
FROM materiel 
WHERE couleur = 'violet' 
ORDER BY code;
```












