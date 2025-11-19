-- ============================================
-- PASO 1E: VERIFICACIÓN COMPLETA - SLUGS LISTOS
-- ============================================
-- Ejecuta este script AL FINAL para confirmar que todo está OK
-- ============================================

-- 1. Verificar que la columna slug existe
SELECT
  'Columna slug existe' AS verificacion,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ SÍ'
    ELSE '❌ NO - Ejecuta STEP1_CREAR_SLUG.sql'
  END AS resultado
FROM information_schema.columns
WHERE table_name = 'terrenos'
  AND column_name = 'slug';

-- 2. Verificar que TODOS los terrenos tienen slug
SELECT
  'Todos los terrenos tienen slug' AS verificacion,
  CASE
    WHEN COUNT(*) = 0 THEN '✅ SÍ'
    ELSE '❌ NO - ' || COUNT(*) || ' terrenos sin slug'
  END AS resultado
FROM terrenos
WHERE slug IS NULL OR slug = '';

-- 3. Verificar que NO hay slugs duplicados
SELECT
  'No hay slugs duplicados' AS verificacion,
  CASE
    WHEN COUNT(*) = 0 THEN '✅ SÍ'
    ELSE '❌ NO - ' || COUNT(*) || ' slugs duplicados. Ejecuta STEP1_VERIFICAR_DUPLICADOS.sql'
  END AS resultado
FROM (
  SELECT slug
  FROM terrenos
  WHERE slug IS NOT NULL
  GROUP BY slug
  HAVING COUNT(*) > 1
) duplicados;

-- 4. Verificar que existe el índice
SELECT
  'Índice idx_terrenos_slug existe' AS verificacion,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ SÍ'
    ELSE '⚠️ NO - Recomendado pero no crítico'
  END AS resultado
FROM pg_indexes
WHERE tablename = 'terrenos'
  AND indexname = 'idx_terrenos_slug';

-- 5. Verificar constraint único
SELECT
  'Constraint UNIQUE en slug' AS verificacion,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ SÍ'
    ELSE '⚠️ NO - Recomendado para evitar duplicados'
  END AS resultado
FROM information_schema.table_constraints
WHERE table_name = 'terrenos'
  AND constraint_name = 'terrenos_slug_unique';

-- ============================================
-- ESTADÍSTICAS GENERALES
-- ============================================
SELECT
  'TOTAL DE TERRENOS' AS metrica,
  COUNT(*)::TEXT AS valor
FROM terrenos

UNION ALL

SELECT
  'TERRENOS CON SLUG',
  COUNT(*)::TEXT
FROM terrenos
WHERE slug IS NOT NULL AND slug != ''

UNION ALL

SELECT
  'TERRENOS SIN SLUG',
  COUNT(*)::TEXT
FROM terrenos
WHERE slug IS NULL OR slug = ''

UNION ALL

SELECT
  'LONGITUD PROMEDIO DE SLUG',
  ROUND(AVG(LENGTH(slug)))::TEXT || ' caracteres'
FROM terrenos
WHERE slug IS NOT NULL;

-- ============================================
-- MUESTRA DE SLUGS GENERADOS (PRIMEROS 10)
-- ============================================
SELECT
  '📝 MUESTRA DE SLUGS GENERADOS:' AS info;

SELECT
  ROW_NUMBER() OVER (ORDER BY created_at DESC) AS "#",
  LEFT(title, 40) || CASE WHEN LENGTH(title) > 40 THEN '...' ELSE '' END AS titulo,
  slug,
  CASE
    WHEN is_marketplace_listing THEN '🌐 Público'
    ELSE '🔒 Privado'
  END AS estado
FROM terrenos
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Todas las verificaciones deberían mostrar ✅ SÍ
--
-- Si ves algún ❌ NO, sigue las instrucciones del resultado
-- ============================================

-- ============================================
-- 🎯 PRÓXIMO PASO DESPUÉS DE VERIFICAR:
-- ============================================
-- Si todo está ✅, puedes confirmar a Claude:
--
-- "Claude, los slugs están listos en Supabase.
--  Procede con el PASO 2 (Refactorización de Ruta)."
-- ============================================
