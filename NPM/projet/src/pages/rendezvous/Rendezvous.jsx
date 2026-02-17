import React, { useEffect, useState } from 'react';
import UserNavBar from "../navbar/UserNavBar";

export default function Rendezvous({ user_id }) {
  const [rendezvous, setRendezvous] = useState([]);
  const [filtrerConfirme, setFiltrerConfirme] = useState(false);
  const token = localStorage.getItem("token");

  const fetchRendezvous = async () => {
    if (!user_id) return; // Ne rien faire si userId undefined
    try {
      const res = await fetch(`http://localhost:5500/api/auth/${user_id}/rendezvous`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors de la récupération des rendez-vous");
      const data = await res.json();
      setRendezvous(data);
    } catch (error) {
      console.error(error);
      alert("Erreur réseau ou serveur.");
    }
  };

  useEffect(() => {
    fetchRendezvous();
  }, [user_id]);

  const handleAnnuler = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) return;
    try {
      const res = await fetch(`http://localhost:5500/api/donation/rendezvous/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("Rendez-vous annulé.");
        fetchRendezvous();
      } else {
        alert("Échec de l’annulation.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau lors de l'annulation.");
    }
  };

  const filtered = filtrerConfirme
    ? rendezvous.filter(r => r.status === "confirmé")
    : rendezvous;

  return (
    <div className=" min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
         <UserNavBar/>
      <div className='p-2'>
          <div className="max-w-3xl mx-auto mt-24">
            <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">📅 Mes Rendez-vous de Don</h2>

            <div className="flex items-center justify-center mb-6">
              <label className="flex items-center text-gray-700 font-medium">
                <input
                  type="checkbox"
                  checked={filtrerConfirme}
                  onChange={() => setFiltrerConfirme(!filtrerConfirme)}
                  className="mr-2 w-4 h-4"
                />
                Afficher seulement les rendez-vous <span className="ml-1 font-semibold text-green-600">confirmés</span>
              </label>
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-gray-600">Aucun rendez-vous à afficher.</p>
            ) : (
              <ul className="space-y-6">
                {filtered.map((r) => (
                  <li
                    key={r.id}
                    className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-xl p-5 shadow-md hover:shadow-xl transition duration-300"
                  >
                    <p className="text-lg font-semibold text-blue-900 mb-1">
                      👤 {r.user.name}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      📆 <strong>Date de disponibilité :</strong> {new Date(r.datedisponibilite).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      🏷️ <strong>Statut :</strong>{' '}
                      <span className={r.status === 'confirmé' ? 'text-green-600 font-semibold' : 'text-yellow-600'}>
                        {r.status}
                      </span>
                    </p>

                    <button
                      onClick={() => handleAnnuler(r.id)}
                      className="mt-4 inline-block px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow"
                    >
                      ❌ Annuler
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
      </div>
    </div>
  );
}
