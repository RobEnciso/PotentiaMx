-- Verificar todas las columnas de la tabla terrenos
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'terrenos'
ORDER BY ordinal_position;
