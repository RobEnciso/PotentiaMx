# 🔧 Aplicar Migraciones SQL en Supabase (SEGURO)

## ⚠️ ERROR ACTUAL

```
Could not find the 'view_ambient_audio' column of 'terrenos' in the schema cache
```

**Causa**: Las columnas para audio por vista NO existen en la base de datos.

**Solución**: Aplicar las migraciones SQL manualmente en Supabase.

---

## ⚠️ IMPORTANTE: VERIFICAR PRIMERO

Antes de aplicar las migraciones, **SIEMPRE** verifica qué columnas ya existen para evitar duplicados o pérdida de datos.

---

## 📋 PASOS PARA APLICAR MIGRACIONES (ORDEN CORRECTO)

### 1. Abrir Supabase SQL Editor

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto (el que tiene ID: `tuhojmupstisctgaepsc`)
3. En el menú lateral, click en **"SQL Editor"**
4. Click en **"New query"** (botón verde arriba a la derecha)

---

### 2. PASO 0: Verificar Columnas Existentes (CRÍTICO) ⚠️

**Archivo**: `sql_migrations/00_VERIFICAR_COLUMNAS_ACTUALES.sql`

**Por qué**: Para saber qué columnas ya existen y evitar duplicados.

**SQL a ejecutar**:

```sql
-- Ver columnas de TERRENOS
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'terrenos'
ORDER BY ordinal_position;

-- Ver columnas de HOTSPOTS
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'hotspots'
ORDER BY ordinal_position;
```

**Acción**:
1. Copia el SQL de arriba
2. Pégalo en el SQL Editor
3. Click en **"Run"**
4. **GUARDA** los resultados (haz screenshot o cópialos)
5. Envíame los nombres de las columnas que ves

**⚠️ NO CONTINUES** hasta que verifiques esto.

---

### 3. PASO 1: Agregar Columnas de Audio (SEGURO)

**Archivo**: `sql_migrations/ADD_MULTIMEDIA_HOTSPOTS_FIXED.sql`

**Qué hace**: Agrega columnas para contenido multimedia en hotspots (texto, imágenes, video, audio).

**SQL a ejecutar**:

```sql
-- Agregar campos multimedia a la tabla hotspots
ALTER TABLE hotspots
ADD COLUMN IF NOT EXISTS hotspot_type TEXT DEFAULT 'navigation',
ADD COLUMN IF NOT EXISTS content_text TEXT,
ADD COLUMN IF NOT EXISTS content_images TEXT[],
ADD COLUMN IF NOT EXISTS content_video_url TEXT,
ADD COLUMN IF NOT EXISTS content_video_thumbnail TEXT,
ADD COLUMN IF NOT EXISTS audio_ambient_url TEXT,
ADD COLUMN IF NOT EXISTS audio_ambient_volume DECIMAL(3,2) DEFAULT 0.3,
ADD COLUMN IF NOT EXISTS audio_ambient_loop BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS audio_narration_url TEXT,
ADD COLUMN IF NOT EXISTS audio_narration_volume DECIMAL(3,2) DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS audio_autoplay BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS create_backlink BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_icon_url TEXT,
ADD COLUMN IF NOT EXISTS icon_size INTEGER DEFAULT 32;

-- Comentarios para documentación
COMMENT ON COLUMN hotspots.hotspot_type IS 'Tipo: navigation, info, image, video, audio';
COMMENT ON COLUMN hotspots.content_text IS 'Texto descriptivo para hotspots tipo "info"';
COMMENT ON COLUMN hotspots.content_images IS 'Array de URLs de imágenes para hotspots tipo "image"';
COMMENT ON COLUMN hotspots.content_video_url IS 'URL del video (upload o embed) para hotspots tipo "video"';
COMMENT ON COLUMN hotspots.content_video_thumbnail IS 'URL de la miniatura del video';
COMMENT ON COLUMN hotspots.audio_ambient_url IS 'URL del audio de ambiente (loop)';
COMMENT ON COLUMN hotspots.audio_ambient_volume IS 'Volumen del audio ambiente (0.0-1.0)';
COMMENT ON COLUMN hotspots.audio_ambient_loop IS 'Si el audio ambiente debe hacer loop';
COMMENT ON COLUMN hotspots.audio_narration_url IS 'URL de la narración (una vez)';
COMMENT ON COLUMN hotspots.audio_narration_volume IS 'Volumen de la narración (0.0-1.0)';
COMMENT ON COLUMN hotspots.audio_autoplay IS 'Si el audio debe reproducirse automáticamente';
COMMENT ON COLUMN hotspots.create_backlink IS 'Si se debe crear un hotspot de retorno automáticamente';
COMMENT ON COLUMN hotspots.custom_icon_url IS 'URL del icono personalizado (si se usa)';
COMMENT ON COLUMN hotspots.icon_size IS 'Tamaño del icono en píxeles (default: 32)';
```

