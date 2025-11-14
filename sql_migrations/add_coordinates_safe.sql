-- ============================================
-- AGREGAR COORDENADAS GEOGRÁFICAS A TERRENOS
-- ============================================
-- Script SEGURO - Solo agrega columnas, no modifica datos
-- Fecha: 2025-01-19
-- ============================================

-- 1. Agregar columnas de coordenadas (NULL permitido inicialmente)
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- 2. Agregar comentarios para documentación
COMMENT ON COLUMN terrenos.latitude IS 'Latitud de la ubicación del terreno (ej: 20.653407 para Puerto Vallarta). OBLIGATORIO para publicar en marketplace.';
COMMENT ON COLUMN terrenos.longitude IS 'Longitud de la ubicación del terreno (ej: -105.225396 para Puerto Vallarta). OBLIGATORIO para publicar en marketplace.';

-- 3. Crear índice compuesto para búsquedas geográficas eficientes
CREATE INDEX IF NOT EXISTS idx_terrenos_coordinates ON terrenos(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 4. Crear índice para terrenos con ubicación (útil para el mapa)
CREATE INDEX IF NOT EXISTS idx_terrenos_has_location ON terrenos(id)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ver la estructura actualizada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'terrenos'
  AND column_name IN ('latitude', 'longitude')
ORDER BY column_name;

-- ============================================
-- ✅ COLUMNAS AGREGADAS EXITOSAMENTE
-- ============================================
-- Las columnas permiten NULL por ahora
-- En el siguiente paso agregaremos las coordenadas a los terrenos existentes
-- ============================================
