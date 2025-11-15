-- Verificar políticas RLS de la tabla terrenos
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'terrenos'
ORDER BY policyname;
