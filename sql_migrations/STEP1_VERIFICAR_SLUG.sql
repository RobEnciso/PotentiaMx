-- ============================================
-- PASO 1A: VERIFICAR SI EXISTE COLUMNA SLUG
-- ============================================
-- Ejecuta este script primero para saber si ya tienes el campo slug
-- ============================================

-- Ver todas las columnas de la tabla terrenos
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'terrenos'
  AND column_name = 'slug';

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Si DEVUELVE 1 FILA: ✅ El campo slug YA EXISTE
-- Si NO DEVUELVE NADA: ❌ Necesitas ejecutar STEP1_CREAR_SLUG.sql
-- ============================================

-- Ver muestra de datos actuales (para saber qué slugs generar)
SELECT
  id,
  title,
  slug,
  created_at
FROM terrenos
ORDER BY created_at DESC
LIMIT 10;
