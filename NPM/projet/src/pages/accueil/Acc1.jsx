import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaTint, FaHospital, FaCalendarAlt, FaNewspaper, FaSignOutAlt } from 'react-icons/fa';


 function Acc1() {

  const accueilData = {
    cts: [
      { id: 1, name: 'CTS Yaoundé Central', city: 'Yaoundé', icon: <FaHospital size={30} className="text-red-600" /> },
      { id: 2, name: 'CTS Douala Laquintinie', city: 'Douala', icon: <FaHospital size={30} className="text-red-600" /> },
      { id: 3, name: 'CTS Garoua Régional', city: 'Garoua', icon: <FaHospital size={30} className="text-red-600" /> },
    ],
    actualites: [
      { id: 1, title: 'Journée Mondiale du Don de Sang', description: 'Participez le 14 Juin à Yaoundé', icon: <FaNewspaper size={25} className="text-blue-600" /> },
      { id: 2, title: 'Collecte à l’Université de Douala', description: 'Don exceptionnel prévu à Douala', icon: <FaNewspaper size={25} className="text-blue-600" /> },
      { id: 3, title: 'Urgence : Besoin de sang O-', description: 'Campagne spéciale en cours', icon: <FaNewspaper size={25} className="text-blue-600" /> },
    ]
  };

  return (

    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('./public/')" }}>
      {/* Titre animé */}
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-center text-red-700 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Bienvenue sur votre espace Donneur
      </motion.h1>

      {/* Carrousel CTS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Nos Centres de Transfusion</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {accueilData.cts.map(cts => (
            <SwiperSlide key={cts.id}>
              <div className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4 hover:bg-gray-50 transition-all">
                {cts.icon}
                <div>
                  <h3 className="text-md font-bold text-gray-700">{cts.name}</h3>
                  <p className="text-sm text-gray-500">{cts.city}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Carrousel Actualités */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Actualités</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {accueilData.actualites.map(actu => (
            <SwiperSlide key={actu.id}>
              <div className="bg-white shadow-md rounded-xl p-4 flex space-x-4 items-center hover:bg-blue-50 transition-all">
                {actu.icon}
                <div>
                  <h3 className="text-md font-bold text-gray-700">{actu.title}</h3>
                  <p className="text-sm text-gray-500">{actu.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Cartes d'actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-red-50 p-6 rounded-xl shadow-md text-center">
          <FaTint size={40} className="text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Faire un Don</h3>
          <p className="text-sm text-gray-600">Trouvez un centre proche et prenez rendez-vous.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-50 p-6 rounded-xl shadow-md text-center">
          <FaTint size={40} className="text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Demander du Sang</h3>
          <p className="text-sm text-gray-600">Formulez une demande urgente facilement.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-green-50 p-6 rounded-xl shadow-md text-center">
          <FaCalendarAlt size={40} className="text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Mes Rendez-vous</h3>
          <p className="text-sm text-gray-600">Consultez vos dons et suivis passés.</p>
        </motion.div>
      </div>

      {/* Déconnexion */}
      <div className="text-center">
        <button className="flex items-center justify-center mx-auto gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
          <FaSignOutAlt />
          Déconnexion
        </button>
      </div>
    </div>
)
};

export default Acc1;