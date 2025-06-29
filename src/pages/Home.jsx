import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Services from '../components/services';
import Realisation from '../components/realisation';
import Avis from '../components/avis';
import Contact from '../components/contact';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative">
      {/* Contenu principal de Home */}
      <main>
        <section id="accueil" className="relative overflow-hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="h-[600px]"
          >
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20electrician%20working%20on%20electrical%20panel%20with%20blue%20lighting%20effects%2C%20modern%20electrical%20installation%20in%20a%20luxury%20home%2C%20high%20quality%20professional%20photo%20with%20dramatic%20blue%20lighting%2C%20clean%20background%20with%20electrical%20components%20visible&width=1440&height=600&seq=1&orientation=landscape"
                  alt="Électricien professionnel"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 to-cyan-200/10"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                        Solutions électriques <br />professionnelles pour votre confort
                      </h1>
                      <p className="text-xl md:text-2xl text-gray-700 mb-6">
                        Expertise, qualité et sécurité à votre service
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="inline-block bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg font-bold text-xl relative overflow-hidden group cursor-pointer !rounded-button whitespace-nowrap">
                          <span className="relative z-10">Dépannage Gratuit</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </div>
                        <a
                          href="#devis"
                          className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg relative overflow-hidden group cursor-pointer !rounded-button whitespace-nowrap"
                        >
                          <span className="relative z-10">Devis Gratuit</span>
                          <i className="fas fa-bolt ml-2 text-yellow-300 group-hover:animate-pulse"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  src="https://readdy.ai/api/search-image?query=Modern%20smart%20home%20automation%20system%20installation%20with%20blue%20accent%20lighting%2C%20luxury%20home%20interior%20with%20advanced%20electrical%20controls%2C%20professional%20electrical%20technology%20showcase%20with%20clean%20modern%20design&width=1440&height=600&seq=2&orientation=landscape"
                  alt="Domotique moderne"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 to-cyan-200/10"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                        Solutions domotiques <br />pour maison intelligente
                      </h1>
                      <p className="text-xl md:text-2xl text-gray-700 mb-6">
                        Contrôlez votre maison du bout des doigts
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <a
                          href="#devis"
                          className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg relative overflow-hidden group cursor-pointer !rounded-button whitespace-nowrap"
                        >
                          <span className="relative z-10">Découvrir nos solutions</span>
                          <i className="fas fa-home ml-2 text-yellow-300 group-hover:animate-pulse"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  src="https://readdy.ai/api/search-image?query=Electric%20vehicle%20charging%20station%20installation%20with%20modern%20design%2C%20professional%20EV%20charger%20setup%20in%20luxury%20garage%2C%20high%20end%20electrical%20installation%20with%20blue%20lighting%20accents%20and%20clean%20modern%20aesthetic&width=1440&height=600&seq=3&orientation=landscape"
                  alt="Borne de recharge"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 to-cyan-200/10"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                        Installation de bornes <br />de recharge électrique
                      </h1>
                      <p className="text-xl md:text-2xl text-gray-700 mb-6">
                        Passez à la mobilité électrique en toute simplicité
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <a
                          href="#devis"
                          className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg relative overflow-hidden group cursor-pointer !rounded-button whitespace-nowrap"
                        >
                          <span className="relative z-10">En savoir plus</span>
                          <i className="fas fa-charging-station ml-2 text-yellow-300 group-hover:animate-pulse"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Composants importés */}
        <Services />
        <Realisation />
        <Avis />
        <Contact />
      </main>
    </div>
  );
}

export default Home; 