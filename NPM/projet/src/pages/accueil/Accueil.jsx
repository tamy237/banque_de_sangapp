import React from 'react';
import { FaHandHoldingHeart, FaTint, FaRegCalendarAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import UserNavBar from '../navbar/UserNavBar';

function Accueil() {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="pt-24 md:px-0 min-h-screen bg-gray-100 overflow-x-hidden">
      <UserNavBar />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-pink-700 mb-10 text-center mt-4"
      >
        🎉 Bienvenue sur votre Espace Donneur
      </motion.h2>

      {/* HERO */}
    <section
  className="bg-gray-50 container mx-auto flex flex-col-reverse md:flex-row items-center py-16 px-6"
  style={{ backgroundImage: "url('/dss2.png')", backgroundSize: "cover", backgroundPosition: "center" }}
>
  {/* Texte de gauche */}
  <div className="md:w-1/2 text-center md:text-left space-y-6">
    <h1 className="text-4xl md:text-5xl text-black font-extrabold">Don de Sang</h1>
    <p className="text-xl text-white">
      Offrez une seconde chance, sauvez des vies avec un simple geste.
    </p>
    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
      <Link to="/ltc">
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg">
          Trouver une collecte
        </button>
      </Link>
      <Link to="/footer">
        <button className="bg-gray-200 hover:bg-gray-300 text-red-700 px-6 py-3 rounded-lg">
          En savoir plus
        </button>
      </Link>
    </div>
  </div>

  {/* Carrousel */}
  <div className="w-full md:w-1/2">
    <div className="bg-red-50/50 p-4 sm:p-6 md:p-4 rounded-lg overflow-hidden">
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        interval={6000}
        className="rounded-lg overflow-hidden relative"
        renderArrowPrev={(onClickHandler, hasPrev, label) => (
          <button
            onClick={onClickHandler}
            aria-label={label}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md focus:outline-none"
          >
            ❮
          </button>
        )}
        renderArrowNext={(onClickHandler, hasNext, label) => (
          <button
            onClick={onClickHandler}
            aria-label={label}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md focus:outline-none"
          >
            ❯
          </button>
        )}
      >
        {/* Slide 1 */}
        <div className="flex items-center justify-center px-4 py-6 min-h-[250px] sm:min-h-[300px] md:min-h-[350px]">
          <div className="text-center px-2 sm:px-4">
            <h2 className="text-3xl sm:text-2xl md:text-3xl font-bold text-red-700 mb-3">
              Pourquoi donner son sang ?
            </h2>
            <p className="text-2xl sm:text-base md:text-2xl text-black leading-relaxed">
              Le don de sang est un acte volontaire et généreux qui sauve des vies chaque jour.
              Il permet de soigner les malades et victimes d'accidents.
            </p>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="flex items-center justify-center px-4 py-6 min-h-[250px] sm:min-h-[300px] md:min-h-[350px]">
          <div className="text-center px-2 sm:px-4">
            <h2 className="text-3xl sm:text-2xl md:text-4xl font-bold text-red-700 mb-3">
              Un petit geste, un grand impact
            </h2>
            <p className="text-2xl sm:text-base md:text-2xl text-black leading-relaxed">
              Une poche de sang peut sauver jusqu'à 3 vies. Chaque don compte et change des destins.
            </p>
          </div>
        </div>

         {/* Slide 3 */}
        <div className="flex items-center justify-center px-4 py-6 min-h-[250px] sm:min-h-[300px] md:min-h-[350px]">
          <div className="text-center px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-700 mb-3">
              important!!!!!!!
            </h2>
            <p className="text-2xl sm:text-base md:text-2xl text-black leading-relaxed">
              Trouvez des centres de collecte et donnez du sang. Une poche donné trois vies sauvés 
            </p>
          </div>
        </div>
      </Carousel>
    </div>
  </div>
</section>


      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        {/* Faire un Don */}
        <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-900 to-pink-300 p-6 text-white">
          <Link to="/controle_don" className="flex flex-col items-center space-y-4">
            <FaHandHoldingHeart className="text-5xl" />
            <h3 className="text-2xl font-bold">Faire un Don</h3>
            <p className="text-center text-sm opacity-90">Participez et sauvez des vies aujourd'hui.</p>
          </Link>
          <span className="absolute top-3 right-3 bg-white text-pink-600 font-bold text-xs px-2 py-1 rounded-full shadow-lg animate-bounce">Urgent</span>
        </motion.div>

        {/* Demander du Sang */}
        <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-900 to-pink-300 p-6 text-white">
          <Link to="/demander_sang" className="flex flex-col items-center space-y-4">
            <FaTint className="text-5xl" />
            <h3 className="text-2xl font-bold">Demander du Sang</h3>
            <p className="text-center text-sm opacity-90">Faites une demande pour un proche en besoin.</p>
          </Link>
          <span className="absolute top-3 right-3 bg-white text-red-600 font-bold text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">Besoin</span>
        </motion.div>

        {/* Mes Rendez-vous */}
        <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-900 to-pink-300 p-6 text-white">
          <Link to="/rendez_vous" className="flex flex-col items-center space-y-4">
            <FaRegCalendarAlt className="text-5xl" />
            <h3 className="text-2xl font-bold">Mes Rendez-vous</h3>
            <p className="text-center text-sm opacity-90">Suivez vos dons programmés.</p>
          </Link>
          <span className="absolute top-3 right-3 bg-white text-indigo-700 font-bold text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">À venir</span>
        </motion.div>
      </motion.div>
      {/* Footer principal */}
      <footer className="bg-rose-900/50 text-white py-8 px-0 mt-12 w-full">
            <section className="bg-rose-300/20 text-white py-12 px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Prêt à sauver des vies ?</h2>
                 <Link to="/register" className="flex flex-col items-center space-y-4">
             <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200">
                Inscrivez-vous maintenant
                </button>
          </Link>
          </section>

            <div className="max-w-full grid md:grid-cols-4 gap-6 text-sm px-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Banque de Sang</h3>
                    <p>Ensemble, donnons espoir et vie à ceux qui en ont besoin.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Contact</h3>
                    <p className="flex items-center"><FaPhoneAlt className="mr-2" /> +237 653160226</p>
                    <p className="flex items-center"><FaEnvelope className="mr-2" /> tchiosteve425@banquedesang.cm</p>
                    <p className="flex items-center"><FaMapMarkerAlt className="mr-2" /> Yaoundé, Cameroun</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Nos pages</h3>
                    <p className="flex items-center"><FaFacebook className="mr-2" /> Banque de sang</p>
                    <p className="flex items-center"><FaYoutube className="mr-2" /> BS+237</p>
                    <p className="flex items-center"><FaLinkedin className="mr-2" /> Blood+237</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Liens utiles</h3>
                    <ul className="space-y-1">
                    <li><a href="/register" className="hover:underline">Devenir donneur</a></li>
                    <li><a href="/demande" className="hover:underline">Faire une demande</a></li>
                    <li><a href="/collectes" className="hover:underline">Voir les collectes</a></li>
                    </ul>
                </div>
                </div>
                <div className="text-center mt-6 text-sm text-amber-200/70">
                &copy; {new Date().getFullYear()} Banque de Sang - Tous droits réservés.
            </div>
      </footer>
    </div>
  );
}

export default Accueil;
