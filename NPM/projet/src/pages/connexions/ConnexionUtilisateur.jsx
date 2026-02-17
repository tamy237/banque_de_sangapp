import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function ConnexionPersonnelH() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5500/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Échec de la connexion");
      return;
    }

    // ✅ Sauvegarde dans localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      role: data.user.role,
      bloodType: data.user.role === "utilisateur" ? data.user.bloodType : null,
    }));

    // ✅ Redirection selon rôle
    switch (data.user.role) {
      case "admin":
        navigate("/dashboard");
        break;
      case "personnel":
        navigate("/personnelHopital");
        break;
      case "utilisateur":
        navigate("/accueil");
        break;
      default:
        navigate("/");
    }

  } catch (err) {
    console.error("Erreur de connexion :", err);
    alert("Erreur de connexion au serveur");
  }
};


  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('/dss2.png')" }} // Remplace par ton URL d'image
    >
      <div className="bg-gradient-to-r from-red-400  to-red-500 p-8 rounded-2xl shadow-md w-full max-w-lg lg:max-w-3xl xl:max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Connexion utilisateur/donneur </h2>
        <form onSubmit={handleLogin} className="space-y-4">

          <div className="flex items-center border border-gray-100 p-2 rounded-lg hover:border-amber-400">
            <FaUserShield className="text-white mr-2" />
            <input
              type="email"
              placeholder="Email professionnel"
              className="w-full outline-none bg-transparent text-white "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 p-2 rounded-lg hover:border-amber-400">
            <FaLock className="text-white mr-2" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full outline-none bg-transparent text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded-xl hover:bg-red-900 transition"
          >
            Se connecter
          </button>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="text-white hover:text-amber-600">
            <span>Vous n'avez pas encore de compte? Cliquez ici</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
