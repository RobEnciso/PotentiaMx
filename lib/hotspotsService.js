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

// Crear hotspot
export async function createHotspot(hotspot) {
  const dbHotspot = {
    terreno_id: hotspot.terreno_id,
    panorama_index: hotspot.panorama_index,
    position_yaw: hotspot.yaw,
    position_pitch: hotspot.pitch,
    title: hotspot.title,
    image_url: null,
    target_panorama_index: hotspot.link_to_panorama,
  };

  const { data, error } = await supabase
    .from('hotspots')
    .insert([dbHotspot])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Actualizar hotspot
export async function updateHotspot(id, updates) {
  const dbUpdates = {
    title: updates.title,
    position_yaw: updates.yaw || updates.position_yaw,
    position_pitch: updates.pitch || updates.position_pitch,
    target_panorama_index: updates.link_to_panorama,
  };

  const { data, error } = await supabase
    .from('hotspots')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Eliminar hotspot
export async function deleteHotspot(id) {
  const { error } = await supabase.from('hotspots').delete().eq('id', id);

  if (error) throw error;
  return true;
}
