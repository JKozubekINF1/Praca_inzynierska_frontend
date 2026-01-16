import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  lat?: number;
  lng?: number;
  locationName?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng, locationName }) => {
  if (!lat || !lng) return null;

  return (
    <div className="h-80 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0 relative">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{locationName || 'Lokalizacja przedmiotu'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
