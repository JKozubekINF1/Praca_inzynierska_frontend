import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: iconMarker,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface InPostPoint {
  id: number;
  lat: number;
  lon: number;
  tags: {
    ref?: string;
    'addr:city'?: string;
    'addr:street'?: string;
    brand?: string;
    operator?: string;
    name?: string;
  };
}

interface InPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (point: { name: string; address: { line1: string; line2: string } }) => void;
}

const MapInstanceSetter = ({ setMap }: { setMap: (map: L.Map) => void }) => {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  return null;
};

const MapController = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
};

const MapEvents = ({ onMove }: { onMove: () => void }) => {
  useMapEvents({
    moveend: () => onMove(),
    zoomend: () => onMove(),
  });
  return null;
};

const SearchHereButton = ({
  show,
  onClick,
  loading,
}: {
  show: boolean;
  onClick: () => void;
  loading: boolean;
}) => {
  if (!show && !loading) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
      <button
        onClick={onClick}
        disabled={loading}
        className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg font-bold text-sm hover:bg-gray-50 transition flex items-center gap-2 border border-gray-200"
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            Szukam...
          </>
        ) : (
          'Szukaj w tym obszarze'
        )}
      </button>
    </div>
  );
};

const InPostModal: React.FC<InPostModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [points, setPoints] = useState<InPostPoint[]>([]);
  const [resolvingAddress, setResolvingAddress] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [isSearchingPoints, setIsSearchingPoints] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  const [showSearchHereBtn, setShowSearchHereBtn] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const fetchPointsInBounds = async () => {
    if (!mapInstance) return;

    const zoom = mapInstance.getZoom();
    if (zoom < 13) {
      alert('Przybliż mapę, aby wyszukać punkty (zbyt duży obszar).');
      return;
    }

    setIsSearchingPoints(true);
    setShowSearchHereBtn(false);

    const bounds = mapInstance.getBounds();

    try {
      const query = `
                [out:json][timeout:25];
                (
                  node["amenity"="parcel_locker"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
                );
                out body;
            `;
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.elements) {
        setPoints(data.elements);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchingPoints(false);
    }
  };
  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingCity(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setShowSearchHereBtn(true);
      } else {
        alert('Nie znaleziono takiej lokalizacji.');
      }
    } catch (error) {
      console.error('Błąd wyszukiwania:', error);
    } finally {
      setIsSearchingCity(false);
    }
  };

  const handleSelectPoint = async (point: InPostPoint) => {
    setResolvingAddress(point.id);

    let street = point.tags['addr:street'];
    let city = point.tags['addr:city'];

    const ref = point.tags.ref || point.tags.name;
    const operator = point.tags.operator || point.tags.brand || 'Automat';
    const name = ref ? `${operator} ${ref}` : operator;

    if (!street || !city) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${point.lat}&lon=${point.lon}`
        );
        const data = await res.json();

        if (data && data.address) {
          street = street || data.address.road || data.address.pedestrian || '';
          city = city || data.address.city || data.address.town || data.address.village || '';
        }
      } catch (err) {
        console.error('Błąd adresu:', err);
      }
    }

    onSelect({
      name: name,
      address: {
        line1: street || `(${point.lat.toFixed(4)}, ${point.lon.toFixed(4)})`,
        line2: city || '',
      },
    });

    setResolvingAddress(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 bg-white z-20 shadow-sm">
          <div>
            <h3 className="font-bold text-lg leading-tight">Wybierz punkt odbioru</h3>
            <p className="text-sm text-gray-500 hidden sm:block">Wpisz miasto i kliknij "Szukaj"</p>
          </div>

          <form onSubmit={handleCitySearch} className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              placeholder="Wpisz miasto (np. Warszawa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isSearchingCity}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSearchingCity ? '...' : 'Szukaj'}
            </button>
          </form>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-3xl leading-none absolute top-4 right-4 sm:static"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 relative">
          <MapContainer
            center={[52.2297, 21.0122]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            <MapInstanceSetter setMap={setMapInstance} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController center={mapCenter} />
            <MapEvents onMove={() => setShowSearchHereBtn(true)} />

            <SearchHereButton
              show={showSearchHereBtn}
              loading={isSearchingPoints}
              onClick={fetchPointsInBounds}
            />

            {points.map((p) => {
              const ref = p.tags.ref || p.tags.name;
              const operator = p.tags.operator || p.tags.brand || 'Automat';
              const name = ref ? `${operator} ${ref}` : operator;

              const displayStreet = p.tags['addr:street'] || '';
              const displayCity = p.tags['addr:city'] || '';

              return (
                <Marker key={p.id} position={[p.lat, p.lon]}>
                  <Popup>
                    <div className="text-center p-2 min-w-[200px]">
                      <b className="text-lg block mb-1">{name}</b>
                      {(displayStreet || displayCity) && (
                        <p className="text-sm text-gray-600 mb-3">
                          {displayStreet} {displayCity}
                        </p>
                      )}
                      <button
                        onClick={() => handleSelectPoint(p)}
                        disabled={resolvingAddress === p.id}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black w-full rounded-lg py-2 font-bold transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {resolvingAddress === p.id ? 'Pobieranie adresu...' : 'Wybierz ten punkt'}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default InPostModal;
