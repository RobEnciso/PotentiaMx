-- ============================================
-- 🔄 ROLLBACK: REVERTIR CAMBIOS DE SLUGS
-- ============================================
-- SOLO ejecuta este script si algo salió mal
-- y quieres volver al estado original
-- ============================================

-- ⚠️ ADVERTENCIA:
-- Este script ELIMINARÁ la columna slug y todos los slugs generados
-- Solo úsalo si necesitas empezar de cero
-- ============================================

-- Confirmar que quieres hacer rollback
DO $$
BEGIN
  RAISE WARNING '⚠️ ADVERTENCIA: Estás a punto de eliminar la columna slug';
  RAISE WARNING 'Si estás seguro, comenta esta sección y ejecuta el resto del script';
  RAISE EXCEPTION 'Rollback cancelado por seguridad';
END $$;

-- ============================================
-- DESCOMENTAR LAS SIGUIENTES LÍNEAS PARA EJECUTAR
-- ============================================

-- Paso 1: Eliminar constraint único
-- ALTER TABLE terrenos
-- DROP CONSTRAINT IF EXISTS terrenos_slug_unique;

-- Paso 2: Eliminar índice
-- DROP INDEX IF EXISTS idx_terrenos_slug;

-- Paso 3: Eliminar función auxiliar
-- DROP FUNCTION IF EXISTS generate_slug(TEXT, UUID);

-- Paso 4: Eliminar columna slug
-- ALTER TABLE terrenos
-- DROP COLUMN IF EXISTS slug;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que la columna slug ya no existe
-- SELECT
--   'Columna slug eliminada' AS verificacion,
--   CASE
--     WHEN COUNT(*) = 0 THEN '✅ SÍ - Rollback exitoso'
--     ELSE '❌ NO - La columna sigue existiendo'
--   END AS resultado
-- FROM information_schema.columns
-- WHERE table_name = 'terrenos'
--   AND column_name = 'slug';

-- ============================================
-- DESPUÉS DEL ROLLBACK
-- ============================================
-- Si ejecutaste este rollback:
-- 1. Puedes volver a ejecutar STEP1_CREAR_SLUG.sql
-- 2. Y luego STEP1_GENERAR_SLUGS.sql
-- 3. Para intentar la configuración nuevamente
-- ============================================
