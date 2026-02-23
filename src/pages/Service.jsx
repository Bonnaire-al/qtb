import React from 'react'
import { Link } from 'react-router-dom'

function Service() {
  const services = [
    {
      id: 1,
      title: "Solutions électriques professionnelles",
      description: "Installation, rénovation, mise aux normes et interventions sur tous types de chantiers pour garantir votre confort et votre sécurité.",
      icon: "💡",
      price: "Sur devis",
      features: [
        "Installation complète",
        "Rénovation électrique",
        "Mise aux normes",
        "Sécurité et fiabilité"
      ]
    },
    {
      id: 2,
      title: "Solutions domotiques",
      description: "Contrôlez votre maison du bout des doigts : éclairage, chauffage, sécurité, équipements connectés et automatisation sur mesure.",
      icon: "🏠",
      price: "Sur devis",
      features: [
        "Gestion intelligente de l'éclairage",
        "Contrôle du chauffage",
        "Sécurité connectée",
        "Automatisation personnalisée"
      ]
    },
    {
      id: 3,
      title: "Dépannage & diagnostic de sécurité",
      description: "Votre sécurité, notre priorité : diagnostic et dépannage offerts pour tous vos besoins électriques et de sécurité.",
      icon: "🛠️",
      price: "Remise 30% sur le premier dépannage",
      features: [
        "Diagnostic de sécurité",
        "Dépannage rapide",
        "Conseils personnalisés",
        "Intervention sous 24h"
      ]
    },
    {
      id: 4,
      title: "Systèmes de sécurité (alarmes, caméras, etc.)",
      description: "Installation, diagnostic et dépannage de systèmes de sécurité : alarmes, caméras de surveillance, détecteurs de mouvement, interphones et plus encore pour protéger vos biens et vos proches.",
      icon: "🔒",
      price: "Sur devis",
      features: [
        "Alarmes anti-intrusion",
        "Caméras de surveillance",
        "Détecteurs de mouvement",
        "Interphones et contrôle d'accès"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Nos Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services pour répondre à tous vos besoins électriques et domotiques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col">
              <div className="flex-1">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-xl font-semibold text-cyan-600 mb-4">{service.price}</div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/quote"
                className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center mt-auto"
              >
                Demander un devis
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Rapidité</h3>
              <p className="text-gray-600">Intervention sous 24h</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Qualité</h3>
              <p className="text-gray-600">Travail soigné et conforme</p>
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
