import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BloodRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Récupérer toutes les demandes en attente
    axios.get('/api/blood-requests')
      .then(response => {
        setRequests(response.data.requests);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des demandes', error);
      });
  }, []);

  const handleAction = (requestId, action) => {
    // Modifier le statut de la demande
    axios.patch('/api/blood-requests/status', { requestId, action })
      .then(response => {
        // Mettre à jour la liste des demandes après l'action
        setRequests(requests.map(request =>
          request.id === requestId ? { ...request, status: action === 'valider' ? 'validée' : 'rejetée' } : request
        ));
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du statut', error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Demandes de Sang</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Type de Sang</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Quantité</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Raison</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Statut</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{request.id}</td>
              <td className="px-4 py-2">{request.bloodType}</td>
              <td className="px-4 py-2">{request.quantity}</td>
              <td className="px-4 py-2">{request.reason}</td>
              <td className="px-4 py-2">{request.status}</td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => handleAction(request.id, 'valider')} 
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                >
                  Valider
                </button>
                <button 
                  onClick={() => handleAction(request.id, 'rejeter')} 
                  className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Rejeter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BloodRequests;
