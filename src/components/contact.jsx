import React from 'react';

export default function Contact() {
  return (
    <section id="devis" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-cyan-800 mb-6">Demandez un Devis Gratuit</h2>
            <p className="text-lg text-gray-700 mb-8">
              Remplissez le formulaire ci-dessous et notre équipe vous contactera dans les plus brefs délais pour discuter de votre projet.
            </p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nom" className="block text-gray-700 font-medium mb-2">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="prenom" className="block text-gray-700 font-medium mb-2">Prénom</label>
                  <input
                    type="text"
                    id="prenom"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Votre email"
                  />
                </div>
                <div>
                  <label htmlFor="telephone" className="block text-gray-700 font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Votre numéro"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Service souhaité</label>
                <div className="relative">
                  <select
                    id="service"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all appearance-none"
                  >
                    <option value="">Sélectionnez un service</option>
                    <option value="installation">Installation électrique</option>
                    <option value="depannage">Dépannage</option>
                    <option value="renovation">Rénovation électrique</option>
                    <option value="domotique">Domotique</option>
                    <option value="borne">Borne de recharge VE</option>
                    <option value="autre">Autre</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-500"></i>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  placeholder="Décrivez votre projet..."
                ></textarea>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 mr-2"
                />
                <label htmlFor="consent" className="text-gray-600 text-sm">
                  J'accepte que mes données soient utilisées pour me recontacter concernant ma demande de devis.
                </label>
              </div>
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap"
              >
                Envoyer ma demande
              </button>
            </form>
          </div>
          <div className="md:w-1/2">
            <div className="bg-cyan-50 p-8 rounded-lg shadow-lg h-full">
              <h3 className="text-2xl font-bold text-cyan-800 mb-6">Nos Coordonnées</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-cyan-600 text-white p-3 rounded-full mr-4">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-800 mb-1">Adresse</h4>
                    <p className="text-gray-700">123 Avenue de l'Électricité<br />75001 Paris, France</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-cyan-600 text-white p-3 rounded-full mr-4">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-800 mb-1">Téléphone</h4>
                    <p className="text-gray-700">01 23 45 67 89</p>
                    <p className="text-gray-700">06 12 34 56 78 (Urgence)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-cyan-600 text-white p-3 rounded-full mr-4">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-800 mb-1">Email</h4>
                    <p className="text-gray-700">contact@electropro.fr</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-cyan-600 text-white p-3 rounded-full mr-4">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-800 mb-1">Horaires</h4>
                    <p className="text-gray-700">Lundi - Vendredi: 8h00 - 18h00</p>
                    <p className="text-gray-700">Samedi: 9h00 - 12h00</p>
                    <p className="text-gray-700">Service d'urgence 24h/24, 7j/7</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-bold text-cyan-800 mb-4">Suivez-nous</h4>
                <div className="flex space-x-4">
                  <a href="#" className="bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-700 transition-colors duration-300 cursor-pointer">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-700 transition-colors duration-300 cursor-pointer">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-700 transition-colors duration-300 cursor-pointer">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-700 transition-colors duration-300 cursor-pointer">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

