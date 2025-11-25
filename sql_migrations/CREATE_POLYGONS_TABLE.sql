-- =====================================================
-- CREAR TABLA DE POLÍGONOS - POTENTIAMX
-- =====================================================
-- Tabla para almacenar polígonos de límites por vista 360°
-- Cada vista (panorama) puede tener múltiples polígonos
-- =====================================================

-- 1. Crear tabla polygons
CREATE TABLE IF NOT EXISTS public.polygons (
  -- Identificadores
  id BIGSERIAL PRIMARY KEY,
  terreno_id UUID NOT NULL REFERENCES public.terrenos(id) ON DELETE CASCADE,
  panorama_index INTEGER NOT NULL, -- Índice de la vista 360° (0, 1, 2, etc.)

  -- Datos del polígono
  points JSONB NOT NULL, -- Array de puntos [{yaw: "X.XXrad", pitch: "Y.YYrad"}, ...]

  -- Metadata
  name TEXT, -- Nombre descriptivo del polígono (ej: "Límite Norte", "Área de Construcción")
  description TEXT, -- Descripción opcional
  color VARCHAR(7) DEFAULT '#00ff00', -- Color del polígono en formato hex (#RRGGBB)
  fill_opacity NUMERIC(3,2) DEFAULT 0.25 CHECK (fill_opacity >= 0 AND fill_opacity <= 1), -- Opacidad del relleno (0.0 a 1.0)
  stroke_width INTEGER DEFAULT 4 CHECK (stroke_width > 0), -- Grosor del borde en pixels

  -- Visibilidad y estado
  visible BOOLEAN DEFAULT true, -- Si el polígono está visible
  z_index INTEGER DEFAULT 5, -- Orden de renderizado (mayor = encima)

  -- Auditoría
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_polygons_terreno_id
  ON public.polygons(terreno_id);

CREATE INDEX IF NOT EXISTS idx_polygons_terreno_panorama
  ON public.polygons(terreno_id, panorama_index);

CREATE INDEX IF NOT EXISTS idx_polygons_visible
  ON public.polygons(visible) WHERE visible = true;

-- 3. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_polygons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Crear trigger para updated_at
DROP TRIGGER IF EXISTS trigger_update_polygons_updated_at ON public.polygons;
CREATE TRIGGER trigger_update_polygons_updated_at
  BEFORE UPDATE ON public.polygons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_polygons_updated_at();

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.polygons ENABLE ROW LEVEL SECURITY;

-- Policy: Lectura pública (cualquiera puede ver polígonos de terrenos públicos)
CREATE POLICY "Public read access for polygons"
  ON public.polygons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.terrenos
      WHERE terrenos.id = polygons.terreno_id
    )
  );

-- Policy: Usuarios autenticados pueden crear polígonos en sus propios terrenos
CREATE POLICY "Authenticated users can insert polygons for own terrenos"
  ON public.polygons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.terrenos
      WHERE terrenos.id = polygons.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  );

-- Policy: Usuarios pueden actualizar polígonos de sus propios terrenos
CREATE POLICY "Users can update own terreno polygons"
  ON public.polygons
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.terrenos
      WHERE terrenos.id = polygons.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.terrenos
      WHERE terrenos.id = polygons.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  );

-- Policy: Usuarios pueden eliminar polígonos de sus propios terrenos
CREATE POLICY "Users can delete own terreno polygons"
  ON public.polygons
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.terrenos
      WHERE terrenos.id = polygons.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  );

-- 6. Comentarios en la tabla y columnas (documentación)
COMMENT ON TABLE public.polygons IS 'Almacena polígonos de límites/áreas para cada vista 360° de los terrenos';
COMMENT ON COLUMN public.polygons.terreno_id IS 'FK al terreno al que pertenece este polígono';
COMMENT ON COLUMN public.polygons.panorama_index IS 'Índice de la vista 360° (0-based, coincide con array image_urls)';
COMMENT ON COLUMN public.polygons.points IS 'Array JSON de puntos del polígono en formato [{yaw:"Xrad", pitch:"Yrad"}]';
COMMENT ON COLUMN public.polygons.name IS 'Nombre descriptivo del polígono (ej: "Límite Norte")';
COMMENT ON COLUMN public.polygons.color IS 'Color del polígono en formato hex (#RRGGBB)';
COMMENT ON COLUMN public.polygons.fill_opacity IS 'Opacidad del relleno (0.0 = transparente, 1.0 = opaco)';
COMMENT ON COLUMN public.polygons.stroke_width IS 'Grosor del borde en pixels';
COMMENT ON COLUMN public.polygons.visible IS 'Si el polígono está visible en el visor';
COMMENT ON COLUMN public.polygons.z_index IS 'Orden de renderizado (mayor = encima de otros)';

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Copia y pega este script completo en Supabase SQL Editor
-- 2. Ejecuta el script
-- 3. Verifica que la tabla se creó correctamente con:
--    SELECT * FROM information_schema.columns
--    WHERE table_name = 'polygons' ORDER BY ordinal_position;
-- 4. Prueba insertar un polígono de ejemplo (ver abajo)
-- =====================================================

-- EJEMPLO DE INSERCIÓN (Descomentar para probar):
/*
INSERT INTO public.polygons (
  terreno_id,
  panorama_index,
  points,
  name,
  description,
  color,
  fill_opacity,
  stroke_width,
  visible,
  created_by
) VALUES (
  'UUID-DEL-TERRENO-AQUI', -- Reemplazar con un UUID real de terrenos
  0, -- Primera vista (índice 0)
  '[
    {"yaw": "0.5rad", "pitch": "0.2rad"},
    {"yaw": "1.0rad", "pitch": "0.1rad"},
    {"yaw": "0.8rad", "pitch": "-0.3rad"}
  ]'::jsonb,
  'Límite Norte',
  'Límite frontal del terreno',
  '#00ff00',
  0.25,
  4,
  true,
  auth.uid() -- Usuario actual
);
*/

-- =====================================================
-- VERIFICACIÓN POST-INSTALACIÓN:
-- =====================================================
-- Ejecutar para verificar que todo está correcto:
/*
-- Ver estructura de la tabla
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'polygons'
ORDER BY ordinal_position;

-- Ver políticas RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'polygons';

-- Ver índices
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'polygons';
*/
