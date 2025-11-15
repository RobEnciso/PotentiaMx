-- ============================================
-- PASO 4: VERIFICAR TOUR DEMO Y SU CONTENIDO
-- ============================================

-- 1. Verificar que el tour demo existe y tiene metadata
SELECT
  id,
  title,
  user_id,
  metadata,
  image_urls,
  created_at
FROM terrenos
WHERE id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';

-- 2. Ver cuántas imágenes tiene el tour demo
SELECT
  id,
  title,
  jsonb_array_length(image_urls) as cantidad_imagenes,
  image_urls
FROM terrenos
WHERE id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';

-- 3. Ver hotspots del tour demo (si tiene)
SELECT
  id,
  terreno_id,
  panorama_index,
  title,
  target_panorama_index
FROM hotspots
WHERE terreno_id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf'
ORDER BY panorama_index, id;

-- 4. Verificar que el tour demo tiene user_id (necesario para RLS)
SELECT
  CASE
    WHEN user_id IS NULL THEN 'ERROR: El tour demo NO tiene user_id asignado'
    ELSE 'OK: El tour demo tiene user_id: ' || user_id
  END as verificacion
FROM terrenos
WHERE id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';
