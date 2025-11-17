import { supabase } from './supabaseClient';

// Obtener hotspots de un terreno
export async function getHotspotsByTerreno(terrenoId) {
  const { data, error } = await supabase
    .from('hotspots')
    .select('*')
    .eq('terreno_id', terrenoId)
    .order('panorama_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Crear hotspot con soporte multimedia y backlink automático
export async function createHotspot(hotspot) {
  const dbHotspot = {
    terreno_id: hotspot.terreno_id,
    panorama_index: hotspot.panorama_index,
    position_yaw: hotspot.yaw,
    position_pitch: hotspot.pitch,
    title: hotspot.title,
    image_url: null,
    target_panorama_index: hotspot.link_to_panorama,

    // ✅ Nuevos campos multimedia
    hotspot_type: hotspot.type || 'navigation',
    content_text: hotspot.content_text || null,
    content_images: hotspot.content_images || null,
    content_video_url: hotspot.content_video_url || null,
    content_video_thumbnail: hotspot.content_video_thumbnail || null,

    // ✅ Audio dual (ambiente + narración)
    audio_ambient_url: hotspot.audio_ambient_url || null,
    audio_ambient_volume: hotspot.audio_ambient_volume || 0.3,
    audio_ambient_loop: hotspot.audio_ambient_loop !== false, // Default true
    audio_narration_url: hotspot.audio_narration_url || null,
    audio_narration_volume: hotspot.audio_narration_volume || 0.7,
    audio_autoplay: hotspot.audio_autoplay || false,

    // ✅ Backlink automático
    create_backlink: hotspot.create_backlink !== false, // Default true

    // ✅ Icono personalizado
    custom_icon_url: hotspot.custom_icon_url || null,
    icon_size: hotspot.icon_size || 40,
  };

  const { data, error } = await supabase
    .from('hotspots')
    .insert([dbHotspot])
    .select()
    .single();

  if (error) throw error;

  // ✅ Crear backlink automático si está habilitado y es tipo navegación
  if (
    data &&
    dbHotspot.create_backlink &&
    dbHotspot.hotspot_type === 'navigation' &&
    dbHotspot.target_panorama_index !== null
  ) {
    await createBacklink(data, hotspot);
  }

  return data;
}

// ✅ Crear hotspot de regreso automático
async function createBacklink(originalHotspot, originalData) {
  try {
    const backlinkHotspot = {
      terreno_id: originalHotspot.terreno_id,
      panorama_index: originalHotspot.target_panorama_index, // Vista destino
      position_yaw: originalHotspot.position_yaw + Math.PI, // Dirección opuesta
      position_pitch: originalHotspot.position_pitch,
      title: `← Volver a ${originalData.from_view_name || 'vista anterior'}`,
      target_panorama_index: originalHotspot.panorama_index, // Volver a origen
      hotspot_type: 'navigation',
      create_backlink: false, // No crear backlink del backlink (evitar loop)
      backlink_id: null, // Se actualizará después
    };

    const { data: backlink, error } = await supabase
      .from('hotspots')
      .insert([backlinkHotspot])
      .select()
      .single();

    if (error) throw error;

    // Actualizar el hotspot original con el ID del backlink
    await supabase
      .from('hotspots')
      .update({ backlink_id: backlink.id })
      .eq('id', originalHotspot.id);

    console.log('✅ Backlink creado automáticamente:', backlink.id);
    return backlink;
  } catch (error) {
    console.error('⚠️ Error al crear backlink:', error);
    // No lanzar error, el hotspot principal ya se creó
  }
}

// Actualizar hotspot con soporte multimedia completo
export async function updateHotspot(id, updates) {
  const dbUpdates = {
    title: updates.title,
    position_yaw: updates.yaw || updates.position_yaw,
    position_pitch: updates.pitch || updates.position_pitch,
    target_panorama_index: updates.link_to_panorama,

    // ✅ Campos multimedia
    hotspot_type: updates.type || updates.hotspot_type,
    content_text: updates.content_text,
    content_images: updates.content_images,
    content_video_url: updates.content_video_url,
    content_video_thumbnail: updates.content_video_thumbnail,

    // ✅ Audio dual
    audio_ambient_url: updates.audio_ambient_url,
    audio_ambient_volume: updates.audio_ambient_volume,
    audio_ambient_loop: updates.audio_ambient_loop,
    audio_narration_url: updates.audio_narration_url,
    audio_narration_volume: updates.audio_narration_volume,
    audio_autoplay: updates.audio_autoplay,

    // ✅ Configuración de backlink
    create_backlink: updates.create_backlink,

    // ✅ Icono personalizado
    custom_icon_url: updates.custom_icon_url,
    icon_size: updates.icon_size,
  };

  // Remover campos undefined para no sobrescribir con null accidentalmente
  Object.keys(dbUpdates).forEach(
    (key) => dbUpdates[key] === undefined && delete dbUpdates[key]
  );

  const { data, error } = await supabase
    .from('hotspots')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Eliminar hotspot y su backlink asociado
export async function deleteHotspot(id) {
  try {
    // Obtener el hotspot para ver si tiene backlink
    const { data: hotspot } = await supabase
      .from('hotspots')
      .select('backlink_id')
      .eq('id', id)
      .single();

    // Eliminar el hotspot principal
    const { error } = await supabase.from('hotspots').delete().eq('id', id);

    if (error) throw error;

    // Si tenía backlink, eliminarlo también
    if (hotspot?.backlink_id) {
      await supabase.from('hotspots').delete().eq('id', hotspot.backlink_id);
      console.log('✅ Backlink eliminado automáticamente:', hotspot.backlink_id);
    }

    return true;
  } catch (error) {
    console.error('Error al eliminar hotspot:', error);
    throw error;
  }
}

// ==================== FUNCIONES HELPER ====================

// Obtener hotspots por tipo
export async function getHotspotsByType(terrenoId, type) {
  const { data, error } = await supabase
    .from('hotspots')
    .select('*')
    .eq('terreno_id', terrenoId)
    .eq('hotspot_type', type)
    .order('panorama_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Obtener hotspots de una panorama específica
export async function getHotspotsByPanorama(terrenoId, panoramaIndex) {
  const { data, error } = await supabase
    .from('hotspots')
    .select('*')
    .eq('terreno_id', terrenoId)
    .eq('panorama_index', panoramaIndex);

  if (error) throw error;
  return data || [];
}

// Transformar hotspot de DB a formato de aplicación
export function transformHotspotFromDB(dbHotspot) {
  return {
    id: dbHotspot.id,
    terreno_id: dbHotspot.terreno_id,
    panorama_index: dbHotspot.panorama_index,
    yaw: dbHotspot.position_yaw,
    pitch: dbHotspot.position_pitch,
    title: dbHotspot.title,
    link_to_panorama: dbHotspot.target_panorama_index,

    // Campos multimedia
    type: dbHotspot.hotspot_type,
    content_text: dbHotspot.content_text,
    content_images: dbHotspot.content_images,
    content_video_url: dbHotspot.content_video_url,
    content_video_thumbnail: dbHotspot.content_video_thumbnail,

    // Audio
    audio_ambient_url: dbHotspot.audio_ambient_url,
    audio_ambient_volume: dbHotspot.audio_ambient_volume,
    audio_ambient_loop: dbHotspot.audio_ambient_loop,
    audio_narration_url: dbHotspot.audio_narration_url,
    audio_narration_volume: dbHotspot.audio_narration_volume,
    audio_autoplay: dbHotspot.audio_autoplay,

    // Backlink
    create_backlink: dbHotspot.create_backlink,
    backlink_id: dbHotspot.backlink_id,

    // Icono
    custom_icon_url: dbHotspot.custom_icon_url,
    icon_size: dbHotspot.icon_size,
  };
}

// Validar URL de archivo multimedia
export function validateMediaUrl(url, type = 'image') {
  if (!url) return null;

  const validExtensions = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    video: ['.mp4', '.webm', '.ogg'],
    audio: ['.mp3', '.wav', '.ogg', '.m4a'],
  };

  const ext = url.toLowerCase().slice(url.lastIndexOf('.'));
  return validExtensions[type]?.includes(ext) ? url : null;
}

// Contar hotspots por tipo
export async function getHotspotStats(terrenoId) {
  const { data, error } = await supabase
    .from('hotspots')
    .select('hotspot_type')
    .eq('terreno_id', terrenoId);

  if (error) throw error;

  const stats = {
    total: data.length,
    navigation: 0,
    info: 0,
    image: 0,
    video: 0,
    audio: 0,
  };

  data.forEach((h) => {
    if (stats[h.hotspot_type] !== undefined) {
      stats[h.hotspot_type]++;
    }
  });

  return stats;
}
