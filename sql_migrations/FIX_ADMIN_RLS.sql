-- =================================================================
-- FIX COMPLETO PARA POLÍTICAS RLS DE ADMINISTRADORES
-- =================================================================
-- Este script soluciona los errores 400 y 406 en el dashboard admin
-- =================================================================

-- PASO 1: Eliminar función anterior si existe
DROP FUNCTION IF EXISTS public.is_admin();

-- PASO 2: Crear función mejorada para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Obtener el email del usuario actual
  SELECT COALESCE(auth.jwt() ->> 'email', '') INTO user_email;

  -- Verificar si el email está en la lista de admins
  RETURN user_email IN (
    'creafilmsvallarta@gmail.com',
    'admin@landview.com'
  );
END;
$$;

-- PASO 3: Eliminar TODAS las políticas existentes de terrenos
DROP POLICY IF EXISTS "Users can view own terrenos" ON public.terrenos;
DROP POLICY IF EXISTS "Users can insert own terrenos" ON public.terrenos;
DROP POLICY IF EXISTS "Users can update own terrenos" ON public.terrenos;
DROP POLICY IF EXISTS "Users can delete own terrenos" ON public.terrenos;
DROP POLICY IF EXISTS "Admin can view all terrenos" ON public.terrenos;
DROP POLICY IF EXISTS "Admin can update all terrenos" ON public.terrenos;
DROP POLICY IF EXISTS "Public can view active marketplace listings" ON public.terrenos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.terrenos;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.terrenos;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.terrenos;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.terrenos;

-- PASO 4: Crear políticas NUEVAS para terrenos (SELECT)
CREATE POLICY "terrenos_select_policy"
ON public.terrenos
FOR SELECT
USING (
  -- Si es admin, puede ver TODOS los terrenos
  is_admin() = true
  OR
  -- Si es el dueño, puede ver sus terrenos
  user_id = auth.uid()
  OR
  -- Si es un listing público activo, todos pueden verlo
  (is_marketplace_listing = true AND status = 'active')
);

-- PASO 5: Crear políticas para terrenos (INSERT)
CREATE POLICY "terrenos_insert_policy"
ON public.terrenos
FOR INSERT
WITH CHECK (
  -- Solo usuarios autenticados pueden insertar
  auth.uid() IS NOT NULL
  AND
  -- Y solo pueden asignar su propio user_id
  user_id = auth.uid()
);

-- PASO 6: Crear políticas para terrenos (UPDATE)
CREATE POLICY "terrenos_update_policy"
ON public.terrenos
FOR UPDATE
USING (
  -- Si es admin, puede actualizar cualquier terreno
  is_admin() = true
  OR
  -- Si es el dueño, puede actualizar su terreno
  user_id = auth.uid()
)
WITH CHECK (
  -- Misma condición para el check
  is_admin() = true
  OR
  user_id = auth.uid()
);

-- PASO 7: Crear políticas para terrenos (DELETE)
CREATE POLICY "terrenos_delete_policy"
ON public.terrenos
FOR DELETE
USING (
  -- Solo el dueño puede eliminar (admins no eliminan por seguridad)
  user_id = auth.uid()
);

-- PASO 8: Eliminar TODAS las políticas existentes de user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can view all user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;

-- PASO 9: Crear políticas NUEVAS para user_profiles (SELECT)
CREATE POLICY "user_profiles_select_policy"
ON public.user_profiles
FOR SELECT
USING (
  -- Si es admin, puede ver TODOS los perfiles
  is_admin() = true
  OR
  -- Si es su propio perfil, puede verlo
  id = auth.uid()
);

-- PASO 10: Crear políticas para user_profiles (INSERT)
CREATE POLICY "user_profiles_insert_policy"
ON public.user_profiles
FOR INSERT
WITH CHECK (
  -- Solo puede insertar su propio perfil
  id = auth.uid()
);

-- PASO 11: Crear políticas para user_profiles (UPDATE)
CREATE POLICY "user_profiles_update_policy"
ON public.user_profiles
FOR UPDATE
USING (
  -- Solo puede actualizar su propio perfil
  id = auth.uid()
)
WITH CHECK (
  id = auth.uid()
);

-- PASO 12: Verificar que RLS está habilitado
ALTER TABLE public.terrenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotspots ENABLE ROW LEVEL SECURITY;

-- PASO 13: Políticas para hotspots (para que funcionen correctamente)
DROP POLICY IF EXISTS "Users can manage hotspots for their terrenos" ON public.hotspots;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.hotspots;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.hotspots;

CREATE POLICY "hotspots_select_policy"
ON public.hotspots
FOR SELECT
USING (
  -- Admin puede ver todos los hotspots
  is_admin() = true
  OR
  -- O si el terreno pertenece al usuario
  EXISTS (
    SELECT 1 FROM public.terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
  OR
  -- O si el terreno es público activo
  EXISTS (
    SELECT 1 FROM public.terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.is_marketplace_listing = true
    AND terrenos.status = 'active'
  )
);

CREATE POLICY "hotspots_insert_policy"
ON public.hotspots
FOR INSERT
WITH CHECK (
  -- Solo puede insertar hotspots en sus propios terrenos
  EXISTS (
    SELECT 1 FROM public.terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

CREATE POLICY "hotspots_update_policy"
ON public.hotspots
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

CREATE POLICY "hotspots_delete_policy"
ON public.hotspots
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

-- PASO 14: Verificar que la foreign key existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'terrenos_user_id_fkey'
    AND table_name = 'terrenos'
  ) THEN
    -- Crear la foreign key si no existe
    ALTER TABLE public.terrenos
    ADD CONSTRAINT terrenos_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- =================================================================
-- VERIFICACIÓN FINAL
-- =================================================================

-- Verificar que la función is_admin() funciona
SELECT public.is_admin() AS "¿Eres admin?";

-- Verificar políticas de terrenos
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'terrenos'
ORDER BY policyname;

-- Verificar políticas de user_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- =================================================================
-- INSTRUCCIONES:
-- =================================================================
-- 1. Ejecuta TODO este script en Supabase SQL Editor
-- 2. Verifica que al final aparezcan las políticas creadas
-- 3. Cierra sesión y vuelve a iniciar sesión en tu app
-- 4. Recarga el dashboard de admin
-- =================================================================
