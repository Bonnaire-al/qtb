import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Realisation() {
  return (
    <section className="py-16 bg-gradient-to-b from-cyan-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">Nos Dernières Réalisations</h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Découvrez nos projets récents et les nouvelles technologies que nous mettons en œuvre pour nos clients
        </p>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative">
                <img
                  src="/image/WhatsApp Image 2025-07-19 à 22.29.15_fa932f0d.jpg"
                  alt="Installation domotique"
                  className="w-full h-64 object-cover "
                />
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <i className="fas fa-bolt mr-1 animate-pulse"></i>
                  Nouveau
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Plafonier luminaire personnalisé </h3>
                <p className="text-gray-600">
                Sortez des standards avec un plafonnier unique, conçu pour refléter votre style et sublimer chaque espace.e et sécurité via smartphone.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative">
                <img
                  src="/image/INTERUPTEUR TACTIL WIFI ET RF433 DOUBLE-11112020-domotique-maroc16050864491.jpg"
                  alt="Borne de recharge"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <i className="fas fa-bolt mr-1 animate-pulse"></i>
                  Nouveau
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Interrupteur moderne et tactile</h3>
                <p className="text-gray-600">
                Adoptez un interrupteur moderne et tactile, compatible Wi-Fi, pour une maison connectée et intuitive, au cœur de votre système domotique
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative">
                <img
                  src="/image/tableau tri.jpg"
                  alt="Installation photovoltaïque"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <i className="fas fa-bolt mr-1 animate-pulse"></i>
                  Nouveau
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Tableau triphasé</h3>
                <p className="text-gray-600">
                Installation et remplacement d'un tableau triphasé, conçu pour garantir une distribution électrique sûre et efficace.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative">
                <img
                  src="/image/portail.jpeg"
                  alt="Rénovation électrique"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <i className="fas fa-bolt mr-1 animate-pulse"></i>
                  Nouveau
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Portail électrique</h3>
                <p className="text-gray-600">
                Profitez d’un portail électrique alliant sécurité et confort, pour un accès automatisé et pratique à votre propriété.
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}

