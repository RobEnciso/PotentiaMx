-- ========================================
-- MIGRACIÓN SEGURA: Agregar Columnas de Audio por Vista
-- Usa IF NOT EXISTS para evitar errores si ya existen
-- ========================================

-- PASO 1: Agregar columnas en TERRENOS para audio por vista
-- Estas columnas almacenan arrays (uno por cada vista/panorama)

ALTER TABLE terrenos
  ADD COLUMN IF NOT EXISTS view_ambient_audio TEXT[],
  ADD COLUMN IF NOT EXISTS view_ambient_volume DECIMAL(3,2)[],
  ADD COLUMN IF NOT EXISTS view_narration_audio TEXT[],
  ADD COLUMN IF NOT EXISTS view_narration_volume DECIMAL(3,2)[],
  ADD COLUMN IF NOT EXISTS view_audio_autoplay BOOLEAN[];

-- PASO 2: Establecer valores por defecto SOLO si la columna fue recién creada
-- Esto evita sobrescribir datos existentes

DO $$
BEGIN
  -- Solo si view_ambient_volume no tiene default, agregarlo
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos'
      AND column_name = 'view_ambient_volume'
      AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE terrenos
      ALTER COLUMN view_ambient_volume SET DEFAULT ARRAY[0.3];
  END IF;

  -- Solo si view_narration_volume no tiene default, agregarlo
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos'
      AND column_name = 'view_narration_volume'
      AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE terrenos
      ALTER COLUMN view_narration_volume SET DEFAULT ARRAY[0.7];
  END IF;

  -- Solo si view_audio_autoplay no tiene default, agregarlo
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos'
      AND column_name = 'view_audio_autoplay'
      AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE terrenos
      ALTER COLUMN view_audio_autoplay SET DEFAULT ARRAY[true];
  END IF;
END $$;

-- PASO 3: Agregar comentarios para documentación
COMMENT ON COLUMN terrenos.view_ambient_audio IS 'Array de URLs de audio ambiente, un elemento por cada panorama en image_urls. Ejemplo: [''/audio/1.mp3'', null, ''/audio/3.mp3'']';
COMMENT ON COLUMN terrenos.view_ambient_volume IS 'Array de volúmenes para audio ambiente (0.0-1.0), un elemento por panorama. Ejemplo: [0.3, 0.3, 0.4]';
COMMENT ON COLUMN terrenos.view_narration_audio IS 'Array de URLs de narración (se reproduce una vez), un elemento por panorama. Ejemplo: [null, ''/narr/2.mp3'', null]';
COMMENT ON COLUMN terrenos.view_narration_volume IS 'Array de volúmenes para narración (0.0-1.0), un elemento por panorama. Ejemplo: [0.7, 0.8, 0.7]';
COMMENT ON COLUMN terrenos.view_audio_autoplay IS 'Array de flags booleanos para reproducción automática al entrar a la vista. Ejemplo: [true, true, false]';

-- ========================================
-- VERIFICACIÓN: Ejecuta esto para confirmar
-- ========================================

SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'terrenos'
  AND column_name LIKE 'view_%'
ORDER BY column_name;

-- Deberías ver 5 columnas:
-- 1. view_ambient_audio   | ARRAY
-- 2. view_ambient_volume  | ARRAY | default: ARRAY[0.3]
-- 3. view_audio_autoplay  | ARRAY | default: ARRAY[true]
-- 4. view_narration_audio | ARRAY
-- 5. view_narration_volume| ARRAY | default: ARRAY[0.7]
