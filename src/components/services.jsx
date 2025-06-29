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
                src="https://readdy.ai/api/search-image?query=Professional%20electrical%20installation%20work%20in%20progress%2C%20electrician%20working%20on%20modern%20electrical%20panel%20with%20blue%20lighting%20effects%2C%20clean%20professional%20workspace%20with%20technical%20details&width=400&height=300&seq=7&orientation=landscape"
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
                src="https://readdy.ai/api/search-image?query=Smart%20home%20automation%20system%20control%20panel%20with%20modern%20interface%2C%20luxury%20home%20interior%20with%20advanced%20lighting%20controls%2C%20professional%20smart%20home%20installation%20with%20blue%20accent%20lighting&width=400&height=300&seq=8&orientation=landscape"
                alt="Domotique"
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
                src="https://readdy.ai/api/search-image?query=Electric%20vehicle%20charging%20station%20professional%20installation%2C%20modern%20EV%20charger%20in%20luxury%20garage%20setting%2C%20clean%20professional%20electrical%20setup%20with%20blue%20accent%20lighting&width=400&height=300&seq=9&orientation=landscape"
                alt="Borne de recharge"
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white">Bornes de Recharge VE</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Installation de bornes de recharge pour véhicules électriques adaptées à vos besoins, pour particuliers et professionnels.</p>
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

