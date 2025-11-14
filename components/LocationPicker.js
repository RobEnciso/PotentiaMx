'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

/**
 * LocationPicker - Selector de ubicación interactivo con mapa
 *
 * Permite al usuario:
 * 1. Hacer clic en el mapa para seleccionar una ubicación
 * 2. Buscar una dirección usando geocoding
 * 3. Usar su ubicación actual (GPS)
 *
 * @param {Object} props
 * @param {number|null} props.latitude - Latitud inicial
 * @param {number|null} props.longitude - Longitud inicial
 * @param {Function} props.onChange - Callback cuando cambia la ubicación: (lat, lng) => void
 * @param {boolean} props.required - Si el campo es obligatorio
 */
export default function LocationPicker({
  latitude,
  longitude,
  onChange,
  required = false,
}) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [currentLat, setCurrentLat] = useState(latitude || 20.653407); // Puerto Vallarta por defecto
  const [currentLng, setCurrentLng] = useState(longitude || -105.225396);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Inicializar mapa cuando el componente se monta
  useEffect(() => {
    // Solo importar Leaflet en el cliente
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Verificar si el mapa ya está inicializado
      const container = L.DomUtil.get('location-picker-map');
      if (container != null && container._leaflet_id != null) {
        // Ya existe un mapa, salir
        return;
      }

      // Fix para los íconos de Leaflet en Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const mapInstance = L.map('location-picker-map').setView(
        [currentLat, currentLng],
        13,
      );

      // Usar OpenStreetMap (gratuito)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Agregar marcador inicial si hay coordenadas
      let markerInstance = null;
      if (latitude && longitude) {
        markerInstance = L.marker([latitude, longitude], {
          draggable: true,
        }).addTo(mapInstance);

        // Actualizar coordenadas cuando se arrastra el marcador
        markerInstance.on('dragend', (e) => {
          const pos = e.target.getLatLng();
          setCurrentLat(pos.lat);
          setCurrentLng(pos.lng);
          onChange(pos.lat, pos.lng);
        });
      }

      // Agregar marcador al hacer clic en el mapa
      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;

        if (markerInstance) {
          markerInstance.setLatLng([lat, lng]);
        } else {
          markerInstance = L.marker([lat, lng], {
            draggable: true,
          }).addTo(mapInstance);

          markerInstance.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            setCurrentLat(pos.lat);
            setCurrentLng(pos.lng);
            onChange(pos.lat, pos.lng);
          });

          setMarker(markerInstance);
        }

        setCurrentLat(lat);
        setCurrentLng(lng);
        onChange(lat, lng);
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    };

    initMap();

    // Cleanup
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []); // Solo ejecutar una vez

  // Buscar dirección usando Nominatim (OpenStreetMap geocoding - gratuito)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);

        if (map) {
          map.setView([latNum, lngNum], 15);
        }

        if (marker) {
          marker.setLatLng([latNum, lngNum]);
        } else if (map) {
          const L = (await import('leaflet')).default;
          const newMarker = L.marker([latNum, lngNum], {
            draggable: true,
          }).addTo(map);

          newMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            setCurrentLat(pos.lat);
            setCurrentLng(pos.lng);
            onChange(pos.lat, pos.lng);
          });

          setMarker(newMarker);
        }

        setCurrentLat(latNum);
        setCurrentLng(lngNum);
        onChange(latNum, lngNum);
      } else {
        alert(
          'No se encontró la ubicación. Intenta con una dirección más específica.',
        );
      }
    } catch (error) {
      console.error('Error buscando ubicación:', error);
      alert('Error al buscar la ubicación. Por favor, intenta de nuevo.');
    } finally {
      setSearching(false);
    }
  };

  // Obtener ubicación actual del usuario (GPS)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        if (map) {
          map.setView([lat, lng], 15);
        }

        if (marker) {
          marker.setLatLng([lat, lng]);
        } else if (map) {
          const L = (await import('leaflet')).default;
          const newMarker = L.marker([lat, lng], {
            draggable: true,
          }).addTo(map);

          newMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            setCurrentLat(pos.lat);
            setCurrentLng(pos.lng);
            onChange(pos.lat, pos.lng);
          });

          setMarker(newMarker);
        }

        setCurrentLat(lat);
        setCurrentLng(lng);
        onChange(lat, lng);
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert(
          'No se pudo obtener tu ubicación. Verifica los permisos de tu navegador.',
        );
        setGettingLocation(false);
      },
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">
          Ubicación del Terreno{' '}
          {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={gettingLocation}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Navigation className="w-3 h-3" />
          {gettingLocation ? 'Obteniendo...' : 'Mi Ubicación'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar dirección... (ej: Boca de Tomatlán, Jalisco)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searching ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Current Coordinates */}
      {currentLat && currentLng && (
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
          <MapPin className="w-4 h-4 text-teal-500" />
          <span>
            <strong>Ubicación:</strong> {currentLat.toFixed(6)},{' '}
            {currentLng.toFixed(6)}
          </span>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full h-96 bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-300">
        <div id="location-picker-map" className="w-full h-full"></div>

        {/* Instructions Overlay */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-slate-200 max-w-xs">
          <p className="text-xs text-slate-700">
            💡 <strong>Cómo usarlo:</strong> Haz clic en el mapa para marcar la
            ubicación del terreno, o busca una dirección arriba. Puedes
            arrastrar el marcador para ajustar.
          </p>
        </div>
      </div>

      {/* Hidden inputs for form validation */}
      <input
        type="hidden"
        name="latitude"
        value={currentLat || ''}
        required={required}
      />
      <input
        type="hidden"
        name="longitude"
        value={currentLng || ''}
        required={required}
      />
    </div>
  );
}
