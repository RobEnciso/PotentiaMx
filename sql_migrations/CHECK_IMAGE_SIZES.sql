-- ============================================
-- VERIFICAR TAMAÑO DE IMÁGENES EN STORAGE
-- ============================================

-- Ver tamaño de archivos más pesados en el bucket
SELECT
  name,
  bucket_id,
  (metadata->>'size')::bigint as size_bytes,
  ROUND((metadata->>'size')::numeric / 1024 / 1024, 2) as size_mb,
  created_at,
  updated_at
FROM storage.objects
WHERE bucket_id = 'terrenos'
ORDER BY (metadata->>'size')::bigint DESC
LIMIT 20;

-- Estadísticas generales del storage
SELECT
  bucket_id,
  COUNT(*) as total_files,
  ROUND(SUM((metadata->>'size')::numeric) / 1024 / 1024, 2) as total_mb,
  ROUND(AVG((metadata->>'size')::numeric) / 1024 / 1024, 2) as avg_mb,
  ROUND(MAX((metadata->>'size')::numeric) / 1024 / 1024, 2) as max_mb,
  ROUND(MIN((metadata->>'size')::numeric) / 1024 / 1024, 2) as min_mb
FROM storage.objects
WHERE bucket_id = 'terrenos'
GROUP BY bucket_id;

-- Ver imágenes por extensión
SELECT
  CASE
    WHEN name LIKE '%.webp' THEN 'WebP'
    WHEN name LIKE '%.jpg' OR name LIKE '%.jpeg' THEN 'JPEG'
    WHEN name LIKE '%.png' THEN 'PNG'
    ELSE 'Other'
  END as format,
  COUNT(*) as cantidad,
  ROUND(SUM((metadata->>'size')::numeric) / 1024 / 1024, 2) as total_mb,
  ROUND(AVG((metadata->>'size')::numeric) / 1024 / 1024, 2) as avg_mb
FROM storage.objects
WHERE bucket_id = 'terrenos'
GROUP BY format
ORDER BY total_mb DESC;
