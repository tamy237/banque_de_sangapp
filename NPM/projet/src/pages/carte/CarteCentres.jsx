import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function CarteCentres() {
  const [centres, setCentres] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5500/api/centres')
      .then(res => setCentres(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <MapContainer center={[5.4, -4]} zoom={7} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {centres.map(centre => (
        <Marker key={centre.id} position={[centre.latitude, centre.longitude]}>
          <Popup>
            <b>{centre.name}</b><br />
            {centre.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default CarteCentres;
