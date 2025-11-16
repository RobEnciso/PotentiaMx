'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import ContactFormModal from '@/components/ContactFormModal';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

export default function PhotoSphereViewer({
  images,
  terreno,
  hotspots,
  currentUser,
  isEmbedMode = false,
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
  const viewerRef = useRef(null);
  const markersPluginRef = useRef(null);

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
  const hideControlsTimeoutRef = useRef(null);
  const transitionLoaderTimeoutRef = useRef(null);
  const preloadedImagesRef = useRef(new Set());

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

  // Declarar initializeViewer ANTES del useEffect que lo usa
  const initializeViewer = useCallback(
    async (imageUrl) => {
      if (!containerRef.current) {
        console.error('PhotoSphereViewer: No hay contenedor disponible');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const viewer = new Viewer({
          container: containerRef.current,
          panorama: imageUrl,
          loadingImg: null,
          plugins: [[MarkersPlugin, {}]],
          navbar: false,
          defaultZoomLvl: 50,
          mousewheel: true,
          mousemove: true,
        });

        viewerRef.current = viewer;
        markersPluginRef.current = viewer.getPlugin(MarkersPlugin);

        viewer.addEventListener('ready', () => {
          setLoading(false);
          setIsViewerReady(true);
          setIsInitialized(true);
          setLoadedPanoramaIndex(0);
          setTimeout(() => {
            setMarkersVisible(true);
          }, 300);
        });

        viewer.addEventListener('panorama-load-error', (e) => {
          console.error('PhotoSphereViewer: Error al cargar panorama:', e);
          setError('Error al cargar la imagen: ' + e.error);
          setLoading(false);
        });

        markersPluginRef.current.addEventListener('select-marker', (e) => {
          const clickedMarker = e.marker;
          if (!clickedMarker) return;
          const hotspot = hotspots.find(
            (h) => String(h.id) === String(clickedMarker.id),
          );
          if (hotspot && hotspot.targetImageIndex !== undefined) {
            setCurrentIndex(hotspot.targetImageIndex);
          }
        });
      } catch (err) {
        console.error('PhotoSphereViewer: Error al inicializar el visor:', err);
        setError('Error al inicializar el visor: ' + err.message);
        setLoading(false);
      }
    },
    [hotspots],
  );

  useEffect(() => {
    if (
      !containerRef.current ||
      !images ||
      images.length === 0 ||
      viewerRef.current
    ) {
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

    const timer = setTimeout(() => {
      initializeViewer(validImages[0]);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [images, initializeViewer]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!isViewerReady || !viewer || !images || !isInitialized) return;

    const validImages = images.filter(
      (url) => url && typeof url === 'string' && url.trim() !== '',
    );
    if (validImages.length === 0) return;

    if (currentIndex < 0 || currentIndex >= validImages.length) return;
    if (currentIndex === loadedPanoramaIndex) return;

    setIsTransitioning(true);
    setMarkersVisible(false);

    if (transitionLoaderTimeoutRef.current) {
      clearTimeout(transitionLoaderTimeoutRef.current);
    }
    transitionLoaderTimeoutRef.current = setTimeout(() => {
      setShowTransitionLoader(true);
    }, 800);

    // ✅ OPTIMIZADO: Transición directa sin zoom innecesario
    viewer
      .setPanorama(validImages[currentIndex], {
        transition: 400,
        showLoader: false,
        zoom: viewer.getZoomLevel(),
      })
      .then(() => {
        setLoadedPanoramaIndex(currentIndex);
        setIsTransitioning(false);
        setShowTransitionLoader(false);

        if (transitionLoaderTimeoutRef.current) {
          clearTimeout(transitionLoaderTimeoutRef.current);
        }

        setTimeout(() => {
          setMarkersVisible(true);
        }, 200);
      })
      .catch((err) => {
        console.error('PhotoSphereViewer: Error al cambiar imagen:', err);
        setError('No se pudo cargar la imagen de la vista: ' + err.message);
        setIsTransitioning(false);
        setShowTransitionLoader(false);
        setMarkersVisible(true);

        if (transitionLoaderTimeoutRef.current) {
          clearTimeout(transitionLoaderTimeoutRef.current);
        }
      });
  }, [currentIndex, images, isViewerReady, isInitialized, loadedPanoramaIndex]);

  useEffect(() => {
    if (!isViewerReady || !markersPluginRef.current) {
      return;
    }

    const markersPlugin = markersPluginRef.current;
    markersPlugin.clearMarkers();

    if (!markersVisible || hotspots.length === 0) {
      return;
    }

    const currentHotspots = hotspots.filter(
      (h) => h.imageIndex === currentIndex,
    );

    currentHotspots.forEach((hotspot) => {
      markersPlugin.addMarker({
        id: String(hotspot.id),
        position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
        html: `<div class="public-marker">📍 <span>${hotspot.title}</span></div>`,
        tooltip: `Ir a: ${hotspot.title}`,
      });
    });
  }, [isViewerReady, hotspots, currentIndex, markersVisible]);

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
      `}</style>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: 'black',
        }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

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
            onClick={() => setShowInfo(!showInfo)}
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
                      onClick={() => setShowContactForm(true)}
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
                onClick={() => setShowContactForm(true)}
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
}
