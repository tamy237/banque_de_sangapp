import React, { useState } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {

      const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-pink-400 flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl w-full max-w-6xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">

        {/* Texte principal */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-700">
            Donnez du sang, sauvez des vies 
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            Rejoignez notre plateforme pour organiser ou participer aux collectes de sang. Chaque goutte compte.
          </p>

          <div className="flex justify-center md:justify-start gap-4 pt-2">
           <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 shadow-md transition"
            >
              Se connecter
            </button>

            {/* Menu des rôles */}
            {showRoleMenu && (
              <div className="absolute top-14 left-0 bg-white rounded-lg shadow-lg border w-52 z-10">
                <Link
                  to="/connexionU"
                  className="block px-4 py-2 hover:bg-red-100 text-sm text-gray-800"
                >
                  Connexion Utilisateur
                </Link>
                <Link
                  to="/connexionH"
                  className="block px-4 py-2 hover:bg-red-100 text-sm text-gray-800"
                >
                  Connexion Personnel Médical
                </Link>
              </div>
            )}
            <Link
              to="/register"
              className="border-2 border-red-600 text-red-600 px-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              S’inscrire
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="md:w-1/2">
          <img
            src="/ds7.png"
            alt="Illustration don de sang"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
