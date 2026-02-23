// Fonctions de calcul des prix pour les différents types de services

class PrixCalculs {
  // ==================== FONCTIONS DE CALCUL DE PRIX ====================
  
  static calculateRadiateurPrice(prixBase, quantity, coefficient) {
    if (quantity === 1) {
      return prixBase * coefficient;
    } else if (quantity >= 2) {
      const firstUnitPrice = prixBase * coefficient;
      const secondUnitPrice = prixBase * 0.5;
      const additionalUnitsPrice = prixBase * (quantity - 2);
      return firstUnitPrice + secondUnitPrice + additionalUnitsPrice;
    }
    return 0;
  }

  static calculateCameraPrice(prixBase, quantity, coefficient) {
    if (quantity === 1) {
      return prixBase * coefficient;
    } else if (quantity >= 2) {
      const firstUnitPrice = prixBase * coefficient;
      const additionalUnitsPrice = prixBase * (quantity - 1);
      return firstUnitPrice + additionalUnitsPrice;
    }
    return 0;
  }

  static calculateEclairagePrice(prixBase, quantity, coefficient) {
    if (quantity === 1) {
      return prixBase * coefficient;
    } else if (quantity >= 2 && quantity <= 4) {
      const firstUnitPrice = prixBase * coefficient;
      const additionalUnitsPrice = prixBase * 0.25 * (quantity - 1);
      return firstUnitPrice + additionalUnitsPrice;
    } else if (quantity >= 5 && quantity <= 6) {
      const firstUnitPrice = prixBase * coefficient;
      const middleUnitsPrice = prixBase * 0.25 * 3;
      return firstUnitPrice + middleUnitsPrice;
    } else if (quantity >= 7) {
      const firstUnitPrice = prixBase * coefficient;
      const middleUnitsPrice = prixBase * 0.25 * 3;
      const highQuantityPrice = prixBase * 0.25 * (quantity - 6);
      return firstUnitPrice + middleUnitsPrice + highQuantityPrice;
    }
    return 0;
  }

  static calculateMiroirPrice(prixBase, quantity, coefficient) {
    if (quantity === 1) {
      return prixBase * coefficient;
    } else if (quantity >= 2 && quantity <= 4) {
      const firstUnitPrice = prixBase * coefficient;
      const additionalUnitsPrice = prixBase * (quantity - 1);
      return firstUnitPrice + additionalUnitsPrice;
    } else if (quantity >= 5) {
      const firstUnitPrice = prixBase * coefficient;
      const additionalUnitsPrice = prixBase * (quantity - 1);
      return firstUnitPrice + additionalUnitsPrice;
    }
    return 0;
  }

  // ==================== COEFFICIENTS D'INSTALLATION ====================
  
  static getInstallationCoefficient(serviceType, installationType) {
    // Suppression de la logique appareillage car cette catégorie n'existe plus
    
    const coefficients = {
      'saignee_encastre': 2.50,
      'saillie_moulure': 2.0,
      'cloison_creuse': 1.50,
      'alimentation_existante': 1.0
    };
    
    return coefficients[installationType] || 1.0;
  }

  // ==================== FONCTION DE CALCUL GÉNÉRIQUE ====================
  
  static calculateServicePrice(serviceLabel, serviceType, prixBase, quantity, coefficient) {
    const lowerLabel = (serviceLabel || '').toLowerCase();

    // Exception sécurité : Caméra (industriel) — main d'œuvre forfait par palier (non multipliée par la qté)
    if (serviceType === 'securite') {
      const isCameraIndustriel = (lowerLabel.includes('camera') || lowerLabel.includes('caméra')) && lowerLabel.includes('industriel');
      if (isCameraIndustriel) {
        const q = Math.max(1, parseInt(quantity, 10) || 1);
        if (q <= 16) return 350;   // 1 à 16 : 350 € total
        if (q <= 32) return 450;   // 17 à 32 : 450 € total
        return 550;                 // 33 et + : 550 € total (pas de × quantité)
      }
    }

    // Déterminer si c'est un service spécial (domotique/installation uniquement)
    const isSpecialService = (serviceType === 'domotique' || serviceType === 'installation') && 
      (lowerLabel.includes('éclairage') || 
       lowerLabel.includes('pris') ||
       lowerLabel.includes('internet') ||
       lowerLabel.includes('tv') ||
       lowerLabel.includes('radiateur') ||
       lowerLabel.includes('caméra') ||
       lowerLabel.includes('miroir'));
    
    if (!isSpecialService) {
      // Services standards : prix simple
      return prixBase * coefficient * quantity;
    }
    
    // Services avec tarification spéciale
    if (lowerLabel.includes('radiateur')) {
      return this.calculateRadiateurPrice(prixBase, quantity, coefficient);
    }
    if (lowerLabel.includes('caméra')) {
      return this.calculateCameraPrice(prixBase, quantity, coefficient);
    }
    if (lowerLabel.includes('miroir')) {
      return this.calculateMiroirPrice(prixBase, quantity, coefficient);
    }
    // Éclairage, prises, internet, TV
    return this.calculateEclairagePrice(prixBase, quantity, coefficient);
  }
}

module.exports = PrixCalculs;

