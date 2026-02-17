import React, { useState } from "react";
import { Download, Search } from "lucide-react";
import MedicalNavBar from "../../../navbar/MedicalNavBar";

 function Historiqdem() {

    const demandesSimulees = [
        {
          id: 1,
          nom: "Ngono Paul",
          groupe: "O+",
          date: "2025-04-20",
          statut: "Acceptée",
        },
        {
          id: 2,
          nom: "Biya Aurélie",
          groupe: "A-",
          date: "2025-04-18",
          statut: "En attente",
        },
        {
          id: 3,
          nom: "Mballa Jules",
          groupe: "AB+",
          date: "2025-04-17",
          statut: "Rejetée",
        },
      ];
    

    const [recherche, setRecherche] = useState("");

  const demandesFiltrees = demandesSimulees.filter((demande) =>
    demande.nom.toLowerCase().includes(recherche.toLowerCase())
  );



  

  return (
    <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
        <MedicalNavBar/>
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-20">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Historique des demandes de sang
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
        <div className="flex items-center w-full md:w-1/2">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex gap-2 mt-2 md:mt-0">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Download size={16} /> Export PDF
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <thead>
            <tr className="bg-red-100 dark:bg-red-900 text-left">
              <th className="py-3 px-4 border-b">Nom</th>
              <th className="py-3 px-4 border-b">Groupe</th>
              <th className="py-3 px-4 border-b">Date</th>
              <th className="py-3 px-4 border-b">Statut</th>
            </tr>
          </thead>
          <tbody>
            {demandesFiltrees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Aucune demande trouvée.
                </td>
              </tr>
            ) : (
              demandesFiltrees.map((demande) => (
                <tr key={demande.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-4 border-b">{demande.nom}</td>
                  <td className="py-3 px-4 border-b">{demande.groupe}</td>
                  <td className="py-3 px-4 border-b">{demande.date}</td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        demande.statut === "Acceptée"
                          ? "bg-green-200 text-green-800"
                          : demande.statut === "Rejetée"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {demande.statut}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>  
  )
}

export default Historiqdem;
