import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {FaCalendarAlt, FaHouseUser, FaMapMarkerAlt, FaTimes, FaUsers} from 'react-icons/fa'
import MedicalNavBar from '../../navbar/MedicalNavBar';

function AjoutCollecte() {
    const navigate = useNavigate();

    const [centres, setCentres] = useState([]);
      const [type, setType] = useState("");
      const [date, setDate] = useState("");
      const [heure, setHeure] = useState("");
      const [centre_id, setCentresId] = useState("");
      const [cts, setCts] = useState("");
      const [associations, setAssociations] = useState("");
  
      
      useEffect(() => {
        const fetchCentres = async () => {
          try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:5500/api/centresroutes", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (!response.ok) throw new Error("Erreur d’authentification");
  
          const data = await response.json();
          setCentres(data);
          console.log("Centres récupérés :", data);
        } catch (error) {
          console.error("Erreur lors du chargement des centres :", error);
        }
      };
  
      fetchCentres();
    }, []);
  const handleSubmit = async (e) => {
      e.preventDefault();


  // Vérifications de base
  if ( !type || !date || !heure || !centre_id || !cts || !associations ) {
    alert("Tous les champs sont requis.");
    return;
  }

  // ✅ Création du corps de la requête conforme au backend
  const body = {
    type,
    date,
    heure,
    centre_id,
    cts,
    associations
  };

  console.log("Données envoyées :", body);

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5500/api/collecteDonneurRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Collecte enregistré avec succès !");
      navigate("/personnelHopital");
    } else {
      console.error("Erreur :", data);
      alert(data.error || "Erreur lors de l'enregistrement du don.");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du don :", error);
    alert("Une erreur est survenue.");
  }
};
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-8">
      <MedicalNavBar/>
      <h1 className="text-3xl font-bold mb-6 mt-24">Ajouter une Collecte de Sang</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-6 mt-20"
      >
        <div>
          <label className="flex items-center mb-2 text-gray-800">
            <FaHouseUser className="mr-2 text-red-600" />Type de collecte</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Sélectionner</option>
            <option value="mobile">Mobile</option>
            <option value="fixe">Fixe</option>
            <option value="exceptionnelle">Exceptionnelle</option>
          </select>
        </div>

        <div>
          <label className="flex items-center mb-2 text-gray-800">
            <FaCalendarAlt className="mr-2 text-red-600" />Date</label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="flex items-center mb-2 text-gray-800">
            <FaTimes className="mr-2 text-red-600" />Heure</label>
          <input
            type="time"
            name="heure"
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

       {/* Centre */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-gray-700 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-red-600" /> Centre de collecte
        </label>
        <select
          value={centre_id}
          onChange={(e) => setCentresId(e.target.value)}
          className=" bg-gray-800 flex items-center border-gray-300 text-white p-3 rounded-lg"
          required
        >
          <option value="">Choisir un centre</option>
          {Array.isArray(centres) && centres.map(centre => (
            <option key={centre.id} value={centre.id}>
              {centre.name} 
            </option>
          ))}
        </select>
      </div>

        <div>
          <label className=" mb-2 text-gray-800 flex items-center">
            <FaHouseUser className="mr-2 text-red-600" />CTS organisateur</label>
          <input
            type="text"
            name="cts"
            value={cts}
            onChange={(e) => setCts(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="CTS cité verte"
          />
        </div>

        <div>
          <label className="flex items-center mb-2 text-gray-800">
            <FaUsers className="mr-2 text-red-600" />Associations participantes</label>
          <textarea
            name="associations"
            value={associations}
            onChange={(e) => setAssociations(e.target.value)}
            rows={3}
            className="w-full p-3 rounded bg-gray-800 text-white border focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Association A, B, etc."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-red-700 hover:bg-red-800 text-white py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Enregistrer la collecte
        </button>
      </form>
    </div>
  );
}

export default AjoutCollecte;
