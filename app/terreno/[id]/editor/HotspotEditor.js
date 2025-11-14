'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

export default function HotspotEditor({
  terrainId,
  imageUrls,
  existingHotspots,
  viewNames = [],
  onSaveHotspots,
  isSaving,
  onUploadNewImage,
  onDeleteView,
  onRenameView,
}) {
  const router = useRouter();
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const markersPluginRef = useRef(null);
  const placementModeRef = useRef(false);
  const currentImageIndexRef = useRef(0);
  const hotspotsRef = useRef([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hotspots, setHotspots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHotspot, setNewHotspot] = useState({
    title: '',
    yaw: 0,
    pitch: 0,
    targetImageIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [createNewView, setCreateNewView] = useState(false);
  const [loadedPanoramaIndex, setLoadedPanoramaIndex] = useState(-1);
  const [isViewerReady, setIsViewerReady] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingViewIndex, setEditingViewIndex] = useState(null);
  const [editingViewName, setEditingViewName] = useState('');

  // Sincroniza hotspots del padre cuando tienen IDs reales (después de guardar)
  useEffect(() => {
    const hasRealIds =
      existingHotspots &&
      existingHotspots.length > 0 &&
      existingHotspots.every((h) => typeof h.id === 'number');

    if (hasRealIds) {
      console.log(
        '📥 Sincronizando hotspots con IDs reales desde BD:',
        existingHotspots.length,
      );
      setHotspots(existingHotspots);
      // Actualizar marcadores inmediatamente si el viewer ya está listo
      if (isViewerReady && markersPluginRef.current) {
        setTimeout(() => updateMarkers(), 100);
      }
    } else if (existingHotspots && hotspots.length === 0) {
      // Primera carga
      console.log('📥 Cargando hotspots iniciales:', existingHotspots.length);
      setHotspots(existingHotspots);
      // Actualizar marcadores inmediatamente si el viewer ya está listo
      if (isViewerReady && markersPluginRef.current) {
        setTimeout(() => updateMarkers(), 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingHotspots]); // Solo dependemos de existingHotspots, hotspots.length causa loop

  // Detectar cambios sin guardar
  useEffect(() => {
    // Comparar solo si ambos tienen contenido
    if (hotspots.length === 0 && existingHotspots.length === 0) {
      setHasUnsavedChanges(false);
      return;
    }

    // Comparar cantidad
    if (hotspots.length !== existingHotspots.length) {
      setHasUnsavedChanges(true);
      return;
    }

    // Comparar contenido ignorando IDs temporales
    const hasChanges = hotspots.some((h, index) => {
      const existing = existingHotspots[index];
      if (!existing) return true;

      // Comparar solo campos importantes (ignorar ID si es temporal)
      return (
        h.title !== existing.title ||
        Math.abs(h.yaw - existing.yaw) > 0.001 ||
        Math.abs(h.pitch - existing.pitch) > 0.001 ||
        h.imageIndex !== existing.imageIndex ||
        h.targetImageIndex !== existing.targetImageIndex
      );
    });

    setHasUnsavedChanges(hasChanges);
  }, [hotspots, existingHotspots]);

  // Sincronizar refs con state
  useEffect(() => {
    currentImageIndexRef.current = currentImageIndex;
  }, [currentImageIndex]);

  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // Validación inicial
  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setLoadError('No hay imágenes 360° disponibles para este terreno.');
      setIsLoading(false);
    }
  }, [imageUrls]);

  // Declarar updateMarkers ANTES de initializeViewer
  const updateMarkers = useCallback(() => {
    if (!markersPluginRef.current) return;
    markersPluginRef.current.clearMarkers();
    const currentHotspots = hotspots.filter(
      (h) => h.imageIndex === currentImageIndex,
    );
    console.log(
      `📍 Actualizando ${currentHotspots.length} marcadores en ${viewNames[currentImageIndex] || `Vista ${currentImageIndex + 1}`}`,
    );
    currentHotspots.forEach((hotspot) => {
      const targetViewName =
        viewNames[hotspot.targetImageIndex] ||
        `Vista ${hotspot.targetImageIndex + 1}`;
      markersPluginRef.current.addMarker({
        id: String(hotspot.id),
        position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
        html: `<div class="custom-marker clickable-marker">📍 <span>${hotspot.title}</span></div>`,
        tooltip: `Ir a ${targetViewName}`,
      });
    });
  }, [hotspots, currentImageIndex, viewNames]);

  // Declarar initializeViewer ANTES del useEffect que lo usa
  const initializeViewer = useCallback(
    async (imageUrl) => {
      if (!viewerRef.current) return;
      try {
        console.log('HotspotEditor: Inicializando viewer con URL:', imageUrl);
        setIsLoading(true);
        const viewer = new Viewer({
          container: viewerRef.current,
          panorama: imageUrl,
          plugins: [[MarkersPlugin, { markers: [] }]],
          navbar: false,
          defaultZoomLvl: 50,
        });

        viewerInstanceRef.current = viewer;
        markersPluginRef.current = viewer.getPlugin(MarkersPlugin);

        viewer.addEventListener('ready', () => {
          console.log('HotspotEditor: Viewer listo');
          setIsLoading(false);
          setIsViewerReady(true);
          setLoadedPanoramaIndex(0); // Marcar que la primera imagen está cargada
          // Llamar updateMarkers directamente, no como dependencia
          if (markersPluginRef.current) {
            updateMarkers();
          }
        });

        viewer.addEventListener('click', (event) => {
          if (!placementModeRef.current) return;

          const { yaw, pitch } = event.data;
          setTempMarkerPosition({ yaw, pitch });
          setTimeout(() => setTempMarkerPosition(null), 2000);

          setPlacementMode(false);
          placementModeRef.current = false;

          const nextImageIndex =
            currentImageIndexRef.current === imageUrls.length - 1
              ? 0
              : currentImageIndexRef.current + 1;
          setNewHotspot({
            title: '',
            yaw,
            pitch,
            targetImageIndex: nextImageIndex,
          });
          setShowModal(true);
        });

        markersPluginRef.current.addEventListener('select-marker', (e) => {
          const marker = e.marker;
          console.log('🖱️ Hotspot clickeado en editor:', marker.id);
          const hotspot = hotspotsRef.current.find(
            (h) => String(h.id) === String(marker.id),
          );
          if (hotspot && hotspot.targetImageIndex !== undefined) {
            console.log('🔀 Navegando a Vista', hotspot.targetImageIndex + 1);
            setCurrentImageIndex(hotspot.targetImageIndex);
          } else {
            console.warn(
              '⚠️ No se encontró hotspot con id:',
              marker.id,
              'en',
              hotspotsRef.current,
            );
          }
        });
      } catch (error) {
        setLoadError('Error al inicializar el visor: ' + error.message);
        setIsLoading(false);
      }
    },
    [imageUrls],
  );

  // Inicializar visor solo una vez (independiente de imageUrls)
  useEffect(() => {
    if (
      !viewerRef.current ||
      !imageUrls ||
      imageUrls.length === 0 ||
      viewerInstanceRef.current
    ) {
      return;
    }
    console.log('🎬 Inicializando viewer por primera vez');
    const timer = setTimeout(() => initializeViewer(imageUrls[0]), 100);
    return () => {
      clearTimeout(timer);
      console.log('🧹 Limpiando viewer al desmontar componente');
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta al montar, no cuando cambia imageUrls

  // Cambiar imagen cuando cambia el índice
  useEffect(() => {
    const viewer = viewerInstanceRef.current;
    if (!isViewerReady || !viewer || !imageUrls || imageUrls.length === 0) {
      console.log(
        'HotspotEditor: Condiciones no cumplidas para cambiar imagen',
        {
          isViewerReady,
          hasViewer: !!viewer,
          hasImages: !!imageUrls,
          imagesLength: imageUrls?.length,
        },
      );
      return;
    }

    // Validar que el índice sea válido
    if (currentImageIndex < 0 || currentImageIndex >= imageUrls.length) {
      console.log('HotspotEditor: Índice inválido', currentImageIndex);
      return;
    }

    // Solo cambiar si el índice es diferente al que ya está cargado
    if (currentImageIndex === loadedPanoramaIndex) {
      console.log('HotspotEditor: Ya estamos en la imagen', currentImageIndex);
      return;
    }

    console.log(
      'HotspotEditor: Cambiando a imagen índice',
      currentImageIndex,
      'URL:',
      imageUrls[currentImageIndex],
    );
    setIsLoading(true);
    viewer
      .setPanorama(imageUrls[currentImageIndex])
      .then(() => {
        console.log(
          'HotspotEditor: Imagen cambiada exitosamente a índice',
          currentImageIndex,
        );
        setIsLoading(false);
        setLoadedPanoramaIndex(currentImageIndex); // Actualizar el índice cargado
        updateMarkers();
      })
      .catch((error) => {
        console.error('HotspotEditor: Error al cargar la imagen:', error);
        setLoadError('Error al cargar la imagen: ' + error.message);
        setIsLoading(false);
      });
  }, [
    currentImageIndex,
    imageUrls,
    isViewerReady,
    loadedPanoramaIndex,
    updateMarkers,
  ]);

  // Actualizar cursor según modo
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.style.cursor = placementMode ? 'crosshair' : 'grab';
    }
    // También aplicar al canvas del viewer si existe
    const viewerCanvas = viewerRef.current?.querySelector('canvas');
    if (viewerCanvas) {
      viewerCanvas.style.cursor = placementMode ? 'crosshair' : 'grab';
    }
  }, [placementMode]);

  // Cancelar modo de colocación con tecla ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && placementMode) {
        setPlacementMode(false);
        placementModeRef.current = false;
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [placementMode]);

  // Si la vista actual se eliminó, cambiar a una válida
  useEffect(() => {
    if (currentImageIndex >= imageUrls.length && imageUrls.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [imageUrls.length, currentImageIndex]);

  const handleAddHotspot = async () => {
    if (!newHotspot.title.trim()) {
      alert('Por favor ingresa un título para el hotspot');
      return;
    }

    let finalTargetIndex = newHotspot.targetImageIndex;
    let imageWasUploaded = false;

    // Si se seleccionó crear nueva vista y hay una imagen
    if (createNewView && newImageFile) {
      if (!onUploadNewImage) {
        alert('Funcionalidad de subida no disponible');
        return;
      }
      setUploadingImage(true);
      try {
        console.log('📤 Subiendo nueva imagen...');
        const newImageIndex = await onUploadNewImage(newImageFile);
        finalTargetIndex = newImageIndex;
        imageWasUploaded = true;
        console.log('✅ Imagen subida, índice:', newImageIndex);
      } catch (error) {
        alert('Error al subir la imagen: ' + error.message);
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    const hotspotToAdd = {
      id: `new-${Date.now()}`,
      title: newHotspot.title,
      yaw: newHotspot.yaw,
      pitch: newHotspot.pitch,
      imageIndex: currentImageIndex,
      targetImageIndex: finalTargetIndex,
    };

    // Actualizar estado local
    const updatedHotspots = [...hotspots, hotspotToAdd];
    setHotspots(updatedHotspots);

    // Cerrar modal
    setShowModal(false);
    setNewImageFile(null);
    setCreateNewView(false);

    // Si se subió una imagen, auto-guardar inmediatamente
    if (imageWasUploaded && onSaveHotspots) {
      console.log('💾 Auto-guardando hotspots después de subir imagen...');
      setAutoSaving(true);
      try {
        await onSaveHotspots(updatedHotspots);
        console.log('✅ Hotspots guardados automáticamente');
        // ✅ El useEffect de hasUnsavedChanges se encarga de resetear el estado
      } catch (error) {
        console.error('Error al auto-guardar:', error);
        alert(
          '⚠️ La imagen se subió pero hubo un error al guardar el hotspot. Por favor, haz clic en "Guardar Cambios" manualmente.',
        );
      } finally {
        setAutoSaving(false);
      }
    }
  };

  // Re-renderiza los marcadores cuando la lista de hotspots cambia
  useEffect(() => {
    updateMarkers();
  }, [hotspots, updateMarkers]);

  // Renderizar hotspots cuando el viewer esté listo
  useEffect(() => {
    if (isViewerReady && hotspots.length > 0) {
      console.log(
        '✨ Viewer listo y hotspots disponibles, renderizando marcadores',
      );
      setTimeout(() => updateMarkers(), 200);
    }
  }, [isViewerReady, hotspots.length, updateMarkers]);

  const handleDeleteHotspot = (hotspotId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este hotspot?')) {
      setHotspots((prev) => prev.filter((h) => h.id !== hotspotId));
    }
  };

  // ✅ CORREGIDO: Función de guardado simple y directa
  const handleSave = async () => {
    console.log('📤 Pasando hotspots al padre para guardar:', hotspots);
    await onSaveHotspots(hotspots);
    // ✅ El useEffect de hasUnsavedChanges se encarga de resetear el estado automáticamente
  };

  const handleNewHotspotClick = () => {
    setPlacementMode(true);
    placementModeRef.current = true;
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      const confirmExit = confirm(
        '⚠️ Tienes cambios sin guardar.\n\n¿Estás seguro de que quieres salir?\n\nSe perderán todos los cambios no guardados.',
      );
      if (!confirmExit) {
        return;
      }
    }
    router.push('/dashboard');
  };

  const handleStartEditingViewName = (index) => {
    setEditingViewIndex(index);
    setEditingViewName(viewNames[index] || `Vista ${index + 1}`);
  };

  const handleSaveViewName = async () => {
    if (editingViewIndex === null || !onRenameView) return;

    const success = await onRenameView(editingViewIndex, editingViewName);
    if (success) {
      setEditingViewIndex(null);
      setEditingViewName('');
    }
  };

  const handleCancelEditViewName = () => {
    setEditingViewIndex(null);
    setEditingViewName('');
  };

  const handleViewNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveViewName();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEditViewName();
    }
  };

  if (loadError) return <div>❌ Error: {loadError}</div>;

  return (
    <>
      <style>{`
        .custom-marker {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; padding: 8px 14px; border-radius: 20px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 2px solid white;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.2s ease;
        }
        .clickable-marker:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #7c8ff0 0%, #8b5cb8 100%);
        }
        @keyframes pulse-save {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
            transform: scale(1.02);
          }
        }
        .btn-unsaved {
          animation: pulse-save 1.5s infinite;
        }
      `}</style>
      <div
        style={{ display: 'flex', height: '100vh', backgroundColor: '#111827' }}
      >
        {/* Visor 360° */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Botón de regreso al dashboard */}
          <button
            onClick={handleBackToDashboard}
            disabled={isSaving}
            className="nav-button left-4"
            style={{
              background: hasUnsavedChanges
                ? 'rgba(239, 68, 68, 0.9)'
                : 'rgba(31, 41, 55, 0.9)',
              border: hasUnsavedChanges
                ? '2px solid #fbbf24'
                : '2px solid rgba(255,255,255,0.2)',
            }}
          >
            {hasUnsavedChanges ? '⚠️ Volver' : '← Volver'}
          </button>

          {(isLoading || isSaving || autoSaving) && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.9)',
                padding: '2rem',
                borderRadius: '10px',
                color: '#fff',
              }}
            >
              <h3>
                {autoSaving
                  ? '💾 Guardando automáticamente...'
                  : isSaving
                    ? '💾 Guardando Cambios...'
                    : `Cargando imagen ${currentImageIndex + 1}...`}
              </h3>
            </div>
          )}
          {placementMode && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                backgroundColor: 'rgba(102, 126, 234, 0.95)',
                color: '#fff',
                padding: '15px 30px',
                borderRadius: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span>📍 Haz clic donde quieres colocar el hotspot</span>
              <button
                onClick={() => {
                  setPlacementMode(false);
                  placementModeRef.current = false;
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid white',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '13px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ✕ Cancelar (ESC)
              </button>
            </div>
          )}
          <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
          {imageUrls.length > 1 && (
            <div className="viewer-controls">
              {imageUrls.map((imageUrl, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  <button
                    onClick={() => {
                      // No cambiar vista si estamos editando el nombre
                      if (editingViewIndex !== index) {
                        setCurrentImageIndex(index);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Evitar que el espacio active el botón cuando estamos editando
                      if (editingViewIndex === index && e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    disabled={isLoading || isSaving || autoSaving}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      background:
                        currentImageIndex === index
                          ? 'rgba(102, 126, 234, 0.95)'
                          : 'rgba(31, 41, 55, 0.9)',
                      color: '#fff',
                      border:
                        currentImageIndex === index
                          ? '2px solid #667eea'
                          : '2px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: '600',
                      fontSize: '13px',
                      boxShadow:
                        currentImageIndex === index
                          ? '0 4px 15px rgba(102, 126, 234, 0.5)'
                          : '0 2px 8px rgba(0,0,0,0.3)',
                      opacity: isLoading || isSaving || autoSaving ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (currentImageIndex !== index) {
                        e.currentTarget.style.background =
                          'rgba(55, 65, 81, 0.95)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentImageIndex !== index) {
                        e.currentTarget.style.background =
                          'rgba(31, 41, 55, 0.9)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={viewNames[index] || `Vista ${index + 1}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid rgba(255,255,255,0.3)',
                      }}
                    />
                    {editingViewIndex === index ? (
                      <input
                        type="text"
                        value={editingViewName}
                        onChange={(e) => setEditingViewName(e.target.value)}
                        onKeyDown={(e) => {
                          e.stopPropagation(); // Evitar que el espacio cambie de vista
                          handleViewNameKeyDown(e);
                        }}
                        onBlur={handleSaveViewName}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '2px solid #667eea',
                          background: 'white',
                          color: '#1f2937',
                          fontSize: '12px',
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{viewNames[index] || `Vista ${index + 1}`}</span>
                        {onRenameView && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isLoading && !isSaving && !autoSaving) {
                                handleStartEditingViewName(index);
                              }
                            }}
                            title="Renombrar vista"
                            style={{
                              color: 'rgba(255,255,255,0.6)',
                              cursor:
                                isLoading || isSaving || autoSaving
                                  ? 'not-allowed'
                                  : 'pointer',
                              padding: '2px',
                              fontSize: '12px',
                              transition: 'color 0.2s ease',
                              opacity:
                                isLoading || isSaving || autoSaving ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!isLoading && !isSaving && !autoSaving) {
                                e.target.style.color = '#667eea';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = 'rgba(255,255,255,0.6)';
                            }}
                          >
                            ✏️
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                  {imageUrls.length > 1 && onDeleteView && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteView(index);
                      }}
                      disabled={isLoading || isSaving || autoSaving}
                      title={`Eliminar Vista ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        color: 'white',
                        border: '2px solid white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        lineHeight: 1,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'scale(1.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#ef4444';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="w-96 bg-gray-800 text-white p-6 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold m-0">Editor de Hotspots</h2>
            <button
              onClick={handleBackToDashboard}
              disabled={isSaving}
              className="btn-secondary text-sm px-3 py-2"
              style={{
                background: hasUnsavedChanges
                  ? '#ef4444'
                  : 'rgba(55, 65, 81, 0.8)',
                borderColor: hasUnsavedChanges ? '#fbbf24' : 'transparent',
              }}
            >
              {hasUnsavedChanges ? '⚠️ Volver' : '← Volver'}
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            {viewNames[currentImageIndex] || `Vista ${currentImageIndex + 1}`} (
            {currentImageIndex + 1} de {imageUrls.length})
          </p>
          <button
            onClick={handleNewHotspotClick}
            disabled={placementMode || isLoading || isSaving}
            className="btn-primary w-full mb-6 py-3"
          >
            ➕ Nuevo Hotspot
          </button>

          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">
              Hotspots en esta vista
            </h3>
            <div className="space-y-3">
              {hotspots
                .filter((h) => h.imageIndex === currentImageIndex)
                .map((h) => (
                  <div
                    key={h.id}
                    className="bg-gray-700 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-white">{h.title}</strong>
                      <p className="text-sm text-gray-300 m-0">
                        → Lleva a{' '}
                        {viewNames[h.targetImageIndex] ||
                          `Vista ${h.targetImageIndex + 1}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteHotspot(h.id)}
                      className="btn-danger px-3 py-1 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || autoSaving || !hasUnsavedChanges}
            className={`btn-success w-full py-3 font-bold ${hasUnsavedChanges && !isSaving && !autoSaving ? 'btn-unsaved' : ''}`}
            style={{
              opacity: !hasUnsavedChanges && !isSaving && !autoSaving ? 0.5 : 1,
              cursor:
                !hasUnsavedChanges && !isSaving && !autoSaving
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {autoSaving
              ? '💾 Auto-guardando...'
              : isSaving
                ? 'Guardando...'
                : hasUnsavedChanges
                  ? '💾 Guardar Cambios ⚠️'
                  : '✅ Todo Guardado'}
          </button>
          {!autoSaving && !isSaving && hasUnsavedChanges && (
            <p className="text-xs text-yellow-400 text-center mt-2 font-semibold">
              ⚠️ Tienes cambios sin guardar
            </p>
          )}
          {!autoSaving && !isSaving && !hasUnsavedChanges && (
            <p className="text-xs text-gray-400 text-center mt-2">
              ℹ️ Los hotspots con nueva vista se guardan automáticamente
            </p>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/85 flex justify-center items-center z-50">
            <div className="card p-8 min-w-[450px] text-gray-900">
              <h3 className="text-xl font-bold mb-6">📍 Nuevo Hotspot</h3>
              <div className="space-y-4">
                <label className="block">
                  <strong className="block mb-2">Título del hotspot *</strong>
                  <input
                    type="text"
                    value={newHotspot.title}
                    onChange={(e) =>
                      setNewHotspot({ ...newHotspot, title: e.target.value })
                    }
                    autoFocus
                    className="input-field"
                  />
                </label>

                <div className="block">
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={createNewView}
                      onChange={(e) => {
                        setCreateNewView(e.target.checked);
                        if (!e.target.checked) setNewImageFile(null);
                      }}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">
                      Crear nueva vista (subir imagen 360°)
                    </span>
                  </label>
                </div>

                {!createNewView ? (
                  <label className="block">
                    <strong className="block mb-2">
                      ¿A qué vista lleva este hotspot? *
                    </strong>
                    <select
                      value={newHotspot.targetImageIndex}
                      onChange={(e) =>
                        setNewHotspot({
                          ...newHotspot,
                          targetImageIndex: parseInt(e.target.value),
                        })
                      }
                      className="input-field"
                    >
                      {imageUrls.map((_, index) => (
                        <option key={index} value={index}>
                          {viewNames[index] || `Vista ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <label className="block">
                    <strong className="block mb-2">
                      Seleccionar imagen 360° *
                    </strong>
                    <div
                      style={{
                        backgroundColor: '#e7f3ff',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        marginBottom: '0.75rem',
                        border: '1px solid #b3d9ff',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#0369a1',
                        }}
                      >
                        💡 La imagen se optimizará automáticamente (4K, calidad
                        85%, WebP)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewImageFile(e.target.files[0])}
                      className="input-field"
                    />
                    {newImageFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ {newImageFile.name} (
                        {(newImageFile.size / 1024 / 1024).toFixed(2)} MB) -
                        Será optimizada al subir
                      </p>
                    )}
                  </label>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddHotspot}
                  disabled={uploadingImage || (createNewView && !newImageFile)}
                  className="btn-success flex-1 py-3"
                >
                  {uploadingImage
                    ? createNewView
                      ? '🔄 Optimizando y subiendo...'
                      : '⏳ Guardando...'
                    : '✅ Crear Hotspot'}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewImageFile(null);
                    setCreateNewView(false);
                  }}
                  disabled={uploadingImage}
                  className="flex-1 py-3"
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: uploadingImage ? 0.5 : 1,
                  }}
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
