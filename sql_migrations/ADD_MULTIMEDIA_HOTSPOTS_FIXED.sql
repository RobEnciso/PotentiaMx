-- Agregar campos multimedia a hotspots
-- Permite hotspots con información, imágenes, videos y audio dual (ambiente + narración)
-- ADAPTADO a la estructura actual de Supabase (id es UUID)

-- 1. Agregar columna de tipo de hotspot
ALTER TABLE hotspots
ADD COLUMN IF NOT EXISTS hotspot_type TEXT DEFAULT 'navigation'
CHECK (hotspot_type IN ('navigation', 'info', 'image', 'video', 'audio'));

-- 2. Agregar campos de contenido multimedia
ALTER TABLE hotspots
ADD COLUMN IF NOT EXISTS content_text TEXT,
ADD COLUMN IF NOT EXISTS content_images TEXT[], -- Array de URLs de imágenes
ADD COLUMN IF NOT EXISTS content_video_url TEXT,
ADD COLUMN IF NOT EXISTS content_video_thumbnail TEXT;

-- 3. Sistema de audio DUAL (ambiente + narración)
ALTER TABLE hotspots
ADD COLUMN IF NOT EXISTS audio_ambient_url TEXT,        -- Audio de fondo (ej: pájaros)
ADD COLUMN IF NOT EXISTS audio_ambient_volume DECIMAL(3,2) DEFAULT 0.3,
ADD COLUMN IF NOT EXISTS audio_ambient_loop BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS audio_narration_url TEXT,      -- Narración/voz (ej: descripción)
ADD COLUMN IF NOT EXISTS audio_narration_volume DECIMAL(3,2) DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS audio_autoplay BOOLEAN DEFAULT false;

-- 4. Configuración de backlink automático
-- ✅ CORREGIDO: backlink_id es UUID para coincidir con hotspots.id (uuid)
ALTER TABLE hotspots
ADD COLUMN IF NOT EXISTS create_backlink BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS backlink_id UUID REFERENCES hotspots(id) ON DELETE SET NULL;

-- 5. Iconos personalizados
ALTER TABLE hotspots
ADD COLUMN IF NOT EXISTS custom_icon_url TEXT,
ADD COLUMN IF NOT EXISTS icon_size INTEGER DEFAULT 40; -- Tamaño en píxeles

-- Comentarios para documentación
COMMENT ON COLUMN hotspots.hotspot_type IS 'Tipo: navigation (navegar), info (texto), image (galería), video (multimedia), audio (sonido)';
COMMENT ON COLUMN hotspots.content_text IS 'Texto descriptivo para pop-ups';
COMMENT ON COLUMN hotspots.content_images IS 'Array de URLs de imágenes para galería';
COMMENT ON COLUMN hotspots.content_video_url IS 'URL del video (MP4 optimizado, máx 20MB)';
COMMENT ON COLUMN hotspots.audio_ambient_url IS 'Audio de ambiente (loop continuo, volumen bajo)';
COMMENT ON COLUMN hotspots.audio_narration_url IS 'Audio de narración (una vez, volumen alto)';
COMMENT ON COLUMN hotspots.create_backlink IS 'Si true, crea automáticamente hotspot de regreso en vista destino';
COMMENT ON COLUMN hotspots.backlink_id IS 'ID del hotspot de regreso vinculado (si fue creado automáticamente)';

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_hotspots_type ON hotspots(hotspot_type);
CREATE INDEX IF NOT EXISTS idx_hotspots_backlink ON hotspots(backlink_id);

-- Verificar cambios (ejecutar después para confirmar)
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'hotspots'
  AND column_name IN (
    'hotspot_type',
    'content_text',
    'content_images',
    'audio_ambient_url',
    'audio_narration_url',
    'create_backlink',
    'backlink_id',
    'custom_icon_url'
  )
ORDER BY ordinal_position;
