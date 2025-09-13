import { materielPrestations } from '../data/materiel';

// Calculer le total main d'œuvre HT
export const calculateMainOeuvreTotal = (devisItems) => {
  if (!devisItems || devisItems.length === 0) return 0;
  
  return devisItems.reduce((total, item) => 
    total + item.services.reduce((itemTotal, service) => 
      itemTotal + (service.quantity * service.priceHT), 0
    ), 0
  );
};

// Calculer le total matériel HT
export const calculateMaterielTotal = (devisItems, serviceType) => {
  if (!devisItems || devisItems.length === 0) return 0;
  
  return devisItems.reduce((total, item) => {
    let itemTotal = 0;
    item.services.forEach(service => {
      const roomKey = Object.keys(materielPrestations[serviceType] || {}).find(room => 
        room === item.room.toLowerCase().replace(/\s+/g, '_')
      );
      
      if (roomKey && materielPrestations[serviceType][roomKey]) {
        const serviceKey = Object.keys(materielPrestations[serviceType][roomKey]).find(key => 
          materielPrestations[serviceType][roomKey][key].some(mat => 
            mat.nom.toLowerCase().includes(service.label.toLowerCase().split(' ')[0])
          )
        );
        
        if (serviceKey && materielPrestations[serviceType][roomKey][serviceKey]) {
          materielPrestations[serviceType][roomKey][serviceKey].forEach(material => {
            itemTotal += material.quantite * material.prixHT * service.quantity;
          });
        }
      }
    });
    return total + itemTotal;
  }, 0);
};

// Calculer les totaux généraux
export const calculateTotals = (devisItems, serviceType) => {
  const totalMainOeuvreHT = calculateMainOeuvreTotal(devisItems);
  const totalMaterielHT = calculateMaterielTotal(devisItems, serviceType);
  const totalHT = totalMaterielHT + totalMainOeuvreHT;
  const totalTVA = totalHT * 0.20;
  const totalTTC = totalHT + totalTVA;
  
  return {
    totalMainOeuvreHT,
    totalMaterielHT,
    totalHT,
    totalTVA,
    totalTTC
  };
};

// Collecter tous les matériaux nécessaires
export const collectAllMaterials = (devisItems, serviceType) => {
  const allMaterials = [];
  
  if (!devisItems || devisItems.length === 0) return allMaterials;
  
  devisItems.forEach((item) => {
    item.services.forEach((service) => {
      const roomKey = Object.keys(materielPrestations[serviceType] || {}).find(room => 
        room === item.room.toLowerCase().replace(/\s+/g, '_')
      );
      
      if (roomKey && materielPrestations[serviceType][roomKey]) {
        const serviceKey = Object.keys(materielPrestations[serviceType][roomKey]).find(key => 
          materielPrestations[serviceType][roomKey][key].some(mat => 
            mat.nom.toLowerCase().includes(service.label.toLowerCase().split(' ')[0])
          )
        );
        
        if (serviceKey && materielPrestations[serviceType][roomKey][serviceKey]) {
          materielPrestations[serviceType][roomKey][serviceKey].forEach(material => {
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
export const createMainOeuvreRows = (devisItems) => {
  const mainOeuvreRows = [];
  
  if (devisItems && devisItems.length > 0) {
    devisItems.forEach((item) => 
      item.services.forEach((service, serviceIndex) => {
        const totalHT = service.quantity * service.priceHT;
        const tva = totalHT * 0.20;
        const totalTTC = totalHT + tva;
        const isFirstService = serviceIndex === 0;
        
        mainOeuvreRows.push([
          isFirstService ? item.room : '',
          service.label,
          service.quantity.toString(),
          service.priceHT > 0 ? `${service.priceHT.toFixed(2)} €` : 'À définir',
          '20%',
          service.priceHT > 0 ? `${totalTTC.toFixed(2)} €` : 'À définir'
        ]);
      })
    );
  } else {
    mainOeuvreRows.push(['-', 'Services sélectionnés', '1', 'À définir', '20%', 'À définir']);
  }
  
  return mainOeuvreRows;
};

// Créer les lignes du tableau matériel
export const createMaterielRows = (allMaterials) => {
  const materielRows = [];
  
  if (allMaterials.length > 0) {
    allMaterials.forEach((material) => {
      const totalHT = material.quantite * material.prixHT;
      const tva = totalHT * 0.20;
      const totalTTC = totalHT + tva;
      
      materielRows.push([
        material.nom,
        material.quantite.toString(),
        `${material.prixHT.toFixed(2)} €`,
        '20%',
        `${totalTTC.toFixed(2)} €`
      ]);
    });
  } else {
    materielRows.push(['Matériel nécessaire', '-', 'À définir', '20%', 'À définir']);
  }
  
  return materielRows;
};
