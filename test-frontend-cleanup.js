import axios from 'axios';

async function testAPI() {
  try {
    console.log('🧪 Test de l\'API après suppression des services appareillage...\n');
    
    // Test 1: Vérifier les catégories de prestations
    console.log('1️⃣ Test des catégories de prestations:');
    const prestationsResponse = await axios.get('http://localhost:5000/api/prestations');
    const categories = [...new Set(prestationsResponse.data.map(p => p.categorie))].sort();
    console.log('   Catégories disponibles:', categories);
    
    if (categories.includes('appareillage')) {
      console.log('❌ ERREUR: La catégorie "appareillage" existe encore !');
    } else {
      console.log('✅ OK: La catégorie "appareillage" a été supprimée');
    }
    
    // Test 2: Vérifier les catégories de matériel
    console.log('\n2️⃣ Test des catégories de matériel:');
    const materielResponse = await axios.get('http://localhost:5000/api/materiel');
    const materielCategories = [...new Set(materielResponse.data.map(m => m.categorie))].sort();
    console.log('   Catégories disponibles:', materielCategories);
    
    if (materielCategories.includes('appareillage')) {
      console.log('❌ ERREUR: La catégorie "appareillage" existe encore dans le matériel !');
    } else {
      console.log('✅ OK: La catégorie "appareillage" a été supprimée du matériel');
    }
    
    // Test 3: Compter les services par catégorie
    console.log('\n3️⃣ Nombre de services par catégorie:');
    categories.forEach(cat => {
      const count = prestationsResponse.data.filter(p => p.categorie === cat).length;
      console.log(`   ${cat}: ${count} services`);
    });
    
    console.log('\n🎉 Tests terminés !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Assurez-vous que le serveur backend est démarré sur le port 5000');
    }
  }
}

testAPI();
