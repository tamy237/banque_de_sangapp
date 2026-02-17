import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function InscriptionUtilisateur() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("utilisateur");
  const [bloodType, setBloodType] = useState("");

  const navigate = useNavigate();

const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5500/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        role,
        bloodType: role === "utilisateur" ? bloodType : null, // 🎯 seulement si c’est un utilisateur
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Inscription échouée");
      return;
    }

    // ✅ Enregistrement localStorage
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
    if (data.user.role === "personnel") {
      navigate("/personnelH");
    } else if (data.user.role === "utilisateur") {
      navigate("/accueil");
    } else {
      navigate("/accueil"); // Fallback ou page d’accueil
    }

  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    alert("Erreur serveur");
  }
};


  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Créer un compte
        </h2>
        <form onSubmit={handleRegister} className="space-y-4 text-white">
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full bg-white/20 p-3 rounded-md placeholder-white outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Adresse email"
            className="w-full bg-white/20 p-3 rounded-md placeholder-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full bg-white/20 p-3 rounded-md placeholder-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Téléphone"
            className="w-full bg-white/20 p-3 rounded-md placeholder-white outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white/20 p-3 rounded-md text-white outline-none"
          >
            <option value="utilisateur">Utilisateur</option>
            <option value="personnel">Personnel médical</option>
          </select>

          {role === "utilisateur" && (
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full bg-white/20 p-3 rounded-md text-white outline-none"
              required
            >
              <option value="">Groupe sanguin</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md transition duration-300"
          >
            S'inscrire
          </button>

          <p className="text-center text-sm mt-2">
            <Link to="/connexionU" className="underline hover:text-yellow-400">
              Déjà inscrit ? Connecte-toi
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
