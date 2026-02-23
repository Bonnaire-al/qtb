import React from 'react';
import { Link } from 'react-router-dom';
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
                  src="/image/house-5128521_1280.jpg"
                  alt="Électricien professionnel"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 to-cyan-200/10"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                        <span className="text-black drop-shadow-[0_0_10px_rgba(255,255,255,1)] whitespace-nowrap">Electriciens Professionnels</span> <br />
                        <span className="text-black drop-shadow-[0_0_10px_rgba(255,255,255,1)]">A Nevers Pour Votre Confort</span>
                      </h1>
                      <p className="text-xl md:text-2xl text-black mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
                        Expertise, Qualité Et Sécurité À Votre Service
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link
                          to="/quote"
                          className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 text-xl relative overflow-hidden group cursor-pointer !rounded-button whitespace-nowrap border-2 border-white hover:border-4 hover:scale-105"
                        >
                          <span className="relative z-10">Devis En Ligne</span>
                          <i className="fas fa-bolt ml-3 text-yellow-300 group-hover:animate-pulse"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  src="/image/craiyon_205159_ENERGY_EFFECIENCY_AND_UTILITY_MANAGEMENT.png"
                  alt="Domotique moderne"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 to-cyan-200/10"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                        <span className="text-black drop-shadow-[0_0_10px_rgba(255,255,255,1)]">Solutions Domotiques</span> <br />
                        <span className="text-black drop-shadow-[0_0_10px_rgba(255,255,255,1)]">Pour Maison Intelligente</span>
                      </h1>
                      <p className="text-xl md:text-2xl text-black mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
                        Contrôlez Votre Maison Du Bout Des Doigts
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link
                          to="/service"
                          className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg relative overflow-hidden group cursor-pointer !rounded-button whitespace-nowrap border-2 border-white hover:border-4 hover:scale-105"
                        >
                          <span className="relative z-10">Découvrir nos solutions</span>
                          <i className="fas fa-home ml-2 text-yellow-300 group-hover:animate-pulse"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  src="/image/ai-generated-9143277_640.webp"
                  alt="Borne de recharge"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 to-cyan-200/10"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                        <span className="text-black drop-shadow-[0_0_10px_rgba(255,255,255,1)] whitespace-nowrap">Depannage et diagnostic</span> <br />
                        <span className="text-black drop-shadow-[0_0_10px_rgba(255,255,255,1)]">de securité </span>
                      </h1>
                      <p className="text-xl md:text-2xl text-black mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
                      Votre sécurité, notre priorité. 30% de remise sur le premier dépannage et diagnostic de sécurité.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link
                          to="/service"
                          className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg relative overflow-hidden group cursor-pointer !rounded-button whitespace-nowrap border-2 border-white hover:border-4 hover:scale-105"
                        >
                          <span className="relative z-10">En savoir plus</span>
                          <i className="fas fa-charging-station ml-2 text-yellow-300 group-hover:animate-pulse"></i>
                        </Link>
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