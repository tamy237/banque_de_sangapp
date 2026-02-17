import React, { useEffect, useState } from 'react';
import MedicalNavBar from '../../navbar/MedicalNavBar';

const ListeStock = () => {
  const [stocks, setStocks] = useState([]);
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('http://localhost:5500/api/stock', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error('Erreur chargement stocks :', error);
      }
    };

    const fetchCentres = async () => {
      try {
        const response = await fetch('http://localhost:5500/api/centresroutes', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        setCentres(data);
      } catch (error) {
        console.error('Erreur chargement centres :', error);
      }
    };

    fetchStocks();
    fetchCentres();
  }, []);

  const filteredStocks = selectedCentre
    ? stocks.filter((s) => s.centre_id === parseInt(selectedCentre))
    : stocks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-4 sm:p-6">
      <MedicalNavBar />

      <div className="max-w-7xl mx-auto mt-18">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Stocks de sang</h2>

        {/* Filtre par centre */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="font-semibold">Filtrer par centre :</label>
          <select
            value={selectedCentre}
            onChange={(e) => setSelectedCentre(e.target.value)}
            className="border bg-gray-200 text-black rounded px-3 py-1"
          >
            <option value="">Tous les centres</option>
            {centres.map((centre) => (
              <option key={centre.id} value={centre.id}>
                {centre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tableau responsive */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base border border-gray-300">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="py-2 px-4 border">Groupe Sanguin</th>
                <th className="py-2 px-4 border">Centre</th>
                <th className="py-2 px-4 border">Quantité</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <tr key={stock.id} className="text-center border-t">
                    <td className="py-2 px-4 border">{stock.groupeSanguin}</td>
                    <td className="py-2 px-4 border">{stock.centre?.name || 'Inconnu'}</td>
                    <td className="py-2 px-4 border">{stock.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center">
                    Aucun stock disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListeStock;
