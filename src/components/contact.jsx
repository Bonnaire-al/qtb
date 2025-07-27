import React from 'react';

export default function Contact() {
  return (
    <section id="devis" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cyan-800 mb-6">Nos Coordonnées</h2>
            <p className="text-lg text-gray-700">
              Contactez-nous pour discuter de votre projet électrique
            </p>
          </div>
          <div className="bg-cyan-50 p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-cyan-600 text-white p-3 rounded-full mr-4">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-800 mb-1">Adresse</h4>
                    <p className="text-gray-700">61 rue antoine amiot<br />58400 La charité</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-cyan-600 text-white p-3 rounded-full mr-4">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-800 mb-1">Téléphone</h4>
                    <p className="text-gray-700">07 77 11 71 78</p>
                    <p className="text-gray-700">07 77 11 71 78 (Urgence)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
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
            </div>
            <div className="mt-8 text-center">
              <h4 className="font-bold text-cyan-800 mb-4">Suivez-nous</h4>
              <div className="flex justify-center space-x-4">
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
    </section>
  );
}

