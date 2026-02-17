import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import NavBar from '../../navbar/NavBar';
import MedicalNavBar from '../../navbar/MedicalNavBar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
 function Statsdon() {
     // Données fictives pour les graphiques
  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Collectes de sang',
        data: [30, 25, 40, 35, 50, 60],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
      {
        label: 'Nouveaux donneurs',
        data: [5, 8, 12, 10, 18, 20],
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
      },
    ],
  };
  return (
<div className="p-6">
<MedicalNavBar/>
      <h2 className="text-2xl font-semibold mb-6 text-center text-red-600 mt-20">Statistiques de Collecte de Sang</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Graphique des Collectes</h3>
          <Line data={data} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Graphique des Nouveaux Donneurs</h3>
          <Line data={data} />
        </div>
      </div>

      {/* Autres statistiques */}
      <div className="mt-8 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2">Total des Donneurs</h4>
          <p>5000</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2">Total des Collectes</h4>
          <p>150</p>
        </div>
      </div>
    </div>  )
}
 export default Statsdon;