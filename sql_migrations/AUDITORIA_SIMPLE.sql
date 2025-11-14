-- =====================================================
-- AUDITORÍA SIMPLE - SOLO LO ESENCIAL
-- =====================================================
-- Script simplificado que usa solo columnas que sabemos que existen
-- =====================================================

-- 1. USUARIOS REGISTRADOS
SELECT '=== USUARIOS REGISTRADOS ===' as seccion;

SELECT
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. TODOS LOS TERRENOS CON SU ESTADO
SELECT '=== TODOS LOS TERRENOS ===' as seccion;

SELECT
  id,
  title,
  status,
  is_marketplace_listing,
  latitude,
  longitude,
  created_at,
  CASE
    WHEN is_marketplace_listing = true AND status = 'active' AND latitude IS NOT NULL AND longitude IS NOT NULL
      THEN '✅ VISIBLE EN MAPA'
    WHEN is_marketplace_listing = true AND status = 'active' AND (latitude IS NULL OR longitude IS NULL)
      THEN '⚠️ En marketplace pero SIN coordenadas'
    WHEN is_marketplace_listing = true AND status != 'active'
      THEN '⚠️ En marketplace pero NO activo'
    ELSE '❌ NO visible'
  END as estado
FROM terrenos
ORDER BY created_at DESC;

-- 3. RESUMEN DE NÚMEROS
SELECT '=== RESUMEN ===' as seccion;

SELECT
  'Total de usuarios' as metrica,
  COUNT(*)::text as valor
FROM auth.users
UNION ALL
SELECT
  'Total de terrenos',
  COUNT(*)::text
FROM terrenos
UNION ALL
SELECT
  'Terrenos ACTIVOS en marketplace',
  COUNT(*)::text
FROM terrenos
WHERE is_marketplace_listing = true AND status = 'active'
UNION ALL
SELECT
  'Terrenos VISIBLES en mapa (con coordenadas)',
  COUNT(*)::text
FROM terrenos
WHERE is_marketplace_listing = true
  AND status = 'active'
  AND latitude IS NOT NULL
  AND longitude IS NOT NULL
UNION ALL
SELECT
  'Terrenos SIN coordenadas',
  COUNT(*)::text
FROM terrenos
WHERE latitude IS NULL OR longitude IS NULL
UNION ALL
SELECT
  'Total de hotspots',
  COUNT(*)::text
FROM hotspots;




-- 5. TERRENOS DRAFT (CANDIDATOS A ELIMINAR)
SELECT '=== TERRENOS DRAFT (PRUEBA) ===' as seccion;

SELECT
  id,
  title,
  created_at,
  CASE
    WHEN created_at < NOW() - INTERVAL '7 days' THEN '🗑️ Antiguo - Candidato a eliminar'
    ELSE 'Reciente'
  END as recomendacion
FROM terrenos
WHERE status = 'draft'
ORDER BY created_at;

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- Ejecuta este script completo en Supabase SQL Editor
-- Te mostrará solo la información esencial sin errores
-- =====================================================
