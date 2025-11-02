// Test direct de l'API de mise à jour
const axios = require('axios');

async function testAPIUpdate() {
  try {
    console.log('🧪 TEST DE L\'API UPDATE\n');
    
    // 1. Récupérer les prestations
    console.log('1️⃣ GET /api/prestations/domotique');
    const getResponse = await axios.get('http://localhost:5000/api/prestations/domotique');
    const prestation = getResponse.data[0];
    console.log('Prestation récupérée:', {
      id: prestation.id,
      service_label: prestation.service_label,
      prix_ht: prestation.prix_ht
    });
    console.log('');
    
    // 2. Modifier le prix
    const nouveauPrix = 888.88;
    console.log(`2️⃣ PUT /api/prestations/${prestation.id}`);
    console.log(`Modification: ${prestation.prix_ht} → ${nouveauPrix}`);
    
    const updateData = {
      ...prestation,
      prix_ht: nouveauPrix
    };
    
    const updateResponse = await axios.put(
      `http://localhost:5000/api/prestations/${prestation.id}`,
      updateData
    );
    console.log('Réponse:', updateResponse.data);
    console.log('');
    
    // 3. Vérifier
    console.log('3️⃣ Vérification GET /api/prestations/domotique');
    const checkResponse = await axios.get('http://localhost:5000/api/prestations/domotique');
    const updated = checkResponse.data.find(p => p.id === prestation.id);
    console.log('Prestation après update:', {
      id: updated.id,
      service_label: updated.service_label,
      prix_ht: updated.prix_ht
    });
    console.log('');
    
    if (updated.prix_ht === nouveauPrix) {
      console.log('✅ TEST API RÉUSSI!');
    } else {
      console.log(`❌ TEST API ÉCHOUÉ! Attendu: ${nouveauPrix}, Reçu: ${updated.prix_ht}`);
    }
    
    // 4. Restaurer
    console.log('');
    console.log(`4️⃣ Restauration: ${nouveauPrix} → ${prestation.prix_ht}`);
    await axios.put(`http://localhost:5000/api/prestations/${prestation.id}`, prestation);
    console.log('✅ Prix restauré');
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    if (error.response) {
      console.error('Réponse serveur:', error.response.data);
    }
  }
}

testAPIUpdate();