**Acción**:
1. Copia todo el SQL de arriba
2. Pégalo en el SQL Editor de Supabase
3. Click en **"Run"** (botón verde)
4. Verifica que diga: "Success. No rows returned"

---

### 3. Aplicar Migración #2: Update RPC Function

**Archivo**: `sql_migrations/UPDATE_RPC_FUNCTION_MULTIMEDIA.sql`

**Qué hace**: Actualiza la función RPC para manejar los nuevos campos multimedia.

**SQL a ejecutar**:

```sql
-- Actualizar función RPC para soportar campos multimedia en hotspots
DROP FUNCTION IF EXISTS update_hotspots_for_terrain(UUID, JSONB);

CREATE OR REPLACE FUNCTION update_hotspots_for_terrain(
  terrain_id_to_update UUID,
  hotspots_data JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Eliminar todos los hotspots existentes de este terreno
  DELETE FROM hotspots WHERE terreno_id = terrain_id_to_update;

  -- 2. Insertar los nuevos hotspots con todos los campos multimedia
  INSERT INTO hotspots (
    terreno_id,
    title,
    position_yaw,
    position_pitch,
    panorama_index,
    target_panorama_index,
    hotspot_type,
    content_text,
    content_images,
    content_video_url,
    content_video_thumbnail,
    audio_ambient_url,
    audio_ambient_volume,
    audio_ambient_loop,
    audio_narration_url,
    audio_narration_volume,
    audio_autoplay,
    create_backlink,
    custom_icon_url,
    icon_size
  )
  SELECT
    terrain_id_to_update,
    (hotspot->>'title')::TEXT,
    (hotspot->>'position_yaw')::DOUBLE PRECISION,
    (hotspot->>'position_pitch')::DOUBLE PRECISION,
    (hotspot->>'panorama_index')::INTEGER,
    (hotspot->>'target_panorama_index')::INTEGER,
    COALESCE((hotspot->>'hotspot_type')::TEXT, 'navigation'),
    (hotspot->>'content_text')::TEXT,
    CASE
      WHEN hotspot->'content_images' IS NOT NULL AND hotspot->'content_images' != 'null'::jsonb
      THEN ARRAY(SELECT jsonb_array_elements_text(hotspot->'content_images'))
      ELSE NULL
    END,
    (hotspot->>'content_video_url')::TEXT,
    (hotspot->>'content_video_thumbnail')::TEXT,
    (hotspot->>'audio_ambient_url')::TEXT,
    COALESCE((hotspot->>'audio_ambient_volume')::DECIMAL(3,2), 0.3),
    COALESCE((hotspot->>'audio_ambient_loop')::BOOLEAN, true),
    (hotspot->>'audio_narration_url')::TEXT,
    COALESCE((hotspot->>'audio_narration_volume')::DECIMAL(3,2), 0.7),
    COALESCE((hotspot->>'audio_autoplay')::BOOLEAN, true),
    COALESCE((hotspot->>'create_backlink')::BOOLEAN, false),
    (hotspot->>'custom_icon_url')::TEXT,
    COALESCE((hotspot->>'icon_size')::INTEGER, 32)
  FROM jsonb_array_elements(hotspots_data) AS hotspot;
END;
$$;
```

