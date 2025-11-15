-- ============================================
-- AGREGAR COLUMNA METADATA A TABLA TERRENOS
-- ============================================
-- Este script agrega la columna metadata JSONB para
-- identificar tours demo y otros metadatos
-- ============================================

-- 1. Primero verificar si la columna ya existe
SELECT
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'terrenos'
  AND column_name = 'metadata';

-- 2. Agregar columna metadata si no existe
-- (Si ya existe, este comando fallará pero es seguro)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'terrenos'
      AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.terrenos
    ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;

    RAISE NOTICE 'Columna metadata agregada exitosamente';
  ELSE
    RAISE NOTICE 'Columna metadata ya existe, no es necesario agregarla';
  END IF;
END $$;

-- 3. Verificar que se agregó correctamente
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'terrenos'
  AND column_name = 'metadata';

-- 4. Ver muestra de datos con metadata
SELECT
  id,
  title,
  metadata
FROM terrenos
LIMIT 5;

-- ============================================
-- SIGUIENTE PASO (opcional):
-- ============================================
-- Si tienes un tour demo existente con ID específico,
-- actualiza su metadata con:
--
-- UPDATE terrenos
-- SET metadata = jsonb_build_object(
--   'is_demo', true,
--   'created_from', 'official_demo',
--   'demo_id', '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf'
-- )
-- WHERE id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';
-- ============================================
