import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Avis() {
  useEffect(() => {
    const chartDom = document.getElementById('satisfaction-chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        tooltip: { trigger: 'item' },
        color: ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'],
        series: [
          {
            name: 'Satisfaction Client',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false, position: 'center' },
            emphasis: {
              label: { show: true, fontSize: 20, fontWeight: 'bold' }
            },
            labelLine: { show: false },
            data: [
              { value: 75, name: 'Très Satisfait' },
              { value: 15, name: 'Satisfait' },
              { value: 7, name: 'Neutre' },
              { value: 2, name: 'Insatisfait' },
              { value: 1, name: 'Très Insatisfait' }
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  }, []);

  return (
    <section className="py-16 bg-cyan-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">Ce Que Disent Nos Clients</h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          La satisfaction de nos clients est notre priorité absolue
        </p>
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="lg:w-2/3">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000 }}
              className="testimonialSwiper"
            >
              <SwiperSlide>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 text-xl flex">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="ml-2 text-gray-500">5.0</div>
                  </div>
                  <p className="text-gray-700 text-lg italic mb-6">
                    "Service impeccable ! L'électricien est arrivé rapidement pour mon urgence et a résolu le problème en moins d'une heure. Très professionnel et courtois. Je recommande vivement cette entreprise pour tous vos besoins électriques."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      ML
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-cyan-800">Marie Lefevre</p>
                      <p className="text-gray-600">Paris</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 text-xl flex">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="ml-2 text-gray-500">5.0</div>
                  </div>
                  <p className="text-gray-700 text-lg italic mb-6">
                    "Excellente entreprise ! Ils ont réalisé l'installation électrique complète de notre nouvelle maison. Travail soigné, respect des délais et prix très compétitifs. L'équipe a été à l'écoute de nos besoins et nous a proposé des solutions adaptées."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      TD
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-cyan-800">Thomas Dubois</p>
                      <p className="text-gray-600">Lyon</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 text-xl flex">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                    </div>
                    <div className="ml-2 text-gray-500">4.5</div>
                  </div>
                  <p className="text-gray-700 text-lg italic mb-6">
                    "J'ai fait appel à cette entreprise pour l'installation d'une borne de recharge pour ma voiture électrique. Le technicien a été très pédagogue et m'a expliqué toutes les étapes. Installation rapide et propre. Je suis très satisfaite du résultat."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      SB
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-cyan-800">Sophie Bernard</p>
                      <p className="text-gray-600">Marseille</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <i className="fab fa-google text-2xl text-cyan-600 mr-2"></i>
                <span className="font-bold text-xl">Google Avis</span>
              </div>
              <div className="flex items-center">
                <div className="text-yellow-400 text-lg mr-2">
                  <i className="fas fa-star"></i>
                </div>
                <span className="font-bold text-xl">4.8</span>
              </div>
            </div>
            <div className="mb-8">
              <div id="satisfaction-chart" className="w-full h-64"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">Basé sur 187 avis clients</p>
              <a
                href="#"
                className="inline-flex items-center text-cyan-600 hover:text-cyan-800 font-medium cursor-pointer"
              >
                Voir tous les avis
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
