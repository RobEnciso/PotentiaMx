'use client';

import React from 'react';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import ContactFormModal from '@/components/ContactFormModal';
import { getPolygonsByPanorama } from '@/lib/polygonsService';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

// ⚡ Import condicional de PlanPlugin (solo en cliente)
// Usamos dynamic import dentro del componente para evitar errores de SSR
let PlanPlugin = null;

function PhotoSphereViewer({
  images,
  terreno,
  hotspots,
  currentUser,
  isEmbedMode = false,
  onSceneChange,
  analytics,
}) {
  // Obtener estilo de marcador desde terreno (default: 'apple')
  const markerStyle = terreno?.marker_style || 'apple';

  // Generar estilos CSS dinámicamente según el tipo seleccionado
  const getMarkerStyles = () => {
    const styles = {
      apple: `
        .public-marker {
          background: rgba(255, 255, 255, 0.92);
          color: #1d1d1f;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), 0 0 0 0 rgba(0, 0, 0, 0.04);
          border: 0.5px solid rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0;
          animation: fadeInMarker 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     pulseGlow 3s ease-in-out 0.6s infinite;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px) saturate(180%);
          position: relative;
          overflow: visible;
          letter-spacing: -0.01em;
        }
        .public-marker::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          background: #007aff;
          border-radius: 50%;
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        .public-marker span {
          margin-left: 6px;
        }
        .public-marker:hover {
          background: rgba(255, 255, 255, 0.98);
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(0, 122, 255, 0.12);
          border-color: rgba(0, 122, 255, 0.2);
        }
        .public-marker:hover::before {
          background: #0051d5;
          box-shadow: 0 0 8px rgba(0, 122, 255, 0.6);
          transform: translateY(-50%) scale(1.3);
        }
        .public-marker:active {
          transform: scale(1.02) translateY(-1px);
          background: rgba(245, 245, 247, 0.95);
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), 0 0 0 0 rgba(0, 122, 255, 0.04); }
          50% { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14), 0 0 0 2px rgba(0, 122, 255, 0.08); }
        }
      `,
      android: `
        .public-marker {
          background: #1976d2;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.24), 0 4px 8px rgba(0, 0, 0, 0.16);
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: fadeInMarker 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     pulseGlow 3s ease-in-out 0.6s infinite;
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: visible;
          text-transform: none;
          letter-spacing: 0.25px;
        }
        .public-marker::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          opacity: 0.9;
          transition: all 0.28s ease;
        }
        .public-marker span {
          margin-left: 8px;
        }
        .public-marker:hover {
          background: #1565c0;
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .public-marker:hover::before {
          transform: translateY(-50%) scale(1.4);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }
        .public-marker:active {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.24);
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.24), 0 4px 8px rgba(0, 0, 0, 0.16); }
          50% { box-shadow: 0 4px 8px rgba(25, 118, 210, 0.4), 0 6px 12px rgba(25, 118, 210, 0.3); }
        }
      `,
      classic: `
        .public-marker {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 10px 18px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0.7);
          border: 2.5px solid rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: fadeInMarker 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     pulseGlow 3s ease-in-out 0.6s infinite;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }
        .public-marker::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .public-marker:hover {
          transform: scale(1.15) translateY(-4px);
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.6), 0 0 0 8px rgba(16, 185, 129, 0.2);
          border-color: white;
          filter: brightness(1.1);
        }
        .public-marker:hover::before {
          opacity: 1;
        }
        .public-marker:active {
          transform: scale(1.05) translateY(-2px);
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0.7); }
          50% { box-shadow: 0 4px 25px rgba(16, 185, 129, 0.6), 0 0 0 4px rgba(16, 185, 129, 0.3); }
        }
      `,
    };

    return (
      styles[markerStyle] ||
      styles.apple + `
        @keyframes fadeInMarker {
          0% { opacity: 0; transform: scale(0.5) translateY(30px); }
          60% { opacity: 1; transform: scale(1.1) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `
    );
  };

  const containerRef = useRef(null);
    const isMountedRef = useRef(false); // Flag para evitar doble inicialización
  const viewerRef = useRef(null);
  const markersPluginRef = useRef(null);
  // ✅ NUEVO: Ref para hotspots (evita recrear initializeViewer cuando cambian)
  const hotspotsRef = useRef(hotspots);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewerReady, setIsViewerReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadedPanoramaIndex, setLoadedPanoramaIndex] = useState(-1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [markersVisible, setMarkersVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransitionLoader, setShowTransitionLoader] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState(null); // { type, data }
  const hideControlsTimeoutRef = useRef(null);
  const transitionLoaderTimeoutRef = useRef(null);
  const preloadedImagesRef = useRef(new Set());

  // ✅ LOCK de transición: Evita race conditions entre useEffect y setPanorama
  const isTransitioningRef = useRef(false);

  // ✅ Referencias de audio por vista
  const ambientAudioRef = useRef(null);
  const narrationAudioRef = useRef(null);

  // ✅ Actualizar hotspotsRef cuando cambian los hotspots (sin recrear initializeViewer)
  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // Emails de administradores (mismo array que en dashboard)
  const ADMIN_EMAILS = [
    'admin@potentiamx.com', // Admin principal
    'victor.admin@potentiamx.com', // Admin secundario (futuro)
  ];

  // Verificar si el usuario actual es el dueño del terreno O es admin
  const isOwner = currentUser && terreno && currentUser.id === terreno.user_id;
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);
  const shouldGoToDashboard = isOwner || isAdmin;

  const backLink = shouldGoToDashboard ? '/dashboard' : '/propiedades';
  const backText = shouldGoToDashboard
    ? '← Volver al Dashboard'
    : '← Volver a Propiedades';

  // Configuración de contacto
  const contactType = terreno?.contact_type || 'casual';
  const showWhatsApp = contactType === 'casual' || contactType === 'both';
  const showEmailForm = contactType === 'formal' || contactType === 'both';
  const whatsappNumber = terreno?.contact_phone || '523221234567';
  const contactEmail = terreno?.contact_email || 'info@potentia.mx';

  // Función para compartir
  const handleShare = () => {
    if (navigator.clipboard && window.location.href) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 2000);
      analytics?.trackShare();
    }
  };

  // ✅ OPTIMIZADO: Pre-carga INTELIGENTE - Solo imágenes adyacentes
  useEffect(() => {
    if (!images || !isViewerReady) return;

    const imagesToPreload = [];

    // Pre-cargar siguiente imagen
    if (currentIndex < images.length - 1) {
      imagesToPreload.push(images[currentIndex + 1]);
    }

    // Pre-cargar imagen anterior
    if (currentIndex > 0) {
      imagesToPreload.push(images[currentIndex - 1]);
    }

    imagesToPreload.forEach((imageUrl) => {
      if (!imageUrl || preloadedImagesRef.current.has(imageUrl)) return;

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        preloadedImagesRef.current.add(imageUrl);
      };
    });
  }, [images, isViewerReady, currentIndex]);

  // ✅ Reproducir audio de fondo automáticamente al cambiar de vista
  useEffect(() => {
    if (!terreno || !isViewerReady) return;

    // Extraer datos de audio
    const ambientUrls = terreno.view_ambient_audio || [];
    const ambientVolumes = terreno.view_ambient_volume || [];
    const narrationUrls = terreno.view_narration_audio || [];
    const narrationVolumes = terreno.view_narration_volume || [];
    const autoplaySettings = terreno.view_audio_autoplay || [];

    // Verificar si hay audio para la vista actual
    const ambientUrl = ambientUrls[currentIndex];
    const narrationUrl = narrationUrls[currentIndex];
    const shouldAutoplay = autoplaySettings[currentIndex] !== false;

    if (!shouldAutoplay) {
      console.log(`🔇 Audio deshabilitado para vista ${currentIndex}`);
      return;
    }

    // Detener y limpiar audios anteriores
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.currentTime = 0;
      ambientAudioRef.current = null;
    }
    if (narrationAudioRef.current) {
      narrationAudioRef.current.pause();
      narrationAudioRef.current.currentTime = 0;
      narrationAudioRef.current = null;
    }

    // ✅ DELAY: Esperar 2s para que el panorama cargue, luego fade-in de 1s
    const AUDIO_DELAY = 2000; // 2 segundos de delay
    const FADE_DURATION = 1000; // 1 segundo de fade-in

    // Reproducir audio ambiente (loop) con delay + fade-in
    if (ambientUrl) {
      const targetVolume = ambientVolumes[currentIndex] || 0.3;
      const ambientAudio = new Audio(ambientUrl);
      ambientAudio.loop = true;
      ambientAudio.volume = 0; // Empezar en silencio

      // ✅ Preparar audio para móvil (cargar sin reproducir)
      ambientAudio.preload = 'auto';

      // Esperar 2s, luego reproducir con fade-in
      setTimeout(() => {
        // ✅ Intentar reproducir (puede fallar en móvil sin interacción)
        const playPromise = ambientAudio.play();

        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log(`🎵 Audio ambiente reproducido con fade-in: ${ambientUrl}`);

            // Fade-in gradual durante 1 segundo
            const fadeSteps = 20; // 20 pasos
            const fadeInterval = FADE_DURATION / fadeSteps; // 50ms por paso
            const volumeStep = targetVolume / fadeSteps;
            let currentStep = 0;

            const fadeInInterval = setInterval(() => {
              currentStep++;
              ambientAudio.volume = Math.min(volumeStep * currentStep, targetVolume);

              if (currentStep >= fadeSteps) {
                clearInterval(fadeInInterval);
                console.log(`✅ Fade-in completado al ${(targetVolume * 100).toFixed(0)}%`);
              }
            }, fadeInterval);
          }).catch((error) => {
            console.warn('⚠️ No se pudo reproducir audio ambiente automáticamente:', error);
            console.log('💡 En móvil, el audio se reproducirá al tocar la pantalla');

            // ✅ FALLBACK MÓVIL: Reproducir en el primer toque/click
            const playOnInteraction = () => {
              ambientAudio.play().then(() => {
                console.log(`🎵 Audio iniciado tras interacción del usuario`);

                // Fade-in después de la interacción
                const fadeSteps = 20;
                const fadeInterval = FADE_DURATION / fadeSteps;
                const volumeStep = targetVolume / fadeSteps;
                let currentStep = 0;

                const fadeInInterval = setInterval(() => {
                  currentStep++;
                  ambientAudio.volume = Math.min(volumeStep * currentStep, targetVolume);

                  if (currentStep >= fadeSteps) {
                    clearInterval(fadeInInterval);
                  }
                }, fadeInterval);
              });

              // Remover listeners después del primer toque
              document.removeEventListener('touchstart', playOnInteraction);
              document.removeEventListener('click', playOnInteraction);
            };

            document.addEventListener('touchstart', playOnInteraction, { once: true });
            document.addEventListener('click', playOnInteraction, { once: true });
          });
        }
      }, AUDIO_DELAY);

      ambientAudioRef.current = ambientAudio;
    }

    // Reproducir narración (una sola vez) con delay + fade-in
    if (narrationUrl) {
      const targetVolume = narrationVolumes[currentIndex] || 0.7;
      const narrationAudio = new Audio(narrationUrl);
      narrationAudio.loop = false;
      narrationAudio.volume = 0; // Empezar en silencio

      // ✅ Preparar audio para móvil
      narrationAudio.preload = 'auto';

      // Esperar 2s, luego reproducir con fade-in
      setTimeout(() => {
        const playPromise = narrationAudio.play();

        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log(`🗣️ Narración reproducida con fade-in: ${narrationUrl}`);

            // Fade-in gradual durante 1 segundo
            const fadeSteps = 20;
            const fadeInterval = FADE_DURATION / fadeSteps;
            const volumeStep = targetVolume / fadeSteps;
            let currentStep = 0;

            const fadeInInterval = setInterval(() => {
              currentStep++;
              narrationAudio.volume = Math.min(volumeStep * currentStep, targetVolume);

              if (currentStep >= fadeSteps) {
                clearInterval(fadeInInterval);
                console.log(`✅ Fade-in narración completado al ${(targetVolume * 100).toFixed(0)}%`);
              }
            }, fadeInterval);
          }).catch((error) => {
            console.warn('⚠️ No se pudo reproducir narración automáticamente:', error);

            // ✅ FALLBACK MÓVIL: Reproducir en el primer toque
            const playOnInteraction = () => {
              narrationAudio.play().then(() => {
                console.log(`🗣️ Narración iniciada tras interacción del usuario`);

                const fadeSteps = 20;
                const fadeInterval = FADE_DURATION / fadeSteps;
                const volumeStep = targetVolume / fadeSteps;
                let currentStep = 0;

                const fadeInInterval = setInterval(() => {
                  currentStep++;
                  narrationAudio.volume = Math.min(volumeStep * currentStep, targetVolume);

                  if (currentStep >= fadeSteps) {
                    clearInterval(fadeInInterval);
                  }
                }, fadeInterval);
              });

              document.removeEventListener('touchstart', playOnInteraction);
              document.removeEventListener('click', playOnInteraction);
            };

            document.addEventListener('touchstart', playOnInteraction, { once: true });
            document.addEventListener('click', playOnInteraction, { once: true });
          });
        }
      }, AUDIO_DELAY);

      narrationAudioRef.current = narrationAudio;
    }

    // Cleanup al desmontar o cambiar de vista
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current = null;
      }
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
        narrationAudioRef.current = null;
      }
    };
  }, [currentIndex, terreno, isViewerReady]);

  // ========================================================================
  // ✅ CARGAR POLÍGONOS GUARDADOS AL CAMBIAR DE VISTA
  // ========================================================================
  useEffect(() => {
    async function loadPolygons() {
      if (!markersPluginRef.current || !terreno?.id || !isViewerReady) return;

      console.log(`🔷 [Viewer Público] Cargando polígonos para vista ${currentIndex}...`);

      // Limpiar polígonos anteriores
      const currentMarkers = markersPluginRef.current.getMarkers();
      currentMarkers.forEach((marker) => {
        if (marker.id?.toString().startsWith('saved-polygon-')) {
          markersPluginRef.current.removeMarker(marker.id);
        }
      });

      // Cargar polígonos de la vista actual desde la BD
      const { data, error } = await getPolygonsByPanorama(terreno.id, currentIndex);

      if (error) {
        console.error('❌ [Viewer Público] Error al cargar polígonos:', error);
        return;
      }

      if (!data || data.length === 0) {
        console.log(`📭 [Viewer Público] No hay polígonos guardados para vista ${currentIndex}`);
        return;
      }

      console.log(`✅ [Viewer Público] ${data.length} polígonos cargados para vista ${currentIndex}`);

      // Renderizar cada polígono
      data.forEach((polygon) => {
        try {
          // Convertir fill_opacity a hex alpha (0.0-1.0 → 00-FF)
          const alphaHex = Math.floor(polygon.fill_opacity * 255)
            .toString(16)
            .padStart(2, '0');

          markersPluginRef.current.addMarker({
            id: `saved-polygon-${polygon.id}`,
            polygon: polygon.points,
            svgStyle: {
              fill: `${polygon.color}${alphaHex}`,
              stroke: polygon.color,
              strokeWidth: `${polygon.stroke_width}px`,
              strokeDasharray: '10 5',
              filter: `drop-shadow(0 0 8px ${polygon.color})`,
            },
            tooltip: polygon.name ? {
              content: `🏗️ ${polygon.name}`,
              position: 'bottom center',
            } : undefined,
            data: {
              type: 'boundary',
              description: polygon.description || 'Límite del terreno',
              dbId: polygon.id,
            },
          });

          console.log(`  ✓ Polígono renderizado: ${polygon.name || 'Sin nombre'} (ID: ${polygon.id})`);
        } catch (renderError) {
          console.error(`❌ Error al renderizar polígono ${polygon.id}:`, renderError);
        }
      });
    }

    if (isViewerReady) {
      loadPolygons();
    }
  }, [isViewerReady, currentIndex, terreno?.id]);

  // ========================================================================
  // ✅ EFECTO A (MOUNT) - Solo se ejecuta UNA VEZ al montar
  // ========================================================================
  useEffect(() => {
    // 🔒 GUARD DEFINITIVO: Prevenir doble inicialización
    if (isMountedRef.current || viewerRef.current) {
      return;
    }

    if (!containerRef.current || !images || images.length === 0) {
      return;
    }

    const validImages = images.filter(
      (url) => url && typeof url === 'string' && url.trim() !== '',
    );
    if (validImages.length === 0) {
      setError('No se encontraron URLs de imágenes válidas');
      setLoading(false);
      return;
    }

    // A. Limpieza inicial del DOM
    containerRef.current.innerHTML = '';

    // B. Marcar como montado INMEDIATAMENTE (antes de async)
    // 🔒 CRÍTICO: Prevenir que React StrictMode cree segundo viewer
    isMountedRef.current = true;

    setLoading(true);
    setError(null);

    // ⚡ Cargar PlanPlugin dinámicamente (solo en cliente)
    const initViewer = async () => {
      // Cargar PlanPlugin si no está cargado
      if (!PlanPlugin && typeof window !== 'undefined') {
        try {
          const planModule = await import('@photo-sphere-viewer/plan-plugin');
          PlanPlugin = planModule.PlanPlugin;
          // Cargar CSS dinámicamente
          await import('@photo-sphere-viewer/plan-plugin/index.css');
          await import('leaflet/dist/leaflet.css');
        } catch (err) {
          console.warn('⚠️ No se pudo cargar PlanPlugin:', err);
        }
      }

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: validImages[0], // ✅ Imagen inicial (índice 0)
      loadingImg: null,
      plugins: [
        [MarkersPlugin, {}],
        // ⚡ Solo agregar PlanPlugin si está disponible (client-side only)
        ...(PlanPlugin ? [
          [
            PlanPlugin,
            {
            // 🗺️ Coordenadas GPS del terreno [longitude, latitude]
            coordinates: (() => {
              const lat = terreno?.latitude || 19.432608;
              const lng = terreno?.longitude || -99.133209;
              // ⚡ IMPORTANTE: PlanPlugin usa [longitude, latitude] (orden inverso!)
              return [lng, lat];
            })(),
            bearing: 0, // Rotación inicial del mapa
            // Opciones visuales del minimapa
            position: 'bottom left',
            size: { width: '300px', height: '300px' }, // Tamaño del mapa
            visibleOnLoad: true,
            defaultZoom: 14,
            // 🎯 Personalización del cono de dirección
            spotStyle: {
              size: 20, // Tamaño del punto central (más grande = más visible)
              image: null, // null = usar cono por defecto
              color: '#00ffff', // Color cian brillante (Tron style)
              hoverColor: '#00ff00', // Verde al hacer hover
              shadowColor: 'rgba(0, 255, 255, 0.5)', // Sombra con glow
              shadowBlur: 15, // Difuminado de la sombra (efecto glow)
            },
            // Configuración de tiles de OpenStreetMap
            layers: [
              {
                name: 'OpenStreetMap',
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors',
              },
            ],
          },
          ]
        ] : []), // Cierre del spread condicional de PlanPlugin
      ],
      navbar: false,
      defaultZoomLvl: 50,
      mousewheel: true,
      mousemove: true,
      moveSpeed: 2.0,
    });

    // C. Guardar referencias (flag ya está en true desde línea 529)
    viewerRef.current = viewer;
    markersPluginRef.current = viewer.getPlugin(MarkersPlugin);

    // ✅ Configurar PlanPlugin si está disponible
    if (PlanPlugin) {
      try {
        viewer.getPlugin(PlanPlugin);
      } catch (err) {
        console.error('❌ [PlanPlugin] Error al obtener plugin:', err);
      }
    }

    // D. Event listener 'ready'
    viewer.addEventListener('ready', () => {
      setLoading(false);
      setIsViewerReady(true);
      setIsInitialized(true);
      setLoadedPanoramaIndex(0);
      setTimeout(() => {
        setMarkersVisible(true);
      }, 300);

      // ⚡ Sincronizar bearing del mapa con la orientación de la cámara
      if (PlanPlugin) {
        try {
          const planPlugin = viewer.getPlugin(PlanPlugin);
          const updateMapBearing = () => {
            const position = viewer.getPosition();
            // Convertir yaw de radianes a grados
            // yaw = 0 apunta al norte, positivo hacia el este
            let bearingDegrees = (position.yaw * 180 / Math.PI);

            // Normalizar a rango 0-360
            bearingDegrees = ((bearingDegrees % 360) + 360) % 360;

            planPlugin.setBearing(bearingDegrees);
          };

          // Actualizar bearing inicial
          updateMapBearing();

          // Actualizar bearing cuando el usuario gira la cámara
          viewer.addEventListener('position-updated', updateMapBearing);
        } catch (err) {
          console.warn('⚠️ No se pudo sincronizar bearing del mapa:', err);
        }
      }
    });

    // E. Event listener 'panorama-load-error'
    viewer.addEventListener('panorama-load-error', (e) => {
      console.error('❌ [MOUNT] Error al cargar panorama:', e);
      setError('Error al cargar la imagen: ' + e.error);
      setLoading(false);
    });

    // F. Event listener 'select-marker' (clicks en hotspots)
    markersPluginRef.current.addEventListener('select-marker', (e) => {
      const clickedMarker = e.marker;
      if (!clickedMarker) return;

      const currentHotspots = hotspotsRef.current || [];
      const hotspot = currentHotspots.find(
        (h) => String(h.id) === String(clickedMarker.id),
      );

      if (!hotspot) return;

      const hotspotType = hotspot.type || 'navigation';

      // Track hotspot click
      if (analytics?.trackHotspotClick) {
        analytics.trackHotspotClick(
          String(hotspot.id),
          hotspot.title || 'Sin título',
          hotspotType
        );
      }

      // Solo navegar si es tipo 'navigation' y tiene targetImageIndex
      if (hotspotType === 'navigation' && hotspot.targetImageIndex !== undefined) {
        setCurrentIndex(hotspot.targetImageIndex);
      } else if (hotspotType !== 'navigation') {
        setActiveMediaModal({ type: hotspotType, data: hotspot });
      }
    });
    }; // Fin de initViewer

    // Llamar a la función async
    initViewer();

    // G. Cleanup
    return () => {
      // ⚠️ CRÍTICO: NO resetear isMountedRef.current
      // Si lo reseteamos, React StrictMode puede remontar y crear viewer duplicado

      // Solo destruir el viewer si realmente existe
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
          viewerRef.current = null;
          markersPluginRef.current = null;
        } catch (err) {
          console.warn('⚠️ Error al destruir viewer en cleanup:', err);
        }
      }
    };
  }, []); // ✅ Array vacío = Solo se ejecuta UNA VEZ al montar el componente

  // ========================================================================
  // ✅ EFECTO B (UPDATE) - Se ejecuta cuando cambia currentIndex
  // ========================================================================
  useEffect(() => {
    const viewer = viewerRef.current;
    const markersPlugin = markersPluginRef.current;

    // Validaciones: Solo ejecutar si el viewer está listo
    // 🛡️ GUARD CRÍTICO: Si el viewer no existe, abortar inmediatamente
    if (!viewerRef.current) {
      return;
    }

    if (!viewer || !markersPlugin || !isViewerReady || !images) {
      return;
    }

    const validImages = images.filter(
      (url) => url && typeof url === 'string' && url.trim() !== '',
    );

    if (validImages.length === 0 || currentIndex < 0 || currentIndex >= validImages.length) {
      return;
    }

    // ✅ LOCK: Prevenir transiciones concurrentes
    if (isTransitioningRef.current) {
      return;
    }

    // Si ya estamos en la escena correcta, solo actualizar markers
    if (currentIndex === loadedPanoramaIndex) {
      updateMarkersForCurrentScene();
      return;
    }

    // Activar lock
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setMarkersVisible(false);

    // Mostrar loader si la carga tarda más de 800ms
    if (transitionLoaderTimeoutRef.current) {
      clearTimeout(transitionLoaderTimeoutRef.current);
    }
    transitionLoaderTimeoutRef.current = setTimeout(() => {
      setShowTransitionLoader(true);
    }, 800);

    // PASO 1: Cambiar panorama
    viewer
      .setPanorama(validImages[currentIndex], {
        transition: 400,
        showLoader: false,
        zoom: viewer.getZoomLevel(),
      })
      .then(() => {
        // Desbloquear y actualizar estado
        isTransitioningRef.current = false;
        setLoadedPanoramaIndex(currentIndex);
        setIsTransitioning(false);
        setShowTransitionLoader(false);

        if (transitionLoaderTimeoutRef.current) {
          clearTimeout(transitionLoaderTimeoutRef.current);
        }

        // PASO 2: Actualizar markers multimedia
        updateMarkersForCurrentScene();

        setTimeout(() => {
          setMarkersVisible(true);
        }, 200);

        // Analytics (Fire & Forget)
        try {
          if (onSceneChange) {
            onSceneChange(currentIndex);
          }
        } catch (analyticsError) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Analytics] Error:', analyticsError);
          }
        }
      })
      .catch((err) => {
        console.warn(`⚠️ [UPDATE] Error al cargar imagen:`, err.message);

        // Mantener loader visible durante retry
        if (!showTransitionLoader) {
          setShowTransitionLoader(true);
        }

        // Retry después de 500ms
        setTimeout(() => {
          if (!viewer) {
            console.error('❌ [UPDATE] Viewer no disponible en retry');
            isTransitioningRef.current = false;
            return;
          }

          viewer
            .setPanorama(validImages[currentIndex], {
              transition: 200,
              showLoader: false,
              zoom: viewer.getZoomLevel(),
            })
            .then(() => {
              isTransitioningRef.current = false;
              setLoadedPanoramaIndex(currentIndex);
              setIsTransitioning(false);
              setShowTransitionLoader(false);

              updateMarkersForCurrentScene();

              setTimeout(() => setMarkersVisible(true), 200);

              try {
                if (onSceneChange) onSceneChange(currentIndex);
              } catch (e) {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('[Analytics] Error en retry:', e);
                }
              }
            })
            .catch((retryErr) => {
              console.error('❌ [UPDATE] Retry falló:', retryErr.message);
              isTransitioningRef.current = false;
              setIsTransitioning(false);
              setShowTransitionLoader(false);
              setMarkersVisible(true);
              setError('Error de conexión. Por favor, recarga la página.');
            });
        }, 500);
      });

    // ✅ FUNCIÓN AUXILIAR: Actualizar markers para la escena actual
    function updateMarkersForCurrentScene() {
      const markersPlugin = markersPluginRef.current;
      if (!markersPlugin) return;

      // Limpiar markers anteriores
      markersPlugin.clearMarkers();

      // ⚠️ Solo verificar hotspots, NO markersVisible (se maneja con CSS opacity)
      if (!hotspots || hotspots.length === 0) {
        return;
      }

      // Filtrar hotspots de la escena actual
      const currentHotspots = hotspots.filter(
        (h) => h.imageIndex === currentIndex,
      );

      // Iconos predeterminados por tipo
      const defaultIcons = {
        navigation: '🧭',
        info: 'ℹ️',
        image: '🖼️',
        video: '🎥',
        audio: '🔊',
      };

      currentHotspots.forEach((hotspot) => {
        const hotspotType = hotspot.type || 'navigation';
        const icon = defaultIcons[hotspotType] || '📍';

        // Tooltip diferente según tipo
        let tooltip = '';
        if (hotspotType === 'navigation') {
          tooltip = `Ir a: ${hotspot.title}`;
        } else if (hotspotType === 'info') {
          tooltip = `Ver información: ${hotspot.title}`;
        } else if (hotspotType === 'image') {
          tooltip = `Ver galería: ${hotspot.title}`;
        } else if (hotspotType === 'video') {
          tooltip = `Reproducir video: ${hotspot.title}`;
        } else if (hotspotType === 'audio') {
          tooltip = `Reproducir audio: ${hotspot.title}`;
        }

        // Diferenciar estilo entre navegación y multimedia
        let markerHtml;
        if (hotspotType === 'navigation') {
          // Marcador completo con etiqueta para navegación
          markerHtml = `<div class="public-marker">${icon} <span>${hotspot.title}</span></div>`;
        } else {
          // Solo icono grande para multimedia (punto de interés fijo)
          markerHtml = `<div class="multimedia-marker" title="${hotspot.title}">${icon}</div>`;
        }

        markersPlugin.addMarker({
          id: String(hotspot.id),
          position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
          html: markerHtml,
          tooltip: tooltip,
        });
      });

      // ✅ Los polígonos guardados se cargan desde la BD mediante el useEffect separado
      // Ver líneas 506-574: useEffect que carga polígonos con getPolygonsByPanorama()
    }
  }, [currentIndex, isViewerReady, hotspots, images]); // ✅ Depende de currentIndex, isViewerReady, hotspots e images

  // Auto-hide de controles estilo YouTube (instantáneo)
  const showControls = useCallback(() => {
    setControlsVisible(true);

    // Limpiar timeout anterior
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    // Ocultar después de 2 segundos de inactividad (más rápido, estilo YouTube)
    hideControlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2000);
  }, []);

  // ✅ OPTIMIZADO: Consolidar gestión de controles en un solo useEffect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleInteraction = () => showControls();

    // Event listeners para el contenedor
    container.addEventListener('click', handleInteraction);
    container.addEventListener('touchstart', handleInteraction);

    // Event listeners para elementos de control
    const controlElements = document.querySelectorAll(
      '.viewer-controls, .nav-button, .info-button',
    );

    controlElements.forEach((element) => {
      element.addEventListener('mouseenter', handleInteraction);
    });

    // Mostrar controles al inicio o cuando está cargando
    showControls();

    return () => {
      container.removeEventListener('click', handleInteraction);
      container.removeEventListener('touchstart', handleInteraction);

      controlElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleInteraction);
      });

      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [showControls, loading]);

  // Si no hay imágenes válidas, mostrar mensaje de error
  if (!images || images.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'black',
          color: 'white',
          flexDirection: 'column',
        }}
      >
        <h2>⚠️ No hay imágenes disponibles</h2>
        <p>Este terreno no tiene imágenes 360° para mostrar.</p>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        >
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        ${getMarkerStyles()}

        /* Estilos para hotspots multimedia (solo icono, sin etiqueta) */
        .multimedia-marker {
          background: rgba(255, 255, 255, 0.95);
          color: #1d1d1f;
          padding: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(255, 255, 255, 0.3);
          border: 2px solid rgba(0, 122, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          animation: fadeInMarker 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .multimedia-marker:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 0 0 6px rgba(0, 122, 255, 0.2);
          border-color: rgba(0, 122, 255, 0.6);
          background: rgba(255, 255, 255, 1);
        }

        @keyframes fadeInMarker {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(30px);
          }
          60% {
            opacity: 1;
            transform: scale(1.1) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .psv-loader-container { display: none !important; }

        /* ✅ Estilos para PlanPlugin (minimapa GPS) */
        .psv-plan {
          z-index: 100 !important;
          pointer-events: auto !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        .psv-plan-container {
          background: rgba(0, 0, 0, 0.7) !important;
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        /* Asegurar que Leaflet sea visible */
        .leaflet-container {
          z-index: 1 !important;
        }

        /* ✅ POLÍGONOS SVG - Visibilidad sin clipping */
        .psv-canvas-container {
          overflow: visible !important;
        }
        .psv-markers-svg-container {
          overflow: visible !important;
          pointer-events: none !important;
        }
        .psv-markers-svg-container svg {
          overflow: visible !important;
          pointer-events: none !important;
        }
        .psv-markers-svg-container polygon {
          pointer-events: auto !important;
          vector-effect: non-scaling-stroke !important;
        }
        .psv-marker {
          pointer-events: auto !important;
        }
      `}</style>

<div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: 'black',
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
              zIndex: 100,
            }}
          >
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div
                style={{
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  borderTopColor: 'white',
                  animation: 'spin 1s ease-in-out infinite',
                }}
              ></div>
              <p style={{ marginTop: '1rem' }}>Cargando...</p>
            </div>
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Indicador sutil para transiciones largas */}
        {showTransitionLoader && !loading && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '10px 16px',
              borderRadius: '25px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 90,
              backdropFilter: 'blur(10px)',
              animation: 'fadeIn 0.3s ease-in',
            }}
          >
            <div
              style={{
                border: '2px solid rgba(255, 255, 255, 0.3)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                borderTopColor: 'white',
                animation: 'spin 0.8s linear infinite',
              }}
            ></div>
            <span>Cargando vista...</span>
          </div>
        )}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>

        {error && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
            }}
          >
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        )}

        {/* Logo en esquina superior izquierda - Oculto en modo embed */}
        {!isEmbedMode && (
          <Link
            href="/"
            className={`absolute top-4 left-4 z-40 transition-opacity duration-300 ${
              !controlsVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '10px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <img
              src="/logo-page-black.png"
              alt="PotentiaMX"
              style={{
                height: '32px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Link>
        )}

        {/* Botón Volver - Oculto en modo embed */}
        {!isEmbedMode && (
          <Link
            href={backLink}
            className={`nav-button left-4 ${!controlsVisible ? 'hidden' : ''}`}
            style={{ top: '70px' }}
          >
            {backText}
          </Link>
        )}

        {/* Botón de Información - Oculto en modo embed */}
        {!isEmbedMode && (
          <button
            onClick={() => {
              const newState = !showInfo;
              setShowInfo(newState);
              if (newState) analytics?.trackInfoView();
            }}
            className={`info-button ${!controlsVisible ? 'hidden' : ''}`}
            title="Información del terreno"
            style={{ right: '16px' }}
          >
            ℹ️
          </button>
        )}

        {/* Botón de Compartir - Oculto en modo embed */}
        {!isEmbedMode && (
          <button
            onClick={handleShare}
            className={`info-button ${!controlsVisible ? 'hidden' : ''}`}
            title="Compartir tour"
            style={{ right: '72px' }}
          >
            {showCopyTooltip ? (
              <span style={{ fontSize: '14px' }}>✓</span>
            ) : (
              <span style={{ fontSize: '14px' }}>📤</span>
            )}
          </button>
        )}

        {!isEmbedMode && showCopyTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '70px',
              right: '72px',
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              zIndex: 50,
              whiteSpace: 'nowrap',
            }}
          >
            ¡Link copiado!
          </div>
        )}

        {!isEmbedMode && showInfo && (
          <>
            {/* Backdrop/Overlay para cerrar al hacer click fuera */}
            <div
              onClick={() => setShowInfo(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'transparent',
                zIndex: 98,
                cursor: 'pointer',
              }}
            />
            <div className="info-panel" onClick={(e) => e.stopPropagation()}>
              <h3>{terreno?.title || 'Información del Terreno'}</h3>
              {terreno?.description && (
                <>
                  <div className="info-label">Descripción</div>
                  <p>{terreno.description}</p>
                </>
              )}
              {terreno?.property_type && (
                <>
                  <div className="info-label">Tipo de Propiedad</div>
                  <p>
                    {terreno.property_type === 'terreno' && '🏞️ Terreno'}
                    {terreno.property_type === 'casa' && '🏡 Casa'}
                    {terreno.property_type === 'departamento' &&
                      '🏢 Departamento'}
                  </p>
                </>
              )}
              {terreno?.property_type === 'terreno' &&
                terreno?.land_category && (
                  <>
                    <div className="info-label">Categoría</div>
                    <p>
                      {terreno.land_category === 'residencia' &&
                        'Terreno para Residencia'}
                      {terreno.land_category === 'desarrollo' &&
                        'Terreno para Desarrollo'}
                      {terreno.land_category === 'proyecto' &&
                        'Terreno para Proyecto'}
                    </p>
                  </>
                )}
              {terreno?.property_type === 'terreno' &&
                (terreno?.land_category === 'desarrollo' ||
                  terreno?.land_category === 'proyecto') &&
                terreno?.available_for_contribution && (
                  <>
                    <div className="info-label">Modalidad</div>
                    <p
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                      }}
                    >
                      ✅ Disponible en Aportación para Proyecto
                    </p>
                  </>
                )}
              {terreno?.land_use && (
                <>
                  <div className="info-label">Uso de suelo</div>
                  <p>{terreno.land_use}</p>
                </>
              )}
              {terreno?.total_square_meters && (
                <>
                  <div className="info-label">Superficie</div>
                  <p>{terreno.total_square_meters} m²</p>
                </>
              )}
              {terreno?.sale_price && (
                <>
                  <div className="info-label">Precio</div>
                  <p>${terreno.sale_price.toLocaleString('es-MX')}</p>
                </>
              )}
              {terreno?.front_measures && (
                <>
                  <div className="info-label">Medidas de frente</div>
                  <p>{terreno.front_measures}</p>
                </>
              )}
              {terreno?.depth_measures && (
                <>
                  <div className="info-label">Profundidad</div>
                  <p>{terreno.depth_measures}</p>
                </>
              )}

              {/* Call-to-Actions */}
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Botón de WhatsApp - Solo si contact_type es 'casual' o 'both' */}
                  {showWhatsApp && (
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=Hola, me interesa la propiedad: ${encodeURIComponent(terreno?.title || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analytics?.trackContactClick('whatsapp')}
                      style={{
                        display: 'block',
                        padding: '12px 20px',
                        background: '#25D366',
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: '8px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.3s',
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.background = '#22c55e')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.background = '#25D366')
                      }
                    >
                      💬 Consultar por WhatsApp
                    </a>
                  )}

                  {/* Botón de Formulario - Solo si contact_type es 'formal' o 'both' */}
                  {showEmailForm && (
                    <button
                      onClick={() => {
                        analytics?.trackContactClick('email');
                        setShowContactForm(true);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        background:
                          'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: '8px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.background =
                          'linear-gradient(135deg, #0d9488 0%, #0e7490 100%)')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.background =
                          'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)')
                      }
                    >
                      📧 Solicitar Información
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    style={{
                      padding: '12px 20px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.background = 'rgba(255, 255, 255, 0.3)')
                    }
                    onMouseOut={(e) =>
                      (e.target.style.background = 'rgba(255, 255, 255, 0.2)')
                    }
                  >
                    📤 Compartir esta propiedad
                  </button>
                  <Link
                    href={backLink}
                    style={{
                      display: 'block',
                      padding: '12px 20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.background = 'rgba(255, 255, 255, 0.2)')
                    }
                    onMouseOut={(e) =>
                      (e.target.style.background = 'rgba(255, 255, 255, 0.1)')
                    }
                  >
                    {shouldGoToDashboard
                      ? '🏠 Volver al Dashboard'
                      : '🏘️ Ver más propiedades'}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Botones Flotantes de Contacto - Ocultos en modo embed */}
        {!isEmbedMode && (
          <>
            {/* Botón Flotante de WhatsApp - Solo si contact_type es 'casual' o 'both' */}
            {showWhatsApp && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hola, me interesa la propiedad: ${encodeURIComponent(terreno?.title || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics?.trackContactClick('whatsapp')}
                style={{
                  position: 'fixed',
                  bottom: '24px',
                  right: showEmailForm ? '96px' : '24px',
                  width: '60px',
                  height: '60px',
                  background: '#25D366',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                  zIndex: 50,
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 25px rgba(37, 211, 102, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 20px rgba(37, 211, 102, 0.4)';
                }}
                title="Consultar por WhatsApp"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            )}

            {/* Botón Flotante de Formulario - Solo si contact_type es 'formal' o 'both' */}
            {showEmailForm && (
              <button
                onClick={() => {
                  analytics?.trackContactClick('email');
                  setShowContactForm(true);
                }}
                style={{
                  position: 'fixed',
                  bottom: '24px',
                  right: '24px',
                  width: '60px',
                  height: '60px',
                  background:
                    'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4)',
                  zIndex: 50,
                  transition: 'all 0.3s',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 25px rgba(20, 184, 166, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 20px rgba(20, 184, 166, 0.4)';
                }}
                title="Solicitar Información"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </button>
            )}
          </>
        )}

        {images && images.length > 1 && (
          <>
            {/* Dots Navigation - Para 1-6 vistas */}
            {images.length <= 6 && (
              <div
                className={`dots-navigator ${!controlsVisible ? 'hidden' : ''}`}
              >
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`dot ${currentIndex === index ? 'active' : ''}`}
                    aria-label={`Ir a vista ${index + 1}`}
                    title={`Vista ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Navigation - Para 7+ vistas */}
            {images.length > 6 && (
              <div
                className={`thumbnail-navigator ${!controlsVisible ? 'hidden' : ''}`}
              >
                {images.map((imageUrl, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`thumbnail ${currentIndex === index ? 'active' : ''}`}
                    title={`Vista ${index + 1}`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Vista ${index + 1}`}
                      loading="lazy"
                    />
                    <span className="thumbnail-label">Vista {index + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Modals Multimedia */}
        {activeMediaModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: activeMediaModal.type === 'video' ? 'transparent' : 'rgba(0, 0, 0, 0.85)',
              backdropFilter: activeMediaModal.type === 'video' ? 'none' : 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: '1rem',
              animation: 'fadeIn 0.2s ease-out',
              pointerEvents: activeMediaModal.type === 'video' ? 'none' : 'auto',
            }}
            onClick={() => setActiveMediaModal(null)}
          >
            <div
              style={{
                backgroundColor: activeMediaModal.type === 'video' ? 'transparent' : 'white',
                borderRadius: activeMediaModal.type === 'video' ? '16px' : '12px',
                maxWidth: activeMediaModal.type === 'video' ? '700px' : '600px',
                width: '100%',
                maxHeight: activeMediaModal.type === 'video' ? 'auto' : '90vh',
                overflow: 'visible',
                boxShadow: activeMediaModal.type === 'video'
                  ? '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 100px rgba(0, 0, 0, 0.3)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                transform: 'scale(1)',
                animation: 'modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                pointerEvents: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Info Modal */}
              {activeMediaModal.type === 'info' && (
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937', fontWeight: 'bold' }}>
                      ℹ️ {activeMediaModal.data.title}
                    </h2>
                    <button
                      onClick={() => setActiveMediaModal(null)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {activeMediaModal.data.content_text}
                  </p>
                </div>
              )}

              {/* Image Gallery Modal */}
              {activeMediaModal.type === 'image' && (
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937', fontWeight: 'bold' }}>
                      🖼️ {activeMediaModal.data.title}
                    </h2>
                    <button
                      onClick={() => setActiveMediaModal(null)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Descripción de la galería */}
                  {activeMediaModal.data.content_text && (
                    <p style={{
                      color: '#4b5563',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.95rem'
                    }}>
                      {activeMediaModal.data.content_text}
                    </p>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {activeMediaModal.data.content_images?.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                        onClick={() => window.open(url, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Video Modal */}
              {activeMediaModal.type === 'video' && (() => {
                const videoUrl = activeMediaModal.data.content_video_url;
                let embedUrl = videoUrl;
                let isEmbed = false;

                // Convertir YouTube a embed
                if (videoUrl.includes('youtube.com/watch')) {
                  const videoId = new URL(videoUrl).searchParams.get('v');
                  embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                  isEmbed = true;
                } else if (videoUrl.includes('youtu.be/')) {
                  const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
                  embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                  isEmbed = true;
                }
                // Convertir Vimeo a embed
                else if (videoUrl.includes('vimeo.com/')) {
                  const videoId = videoUrl.split('vimeo.com/')[1].split('?')[0];
                  embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
                  isEmbed = true;
                }

                return (
                  <div style={{ position: 'relative' }}>
                    {/* Botón de cerrar flotante */}
                    <button
                      onClick={() => setActiveMediaModal(null)}
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '-12px',
                        background: 'rgba(239, 68, 68, 0.95)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        fontWeight: 'bold',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.95)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ✕
                    </button>

                    {/* Título flotante encima del video */}
                    {activeMediaModal.data.title && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-40px',
                          left: '0',
                          right: '0',
                          textAlign: 'center',
                          zIndex: 5,
                        }}
                      >
                        <span
                          style={{
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                            display: 'inline-block',
                          }}
                        >
                          {activeMediaModal.data.title}
                        </span>
                      </div>
                    )}

                    {/* Video sin padding adicional */}
                    {isEmbed ? (
                      <iframe
                        src={embedUrl}
                        style={{
                          width: '100%',
                          height: '394px',
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        controls
                        autoPlay
                        style={{
                          width: '100%',
                          maxHeight: '394px',
                          borderRadius: '16px',
                          backgroundColor: '#000',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Tu navegador no soporta el elemento de video.
                      </video>
                    )}
                  </div>
                );
              })()}

              {/* Audio Modal */}
              {activeMediaModal.type === 'audio' && (
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937', fontWeight: 'bold' }}>
                      🔊 {activeMediaModal.data.title}
                    </h2>
                    <button
                      onClick={() => setActiveMediaModal(null)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {activeMediaModal.data.audio_ambient_url && (
                      <div>
                        <h3 style={{ fontSize: '1rem', color: '#374151', marginBottom: '0.5rem' }}>
                          🎵 Audio de Ambiente
                        </h3>
                        <audio
                          controls
                          loop
                          autoPlay={activeMediaModal.data.audio_autoplay}
                          style={{ width: '100%' }}
                        >
                          <source src={activeMediaModal.data.audio_ambient_url} type="audio/mpeg" />
                          Tu navegador no soporta el elemento de audio.
                        </audio>
                      </div>
                    )}
                    {activeMediaModal.data.audio_narration_url && (
                      <div>
                        <h3 style={{ fontSize: '1rem', color: '#374151', marginBottom: '0.5rem' }}>
                          🗣️ Narración
                        </h3>
                        <audio
                          controls
                          autoPlay={activeMediaModal.data.audio_autoplay}
                          style={{ width: '100%' }}
                        >
                          <source src={activeMediaModal.data.audio_narration_url} type="audio/mpeg" />
                          Tu navegador no soporta el elemento de audio.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Formulario de Contacto */}
        <ContactFormModal
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          terrenoTitle={terreno?.title || 'Propiedad'}
          contactEmail={contactEmail}
          terrenoId={terreno?.id}
        />
      </div>
    </>
  );
};

export default PhotoSphereViewer;