**Acción**:
1. Copia todo el SQL de arriba
2. Pégalo en una **nueva query** en Supabase SQL Editor
3. Click en **"Run"**
4. Verifica que diga: "Success. No rows returned"

---

### 4. Aplicar Migración #3: Audio por Vista (⚠️ CRÍTICA)

**Archivo**: `sql_migrations/ADD_AUDIO_PER_VIEW.sql`

**Qué hace**: Agrega columnas para audio de fondo por vista en la tabla terrenos.

**SQL a ejecutar**:

```sql
-- Agregar campos de audio de fondo por vista en la tabla terrenos
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS view_ambient_audio TEXT[],
ADD COLUMN IF NOT EXISTS view_ambient_volume DECIMAL(3,2)[] DEFAULT ARRAY[0.3],
ADD COLUMN IF NOT EXISTS view_narration_audio TEXT[],
ADD COLUMN IF NOT EXISTS view_narration_volume DECIMAL(3,2)[] DEFAULT ARRAY[0.7],
ADD COLUMN IF NOT EXISTS view_audio_autoplay BOOLEAN[] DEFAULT ARRAY[true];

-- Comentarios para documentación
COMMENT ON COLUMN terrenos.view_ambient_audio IS 'Array de URLs de audio ambiente, un elemento por cada panorama en image_urls';
COMMENT ON COLUMN terrenos.view_ambient_volume IS 'Array de volúmenes para audio ambiente (0.0-1.0), un elemento por panorama';
COMMENT ON COLUMN terrenos.view_narration_audio IS 'Array de URLs de narración, un elemento por cada panorama en image_urls';
COMMENT ON COLUMN terrenos.view_narration_volume IS 'Array de volúmenes para narración (0.0-1.0), un elemento por panorama';
COMMENT ON COLUMN terrenos.view_audio_autoplay IS 'Array de flags booleanos para reproducción automática, un elemento por panorama';
```

**Acción**:
1. Copia todo el SQL de arriba
2. Pégalo en una **nueva query** en Supabase SQL Editor
3. Click en **"Run"**
4. Verifica que diga: "Success. No rows returned"

---

## ✅ VERIFICAR QUE FUNCIONÓ

Después de aplicar las 3 migraciones:

### Opción 1: SQL Editor
Ejecuta este query para verificar:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'terrenos'
  AND column_name LIKE 'view_%';
```

**Deberías ver**:
- `view_ambient_audio` | `ARRAY`
- `view_ambient_volume` | `ARRAY`
- `view_narration_audio` | `ARRAY`
- `view_narration_volume` | `ARRAY`
- `view_audio_autoplay` | `ARRAY`

### Opción 2: Probar en la App
1. Ve al editor de hotspots
2. Selecciona un audio de la biblioteca
3. Click en "Guardar Audio de Vista"
4. **NO debería dar error 400**
5. Debería mostrar: "✅ Audio de fondo guardado correctamente"

---

## 🚨 SI ALGO FALLA

### Error: "permission denied"
**Causa**: No tienes permisos suficientes.
**Solución**: Asegúrate de estar usando el owner del proyecto.

### Error: "column already exists"
**Causa**: Ya aplicaste la migración antes.
**Solución**: Ignora el error, está bien. Las columnas ya existen.

### Error: "syntax error"
**Causa**: Copiaste mal el SQL.
**Solución**: Copia nuevamente TODO el bloque SQL completo.

---

## 📝 ORDEN DE EJECUCIÓN

**IMPORTANTE**: Ejecuta en este orden:

1. ✅ ADD_MULTIMEDIA_HOTSPOTS_FIXED.sql
2. ✅ UPDATE_RPC_FUNCTION_MULTIMEDIA.sql
3. ✅ ADD_AUDIO_PER_VIEW.sql

**NO** cambies el orden o puede fallar.

---

## 🎯 DESPUÉS DE APLICAR

1. Recarga la página del editor
2. Prueba seleccionar un audio
3. Guarda
4. Verifica que no haya errores en la consola
5. ¡Listo! 🎉
