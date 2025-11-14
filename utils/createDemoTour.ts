import { createClient } from '@/lib/supabaseClient';

interface DemoTourResult {
  success: boolean;
  terrainId?: string;
  error?: string;
}

/**
 * Crea un tour demo automático con imágenes precargadas y hotspots configurados
 * Este tour sirve para familiarizar a nuevos usuarios con la plataforma
 */
export async function createDemoTour(userId: string): Promise<DemoTourResult> {
  try {
    const supabase = createClient();

    // 1. Subir las imágenes demo al storage
    console.log('📦 Iniciando creación de tour demo...');

    const demoImages = [
      'DJI_20250930101122_0014_D.JPG',
      'DJI_20250930111615_0020_D.JPG',
      'DJI_20250930113100_0030_D.JPG',
    ];

    const uploadedUrls: string[] = [];

    for (const imageName of demoImages) {
      try {
        // Obtener la imagen desde la ruta local (esto requeriría un endpoint de API)
        // Por ahora, asumimos que las imágenes ya están subidas manualmente
        // En producción, esto se haría a través de un endpoint de servidor

        console.log(`⏳ Procesando imagen: ${imageName}`);

        // NOTA: Para implementar esto completamente, necesitarías:
        // 1. Crear un API endpoint que lea las imágenes del disco del servidor
        // 2. Comprimirlas usando browser-image-compression (del lado del servidor con sharp o similar)
        // 3. Subirlas al storage de Supabase

        // Por ahora, retornaremos un placeholder URL
        // En la implementación real, aquí iría la lógica de upload
      } catch (error) {
        console.error(`Error procesando ${imageName}:`, error);
      }
    }

    // 2. Crear el terreno demo (ajustado a estructura real de la tabla)
    // Imágenes 360° de ejemplo (usando URLs públicas de demostración)
    const demoImageUrls = [
      'https://pannellum.org/images/alma-chch.jpg',
      'https://pannellum.org/images/exalted-plains.jpg',
      'https://pannellum.org/images/cerro-toco-0.jpg',
    ];

    const { data: terrainData, error: terrainError } = await supabase
      .from('terrenos')
      .insert({
        user_id: userId,
        title: '🎓 Tour Demo - Terreno en Boca de Tomatlán',
        description:
          'Este es un tour de demostración para que explores las funcionalidades de la plataforma. Incluye hotspots de navegación y está configurado como ejemplo.',
        image_urls: demoImageUrls, // ✅ Array que Supabase convierte a JSONB automáticamente
        total_square_meters: 5000,
        land_use: 'Residencial/Turístico',
        google_maps_link: 'https://maps.app.goo.gl/BocaDeTomatlan', // Alternativa a location
        sale_price: '2500000', // ✅ String porque la columna es TEXT
        price_per_sqm: 500,
        property_type: 'terreno',
        is_marketplace_listing: false, // ❌ No publicar en marketplace
        status: 'demo', // Estado especial para tours demo
        // created_at se omite - la BD lo genera automáticamente con now()
      })
      .select()
      .single();

    if (terrainError) {
      console.error('❌ Error al crear terreno demo:', terrainError);
      return { success: false, error: terrainError.message };
    }

    console.log('✅ Terreno demo creado:', terrainData.id);
    console.log('📸 Image URLs guardadas:', terrainData.image_urls);
    console.log(
      '🔍 Tipo de image_urls:',
      typeof terrainData.image_urls,
      Array.isArray(terrainData.image_urls),
    );

    // 3. Crear hotspots de ejemplo para navegación entre vistas
    const demoHotspots = [
      {
        terreno_id: terrainData.id,
        title: 'Ir a Vista Entrada',
        position_yaw: 0,
        position_pitch: 0,
        panorama_index: 0,
        target_panorama_index: 1,
      },
      {
        terreno_id: terrainData.id,
        title: 'Vista del Terreno',
        position_yaw: 1.5,
        position_pitch: -0.2,
        panorama_index: 1,
        target_panorama_index: 2,
      },
      {
        terreno_id: terrainData.id,
        title: 'Volver al Inicio',
        position_yaw: -1.5,
        position_pitch: 0,
        panorama_index: 2,
        target_panorama_index: 0,
      },
    ];

    const { error: hotspotsError } = await supabase
      .from('hotspots')
      .insert(demoHotspots);

    if (hotspotsError) {
      console.warn('⚠️ Error al crear hotspots demo:', hotspotsError);
      // No es crítico, continuar de todos modos
    } else {
      console.log('✅ Hotspots demo creados');
    }

    return {
      success: true,
      terrainId: terrainData.id,
    };
  } catch (error) {
    console.error('❌ Error general al crear tour demo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Verifica si el usuario ya tiene un tour demo
 */
export async function hasDemoTour(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('terrenos')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'demo')
      .limit(1);

    if (error) {
      console.error('Error verificando tour demo:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  } catch (error) {
    console.error('Error en hasDemoTour:', error);
    return false;
  }
}

/**
 * Elimina el tour demo del usuario (para limpiar después de completar el onboarding)
 */
export async function deleteDemoTour(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Primero, obtener el ID del tour demo
    const { data: demoTours } = await supabase
      .from('terrenos')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'demo');

    if (!demoTours || demoTours.length === 0) {
      return true; // Ya no existe, considerar éxito
    }

    const demoId = demoTours[0].id;

    // Eliminar hotspots asociados
    await supabase.from('hotspots').delete().eq('terreno_id', demoId);

    // Eliminar el terreno
    const { error } = await supabase.from('terrenos').delete().eq('id', demoId);

    if (error) {
      console.error('Error eliminando tour demo:', error);
      return false;
    }

    console.log('✅ Tour demo eliminado correctamente');
    return true;
  } catch (error) {
    console.error('Error en deleteDemoTour:', error);
    return false;
  }
}
