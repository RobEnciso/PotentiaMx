-- ============================================
-- PASO 1C: GENERAR SLUGS PARA TERRENOS EXISTENTES
-- ============================================
-- Este script genera slugs automáticamente basados en el título
-- y agrega parte del UUID para garantizar unicidad
-- ============================================

-- FUNCIÓN auxiliar para limpiar texto y generar slug
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT, uuid_input UUID)
RETURNS TEXT AS $$
DECLARE
  cleaned_text TEXT;
  slug_result TEXT;
BEGIN
  -- 1. Convertir a minúsculas
  cleaned_text := LOWER(text_input);

  -- 2. Reemplazar caracteres acentuados
  cleaned_text := TRANSLATE(
    cleaned_text,
    'áéíóúàèìòùäëïöüâêîôûñçÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÂÊÎÔÛÑÇ',
    'aeiouaeiouaeiouaeiounCAEIOUAEIOUAEIOUAEIOUNC'
  );

  -- 3. Reemplazar caracteres especiales y espacios por guiones
  cleaned_text := REGEXP_REPLACE(cleaned_text, '[^a-z0-9]+', '-', 'g');

  -- 4. Eliminar guiones al inicio y final
  cleaned_text := TRIM(BOTH '-' FROM cleaned_text);

  -- 5. Limitar longitud a 200 caracteres
  cleaned_text := SUBSTRING(cleaned_text, 1, 200);

  -- 6. Agregar primeros 8 caracteres del UUID para garantizar unicidad
  slug_result := cleaned_text || '-' || SUBSTRING(uuid_input::TEXT, 1, 8);

  RETURN slug_result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- GENERAR SLUGS PARA TODOS LOS TERRENOS SIN SLUG
-- ============================================
UPDATE terrenos
SET slug = generate_slug(
  COALESCE(title, 'propiedad'), -- Si no hay título, usar "propiedad"
  id
)
WHERE slug IS NULL OR slug = '';

-- ============================================
-- HACER LA COLUMNA SLUG ÚNICA (AHORA QUE TODOS TIENEN VALOR)
-- ============================================
-- Primero, verificar que no hay duplicados
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO duplicate_count
  FROM (
    SELECT slug
    FROM terrenos
    WHERE slug IS NOT NULL
    GROUP BY slug
    HAVING COUNT(*) > 1
  ) duplicates;

  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 'Se encontraron % slugs duplicados. Ejecuta STEP1_VERIFICAR_DUPLICADOS.sql primero', duplicate_count;
  ELSE
    RAISE NOTICE 'No hay slugs duplicados. Seguro agregar constraint UNIQUE';
  END IF;
END $$;

-- Agregar constraint único SOLO si no hay duplicados
ALTER TABLE terrenos
ADD CONSTRAINT terrenos_slug_unique UNIQUE (slug);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT
  COUNT(*) as total_terrenos,
  COUNT(slug) as terrenos_con_slug,
  COUNT(*) - COUNT(slug) as terrenos_sin_slug
FROM terrenos;

-- Ver muestra de slugs generados
SELECT
  id,
  title,
  slug,
  created_at
FROM terrenos
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- total_terrenos | terrenos_con_slug | terrenos_sin_slug
--              5 |                 5 |                 0
--
-- Todos los terrenos deberían tener slug generado
-- ============================================

-- ============================================
-- EJEMPLOS DE SLUGS GENERADOS:
-- ============================================
-- Título: "Terreno para Desarrollo 666 m²"
-- Slug: "terreno-para-desarrollo-666-m2-78c9a3b2"
--
-- Título: "Casa Vista al Mar Puerto Vallarta"
-- Slug: "casa-vista-al-mar-puerto-vallarta-4f5e6d7a"
--
-- Título: "Departamento Amueblado Zona Hotelera"
-- Slug: "departamento-amueblado-zona-hotelera-1a2b3c4d"
-- ============================================
