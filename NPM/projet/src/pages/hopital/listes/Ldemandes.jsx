import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MedicalNavBar from "../../navbar/MedicalNavBar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ... imports (inchangés)
function Ldemandes() {
  const [donneurs, setDonneurs] = useState([]);

useEffect(() => {
  const fetchBloodRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5500/api/blood_request/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Erreur lors du chargement :", err.message);
        setDonneurs([]); // Évite .map crash
        return;
      }

      const data = await response.json();
      setDonneurs(data);
    } catch (err) {
      console.error("Erreur réseau :", err);
      setDonneurs([]); // En cas d’erreur, valeur sûre
    }
  };

  fetchBloodRequest();
}, []);

  

  const changerStatut = async (id, nouveauStatut) => {
    try {
      const res = await fetch(`http://localhost:5500/api/blood_request/${id}/statut`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

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
    doc.text("Liste des Demandes", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [
        [ "Nom",
      "Sexe",
      "Age",
      "Téléphone",
      "Groupage",
      "Date Besoin",
      "Date derniere transfusion",
      "Quantité",
      "Raison de la demande",
      "Centre",
      "Statut",],
      ],
      body: donneurs.map((d) => [
      d.nom,
      d.sexe,
      d.telephone,
      d.age,
      d.groupe_sanguin,
      d.date_besoin,
      d.date_derniere_transfusion,
      d.quantity,
      d.reason,
      d.centre_id,
      d.statut || "en_attente",
      ]),
    });

    doc.save("dons.pdf");
  };

  const exporterCSV = (donneurs) => {
    const headers = [
      "Nom",
      "Sexe",
      "Age",
      "Téléphone",
      "Groupage",
      "Date Besoin",
      "Date derniere transfusion",
      "Quantité",
      "Raison de la demande",
      "Centre",
      "Statut",
    ];
    const rows = donneurs.map((d) => [
      d.nom,
      d.sexe,
      d.telephone,
      d.age,
      d.groupe_sanguin,
      d.date_besoin,
      d.date_derniere_transfusion,
      d.quantity,
      d.reason,
      d.centre_id,
      d.statut || "en_attente",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "demandes_de_sang.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exporterExcel = (donneurs) => {
    const worksheet = XLSX.utils.json_to_sheet(donneurs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dons");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "dons.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white p-4 md:p-6">
      <MedicalNavBar />
      <div className="mt-24 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Liste des Demandes de sang</h1>

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
              <th className="p-2 border">Sexe</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Téléphone</th>
              <th className="p-2 border">Groupage</th>
              <th className="p-2 border">Date Besoin</th>
              <th className="p-2 border">Date derniere trannsfusion</th>
              <th className="p-2 border">Quantité</th>
              <th className="p-2 border">Raison de la demande</th>
              <th className="p-2 border">Centre</th>
              <th className="p-2 border">Statut</th>
            </tr>
          </thead>
          <tbody>
            {donneurs.map((d, index) => (
              <tr key={index} className="hover:bg-red-900">
                <td className="p-2 border flex flex-col md:flex-row gap-1 md:gap-2">
                  <button onClick={() => changerStatut(d.id, "validée")} className="bg-green-600 px-2 py-1 rounded hover:bg-green-700">Valider</button>
                  <button onClick={() => changerStatut(d.id, "refusée")} className="bg-red-600 px-2 py-1 rounded hover:bg-red-700">Refuser</button>
                  <button onClick={() => changerStatut(d.id, "en attente")} className="bg-yellow-600 px-2 py-1 rounded hover:bg-yellow-700 text-black">En attente</button>
                </td>
                <td className="p-2 border border-black text-black text-sm">{d.nom}</td>
                <td className="p-2 border border-black text-black text-sm">{d.sexe}</td>
                <td className="p-2 border border-black text-black text-sm">{d.age}</td>
                <td className="p-2 border border-black text-black text-sm">{d.telephone}</td>
                <td className="p-2 border border-black text-black text-sm">{d.groupe_sanguin}</td>
                <td className="p-2 border border-black text-black text-sm">{d.date_besoin}</td>
                <td className="p-2 border border-black text-black text-sm">{d.date_derniere_transfusion}</td>
                <td className="p-2 border border-black text-black text-sm">{d.quantity_needed}</td>
                <td className="p-2 border border-black text-black text-sm">{d.reason}</td>
                <td className="p-2 border border-black text-black text-sm">{d.centre_id}</td>
                <td className="p-2 border border-black text-black text-sm">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Ldemandes;
