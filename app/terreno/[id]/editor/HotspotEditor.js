'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import { AUDIO_LIBRARY, getAudioById } from '@/lib/audioLibrary';
import { isMobileDevice } from '@/lib/deviceDetection';
import MobileBottomBar from '@/components/MobileBottomBar';
import MobileBottomSheet from '@/components/MobileBottomSheet';
import MobileHotspotForm from '@/components/MobileHotspotForm';

export default function HotspotEditor({
  terrainId,
  imageUrls,
  existingHotspots,
  viewNames = [],
  markerStyle = 'apple',
  hasStyleChanges = false,
  viewAudioData = { ambient: [], ambientVolume: [], narration: [], narrationVolume: [], autoplay: [] },
  onSaveHotspots,
  isSaving,
  isSavingStyle,
  onUploadNewImage,
  onUploadMediaFile,
  onDeleteView,
  onRenameView,
  onMarkerStyleChange,
  onSaveMarkerStyle,
  onSaveViewAudio,
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
  const [editingHotspot, setEditingHotspot] = useState(null); // Hotspot siendo editado
  const [newHotspot, setNewHotspot] = useState({
    title: '',
    yaw: 0,
    pitch: 0,
    targetImageIndex: 0,
    type: 'navigation', // 'navigation', 'info', 'image', 'video', 'audio'
    content_text: '',
    content_images: [],
    content_video_url: '',
    audio_ambient_url: '',
    audio_ambient_volume: 0.3,
    audio_narration_url: '',
    audio_narration_volume: 0.7,
    audio_autoplay: false,
    create_backlink: true,
    custom_icon_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [createNewView, setCreateNewView] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadingMediaType, setUploadingMediaType] = useState('');
  const [videoSourceType, setVideoSourceType] = useState('upload'); // 'upload' o 'embed'
  const [loadedPanoramaIndex, setLoadedPanoramaIndex] = useState(-1);
  const [isViewerReady, setIsViewerReady] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingViewIndex, setEditingViewIndex] = useState(null);
  const [editingViewName, setEditingViewName] = useState('');

  // Estado para detección móvil
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);

  // Estados para audio de fondo por vista
  const [viewAudioSettings, setViewAudioSettings] = useState({
    ambientUrl: '',
    ambientVolume: 0.3,
    narrationUrl: '',
    narrationVolume: 0.7,
    autoplay: true,
  });
  const [uploadingViewAudio, setUploadingViewAudio] = useState(false);
  const [uploadingViewAudioType, setUploadingViewAudioType] = useState('');

  // Detectar si estamos en móvil (solo en cliente)
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Sincroniza hotspots del padre cuando tienen IDs reales (después de guardar)
  useEffect(() => {
    const hasRealIds =
      existingHotspots &&
      existingHotspots.length > 0 &&
      existingHotspots.every((h) => h.id !== undefined && h.id !== null);

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

  // ✅ Cargar audio de la vista actual cuando cambia
  useEffect(() => {
    setViewAudioSettings({
      ambientUrl: viewAudioData.ambient[currentImageIndex] || '',
      ambientVolume: viewAudioData.ambientVolume[currentImageIndex] || 0.3,
      narrationUrl: viewAudioData.narration[currentImageIndex] || '',
      narrationVolume: viewAudioData.narrationVolume[currentImageIndex] || 0.7,
      autoplay: viewAudioData.autoplay[currentImageIndex] !== false,
    });
  }, [currentImageIndex, viewAudioData]);

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

    // Iconos predeterminados por tipo de hotspot
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
        const targetViewName =
          viewNames[hotspot.targetImageIndex] ||
          `Vista ${hotspot.targetImageIndex + 1}`;
        tooltip = `Ir a ${targetViewName}`;
      } else if (hotspotType === 'info') {
        tooltip = `Ver información`;
      } else if (hotspotType === 'image') {
        tooltip = `Ver galería`;
      } else if (hotspotType === 'video') {
        tooltip = `Reproducir video`;
      } else if (hotspotType === 'audio') {
        tooltip = `Reproducir audio`;
      }

      // Diferenciar estilo entre navegación y multimedia
      let markerHtml;
      if (hotspotType === 'navigation') {
        // Marcador completo con etiqueta para navegación
        markerHtml = `<div class="custom-marker clickable-marker">${icon} <span>${hotspot.title}</span></div>`;
      } else {
        // Solo icono grande para multimedia (punto de interés fijo)
        markerHtml = `<div class="multimedia-marker clickable-marker" title="${hotspot.title}">${icon}</div>`;
      }

      markersPluginRef.current.addMarker({
        id: String(hotspot.id),
        position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
        html: markerHtml,
        tooltip: tooltip,
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
          // ✅ MOBILE TOUCH SENSITIVITY (como Google Maps)
          mousewheelSpeed: 2.0,
          touchmoveTwoFingers: true,
          moveSpeed: 2.0, // ✅ 2x más rápido en móvil
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

          const nextImageIndex =
            currentImageIndexRef.current === imageUrls.length - 1
              ? 0
              : currentImageIndexRef.current + 1;

          // Guardar la posición del hotspot
          setNewHotspot({
            title: '',
            yaw,
            pitch,
            targetImageIndex: nextImageIndex,
            type: 'navigation',
            content_text: '',
            content_images: [],
            content_video_url: '',
            audio_ambient_url: '',
            audio_ambient_volume: 0.3,
            audio_narration_url: '',
            audio_narration_volume: 0.7,
            audio_autoplay: false,
            create_backlink: true,
            custom_icon_url: '',
          });

          // ✅ FLUJO CORREGIDO: Desactivar placement mode y abrir modal
          setPlacementMode(false);
          placementModeRef.current = false;

          // Abrir el modal correspondiente (mobile o desktop)
          if (isMobileDevice()) {
            setShowMobileForm(true); // ✅ Abrir bottom sheet AHORA
          } else {
            setShowModal(true); // Abrir modal desktop
          }
        });

        markersPluginRef.current.addEventListener('select-marker', (e) => {
          const marker = e.marker;
          console.log('🖱️ Hotspot clickeado en editor:', marker.id);
          const hotspot = hotspotsRef.current.find(
            (h) => String(h.id) === String(marker.id),
          );

          if (!hotspot) {
            console.warn('⚠️ No se encontró hotspot con id:', marker.id);
            return;
          }

          const hotspotType = hotspot.type || 'navigation';

          // Solo navegar si es tipo 'navigation' y tiene targetImageIndex
          if (hotspotType === 'navigation' && hotspot.targetImageIndex !== undefined) {
            console.log('🧭 Navegando a Vista', hotspot.targetImageIndex + 1);
            setCurrentImageIndex(hotspot.targetImageIndex);
          } else {
            console.log(`${hotspot.type === 'info' ? 'ℹ️' : hotspot.type === 'image' ? '🖼️' : hotspot.type === 'video' ? '🎥' : '🔊'} Hotspot multimedia clickeado (no navega)`);
            // TODO: En el futuro, aquí se abrirá el modal con el contenido
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

  // Helper para subir archivos multimedia
  const handleUploadMedia = async (file, mediaType) => {
    if (!onUploadMediaFile) {
      alert('La función de subida no está disponible');
      return null;
    }

    setUploadingMedia(true);
    setUploadingMediaType(mediaType);
    try {
      const url = await onUploadMediaFile(file, mediaType);
      return url;
    } catch (error) {
      console.error(`Error al subir ${mediaType}:`, error);
      alert(`Error al subir ${mediaType}: ${error.message}`);
      return null;
    } finally {
      setUploadingMedia(false);
      setUploadingMediaType('');
    }
  };

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

    // Crear objeto base del hotspot
    const hotspotToAdd = {
      id: `new-${Date.now()}`,
      title: newHotspot.title,
      yaw: newHotspot.yaw,
      pitch: newHotspot.pitch,
      imageIndex: currentImageIndex,
      type: newHotspot.type,
      custom_icon_url: newHotspot.custom_icon_url,
    };

    // Solo agregar campos de navegación si es tipo 'navigation'
    if (newHotspot.type === 'navigation') {
      hotspotToAdd.targetImageIndex = finalTargetIndex;
      hotspotToAdd.create_backlink = newHotspot.create_backlink;
    }

    // Agregar campos específicos según tipo
    if (newHotspot.type === 'info') {
      hotspotToAdd.content_text = newHotspot.content_text;
    } else if (newHotspot.type === 'image') {
      hotspotToAdd.content_images = newHotspot.content_images;
      hotspotToAdd.content_text = newHotspot.content_text; // Descripción de la galería
    } else if (newHotspot.type === 'video') {
      hotspotToAdd.content_video_url = newHotspot.content_video_url;
    } else if (newHotspot.type === 'audio') {
      hotspotToAdd.audio_ambient_url = newHotspot.audio_ambient_url;
      hotspotToAdd.audio_ambient_volume = newHotspot.audio_ambient_volume;
      hotspotToAdd.audio_narration_url = newHotspot.audio_narration_url;
      hotspotToAdd.audio_narration_volume = newHotspot.audio_narration_volume;
      hotspotToAdd.audio_autoplay = newHotspot.audio_autoplay;
    }

    // Actualizar estado local
    let updatedHotspots = [...hotspots, hotspotToAdd];

    // ✅ Crear hotspot de regreso automático si está habilitado
    if (newHotspot.type === 'navigation' && newHotspot.create_backlink) {
      const backlinkHotspot = {
        id: `new-${Date.now()}-backlink`,
        title: `Regreso a ${viewNames[currentImageIndex] || `Vista ${currentImageIndex + 1}`}`,
        yaw: newHotspot.yaw, // Misma posición horizontal
        pitch: newHotspot.pitch, // Misma posición vertical
        imageIndex: finalTargetIndex, // En la vista de destino
        targetImageIndex: currentImageIndex, // Regresa a la vista actual
        type: 'navigation',
        create_backlink: false, // No crear backlink del backlink
        custom_icon_url: newHotspot.custom_icon_url,
      };

      console.log('🔗 Creando hotspot de regreso automático:', backlinkHotspot);
      updatedHotspots = [...updatedHotspots, backlinkHotspot];
    }

    setHotspots(updatedHotspots);

    // Cerrar modal
    setShowModal(false);
    setNewImageFile(null);
    setCreateNewView(false);
    setVideoSourceType('upload');

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

  const handleEditHotspot = (hotspot) => {
    setEditingHotspot(hotspot);
    setNewHotspot({
      title: hotspot.title,
      yaw: hotspot.yaw,
      pitch: hotspot.pitch,
      targetImageIndex: hotspot.targetImageIndex || 0,
      type: hotspot.type || 'navigation',
      content_text: hotspot.content_text || '',
      content_images: hotspot.content_images || [],
      content_video_url: hotspot.content_video_url || '',
      audio_ambient_url: hotspot.audio_ambient_url || '',
      audio_ambient_volume: hotspot.audio_ambient_volume || 0.3,
      audio_narration_url: hotspot.audio_narration_url || '',
      audio_narration_volume: hotspot.audio_narration_volume || 0.7,
      audio_autoplay: hotspot.audio_autoplay || false,
      create_backlink: hotspot.create_backlink !== false,
      custom_icon_url: hotspot.custom_icon_url || '',
    });
    setShowModal(true);
  };

  const handleUpdateHotspot = () => {
    if (!newHotspot.title.trim()) {
      alert('Por favor ingresa un título para el hotspot');
      return;
    }

    // Crear objeto actualizado
    const updatedHotspot = {
      ...editingHotspot,
      title: newHotspot.title,
      yaw: newHotspot.yaw,
      pitch: newHotspot.pitch,
      type: newHotspot.type,
      custom_icon_url: newHotspot.custom_icon_url,
    };

    // Solo agregar campos de navegación si es tipo 'navigation'
    if (newHotspot.type === 'navigation') {
      updatedHotspot.targetImageIndex = newHotspot.targetImageIndex;
      updatedHotspot.create_backlink = newHotspot.create_backlink;
    } else {
      // Remover campos de navegación si cambió el tipo
      delete updatedHotspot.targetImageIndex;
      delete updatedHotspot.create_backlink;
    }

    // Agregar campos específicos según tipo
    if (newHotspot.type === 'info') {
      updatedHotspot.content_text = newHotspot.content_text;
    } else if (newHotspot.type === 'image') {
      updatedHotspot.content_images = newHotspot.content_images;
      updatedHotspot.content_text = newHotspot.content_text; // Descripción de la galería
    } else if (newHotspot.type === 'video') {
      updatedHotspot.content_video_url = newHotspot.content_video_url;
    } else if (newHotspot.type === 'audio') {
      updatedHotspot.audio_ambient_url = newHotspot.audio_ambient_url;
      updatedHotspot.audio_ambient_volume = newHotspot.audio_ambient_volume;
      updatedHotspot.audio_narration_url = newHotspot.audio_narration_url;
      updatedHotspot.audio_narration_volume = newHotspot.audio_narration_volume;
      updatedHotspot.audio_autoplay = newHotspot.audio_autoplay;
    }

    // Actualizar en la lista
    setHotspots((prev) =>
      prev.map((h) => (h.id === editingHotspot.id ? updatedHotspot : h))
    );

    // Cerrar modal
    setShowModal(false);
    setEditingHotspot(null);
    setVideoSourceType('upload');
  };

  // ✅ CORREGIDO: Función de guardado simple y directa
  const handleSave = async () => {
    console.log('📤 Pasando hotspots al padre para guardar:', hotspots);
    await onSaveHotspots(hotspots);
    // ✅ El useEffect de hasUnsavedChanges se encarga de resetear el estado automáticamente
  };

  const handleNewHotspotClick = () => {
    // ✅ FLUJO CORRECTO: Primero seleccionar punto, DESPUÉS abrir modal
    // Activar modo de colocación (NO abrir modal todavía)
    setPlacementMode(true);
    placementModeRef.current = true;
    // El modal se abrirá DESPUÉS de que el usuario haga click en el panorama
  };

  // Handler específico para móvil: cuando se envía el formulario móvil
  const handleMobileFormSubmit = async (formData) => {
    // Crear el hotspot con los datos del formulario
    const hotspotToAdd = {
      id: `new-${Date.now()}`,
      title: formData.title,
      yaw: newHotspot.yaw,
      pitch: newHotspot.pitch,
      imageIndex: currentImageIndex,
      type: formData.type,
      targetImageIndex: formData.targetImageIndex,
      create_backlink: formData.create_backlink,
      content_text: formData.content_text || '',
    };

    let updatedHotspots = [...hotspots, hotspotToAdd];

    // Crear backlink si es necesario
    if (formData.type === 'navigation' && formData.create_backlink) {
      const backlinkHotspot = {
        id: `new-${Date.now()}-backlink`,
        title: `Regreso a ${viewNames[currentImageIndex] || `Vista ${currentImageIndex + 1}`}`,
        yaw: newHotspot.yaw,
        pitch: newHotspot.pitch,
        imageIndex: formData.targetImageIndex,
        targetImageIndex: currentImageIndex,
        type: 'navigation',
        create_backlink: false,
      };
      updatedHotspots = [...updatedHotspots, backlinkHotspot];
    }

    setHotspots(updatedHotspots);
    setShowMobileForm(false);
    setPlacementMode(false);
    placementModeRef.current = false;
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

  // Generar estilos CSS dinámicamente según el estilo seleccionado (igual que PhotoSphereViewer)
  const getMarkerStyles = () => {
    const styles = {
      apple: `
        .custom-marker {
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px) saturate(180%);
          position: relative;
          overflow: visible;
          letter-spacing: -0.01em;
        }
        .custom-marker::before {
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
        .custom-marker span {
          margin-left: 6px;
        }
        .clickable-marker:hover {
          background: rgba(255, 255, 255, 0.98);
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(0, 122, 255, 0.12);
          border-color: rgba(0, 122, 255, 0.2);
        }
        .clickable-marker:hover::before {
          background: #0051d5;
          box-shadow: 0 0 8px rgba(0, 122, 255, 0.6);
          transform: translateY(-50%) scale(1.3);
        }
      `,
      android: `
        .custom-marker {
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
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: visible;
          text-transform: none;
          letter-spacing: 0.25px;
        }
        .custom-marker::before {
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
        .custom-marker span {
          margin-left: 8px;
        }
        .clickable-marker:hover {
          background: #1565c0;
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .clickable-marker:hover::before {
          transform: translateY(-50%) scale(1.4);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }
      `,
      classic: `
        .custom-marker {
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }
        .custom-marker::before {
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
        .clickable-marker:hover {
          transform: scale(1.15) translateY(-4px);
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.6), 0 0 0 8px rgba(16, 185, 129, 0.2);
          border-color: white;
          filter: brightness(1.1);
        }
        .clickable-marker:hover::before {
          opacity: 1;
        }
      `,
    };

    return styles[markerStyle] || styles.apple;
  };

  if (loadError) return <div>❌ Error: {loadError}</div>;

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
                top: isMobile ? '80px' : '20px', // ✅ Más abajo en móvil
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                backgroundColor: 'rgba(102, 126, 234, 0.95)',
                color: '#fff',
                padding: isMobile ? '16px 24px' : '15px 30px', // ✅ Más grande en móvil
                borderRadius: isMobile ? '16px' : '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                maxWidth: isMobile ? '90%' : 'none', // ✅ No se salga en móvil
                flexDirection: isMobile ? 'column' : 'row', // ✅ Vertical en móvil
              }}
            >
              <span style={{ fontSize: isMobile ? '16px' : '14px', textAlign: 'center' }}>
                📍 {isMobile ? 'Toca' : 'Haz clic'} donde quieres colocar el hotspot
              </span>
              <button
                onClick={() => {
                  setPlacementMode(false);
                  placementModeRef.current = false;
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid white',
                  color: 'white',
                  padding: isMobile ? '12px 24px' : '6px 16px', // ✅ Más grande en móvil
                  borderRadius: isMobile ? '12px' : '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: isMobile ? '15px' : '13px',
                  touchAction: 'manipulation', // ✅ Mejor respuesta táctil
                  minHeight: isMobile ? '44px' : 'auto', // ✅ Touch target size
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
                onTouchStart={(e) => {
                  if (isMobile) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'scale(0.96)';
                  }
                }}
                onTouchEnd={(e) => {
                  if (isMobile) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
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

        {/* Panel lateral - Solo en desktop */}
        {!isMobile && (
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
                .map((h) => {
                  const typeIcons = {
                    navigation: '🧭',
                    info: 'ℹ️',
                    image: '🖼️',
                    video: '🎥',
                    audio: '🔊',
                  };
                  const typeLabels = {
                    navigation: 'Navegación',
                    info: 'Información',
                    image: 'Galería',
                    video: 'Video',
                    audio: 'Audio',
                  };
                  const hotspotType = h.type || 'navigation';

                  return (
                    <div
                      key={h.id}
                      className="bg-gray-700 rounded-lg p-3 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{typeIcons[hotspotType]}</span>
                          <strong className="text-white">{h.title}</strong>
                        </div>
                        <p className="text-xs text-gray-400 m-0">
                          {typeLabels[hotspotType]}
                        </p>
                        {hotspotType === 'navigation' && h.targetImageIndex !== undefined && (
                          <p className="text-sm text-gray-300 m-0 mt-1">
                            → {viewNames[h.targetImageIndex] || `Vista ${h.targetImageIndex + 1}`}
                          </p>
                        )}
                        {hotspotType === 'info' && h.content_text && (
                          <p className="text-xs text-gray-400 m-0 mt-1 truncate">
                            {h.content_text.substring(0, 50)}...
                          </p>
                        )}
                        {hotspotType === 'audio' && (
                          <p className="text-xs text-gray-400 m-0 mt-1">
                            {h.audio_ambient_url && '🎵 Ambiente'}
                            {h.audio_ambient_url && h.audio_narration_url && ' + '}
                            {h.audio_narration_url && '🗣️ Narración'}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditHotspot(h)}
                          className="px-3 py-1 text-sm"
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#3b82f6';
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteHotspot(h.id)}
                          className="btn-danger px-3 py-1 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Panel de Audio de Fondo por Vista */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '2px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🎵 Audio de Fondo - {viewNames[currentImageIndex] || `Vista ${currentImageIndex + 1}`}
            </h4>
            <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '12px' }}>
              El audio se reproducirá automáticamente al entrar a esta vista
            </p>

            {/* Selector de biblioteca de audios ambiente */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                📚 Biblioteca de Audios Ambiente
              </label>
              <select
                onChange={(e) => {
                  const audioId = e.target.value;
                  if (audioId) {
                    const audio = getAudioById(audioId);
                    if (audio) {
                      setViewAudioSettings(prev => ({
                        ...prev,
                        ambientUrl: audio.file,
                        ambientVolume: audio.recommendedVolume || 0.3
                      }));
                    }
                  }
                  e.target.value = '';
                }}
                disabled={uploadingViewAudio}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(31, 41, 55, 0.8)',
                  color: 'white',
                  fontSize: '12px',
                }}
              >
                <option value="">🎼 Selecciona un audio...</option>
                {AUDIO_LIBRARY.ambient.map((audio) => (
                  <option key={audio.id} value={audio.id}>
                    {audio.name} ({audio.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Separador O */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
              <div style={{ flex: 1, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600' }}>O</span>
              <div style={{ flex: 1, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
            </div>

            {/* Subir audio ambiente personalizado */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                📤 Subir Audio Ambiente
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setUploadingViewAudio(true);
                  setUploadingViewAudioType('ambiente');
                  try {
                    const url = await onUploadMediaFile(file, 'audio');
                    if (url) {
                      setViewAudioSettings(prev => ({ ...prev, ambientUrl: url }));
                    }
                  } catch (error) {
                    alert('Error al subir audio: ' + error.message);
                  } finally {
                    setUploadingViewAudio(false);
                    setUploadingViewAudioType('');
                  }
                  e.target.value = '';
                }}
                disabled={uploadingViewAudio}
                style={{
                  width: '100%',
                  padding: '6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(31, 41, 55, 0.8)',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
              {uploadingViewAudio && uploadingViewAudioType === 'ambiente' && (
                <p style={{ fontSize: '11px', color: '#60a5fa', marginTop: '4px' }}>⏳ Subiendo audio...</p>
              )}
            </div>

            {/* Vista previa audio ambiente */}
            {viewAudioSettings.ambientUrl && (
              <div style={{ marginBottom: '12px', padding: '8px', background: 'rgba(31, 41, 55, 0.6)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: '500' }}>🎧 Audio Ambiente</span>
                  <button
                    onClick={() => setViewAudioSettings(prev => ({ ...prev, ambientUrl: '' }))}
                    style={{
                      marginLeft: 'auto',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <audio src={viewAudioSettings.ambientUrl} controls style={{ width: '100%', height: '30px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                    🔉 Volumen:
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={viewAudioSettings.ambientVolume}
                      onChange={(e) => setViewAudioSettings(prev => ({ ...prev, ambientVolume: parseFloat(e.target.value) }))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{(viewAudioSettings.ambientVolume * 100).toFixed(0)}%</span>
                  </label>
                </div>
              </div>
            )}

            {/* Separador */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '12px 0' }}></div>

            {/* Subir narración */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                🗣️ Subir Narración (opcional)
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setUploadingViewAudio(true);
                  setUploadingViewAudioType('narracion');
                  try {
                    const url = await onUploadMediaFile(file, 'audio');
                    if (url) {
                      setViewAudioSettings(prev => ({ ...prev, narrationUrl: url }));
                    }
                  } catch (error) {
                    alert('Error al subir narración: ' + error.message);
                  } finally {
                    setUploadingViewAudio(false);
                    setUploadingViewAudioType('');
                  }
                  e.target.value = '';
                }}
                disabled={uploadingViewAudio}
                style={{
                  width: '100%',
                  padding: '6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(31, 41, 55, 0.8)',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
              {uploadingViewAudio && uploadingViewAudioType === 'narracion' && (
                <p style={{ fontSize: '11px', color: '#60a5fa', marginTop: '4px' }}>⏳ Subiendo narración...</p>
              )}
              <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                La narración se reproduce una vez, mientras el audio ambiente hace loop
              </p>
            </div>

            {/* Vista previa narración */}
            {viewAudioSettings.narrationUrl && (
              <div style={{ marginBottom: '12px', padding: '8px', background: 'rgba(31, 41, 55, 0.6)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: '500' }}>🗣️ Narración</span>
                  <button
                    onClick={() => setViewAudioSettings(prev => ({ ...prev, narrationUrl: '' }))}
                    style={{
                      marginLeft: 'auto',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <audio src={viewAudioSettings.narrationUrl} controls style={{ width: '100%', height: '30px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                    🔉 Volumen:
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={viewAudioSettings.narrationVolume}
                      onChange={(e) => setViewAudioSettings(prev => ({ ...prev, narrationVolume: parseFloat(e.target.value) }))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{(viewAudioSettings.narrationVolume * 100).toFixed(0)}%</span>
                  </label>
                </div>
              </div>
            )}

            {/* Autoplay checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '12px', cursor: 'pointer', marginBottom: '12px' }}>
              <input
                type="checkbox"
                checked={viewAudioSettings.autoplay}
                onChange={(e) => setViewAudioSettings(prev => ({ ...prev, autoplay: e.target.checked }))}
                style={{ width: '14px', height: '14px' }}
              />
              <span>▶️ Reproducir automáticamente al entrar a esta vista</span>
            </label>

            {/* Botón guardar audio */}
            <button
              onClick={async () => {
                if (onSaveViewAudio) {
                  await onSaveViewAudio(currentImageIndex, viewAudioSettings);
                }
              }}
              disabled={uploadingViewAudio || (!viewAudioSettings.ambientUrl && !viewAudioSettings.narrationUrl)}
              style={{
                width: '100%',
                padding: '10px',
                background: (!viewAudioSettings.ambientUrl && !viewAudioSettings.narrationUrl)
                  ? 'rgba(156, 163, 175, 0.3)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: (!viewAudioSettings.ambientUrl && !viewAudioSettings.narrationUrl) ? 'not-allowed' : 'pointer',
                opacity: uploadingViewAudio ? 0.5 : 1,
              }}
            >
              {uploadingViewAudio ? '⏳ Subiendo...' : '💾 Guardar Audio de Vista'}
            </button>
          </div>

          {/* Selector de Estilo de Marcadores */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(31, 41, 55, 0.6)',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <label
              style={{
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
              }}
            >
              🎨 Estilo de Marcadores
            </label>
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <button
                onClick={() => onMarkerStyleChange && onMarkerStyleChange('apple')}
                style={{
                  padding: '10px 16px',
                  background: markerStyle === 'apple'
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: markerStyle === 'apple' ? '#1d1d1f' : 'white',
                  border: markerStyle === 'apple'
                    ? '2px solid #007aff'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (markerStyle !== 'apple') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (markerStyle !== 'apple') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    background: 'rgba(255, 255, 255, 0.92)',
                    border: '0.5px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '6px',
                      height: '6px',
                      background: '#007aff',
                      borderRadius: '50%',
                    }}
                  />
                </div>
                <span>Apple (Minimalista)</span>
              </button>

              <button
                onClick={() => onMarkerStyleChange && onMarkerStyleChange('android')}
                style={{
                  padding: '10px 16px',
                  background: markerStyle === 'android'
                    ? '#1976d2'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: markerStyle === 'android'
                    ? '2px solid #42a5f5'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (markerStyle !== 'android') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (markerStyle !== 'android') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    background: '#1976d2',
                    border: 'none',
                    borderRadius: '3px',
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '6px',
                      height: '6px',
                      background: 'white',
                      borderRadius: '50%',
                    }}
                  />
                </div>
                <span>Android (Material)</span>
              </button>

              <button
                onClick={() => onMarkerStyleChange && onMarkerStyleChange('classic')}
                style={{
                  padding: '10px 16px',
                  background: markerStyle === 'classic'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: markerStyle === 'classic'
                    ? '2px solid #34d399'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (markerStyle !== 'classic') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (markerStyle !== 'classic') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: '2px solid white',
                    borderRadius: '10px',
                  }}
                />
                <span>Classic (Verde)</span>
              </button>
            </div>
            <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
              El estilo seleccionado se aplicará a todos los visitantes del tour
            </p>
            {hasStyleChanges && (
              <button
                onClick={onSaveMarkerStyle}
                disabled={isSavingStyle}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  marginTop: '12px',
                  background: isSavingStyle
                    ? 'rgba(34, 197, 94, 0.5)'
                    : 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: isSavingStyle ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!isSavingStyle) {
                    e.target.style.background =
                      'linear-gradient(135deg, #0d9488 0%, #0e7490 100%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSavingStyle) {
                    e.target.style.background =
                      'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)';
                  }
                }}
              >
                {isSavingStyle ? '⏳ Guardando estilo...' : '💾 Guardar Estilo'}
              </button>
            )}
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
        )}

        {/* Modal Multimedia Mejorado - Solo en desktop */}
        {showModal && (
          <div className="fixed inset-0 bg-black/85 flex justify-center items-center z-50 overflow-y-auto p-4">
            <div className="card p-8 min-w-[500px] max-w-[600px] text-gray-900 my-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6">
                {editingHotspot ? '✏️ Editar Hotspot' : '📍 Nuevo Hotspot Multimedia'}
              </h3>

              <div className="space-y-5">
                {/* Título */}
                <label className="block">
                  <strong className="block mb-2">Título del hotspot *</strong>
                  <input
                    type="text"
                    value={newHotspot.title || ''}
                    onChange={(e) =>
                      setNewHotspot({ ...newHotspot, title: e.target.value })
                    }
                    autoFocus
                    className="input-field"
                    placeholder="Ej: Área de estar"
                  />
                </label>

                {/* Tipo de Hotspot */}
                <label className="block">
                  <strong className="block mb-2">🎯 Tipo de Hotspot *</strong>
                  <select
                    value={newHotspot.type}
                    onChange={(e) =>
                      setNewHotspot({ ...newHotspot, type: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="navigation">🧭 Navegación (ir a otra vista)</option>
                    <option value="info">ℹ️ Información (texto descriptivo)</option>
                    <option value="image">🖼️ Galería de imágenes</option>
                    <option value="video">🎥 Video</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Para audio de fondo, usa el panel "Audio de Fondo" en el lateral
                  </p>
                </label>

                {/* Campos condicionales según tipo */}
                {newHotspot.type === 'navigation' && (
                  <>
                    <div
                      style={{
                        backgroundColor: '#dbeafe',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        marginBottom: '0.75rem',
                        border: '1px solid #93c5fd',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>
                        🧭 Este hotspot permitirá navegar a otra vista 360°
                      </p>
                    </div>

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
                            💡 La imagen se optimizará automáticamente (4K, WebP)
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
                            {(newImageFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </label>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newHotspot.create_backlink}
                        onChange={(e) =>
                          setNewHotspot({ ...newHotspot, create_backlink: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">
                        ↩️ Crear hotspot de regreso automático
                      </span>
                    </label>
                  </>
                )}

                {newHotspot.type === 'info' && (
                  <>
                    <div
                      style={{
                        backgroundColor: '#fef3c7',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        marginBottom: '0.75rem',
                        border: '1px solid #fcd34d',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
                        ℹ️ Este hotspot abrirá un popup con texto informativo (no navega)
                      </p>
                    </div>
                    <label className="block">
                      <strong className="block mb-2">📝 Texto Informativo *</strong>
                      <textarea
                        value={newHotspot.content_text || ''}
                        onChange={(e) =>
                          setNewHotspot({ ...newHotspot, content_text: e.target.value })
                        }
                        className="input-field"
                        rows="4"
                        placeholder="Escribe la información que se mostrará..."
                      />
                    </label>
                  </>
                )}

                {newHotspot.type === 'image' && (
                  <>
                    <div
                      style={{
                        backgroundColor: '#e0e7ff',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        marginBottom: '0.75rem',
                        border: '1px solid #a5b4fc',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '13px', color: '#3730a3' }}>
                        🖼️ Este hotspot abrirá una galería de imágenes (no navega)
                      </p>
                    </div>

                    <label className="block mb-4">
                      <strong className="block mb-2">📝 Descripción de la Galería (opcional)</strong>
                      <textarea
                        value={newHotspot.content_text || ''}
                        onChange={(e) =>
                          setNewHotspot({ ...newHotspot, content_text: e.target.value })
                        }
                        className="input-field"
                        rows="3"
                        placeholder="Agrega una descripción para esta galería de imágenes..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Este texto aparecerá en el modal junto con las imágenes
                      </p>
                    </label>

                    <div className="block mb-4">
                      <strong className="block mb-2">📤 Subir Imágenes</strong>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;

                          for (const file of files) {
                            const url = await handleUploadMedia(file, 'image');
                            if (url) {
                              setNewHotspot(prev => ({
                                ...prev,
                                content_images: [...prev.content_images, url]
                              }));
                            }
                          }
                          e.target.value = '';
                        }}
                        disabled={uploadingMedia}
                        className="input-field"
                      />
                      {uploadingMedia && uploadingMediaType === 'image' && (
                        <p className="text-sm text-blue-600 mt-2">⏳ Subiendo imagen...</p>
                      )}
                    </div>

                    <label className="block">
                      <strong className="block mb-2">🖼️ Imágenes Agregadas</strong>
                      {newHotspot.content_images.length > 0 ? (
                        <div className="space-y-2">
                          {newHotspot.content_images.map((url, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                              <img src={url} alt={`Imagen ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                              <span className="flex-1 text-xs truncate">{url}</span>
                              <button
                                onClick={() => {
                                  setNewHotspot(prev => ({
                                    ...prev,
                                    content_images: prev.content_images.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="text-red-600 text-sm px-2 py-1"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No hay imágenes agregadas</p>
                      )}
                    </label>
                  </>
                )}

                {newHotspot.type === 'video' && (
                  <>
                    <div
                      style={{
                        backgroundColor: '#fce7f3',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        marginBottom: '0.75rem',
                        border: '1px solid #f9a8d4',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '13px', color: '#831843' }}>
                        🎥 Este hotspot abrirá un reproductor de video flotante (no navega)
                      </p>
                    </div>

                    {/* Opciones: Subir o Enlace */}
                    <div className="block mb-4">
                      <strong className="block mb-2">📹 Tipo de Video</strong>
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50"
                          style={{ borderColor: videoSourceType === 'upload' ? '#3b82f6' : '#d1d5db' }}>
                          <input
                            type="radio"
                            name="videoType"
                            checked={videoSourceType === 'upload'}
                            onChange={() => {
                              setVideoSourceType('upload');
                              setNewHotspot(prev => ({ ...prev, content_video_url: '' }));
                            }}
                          />
                          <span className="text-sm">📤 Subir (máx 60 seg)</span>
                        </label>
                        <label className="flex-1 flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50"
                          style={{ borderColor: videoSourceType === 'embed' ? '#3b82f6' : '#d1d5db' }}>
                          <input
                            type="radio"
                            name="videoType"
                            checked={videoSourceType === 'embed'}
                            onChange={() => {
                              setVideoSourceType('embed');
                              setNewHotspot(prev => ({ ...prev, content_video_url: '' }));
                            }}
                          />
                          <span className="text-sm">🔗 YouTube/Vimeo</span>
                        </label>
                      </div>
                    </div>

                    {/* Subir Video Corto */}
                    {videoSourceType === 'upload' ? (
                      <div className="block mb-4" key="upload-video">
                        <strong className="block mb-2">📤 Subir Video Corto (Máx 60 seg)</strong>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          key="video-file-input"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            // Validar duración del video
                            const video = document.createElement('video');
                            video.preload = 'metadata';
                            video.onloadedmetadata = async function() {
                              window.URL.revokeObjectURL(video.src);
                              const duration = video.duration;

                              if (duration > 60) {
                                alert(`⚠️ El video dura ${Math.round(duration)} segundos.\n\nPara videos mayores a 60 segundos, usa YouTube o Vimeo.`);
                                e.target.value = '';
                                return;
                              }

                              // Si pasa la validación, subir
                              const url = await handleUploadMedia(file, 'video');
                              if (url) {
                                setNewHotspot(prev => ({
                                  ...prev,
                                  content_video_url: url
                                }));
                              }
                              e.target.value = '';
                            };
                            video.src = URL.createObjectURL(file);
                          }}
                          disabled={uploadingMedia}
                          className="input-field"
                        />
                        {uploadingMedia && uploadingMediaType === 'video' && (
                          <p className="text-sm text-blue-600 mt-2">⏳ Subiendo video...</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Clips cortos (máx 60 seg). Formatos: MP4, WebM
                        </p>
                      </div>
                    ) : (
                      /* URL de YouTube/Vimeo */
                      <div className="block mb-4" key="embed-video">
                        <strong className="block mb-2">🔗 URL de YouTube o Vimeo</strong>
                        <input
                          type="url"
                          value={newHotspot.content_video_url || ''}
                          onChange={(e) =>
                            setNewHotspot({ ...newHotspot, content_video_url: e.target.value })
                          }
                          className="input-field"
                          placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
                          key="video-url-input"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Para videos largos (&gt;60 seg)
                        </p>
                      </div>
                    )}

                    {newHotspot.content_video_url && (
                      <div className="block">
                        <strong className="block mb-2">🎥 Video Agregado</strong>
                        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                          {newHotspot.content_video_url.includes('youtube') || newHotspot.content_video_url.includes('vimeo') ? (
                            <span className="text-2xl">🔗</span>
                          ) : (
                            <video src={newHotspot.content_video_url} className="w-24 h-16 object-cover rounded" />
                          )}
                          <span className="flex-1 text-xs truncate">{newHotspot.content_video_url}</span>
                          <button
                            onClick={() => {
                              setNewHotspot(prev => ({
                                ...prev,
                                content_video_url: ''
                              }));
                            }}
                            className="text-red-600 text-sm px-2 py-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}


                {/* Icono personalizado (para todos los tipos) */}
                <label className="block">
                  <strong className="block mb-2">🎨 Icono Personalizado (opcional)</strong>
                  <input
                    type="url"
                    value={newHotspot.custom_icon_url || ''}
                    onChange={(e) =>
                      setNewHotspot({ ...newHotspot, custom_icon_url: e.target.value })
                    }
                    className="input-field"
                    placeholder="https://ejemplo.com/icono.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deja vacío para usar el icono predeterminado
                  </p>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={editingHotspot ? handleUpdateHotspot : handleAddHotspot}
                  disabled={uploadingImage || (!editingHotspot && createNewView && !newImageFile)}
                  className="btn-success flex-1 py-3"
                >
                  {editingHotspot ? (
                    '💾 Guardar Cambios'
                  ) : uploadingImage ? (
                    createNewView ? '🔄 Optimizando y subiendo...' : '⏳ Guardando...'
                  ) : (
                    '✅ Crear Hotspot'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewImageFile(null);
                    setCreateNewView(false);
                    setEditingHotspot(null);
                    setVideoSourceType('upload');
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

      {/* Mobile UI Components */}
      {isMobile && (
        <>
          {/* Bottom Bar para navegación móvil */}
          <MobileBottomBar
            currentView={currentImageIndex}
            totalViews={imageUrls.length}
            hotspotCount={hotspots.filter((h) => h.imageIndex === currentImageIndex).length}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
            onAddHotspot={handleNewHotspotClick}
            onBack={handleBackToDashboard}
            onSave={handleSave}
            onViewChange={(index) => setCurrentImageIndex(index)}
          />

          {/* Bottom Sheet con formulario de hotspot */}
          <MobileBottomSheet
            isOpen={showMobileForm}
            onClose={() => {
              setShowMobileForm(false);
              setPlacementMode(false);
              placementModeRef.current = false;
            }}
            title={editingHotspot ? '✏️ Editar Hotspot' : '➕ Nuevo Hotspot'}
            fullHeight={false}
          >
            <MobileHotspotForm
              hotspot={editingHotspot || newHotspot}
              isEditing={!!editingHotspot}
              viewNames={viewNames}
              currentViewIndex={currentImageIndex}
              onSubmit={handleMobileFormSubmit}
              onCancel={() => {
                setShowMobileForm(false);
                setPlacementMode(false);
                placementModeRef.current = false;
              }}
              isLoading={isSaving}
            />
          </MobileBottomSheet>
        </>
      )}
    </>
  );
}
