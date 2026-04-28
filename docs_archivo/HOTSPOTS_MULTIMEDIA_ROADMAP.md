# 🎯 Roadmap: Hotspots Multimedia & Presentaciones Inmersivas

## 📋 Objetivo
Transformar PotentiaMX de un "tour virtual básico" a una **plataforma de presentaciones inmersivas** que permita vender propiedades con contenido multimedia interactivo.

---

## ✅ Fase 1: Fundamentos (COMPLETADO)

### 1.1 Migración de Base de Datos
**Archivo:** `sql_migrations/ADD_MULTIMEDIA_HOTSPOTS.sql`

**Campos agregados a `hotspots`:**
- `hotspot_type` - Tipo: navigation, info, image, video, audio
- `content_text` - Texto descriptivo para pop-ups
- `content_images` - Array de URLs de imágenes
- `content_video_url` - URL del video
- `audio_ambient_url` - Audio de fondo (loop)
- `audio_ambient_volume` - Volumen ambiente (0.3 default)
- `audio_narration_url` - Audio de narración (una vez)
- `audio_narration_volume` - Volumen narración (0.7 default)
- `create_backlink` - Crear hotspot de regreso automático
- `backlink_id` - ID del hotspot vinculado
- `custom_icon_url` - Icono personalizado
- `icon_size` - Tamaño del icono

**Ejecutar en Supabase:**
```sql
-- Copiar y ejecutar el contenido de ADD_MULTIMEDIA_HOTSPOTS.sql
```

---

### 1.2 Componente de Iconos
**Archivo:** `components/HotspotIcon.js`

