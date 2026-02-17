import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBars,FaTimes,FaHome, FaDonate, FaSearch,FaSignOutAlt,FaTint, FaBox,FaPlusSquare,
  FaCalendarCheck,
} from 'react-icons/fa';

export default function MedicalNavBar({ role }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/connexionH"); // ou /connexionH selon le rôle
};

 const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const [collectes, setCollectes] = useState([]);
  const [centres, setCentres] = useState([]);
  const [stock, setStock] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
  // Récupérer collectes
   const token = localStorage.getItem('token');
  // console.log('Token:', token);
  
  fetch("http://localhost:5500/api/collectes", {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
    .then(res => res.json())
    .then(data => setCollectes(data))
    .catch(err => console.error("Erreur collectes:", err));

  // Récupérer centres
  fetch("http://localhost:5500/api/centresroutes", {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
    .then(res => res.json())
    .then(data => setCentres(data))
    .catch(err => console.error("Erreur centres:", err));

 fetch('http://localhost:5500/api/stock', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
}) // 🔁 adapte l'URL selon ton backend
    .then(response => {
      if (!response.ok) throw new Error("Erreur de chargement du stock");
      return response.json();
    })
    .then(data => setStock(data))
    .catch(error => {
      console.error("Erreur lors du chargement du stock:", error);
    });
}, []);
 const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  setSearchQuery(query);

  if (query.trim() === "") {
    setSearchResults([]);
    return;
  }

  const results = [];

  // Rechercher dans collectes
  results.push(...collectes.filter(c =>
    (c.type && c.type.toLowerCase().includes(query)) ||
    (c.date && c.date.includes(query)) ||
    (c.lieu && c.lieu.toLowerCase().includes(query))
  ).map(c => ({ type: 'Collecte', label: `${c.type} à ${c.lieu} le ${c.date}` })));

  // Rechercher dans centres
  results.push(...centres.filter(c =>
    (c.name && c.name.toLowerCase().includes(query)) ||
    (c.location && c.location.toLowerCase().includes(query))
  ).map(c => ({
    type: 'Centre',
    label: `${c.name} (${c.location})`
  })));

  // Rechercher dans les stocks
  results.push(...stock.filter(s =>
    (s.groupeSanguin && s.groupeSanguin.toLowerCase().includes(query)) ||
    (s.centre && s.centre.name && s.centre.name.toLowerCase().includes(query)) ||
    (s.centre && s.centre.location && s.centre.location.toLowerCase().includes(query))
  ).map(s => ({
    type: 'Stock',
    label: `${s.groupeSanguin} disponible à ${s.centre.name} (${s.centre.location})`
  })));

  setSearchResults(results);
};


  return (
    <header className="bg-red-600/70 shadow-md fixed top-0 left-0 w-full z-50 px-4">
      <div className="flex justify-between items-center py-2 max-w-7xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mr-4">
           Banque de Sang
        </h1>

        {/* Barre de recherche */}
                  <div className="relative mr-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Rechercher..."
                      className="px-3 py-1 text-gray-800 rounded bg-amber-50"
                    />
                    <FaSearch className="absolute right-2 top-2 text-gray-700" />
                    {/* Affichage des résultats de recherche */}
                   {searchResults.length > 0 && (
                    <ul className="absolute bg-white border mt-1 w-full z-50">
                      {searchResults.map((result, index) => (
                        <li key={index} className="px-3 py-1 hover:bg-gray-100 text-sm text-gray-700">
                          <span className="font-semibold">{result.type}:</span> {result.label}
                        </li>
                      ))}
                    </ul>
                  )}
        
                  </div>

        {/* Desktop menu */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/personnelHopital" className="flex items-center text-white hover:text-yellow-300">
              <FaHome className="mr-2" /> Accueil
            </Link>
            <Link to="/ajouter_centre" className="flex items-center text-white hover:text-yellow-300">
              <FaPlusSquare className="mr-2" /> Ajouter un centre
            </Link>
            <Link to="/listecollecte" className="flex items-center text-white hover:text-yellow-300">
              <FaBox className="mr-2" /> Liste des centres
            </Link>
            <Link to="/cdcollecte" className="flex items-center text-white hover:text-yellow-300">
              <FaDonate className="mr-2" /> Liste de Collecte
            </Link>
             <Link to="/ajoutercollecte" className="flex items-center text-white hover:text-yellow-300">
              <FaPlusSquare className="mr-2" /> Ajouter une collecte
            </Link>
             <Link to="/listeUtilisateurs" className="flex items-center text-white hover:text-yellow-300">
              <FaSignOutAlt className="mr-2" /> Liste des utilidateurs
            </Link>
            <Link to="/rendez_vousPerso" className="flex items-end text-white hover:text-yellow-300">
              <FaCalendarCheck className="mr-2" /> Rendez-vous
            </Link>
            <Link to="/premiere" className="flex items-end text-white hover:text-yellow-300">
              <FaSignOutAlt className="mr-2" /> Déconnexion
            </Link>
          </nav>
        
        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 py-2 space-y-4 shadow-md">
          <Link to="/personnelHopital" onClick={closeMenu} className="flex items-center text-red-700 hover:bg-red-200">
            <FaHome className="mr-2" /> Accueil
          </Link>
          <Link to="/ajouter_centre" onClick={closeMenu} className="flex items-center text-red-700 hover:bg-red-200">
            <FaPlusSquare className="mr-2" /> Ajouter un centre
          </Link>
          <Link to="/listecollecte" onClick={closeMenu} className="flex items-center text-red-700 hover:bg-red-200">
            <FaBox className="mr-2" /> Liste des centres
          </Link>
          <Link to="/cdcollecte" onClick={closeMenu} className="flex items-center text-red-700 hover:bg-red-200">
            <FaDonate className="mr-2" /> Liste des collectes
          </Link>
          <Link to="/ajoutercollecte" onClick={closeMenu} className="flex items-center text-red-700 hover:bg-red-200">
            <FaPlusSquare className="mr-2" /> Ajouter une collecte
          </Link>
          <Link to="/listeUtilisateurs" onClick={closeMenu} className="flex items-center text-red-700 hover:bg-red-200">
            <FaDonate className="mr-2" /> Liste des utilisateurs
          </Link>
           <Link to="/rendez_vousPerso" onClick={closeMenu} className="flex items-center text-red-700 hover:bg-red-200">
            <FaCalendarCheck className="mr-2" /> Rendez-vous
          </Link>
          <Link to="/premiere" onClick={closeMenu[handleLogout] } className="flex items-center text-red-700 hover:bg-red-200">
            <FaSignOutAlt className="mr-2" /> Déconnexion
          </Link>
        </div>
      )}

      {/* Rôle affiché */}
      <div className="text-center text-xs text-white font-semibold py-1 bg-red-700">
        Connecté en tant que personnel médical
      </div>
    </header>
  );
}
