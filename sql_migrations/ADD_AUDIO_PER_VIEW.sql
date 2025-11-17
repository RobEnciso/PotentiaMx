-- Agregar campos de audio de fondo por vista en la tabla terrenos
-- Cada vista puede tener audio ambiente y narración

-- Agregar columnas para almacenar arrays de URLs de audio (uno por cada vista/panorama)
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS view_ambient_audio TEXT[], -- Array de URLs de audio ambiente (uno por vista)
ADD COLUMN IF NOT EXISTS view_ambient_volume DECIMAL(3,2)[] DEFAULT ARRAY[0.3], -- Array de volúmenes (0.0-1.0)
ADD COLUMN IF NOT EXISTS view_narration_audio TEXT[], -- Array de URLs de narración (uno por vista)
ADD COLUMN IF NOT EXISTS view_narration_volume DECIMAL(3,2)[] DEFAULT ARRAY[0.7], -- Array de volúmenes para narración
ADD COLUMN IF NOT EXISTS view_audio_autoplay BOOLEAN[] DEFAULT ARRAY[true]; -- Array de flags de autoplay

-- Comentarios para documentación
COMMENT ON COLUMN terrenos.view_ambient_audio IS 'Array de URLs de audio ambiente, un elemento por cada panorama en image_urls';
COMMENT ON COLUMN terrenos.view_ambient_volume IS 'Array de volúmenes para audio ambiente (0.0-1.0), un elemento por panorama';
COMMENT ON COLUMN terrenos.view_narration_audio IS 'Array de URLs de narración, un elemento por cada panorama en image_urls';
COMMENT ON COLUMN terrenos.view_narration_volume IS 'Array de volúmenes para narración (0.0-1.0), un elemento por panorama';
COMMENT ON COLUMN terrenos.view_audio_autoplay IS 'Array de flags booleanos para reproducción automática, un elemento por panorama';

-- Ejemplo de uso:
-- Si un terreno tiene 3 vistas (image_urls con 3 elementos), entonces:
-- view_ambient_audio = ['/audio/bosque.mp3', null, '/audio/rio.mp3']
-- view_ambient_volume = [0.3, 0.3, 0.4]
-- view_narration_audio = [null, '/audio/narracion-sala.mp3', null]
-- view_narration_volume = [0.7, 0.8, 0.7]
-- view_audio_autoplay = [true, true, false]
