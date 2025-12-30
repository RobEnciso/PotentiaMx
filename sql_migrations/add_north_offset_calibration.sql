-- =========================================
-- Migración: Añadir calibración de Norte para sincronización del radar
-- Fecha: 2025-12-30
-- Descripción: Permite calibrar la orientación del radar circular (estilo DJI)
--              para que apunte al Norte real según la rotación de las imágenes 360°
-- =========================================

-- Añadir campo north_offset a terrenos
-- Este campo almacena el offset en grados (0-360) para corregir la orientación del radar
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS north_offset DECIMAL DEFAULT 0;

-- Añadir comentario descriptivo
COMMENT ON COLUMN terrenos.north_offset IS 'Offset en grados para calibrar el Norte real del radar (0-360). Si la imagen 360° tiene una rotación arbitraria, este valor corrige el bearing del radar para alinearlo con las coordenadas geográficas reales.';

-- Añadir constraint para validar rango 0-360
ALTER TABLE terrenos
ADD CONSTRAINT check_north_offset_range
CHECK (north_offset >= 0 AND north_offset <= 360);

-- Verificación
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'terrenos'
    AND column_name = 'north_offset'
  ) THEN
    RAISE NOTICE '✅ Campo north_offset creado exitosamente en tabla terrenos';
  ELSE
    RAISE WARNING '❌ Error: Campo north_offset no se pudo crear';
  END IF;
END $$;
