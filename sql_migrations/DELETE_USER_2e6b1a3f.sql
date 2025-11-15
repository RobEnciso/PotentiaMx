-- ============================================
-- ELIMINAR USUARIO: 2e6b1a3f-6a35-4da7-a891-548ce0e139e9
-- ============================================

-- PASO 1: Verificar qué datos tiene este usuario
SELECT 'VERIFICACIÓN ANTES DE ELIMINAR' as info;

-- Ver email del usuario
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9';

-- Ver cuántos terrenos tiene
SELECT
  'terrenos' as tabla,
  COUNT(*) as cantidad
FROM terrenos
WHERE user_id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9'
UNION ALL
SELECT
  'hotspots' as tabla,
  COUNT(*) as cantidad
FROM hotspots
WHERE terreno_id IN (
  SELECT id FROM terrenos WHERE user_id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9'
)
UNION ALL
SELECT
  'user_profiles' as tabla,
  COUNT(*) as cantidad
FROM user_profiles
WHERE id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9';

-- ============================================
-- PASO 2: ELIMINAR TODOS LOS DATOS
-- Ejecuta estos comandos UNO POR UNO
-- ============================================

-- 2.1. Eliminar hotspots de los terrenos del usuario
DELETE FROM hotspots
WHERE terreno_id IN (
  SELECT id FROM terrenos WHERE user_id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9'
);

-- 2.2. Eliminar terrenos del usuario
DELETE FROM terrenos
WHERE user_id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9';

-- 2.3. Eliminar perfil del usuario
DELETE FROM user_profiles
WHERE id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9';

-- 2.4. Eliminar cuenta de autenticación
DELETE FROM auth.users
WHERE id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9';

-- ============================================
-- PASO 3: VERIFICAR QUE SE ELIMINÓ TODO
-- ============================================

SELECT 'VERIFICACIÓN DESPUÉS DE ELIMINAR' as info;

SELECT
  'terrenos' as tabla,
  COUNT(*) as cantidad
FROM terrenos
WHERE user_id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9'
UNION ALL
SELECT
  'hotspots' as tabla,
  COUNT(*) as cantidad
FROM hotspots
WHERE terreno_id IN (
  SELECT id FROM terrenos WHERE user_id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9'
)
UNION ALL
SELECT
  'user_profiles' as tabla,
  COUNT(*) as cantidad
FROM user_profiles
WHERE id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9'
UNION ALL
SELECT
  'auth.users' as tabla,
  COUNT(*) as cantidad
FROM auth.users
WHERE id = '2e6b1a3f-6a35-4da7-a891-548ce0e139e9';

-- Debería devolver 0 en todas las tablas
-- ============================================
