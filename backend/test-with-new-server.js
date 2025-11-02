const http = require('http');

function httpRequest(port, method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  console.log('🧪 TEST AVEC LE NOUVEAU CODE\n');
  
  try {
    // Test sur le serveur de test (5001)
    console.log('1️⃣ GET sur serveur TEST (port 5001)...');
    const prestations = await httpRequest(5001, 'GET', '/api/prestations/domotique');
    const prestation = prestations[0];
    console.log('Prix actuel:', prestation.prix_ht);
    
    const nouveauPrix = 999.99;
    console.log(`\n2️⃣ UPDATE: ${prestation.prix_ht} → ${nouveauPrix}`);
    
    const updateResult = await httpRequest(5001, 'PUT', `/api/prestations/${prestation.id}`, {
      ...prestation,
      prix_ht: nouveauPrix
    });
    console.log('Résultat UPDATE:', updateResult.prix_ht);
    
    console.log('\n3️⃣ Vérification GET...');
    const check = await httpRequest(5001, 'GET', '/api/prestations/domotique');
    const updated = check.find(p => p.id === prestation.id);
    console.log('Prix après UPDATE:', updated.prix_ht);
    
    if (updated.prix_ht === nouveauPrix) {
      console.log('\n✅ LE NOUVEAU CODE FONCTIONNE! 🎉');
      console.log('\nIl faut REDÉMARRER le serveur principal (port 5000)');
      console.log('pour que les changements soient actifs.');
    } else {
      console.log('\n❌ Toujours un problème...');
    }
    
    // Restaurer
    await httpRequest(5001, 'PUT', `/api/prestations/${prestation.id}`, prestation);
    console.log('\n✅ Prix restauré');
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.log('\nAssurez-vous que le serveur de test tourne:');
    console.log('  node backend/test-server.js');
  }
  
  process.exit(0);
}

// Attendre 2 secondes que le serveur démarre
setTimeout(test, 2000);












