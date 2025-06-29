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
                  src="https://readdy.ai/api/search-image?query=Modern%20smart%20home%20electrical%20installation%20with%20blue%20lighting%2C%20high-end%20electrical%20panel%20with%20neat%20wiring%2C%20professional%20electrical%20work%20in%20luxury%20home%2C%20clean%20modern%20background%20with%20blue%20accent%20lighting&width=400&height=300&seq=3&orientation=landscape"
                  alt="Installation domotique"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <i className="fas fa-bolt mr-1 animate-pulse"></i>
                  Nouveau
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Installation Domotique</h3>
                <p className="text-gray-600">
                  Système complet de maison intelligente avec contrôle d'éclairage, chauffage et sécurité via smartphone.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Electric%20vehicle%20charging%20station%20installation%20at%20modern%20home%2C%20professional%20EV%20charger%20setup%20with%20blue%20lighting%20effects%2C%20clean%20installation%20of%20home%20charging%20point%2C%20modern%20garage%20with%20blue%20accent%20lighting&width=400&height=300&seq=4&orientation=landscape"
                  alt="Borne de recharge"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <i className="fas fa-bolt mr-1 animate-pulse"></i>
                  Nouveau
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Bornes de Recharge VE</h3>
                <p className="text-gray-600">
                  Installation de bornes de recharge pour véhicules électriques en résidentiel et commercial.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Solar%20panel%20installation%20on%20modern%20home%20roof%20with%20blue%20sky%2C%20professional%20electrical%20connection%20of%20photovoltaic%20system%2C%20clean%20energy%20solution%20with%20blue%20electrical%20components%2C%20high%20quality%20professional%20installation&width=400&height=300&seq=5&orientation=landscape"
                  alt="Installation photovoltaïque"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <i className="fas fa-bolt mr-1 animate-pulse"></i>
                  Nouveau
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Installations Photovoltaïques</h3>
                <p className="text-gray-600">
                  Solutions d'énergie solaire complètes avec stockage de batterie et intégration au réseau.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Before%20and%20after%20comparison%20of%20electrical%20panel%20upgrade%2C%20professional%20rewiring%20with%20blue%20lighting%20effects%2C%20modern%20electrical%20installation%20replacing%20old%20dangerous%20wiring%2C%20clean%20professional%20electrical%20work&width=400&height=300&seq=6&orientation=landscape"
                  alt="Rénovation électrique"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <i className="fas fa-bolt mr-1 animate-pulse"></i>
                  Nouveau
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Rénovation Électrique</h3>
                <p className="text-gray-600">
                  Mise aux normes complète d'un bâtiment ancien avec tableau électrique moderne et câblage sécurisé.
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}

