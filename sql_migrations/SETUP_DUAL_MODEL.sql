-- ============================================
-- 🚀 LANDVIEW - CONFIGURACIÓN MODELO DUAL
-- ============================================
-- Marketplace de Terrenos + SaaS Editor de Tours 360°
--
-- Este script configura:
-- 1. Multi-tenancy (cada usuario ve solo sus tours)
-- 2. Marketplace (tours públicos en /propiedades)
-- 3. Embed público (tours para embeber en otras webs)
-- 4. Roles de usuario (admin, marketplace, saas)
-- 5. Row Level Security (RLS)
-- ============================================

-- ============================================
-- 1. AGREGAR COLUMNAS A 'terrenos'
-- ============================================

-- Columna: ¿Este tour se publica en el marketplace?
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS is_marketplace_listing BOOLEAN DEFAULT false;

-- Columna: ¿El tour puede verse vía embed público?
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS is_public_embed BOOLEAN DEFAULT true;

-- Columna: Estado del tour
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
-- Valores: 'active', 'paused', 'pending_approval', 'rejected'

-- Columna: Fecha de publicación en marketplace
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

-- Columna: Razón de rechazo (si aplica)
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Columna: Slug para URLs amigables
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- ============================================
-- 2. CREAR TABLA 'user_profiles' (Roles)
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  user_type VARCHAR(50) DEFAULT 'client_saas',
  -- Valores: 'admin', 'client_marketplace', 'client_saas', 'client_both'

  subscription_plan VARCHAR(50) DEFAULT 'free',
  -- Valores: 'free', 'basic', 'pro', 'enterprise'

  max_tours INTEGER DEFAULT 2,
  -- Límite de tours según plan (free: 2, basic: 10, pro: 50, enterprise: 999)

  is_verified BOOLEAN DEFAULT false,
  -- Verificación de identidad (para publicar en marketplace)

  company_name VARCHAR(255),
  -- Nombre de empresa/agencia

  phone VARCHAR(50),
  -- Teléfono de contacto

  whatsapp_number VARCHAR(50),
  -- Número de WhatsApp

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_plan ON user_profiles(subscription_plan);

-- ============================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE terrenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. ELIMINAR POLÍTICAS ANTIGUAS (si existen)
-- ============================================

DROP POLICY IF EXISTS "Users can view their own terrenos" ON terrenos;
DROP POLICY IF EXISTS "Users can create their own terrenos" ON terrenos;
DROP POLICY IF EXISTS "Users can update their own terrenos" ON terrenos;
DROP POLICY IF EXISTS "Users can delete their own terrenos" ON terrenos;
DROP POLICY IF EXISTS "Anyone can view all terrenos for public display" ON terrenos;

DROP POLICY IF EXISTS "Users can view hotspots of their own terrenos" ON hotspots;
DROP POLICY IF EXISTS "Users can create hotspots on their own terrenos" ON hotspots;
DROP POLICY IF EXISTS "Users can update hotspots of their own terrenos" ON hotspots;
DROP POLICY IF EXISTS "Users can delete hotspots of their own terrenos" ON hotspots;

-- ============================================
-- 5. POLÍTICAS PARA 'terrenos'
-- ============================================

-- 5.1. VER tours propios (dashboard privado)
CREATE POLICY "Users can view their own terrenos"
ON terrenos FOR SELECT
USING (auth.uid() = user_id);

-- 5.2. VER tours del marketplace (público, sin autenticación)
CREATE POLICY "Anyone can view marketplace listings"
ON terrenos FOR SELECT
USING (
  is_marketplace_listing = true
  AND status = 'active'
);

-- 5.3. VER tours vía embed (público, sin autenticación)
CREATE POLICY "Anyone can view tours for embed"
ON terrenos FOR SELECT
USING (is_public_embed = true AND status = 'active');

-- 5.4. CREAR tours (usuarios autenticados)
CREATE POLICY "Authenticated users can create terrenos"
ON terrenos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5.5. ACTUALIZAR solo tus tours
CREATE POLICY "Users can update their own terrenos"
ON terrenos FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5.6. ELIMINAR solo tus tours
CREATE POLICY "Users can delete their own terrenos"
ON terrenos FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 6. POLÍTICAS PARA 'hotspots'
-- ============================================

-- 6.1. VER hotspots de tours públicos (embed/marketplace)
CREATE POLICY "Anyone can view hotspots of public terrenos"
ON hotspots FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND (
      (terrenos.is_public_embed = true AND terrenos.status = 'active')
      OR
      (terrenos.is_marketplace_listing = true AND terrenos.status = 'active')
    )
  )
);

-- 6.2. VER hotspots de tus tours (dashboard)
CREATE POLICY "Users can view hotspots of their own terrenos"
ON hotspots FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

-- 6.3. CREAR hotspots en tus tours
CREATE POLICY "Users can create hotspots on their own terrenos"
ON hotspots FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

-- 6.4. ACTUALIZAR hotspots de tus tours
CREATE POLICY "Users can update hotspots of their own terrenos"
ON hotspots FOR UPDATE
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

-- 6.5. ELIMINAR hotspots de tus tours
CREATE POLICY "Users can delete hotspots of their own terrenos"
ON hotspots FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM terrenos
    WHERE terrenos.id = hotspots.terreno_id
    AND terrenos.user_id = auth.uid()
  )
);

-- ============================================
-- 7. POLÍTICAS PARA 'user_profiles'
-- ============================================

-- 7.1. VER tu propio perfil
CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- 7.2. CREAR tu perfil (al registrarse)
CREATE POLICY "Users can create their own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 7.3. ACTUALIZAR tu propio perfil
CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- 8. FUNCIÓN: Crear perfil automáticamente al registrarse
-- ============================================

-- Eliminar trigger y función si existen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear función
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    user_type,
    subscription_plan,
    max_tours,
    company_name,
    phone
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client_saas'),
    'free',
    2,
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 9. ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_terrenos_user_id ON terrenos(user_id);
CREATE INDEX IF NOT EXISTS idx_terrenos_marketplace ON terrenos(is_marketplace_listing) WHERE is_marketplace_listing = true;
CREATE INDEX IF NOT EXISTS idx_terrenos_status ON terrenos(status);
CREATE INDEX IF NOT EXISTS idx_terrenos_slug ON terrenos(slug);
CREATE INDEX IF NOT EXISTS idx_hotspots_terreno_id ON hotspots(terreno_id);

-- ============================================
-- 10. VERIFICAR INSTALACIÓN
-- ============================================

-- Ver políticas de terrenos
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('terrenos', 'hotspots', 'user_profiles')
ORDER BY tablename, policyname;

-- Ver columnas de terrenos
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'terrenos'
ORDER BY ordinal_position;

-- Ver columnas de user_profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- ============================================
-- ✅ INSTALACIÓN COMPLETA
-- ============================================

-- Después de ejecutar este script:
-- 1. Multi-tenancy configurado ✅
-- 2. Marketplace funcional ✅
-- 3. Embed público habilitado ✅
-- 4. Roles de usuario creados ✅
-- 5. RLS activo y protegiendo datos ✅

-- Próximos pasos:
-- 1. Actualizar código frontend para usar nuevas columnas
-- 2. Crear página /embed/terreno/[id]
-- 3. Agregar toggle "Publicar en marketplace" en dashboard
-- 4. Implementar botón "Obtener código embed"
