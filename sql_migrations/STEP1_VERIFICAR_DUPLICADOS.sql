-- ============================================
-- PASO 1D: VERIFICAR Y CORREGIR SLUGS DUPLICADOS
-- ============================================
-- Ejecuta este script SOLO si STEP1_GENERAR_SLUGS.sql
-- reportó que hay slugs duplicados
-- ============================================

-- Ver si hay slugs duplicados
SELECT
  slug,
  COUNT(*) as cantidad,
  STRING_AGG(id::TEXT, ', ') as ids_afectados
FROM terrenos
WHERE slug IS NOT NULL
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY cantidad DESC;

-- ============================================
-- SI HAY DUPLICADOS, CORREGIRLOS
-- ============================================
-- Este script agrega un sufijo numérico incremental a los duplicados
-- Ejemplo: "terreno-vista-mar-78c9a3b2" se convierte en:
--   - "terreno-vista-mar-78c9a3b2" (el primero queda igual)
--   - "terreno-vista-mar-78c9a3b2-2" (segundo duplicado)
--   - "terreno-vista-mar-78c9a3b2-3" (tercer duplicado)
-- ============================================

DO $$
DECLARE
  duplicate_row RECORD;
  row_num INTEGER;
BEGIN
  -- Iterar sobre cada slug duplicado
  FOR duplicate_row IN
    SELECT slug
    FROM terrenos
    WHERE slug IS NOT NULL
    GROUP BY slug
    HAVING COUNT(*) > 1
  LOOP
    row_num := 1;

    -- Para cada terreno con ese slug duplicado
    FOR duplicate_row IN
      SELECT id, slug
      FROM terrenos
      WHERE slug = duplicate_row.slug
      ORDER BY created_at ASC
    LOOP
      -- El primero lo dejamos igual, los demás les agregamos sufijo
      IF row_num > 1 THEN
        UPDATE terrenos
        SET slug = duplicate_row.slug || '-' || row_num
        WHERE id = duplicate_row.id;

        RAISE NOTICE 'Corregido slug duplicado: % -> %', duplicate_row.slug, duplicate_row.slug || '-' || row_num;
      END IF;

      row_num := row_num + 1;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT
  slug,
  COUNT(*) as cantidad
FROM terrenos
WHERE slug IS NOT NULL
GROUP BY slug
HAVING COUNT(*) > 1;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- La consulta NO debería devolver ninguna fila
-- (significa que ya no hay duplicados)
-- ============================================
