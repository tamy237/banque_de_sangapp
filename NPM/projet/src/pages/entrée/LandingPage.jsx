import React from 'react'
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between">
        
        {/* Texte principal */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-red-600">Banque de Sang</h1>
          <p className="text-gray-700 text-lg">
            Sauvez des vies en un seul clic. Rejoignez notre plateforme pour donner ou demander du sang.
          </p>

          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
            >
              S'inscrire
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="https://img.freepik.com/vecteurs-libre/concept-don-sang_52683-39057.jpg?w=826"
            alt="Don de sang"
            className="rounded-xl w-full"
          />
        </div>
      </div>
    </div>
  )
}
