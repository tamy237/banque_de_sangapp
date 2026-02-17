import React, { useEffect, useState } from 'react';
import MedicalNavBar from '../../navbar/MedicalNavBar';

function ListeCollectes() {
  const [collectes, setCollectes] = useState([]);
  const [centres, setCentres] = useState([]);

  // Récupérer ton token depuis localStorage (ou autre stockage)
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCollectes();
    fetchCentres();
  }, []);

  const fetchCollectes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/collectes', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Ajout du token dans le header
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setCollectes(data);
      } else {
        console.error('Les collectes reçues ne sont pas un tableau:', data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des collectes :', error);
    }
  };

  const fetchCentres = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/centresroutes', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Ajout du token dans le header
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setCentres(data);
      } else {
        console.error('Les centres reçus ne sont pas un tableau:', data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des centres :', error);
    }
  };


  const getCentreNom = (id) => {
    const centre = centres.find((c) => c.id === id);
    return centre ? centre.name : 'Inconnu';
  };

    // Nouvelle fonction pour supprimer une collecte
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette collecte ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/collectes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
      }

      // Après suppression, on retire la collecte supprimée de la liste affichée
      setCollectes(prevCollectes => prevCollectes.filter(col => col.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la collecte :', error);
      alert('Impossible de supprimer la collecte.');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-6">
      <MedicalNavBar />
      <h1 className="text-3xl font-bold mb-6 mt-20">Liste des Collectes de Sang</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white bg-opacity-10 backdrop-blur-md text-black rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-red-700 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Heure</th>
              <th className="p-3">Type</th>
              <th className="p-3">CTS</th>
              <th className="p-3">Associations</th>
              <th className="p-3">Centre organisateur</th>
            </tr>
          </thead>
          <tbody>
            {collectes.map((col) => (
              <tr key={col.id} className="border-b border-gray-700 hover:bg-gray-300 text-black">
                <td className="p-3">{col.date}</td>
                <td className="p-3">{col.heure}</td>
                <td className="p-3">{col.type}</td>
                <td className="p-3">{col.cts}</td>
                <td className="p-3">{col.associations}</td>
                <td className="p-3">{getCentreNom(col.centre_id)}</td>
                 <td className="p-3">
                  <button
                    onClick={() => handleDelete(col.id)}
                    className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded"
                    type="button"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListeCollectes;
