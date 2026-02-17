import React from 'react'

export default function AdminBoard() {
  return (
    <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <header className="bg-blue-900 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6">
                <h1 className="text-xl font-bold">Banque de Sang</h1>
                <nav>
                <ul className="flex space-x-6">
                    <li><a href="#" className="hover:underline">Accueil</a></li>
                    <li><a href="#" className="hover:underline">Donneurs</a></li>
                    <li><a href="#" className="hover:underline">Collectes</a></li>
                    <li><a href="#" className="hover:underline">CTS</a></li>
                    <li><a href="#" className="hover:underline text-red-400">Déconnexion</a></li>
                </ul>
                </nav>
            </div>
        </header>

        {/* Contenu principal */}
        <main className="container mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h2>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Carte 1 */}
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-700">Stock de Sang</h3>
                    <p className="text-3xl font-bold text-red-600 mt-4">120 poches</p>
                    </div>
                    {/* Carte 2 */}
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-700">Donneurs</h3>
                    <p className="text-3xl font-bold text-red-600 mt-4">320</p>
                    </div>
                    {/* Carte 3 */}
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-700">CTS</h3>
                    <p className="text-3xl font-bold text-red-600 mt-4">12</p>
                    </div>
                    {/* Carte 4 */}
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-700">Associations</h3>
                    <p className="text-3xl font-bold text-red-600 mt-4">8</p>
                </div>
            </div>

            {/* Bouton Ajouter une collecte */}
            <div className="flex justify-end">
                <button className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition">
                Ajouter une collecte
                </button>
            </div>
        </main>
  </div>
  )
}
