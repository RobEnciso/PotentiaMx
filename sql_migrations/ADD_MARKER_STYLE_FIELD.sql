-- Agregar campo marker_style a la tabla terrenos
-- Este campo permite que cada terreno tenga su propio estilo de marcadores (hotspots)
-- Estilos disponibles: 'apple' (minimalista), 'android' (Material Design), 'classic' (verde original)

-- Agregar columna marker_style con valor por defecto 'apple'
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS marker_style TEXT DEFAULT 'apple'
CHECK (marker_style IN ('apple', 'android', 'classic'));

-- Actualizar terrenos existentes para que usen el estilo 'apple' por defecto
UPDATE terrenos
SET marker_style = 'apple'
WHERE marker_style IS NULL;

-- Verificar que se agregó correctamente
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'terrenos' AND column_name = 'marker_style';

-- Mensaje de confirmación
COMMENT ON COLUMN terrenos.marker_style IS 'Estilo visual de los marcadores/hotspots en el visor 360: apple (minimalista blanco), android (Material Design azul), classic (verde con gradiente)';
