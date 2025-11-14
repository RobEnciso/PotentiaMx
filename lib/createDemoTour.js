/**
 * Crea un tour demo personal para nuevos usuarios
 * Estilo Pixieset: El usuario tiene contenido de ejemplo precargado
 * que puede editar, modificar o eliminar
 */

import { createClient } from '@supabase/supabase-js';

// Cliente admin de Supabase (para crear tours)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Datos del tour demo oficial (el que usaremos como plantilla)
const DEMO_TOUR_ID = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';

/**
 * Crea un tour demo personal para un usuario nuevo
 * @param {string} userId - ID del usuario
 * @param {string} userEmail - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @returns {Promise<{success: boolean, tourId?: string, error?: string}>}
 */
export async function createPersonalDemoTour(userId, userEmail, userName) {
  try {
    console.log(`🎨 Creando tour demo personal para ${userEmail}...`);

    // 1. Obtener datos del tour demo oficial
    const { data: demoTour, error: demoError } = await supabaseAdmin
      .from('terrenos')
      .select('*')
      .eq('id', DEMO_TOUR_ID)
      .single();

    if (demoError || !demoTour) {
      console.error('❌ Error obteniendo tour demo:', demoError);
      return { success: false, error: 'Tour demo no encontrado' };
    }

    // 2. Obtener hotspots del tour demo
    const { data: demoHotspots, error: hotspotsError } = await supabaseAdmin
      .from('hotspots')
      .select('*')
      .eq('terreno_id', DEMO_TOUR_ID);

    if (hotspotsError) {
      console.warn('⚠️ Error obteniendo hotspots del demo:', hotspotsError);
      // Continuar sin hotspots
    }

    // 3. Crear nuevo tour personal (copia del demo)
    const personalTour = {
      user_id: userId,
      contact_email: userEmail,
      title: `Mi Primer Tour - Ejemplo`,
      description:
        demoTour.description ||
        'Tour de ejemplo precargado. Puedes editarlo o eliminarlo y crear el tuyo propio.',
      location: demoTour.location || 'Ubicación de ejemplo',
      price: demoTour.price || 0,
      size: demoTour.size || 0,
      bedrooms: demoTour.bedrooms || 0,
      bathrooms: demoTour.bathrooms || 0,
      image_urls: demoTour.image_urls || [], // Mismas imágenes del demo
      status: demoTour.status || 'active',
      // Metadata para identificar que es un tour demo personal
      metadata: {
        is_demo: true,
        created_from: 'demo_template',
        original_demo_id: DEMO_TOUR_ID,
        created_at: new Date().toISOString(),
      },
    };

    const { data: newTour, error: createError } = await supabaseAdmin
      .from('terrenos')
      .insert([personalTour])
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creando tour personal:', createError);
      return { success: false, error: createError.message };
    }

    console.log(`✅ Tour demo personal creado: ${newTour.id}`);

    // 4. Copiar hotspots al nuevo tour (si existen)
    if (demoHotspots && demoHotspots.length > 0) {
      const personalHotspots = demoHotspots.map((hotspot) => ({
        terreno_id: newTour.id, // Nuevo tour ID
        panorama_index: hotspot.panorama_index,
        position_yaw: hotspot.position_yaw,
        position_pitch: hotspot.position_pitch,
        title: hotspot.title,
        target_panorama_index: hotspot.target_panorama_index,
        image_url: hotspot.image_url,
      }));

      const { error: hotspotsInsertError } = await supabaseAdmin
        .from('hotspots')
        .insert(personalHotspots);

      if (hotspotsInsertError) {
        console.warn('⚠️ Error copiando hotspots:', hotspotsInsertError);
        // No fallar, el tour ya está creado
      } else {
        console.log(`✅ ${personalHotspots.length} hotspots copiados`);
      }
    }

    return { success: true, tourId: newTour.id };
  } catch (exception) {
    console.error('❌ Excepción creando tour demo personal:', exception);
    return { success: false, error: exception.message };
  }
}
