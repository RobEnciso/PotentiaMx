-- ============================================
-- AGREGAR COORDENADAS GEOGRÁFICAS A TERRENOS
-- ============================================
-- Para mostrar ubicaciones en mapa estilo Airbnb
-- Las coordenadas son OBLIGATORIAS para marketplace
-- ============================================

-- 1. Agregar columnas de coordenadas
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- 2. Agregar comentarios para documentación
COMMENT ON COLUMN terrenos.latitude IS 'Latitud de la ubicación del terreno (ej: 20.653407 para Puerto Vallarta). OBLIGATORIO para marketplace.';
COMMENT ON COLUMN terrenos.longitude IS 'Longitud de la ubicación del terreno (ej: -105.225396 para Puerto Vallarta). OBLIGATORIO para marketplace.';

-- 3. Crear índice compuesto para búsquedas geográficas
CREATE INDEX IF NOT EXISTS idx_terrenos_coordinates ON terrenos(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 4. Crear índice para búsquedas de terrenos con ubicación
CREATE INDEX IF NOT EXISTS idx_terrenos_has_location ON terrenos(id)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================
-- IMPORTANTE: Ejecutar después de este script
-- ============================================
-- Debes agregar coordenadas a tus terrenos existentes
-- Ejemplo para Puerto Vallarta (ajusta según tus datos):
--
-- UPDATE terrenos SET
--   latitude = 20.653407,
--   longitude = -105.225396
-- WHERE id = 'tu-id-del-terreno';
--
-- Puedes obtener coordenadas desde:
-- - Google Maps: Click derecho > Ver coordenadas
-- - OpenStreetMap: Click en ubicación, ver URL
-- ============================================

-- ✅ Script completado
SELECT 'Columnas de ubicación agregadas exitosamente' AS status;
