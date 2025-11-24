'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabaseClient';
import PhotoSphereViewer from './PhotoSphereViewer';
import type { User } from '@supabase/supabase-js';
import { useTourAnalytics } from '@/hooks/useTourAnalytics';

// ✅ CORRECCIÓN CLAVE: Creamos el cliente UNA SOLA VEZ aquí fuera.
const supabase = createClient();

export default function TerrenoClientPage({ id }: { id: string }) {
  // ✅ ORDEN CRÍTICO: Todos los hooks useState PRIMERO
  const [terrain, setTerrain] = useState<any>(null);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // ✅ Preparar datos para analytics (siempre, incluso si terrain es null)
  // 🔒 CRÍTICO: useMemo evita crear nuevo array en cada render
  const validImageUrls = useMemo(
    () => (terrain?.image_urls || []).filter((url: string) => url),
    [terrain?.image_urls]
  );

  // ✅ Hook de analytics DESPUÉS de todos los useState, ANTES de useEffect
  const analytics = useTourAnalytics({
    tourId: terrain?.id || '',
    tourTitle: terrain?.title || '',
    currentSceneIndex,
    totalScenes: validImageUrls.length || 0,
  });

  // ✅ Handler para cambio de escena (actualiza estado, no remonta viewer)
  // CRÍTICO: useCallback evita re-renders innecesarios del hijo
  const handleSceneChange = useCallback((index: number) => {
    setCurrentSceneIndex(index);
  }, []);

  // ✅ OPTIMIZADO: Cargar todo en paralelo en un solo useEffect
  useEffect(() => {
    if (!id) return;

    const loadAllData = async () => {
      try {
        // Ejecutar todas las queries en paralelo
        const [
          { data: { user } },
          { data: terrainData, error: terrainError },
          { data: hotspotsData, error: hotspotsError }
        ] = await Promise.all([
          supabase.auth.getUser(),
          supabase.from('terrenos').select('*').eq('id', id).single(),
          supabase.from('hotspots').select('*').eq('terreno_id', id)
        ]);

        if (terrainError) throw terrainError;
        if (hotspotsError) throw hotspotsError;

        setCurrentUser(user);
        setTerrain(terrainData);

        const transformedHotspots = (hotspotsData || []).map((h: any) => ({
          id: String(h.id),
          title: h.title,
          yaw: h.position_yaw,
          pitch: h.position_pitch,
          imageIndex: h.panorama_index,
          targetImageIndex: h.target_panorama_index,
          // ✅ Campos multimedia
          type: h.hotspot_type || 'navigation',
          content_text: h.content_text,
          content_images: h.content_images,
          content_video_url: h.content_video_url,
          content_video_thumbnail: h.content_video_thumbnail,
          audio_ambient_url: h.audio_ambient_url,
          audio_ambient_volume: h.audio_ambient_volume,
          audio_ambient_loop: h.audio_ambient_loop,
          audio_narration_url: h.audio_narration_url,
          audio_narration_volume: h.audio_narration_volume,
          audio_autoplay: h.audio_autoplay,
          custom_icon_url: h.custom_icon_url,
          icon_size: h.icon_size,
        }));

        setHotspots(transformedHotspots);
      } catch (err: any) {
        console.error('Error cargando datos del terreno:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [id]);

  // ✅ Estados de carga y error
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'black',
          color: 'white',
        }}
      >
        Cargando recorrido...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'black',
          color: 'red',
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (validImageUrls.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'black',
          color: 'white',
        }}
      >
        No hay imágenes válidas para este recorrido.
      </div>
    );
  }

  return (
    <PhotoSphereViewer
      images={validImageUrls}
      terreno={terrain}
      hotspots={hotspots}
      currentUser={currentUser}
      onSceneChange={handleSceneChange}
      analytics={analytics}
    />
  );
}
