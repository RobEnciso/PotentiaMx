-- Migración: Agregar campo view_names a la tabla terrenos
-- Fecha: 2025-10-17
-- Propósito: Permitir nombres personalizados para cada vista en el editor de hotspots

-- Agregar columna view_names (array de strings)
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS view_names TEXT[];

-- Comentario explicativo
COMMENT ON COLUMN terrenos.view_names IS 'Nombres personalizados para cada vista/panorama. Índice corresponde a image_urls. Null significa usar nombres por defecto (Vista 1, Vista 2, etc.)';
