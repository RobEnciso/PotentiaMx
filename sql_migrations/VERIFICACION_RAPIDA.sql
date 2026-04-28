-- ============================================
-- VERIFICACIÓN RÁPIDA - Ejecuta esto en Supabase SQL Editor
-- ============================================

-- PASO 1: Ver TODOS los terrenos (sin filtros)
-- Esto te muestra EXACTAMENTE qué hay en la base de datos
SELECT
  id,
  title,
  is_marketplace_listing,
  is_public_embed,
  status,
  user_id,
  CASE
    WHEN image_urls IS NULL THEN 'Sin imágenes'
    WHEN array_length(image_urls, 1) IS NULL THEN 'Array vacío'
    ELSE array_length(image_urls, 1)::text || ' imágenes'
  END as imagenes
FROM terrenos
ORDER BY created_at DESC;

-- ⚠️ IMPORTANTE: Anota cuántas filas ves aquí


-- PASO 2: Ver SOLO los que cumplen los requisitos de marketplace
-- Esta consulta simula EXACTAMENTE lo que hace /propiedades
SELECT
  id,
  title,
  is_marketplace_listing,
  status,
  CASE
    WHEN is_marketplace_listing = true THEN '✅ Sí'
    ELSE '❌ No'
  END as "¿Marketplace?",
  CASE
    WHEN status = 'active' THEN '✅ Active'
    WHEN status = 'pending_approval' THEN '⏳ Pendiente'
    ELSE '❌ Otro: ' || status
  END as "Estado"
FROM terrenos
WHERE is_marketplace_listing = true
  AND status = 'active'
ORDER BY created_at DESC;

-- ⚠️ IMPORTANTE: ¿Cuántas filas ves? Deberían ser 2


-- PASO 3: Ver TODOS los que tienen marketplace activado (sin importar status)
-- Para encontrar el terreno que falta
SELECT
  id,
  title,
  is_marketplace_listing,
  status,
  CASE
    WHEN status != 'active' THEN '⚠️ PROBLEMA: Status es "' || status || '" (debería ser "active")'
    ELSE '✅ OK'
  END as diagnostico
FROM terrenos
WHERE is_marketplace_listing = true
ORDER BY created_at DESC;

-- ⚠️ Si ves 2 filas aquí pero en PASO 2 solo ves 1,
--    el problema es el campo "status"


-- PASO 4: SOLUCIÓN - Cambiar status a active si es necesario
-- SOLO ejecuta esto si en PASO 3 viste que uno tiene status diferente a 'active'

-- Primero, VER cuál terreno tiene el problema:
SELECT
  id,
  title,
  status,
  'UPDATE terrenos SET status = ''active'' WHERE id = ''' || id || ''';' as "SQL para corregir"
FROM terrenos
WHERE is_marketplace_listing = true
  AND status != 'active';

-- Si ves resultados arriba, COPIA el SQL que te genera y ejecútalo


-- PASO 5: Ver políticas RLS que están afectando la consulta
SELECT
  policyname as "Nombre Política",
  cmd as "Comando",
  CASE
    WHEN qual LIKE '%auth.uid%' THEN '🔒 Requiere autenticación'
    ELSE '🌍 Acceso público'
  END as "Tipo Acceso",
  qual as "Condición"
FROM pg_policies
WHERE tablename = 'terrenos'
  AND cmd = 'SELECT'
ORDER BY policyname;

-- ⚠️ Deberías ver al menos UNA política que diga "🌍 Acceso público"
--    con condición similar a: (is_marketplace_listing = true) AND (status = 'active')


-- ============================================
-- RESUMEN DE LO QUE DEBERÍAS VER:
-- ============================================
--
-- PASO 1: Todos tus terrenos (probablemente 2 o más)
-- PASO 2: 2 terrenos (los que deben aparecer en marketplace)
-- PASO 3: 2 terrenos con marketplace=true (pero puede que uno tenga status diferente)
-- PASO 4: Si uno tiene status='pending_approval', aquí generas el SQL para corregirlo
-- PASO 5: Al menos 1 política de acceso público para marketplace
--
-- ============================================
