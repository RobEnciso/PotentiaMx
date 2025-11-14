'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import PhotoSphereViewer from './PhotoSphereViewer';

// ✅ CORRECCIÓN CLAVE: Creamos el cliente UNA SOLA VEZ aquí fuera.
const supabase = createClient();

export default function TerrenoPage() {
  const params = useParams();
  const [terrain, setTerrain] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Obtener usuario actual
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (params.id) {
      const loadPublicData = async () => {
        try {
          const { data: terrainData, error: terrainError } = await supabase
            .from('terrenos')
            .select('*')
            .eq('id', params.id)
            .single();
          if (terrainError) throw terrainError;
          setTerrain(terrainData);

          const { data: hotspotsData, error: hotspotsError } = await supabase
            .from('hotspots')
            .select('*')
            .eq('terreno_id', params.id);
          if (hotspotsError) throw hotspotsError;

          const transformedHotspots = (hotspotsData || []).map((h) => ({
            id: String(h.id),
            title: h.title,
            yaw: h.position_yaw,
            pitch: h.position_pitch,
            imageIndex: h.panorama_index,
            targetImageIndex: h.target_panorama_index,
          }));

          setHotspots(transformedHotspots);
        } catch (err) {
          console.error('Error cargando datos del terreno:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadPublicData();
    }
  }, [params.id]);

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

  const validImageUrls = (terrain?.image_urls || []).filter((url) => url);

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
    />
  );
}
