import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangerMotPass() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5500/api/auth/changerpass", {
        method: "PUT", // ✅ Correction ici
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nouveauMotDePasse: newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Erreur lors de la mise à jour du mot de passe");
        return;
      }

      alert("Mot de passe modifié avec succès !");
      navigate("/personnelHopital"); // Redirection après succès
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-200 flex items-center justify-center p-4">
      <form
        onSubmit={handlePasswordChange}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Changer le mot de passe
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            className="w-full px-4 text-black py-2 border border-gray-500 rounded-xl focus:outline-none focus:ring focus:ring-red-300"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            className="w-full text-black px-4 py-2 border border-gray-500 rounded-xl focus:outline-none focus:ring focus:ring-red-300"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition duration-200"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Confirmer"}
        </button>
      </form>
    </div>
  );
}
