-- ===================================================================
-- DIAGNOSTICAR POR QUÉ image_urls SE GUARDA COMO NULL
-- ===================================================================

-- 1. Verificar permisos de la columna image_urls
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  is_updatable
FROM information_schema.columns
WHERE table_name = 'terrenos' AND column_name = 'image_urls';

-- 2. Ver todas las políticas INSERT para terrenos (pueden tener WITH CHECK que bloquee)
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'terrenos' AND cmd = 'INSERT';

-- 3. Ver si hay triggers en la tabla terrenos
SELECT
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'terrenos';

-- ===================================================================
-- PRUEBA MANUAL: Intenta insertar con image_urls
-- ===================================================================
-- Reemplaza USER_ID_AQUI con tu UUID de usuario

/*
INSERT INTO terrenos (
  user_id,
  title,
  image_urls
)
VALUES (
  'USER_ID_AQUI'::uuid,
  '🧪 Test Image URLs',
  '["https://pannellum.org/images/alma-chch.jpg"]'::jsonb
)
RETURNING id, title, image_urls;
*/

-- Si este INSERT funciona y muestra image_urls correctamente,
-- entonces el problema está en el código JavaScript, no en la BD.

-- Si también guarda null, entonces hay una política RLS o trigger que lo bloquea.
