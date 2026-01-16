import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
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

interface LocationPickerProps {
  coords: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapUpdater = ({ coords }: { coords: { lat: number; lng: number } | null }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 13);
    }
  }, [coords, map]);
  return null;
};

const LocationMarker = ({ coords, onSelect }: any) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return coords ? <Marker position={coords} /> : null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ coords, onLocationSelect }) => {
  const center = coords || { lat: 52.0693, lng: 19.4803 };

  return (
    <div className="h-64 w-full rounded-lg border border-gray-300 overflow-hidden z-0 relative">
      <p className="text-xs text-gray-500 p-1 bg-gray-50 border-b absolute top-0 left-0 w-full z-[400] text-center opacity-90">
        Wpisz adres powyżej LUB kliknij na mapie
      </p>
      <MapContainer
        center={center}
        zoom={coords ? 13 : 6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <LocationMarker coords={coords} onSelect={onLocationSelect} />
        <MapUpdater coords={coords} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
