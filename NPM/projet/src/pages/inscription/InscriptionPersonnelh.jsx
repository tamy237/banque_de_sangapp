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
    const payload = {
      name,
      email,
      password,
      phone,
      role,
    };
    
   if (role === "utilisateur" && bloodType) {
      payload.bloodType = bloodType;
    }

    
    console.log('Données envoyées au backend:', payload);

    const res = await fetch("http://localhost:5500/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    // console.log("Réponse backend :", data); // <== C’est ce qu’il faut voir ici


    if (!res.ok) {
      // Affiche une erreur claire si la requête a échoué
      console.error("Erreur de création :", data);
      alert(data.message || "Une erreur est survenue");
      return;
    }
    if (data.user && data.user.role) {
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // <= manquait ici

      if (data.user.role === "personnel") {
        navigate("/personnelHopital");
      } else if (data.user.role === "utilisateur") {
        navigate("/accueil");
      } else {
        navigate("/");
      }
    } else {
      console.error("Utilisateur ou rôle non défini dans la réponse :", data);
      alert("Erreur inattendue lors de la création de compte.");
    }

  } catch (err) {
    alert("Erreur serveur");
  }
};
// const roleRedirect = {
//   personnel: "/personnelHopital",
//   utilisateur: "/accueil",
// };

// const redirectPath = roleRedirect[data.user.role] || "/";
// navigate(redirectPath);


  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative">
      {/* Applique l'image de fond uniquement sur la div principale */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/dss2.png')",
            backgroundSize: "cover",  // Assure que l'image couvre la zone
            backgroundPosition: "center",  // Centre l'image pour un meilleur rendu
            backgroundAttachment: "fixed",
         }}
      ></div>

      <div className="relative z-10 w-full max-w-lg bg-gradient-to-r from-red-500 to-red-300 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Créer un compte
        </h2>
        <form onSubmit={handleRegister} className="space-y-4 text-white">
          
          
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-red-300 p-3 rounded-md text-white outline-none"
          >
             <option value="">choisisez votre role</option>
            <option value="utilisateur">Utilisateur</option>
            <option value="personnel">Personnel médical</option>
          </select>
          
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

          {role === "utilisateur" && (
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full bg-red-300 p-3 rounded-mdoutline-none"
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
          <Link
              to={role === "personnel" ? "/connexionH" : "/connexionU"}
              className="underline hover:text-yellow-400"
            >
              Déjà inscrit ? Connecte-toi
          </Link>

          </p>
        </form>
      </div>
    </div>
  );
}
