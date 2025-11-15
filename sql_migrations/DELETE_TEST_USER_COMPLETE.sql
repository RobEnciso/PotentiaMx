-- ============================================
-- ELIMINAR USUARIO DE PRUEBA COMPLETAMENTE
-- ============================================
-- Este script elimina TODOS los datos de un usuario:
-- - Sus terrenos
-- - Sus hotspots
-- - Su perfil de usuario
-- - Su cuenta de auth
-- ============================================

-- PASO 1: Primero identifica el usuario que quieres eliminar
-- Busca por email para obtener su user_id
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'EMAIL_DEL_USUARIO_AQUI@example.com';
-- Copia el 'id' que te devuelva

-- PASO 2: Verifica qué datos tiene ese usuario
-- Reemplaza 'USER_ID_AQUI' con el id que copiaste
SELECT
  'terrenos' as tabla,
  COUNT(*) as cantidad
FROM terrenos
WHERE user_id = 'USER_ID_AQUI'
UNION ALL
SELECT
  'user_profiles' as tabla,
  COUNT(*) as cantidad
FROM user_profiles
WHERE id = 'USER_ID_AQUI';

-- PASO 3: Eliminar todos los datos del usuario
-- IMPORTANTE: Ejecuta estos comandos UNO POR UNO en el orden mostrado

-- 3.1. Eliminar hotspots de los terrenos del usuario
DELETE FROM hotspots
WHERE terreno_id IN (
  SELECT id FROM terrenos WHERE user_id = 'USER_ID_AQUI'
);

-- 3.2. Eliminar terrenos del usuario
DELETE FROM terrenos
WHERE user_id = 'USER_ID_AQUI';

-- 3.3. Eliminar perfil del usuario
DELETE FROM user_profiles
WHERE id = 'USER_ID_AQUI';

-- 3.4. Eliminar cuenta de autenticación (auth.users)
-- NOTA: Esto requiere privilegios de admin
DELETE FROM auth.users
WHERE id = 'USER_ID_AQUI';

-- PASO 4: Verificar que se eliminó todo
SELECT
  'terrenos' as tabla,
  COUNT(*) as cantidad
FROM terrenos
WHERE user_id = 'USER_ID_AQUI'
UNION ALL
SELECT
  'user_profiles' as tabla,
  COUNT(*) as cantidad
FROM user_profiles
WHERE id = 'USER_ID_AQUI'
UNION ALL
SELECT
  'auth.users' as tabla,
  COUNT(*) as cantidad
FROM auth.users
WHERE id = 'USER_ID_AQUI';
-- Debería devolver 0 en todas las tablas

-- ============================================
-- MÉTODO RÁPIDO: Eliminar múltiples usuarios de prueba
-- ============================================
-- Si quieres eliminar varios usuarios a la vez:

-- Ver todos los usuarios creados recientemente
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Eliminar usuarios específicos por email (ajusta los emails)
DO $$
DECLARE
  user_record RECORD;
  emails_to_delete TEXT[] := ARRAY[
    'prueba1@example.com',
    'prueba2@example.com',
    'prueba3@example.com'
  ];
BEGIN
  FOR user_record IN
    SELECT id FROM auth.users
    WHERE email = ANY(emails_to_delete)
  LOOP
    RAISE NOTICE 'Eliminando usuario: %', user_record.id;

    -- Eliminar hotspots
    DELETE FROM hotspots
    WHERE terreno_id IN (
      SELECT id FROM terrenos WHERE user_id = user_record.id
    );

    -- Eliminar terrenos
    DELETE FROM terrenos WHERE user_id = user_record.id;

    -- Eliminar perfil
    DELETE FROM user_profiles WHERE id = user_record.id;

    -- Eliminar auth
    DELETE FROM auth.users WHERE id = user_record.id;

    RAISE NOTICE 'Usuario eliminado: %', user_record.id;
  END LOOP;
END $$;

-- ============================================
-- IMPORTANTE: CUIDADO CON ESTOS COMANDOS
-- ============================================
-- Estos comandos eliminan datos de forma PERMANENTE
-- Asegúrate de estar eliminando los usuarios correctos
-- En producción, NUNCA elimines usuarios sin verificar primero
-- ============================================
