// Test simple de l'API avec http natif
const http = require('http');

function httpRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function test() {
  try {
    console.log('🧪 TEST API SIMPLE\n');
    
    // 1. GET
    console.log('1️⃣ Récupération des prestations domotique...');
    const prestations = await httpRequest('GET', '/api/prestations/domotique');
    const prestation = prestations[0];
    console.log('Prestation #1:', prestation.service_label, '- Prix:', prestation.prix_ht);
    console.log('');
    
    // 2. UPDATE
    const nouveauPrix = 777.77;
    console.log(`2️⃣ Mise à jour du prix: ${prestation.prix_ht} → ${nouveauPrix}`);
    
    const dataToUpdate = {
      ...prestation,
      prix_ht: nouveauPrix
    };
    
    const updateResult = await httpRequest('PUT', `/api/prestations/${prestation.id}`, dataToUpdate);
    console.log('Résultat:', updateResult);
    console.log('');
    
    // 3. Vérifier
    console.log('3️⃣ Vérification...');
    const prestationsAfter = await httpRequest('GET', '/api/prestations/domotique');
    const updated = prestationsAfter.find(p => p.id === prestation.id);
    console.log('Prix après update:', updated.prix_ht);
    console.log('');
    
    if (updated.prix_ht === nouveauPrix) {
      console.log('✅ API FONCTIONNE! Le prix est bien sauvegardé.');
    } else {
      console.log(`❌ PROBLÈME! Attendu: ${nouveauPrix}, Reçu: ${updated.prix_ht}`);
    }
    
    // 4. Restaurer
    console.log('');
    console.log('4️⃣ Restauration...');
    await httpRequest('PUT', `/api/prestations/${prestation.id}`, prestation);
    console.log('✅ Prix restauré');
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
  }
}

test();












