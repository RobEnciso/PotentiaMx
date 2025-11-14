-- =====================================================
-- AUDITORÍA COMPLETA DE SUPABASE - POTENTIAMX
-- =====================================================
-- Este script revisa toda la información en la base de datos
-- para identificar qué terrenos deberían aparecer en marketplace
-- =====================================================

-- =====================================================
-- 1. USUARIOS REGISTRADOS
-- =====================================================
SELECT
  '=== USUARIOS REGISTRADOS ===' as seccion;

SELECT
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- =====================================================
-- 2. TODOS LOS TERRENOS (SIN FILTROS)
-- =====================================================
SELECT
  '=== TODOS LOS TERRENOS ===' as seccion;

SELECT
  id,
  title,
  user_id,
  status,
  is_marketplace_listing,
  latitude,
  longitude,
  created_at,
  CASE
    WHEN is_marketplace_listing = true AND status = 'active' THEN '✅ DEBERÍA APARECER EN MARKETPLACE'
    WHEN is_marketplace_listing = true AND status != 'active' THEN '⚠️ Marketplace pero NO activo'
    WHEN is_marketplace_listing = false AND status = 'active' THEN '⚠️ Activo pero NO en marketplace'
    ELSE '❌ NO debería aparecer'
  END as estado_marketplace,
  CASE
    WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN '✅ Tiene coordenadas'
    ELSE '❌ SIN coordenadas'
  END as estado_coordenadas,
  CASE
    WHEN is_marketplace_listing = true
      AND status = 'active'
      AND latitude IS NOT NULL
      AND longitude IS NOT NULL THEN '✅✅ VISIBLE EN MAPA'
    ELSE '❌ NO visible en mapa'
  END as visible_en_mapa
FROM terrenos
ORDER BY created_at DESC;

-- =====================================================
-- 3. RESUMEN POR ESTADO
-- =====================================================
SELECT
  '=== RESUMEN POR ESTADO ===' as seccion;

SELECT
  status,
  is_marketplace_listing,
  COUNT(*) as cantidad,
  COUNT(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 END) as con_coordenadas,
  COUNT(CASE WHEN latitude IS NULL OR longitude IS NULL THEN 1 END) as sin_coordenadas
FROM terrenos
GROUP BY status, is_marketplace_listing
ORDER BY status, is_marketplace_listing;

-- =====================================================
-- 4. TERRENOS QUE DEBERÍAN APARECER EN MARKETPLACE
-- =====================================================
SELECT
  '=== TERRENOS QUE DEBERÍAN APARECER EN MARKETPLACE ===' as seccion;

SELECT
  id,
  title,
  user_id,
  status,
  is_marketplace_listing,
  latitude,
  longitude,
  sale_price,
  total_square_meters,
  created_at,
  CASE
    WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN '✅ APARECERÁ EN MAPA'
    ELSE '❌ NO APARECERÁ (sin coordenadas)'
  END as aparece_en_mapa
FROM terrenos
WHERE is_marketplace_listing = true
  AND status = 'active'
ORDER BY created_at DESC;

-- =====================================================
-- 5. TERRENOS OCULTOS (NO EN MARKETPLACE)
-- =====================================================
SELECT
  '=== TERRENOS OCULTOS (NO EN MARKETPLACE) ===' as seccion;

SELECT
  id,
  title,
  user_id,
  status,
  is_marketplace_listing,
  created_at,
  CASE
    WHEN status != 'active' THEN 'Status no es "active"'
    WHEN is_marketplace_listing = false THEN 'is_marketplace_listing = false'
    ELSE 'Otro motivo'
  END as razon_oculto
FROM terrenos
WHERE NOT (is_marketplace_listing = true AND status = 'active')
ORDER BY created_at DESC;

-- =====================================================
-- 6. TERRENOS SIN COORDENADAS
-- =====================================================
SELECT
  '=== TERRENOS SIN COORDENADAS ===' as seccion;

