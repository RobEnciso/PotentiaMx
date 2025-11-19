'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import PhotoSphereViewer from '@/app/terreno/[slug]/PhotoSphereViewer';

/**
 * PÁGINA EMBED - Para incrustar en sitios externos
 *
 * Esta página muestra SOLO el visor 360° sin header/footer/navegación.
 * Perfecta para embeber en sitios web de clientes mediante iframe.
 *
 * URL: /embed/terreno/[id]
 *
 * Uso en sitios externos:
 * <iframe src="https://tu-dominio.com/embed/terreno/123" width="100%" height="600" frameborder="0" allowfullscreen></iframe>
 */

export default function EmbedTourPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const [terreno, setTerreno] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerrenoData = async () => {
      if (!params.id) {
        setError('ID de tour no proporcionado');
        setLoading(false);
        return;
      }

      try {
        // 1. Cargar datos del terreno
        const { data: terrenoData, error: fetchError } = await supabase
          .from('terrenos')
          .select('*')
          .eq('id', params.id)
          .single();

        if (fetchError) {
          console.error('Error al cargar tour:', fetchError);
          setError('Tour no encontrado');
          setLoading(false);
          return;
        }

        // 2. Verificar que tenga imágenes
        if (!terrenoData.image_urls || terrenoData.image_urls.length === 0) {
          setError('Este tour no tiene imágenes 360° disponibles');
          setLoading(false);
          return;
        }

        setTerreno(terrenoData);

        // 3. Cargar hotspots del tour
        const { data: hotspotsData, error: hotspotsError } = await supabase
          .from('hotspots')
          .select('*')
          .eq('terreno_id', params.id);

        if (hotspotsError) {
          console.error('Error al cargar hotspots:', hotspotsError);
        }

        // 4. Transformar hotspots al formato esperado por el visor
        const transformedHotspots = (hotspotsData || []).map((h) => ({
          id: String(h.id),
          title: h.title,
          yaw: h.position_yaw,
          pitch: h.position_pitch,
          imageIndex: h.panorama_index,
          targetImageIndex: h.target_panorama_index,
        }));

        setHotspots(transformedHotspots);
        setLoading(false);
      } catch (err) {
        console.error('Error inesperado:', err);
        setError('Error al cargar el tour');
        setLoading(false);
      }
    };

    fetchTerrenoData();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-slate-900">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">Cargando tour 360°...</p>
        </div>
      </div>
    );
  }

  if (error || !terreno) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-slate-900">
        <div className="text-center max-w-md px-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Tour no disponible
          </h1>
          <p className="text-slate-400">
            {error || 'No se pudo cargar el tour 360°'}
          </p>
        </div>
      </div>
    );
  }

  // Filtrar URLs válidas
  const validImageUrls = (terreno?.image_urls || []).filter((url) => url);

  if (validImageUrls.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-slate-900">
        <div className="text-center max-w-md px-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Sin imágenes</h1>
          <p className="text-slate-400">
            Este tour no tiene imágenes 360° disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {/* Visor 360° puro con todas las props */}
      <PhotoSphereViewer
        images={validImageUrls}
        terreno={terreno}
        hotspots={hotspots}
        currentUser={null}
        isEmbedMode={true}
      />

      {/* Marca de agua Potentia - Branding para embeds */}
      <div className="absolute bottom-4 right-4 z-50 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <p className="text-white text-xs font-medium">
          Powered by{' '}
          <a
            href="https://potentia.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors font-semibold"
          >
            Potentia
          </a>
        </p>
      </div>
    </div>
  );
}
