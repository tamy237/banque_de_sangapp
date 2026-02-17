import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import UserNavBar from "../../navbar/UserNavBar";

function Listercollcte() {
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [userPosition, setUserPosition] = useState([3.848, 11.502]);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Erreur de géolocalisation :", error);
        alert("Impossible d'obtenir votre position. Assurez-vous d'avoir activé la géolocalisation.");
      }
    );
  };

  const fetchCentres = async () => {
  try {
    const res = await fetch("http://localhost:5500/api/centres", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    const data = await res.json();
    setCentres(data); // state centres utilisé pour affichage carte
  } catch (error) {
    console.error("Erreur chargement centres:", error);
  }
};


  // Récupérer les centres
  useEffect(() => {
    // console.log("Token utilisé :", localStorage.getItem("token"));

    fetch("http://localhost:5500/api/centresroutes", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setCentres(data))
      .catch(err => console.error("Erreur récupération centres:", err));
  }, []);

  // Supprimer un centre
// const handleDelete = async (id) => {
//   const confirm1 = window.confirm("⚠️ ATTENTION : Ce centre sera supprimé ainsi que toutes les collectes et demandes associées. Continuer ?");
//   if (!confirm1) return;

//   const confirm2 = window.confirm("Confirmez-vous la suppression définitive de ce centre ?");
//   if (!confirm2) return;

//   try {
//     const res = await fetch(`http://localhost:5000/api/centresroutes/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("token"),
//       },
//     });

//     if (res.ok) {
//       alert("✅ Centre supprimé avec succès, ainsi que les données associées.");
//       fetchCentres(); // Met à jour la liste
//     } else {
//       const errData = await res.json();
//       alert("❌ Erreur lors de la suppression : " + (errData.message || "Erreur inconnue"));
//     }
//   } catch (error) {
//     console.error("Erreur suppression centre:", error);
//     alert("❌ Une erreur réseau s'est produite.");
//   }
//   console.log(`Centre ID ${id} supprimé par l'utilisateur ID ${req.user.id} à ${new Date().toISOString()}`);

// };




//   // Modifier un centre
//   const handleEdit = (centre) => {
//     // TODO : Rediriger ou afficher un formulaire pour modification
//     alert("Modification du centre: " + centre.name);
//     // Exemple : navigate(`/modifier-centre/${centre.id}`) si tu utilises React Router
//   };

  // Calcul de l’itinéraire avec OpenRouteService
  useEffect(() => {
    if (!selectedCentre) {
      setRouteCoords([]);
      return;
    }

    const API_KEY = "5b3ce3597851110001cf6248ebb7e51ea81c455f9a9db510a976b22f";
    const coords = [
      [userPosition[1], userPosition[0]],  // lon, lat (user)
      [selectedCentre.longitude, selectedCentre.latitude],  // lon, lat (centre)
    ];

    fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coordinates: coords }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur API ORS: " + res.status);
        return res.json();
      })
      .then(data => {
        const geometry = data.features[0].geometry.coordinates;
        const routeLatLng = geometry.map(coord => [coord[1], coord[0]]);
        setRouteCoords(routeLatLng);
      })
      .catch(err => console.error("Erreur calcul itinéraire:", err));
  }, [selectedCentre, userPosition]);

  return (
    <div className="min-h-screen bg-gray-100 m-2">
      <UserNavBar />

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] mt-18">
        {/* Liste des centres */}
        <div className="md:w-1/3 overflow-y-auto bg-amber-50 p-4 shadow text-black">
          <h2 className="text-xl font-bold mb-4 text-black">Centres enregistrés</h2>
          {centres.map(centre => (
            <div
              key={centre.id}
              className="mb-3 p-3 rounded border text-black bg-white hover:bg-red-100"
            >
              <div
                className="cursor-pointer"
                onClick={() => setSelectedCentre(centre)}
              >
                <h3 className="font-semibold">{centre.name}</h3>
                <p>{centre.address || centre.location}</p>
                <p className="text-sm text-red-500">{centre.phone}</p>
              </div>
            </div>
          ))}
          <button onClick={getUserLocation} className="mt-4 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-800">
            📍 Utiliser ma position actuelle
          </button>
        </div>

        {/* Carte */}
        <div className="md:w-2/3 h-96 md:h-full relative">
          {selectedCentre ? (
            <MapContainer
              center={[selectedCentre.latitude, selectedCentre.longitude]}
              zoom={18}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={userPosition}>
                <Popup>Vous êtes ici</Popup>
              </Marker>

              <Marker position={[selectedCentre.latitude, selectedCentre.longitude]}>
                <Popup>
                  <strong>{selectedCentre.name}</strong><br />
                  {selectedCentre.address}<br />
                  {selectedCentre.phone}
                </Popup>
              </Marker>

              {routeCoords.length > 0 && (
                <Polyline positions={routeCoords} color="blue" />
              )}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>📍 Cliquez sur un centre pour afficher sa localisation</p>
            </div>
          )}
        </div>
      </div>

      <footer className="text-lg text-center text-white bg-gray-600">
        <p>Banque de sang tout droit reservé@ sous peine de poursuuite judiciaire</p>
      </footer>
    </div>
  );
}

export default Listercollcte;
