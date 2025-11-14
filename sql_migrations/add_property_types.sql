-- ===================================================================
-- SISTEMA DE TIPOS DE PROPIEDAD
-- ===================================================================
-- Fecha: 18 de Enero, 2025
-- Descripción: Expande el sistema de solo "terrenos" a multi-tipo:
--              Casa, Departamento, Terreno (con subcategorías)
-- ===================================================================

-- 1. Agregar nuevas columnas a la tabla terrenos
ALTER TABLE public.terrenos
ADD COLUMN IF NOT EXISTS property_type VARCHAR(50) DEFAULT 'terreno',
ADD COLUMN IF NOT EXISTS land_category VARCHAR(50),
ADD COLUMN IF NOT EXISTS available_for_contribution BOOLEAN DEFAULT false;

-- 2. Comentarios para documentar las columnas
COMMENT ON COLUMN public.terrenos.property_type IS 'Tipo de propiedad: casa, departamento, terreno';
COMMENT ON COLUMN public.terrenos.land_category IS 'Subcategoría para terrenos: residencia, desarrollo, proyecto';
COMMENT ON COLUMN public.terrenos.available_for_contribution IS 'Si el terreno se ofrece en aportación para proyectos (solo para desarrollo/proyecto)';

-- 3. Crear índices para mejorar queries por tipo
CREATE INDEX IF NOT EXISTS idx_terrenos_property_type ON public.terrenos(property_type);
CREATE INDEX IF NOT EXISTS idx_terrenos_land_category ON public.terrenos(land_category);

-- 4. Actualizar terrenos existentes (todos eran "terreno" por defecto)
UPDATE public.terrenos
SET property_type = 'terreno'
WHERE property_type IS NULL;

-- 5. Verificar resultados
SELECT
  property_type,
  land_category,
  COUNT(*) as total
FROM public.terrenos
GROUP BY property_type, land_category
ORDER BY property_type, land_category;

-- ===================================================================
-- VALORES VÁLIDOS:
-- ===================================================================
-- property_type:
--   - 'casa'
--   - 'departamento'
--   - 'terreno'
--
-- land_category (solo si property_type = 'terreno'):
--   - 'residencia' (Terreno para residencia)
--   - 'desarrollo' (Terreno para desarrollo)
--   - 'proyecto' (Terreno para proyecto)
--
-- available_for_contribution:
--   - true/false (solo relevante si land_category = 'desarrollo' o 'proyecto')
-- ===================================================================

-- ===================================================================
-- NOTA: Ejecutar este script en Supabase SQL Editor
-- ===================================================================
