/**
 * Text Labels Service - Sistema de etiquetas de texto flotantes en 360°
 * Reutiliza la infraestructura de polygonsService para almacenar posiciones
 * Un label es un "polígono de 1 punto" con metadata especial
 */

import { createPolygon, deletePolygon } from './polygonsService';

/**
 * Create a text label at a specific position in the 360° view
 * @param {Object} label - Label configuration
 * @param {string} label.terrenoId - UUID of the terreno
 * @param {number} label.panoramaIndex - Index of the 360° view (0, 1, 2...)
 * @param {number} label.yaw - Horizontal position in radians
 * @param {number} label.pitch - Vertical position in radians
 * @param {string} label.text - Label text to display
 * @param {number} [label.fontSize] - Font size in pixels (default: 14)
 * @param {string} [label.color] - Text color (default: #FFFFFF)
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function createTextLabel(label) {
  // Validar campos requeridos
  if (!label.terrenoId || label.panoramaIndex === undefined || !label.text) {
    console.error('❌ Missing required fields for text label:', { label });
    return {
      data: null,
      error: new Error('Missing required fields: terrenoId, panoramaIndex, text'),
    };
  }

  if (label.yaw === undefined || label.pitch === undefined) {
    console.error('❌ Missing position (yaw/pitch) for text label');
    return {
      data: null,
      error: new Error('Missing position: yaw and pitch are required'),
    };
  }

  console.log('🏷️ Creating text label:', {
    terrenoId: label.terrenoId,
    panoramaIndex: label.panoramaIndex,
    text: label.text,
    position: { yaw: label.yaw, pitch: label.pitch },
  });

  // Metadata especial para identificar como text label
  const labelMetadata = {
    type: 'text_label',
    fontSize: label.fontSize || 14,
    textColor: label.color || '#FFFFFF',
  };

  // Crear "polígono de 1 punto" que representa el label
  const polygonData = {
    terrenoId: label.terrenoId,
    panoramaIndex: label.panoramaIndex,
    points: [
      {
        yaw: `${label.yaw}rad`,
        pitch: `${label.pitch}rad`,
      },
    ],
    name: label.text, // El texto del label se guarda en 'name'
    description: JSON.stringify(labelMetadata), // Metadata en JSON
    color: label.color || '#FFFFFF',
    fillOpacity: 0, // Labels no tienen relleno
    strokeWidth: 0, // Labels no tienen borde
  };

  const result = await createPolygon(polygonData);

  if (result.error) {
    console.error('❌ Error creating text label:', result.error);
  } else {
    console.log('✅ Text label created successfully:', {
      id: result.data.id,
      text: result.data.name,
    });
  }

  return result;
}

/**
 * Delete a text label
 * @param {number} id - Label ID (same as polygon ID)
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function deleteTextLabel(id) {
  console.log(`🗑️ Deleting text label ID: ${id}`);
  return deletePolygon(id);
}

/**
 * Check if a polygon is a text label
 * @param {Object} polygon - Polygon object from database
 * @returns {boolean}
 */
export function isTextLabel(polygon) {
  if (!polygon.description) return false;

  try {
    const metadata = JSON.parse(polygon.description);
    return metadata.type === 'text_label';
  } catch {
    return false;
  }
}

/**
 * Extract text label metadata from polygon
 * @param {Object} polygon - Polygon object from database
 * @returns {Object|null} - Label metadata or null if not a label
 */
export function getLabelMetadata(polygon) {
  if (!isTextLabel(polygon)) return null;

  try {
    const metadata = JSON.parse(polygon.description);
    return {
      text: polygon.name,
      fontSize: metadata.fontSize || 14,
      color: metadata.textColor || polygon.color || '#FFFFFF',
      position:
        polygon.points && polygon.points.length > 0
          ? {
              yaw: parseFloat(polygon.points[0].yaw),
              pitch: parseFloat(polygon.points[0].pitch),
            }
          : null,
    };
  } catch (err) {
    console.error('❌ Error parsing label metadata:', err);
    return null;
  }
}
