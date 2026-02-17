import React, { useEffect, useState } from 'react';
import MedicalNavBar from '../../navbar/MedicalNavBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/auth');
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    await fetch(`http://localhost:5000/api/auth/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

//   const exportToPDF = () => {
//   const doc = new jsPDF();
//   doc.text("Liste des Utilisateurs", 14, 10);

//   const tableColumn = ["Nom", "Email", "Téléphone", "Groupage"];
//   const tableRows = [];

//   filteredUsers.forEach(user => {
//     const userData = [
//       user.name,
//       user.email,
//       user.phone,
//       user.bloodType
//     ];
//     tableRows.push(userData);
//   });

//   doc.autoTable({
//     head: [tableColumn],
//     body: tableRows,
//     startY: 20,
//   });

//   doc.save("liste_utilisateurs.pdf");
// };
const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("Liste des Utilisateurs", 14, 10);

  doc.autoTable({
    startY: 20,
    head: [["Nom", "Email", "Téléphone", "Groupage"]],
    body: users.map((user) => [
      user.name || "—",
      user.email || "—",
      user.phone || "—",
      user.bloodType || "—",
    ]),
  });

  doc.save("liste_utilisateurs.pdf");
};


  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter(u =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
       u.email.toLowerCase().includes(search.toLowerCase()))
    )
    .filter(u => (bloodFilter ? u.bloodType === bloodFilter : true));

  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="">
        <MedicalNavBar />
        <div className="p-4">
                <div className="flex justify-between mb-4 mt-28">
                    <h2 className="text-xl font-bold mb-4 ">Liste d'utilisateurs</h2>
                <button
                    onClick={exportToPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Télécharger en PDF
                </button>
                </div>

            {/* Recherche et Filtrage */}
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <input
                type="text"
                placeholder="Rechercher par nom ou email"
                className="p-2 border rounded w-full md:w-1/2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
                <select
                value={bloodFilter}
                onChange={(e) => setBloodFilter(e.target.value)}
                className="p-2 border rounded w-full md:w-1/4 text-xl "
                >
                <option value="" className='text-gray-800'>Tous les groupes sanguins</option>
                <option value="O+" className='text-gray-800'>O+</option>
                <option value="O-" className='text-gray-800'>O-</option>
                <option value="A+" className='text-gray-800'>A+</option>
                <option value="A-" className='text-gray-800'>A-</option>
                <option value="B+" className='text-gray-800'>B+</option>
                <option value="B-" className='text-gray-800'>B-</option>
                <option value="AB+" className='text-gray-800'>AB+</option>
                <option value="AB-" className='text-gray-800'>AB-</option>
                </select>
            </div>

            {/* Table - Grand écran */}
            <div className="hidden md:block">
                <table className="w-full table-auto border">
                <thead>
                    <tr className="bg-red-500 text-white text-xl">
                    <th className="p-2 border-x-2">Nom</th>
                    <th className="p-2 border-x-2">Email</th>
                    <th className="p-2 border-x-2">Téléphone</th>
                    <th className="p-2 border-x-2">Groupage</th>
                    <th className="p-2 border-x-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(user => (
                    <tr key={user.id} className="border-t border-y-2">
                        <td className="p-2 border-x-2">{user.name}</td>
                        <td className="p-2 border-x-2">{user.email}</td>
                        <td className="p-2 border-x-2">{user.phone}</td>
                        <td className="p-2 border-x-2">{user.bloodType}</td>
                        <td className="p-2 border-x-2">
                        <button
                            onClick={() => deleteUser(user.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Supprimer
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Vue mobile (cartes) */}
            <div className="block md:hidden space-y-4">
                {paginatedUsers.map(user => (
                <div key={user.id} className="border p-4 rounded shadow">
                    <p><span className="font-semibold space-y-2">Nom :</span> {user.name}</p>
                    <p><span className="font-semibold">Email :</span> {user.email}</p>
                    <p><span className="font-semibold">Téléphone :</span> {user.phone}</p>
                    <p><span className="font-semibold">Groupage :</span> {user.bloodType}</p>
                    <button
                    onClick={() => deleteUser(user.id)}
                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                    >
                    Supprimer
                    </button>
                </div>
                ))}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                    <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-red-500 text-white' : ''}`}
                    >
                    {page}
                    </button>
                ))}
                </div>
            )}
        </div>
    </div>
  );
}
