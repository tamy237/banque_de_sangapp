import React from 'react'
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaDonate, FaHandHoldingMedical, FaSignOutAlt, FaTint } from 'react-icons/fa';
import { useState } from 'react';


export default function NavBar({ role }) {

    const [menuOpen, setMenuOpen] = useState(false);


  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50 px-2">
        <div className="flex justify-between items-center mx-5 px-6 py-4">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-red-700">Banque de Sang</h1>
            </div>

            {/* Menu desktop */}
            <nav className="hidden md:flex space-x-8">
                <Link to="/accueil" className="flex items-center text-red-900 hover:text-red-700">
                <FaHome className="mr-2" /> Accueil
                </Link>
                <Link to="/faire-don" className="flex items-center text-red-900 hover:text-red-700">
                <FaTint className="mr-2" /> Faire un Don
                </Link>
                <Link to="/demander_sang" className="flex items-center text-red-900 hover:text-red-700">
                <FaHandHoldingMedical className="mr-2" /> Demander du Sang
                </Link>
                <Link to="/connexionU" className="flex items-center text-red-900 hover:text-red-700">
                <FaSignOutAlt className="mr-2" /> Déconnexion
                </Link>
            </nav>

            {/* Bouton menu burger mobile */}
            <div className="md:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>
        </div>

     {/* Menu mobile (positionné sous le header) */}
        {menuOpen && (
            <div className="md:hidden flex flex-col bg-amber-50 w-full px-6 py-4 space-y-4 shadow-md">
                <Link to="/accueil" onClick={() => setMenuOpen(false)} className="text-red-900 hover:text-amber-600">
                    <FaHome className="inline mr-2" /> Accueil
                </Link>
                <Link to="/fairedon" onClick={() => setMenuOpen(false)} className="text-red-900 hover:text-amber-600">
                    <FaTint  className="inline mr-2" /> Faire un Don
                </Link>
                <Link to="/demander_sang" onClick={() => setMenuOpen(false)} className="text-red-900 hover:text-amber-600">
                    <FaHandHoldingMedical className="inline mr-2" /> Demander du Sang
                </Link>
                <Link to="/lieudecollecte" onClick={() => setMenuOpen(false)} className="text-red-900 hover:text-amber-600">
                    <FaSignOutAlt className="inline mr-2" /> Lieux de collecte
                </Link>
                <Link to="/premiere" onClick={() => setMenuOpen(false)} className="text-red-900 hover:text-amber-600">
                    <FaSignOutAlt className="inline mr-2" /> Déconnexion
                </Link>
            </div>
        )}

        {/* Rôle connecté */}
        <div className="text-center text-xs text-red-600 font-semibold py-2 bg-gray-100">
             Connecté comme : {role}
        </div>
  </header>
  )
}
