/**
 * Polygons Service - CRUD operations for boundary polygons
 * Handles database operations for polygon markers in 360° views
 */

import { createClient } from './supabaseClient';

/**
 * Get polygons for a specific panorama view
 * @param {string} terrenoId - UUID of the terreno
 * @param {number} panoramaIndex - Index of the 360° view (0, 1, 2...)
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getPolygonsByPanorama(terrenoId, panoramaIndex) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('polygons')
    .select('*')
    .eq('terreno_id', terrenoId)
    .eq('panorama_index', panoramaIndex)
    .eq('visible', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching panorama polygons:', error);
  } else {
    console.log(`✅ Loaded ${data?.length || 0} polygons for panorama ${panoramaIndex}`);
  }

  return { data, error };
}

/**
 * Create a new polygon
 * @param {Object} polygon - Polygon data
 * @param {string} polygon.terrenoId - UUID of the terreno
 * @param {number} polygon.panoramaIndex - Index of the 360° view
 * @param {Array} polygon.points - Array of points [{yaw:"Xrad", pitch:"Yrad"}]
 * @param {string} [polygon.name] - Optional name
 * @param {string} [polygon.color] - Hex color (default: #00ff00)
 * @param {number} [polygon.fillOpacity] - Fill opacity 0-1 (default: 0.3)
 * @param {number} [polygon.strokeWidth] - Border width in px (default: 5)
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function createPolygon(polygon) {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('❌ User not authenticated');
    return {
      data: null,
      error: new Error('User not authenticated'),
    };
  }

  // Validate required fields
  if (!polygon.terrenoId || polygon.panoramaIndex === undefined || !polygon.points) {
    console.error('❌ Missing required fields:', { polygon });
    return {
      data: null,
      error: new Error('Missing required fields: terrenoId, panoramaIndex, points'),
    };
  }

  // Validate points format
  if (!Array.isArray(polygon.points) || polygon.points.length < 3) {
    console.error('❌ Invalid points:', polygon.points);
    return {
      data: null,
      error: new Error('Points must be an array with at least 3 points'),
    };
  }

  console.log('📝 Creating polygon:', {
    terrenoId: polygon.terrenoId,
    panoramaIndex: polygon.panoramaIndex,
    pointsCount: polygon.points.length,
    name: polygon.name || 'Sin nombre',
  });

  const { data, error } = await supabase
    .from('polygons')
    .insert({
      terreno_id: polygon.terrenoId,
      panorama_index: polygon.panoramaIndex,
      points: polygon.points,
      name: polygon.name || null,
      description: polygon.description || null,
      color: polygon.color || '#FFFFFF',
      fill_opacity: polygon.fillOpacity !== undefined ? polygon.fillOpacity : 0.15,
      stroke_width: polygon.strokeWidth || 2,
      visible: true,
      z_index: 5,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating polygon:', error);
  } else {
    console.log('✅ Polygon created successfully:', {
      id: data.id,
      panoramaIndex: data.panorama_index,
      pointsCount: data.points.length,
    });
  }

  return { data, error };
}

/**
 * Delete a polygon
 * @param {number} id - Polygon ID
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function deletePolygon(id) {
  const supabase = createClient();

  console.log(`🗑️ Deleting polygon ID: ${id}`);

  const { data, error } = await supabase.from('polygons').delete().eq('id', id).select().single();

  if (error) {
    console.error('❌ Error deleting polygon:', error);
  } else {
    console.log('✅ Polygon deleted:', data);
  }

  return { data, error };
}

/**
 * Delete all polygons for a specific panorama view
 * @param {string} terrenoId - UUID of the terreno
 * @param {number} panoramaIndex - Index of the 360° view
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function deletePolygonsByPanorama(terrenoId, panoramaIndex) {
  const supabase = createClient();

  console.log(`🗑️ Deleting all polygons from panorama ${panoramaIndex}`);

  const { data, error } = await supabase
    .from('polygons')
    .delete()
    .eq('terreno_id', terrenoId)
    .eq('panorama_index', panoramaIndex)
    .select();

  if (error) {
    console.error('❌ Error deleting panorama polygons:', error);
  } else {
    console.log(`✅ Deleted ${data?.length || 0} polygons from panorama ${panoramaIndex}`);
  }

  return { data, error };
}
