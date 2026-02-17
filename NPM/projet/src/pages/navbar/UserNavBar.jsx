import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaDonate, FaSignOutAlt, FaTint, FaSearch } from 'react-icons/fa';

export default function UserNavBar({ role }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();  
   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/connexionU"); // ou /connexionH selon le rôle
  };
  
   const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
      // const closeMenu = () => setMenuOpen(false);
    const [collectes, setCollectes] = useState([]);
    const [centres, setCentres] = useState([]);
    const [stock, setStock] = useState([]);
    const token = localStorage.getItem("token");
  
   useEffect(() => {
  if (!token) {
    console.warn("Aucun token trouvé.");
    return;
  }

  fetch("http://localhost:5500/api/collectes", {
    headers: {
       'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    },
  })
    .then(res => {
    if (!res.ok) throw new Error("Erreur chargement collectes");
    return res.json();
  })
  .then(data => setCollectes(data))
  .catch(err => console.error("Erreur collectes:", err));

  fetch("http://localhost:5500/api/centresroutes", {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
     .then(res => {
        if (res.status === 401) {
          // Rediriger vers la page de connexion
          navigate("/connexionU");
          throw new Error("Non autorisé");
        }
        return res.json();
      })
      .then(data => setCentres(data))
      .catch(err => console.error("Erreur centres:", err));

  fetch("http://localhost:5500/api/stock", {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("Erreur de chargement du stock");
      return res.json();
    })
    .then(data => setStock(data))
    .catch(err => console.error("Erreur lors du chargement du stock:", err));
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
    <header className="bg-red-600/70 shadow-md fixed top-0 w-full px-2 z-50">
      <div className="container mx-auto">
        {/* Première ligne - Barre principale */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">🩸 Banque de Sang</h1>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Rechercher..."
              className="px-3 py-1 text-gray-800 rounded bg-amber-50"
            />
            <FaSearch className="absolute right-2 top-2 text-gray-500" />
            {/* Affichage des résultats de recherche */}
            {searchResults.length > 0 && (
            <ul className="absolute bg-white border mt-1 w-full z-50">
              {searchResults.map((result, index) => (
                // <li key={index} className="px-3 py-1 hover:bg-gray-100 text-sm text-gray-700">
                //   <span className="font-semibold">{result.type}:</span> {result.label}
                // </li>

                <li
                    key={index}
                    onClick={() => {
                      if (result.type === 'Centre') navigate(`/centresroutes/${result.label}`);
                      else if (result.type === 'Collecte') navigate(`/collecte/${result.label}`);
                      else if (result.type === 'Stock') navigate(`/stock`);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="cursor-pointer px-3 py-1 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    <span className="font-semibold">{result.type}:</span> {result.label}
                  </li>

              ))}
            </ul>
          )}

          </div>
          {/* Menu desktop */}
          <nav className="hidden md:flex space-x-6 px-3">
            <NavLink to="/accueil" icon={<FaHome />} text="Accueil" />
            <NavLink to="/controle_don" icon={<FaTint />} text="Faire un Don" />
            <NavLink to="/demander_sang" icon={<FaDonate />} text="Demander du Sang" />
            <NavLink to="/ltc" icon={<FaDonate />} text="Liste des centres" />
            <NavLink to="/ltcollectes" icon={<FaDonate />} text="Liste des collectes" />
            <NavLink to="/premiere" onClick={handleLogout} icon={<FaSignOutAlt />} text="Déconnexion" />
          </nav>

          {/* Menu burger mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
              aria-label="Menu"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Deuxième ligne - Rôle utilisateur */}
        <div className="text-center text-xs text-white font-semibold py-1 bg-red-700">
          Connecté en tant que: {role || 'utilisateur'}
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden bg-amber-50 w-full px-4 py-3 space-y-3 shadow-lg hover:bg-red-200">
            <MobileNavLink
              to="/accueil"
              icon={<FaHome />}
              text="Accueil"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              to="/controle_don"
              icon={<FaTint />}
              text="Faire un Don"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              to="/demander_sang"
              icon={<FaDonate />}
              text="Demander du Sang"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              to="/ltc"
              icon={<FaDonate />}
              text="Liste des centres"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              to="/ltcollectes"
              icon={<FaDonate />}
              text="Liste des collectes"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              to="/premiere"
              icon={<FaSignOutAlt />}
              text="Déconnexion"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}

// Composant pour les liens desktop
const NavLink = ({ to, icon, text, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center text-white hover:text-gray-200 transition-colors duration-200"
  >
    <span className="mr-2">{icon}</span>
    {text}
  </Link>
);

// Composant pour les liens mobile
const MobileNavLink = ({ to, icon, text, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block py-2 px-3 text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
  >
    <span className="inline-block mr-2">{icon}</span>
    {text}
  </Link>
);
