import React from 'react';
import { FaTint, FaCalendarAlt, FaFileMedical, FaUserMd, FaSignOutAlt } from 'react-icons/fa';

export default function Dash() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center shadow">
        <div className="text-xl font-bold">Banque de Sang</div>
        <div className="flex items-center gap-4">
          <span>Bienvenue, Médecin</span>
          <button className="bg-red-600 px-3 py-1 rounded flex items-center gap-2 hover:bg-red-700">
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </nav>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
          <FaTint className="text-red-600 text-3xl" />
          <div>
            <h3 className="text-gray-500 text-sm">Poches en stock</h3>
            <p className="text-xl font-bold text-black ">132</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4 text-black">
          <FaCalendarAlt className="text-blue-600 text-3xl" />
          <div>
            <h3 className="text-gray-500 text-sm">Collectes à venir</h3>
            <p className="text-xl font-bold text-black">4</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4 text-black">
          <FaFileMedical className="text-green-600 text-3xl" />
          <div>
            <h3 className="text-gray-500 text-sm">Demandes en attente</h3>
            <p className="text-xl font-bold ">7</p>
          </div>
        </div>
      </div>

      {/* Section collectes */}
      <div className="p-4 text-black">
        <h2 className="text-lg font-semibold mb-2">Collectes récentes</h2>
        <div className="bg-white p-4 shadow rounded-xl">
          <ul className="space-y-2 ">
            <li className="border-b pb-2">Collecte à Douala - 17 Mai 2025 - 10h00</li>
            <li className="border-b pb-2">Collecte à Yaoundé - 15 Mai 2025 - 09h30</li>
            <li>Collecte à Bafoussam - 12 Mai 2025 - 13h00</li>
          </ul>
        </div>
      </div>

      {/* Section demandes */}
      <div className="p-4 text-black">
        <h2 className="text-lg font-semibold mb-2">Demandes urgentes</h2>
        <div className="bg-white p-4 shadow rounded-xl">
          <ul className="space-y-2">
            <li className="border-b pb-2">Groupe O+ pour Douala - Besoin avant 16 Mai</li>
            <li className="border-b pb-2">Groupe AB- pour Yaoundé - Besoin immédiat</li>
            <li>Groupe A+ pour Garoua - Besoin avant 18 Mai</li>
          </ul>
        </div>
      </div>

      {/* Boutons d'action rapide */}
      <div className="p-4 flex flex-wrap gap-4 text-black">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-800">
          + Nouvelle collecte
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700">
          Gérer le stock
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700">
          Voir les donneurs
        </button>
      </div>
    </div>
  );
}
