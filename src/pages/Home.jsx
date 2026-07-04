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

const HERO_DOMAINS = [
  'Électricité & rénovation',
  'Domotique',
  'Dépannage & diagnostic',
  'Sécurité & alarmes',
  'Motorisation portail & volet roulant',
];

const STARBURST_POINTS = (() => {
  const outer = 48;
  const inner = 36;
  const spikes = 14;
  const pts = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
})();

function DevisStarburstButton() {
  return (
    <Link
      to="/quote"
      className="group relative inline-flex items-center justify-center h-24 w-60 sm:h-28 sm:w-64 md:w-72 transition-transform duration-300 ease-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      aria-label="Devis en un click"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
        aria-hidden
        preserveAspectRatio="none"
      >
        <polygon
          points={STARBURST_POINTS}
          className="fill-white stroke-black stroke-[1.75]"
        />
      </svg>
      <span className="relative z-10 px-3 text-center text-xs sm:text-sm md:text-base font-extrabold uppercase leading-tight text-cyan-900">
        Devis en un click
      </span>
    </Link>
  );
}

function HeroFirstSlideContent() {
  const lastDomainDelay = 0.85 + (HERO_DOMAINS.length - 1) * 0.15;
  const buttonDelay = lastDomainDelay + 0.25;

  return (
    <>
      {/* Logo coin haut-gauche */}
      <div
        className="hero-logo-enter absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-10"
        style={{ animationDelay: '0s' }}
      >
        <div className="relative">
          <div
            className="hero-electric-glow absolute -inset-2 rounded-full bg-cyan-400/20 blur-md"
            aria-hidden
          />
          <i
            className="hero-spark absolute -top-3 -right-2 fas fa-bolt text-yellow-300 text-lg drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]"
            aria-hidden
          />
          <i
            className="hero-spark absolute -bottom-2 -left-3 fas fa-bolt text-cyan-300 text-sm drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]"
            style={{ animationDelay: '0.4s' }}
            aria-hidden
          />
          <img
            src="/image/logo.png"
            alt="Logo QTB Electrotech"
            className="relative h-20 w-auto sm:h-24 md:h-28 lg:h-32 object-contain drop-shadow-[0_0_16px_rgba(6,182,212,0.7)]"
          />
        </div>
      </div>

      {/* Titre + domaines */}
      <div className="absolute top-14 left-4 sm:top-16 sm:left-8 md:top-20 md:left-12 lg:top-24 z-10 max-w-[95%] pl-24 sm:pl-28 md:pl-32 font-['Merienda']">
        <p
          className="hero-text-enter text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] leading-tight mb-6 sm:mb-8 md:mb-10"
          style={{ animationDelay: '0.6s' }}
        >
          Electricien Nevers La Charité
        </p>

        <ul className="space-y-1.5 sm:space-y-2" aria-label="Domaines d'intervention">
          {HERO_DOMAINS.map((domain, index) => (
            <li
              key={domain}
              className="hero-text-enter flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
              style={{ animationDelay: `${0.85 + index * 0.15}s` }}
            >
              <span className="shrink-0" aria-hidden>—</span>
              {domain}
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton après le texte */}
      <div
        className="hero-text-enter absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-10"
        style={{ animationDelay: `${buttonDelay}s` }}
      >
        <DevisStarburstButton />
      </div>
    </>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative">
      {/* Contenu principal de Home */}
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
              <div className="relative h-full w-full overflow-hidden bg-sky-200">
                <img
                  src="/image/back-hp2.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  aria-hidden
                />

                <HeroFirstSlideContent />
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