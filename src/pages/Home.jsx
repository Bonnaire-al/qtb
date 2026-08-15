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

const SWIPER_TITLE = 'text-swiper-title font-[\'Merienda\'] font-bold';
const SWIPER_SUBTITLE = 'text-swiper-title font-[\'Merienda\'] font-semibold';
const SWIPER_BTN =
  'inline-flex items-center justify-center py-4 px-6 rounded-lg border-2 font-semibold text-base text-cyan-800 border-cyan-200 bg-cover bg-center bg-no-repeat transition-all duration-300 hover:scale-105 active:scale-100';
const SWIPER_BTN_BG = { backgroundImage: "url('/image/fond-form.png')" };
const SWIPER_TEXT_POSITION =
  'absolute top-24 left-3 right-3 sm:top-28 sm:left-6 sm:right-6 md:top-32 md:left-10 md:right-10 lg:left-12 lg:right-auto z-10 max-w-2xl';
const SWIPER_TITLE_SIZE = 'text-3xl md:text-4xl lg:text-5xl';
const SWIPER_TITLE_SIZE_HERO = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl';
const SWIPER_BTN_POSITION =
  'absolute bottom-16 left-4 sm:bottom-20 sm:left-8 md:bottom-24 md:left-12 z-10';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative">
      <main>
        <section id="accueil" className="relative z-0 overflow-hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="h-[600px] overflow-hidden [&_.swiper-slide]:h-full"
          >
            <SwiperSlide className="h-full">
              <div className="relative h-full w-full overflow-hidden bg-[#f4f7fb]">
                <img
                  src="/image/fond-electricien-clair.png"
                  alt="QTB Electrotech — électricien Nevers"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />

                <div className={SWIPER_TEXT_POSITION}>
                  <h1 className={`${SWIPER_TITLE_SIZE_HERO} leading-tight ${SWIPER_TITLE}`}>
                    <span className="block">Electricien</span>
                    <span className="block mt-1">La Charité / Nevers</span>
                    <span className="block mt-1 sm:mt-2">à votre service</span>
                  </h1>
                  <p className={`mt-4 sm:mt-5 text-lg md:text-xl ${SWIPER_SUBTITLE}`}>
                    Installation, rénovation, mise aux normes et dépannage à Nevers et alentours.
                  </p>
                </div>

                <div className={SWIPER_BTN_POSITION}>
                  <Link to="/quote" className={SWIPER_BTN} style={SWIPER_BTN_BG}>
                    Devis en un click
                  </Link>
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
                <div className={SWIPER_TEXT_POSITION}>
                  <h1 className={`${SWIPER_TITLE_SIZE} mb-4 leading-tight ${SWIPER_TITLE}`}>
                    <span className="block">Solutions Domotiques</span>
                    <span className="block">Pour Maison Intelligente</span>
                  </h1>
                  <p className={`text-lg md:text-xl ${SWIPER_SUBTITLE}`}>
                    Contrôlez Votre Maison Du Bout Des Doigts
                  </p>
                </div>
                <div className={SWIPER_BTN_POSITION}>
                  <Link to="/service" className={SWIPER_BTN} style={SWIPER_BTN_BG}>
                    Découvrir nos solutions
                  </Link>
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
                <div className={SWIPER_TEXT_POSITION}>
                  <h1 className={`${SWIPER_TITLE_SIZE} mb-4 leading-tight ${SWIPER_TITLE}`}>
                    <span className="block">Depannage et diagnostic</span>
                    <span className="block">de securité</span>
                  </h1>
                  <p className={`text-lg md:text-xl ${SWIPER_SUBTITLE}`}>
                    Votre sécurité, notre priorité. 30% de remise sur le premier dépannage et diagnostic de sécurité.
                  </p>
                </div>
                <div className={SWIPER_BTN_POSITION}>
                  <Link to="/service" className={SWIPER_BTN} style={SWIPER_BTN_BG}>
                    En savoir plus
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        <Services />
        <Realisation />
        <Avis />
        <Contact />
      </main>
    </div>
  );
}

export default Home;
