import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MedicalNavBar from "../../navbar/MedicalNavBar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ... imports (inchangés)
function Ldons() {
  const [donneurs, setDonneurs] = useState([]);


useEffect(() => {
  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5500/api/donation/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        if (!response.ok) {
        const err = await response.json();
        console.error("Erreur lors du chargement :", err.message);
        setDonneurs([]); // Evite .map crash
        return;
      }

      const data = await response.json();

      // Si chaque don contient un utilisateur dans data[i].User
      // Tu peux filtrer ou transformer si besoin, sinon juste stocker directement
      setDonneurs(data);
    } catch (err) {
      console.error("Erreur réseau :", err);
      setDonneurs([]);
    }
  };

  fetchDonations();
}, []);


  

  const changerStatut = async (id, nouveauStatut) => {
    try {
      const res = await fetch(`http://localhost:5500/api/donation/${id}/statut`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      // console.log(nouveauStatut);

      if (!res.ok) throw new Error("Échec de mise à jour du statut");

      setDonneurs((prev) =>
        prev.map((don) =>
          don.id === id ? { ...don, statut: nouveauStatut } : don
        )
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut", err);
    }
  };

  // PDF/CSV/Excel — mettre à jour les bons champs
  const exporterPDF = (donneurs) => {
  const doc = new jsPDF();
  doc.text("Liste des Dons", 14, 10);

  autoTable(doc, {
    startY: 20,
    head: [
      ["Nom", "Date de naissance", "Téléphone", "Sexe", "Poids", "Centre", "Groupage", "Date dispo", "Statut"],
    ],
    body: donneurs.map((d) => [
      d.user?.nom || "—",
      d.dateNaissance || "—",
      d.user?.telephone || "—",
      d.sexe || "—",
      d.poids || "—",
      d.centre?.nom || d.centre_id || "—",
      d.user?.groupeSanguin || "—",
      d.dateDisponibilite || "—",
      d.statut || "en_attente",
    ]),
  });

  doc.save("dons.pdf");
};

  const exporterCSV = (donneurs) => {
  const headers = [
    "Nom",
    "Date de naissance",
    "Téléphone",
    "Sexe",
    "Poids",
    "Centre",
    "Groupage",
    "Date dispo",
    "Statut",
  ];

  const rows = donneurs.map((d) => [
    d.user?.nom || "—",
    d.dateNaissance || "—",
    d.user?.telephone || "—",
    d.sexe || "—",
    d.poids || "—",
    d.centre?.nom || d.centre_id || "—",
    d.user?.groupeSanguin || "—",
    d.dateDisponibilite || "—",
    d.statut || "en_attente",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "liste_des_dons.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const exporterExcel = (donneurs) => {
  const data = donneurs.map((d) => ({
    Nom: d.user?.nom || "—",
    "Date de naissance": d.dateNaissance || "—",
    Téléphone: d.user?.telephone || "—",
    Sexe: d.sexe || "—",
    Poids: d.poids || "—",
    Centre: d.centre?.nom || d.centre_id || "—",
    Groupage: d.user?.groupeSanguin || "—",
    "Date dispo": d.dateDisponibilite || "—",
    Statut: d.statut || "en_attente"
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dons");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "dons.xlsx");
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white p-4 md:p-6">
      <MedicalNavBar />
      <div className="mt-24 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Liste des Dons</h1>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => exporterCSV(donneurs)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">Exporter en CSV</button>
          <button onClick={() => exporterPDF(donneurs)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow">Exporter en PDF</button>
          <button onClick={() => exporterExcel(donneurs)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow">Exporter en Excel</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-blur-md">
        <table className="min-w-full text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-red-800 text-white">
              <th className="p-2 border">Actions</th>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Date de Naissance</th>
              <th className="p-2 border">Téléphone</th>
              <th className="p-2 border">Sexe</th>
              <th className="p-2 border">Poids</th>
              <th className="p-2 border">Centre</th>
              <th className="p-2 border">Groupage</th>
              <th className="p-2 border">Date dispo</th>
              <th className="p-2 border">Statut</th>
            </tr>
          </thead>
          <tbody>
            {donneurs.map((d, index) => {
              // console.log("DONNEUR:", d);
              return(
              <tr key={index} className="hover:bg-red-900">
                <td className="p-2 border flex flex-col md:flex-row gap-1 md:gap-2">
                  <button onClick={() => changerStatut(d.id, "valide")} className="bg-green-600 px-2 py-1 rounded hover:bg-green-700">Valider</button>
                  <button onClick={() => changerStatut(d.id, "refuse")} className="bg-red-600 px-2 py-1 rounded hover:bg-red-700">Refuser</button>
                  <button onClick={() => changerStatut(d.id, "en_attente")} className="bg-yellow-600 px-2 py-1 rounded hover:bg-yellow-700 text-black">En attente</button>
                </td>
                <td className="p-2 border text-sm text-black">{d.User?.name}</td>
                <td className="p-2 border text-sm text-black">{d.dateNaissance}</td>
                <td className="p-2 border text-sm text-black">{d.User?.phone}</td>
                <td className="p-2 border text-sm text-black">{d.sexe}</td>
                <td className="p-2 border text-sm text-black">{d.poids}</td>
                <td className="p-2 border text-sm text-black">{d.centre_id}</td>
                <td className="p-2 border text-sm text-black">{d.groupeSanguin}</td>
                <td className="p-2 border text-sm text-black">{d.dateDisponibilite}</td>
                <td className="p-2 border text-sm text-black">{d.statut}</td>
              </tr>
              );
})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Ldons;
