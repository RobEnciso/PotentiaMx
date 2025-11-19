'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * PropertyMap - Mapa interactivo estilo Airbnb para mostrar propiedades
 *
 * @param {Object} props
 * @param {Array} props.properties - Array de terrenos con { id, title, sale_price, latitude, longitude, cover_image_url }
 * @param {Function} props.onMarkerHover - Callback cuando se hace hover en un marcador: (propertyId) => void
 * @param {string|null} props.hoveredPropertyId - ID de la propiedad sobre la que se está haciendo hover
 */
export default function PropertyMap(props) {
  const {
    properties = [],
    onMarkerHover = () => {},
    hoveredPropertyId = null,
  } = props;
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [isMapReady, setIsMapReady] = useState(false);

  // Inicializar el mapa solo una vez
  useEffect(() => {
    // Solo importar Leaflet en el cliente
    if (typeof window === 'undefined') return;
    if (isMapReady) return; // Ya está inicializado

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Fix para los íconos de Leaflet en Next.js
      delete L.Icon.Default.prototype._getIconUrl;

      // Calcular el centro del mapa basado en las propiedades
      const validProperties = properties.filter(
        (p) => p.latitude && p.longitude,
      );

      if (validProperties.length === 0) {
        console.warn('No hay propiedades con coordenadas para mostrar');
        return;
      }

      // Si el mapa ya existe, limpiar todo y recrear
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }

      // Calcular centro promedio
      const avgLat =
        validProperties.reduce((sum, p) => sum + parseFloat(p.latitude), 0) /
        validProperties.length;
      const avgLng =
        validProperties.reduce((sum, p) => sum + parseFloat(p.longitude), 0) /
        validProperties.length;

      // Crear mapa
      const map = L.map('property-map', {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([avgLat, avgLng], 12);

      // Usar OpenStreetMap (gratuito)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Crear marcadores personalizados estilo Airbnb
      validProperties.forEach((property) => {
        // Crear HTML para el marcador con precio
        const priceFormatted = formatPrice(property.sale_price);
        const markerHtml = createPriceMarkerHTML(
          priceFormatted,
          false,
          property.id,
        );

        const icon = L.divIcon({
          className: 'custom-price-marker',
          html: markerHtml,
          iconSize: [null, null],
          iconAnchor: [null, null],
        });

        const marker = L.marker([property.latitude, property.longitude], {
          icon,
        }).addTo(map);

        // Agregar evento click directamente al marcador de Leaflet
        marker.on('click', (e) => {
          console.log(
            'Click en marcador (evento Leaflet):',
            property.slug || property.id,
            property.title,
          );
          L.DomEvent.stopPropagation(e);
          const targetUrl = `/terreno/${property.slug || property.id}`;
          console.log('Navegando a:', targetUrl);
          window.location.href = targetUrl;
        });

        // También agregar evento al elemento DOM directamente (plan B)
        setTimeout(() => {
          const markerElement = marker.getElement();
          if (markerElement) {
            const priceDiv = markerElement.querySelector('.price-marker');
            if (priceDiv) {
              priceDiv.addEventListener('click', (e) => {
                console.log(
                  'Click en marcador (evento DOM):',
                  property.slug || property.id,
                  property.title,
                );
                e.stopPropagation();
                window.location.href = `/terreno/${property.slug || property.id}`;
              });
            }
          }
        }, 100);

        // Hover en marcador - SOLO cambiar clase CSS, NO recrear el ícono
        marker.on('mouseover', () => {
          onMarkerHover?.(property.id);
          const markerElement = marker.getElement();
          if (markerElement) {
            const priceDiv = markerElement.querySelector('.price-marker');
            if (priceDiv) {
              priceDiv.classList.add('active');
            }
          }
        });

        marker.on('mouseout', () => {
          if (hoveredPropertyId !== property.id) {
            onMarkerHover?.(null);
            const markerElement = marker.getElement();
            if (markerElement) {
              const priceDiv = markerElement.querySelector('.price-marker');
              if (priceDiv) {
                priceDiv.classList.remove('active');
              }
            }
          }
        });

        markersRef.current[property.id] = marker;
      });

      // Ajustar el mapa para mostrar todos los marcadores
      if (validProperties.length > 1) {
        const bounds = L.latLngBounds(
          validProperties.map((p) => [p.latitude, p.longitude]),
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      mapRef.current = map;
      setIsMapReady(true);
    };

    initMap();

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
        setIsMapReady(false);
      }
    };
  }, []); // Solo ejecutar una vez al montar

  // Actualizar marcadores cuando cambian las propiedades
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;

      // Limpiar marcadores existentes
      Object.values(markersRef.current).forEach((marker) => {
        mapRef.current.removeLayer(marker);
      });
      markersRef.current = {};

      const validProperties = properties.filter(
        (p) => p.latitude && p.longitude,
      );

      if (validProperties.length === 0) return;

      // Crear nuevos marcadores
      validProperties.forEach((property) => {
        const priceFormatted = formatPrice(property.sale_price);
        const markerHtml = createPriceMarkerHTML(
          priceFormatted,
          false,
          property.id,
        );

        const icon = L.divIcon({
          className: 'custom-price-marker',
          html: markerHtml,
          iconSize: [null, null],
          iconAnchor: [null, null],
        });

        const marker = L.marker([property.latitude, property.longitude], {
          icon,
        }).addTo(mapRef.current);

        // Agregar evento click
        marker.on('click', (e) => {
          console.log('Click en marcador:', property.slug || property.id, property.title);
          L.DomEvent.stopPropagation(e);
          window.location.href = `/terreno/${property.slug || property.id}`;
        });

        // También agregar evento DOM
        setTimeout(() => {
          const markerElement = marker.getElement();
          if (markerElement) {
            const priceDiv = markerElement.querySelector('.price-marker');
            if (priceDiv) {
              priceDiv.addEventListener('click', (e) => {
                console.log('Click DOM:', property.slug || property.id);
                e.stopPropagation();
                window.location.href = `/terreno/${property.slug || property.id}`;
              });
            }
          }
        }, 100);

        // Hover eventos - SOLO cambiar clase CSS, NO recrear el ícono
        marker.on('mouseover', () => {
          onMarkerHover?.(property.id);
          const markerElement = marker.getElement();
          if (markerElement) {
            const priceDiv = markerElement.querySelector('.price-marker');
            if (priceDiv) {
              priceDiv.classList.add('active');
            }
          }
        });

        marker.on('mouseout', () => {
          if (hoveredPropertyId !== property.id) {
            onMarkerHover?.(null);
            const markerElement = marker.getElement();
            if (markerElement) {
              const priceDiv = markerElement.querySelector('.price-marker');
              if (priceDiv) {
                priceDiv.classList.remove('active');
              }
            }
          }
        });

        markersRef.current[property.id] = marker;
      });

      // Ajustar vista si hay múltiples propiedades
      if (validProperties.length > 1) {
        const bounds = L.latLngBounds(
          validProperties.map((p) => [p.latitude, p.longitude]),
        );
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else if (validProperties.length === 1) {
        mapRef.current.setView(
          [validProperties[0].latitude, validProperties[0].longitude],
          13,
        );
      }
    };

    updateMarkers();
  }, [properties, isMapReady]);

  // Actualizar marcador cuando hay hover desde la lista - SOLO cambiar clase CSS
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    Object.keys(markersRef.current).forEach((propertyId) => {
      const marker = markersRef.current[propertyId];
      const markerElement = marker.getElement();
      if (markerElement) {
        const priceDiv = markerElement.querySelector('.price-marker');
        if (priceDiv) {
          if (propertyId === hoveredPropertyId) {
            priceDiv.classList.add('active');
          } else {
            priceDiv.classList.remove('active');
          }
        }
      }
    });
  }, [hoveredPropertyId]);

  return (
    <div className="relative w-full h-full">
      <div id="property-map" className="w-full h-full"></div>
    </div>
  );
}

// ====================================
// HELPER FUNCTIONS
// ====================================

function formatPrice(price) {
  if (!price) return '$0';

  // Convertir a número si es string
  const numPrice =
    typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;

  // Formatear con comas y agregar MXN
  return `$${numPrice.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`;
}

function createPriceMarkerHTML(price, isActive, propertyId) {
  return `
    <div class="price-marker ${isActive ? 'active' : ''}"
         style="cursor: pointer; pointer-events: auto;"
         data-property-id="${propertyId}">
      <span class="price-text" style="pointer-events: none;">${price}</span>
    </div>
  `;
}
