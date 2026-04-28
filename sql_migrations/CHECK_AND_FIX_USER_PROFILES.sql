-- =================================================================
-- PASO 1: VERIFICAR ESTRUCTURA DE user_profiles
-- =================================================================
-- Primero vamos a ver qué columnas tiene realmente la tabla

SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- =================================================================
-- PASO 2: VER REGISTROS EXISTENTES PARA ENTENDER LA ESTRUCTURA
-- =================================================================

SELECT * FROM public.user_profiles LIMIT 3;

-- =================================================================
-- PASO 3: ENCONTRAR TERRENOS HUÉRFANOS
-- =================================================================

SELECT
  DISTINCT t.user_id,
  COUNT(*) as terrenos_count
FROM public.terrenos t
LEFT JOIN public.user_profiles up ON t.user_id = up.id
WHERE up.id IS NULL
GROUP BY t.user_id;

-- =================================================================
-- INSTRUCCIONES:
-- =================================================================
-- 1. Ejecuta este script primero
-- 2. Compárteme el resultado de las queries anteriores
-- 3. Con esa información crearé el script correcto para insertar
--    los registros faltantes en user_profiles
-- =================================================================
