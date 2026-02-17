import React, { useState } from "react";
import { MapPin, CalendarDays, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import MedicalNavBar from "../navbar/MedicalNavBar";

function Lieucollecte() {
    const collectes = [
        {
          id: 1,
          lieu: "Hôpital Central de Yaoundé",
          ville: "Yaoundé",
          date: "2025-05-10",
          heure: "09:00",
        },
        {
          id: 2,
          lieu: "CHU de Douala",
          ville: "Douala",
          date: "2025-05-12",
          heure: "08:30",
        },
        {
          id: 3,
          lieu: "Hôpital Régional de Bafoussam",
          ville: "Bafoussam",
          date: "2025-05-15",
          heure: "10:00",
        },
      ];

      const [ville, setVille] = useState("");
      const villes = [...new Set(collectes.map((c) => c.ville))];
    
      const collectesFiltrees = ville
        ? collectes.filter((c) => c.ville === ville)
        : collectes;


  return (
<div className="min-h-screen bg-gradient-to-b from-red-100 via-white to-red-50 dark:from-gray-800 dark:to-gray-900 p-4">
    <MedicalNavBar/>
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mt-28">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
                <h1 className="text-3xl font-bold text-red-600">📍 Lieux de Collecte de Sang</h1>
                <Link
                    to="/faire-un-don"
                    className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                    <HeartHandshake size={20} /> Je veux donner mon sang
                </Link>
            </div>

            <div className="mb-6">
                <label className="text-gray-700 dark:text-gray-200 font-semibold mr-3">
                    Filtrer par ville :
                </label>
                <select
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Toutes</option>
                    {villes.map((v) => (
                    <option key={v} value={v}>
                        {v}
                    </option>
                    ))}
                </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {collectesFiltrees.map((collecte) => (
                    <div
                        key={collecte.id}
                        className="bg-red-50 dark:bg-gray-700 border-l-4 border-red-600 p-4 rounded shadow-md"
                        >
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                            {collecte.lieu}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <MapPin size={18} /> {collecte.ville}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1">
                            <CalendarDays size={18} /> {collecte.date} à {collecte.heure}
                        </p>
                    </div>
                ))}
            </div>
      </div>
    </div>  )
};

export default Lieucollecte;
