-- =====================================================
-- VER ESTRUCTURA DE TABLAS - POTENTIAMX
-- =====================================================
-- Este script muestra qué columnas tienen las tablas principales
-- =====================================================

-- Ver columnas de la tabla terrenos
SELECT
  '=== COLUMNAS DE TERRENOS ===' as info;

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'terrenos'
ORDER BY ordinal_position;

-- Ver columnas de la tabla user_profiles
SELECT
  '=== COLUMNAS DE USER_PROFILES ===' as info;

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Ver columnas de la tabla hotspots
SELECT
  '=== COLUMNAS DE HOTSPOTS ===' as info;

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'hotspots'
ORDER BY ordinal_position;

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Ejecuta este script primero en Supabase SQL Editor
-- 2. Copia los resultados aquí
-- 3. Con eso corrijo el script de auditoría para usar
--    las columnas correctas que ya existen
-- =====================================================
