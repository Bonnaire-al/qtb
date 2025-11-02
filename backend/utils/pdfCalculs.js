// Calculer le total main d'œuvre HT
const calculateMainOeuvreTotal = (devisItems) => {
  if (!devisItems || devisItems.length === 0) return 0;
  
  return devisItems.reduce((total, item) => 
    total + item.services.reduce((itemTotal, service) => 
      itemTotal + service.priceHT, 0
    ), 0
  );
};

// Calculer le total matériel HT
const calculateMaterielTotal = (devisItems, materielsData) => {
  if (!devisItems || devisItems.length === 0) return 0;
  
  return devisItems.reduce((total, item) => {
    let itemTotal = 0;
    item.services.forEach(service => {
      const roomKey = Object.keys(materielsData || {}).find(room => 
        room === item.room.toLowerCase().replace(/\s+/g, '_')
      );
      
      if (roomKey && materielsData[roomKey]) {
        const serviceKey = Object.keys(materielsData[roomKey]).find(key => 
          materielsData[roomKey][key].some(mat => 
            mat.nom.toLowerCase().includes(service.label.toLowerCase().split(' ')[0])
          )
        );
        
        if (serviceKey && materielsData[roomKey][serviceKey]) {
          materielsData[roomKey][serviceKey].forEach(material => {
            itemTotal += material.quantite * material.prixHT * service.quantity;
          });
        }
      }
    });
    return total + itemTotal;
  }, 0);
};

// Calculer la remise selon la main d'œuvre (10% tous les 1000€)
const calculateDiscount = (totalMainOeuvreHT) => {
  const discountMultiplier = Math.floor(totalMainOeuvreHT / 1000);
  const discountAmount = totalMainOeuvreHT * (discountMultiplier * 0.10);
  const discountPercentage = discountMultiplier * 10;
  
  return {
    discountAmount,
    discountPercentage,
    hasDiscount: discountAmount > 0
  };
};

// Calculer les totaux généraux
const calculateTotals = (devisItems, materielsData, isCompany = false) => {
  const totalMainOeuvreHT = calculateMainOeuvreTotal(devisItems);
  const totalMaterielHT = calculateMaterielTotal(devisItems, materielsData);
  
  // Calculer la remise sur la main d'œuvre
  const { discountAmount, discountPercentage, hasDiscount } = calculateDiscount(totalMainOeuvreHT);
  const totalMainOeuvreHTAfterDiscount = totalMainOeuvreHT - discountAmount;
  
  const totalHT = totalMaterielHT + totalMainOeuvreHTAfterDiscount;
  
  // TVA différente selon si c'est une entreprise ou non
  const tvaRate = isCompany ? 0.20 : 0.10; // 20% pour entreprise, 10% pour particulier
  const totalTVA = totalHT * tvaRate;
  const totalTTC = totalHT + totalTVA;
  
  return {
    totalMainOeuvreHT,
    totalMaterielHT,
    totalHT,
    totalTVA,
    totalTTC,
    tvaRate,
    discountAmount,
    discountPercentage,
    hasDiscount,
    totalMainOeuvreHTAfterDiscount
  };
};

// Collecter tous les matériaux nécessaires
const collectAllMaterials = (devisItems, materielsData) => {
  const allMaterials = [];
  
  if (!devisItems || devisItems.length === 0) return allMaterials;
  
  devisItems.forEach((item) => {
    item.services.forEach((service) => {
      const roomKey = Object.keys(materielsData || {}).find(room => 
        room === item.room.toLowerCase().replace(/\s+/g, '_')
      );
      
      if (roomKey && materielsData[roomKey]) {
        const serviceKey = Object.keys(materielsData[roomKey]).find(key => 
          materielsData[roomKey][key].some(mat => 
            mat.nom.toLowerCase().includes(service.label.toLowerCase().split(' ')[0])
          )
        );
        
        if (serviceKey && materielsData[roomKey][serviceKey]) {
          materielsData[roomKey][serviceKey].forEach(material => {
            const existingMaterial = allMaterials.find(mat => mat.nom === material.nom);
            if (existingMaterial) {
              existingMaterial.quantite += material.quantite * service.quantity;
            } else {
              allMaterials.push({
                nom: material.nom,
                quantite: material.quantite * service.quantity,
                prixHT: material.prixHT
              });
            }
          });
        }
      }
    });
  });
  
  return allMaterials;
};

// Créer les lignes du tableau main d'œuvre
const createMainOeuvreRows = (devisItems, isCompany = false) => {
  const mainOeuvreRows = [];
  const tvaRate = isCompany ? 0.20 : 0.10;
  const tvaPercentage = isCompany ? '20%' : '10%';
  
  if (devisItems && devisItems.length > 0) {
    devisItems.forEach((item) => 
      item.services.forEach((service, serviceIndex) => {
        const totalHT = service.priceHT;
        const tva = totalHT * tvaRate;
        const totalTTC = totalHT + tva;
        const isFirstService = serviceIndex === 0;
        
        const prixUnitaire = service.quantity > 0 ? (service.priceHT / service.quantity).toFixed(2) : '0.00';
        
        mainOeuvreRows.push([
          isFirstService ? item.room : '',
          service.label,
          service.quantity.toString(),
          service.priceHT > 0 ? `${prixUnitaire} €` : 'À définir',
          tvaPercentage,
          service.priceHT > 0 ? `${totalTTC.toFixed(2)} €` : 'À définir'
        ]);
      })
    );
  } else {
    mainOeuvreRows.push(['-', 'Services sélectionnés', '1', 'À définir', tvaPercentage, 'À définir']);
  }
  
  return mainOeuvreRows;
};

// Créer les lignes du tableau matériel
const createMaterielRows = (allMaterials) => {
  const materielRows = [];
  const tvaRate = 0.20; // Matériel toujours à 20%
  const tvaPercentage = '20%';
  
  if (allMaterials.length > 0) {
    allMaterials.forEach((material) => {
      const totalHT = material.quantite * material.prixHT;
      const tva = totalHT * tvaRate;
      const totalTTC = totalHT + tva;
      
      materielRows.push([
        material.nom,
        material.quantite.toString(),
        `${material.prixHT.toFixed(2)} €`,
        tvaPercentage,
        `${totalTTC.toFixed(2)} €`
      ]);
    });
  } else {
    materielRows.push(['Matériel nécessaire', '-', 'À définir', tvaPercentage, 'À définir']);
  }
  
  return materielRows;
};

module.exports = {
  calculateMainOeuvreTotal,
  calculateMaterielTotal,
  calculateDiscount,
  calculateTotals,
  collectAllMaterials,
  createMainOeuvreRows,
  createMaterielRows
};


