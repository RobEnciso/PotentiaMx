-- ============================================
-- 🔐 ROW LEVEL SECURITY (RLS) SETUP
-- ============================================
-- Este archivo contiene las políticas de seguridad para tu base de datos
-- Ejecuta estos comandos en el SQL Editor de Supabase Dashboard
--
-- ⚠️ IMPORTANTE: Esto es CRÍTICO para la seguridad multi-tenant
-- Sin estas políticas, cualquier usuario puede ver/editar datos de otros
-- ============================================

-- ============================================
-- 1. HABILITAR RLS EN LAS TABLAS
-- ============================================

-- Habilitar RLS en tabla terrenos
ALTER TABLE terrenos ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en tabla hotspots
ALTER TABLE hotspots ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLÍTICAS PARA TABLA 'terrenos'
-- ============================================

-- Política: Los usuarios pueden VER solo sus propios terrenos
CREATE POLICY "Users can view their own terrenos"
ON terrenos
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Los usuarios pueden CREAR terrenos (asignándose como dueños)
CREATE POLICY "Users can create their own terrenos"
ON terrenos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden ACTUALIZAR solo sus propios terrenos
CREATE POLICY "Users can update their own terrenos"
ON terrenos
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden ELIMINAR solo sus propios terrenos
CREATE POLICY "Users can delete their own terrenos"
ON terrenos
FOR DELETE
USING (auth.uid() = user_id);

-- Política ADICIONAL: Permitir que TODOS vean todos los terrenos (para /propiedades público)
-- ⚠️ SOLO descomenta esta línea si quieres que /propiedades muestre TODAS las propiedades de TODOS los usuarios
-- CREATE POLICY "Anyone can view all terrenos for public display"
-- ON terrenos
-- FOR SELECT
-- USING (true);

-- ============================================
-- 3. POLÍTICAS PARA TABLA 'hotspots'
-- ============================================

-- Política: Los usuarios pueden VER hotspots de sus propios terrenos
CREATE POLICY "Users can view hotspots of their own terrenos"
ON hotspots
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

-- Política: Los usuarios pueden CREAR hotspots en sus propios terrenos
CREATE POLICY "Users can create hotspots on their own terrenos"
ON hotspots
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

-- Política: Los usuarios pueden ACTUALIZAR hotspots de sus propios terrenos
CREATE POLICY "Users can update hotspots of their own terrenos"
ON hotspots
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

-- Política: Los usuarios pueden ELIMINAR hotspots de sus propios terrenos
CREATE POLICY "Users can delete hotspots of their own terrenos"
ON hotspots
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

-- ============================================
-- 4. VERIFICAR QUE LAS POLÍTICAS FUNCIONAN
-- ============================================

-- Ejecuta estas consultas para verificar que las políticas están activas:

-- Ver todas las políticas de la tabla terrenos
SELECT * FROM pg_policies WHERE tablename = 'terrenos';

-- Ver todas las políticas de la tabla hotspots
SELECT * FROM pg_policies WHERE tablename = 'hotspots';

-- ============================================
-- 5. OPCIONAL: VISTA PÚBLICA PARA /propiedades
-- ============================================

-- Si quieres que la página /propiedades muestre TODAS las propiedades de TODOS los usuarios
-- pero mantengas el dashboard privado, puedes crear una vista pública:

-- CREATE VIEW public_terrenos AS
-- SELECT
--   id,
--   title,
--   description,
--   land_use,
--   total_square_meters,
--   price_per_sqm,
--   sale_price,
--   front_measures,
--   depth_measures,
--   image_urls,
--   cover_image_url,
--   created_at
-- FROM terrenos;

-- Luego en /propiedades usarías: supabase.from('public_terrenos').select('*')
-- Y en dashboard seguirías usando: supabase.from('terrenos').select('*')

-- ============================================
-- 6. DESHACER CAMBIOS (SOLO SI ALGO SALE MAL)
-- ============================================

-- Si necesitas revertir los cambios, ejecuta:

-- DROP POLICY IF EXISTS "Users can view their own terrenos" ON terrenos;
-- DROP POLICY IF EXISTS "Users can create their own terrenos" ON terrenos;
-- DROP POLICY IF EXISTS "Users can update their own terrenos" ON terrenos;
-- DROP POLICY IF EXISTS "Users can delete their own terrenos" ON terrenos;
-- DROP POLICY IF EXISTS "Users can view hotspots of their own terrenos" ON hotspots;
-- DROP POLICY IF EXISTS "Users can create hotspots on their own terrenos" ON hotspots;
-- DROP POLICY IF EXISTS "Users can update hotspots of their own terrenos" ON hotspots;
-- DROP POLICY IF EXISTS "Users can delete hotspots of their own terrenos" ON hotspots;
-- ALTER TABLE terrenos DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE hotspots DISABLE ROW LEVEL SECURITY;

-- ============================================
-- ✅ LISTO
-- ============================================
-- Después de ejecutar estos comandos:
-- 1. Cada usuario solo verá sus propios terrenos en el dashboard
-- 2. No podrán editar/eliminar terrenos de otros usuarios
-- 3. La seguridad está garantizada a nivel de base de datos (no solo frontend)
