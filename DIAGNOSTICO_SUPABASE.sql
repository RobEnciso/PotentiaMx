-- ============================================
-- DIAGNÓSTICO DE POLÍTICAS RLS Y DATOS
-- Ejecuta estas consultas en Supabase SQL Editor
-- ============================================

-- ========================================
-- 1. VERIFICAR DATOS EN LA TABLA TERRENOS
-- ========================================

-- Ver TODOS los terrenos con sus campos importantes
SELECT
  id,
  title,
  user_id,
  is_marketplace_listing,
  is_public_embed,
  status,
  created_at
FROM terrenos
ORDER BY created_at DESC;

-- ⚠️ Si NO ves todos los terrenos aquí, tienes un problema de RLS
-- Ejecuta esta consulta como ADMIN (sin RLS):
-- Ve a: SQL Editor → Click en "RLS is enabled" para deshabilitarlo temporalmente


-- ========================================
-- 2. CONTAR TERRENOS POR ESTADO
-- ========================================

-- Contar terrenos por status
SELECT
  status,
  COUNT(*) as cantidad
FROM terrenos
GROUP BY status;

-- Contar terrenos de marketplace
SELECT
  is_marketplace_listing,
  status,
  COUNT(*) as cantidad
FROM terrenos
GROUP BY is_marketplace_listing, status;


-- ========================================
-- 3. VER TERRENOS QUE DEBERÍAN APARECER EN MARKETPLACE
-- ========================================

-- Estos son los terrenos que DEBERÍAN mostrarse en /propiedades
SELECT
  id,
  title,
  user_id,
  is_marketplace_listing,
  status,
  created_at
FROM terrenos
WHERE is_marketplace_listing = true
  AND status = 'active'
ORDER BY created_at DESC;

-- ⚠️ IMPORTANTE: Cuenta cuántos resultados ves aquí.
-- Deberías ver 2 terrenos según lo que mencionaste.


-- ========================================
-- 4. VERIFICAR POLÍTICAS RLS EXISTENTES
-- ========================================

-- Ver todas las políticas RLS de la tabla terrenos
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
WHERE tablename = 'terrenos';

-- ⚠️ Deberías ver políticas como:
-- - "Users can view their own terrenos"
-- - "Anyone can view marketplace listings"
-- - "Anyone can view tours for embed"


-- ========================================
-- 5. VERIFICAR SI RLS ESTÁ HABILITADO
-- ========================================

SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'terrenos';

-- rowsecurity debe ser TRUE


-- ========================================
-- 6. SOLUCIÓN: CREAR/ACTUALIZAR POLÍTICA PARA MARKETPLACE
-- ========================================

-- PRIMERO: Eliminar política antigua si existe
DROP POLICY IF EXISTS "Anyone can view marketplace listings" ON terrenos;

-- SEGUNDO: Crear política correcta para marketplace público
CREATE POLICY "Anyone can view marketplace listings"
ON terrenos
FOR SELECT
USING (
  is_marketplace_listing = true
  AND status = 'active'
);


-- ========================================
-- 7. VERIFICAR QUE LA POLÍTICA FUNCIONA
-- ========================================

-- Ejecuta esto SIN estar autenticado (en modo anónimo)
-- Para hacer esto:
-- 1. Abre una ventana de incógnito
-- 2. Ve a tu app en /propiedades
-- 3. Abre la consola del navegador (F12)
-- 4. Debería mostrar 2 terrenos

-- O ejecuta esta consulta en SQL Editor:
SELECT
  id,
  title,
  is_marketplace_listing,
  status
FROM terrenos
WHERE is_marketplace_listing = true
  AND status = 'active';


-- ========================================
-- 8. VERIFICAR USER_PROFILES
-- ========================================

-- Ver todos los usuarios registrados
SELECT
  id,
  user_type,
  subscription_plan,
  max_tours,
  is_verified,
  created_at
FROM user_profiles
ORDER BY created_at DESC;


-- ========================================
-- 9. ACTUALIZAR MANUALMENTE STATUS A ACTIVE
-- ========================================

-- Si necesitas cambiar status a 'active' de terrenos específicos:
UPDATE terrenos
SET status = 'active'
WHERE is_marketplace_listing = true
  AND status = 'pending_approval';

-- Verifica que se actualizaron:
SELECT id, title, status FROM terrenos WHERE is_marketplace_listing = true;


-- ========================================
-- 10. SOLUCIÓN COMPLETA: RECREAR TODAS LAS POLÍTICAS
-- ========================================

-- Si nada funciona, ejecuta esto para recrear todas las políticas:

-- 1. Eliminar todas las políticas de terrenos
DROP POLICY IF EXISTS "Users can view their own terrenos" ON terrenos;
DROP POLICY IF EXISTS "Users can insert their own terrenos" ON terrenos;
DROP POLICY IF EXISTS "Users can update their own terrenos" ON terrenos;
DROP POLICY IF EXISTS "Users can delete their own terrenos" ON terrenos;
DROP POLICY IF EXISTS "Anyone can view marketplace listings" ON terrenos;
DROP POLICY IF EXISTS "Anyone can view tours for embed" ON terrenos;

-- 2. Crear políticas correctas

-- Política para que usuarios vean SUS PROPIOS terrenos
CREATE POLICY "Users can view their own terrenos"
ON terrenos
FOR SELECT
USING (auth.uid() = user_id);

-- Política para MARKETPLACE PÚBLICO (sin autenticación)
CREATE POLICY "Public marketplace access"
ON terrenos
FOR SELECT
USING (
  is_marketplace_listing = true
  AND status = 'active'
);

-- Política para EMBED PÚBLICO (sin autenticación)
CREATE POLICY "Public embed access"
ON terrenos
FOR SELECT
USING (
  is_public_embed = true
  AND status = 'active'
);

-- Política para insertar (solo usuarios autenticados)
CREATE POLICY "Users can insert their own terrenos"
ON terrenos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política para actualizar (solo propios terrenos)
CREATE POLICY "Users can update their own terrenos"
ON terrenos
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para eliminar (solo propios terrenos)
CREATE POLICY "Users can delete their own terrenos"
ON terrenos
FOR DELETE
USING (auth.uid() = user_id);


-- ========================================
-- 11. DEBUGGING: VER ERRORES DE CONSULTAS
-- ========================================

-- Si todavía no funciona, habilita logging de errores:
-- Ve a: Dashboard → Settings → API → Enable detailed error messages


-- ========================================
-- 12. VERIFICACIÓN FINAL
-- ========================================

-- Ejecuta esta consulta simulando ser un usuario anónimo:
-- (Desconéctate de Supabase o usa modo incógnito)

SELECT COUNT(*) as "Terrenos visibles en marketplace"
FROM terrenos
WHERE is_marketplace_listing = true
  AND status = 'active';

-- Resultado esperado: 2


-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
--
-- 1. Las políticas RLS se aplican a TODAS las consultas,
--    incluyendo desde el frontend
--
-- 2. Si una política no existe o está mal configurada,
--    los datos NO se mostrarán aunque la consulta sea correcta
--
-- 3. El error más común es tener políticas que solo permiten
--    acceso a usuarios autenticados cuando necesitas acceso público
--
-- 4. Para marketplace y embed, NECESITAS políticas sin auth.uid()
--
-- 5. Si ejecutas consultas directamente en SQL Editor,
--    estás bypassing RLS a menos que uses "Run as anon"
--
-- ============================================
