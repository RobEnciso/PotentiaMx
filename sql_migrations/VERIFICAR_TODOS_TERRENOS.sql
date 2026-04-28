-- ============================================
-- VERIFICAR TODOS LOS TERRENOS Y SUS USUARIOS
-- ============================================

-- 1. Ver todos los terrenos con información de usuario
SELECT
  t.id as terreno_id,
  t.title as nombre_terreno,
  t.is_marketplace_listing as en_marketplace,
  t.status as estado,
  t.latitude,
  t.longitude,
  t.property_type as tipo,
  t.created_at as fecha_creacion,
  t.user_id,
  up.full_name as nombre_usuario,
  up.email as email_usuario
FROM terrenos t
LEFT JOIN user_profiles up ON t.user_id = up.id
ORDER BY t.created_at DESC;

-- 2. Ver usuarios activos con cantidad de terrenos
SELECT
  u.id as user_id,
  u.email,
  up.full_name,
  up.subscription_plan,
  COUNT(t.id) as total_terrenos,
  COUNT(CASE WHEN t.is_marketplace_listing = true THEN 1 END) as terrenos_en_marketplace,
  COUNT(CASE WHEN t.latitude IS NOT NULL AND t.longitude IS NOT NULL THEN 1 END) as terrenos_con_coordenadas
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
LEFT JOIN terrenos t ON u.id = t.user_id
GROUP BY u.id, u.email, up.full_name, up.subscription_plan
ORDER BY u.created_at DESC;

-- 3. Ver terrenos SIN coordenadas
SELECT
  t.id,
  t.title,
  t.is_marketplace_listing,
  t.status,
  t.user_id,
  up.email as usuario_email
FROM terrenos t
LEFT JOIN user_profiles up ON t.user_id = up.id
WHERE t.latitude IS NULL OR t.longitude IS NULL
ORDER BY t.created_at DESC;

-- 4. Ver terrenos huérfanos (usuario eliminado)
SELECT
  t.id,
  t.title,
  t.user_id,
  t.created_at
FROM terrenos t
LEFT JOIN auth.users u ON t.user_id = u.id
WHERE u.id IS NULL;

-- 5. Contar total de registros
SELECT
  'Usuarios totales' as tipo,
  COUNT(*) as cantidad
FROM auth.users
UNION ALL
SELECT
  'Terrenos totales' as tipo,
  COUNT(*) as cantidad
FROM terrenos
UNION ALL
SELECT
  'Terrenos en marketplace' as tipo,
  COUNT(*) as cantidad
FROM terrenos
WHERE is_marketplace_listing = true AND status = 'active'
UNION ALL
SELECT
  'Terrenos con coordenadas' as tipo,
  COUNT(*) as cantidad
FROM terrenos
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
