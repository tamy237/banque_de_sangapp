import React, { useEffect, useState } from 'react';
import MedicalNavBar from '../navbar/MedicalNavBar';

export default function AdminRendezvous() {
  const [rendezvous, setRendezvous] = useState([]);
  const [filtrerNonConfirme, setFiltrerNonConfirme] = useState(false);

  // 🔐 À remplacer par le vrai ID utilisateur (à récupérer depuis le context, localStorage ou props)
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id; // Remplace ceci dynamiquement si nécessaire

  const fetchRendezvous = async () => {
    try {
      const res = await fetch(`http://localhost:5500/api/donation/auth/${user_id}/rendezvous`);

      if (!res.ok) {
        throw new Error('Erreur lors du fetch des rendez-vous');
      }

      const data = await res.json();

      // Vérifie que data est un tableau
      if (Array.isArray(data)) {
        setRendezvous(data);
      } else {
        console.error("Réponse inattendue :", data);
        setRendezvous([]); // éviter les erreurs .map
      }
    } catch (err) {
      console.error("Erreur attrapée :", err);
      setRendezvous([]);
    }
  };

  useEffect(() => {
    fetchRendezvous();
  }, []);

  const handleConfirmer = async (id) => {
    try {
      const res = await fetch(`http://localhost:5500/api/donation/rendezvous/${id}/confirmer`, {
        method: 'PUT'
      });
      if (res.ok) {
        alert('Rendez-vous confirmé.');
        fetchRendezvous();
      } else {
        alert('Erreur lors de la confirmation.');
      }
    } catch (error) {
      alert("Erreur réseau");
    }
  };

  const filtered = filtrerNonConfirme
    ? rendezvous.filter(r => r.status !== 'confirmé')
    : rendezvous;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-200">
      <MedicalNavBar />
      <div className="max-w-4xl mx-auto mt-24">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-8 text-center tracking-wide drop-shadow-md mt-20">
          📋 Gestion des Rendez-vous
        </h2>

        <div className="flex items-center justify-center mb-8">
          <label className="flex items-center text-gray-700 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filtrerNonConfirme}
              onChange={() => setFiltrerNonConfirme(!filtrerNonConfirme)}
              className="mr-3 w-5 h-5 accent-yellow-600"
            />
            Afficher seulement les rendez-vous <span className="ml-1 font-semibold text-yellow-700">non confirmés</span>
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600 italic text-lg">Aucun rendez-vous à afficher.</p>
        ) : (
          <ul className="space-y-8">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="bg-gradient-to-r from-blue-300/80 via-blue-200/70 to-blue-300/80 border border-blue-400 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-500 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div>
                  <p className="text-xl font-semibold text-blue-900 mb-2 drop-shadow-sm">
                    👤 {r.User?.name || 'Nom inconnu'}
                  </p>
                  <p className="text-md text-gray-800 mb-1 flex items-center gap-2">
                    📆 <strong>Date de disponibilité :</strong> {new Date(r.datedisponibilite).toLocaleDateString()}
                  </p>
                  <p className="text-md flex items-center gap-2">
                    🏷️ <strong>Statut :</strong>{' '}
                    <span
                      className={
                        r.status === 'confirmé'
                          ? 'text-green-700 font-semibold drop-shadow'
                          : 'text-yellow-700 font-semibold drop-shadow'
                      }
                    >
                      {r.status}
                    </span>
                  </p>
                </div>

                {r.status !== 'confirmé' && (
                  <button
                    onClick={() => handleConfirmer(r.id)}
                    className="mt-6 sm:mt-0 sm:ml-6 px-8 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    ✅ Confirmer
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
