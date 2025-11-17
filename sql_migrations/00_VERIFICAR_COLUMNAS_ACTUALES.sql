-- ========================================
-- SCRIPT DE VERIFICACIÓN
-- Ejecuta esto PRIMERO para ver qué columnas ya existen
-- ========================================

-- 1. Ver todas las columnas de la tabla TERRENOS
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'terrenos'
ORDER BY ordinal_position;

-- 2. Ver todas las columnas de la tabla HOTSPOTS
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'hotspots'
ORDER BY ordinal_position;

-- 3. Verificar columnas específicas de AUDIO en terrenos
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'terrenos'
  AND (
    column_name LIKE '%audio%'
    OR column_name LIKE '%view_%'
    OR column_name LIKE '%narration%'
  );

-- 4. Verificar columnas específicas de MULTIMEDIA en hotspots
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'hotspots'
  AND (
    column_name LIKE '%content%'
    OR column_name LIKE '%audio%'
    OR column_name LIKE '%video%'
    OR column_name LIKE '%hotspot_type%'
    OR column_name LIKE '%icon%'
  );

-- ========================================
-- RESULTADOS ESPERADOS:
-- ========================================

-- TERRENOS debería tener:
-- - id
-- - title
-- - image_urls
-- - created_at
-- - user_id
-- - view_names
-- - marker_style
-- - contact_type
-- - contact_phone
-- - contact_email
-- Y POSIBLEMENTE (si ya se aplicaron migraciones):
-- - view_ambient_audio
-- - view_ambient_volume
-- - view_narration_audio
-- - view_narration_volume
-- - view_audio_autoplay

-- HOTSPOTS debería tener:
-- - id
-- - terreno_id
-- - title
-- - position_yaw
-- - position_pitch
-- - panorama_index
-- - target_panorama_index
-- - image_url (antigua - puede estar)
-- Y POSIBLEMENTE (si ya se aplicaron migraciones):
-- - hotspot_type
-- - content_text
-- - content_images
-- - content_video_url
-- - content_video_thumbnail
-- - audio_ambient_url
-- - audio_ambient_volume
-- - audio_ambient_loop
-- - audio_narration_url
-- - audio_narration_volume
-- - audio_autoplay
-- - create_backlink
-- - custom_icon_url
-- - icon_size
