-- ============================================
-- ELIMINAR USUARIO: 01e94df4-ead4-4caa-aeb5-bc5e3ffde46d
-- ============================================

-- PASO 1: Verificar datos del usuario
SELECT 'VERIFICACIÓN' as info;

SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d';

-- Ver cuántos datos tiene
SELECT
  'terrenos' as tabla,
  COUNT(*) as cantidad
FROM terrenos
WHERE user_id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d'
UNION ALL
SELECT
  'user_profiles' as tabla,
  COUNT(*) as cantidad
FROM user_profiles
WHERE id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d';

-- ============================================
-- PASO 2: ELIMINAR TODOS LOS DATOS
-- Ejecuta estos comandos UNO POR UNO
-- ============================================

-- 2.1. Eliminar hotspots (si tiene terrenos)
DELETE FROM hotspots
WHERE terreno_id IN (
  SELECT id FROM terrenos WHERE user_id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d'
);

-- 2.2. Eliminar terrenos
DELETE FROM terrenos
WHERE user_id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d';

-- 2.3. Eliminar perfil
DELETE FROM user_profiles
WHERE id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d';

-- 2.4. Eliminar cuenta de auth
DELETE FROM auth.users
WHERE id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d';

-- ============================================
-- PASO 3: VERIFICAR QUE SE ELIMINÓ TODO
-- ============================================

SELECT
  'terrenos' as tabla,
  COUNT(*) as cantidad
FROM terrenos
WHERE user_id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d'
UNION ALL
SELECT
  'user_profiles' as tabla,
  COUNT(*) as cantidad
FROM user_profiles
WHERE id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d'
UNION ALL
SELECT
  'auth.users' as tabla,
  COUNT(*) as cantidad
FROM auth.users
WHERE id = '01e94df4-ead4-4caa-aeb5-bc5e3ffde46d';

-- Debe mostrar 0 en todas las tablas
