-- =================================================================
-- CREAR FUNCIÓN PARA QUE ADMINS PUEDAN OBTENER EMAILS DE USUARIOS
-- =================================================================
-- Esta función permite a los administradores obtener el email
-- de cualquier usuario para el panel de aprobación
-- =================================================================

-- PASO 1: Crear función para obtener email de un usuario por su ID
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con privilegios del creador, no del llamador
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Verificar que quien llama es administrador
  IF NOT public.is_admin() THEN
    RETURN NULL; -- No admin, no puede ver emails
  END IF;

  -- Obtener el email de auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_uuid;

  RETURN user_email;
END;
$$;

-- PASO 2: Otorgar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION public.get_user_email(UUID) TO authenticated;

-- =================================================================
-- VERIFICACIÓN
-- =================================================================

-- Probar la función (reemplaza el UUID con un ID real de tu base de datos)
-- SELECT public.get_user_email('tu-user-id-aqui');

-- =================================================================
-- RESULTADO ESPERADO:
-- =================================================================
-- Si eres admin: debería devolver el email del usuario
-- Si no eres admin: debería devolver NULL
-- =================================================================

-- =================================================================
-- INSTRUCCIONES:
-- =================================================================
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Recarga tu dashboard de admin
-- 3. El panel de aprobación ahora mostrará los emails correctamente
-- =================================================================