SELECT
  id,
  title,
  user_id,
  status,
  is_marketplace_listing,
  created_at
FROM terrenos
WHERE latitude IS NULL OR longitude IS NULL
ORDER BY created_at DESC;

-- =====================================================
-- 7. HOTSPOTS (PARA VER SI HAY DATOS HUÉRFANOS)
-- =====================================================
SELECT
  '=== HOTSPOTS TOTALES ===' as seccion;

SELECT
  COUNT(*) as total_hotspots,
  COUNT(DISTINCT terreno_id) as terrenos_con_hotspots
FROM hotspots;

-- Ver hotspots huérfanos (sin terreno asociado)
SELECT
  '=== HOTSPOTS HUÉRFANOS ===' as seccion;

SELECT
  h.id,
  h.terreno_id,
  h.title,
  h.created_at
FROM hotspots h
LEFT JOIN terrenos t ON h.terreno_id = t.id
WHERE t.id IS NULL;

-- =====================================================
-- 8. STORAGE - ESPACIO UTILIZADO
-- =====================================================
SELECT
  '=== INFORMACIÓN DE STORAGE ===' as seccion;

-- Esta query aproxima el espacio usado (necesitarás ejecutar esto en la consola de Supabase Storage)
SELECT
  bucket_id,
  COUNT(*) as archivos_totales
FROM storage.objects
GROUP BY bucket_id;

-- =====================================================
-- 9. USER_PROFILES
-- =====================================================
SELECT
  '=== USER PROFILES ===' as seccion;

SELECT
  up.id,
  au.email,
  up.display_name,
  up.created_at,
  COUNT(t.id) as terrenos_totales
FROM user_profiles up
LEFT JOIN auth.users au ON au.id = up.id
LEFT JOIN terrenos t ON t.user_id = up.id
GROUP BY up.id, au.email, up.display_name, up.created_at
ORDER BY up.created_at DESC;

-- =====================================================
-- 10. RECOMENDACIONES DE LIMPIEZA
-- =====================================================
SELECT
  '=== RECOMENDACIONES DE LIMPIEZA ===' as seccion;

-- Terrenos de prueba para eliminar (draft o sin datos importantes)
SELECT
  id,
  title,
  status,
  created_at,
  '🗑️ CANDIDATO PARA ELIMINAR: Status draft' as recomendacion
FROM terrenos
WHERE status = 'draft'
  AND created_at < NOW() - INTERVAL '7 days'
ORDER BY created_at;

-- =====================================================
-- RESUMEN FINAL
-- =====================================================
SELECT
  '=== RESUMEN FINAL ===' as seccion;

SELECT
  'Total de usuarios' as metrica,
  COUNT(*) as valor
FROM auth.users
UNION ALL
SELECT
  'Total de terrenos',
  COUNT(*)
FROM terrenos
UNION ALL
SELECT
  'Terrenos en marketplace (activos)',
  COUNT(*)
FROM terrenos
WHERE is_marketplace_listing = true AND status = 'active'
UNION ALL
SELECT
  'Terrenos visibles en mapa (con coordenadas)',
  COUNT(*)
FROM terrenos
WHERE is_marketplace_listing = true
  AND status = 'active'
  AND latitude IS NOT NULL
  AND longitude IS NOT NULL
UNION ALL
SELECT
  'Terrenos draft (prueba)',
  COUNT(*)
FROM terrenos
WHERE status = 'draft'
UNION ALL
SELECT
  'Total de hotspots',
  COUNT(*)
FROM hotspots
UNION ALL
SELECT
  'User profiles',
  COUNT(*)
FROM user_profiles;

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Ejecuta TODO este script en Supabase SQL Editor
-- 2. Revisa cada sección para entender el estado actual
-- 3. Identifica terrenos que deberían aparecer pero no aparecen
-- 4. Identifica datos de prueba para limpiar
-- 5. Después te ayudo a crear scripts de limpieza si lo necesitas
-- =====================================================
