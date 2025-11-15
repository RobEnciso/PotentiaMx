-- Verificar que el tour demo tiene imágenes
SELECT
  id,
  title,
  jsonb_array_length(image_urls) as cantidad_imagenes
FROM terrenos
WHERE id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';
