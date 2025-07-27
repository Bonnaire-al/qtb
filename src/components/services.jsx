import React from 'react';

export default function Services() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">Nos Services Principaux</h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Des solutions électriques complètes pour répondre à tous vos besoins
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img
                src="/public/image/220_F_27938917_rPkH8zQbZybBhTI7RQ2QDpXDVVhKKDK2.jpg"
                alt="Installation électrique"
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white">Installation Électrique</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Installation complète, mise aux normes et rénovation de votre installation électrique par des professionnels qualifiés.</p>
              <a href="#devis" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center cursor-pointer">
                En savoir plus <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img
                src="/public/image/v355-sasi-59-smarthome_2.webp"
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white">Domotique</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Solutions domotiques innovantes pour contrôler éclairage, chauffage, sécurité et autres équipements de votre maison.</p>
              <a href="#devis" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center cursor-pointer">
                En savoir plus <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img
                src="/public/image/pexels-jakubzerdzicki-22491144.jpg"
                alt="Borne de recharge"
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white">Systèmes de sécurité</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Nous proposons l’installation, le diagnostic et le dépannage gratuits de systèmes de sécurité : alarmes, caméras, détecteurs et plus encore.</p>
              <a href="#devis" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center cursor-pointer">
                En savoir plus <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