**Iconos disponibles:**
- 📍 **Navigation** - Blanco (navegar entre vistas)
- ℹ️ **Info** - Azul (#3b82f6) (texto descriptivo)
- 📸 **Image** - Morado (#8b5cf6) (galería de fotos)
- 🎥 **Video** - Rojo (#ef4444) (multimedia)
- 🔊 **Audio** - Verde (#10b981) (ambiente)
- 🎙️ **Narration** - Naranja (#f59e0b) (voz en off)

**Uso:**
```javascript
import { getHotspotIconHTML } from '@/components/HotspotIcon';

const iconHTML = getHotspotIconHTML('info', 32); // Tipo, tamaño
```

---

### 1.3 Librería de Audios
**Archivo:** `lib/audioLibrary.js`

**Audios pre-cargados (libres de derechos):**
1. Bosque - Mañana con Pájaros (3:45)
2. Selva - Especies de Pájaros (4:12)
3. Selva - Río con Gibones (5:20)
4. Bosque - Ruiseñor al Amanecer (4:30)

**Funciones disponibles:**
- `getAudioById(id)` - Obtener audio específico
- `getAudiosByType(type)` - Filtrar por tipo
- `searchAudiosByTags(tags)` - Buscar por etiquetas
- `validateAudioFile(file)` - Validar archivo subido

---

### 1.4 Servicio de Hotspots Actualizado
**Archivo:** `lib/hotspotsService.js`

**Nuevas funcionalidades:**
- ✅ Soporte para hotspots multimedia
- ✅ Backlink automático al crear navegación
- ✅ Eliminación en cascada (hotspot + backlink)
- ✅ Validación de tipos

**Ejemplo de uso:**
```javascript
const hotspot = await createHotspot({
  terreno_id: '123',
  type: 'info',
  yaw: 1.5,
  pitch: 0.2,
  panorama_index: 0,
  title: 'Ventanas acústicas',
  content_text: 'Vidrio doble panel con aislamiento...',
  content_images: ['/uploads/ventana1.jpg'],
  content_video_url: '/uploads/demo.mp4',
  create_backlink: true, // Crea hotspot de regreso automático
});
```

---

## 🚧 Fase 2: UI del Editor (EN DESARROLLO)

### 2.1 Panel Lateral Mejorado
**Ubicación:** `app/terreno/[id]/editor/HotspotEditor.js`

**Cambios necesarios:**

#### A) Selector de Tipo de Hotspot
```javascript
<select value={hotspotType} onChange={(e) => setHotspotType(e.target.value)}>
  <option value="navigation">🧭 Navegación</option>
  <option value="info">ℹ️ Información</option>
  <option value="image">📸 Galería</option>
  <option value="video">🎥 Video</option>
  <option value="audio">🔊 Audio</option>
</select>
```

#### B) Formulario Condicional según Tipo

**Tipo: Info**
- Título
- Descripción (textarea)
- Imágenes (upload múltiple)
- Video (upload, máx 20MB)

**Tipo: Audio**
- Selector de librería de sonidos
- Upload audio personalizado
- Autoplay checkbox
- Loop checkbox
- Slider de volumen

**Tipo: Navegación** (actual + mejoras)
- Vista destino
- **NUEVO:** Checkbox "Crear hotspot de regreso"
- **NUEVO:** Preview del backlink

---

### 2.2 Sistema de Audio Dual
**Implementar en:** `app/terreno/[id]/PhotoSphereViewer.js`

```javascript
// Audio Ambiente (loop, volumen bajo)
const ambientAudio = new Audio(hotspot.audio_ambient_url);
ambientAudio.loop = true;
ambientAudio.volume = hotspot.audio_ambient_volume || 0.3;
ambientAudio.play();

// Audio Narración (una vez, volumen alto)
const narrationAudio = new Audio(hotspot.audio_narration_url);
narrationAudio.volume = hotspot.audio_narration_volume || 0.7;
narrationAudio.play();
```

**Gestión de audios:**
- Detener al cambiar de vista
- Fade in/out suave
- Control de volumen global

---

### 2.3 Pop-up Multimedia
**Componente nuevo:** `components/MultimediaPopup.js`

**Características:**
- Título + descripción
- Galería de imágenes (carousel)
- Video player integrado
- Botón cerrar (X)
- Responsive
- Glassmorphism design

```javascript
<MultimediaPopup
  isOpen={showPopup}
  onClose={() => setShowPopup(false)}
  title="Ventanas acústicas"
  text="Vidrio doble panel..."
  images={['/img1.jpg', '/img2.jpg']}
  video="/video.mp4"
/>
```

---

## 📊 Fase 3: Optimización de Medios

### 3.1 Conversión Automática de Audios
**WAV → MP3 (reduce ~90% el tamaño)**

**Implementar:**
- Detección automática de WAV
- Sugerencia de conversión
- Integración con FFmpeg o servicio cloud

### 3.2 Compresión de Videos
**Recomendaciones:**
- Formato: MP4 (H.264)
- Resolución: 720p máximo
- Bitrate: 2-3 Mbps
- Tamaño: máx 20MB

**Herramientas sugeridas:**
- HandBrake (cliente)
- Cloudinary (cloud)
- FFmpeg (server)

### 3.3 Optimización de Imágenes
**WebP + Lazy Loading**
- Conversión automática a WebP
- Calidad: 80%
- Tamaño máx: 500KB
- Lazy loading en pop-ups

---

## 🎨 Fase 4: Mejoras de UX (Comparativa Kuula)

### 4.1 Fast Hotspot (Drag & Drop)
**Prioridad:** ALTA

**Implementar:**
- Thumbnails arrastrables
- Drop zone en visor
- Creación instantánea

### 4.2 Keyboard Shortcuts
**Atajos propuestos:**
- `H` - Nuevo hotspot
- `S` - Guardar
- `Delete` - Eliminar seleccionado
- `Ctrl+D` - Duplicar
- `Esc` - Cancelar
- `←` `→` - Navegar vistas

### 4.3 Multi-selección
- Shift+Click para seleccionar varios
- Editar propiedades en lote
- Eliminar múltiples a la vez

---

## 🔮 Fase 5: Features Avanzadas (Futuro)

### 5.1 Conversión Texto a Voz
**Para narraciones automáticas**

**Opciones:**
- Google Cloud Text-to-Speech
- Amazon Polly
- ElevenLabs (voces realistas)

**Uso:**
```javascript
const narration = await generateNarration({
  text: "Esta cocina cuenta con acabados de lujo...",
  voice: "es-MX-female",
  speed: 1.0,
});
```

### 5.2 Master Hotspots
**Hotspots que aparecen en TODAS las vistas**

Casos de uso:
- Botón "Volver al inicio"
- Info de contacto
- Logo de la inmobiliaria

### 5.3 Floor Plan / Minimapa
**Navegación visual con plano**

- SVG interactivo
- Indicador de posición actual
- Click para navegar

---

## 📝 Próximos Pasos Inmediatos

### ✅ Para Implementar AHORA:

1. **Ejecutar migración SQL** en Supabase
2. **Modificar panel del editor** para tipos de hotspot
3. **Agregar selector de audio** de la librería
4. **Implementar pop-up multimedia** en visor público
5. **Probar backlinks automáticos**

### 🔧 Código Necesario:

**1. Modificar `HotspotEditor.js`:**
- Agregar selector de tipo
- Formularios condicionales
- Integrar librería de audios

**2. Modificar `PhotoSphereViewer.js`:**
- Renderizar iconos según tipo
- Sistema de audio dual
- Pop-up multimedia

**3. Crear `MultimediaPopup.js`:**
- Componente reutilizable
- Galería + video + texto

---

## 🎯 Caso de Uso Completo: Casa con Jardín

**Vista 1: Sala**
- Hotspot navegación → Cocina (backlink automático)
- Hotspot info: "Piso de madera original 1920"
  - Foto: Close-up de piso
  - Video: Proceso de restauración
- Audio ambiente: Pájaros cantando (loop)
- Audio narración: "Esta sala de 45m² cuenta con..."

**Vista 2: Cocina**
- Hotspot navegación → ← Volver a Sala (creado automáticamente)
- Hotspot info: "Ventanas acústicas"
  - Texto: Especificaciones técnicas
  - Video: Demo de aislamiento
- Audio narración: "La cocina integral..."

**Vista 3: Jardín**
- Hotspot info: "Plantas nativas"
  - Galería: 5 fotos de plantas
- Audio ambiente: Ruiseñor + río (loop)

---

## 📞 Soporte Técnico

**Dudas o problemas:**
1. Revisar este documento
2. Consultar código comentado
3. Verificar migraciones SQL ejecutadas

**Archivos clave:**
- `sql_migrations/ADD_MULTIMEDIA_HOTSPOTS.sql`
- `lib/hotspotsService.js`
- `lib/audioLibrary.js`
- `components/HotspotIcon.js`

---

**Última actualización:** 2025-01-16
**Versión:** 1.0.0
**Estado:** Fundamentos completados, UI en desarrollo
