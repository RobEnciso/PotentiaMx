-- ============================================
-- PASO 1B: CREAR COLUMNA SLUG (SI NO EXISTE)
-- ============================================
-- Solo ejecuta este script si STEP1_VERIFICAR_SLUG.sql
-- no devolvió ningún resultado
-- ============================================

-- Crear columna slug (VARCHAR 255, única, puede ser nula temporalmente)
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Crear índice único para búsquedas rápidas por slug
-- NOTA: El índice único se agregará DESPUÉS de generar todos los slugs
-- para evitar conflictos durante la generación
CREATE INDEX IF NOT EXISTS idx_terrenos_slug ON terrenos(slug);

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'terrenos'
  AND column_name = 'slug';

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Deberías ver:
-- column_name | data_type      | is_nullable
-- slug        | character varying | YES
-- ============================================
