-- Agregar campo cover_image_url a la tabla terrenos
-- Este campo almacena la URL de la imagen de portada (opcional)
-- Si es NULL, el dashboard usará la primera imagen 360° por defecto

ALTER TABLE terrenos
ADD COLUMN cover_image_url TEXT NULL;

-- Agregar comentario descriptivo
COMMENT ON COLUMN terrenos.cover_image_url IS 'URL de la imagen de portada para mostrar en el dashboard. Si es NULL, se usa image_urls[0]';
