-- Actualizar función RPC para soportar campos multimedia en hotspots
-- Esta función reemplaza todos los hotspots de un terreno con nuevos datos

DROP FUNCTION IF EXISTS update_hotspots_for_terrain(UUID, JSONB);

CREATE OR REPLACE FUNCTION update_hotspots_for_terrain(
  terrain_id_to_update UUID,
  hotspots_data JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Eliminar todos los hotspots existentes de este terreno
  DELETE FROM hotspots WHERE terreno_id = terrain_id_to_update;

  -- 2. Insertar los nuevos hotspots con todos los campos multimedia
  INSERT INTO hotspots (
    terreno_id,
    title,
    position_yaw,
    position_pitch,
    panorama_index,
    target_panorama_index,
    -- Campos multimedia
    hotspot_type,
    content_text,
    content_images,
    content_video_url,
    content_video_thumbnail,
    audio_ambient_url,
    audio_ambient_volume,
    audio_ambient_loop,
    audio_narration_url,
    audio_narration_volume,
    audio_autoplay,
    create_backlink,
    custom_icon_url,
    icon_size
  )
  SELECT
    terrain_id_to_update,
    (hotspot->>'title')::TEXT,
    (hotspot->>'position_yaw')::DOUBLE PRECISION,
    (hotspot->>'position_pitch')::DOUBLE PRECISION,
    (hotspot->>'panorama_index')::INTEGER,
    (hotspot->>'target_panorama_index')::INTEGER,
    -- Campos multimedia con valores por defecto
    COALESCE((hotspot->>'hotspot_type')::TEXT, 'navigation'),
    (hotspot->>'content_text')::TEXT,
    CASE
      WHEN hotspot->'content_images' IS NOT NULL AND hotspot->'content_images' != 'null'::jsonb
      THEN ARRAY(SELECT jsonb_array_elements_text(hotspot->'content_images'))
      ELSE NULL
    END,
    (hotspot->>'content_video_url')::TEXT,
    (hotspot->>'content_video_thumbnail')::TEXT,
    (hotspot->>'audio_ambient_url')::TEXT,
    COALESCE((hotspot->>'audio_ambient_volume')::DECIMAL(3,2), 0.3),
    COALESCE((hotspot->>'audio_ambient_loop')::BOOLEAN, true),
    (hotspot->>'audio_narration_url')::TEXT,
    COALESCE((hotspot->>'audio_narration_volume')::DECIMAL(3,2), 0.7),
    COALESCE((hotspot->>'audio_autoplay')::BOOLEAN, false),
    COALESCE((hotspot->>'create_backlink')::BOOLEAN, true),
    (hotspot->>'custom_icon_url')::TEXT,
    COALESCE((hotspot->>'icon_size')::INTEGER, 40)
  FROM jsonb_array_elements(hotspots_data) AS hotspot;
END;
$$;

-- Comentario de documentación
COMMENT ON FUNCTION update_hotspots_for_terrain(UUID, JSONB) IS
'Reemplaza todos los hotspots de un terreno con nuevos datos. Soporta campos multimedia (info, image, video, audio).';

-- Verificar que la función fue creada correctamente
SELECT
  p.proname AS function_name,
  pg_get_function_arguments(p.oid) AS arguments,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'update_hotspots_for_terrain'
  AND n.nspname = 'public';
