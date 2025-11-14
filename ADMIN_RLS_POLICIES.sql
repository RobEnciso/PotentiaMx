-- =================================================================
-- POLÍTICAS RLS PARA ADMINISTRADORES
-- =================================================================
-- Este script crea políticas que permiten a los administradores
-- acceder a todos los datos de la plataforma
-- =================================================================

-- PASO 1: Crear función para verificar si un usuario es admin
-- Esta función verifica si el email del usuario está en la lista de admins
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT auth.jwt() -> 'email' IN (
      '"creafilmsvallarta@gmail.com"'::jsonb,
      '"admin@landview.com"'::jsonb
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 2: Políticas para tabla 'terrenos'
-- Permitir que los admins vean TODOS los terrenos (incluyendo pendientes de otros usuarios)

-- Política de lectura para admins
DROP POLICY IF EXISTS "Admin can view all terrenos" ON public.terrenos;
CREATE POLICY "Admin can view all terrenos"
ON public.terrenos
FOR SELECT
USING (
  is_admin() = true  -- Si es admin, puede ver todos los terrenos
  OR user_id = auth.uid()  -- O si es dueño del terreno
);

-- Política de actualización para admins (para aprobar/rechazar)
DROP POLICY IF EXISTS "Admin can update all terrenos" ON public.terrenos;
CREATE POLICY "Admin can update all terrenos"
ON public.terrenos
FOR UPDATE
USING (
  is_admin() = true  -- Los admins pueden actualizar cualquier terreno
  OR user_id = auth.uid()  -- O el dueño puede actualizar sus propios terrenos
)
WITH CHECK (
  is_admin() = true
  OR user_id = auth.uid()
);

-- PASO 3: Políticas para tabla 'user_profiles'
-- Permitir que los admins vean TODOS los perfiles de usuarios

-- Política de lectura para admins
DROP POLICY IF EXISTS "Admin can view all user profiles" ON public.user_profiles;
CREATE POLICY "Admin can view all user profiles"
ON public.user_profiles
FOR SELECT
USING (
  is_admin() = true  -- Si es admin, puede ver todos los perfiles
  OR id = auth.uid()  -- O si es su propio perfil
);

-- PASO 4: Verificar que RLS está habilitado
ALTER TABLE public.terrenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- INSTRUCCIONES DE USO:
-- =================================================================
-- 1. Abre el SQL Editor en tu dashboard de Supabase
-- 2. Copia y pega TODO este script
-- 3. Haz clic en "Run" para ejecutarlo
-- 4. Verifica que no hay errores en la consola
-- 5. Recarga tu aplicación y prueba el panel de admin
-- =================================================================

-- NOTA IMPORTANTE:
-- Asegúrate de actualizar los emails de admin en la función is_admin()
-- con los emails correctos de tus administradores.
-- =================================================================
