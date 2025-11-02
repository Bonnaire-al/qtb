# 🔴 PROBLÈME IMPORTANT : Formulaire utilise des données statiques

## ⚠️ Le Problème

Actuellement, le **formulaire de devis ne charge PAS les services depuis la base de données**.  
Il utilise des **données statiques** codées en dur dans les fichiers :
- `src/data/servicesData.js` - Services et catégories statiques
- `src/data/prix.js` - Prix statiques

**Conséquence** : Les nouveaux éléments ajoutés via la page Admin n'apparaissent PAS dans le formulaire ! 😱

## 📊 État Actuel

### ✅ Page Admin (fonctionne correctement)
- ✅ Charge les données depuis l'API/Base de données
- ✅ Affiche tous les services des 5 catégories (domotique, installation, appareillage, portail, securite)
- ✅ Permet l'ajout/modification/suppression via modals
- ✅ Les modifications sont enregistrées dans la base de données

### ❌ Formulaire de Devis (problème)
- ❌ Utilise des données statiques dans `servicesData.js`
- ❌ N'affiche PAS les nouveaux services ajoutés via Admin
- ❌ Ne se met PAS à jour automatiquement

## 🔧 Solutions Possibles

### Solution 1 : Garder les données statiques (ACTUEL)
**Avantages :**
- Plus rapide (pas d'appels API)
- Fonctionne hors ligne
- Pas de latence

**Inconvénients :**
- ❌ Nécessite de modifier le code pour ajouter des services
- ❌ Les ajouts via Admin n'apparaissent pas dans le formulaire
- ❌ Duplication des données (DB + fichiers JS)
- ❌ Risque d'incohérence

**À faire si vous gardez cette solution :**
1. Copier manuellement les nouveaux services de la DB vers `servicesData.js`
2. Garder Admin uniquement pour gérer les prix de calcul
3. Documenter cette limitation

### Solution 2 : Connecter le formulaire à l'API (RECOMMANDÉ) ✅
**Avantages :**
- ✅ Source unique de vérité (la base de données)
- ✅ Les ajouts via Admin apparaissent automatiquement
- ✅ Cohérence totale des données
- ✅ Pas de duplication

**Inconvénients :**
- Nécessite des modifications importantes du code
- Légère latence au chargement
- Dépend du backend

## 🚀 Comment Implémenter la Solution 2

### Étape 1 : Créer des hooks pour charger les données

```javascript
// src/hooks/useServices.js
import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const useServices = (serviceType) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [prix, setPrix] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prestationsData, prixData] = await Promise.all([
          ApiService.getPrestationsByCategorie(serviceType),
          ApiService.getPrixByCategorie(serviceType)
        ]);
        setPrestations(prestationsData);
        setPrix(prixData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (serviceType) {
      loadData();
    }
  }, [serviceType]);

  return { prestations, prix, loading, error };
};
```

### Étape 2 : Modifier `useFormLogic.js`

Remplacer les imports statiques par des appels API :

```javascript
// AVANT (statique)
import { roomsByService, servicesByRoom } from '../../data/servicesData';
import { prixPrestations } from '../../data/prix';

// APRÈS (dynamique)
import { useServices } from '../../hooks/useServices';

export const useFormLogic = (serviceType) => {
  const { prestations, prix, loading, error } = useServices(serviceType);
  
  // Transformer les données API en structure utilisable
  const servicesByRoom = useMemo(() => {
    if (!prestations) return {};
    
    const grouped = {};
    prestations.forEach(p => {
      const room = p.piece || 'commun';
      if (!grouped[room]) grouped[room] = [];
      grouped[room].push({
        value: p.service_value,
        label: p.service_label
      });
    });
    return grouped;
  }, [prestations]);
  
  // ... reste de la logique
};
```

### Étape 3 : Gérer l'état de chargement

```javascript
// Dans Form.jsx
if (loading) {
  return <div className="text-center py-8">Chargement des services...</div>;
}

if (error) {
  return <div className="text-center py-8 text-red-600">Erreur : {error}</div>;
}
```

## 📝 Notes Importantes

1. **Structure des données** :
   - Les prestations dans la DB utilisent `service_value` et `service_label`
   - Le formulaire attend `value` et `label`
   - Transformation nécessaire pour la compatibilité

2. **Gestion des pièces** :
   - Domotique/Installation : prestations groupées par `piece`
   - Sécurité : pas de pièces (piece = NULL)
   - Portail : groupé par sous-catégorie (portail/volet)

3. **Calcul des prix** :
   - Les prix de base viennent de la table `prix`
   - Les calculs complexes (radiateur, caméra, etc.) sont dans `pdfCalculs.js`
   - Ces calculs doivent utiliser les prix de l'API

## ✅ Ce qui a été fait

- ✅ Page Admin avec modals d'ajout fonctionnels
- ✅ Base de données complète avec les 5 services
- ✅ API fonctionnelle pour CRUD sur materiel/prix/prestations
- ✅ Chargement dynamique des catégories dans Admin
- ✅ Correction des bugs de saisie

## 🎯 Ce qui reste à faire

- [ ] Connecter le formulaire à l'API (Solution 2)
- [ ] Créer le hook `useServices`
- [ ] Modifier `useFormLogic` pour utiliser l'API
- [ ] Tester tous les types de services
- [ ] Vérifier les calculs de prix avec données API
- [ ] Documenter la nouvelle architecture

## 🤔 Quelle solution choisir ?

**Pour un MVP rapide** : Gardez Solution 1, mais documentez bien la limitation

**Pour une application évolutive** : Implémentez Solution 2 maintenant

---

💡 **Note** : Si vous avez des questions sur l'implémentation, référez-vous à ce document ou demandez de l'aide !


