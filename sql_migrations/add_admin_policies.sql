-- ===================================================================
-- POLÍTICAS DE ADMINISTRADOR - Permitir acceso total a datos
-- ===================================================================
-- Fecha: 19 de Octubre, 2025
-- Descripción: Permitir que administradores vean TODOS los datos
--              para estadísticas y gestión de la plataforma
-- ===================================================================

-- ============================================
-- 1. POLÍTICA ADMIN PARA user_profiles
-- ============================================

-- Los administradores pueden ver TODOS los perfiles
CREATE POLICY "Admins can view all user profiles"
ON user_profiles FOR SELECT
USING (
  auth.jwt() ->> 'email' IN (
    'admin@potentiamx.com',
    'victor.admin@potentiamx.com'
  )
);

-- ============================================
-- 2. POLÍTICA ADMIN PARA terrenos
-- ============================================

-- Los administradores pueden ver TODOS los terrenos
CREATE POLICY "Admins can view all terrenos"
ON terrenos FOR SELECT
USING (
  auth.jwt() ->> 'email' IN (
    'admin@potentiamx.com',
    'victor.admin@potentiamx.com'
  )
);

-- Los administradores pueden actualizar TODOS los terrenos (para aprobación marketplace)
CREATE POLICY "Admins can update all terrenos"
ON terrenos FOR UPDATE
USING (
  auth.jwt() ->> 'email' IN (
    'admin@potentiamx.com',
    'victor.admin@potentiamx.com'
  )
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (
    'admin@potentiamx.com',
    'victor.admin@potentiamx.com'
  )
);

-- ============================================
-- 3. POLÍTICA ADMIN PARA hotspots
-- ============================================

-- Los administradores pueden ver TODOS los hotspots
CREATE POLICY "Admins can view all hotspots"
ON hotspots FOR SELECT
USING (
  auth.jwt() ->> 'email' IN (
    'admin@potentiamx.com',
    'victor.admin@potentiamx.com'
  )
);

-- ============================================
-- 4. VERIFICAR POLÍTICAS INSTALADAS
-- ============================================

-- Ver todas las políticas de las tablas principales
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('terrenos', 'hotspots', 'user_profiles')
  AND policyname LIKE '%Admin%'
ORDER BY tablename, policyname;

-- ===================================================================
-- NOTA IMPORTANTE:
-- ===================================================================
-- Estas políticas usan auth.jwt() ->> 'email' para verificar el email
-- del usuario autenticado. Solo los emails listados tendrán acceso
-- total a los datos de la plataforma.
--
-- Para agregar más administradores en el futuro, simplemente agrega
-- su email a la lista en cada política.
-- ===================================================================

-- ===================================================================
-- INSTRUCCIONES DE USO:
-- ===================================================================
-- 1. Abre Supabase Dashboard
-- 2. Ve a SQL Editor
-- 3. Copia y pega este script completo
-- 4. Ejecuta (Run)
-- 5. Verifica que no haya errores
-- 6. Recarga el dashboard como admin y verifica las estadísticas
-- ===================================================================
