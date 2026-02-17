import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaTint, FaCalendarAlt, FaHome, FaDonate, FaHandHoldingMedical, FaSignOutAlt, FaSortNumericUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import UserNavBar from '../../navbar/UserNavBar';

export default function DemanderSang({ role }) {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [sexe, setSexe] = useState("");
  const [age, setAge] = useState("");
  const [telephone, setTelephone] = useState("");
  const [centreId, setCentreId] = useState("");
  const [groupe_sanguin, setGroupeSanguin] = useState("");
  const [date_besoin, setDateBesoin] = useState("");
  const [date_derniere_transfusion, setDateDerniereTransfusion] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [centres, setCentres] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setUserId(user.id);
    }
  }, []);

useEffect(() => {
  const fetchCentres = async () => {
    const token = localStorage.getItem("token");
    // console.log("Token utilisé :", token); // debug

    try {
      const response = await fetch("http://localhost:5500/api/centresroutes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur d’authentification");
      }

      const data = await response.json();
      setCentres(data);
    } catch (error) {
      console.error("Erreur lors du chargement des centres :", error);
    }
  };

  fetchCentres();
}, []); // pas besoin de [token]

const handleFairedemande = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Vous devez être connecté pour faire une demande.');
    return;
  }

  setIsLoading(true);
  try {
    const payload = {
      nom,
      sexe,
      age,
      telephone: telephone, // ✅ correspond au champ attendu dans le backend
      groupe_sanguin,
      date_besoin,
      date_derniere_transfusion,
      quantity_needed: quantity,
      reason,
      centre_id: centreId
    };
console.log("Payload envoyé :", payload);

    const response = await fetch("http://localhost:5500/api/blood_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur inconnue");
    }

    const data = await response.json();
    console.log(data);
    setMessage("Demande envoyée avec succès !");

     if (response.ok) {
      alert("Demande envoyée !!");
      navigate("/accueil");
    } else {
      alert(data.error || "Erreur lors de l'enregistrement du don");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande :", error.message);
    setMessage("Erreur : " + error.message);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-200 via-white to-red-500 flex flex-col">
      <UserNavBar role={role} />
      <Outlet />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mt-16">Formulaire de Demande de Sang</h2>

              <form
                className="bg-red-200 p-8 rounded-2xl shadow-lg w-full max-w-5xl space-y-6 mt-6"
                onSubmit={handleFairedemande}
              >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaUser className="mr-2 text-red-600" /> Nom complet du patient
                  </label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" required />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaUser className="mr-2 text-red-600" /> Sexe
                  </label>
                  <select value={sexe} onChange={(e) => setSexe(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" required>
                    <option value="">Sélectionnez</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaSortNumericUp className="mr-2 text-red-600" /> Âge
                  </label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" required />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaPhone className="mr-2 text-red-600" /> Téléphone
                  </label>
                  <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" required />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaTint className="mr-2 text-red-600" /> Groupe Sanguin
                  </label>
                  <select value={groupe_sanguin} onChange={(e) => setGroupeSanguin(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" required>
                    <option value="">Choisir un groupe</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaCalendarAlt className="mr-2 text-red-600" /> Date du besoin
                  </label>
                  <input type="date" value={date_besoin} onChange={(e) => setDateBesoin(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" required />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaCalendarAlt className="mr-2 text-red-600" /> Date de dernière transfusion (si applicable)
                  </label>
                  <input type="date" value={date_derniere_transfusion} onChange={(e) => setDateDerniereTransfusion(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaTint className="mr-2 text-red-600" /> Quantité demandée (en poche)
                  </label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" required />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700 flex items-center">
                    <FaDonate className="mr-2 text-red-600" /> Raison de la demande
                  </label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="border border-gray-500 text-black p-3 rounded-lg" rows="3" placeholder="Ex : Accident, opération..." required></textarea>
                </div>

                 {/* Centre */}
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-red-600" /> Centre de demande
                    </label>
                    <select
                      value={centreId}
                      onChange={(e) => setCentreId(e.target.value)}
                      className="border border-gray-500 text-black p-3 rounded-lg"
                      required
                    >
                      <option value="">Choisir un centre</option>
                      {Array.isArray(centres) && centres.map(centre => (
                        <option key={centre.id} value={centre.id}>
                          {centre.name} - {centre.location}
                        </option>
                      ))}
                    </select>
                  </div>

                <button
                  type="submit"
                  className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition ${isLoading ? 'cursor-wait' : ''}`}
                  disabled={isLoading}
                >
                  Envoyer ma demande
                </button>

                {message && <p className="text-green-600 font-medium mt-4">{message}</p>}
          </div>
              </form>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2025 Banque de Sang - Tous droits réservés
      </footer>
    </div>
  );
}
