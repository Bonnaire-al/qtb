import React from 'react'

function Service() {
  const services = [
    {
      id: 1,
      title: "Développement Web",
      description: "Création de sites web modernes et responsives avec les dernières technologies.",
      icon: "🌐",
      price: "À partir de 1500€",
      features: ["Design responsive", "Optimisation SEO", "Performance", "Maintenance"]
    },
    {
      id: 2,
      title: "Applications React",
      description: "Développement d'applications React performantes et scalables.",
      icon: "⚛️",
      price: "À partir de 2500€",
      features: ["Interface moderne", "État global", "Routage", "API intégration"]
    },
    {
      id: 3,
      title: "E-commerce",
      description: "Solutions e-commerce complètes pour votre business en ligne.",
      icon: "🛒",
      price: "À partir de 3500€",
      features: ["Catalogue produits", "Paiement sécurisé", "Gestion stocks", "Analytics"]
    },
    {
      id: 4,
      title: "Maintenance & Support",
      description: "Services de maintenance continue et support technique.",
      icon: "🔧",
      price: "À partir de 200€/mois",
      features: ["Mises à jour", "Sauvegarde", "Support 24/7", "Monitoring"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Nos Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services pour répondre à tous vos besoins numériques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="text-xl font-semibold text-cyan-600 mb-4">{service.price}</div>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Demander un devis
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Rapidité</h3>
              <p className="text-gray-600">Livraison dans les délais convenus</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Qualité</h3>
              <p className="text-gray-600">Code propre et maintenable</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Support</h3>
              <p className="text-gray-600">Accompagnement personnalisé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Service
