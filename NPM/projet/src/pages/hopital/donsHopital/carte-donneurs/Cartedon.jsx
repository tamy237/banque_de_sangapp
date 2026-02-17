import React from "react";



function Cartedon() {
    
    // Exemple de données dynamiques – à remplacer par des données réelles de l'utilisateur connecté
    const donneur = {
        nom: "Jean Mbarga",
        groupe: "O+",
        hopital: "Hôpital Général de Yaoundé",
        dateDernierDon: "15 Avril 2025",
        id: "DNR-0001",
      };

      const downloadCard = () => {
        const element = document.getElementById("carte-donneur");
        const opt = {
          margin: 0.2,
          filename: `carte_donneur_${donneur.nom.replace(" ", "_")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        window.html2pdf().set(opt).from(element).save();
      };
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-6">
      <MedicalNavBAr/>
      <div
        id="carte-donneur"
        className="w-full max-w-sm bg-white shadow-2xl rounded-xl border border-red-600"
      >
        <div className="bg-red-600 text-white text-center py-4 rounded-t-xl">
          <h1 className="text-2xl font-bold">CARTE DE DONNEUR</h1>
        </div>
        <div className="p-6 text-center space-y-3">
          <p className="text-lg"><strong>Nom :</strong> {donneur.nom}</p>
          <p className="text-lg"><strong>Groupe Sanguin :</strong> {donneur.groupe}</p>
          <p className="text-lg"><strong>ID Donneur :</strong> {donneur.id}</p>
          <p className="text-md text-gray-600"><strong>Dernier Don :</strong> {donneur.dateDernierDon}</p>
          <p className="text-md text-gray-600"><strong>Validé par :</strong> {donneur.hopital}</p>
        </div>
        <div className="flex justify-center pb-4">
          <button
            onClick={downloadCard}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            Télécharger la carte
          </button>
        </div>
      </div>
    </div>
)};


export default Cartedon;
