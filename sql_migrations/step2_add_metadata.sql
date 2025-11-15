-- ============================================
-- PASO 2: AGREGAR COLUMNA METADATA
-- ============================================

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

-- Verificar que se agregó correctamente
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'terrenos'
  AND column_name = 'metadata';
