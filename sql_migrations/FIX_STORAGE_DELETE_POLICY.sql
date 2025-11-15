-- ============================================
-- SOLUCIÓN: Permitir DELETE en Storage para Admins
-- ============================================

-- El problema: El método .remove() no lanza error pero tampoco elimina
-- porque NO hay política que permita DELETE en el bucket 'tours-panoramicos'

-- PASO 1: Ver las políticas actuales del storage
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
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- PASO 2: Crear política para permitir DELETE a usuarios autenticados
-- (solo de sus propios archivos)

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tours-panoramicos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- PASO 3: Crear política adicional para ADMINS
-- (pueden eliminar cualquier archivo)

CREATE POLICY "Admins can delete any file"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tours-panoramicos'
  AND auth.jwt() ->> 'email' IN (
    'admin@potentiamx.com',
    'victor.admin@potentiamx.com'
  )
);

-- PASO 4: Verificar que las políticas se crearon
SELECT
  policyname,
  cmd,
  qual::text as condition
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND cmd = 'DELETE'
ORDER BY policyname;

-- ============================================
-- ALTERNATIVA: Si las políticas ya existen pero no funcionan
-- ============================================

-- Opción 1: Eliminar todas las políticas DELETE existentes y recrear
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'objects'
      AND schemaname = 'storage'
      AND cmd = 'DELETE'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Luego volver a crear las políticas de arriba

-- ============================================
-- DEBUGGING: Ver qué usuario está ejecutando
-- ============================================

SELECT
  auth.uid() as user_id,
  auth.email() as user_email,
  auth.role() as user_role;
