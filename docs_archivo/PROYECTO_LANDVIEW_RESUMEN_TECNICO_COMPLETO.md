# LANDVIEW APP - Resumen Técnico Completo para Implementación SEO y Mejoras

## 📋 INFORMACIÓN DEL PROYECTO

**Nombre**: LandView App (PotentiaMX CMS)
**Tipo**: Plataforma SaaS de Tours Virtuales 360° para Bienes Raíces
**Versión Actual**: 0.1.0
**Fecha de Documentación**: 18 de Noviembre de 2025
**Objetivo**: Competir con Kuula y 3DVista combinando lo mejor de ambas plataformas

---

## 🎯 VISIÓN DEL PROYECTO

### Inspiración: Mejores Características de la Competencia

#### ✅ **De KUULA queremos tomar:**

1. **Facilidad de Uso Extrema**
   - Interfaz drag & drop intuitiva
   - Onboarding rápido (crear tour en <5 minutos)
   - Branding personalizado (logos, colores, dominios propios)
   - Mobile-first design (73% del tráfico es móvil)

2. **Características de Marketing**
   - Integración directa con redes sociales (WhatsApp, Facebook, LinkedIn)
   - Lead generation integrado (formularios de contacto en el tour)
   - Analytics simples pero efectivos para clientes no técnicos
   - Compartir con un click (link copy, QR codes)

3. **Compatibilidad Universal**
   - WebXR (VR headsets: Oculus, Samsung Gear VR)
   - Soporte para múltiples cámaras 360° (Ricoh Theta, Insta360, etc.)
   - Sin plugins necesarios (funciona en cualquier navegador)
   - Responsive perfecto (mobile, tablet, desktop)

4. **Modelo de Precios**
   - Planes claros desde $20/mes
   - Tours ilimitados en planes PRO
   - API disponible para integraciones
   - Plan gratuito con limitaciones (para captar usuarios)

#### ✅ **De 3DVISTA queremos tomar:**

1. **Características Avanzadas de Interactividad**
   - Transiciones 3D entre panoramas
   - Animated Panoramas (efecto día/noche "Live Panorama")
   - Integración con modelos 3D completos (control de cámara, iluminación, texturas)
   - HDR adaptativo para mejor calidad visual

2. **Multimedia Rico**
   - Videos 360° con hotspots interactivos
   - Audio espacial y música de ambiente
   - Galerías de fotos incrustadas
   - Animaciones y efectos visuales

3. **Gamificación y Educación**
   - Hotspots tipo "treasure hunt" (descubrimiento de puntos)
   - Quizzes y preguntas interactivas
   - Sistema de scoring y reportes
   - Integración con LMS (Learning Management Systems)

4. **Análisis Profundo**
   - Real-time analytics de interacciones
   - Mapas de calor (heatmaps) de dónde miran los usuarios
   - Tasa de completación de tours
   - Tiempo en cada hotspot/habitación

5. **Modelo de Licencia**
   - Pago único, uso perpetuo (no suscripción)
   - Tours ilimitados sin costos recurrentes
   - Software instalable (no depende de la nube)

---

## 🏗️ ARQUITECTURA ACTUAL DE LANDVIEW

### Stack Tecnológico Completo

```
┌─────────────────────────────────────────────────────┐
│               FRONTEND (Next.js 15.5.4)             │
├─────────────────────────────────────────────────────┤
│ • React 19.1.0 (Client Components principalmente)  │
│ • TypeScript 5 (strict mode)                        │
│ • Tailwind CSS 4.1.14 (utility-first)               │
│ • Photo Sphere Viewer 5.14.0 (motor 360°)           │
│ • Leaflet 1.9.4 (mapas interactivos)                │
│ • Lucide React (iconografía moderna)                │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│               BACKEND (Supabase)                    │
├─────────────────────────────────────────────────────┤
│ • PostgreSQL (base de datos relacional)             │
│ • Supabase Auth (autenticación JWT)                 │
│ • Supabase Storage (imágenes 360°, multimedia)      │
│ • Row Level Security (RLS) para multitenancy        │
│ • Realtime subscriptions (cambios en vivo)          │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│          SERVICIOS ADICIONALES                      │
├─────────────────────────────────────────────────────┤
│ • Resend (emails transaccionales)                   │
│ • Browser Image Compression (optimización client)   │
│ • UUID v13 (IDs únicos)                             │
└─────────────────────────────────────────────────────┘
```

### Dependencias Principales (package.json)

```json
{
  "dependencies": {
    "@photo-sphere-viewer/core": "^5.14.0",
    "@photo-sphere-viewer/gallery-plugin": "^5.14.0",
    "@photo-sphere-viewer/markers-plugin": "^5.14.0",
    "@supabase/ssr": "^0.7.0",
    "@supabase/supabase-js": "^2.58.0",
    "next": "15.5.4",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "tailwindcss": "^4.1.14",
    "typescript": "^5",
    "leaflet": "^1.9.4",
    "react-leaflet": "^5.0.0",
    "browser-image-compression": "^2.0.2",
    "resend": "^6.2.0",
    "lucide-react": "^0.546.0"
  }
}
```

---

## 📊 ESTRUCTURA DE BASE DE DATOS

### Tabla Principal: `terrenos`

```sql
CREATE TABLE terrenos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Información Básica
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Tipo de Propiedad
  property_type VARCHAR(50) DEFAULT 'terreno', -- 'terreno', 'casa', 'departamento'
  land_category VARCHAR(50), -- 'residencia', 'desarrollo', 'proyecto' (solo para terrenos)
  available_for_contribution BOOLEAN DEFAULT false, -- Aportación de terrenos

  -- Ubicación
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(2) DEFAULT 'MX',

  -- Medidas y Precios
  total_square_meters DECIMAL(10, 2),
  front_measures VARCHAR(100),
  depth_measures VARCHAR(100),
  sale_price DECIMAL(15, 2),
  price_per_sqm DECIMAL(10, 2),

  -- Uso de Suelo
  land_use TEXT,
  zoning VARCHAR(100),

  -- Multimedia
  image_urls TEXT[], -- Array de URLs de panoramas 360°
  thumbnail_url TEXT, -- Primera imagen como thumbnail

  -- Audio por Vista
  view_ambient_audio TEXT[], -- Array de URLs de audio ambiente por vista
  view_ambient_volume DECIMAL[], -- Array de volúmenes (0.0-1.0)
  view_narration_audio TEXT[], -- Array de URLs de narración por vista
  view_narration_volume DECIMAL[], -- Array de volúmenes
  view_audio_autoplay BOOLEAN[], -- Array de flags de autoplay

  -- Estilo de Marcadores
  marker_style VARCHAR(20) DEFAULT 'apple', -- 'apple', 'android', 'classic'

  -- Información de Contacto
  contact_type VARCHAR(20) DEFAULT 'casual', -- 'casual', 'formal', 'both'
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),

  -- Metadatos
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Índices
  INDEX idx_user_terrenos (user_id),
  INDEX idx_property_type (property_type),
  INDEX idx_public (is_public),
  INDEX idx_location (latitude, longitude)
);
```

### Tabla de Hotspots Multimedia

```sql
CREATE TABLE hotspots (
  id SERIAL PRIMARY KEY,
  terreno_id UUID REFERENCES terrenos(id) ON DELETE CASCADE,

  -- Posición en el Panorama
  panorama_index INTEGER NOT NULL, -- Índice de la vista (0-N)
  position_yaw DECIMAL(10, 6) NOT NULL, -- Rotación horizontal (radianes)
  position_pitch DECIMAL(10, 6) NOT NULL, -- Rotación vertical (radianes)

  -- Información Básica
  title VARCHAR(255) NOT NULL,

  -- Tipo de Hotspot (CLAVE DIFERENCIADORA vs Kuula/3DVista)
  hotspot_type VARCHAR(20) DEFAULT 'navigation',
  -- Tipos: 'navigation', 'info', 'image', 'video', 'audio'

  -- Navegación (solo para type='navigation')
  target_panorama_index INTEGER, -- Vista destino
  image_url TEXT, -- Icono personalizado (legacy)

  -- Contenido Multimedia
  content_text TEXT, -- Descripción/información (type='info')
  content_images TEXT[], -- Galería de imágenes (type='image')
  content_video_url TEXT, -- URL de video (type='video')
  content_video_thumbnail TEXT, -- Thumbnail del video

  -- Audio Dual (type='audio' o cualquier tipo)
  audio_ambient_url TEXT, -- Audio de ambiente (loop)
  audio_ambient_volume DECIMAL(3, 2) DEFAULT 0.3, -- 0.0-1.0
  audio_ambient_loop BOOLEAN DEFAULT true,
  audio_narration_url TEXT, -- Narración (una vez)
  audio_narration_volume DECIMAL(3, 2) DEFAULT 0.7,
  audio_autoplay BOOLEAN DEFAULT false,

  -- Backlink Automático (innovación propia)
  create_backlink BOOLEAN DEFAULT true, -- Crear hotspot de regreso
  backlink_id INTEGER REFERENCES hotspots(id) ON DELETE SET NULL,

  -- Personalización Visual
  custom_icon_url TEXT, -- URL de icono personalizado
  icon_size INTEGER DEFAULT 40, -- Tamaño en píxeles

  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Índices
  INDEX idx_terreno_hotspots (terreno_id),
  INDEX idx_panorama (terreno_id, panorama_index),
  INDEX idx_type (hotspot_type)
);
```

### Row Level Security (RLS)

```sql
-- Políticas de seguridad multitenancy

-- Terrenos: Usuarios solo ven sus propios terrenos
CREATE POLICY "Users can view own terrenos"
  ON terrenos FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own terrenos"
  ON terrenos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own terrenos"
  ON terrenos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own terrenos"
  ON terrenos FOR DELETE
  USING (auth.uid() = user_id);

-- Hotspots: Heredan permisos del terreno
CREATE POLICY "Users can view hotspots of own terrenos"
  ON hotspots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM terrenos
      WHERE terrenos.id = hotspots.terreno_id
      AND (terrenos.user_id = auth.uid() OR terrenos.is_public = true)
    )
  );

-- Admins pueden ver todo
CREATE POLICY "Admins can view all"
  ON terrenos FOR ALL
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@potentiamx.com',
      'victor.admin@potentiamx.com'
    )
  );
```

---

## 🎨 COMPONENTES PRINCIPALES

### 1. PhotoSphereViewer.js (Motor 360°)

**Ubicación**: `app/terreno/[id]/PhotoSphereViewer.js`
**Líneas de Código**: ~1,700
**Responsabilidad**: Renderizar panoramas 360° interactivos

#### Características Implementadas:

1. **Viewer 360° con Photo Sphere Viewer**
   - Inicialización del viewer con configuración optimizada
   - Soporte para zoom con rueda del mouse (`mousewheel: true`)
   - Movimiento táctil optimizado para móvil (`moveSpeed: 2.0`)
   - ❌ **NO usa** `touchmoveTwoFingers` (permite navegación con 1 dedo)

2. **Sistema de Marcadores Dinámicos**
   - 3 estilos visuales: `apple`, `android`, `classic`
   - CSS generado dinámicamente según configuración del terreno
   - Animaciones suaves (fade-in, pulse, hover effects)
   - Diferenciación visual entre navegación y multimedia

3. **Navegación Entre Vistas**
   - Transición fluida entre panoramas (400ms)
   - Pre-carga inteligente de vistas adyacentes (solo ±1 imagen)
   - Estado de carga con spinner y loaders sutiles
   - Navegación por dots (1-6 vistas) o thumbnails (7+ vistas)

4. **Audio Automático por Vista** ⭐ INNOVACIÓN ÚNICA
   - **Dual Audio System**: Ambiente (loop) + Narración (one-shot)
   - Fade-in gradual de 1 segundo después de 2s de delay
   - Soporte para diferentes volúmenes por vista
   - Fallback móvil: reproducción tras primer toque del usuario
   - Auto-limpieza al cambiar de vista (evita solapamiento)

5. **Hotspots Multimedia**
   - **Navegación** (🧭): Cambiar entre vistas
   - **Info** (ℹ️): Mostrar texto descriptivo en modal
   - **Galería** (🖼️): Grid de imágenes con zoom
   - **Video** (🎥): YouTube/Vimeo embeds + videos directos
   - **Audio** (🔊): Reproductor dual (ambiente + narración)

6. **Modales Multimedia**
   - Diseño responsive y accesible
   - Backdrop blur con animaciones suaves
   - Soporte para YouTube y Vimeo (conversión automática a embed)
   - Cierre por click fuera o botón X

7. **Contacto Contextual**
   - **Casual**: Botón flotante de WhatsApp
   - **Formal**: Formulario de email (integración Resend)
   - **Both**: Ambas opciones disponibles
   - Mensaje pre-llenado con título de propiedad

8. **Controles Auto-Hide (estilo YouTube)**
   - Se ocultan tras 2 segundos de inactividad
   - Reaparecen al mover mouse o tocar pantalla
   - Transiciones suaves de opacidad

9. **Modo Embed**
   - Oculta logo, botones de volver, info y compartir
   - Limpio para integración en iframes
   - Mantiene funcionalidad de tour completa

#### Código Clave:

```javascript
// Inicialización del Viewer con configuración optimizada
const viewer = new Viewer({
  container: containerRef.current,
  panorama: imageUrl,
  plugins: [[MarkersPlugin, {}]],
  navbar: false,
  defaultZoomLvl: 50,
  mousewheel: true,
  mousemove: true,
  mousewheelSpeed: 2.0,
  moveSpeed: 2.0, // 2x velocidad para mejor UX móvil
});

// Sistema de Audio Dual con Fade-In
const AUDIO_DELAY = 2000; // 2 segundos
const FADE_DURATION = 1000; // 1 segundo de fade-in

// Ambiente (loop)
const ambientAudio = new Audio(ambientUrl);
ambientAudio.loop = true;
ambientAudio.volume = 0;

setTimeout(() => {
  ambientAudio.play().then(() => {
    // Fade-in gradual en 20 pasos
    const fadeSteps = 20;
    const fadeInterval = FADE_DURATION / fadeSteps;
    const volumeStep = targetVolume / fadeSteps;

    const fadeInInterval = setInterval(() => {
      currentStep++;
      ambientAudio.volume = Math.min(volumeStep * currentStep, targetVolume);
      if (currentStep >= fadeSteps) clearInterval(fadeInInterval);
    }, fadeInterval);
  });
}, AUDIO_DELAY);
```

---

### 2. HotspotEditor.js (Editor Administrativo)

**Ubicación**: `app/terreno/[id]/editor/HotspotEditor.js`
**Responsabilidad**: CRUD completo de hotspots multimedia

#### Características:

1. **Click-to-Add Hotspots**
   - Click en panorama para agregar hotspot
   - Captura automática de coordenadas yaw/pitch
   - Vista previa en tiempo real

2. **Formulario Multimedia Completo**
   - Selector de tipo (navegación, info, imagen, video, audio)
   - Campos dinámicos según tipo seleccionado
   - Subida de archivos a Supabase Storage
   - Validación de URLs y formatos

3. **Backlink Automático** ⭐ INNOVACIÓN
   - Checkbox para crear hotspot de regreso
   - Posición opuesta automática (yaw + π)
   - Nombre auto-generado "← Volver a [vista]"
   - Evita loops infinitos

4. **Gestión de Audio**
   - Dual audio: Ambiente + Narración
   - Sliders de volumen independientes
   - Toggle de autoplay y loop
   - Biblioteca de audios predefinidos

5. **Estilos de Marcadores**
   - Preview en vivo de 3 estilos
   - Selector visual con tarjetas
   - Aplicado a todo el terreno (consistencia)

---

### 3. Dashboard (app/dashboard/page.js)

#### Características:

1. **Vista de Tarjetas**
   - Grid responsive de propiedades
   - Thumbnail de primera vista
   - Indicadores visuales (público/privado, destacado)
   - Contador de vistas

2. **Filtros y Búsqueda**
   - Por tipo de propiedad (terreno, casa, departamento)
   - Por categoría (residencia, desarrollo, proyecto)
   - Búsqueda por título
   - Orden por fecha/vistas

3. **Acciones Rápidas**
   - Ver tour
   - Editar
   - Editar hotspots
   - Eliminar (con confirmación)
   - Duplicar

4. **Sistema de Permisos**
   - Usuarios solo ven sus propiedades
   - Admins ven todas (email whitelist)
   - Modo impersonación para soporte

---

## 🔐 AUTENTICACIÓN Y SEGURIDAD

### Middleware (middleware.ts)

```typescript
// Patrón de exclusión optimizado
export const config = {
  matcher: [
    // Excluir archivos estáticos, API, y vistas públicas
    '/((?!_next/static|_next/image|favicon.ico|terreno|api|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$|supabase).*)',
    '/dashboard/:path*', // Requiere auth
    '/login',
    '/signup',
  ],
};
```

### Supabase SSR Pattern

```javascript
// Cliente (lib/supabaseClient.js)
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

// Uso en componentes
const supabase = useMemo(() => createClient(), []);
```

---

## 🎨 DISEÑO Y UX

### Sistema de Estilos de Marcadores

#### 1. **Estilo Apple** (default)
- Fondo blanco translúcido con backdrop-filter blur
- Punto azul (#007aff) en el icono
- Border sutil
- Hover: Scale 1.08 + elevación + glow azul
- Animación: Bounce suave con cubic-bezier

#### 2. **Estilo Android (Material Design)**
- Fondo azul sólido (#1976d2)
- Punto blanco en icono
- Elevación con sombras Material
- Hover: Elevación mayor + color más oscuro
- Animación: Elevation transition

#### 3. **Estilo Classic (Kuula-like)**
- Gradient verde (#10b981 → #059669)
- Border blanco grueso
- Glow effect con box-shadow
- Hover: Scale 1.15 + glow intenso
- Animación: Bounce dramático

### Responsive Design

```css
/* Mobile First */
@media (max-width: 768px) {
  .thumbnail-navigator {
    max-height: 100px;
    font-size: 10px;
  }

  .info-panel {
    width: 90vw;
    max-height: 80vh;
  }
}
```

---

## 📈 CARACTERÍSTICAS ÚNICAS vs COMPETENCIA

### ✅ Lo que YA tenemos que Kuula/3DVista NO tienen (o cobran extra):

1. **Audio Dual Automático por Vista** ⭐⭐⭐
   - Sistema único de ambiente + narración
   - Fade-in suave post-carga
   - Volúmenes independientes
   - Autoplay configurable

2. **Backlink Automático de Hotspots** ⭐⭐
   - Creación bidireccional automática
   - Evita trabajo manual
   - Posicionamiento inteligente (dirección opuesta)

3. **Hotspots Multimedia Completos** ⭐⭐⭐
   - 5 tipos de hotspots en un solo sistema
   - Modales interactivos profesionales
   - Soporte para YouTube/Vimeo embed

4. **Sistema de Contacto Contextual** ⭐
   - WhatsApp con mensaje pre-llenado
   - Formulario formal con Resend
   - Modo mixto (ambos)

5. **Estilos de Marcadores Personalizables** ⭐
   - 3 estilos predefinidos profesionales
   - Cambio instantáneo sin recargar
   - CSS generado dinámicamente

6. **Navegación Optimizada**
   - Dots para pocas vistas (1-6)
   - Thumbnails para muchas vistas (7+)
   - Transiciones suaves

7. **Modo Embed Limpio**
   - Sin branding
   - Funcionalidad completa
   - Fácil integración en sitios externos

---

## 🚀 ROADMAP DE MEJORAS (Basado en Kuula + 3DVista)

### FASE 1: Mejoras SEO y Performance (PRIORIDAD ALTA)

#### 1.1 SEO On-Page
- [ ] Implementar metadata dinámica optimizada
- [ ] Schema.org markup (RealEstateProperty)
- [ ] Open Graph y Twitter Cards
- [ ] Sitemap dinámico actualizado
- [ ] Canonical URLs
- [ ] Alt text automático en panoramas

#### 1.2 Performance
- [ ] Conversión automática a WebP
- [ ] Lazy loading de panoramas
- [ ] Code splitting por ruta
- [ ] CDN para assets estáticos (Cloudflare/Vercel)
- [ ] Compresión Brotli
- [ ] Image optimization con Next.js Image

#### 1.3 Analytics (ver ANALYTICS_TRAFICO_WEB_2025.md)
- [ ] Google Analytics 4 + GTM
- [ ] Tracking de eventos (panorama_change, hotspot_click, etc.)
- [ ] Dashboard para clientes Plan Pro
- [ ] Heatmaps de interacciones

---

### FASE 2: Características de Kuula (PRIORIDAD MEDIA)

#### 2.1 Social Sharing
- [ ] Botones de compartir en redes (FB, Twitter, LinkedIn)
- [ ] WhatsApp share con preview image
- [ ] QR code generator automático
- [ ] Embed code generator con preview

#### 2.2 Branding
- [ ] Logo personalizable por usuario
- [ ] Colores de marca personalizados
- [ ] Custom domain (subdominios *.landview.app)
- [ ] Watermark opcional

#### 2.3 Lead Generation
- [ ] Formularios integrados en hotspots
- [ ] Captura de emails con incentivos
- [ ] Integración con CRM (Zapier/Make)
- [ ] Reportes de leads por propiedad

---

### FASE 3: Características de 3DVista (PRIORIDAD MEDIA-BAJA)

#### 3.1 Efectos Visuales
- [ ] Transiciones 3D entre panoramas
- [ ] Live Panorama (día/noche con slider)
- [ ] HDR adaptativo
- [ ] Filtros de color (sepia, B&N, vintage)

#### 3.2 Gamificación
- [ ] Hotspots tipo "treasure hunt"
- [ ] Sistema de puntos
- [ ] Quizzes interactivos
- [ ] Certificados de completación

#### 3.3 Analytics Avanzado
- [ ] Heatmaps de mirada (eye tracking simulado)
- [ ] Tasa de completación por habitación
- [ ] Tiempo promedio en cada hotspot
- [ ] A/B testing de tours

---

### FASE 4: Innovaciones Propias (PRIORIDAD BAJA)

#### 4.1 IA Generativa
- [ ] Descripciones automáticas con GPT-4
- [ ] Generación de narración por voz (TTS)
- [ ] Traducción automática a múltiples idiomas
- [ ] Sugerencias de hotspots por IA

#### 4.2 Realidad Aumentada
- [ ] AR markers para tours híbridos
- [ ] Overlay de información con cámara
- [ ] Medición de espacios con AR

#### 4.3 Colaboración
- [ ] Tours en vivo guiados (video call integrado)
- [ ] Comentarios y anotaciones compartidas
- [ ] Modo multi-usuario en tiempo real

---

## 🛠️ GUÍA DE IMPLEMENTACIÓN SEO (DETALLADA)

### 1. Metadata Dinámica (app/terreno/[id]/page.tsx)

```typescript
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  // Fetch terreno data
  const terreno = await fetchTerrenoById(params.id);

  const title = `${terreno.title} - Tour Virtual 360°`;
  const description = terreno.description
    ? terreno.description.slice(0, 160)
    : `Explora ${terreno.title} con nuestro tour virtual interactivo en 360°. ${terreno.total_square_meters ? `${terreno.total_square_meters} m²` : ''} ${terreno.city ? `en ${terreno.city}` : ''}`;

  const imageUrl = terreno.image_urls?.[0] || '/og-default.jpg';

  return {
    title,
    description,

    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: terreno.title,
        }
      ],
      type: 'website',
      locale: 'es_MX',
      siteName: 'LandView - Tours Virtuales 360°',
    },

    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@PotentiaMX',
    },

    // Robots
    robots: {
      index: terreno.is_public,
      follow: terreno.is_public,
      googleBot: {
        index: terreno.is_public,
        follow: terreno.is_public,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical
    alternates: {
      canonical: `https://landview.app/terreno/${params.id}`,
    },
  };
}
```

### 2. Schema.org JSON-LD

```typescript
export default function TerrenoPage({ terreno }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateProperty',
    name: terreno.title,
    description: terreno.description,
    url: `https://landview.app/terreno/${terreno.id}`,
    image: terreno.image_urls,

    // Dirección
    address: {
      '@type': 'PostalAddress',
      streetAddress: terreno.address,
      addressLocality: terreno.city,
      addressRegion: terreno.state,
      addressCountry: terreno.country,
    },

    // Geolocalización
    geo: {
      '@type': 'GeoCoordinates',
      latitude: terreno.latitude,
      longitude: terreno.longitude,
    },

    // Oferta
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: terreno.sale_price,
      priceCurrency: 'MXN',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: terreno.sale_price,
        priceCurrency: 'MXN',
      },
    },

    // Características
    floorSize: {
      '@type': 'QuantitativeValue',
      value: terreno.total_square_meters,
      unitCode: 'MTK', // Metro cuadrado
    },

    // Tour Virtual
    tourBookingPage: `https://landview.app/terreno/${terreno.id}`,

    // Metadata
    datePublished: terreno.created_at,
    dateModified: terreno.updated_at,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Componente del viewer */}
    </>
  );
}
```

### 3. Sitemap Dinámico (app/sitemap.ts)

```typescript
import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabaseClient';

export default async function sitemap(): MetadataRoute.Sitemap {
  const supabase = createClient();

  // Fetch todas las propiedades públicas
  const { data: terrenos } = await supabase
    .from('terrenos')
    .select('id, updated_at, is_featured')
    .eq('is_public', true);

  const baseUrl = 'https://landview.app';

  // Rutas estáticas
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/propiedades/terrenos`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/propiedades/casas`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/propiedades/departamentos`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // Rutas dinámicas de terrenos
  const terrenoRoutes = terrenos?.map((terreno) => ({
    url: `${baseUrl}/terreno/${terreno.id}`,
    lastModified: new Date(terreno.updated_at),
    changeFrequency: 'weekly' as const,
    priority: terreno.is_featured ? 0.9 : 0.7,
  })) || [];

  return [...staticRoutes, ...terrenoRoutes];
}
```

### 4. Robots.txt (app/robots.ts)

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/admin',
          '/api',
          '/_next',
          '/login',
          '/signup',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard', '/admin'],
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://landview.app/sitemap.xml',
  };
}
```

### 5. Performance Optimizations (next.config.ts)

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Compresión
  compress: true,

  // Imágenes
  images: {
    formats: ['image/avif', 'image/webp'], // Formatos modernos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tuhojmupstisctgaepsc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Experimental features
  experimental: {
    optimizeCss: true, // Optimizar CSS
    scrollRestoration: true,
  },

  // Headers de seguridad y performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/terreno/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 6. Preload Critical Resources (app/layout.tsx)

```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect a dominios externos */}
        <link rel="preconnect" href="https://tuhojmupstisctgaepsc.supabase.co" />
        <link rel="dns-prefetch" href="https://tuhojmupstisctgaepsc.supabase.co" />

        {/* Preload fonts */}
        <link
          rel="preload"
          href="/fonts/GeistVF.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Favicon moderno */}
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 📊 ANALYTICS IMPLEMENTATION (GTM + GA4)

### 1. Instalar GTM en layout.tsx

```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
```

### 2. Tracking Events en PhotoSphereViewer

```javascript
// Agregar al useEffect de inicialización
useEffect(() => {
  // Vista de propiedad
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'property_view',
      property_id: terreno.id,
      property_title: terreno.title,
      property_type: terreno.property_type,
      price: terreno.sale_price,
      city: terreno.city,
    });
  }
}, [terreno]);

// Agregar al useEffect de cambio de panorama
useEffect(() => {
  if (isViewerReady && currentIndex > 0) {
    const timeSpent = Math.floor((Date.now() - panoramaStartTime.current) / 1000);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'panorama_change',
        property_id: terreno.id,
        from_panorama: currentIndex - 1,
        to_panorama: currentIndex,
        time_spent: timeSpent,
      });
    }
  }
}, [currentIndex]);

// Agregar al event listener de hotspots
markersPluginRef.current.addEventListener('select-marker', (e) => {
  const hotspot = hotspots.find(h => String(h.id) === String(e.marker.id));

  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'hotspot_click',
      property_id: terreno.id,
      hotspot_id: hotspot.id,
      hotspot_type: hotspot.type,
      hotspot_title: hotspot.title,
      current_panorama: currentIndex,
    });
  }

  // ... resto de la lógica
});
```

---

## 🔧 VARIABLES DE ENTORNO NECESARIAS

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tuhojmupstisctgaepsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Server-side only

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Analytics 4
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# App Config
NEXT_PUBLIC_APP_URL=https://landview.app
NEXT_PUBLIC_APP_NAME=LandView
```

---

## 🎯 CHECKLIST PARA EL PROGRAMADOR EXPERTO EN GOOGLE

### SEO Técnico
- [ ] Implementar metadata dinámica en todas las páginas
- [ ] Agregar Schema.org JSON-LD (RealEstateProperty)
- [ ] Configurar sitemap dinámico
- [ ] Optimizar robots.txt
- [ ] Implementar canonical URLs
- [ ] Agregar Open Graph tags
- [ ] Configurar Twitter Cards
- [ ] Implementar breadcrumbs con Schema

### Performance
- [ ] Conversión automática de imágenes a WebP/AVIF
- [ ] Lazy loading de panoramas no visibles
- [ ] Code splitting por ruta
- [ ] Preload de recursos críticos
- [ ] Minificación de CSS/JS
- [ ] Tree shaking de librerías no usadas
- [ ] Optimizar bundle size (analizar con webpack-bundle-analyzer)

### Analytics
- [ ] Instalar Google Tag Manager
- [ ] Configurar Google Analytics 4
- [ ] Implementar eventos personalizados (ver ANALYTICS_TRAFICO_WEB_2025.md)
- [ ] Crear dashboard de métricas para usuarios Plan Pro
- [ ] Integrar heatmaps (opcional: Hotjar/Microsoft Clarity)

### Seguridad
- [ ] Validar todas las entradas de usuario
- [ ] Sanitizar contenido HTML en hotspots
- [ ] Implementar rate limiting en APIs
- [ ] Configurar CSP headers
- [ ] Auditar dependencias (npm audit)
- [ ] Implementar HTTPS estricto

### Accesibilidad
- [ ] Agregar alt text a todas las imágenes
- [ ] Soporte para navegación por teclado
- [ ] ARIA labels en componentes interactivos
- [ ] Contraste de colores WCAG AA
- [ ] Focus management en modales

---

## 📚 RECURSOS Y DOCUMENTACIÓN

### Documentación Oficial
- **Next.js 15**: https://nextjs.org/docs
- **Photo Sphere Viewer**: https://photo-sphere-viewer.js.org/
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Herramientas de Análisis
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **Lighthouse**: Chrome DevTools
- **Schema.org Validator**: https://validator.schema.org/
- **Google Rich Results Test**: https://search.google.com/test/rich-results

### Competidores (para benchmarking)
- **Kuula**: https://kuula.co
- **3DVista**: https://www.3dvista.com
- **Matterport**: https://matterport.com
- **Roundme**: https://roundme.com

---

## 🚨 NOTAS IMPORTANTES PARA NO ROMPER NADA

### ⚠️ NO CAMBIAR SIN CONSULTAR:

1. **Supabase Client Pattern**
   - Siempre usar `createClient()` de `lib/supabaseClient.js`
   - Envolver en `useMemo()` en componentes
   - NUNCA usar `createServerClient` en cliente

2. **PhotoSphereViewer Initialization**
   - No cambiar `useEffect` dependencies sin revisar
   - Mantener check de `viewerRef.current` antes de inicializar
   - NO remover `loadedPanoramaIndex` (previene re-renders infinitos)

3. **Audio System**
   - Mantener refs (`ambientAudioRef`, `narrationAudioRef`)
   - NO cambiar timing de fade-in sin pruebas en móvil
   - Cleanup es CRÍTICO en el return del useEffect

4. **Hotspots Service**
   - Backlink automático depende de `create_backlink` flag
   - NO eliminar transformación de campos (app ↔ DB)
   - Validar siempre antes de insert/update

5. **Middleware**
   - Pattern de exclusión es CRÍTICO para performance
   - NO agregar `/terreno` al matcher (vista pública)
   - Mantener cookies pattern de Supabase SSR

---

## 📞 CONTACTO Y SOPORTE

**Desarrollador Principal**: Roberto
**Email**: admin@potentiamx.com
**Repositorio**: GitHub (privado)
**Servidor de Producción**: Vercel/Netlify
**Base de Datos**: Supabase (PostgreSQL)

---

## 🎉 CONCLUSIÓN

LandView App es una plataforma **robusta, escalable y con características únicas** que ya superan a Kuula en algunos aspectos (audio dual, backlinks automáticos, hotspots multimedia).

La **arquitectura está bien diseñada** con:
- Next.js 15 + React 19 (stack moderno)
- Supabase (backend completo sin servidor)
- Photo Sphere Viewer (motor 360° profesional)
- TypeScript + Tailwind (desarrollo productivo)

El **código está limpio y bien estructurado**, con patrones claros y comentarios útiles.

### Próximos Pasos Recomendados:

1. **Inmediato** (esta semana):
   - Implementar SEO básico (metadata, schema, sitemap)
   - Instalar GTM + GA4
   - Optimizar imágenes (conversión a WebP)

2. **Corto Plazo** (2-4 semanas):
   - Dashboard de analytics para usuarios
   - Social sharing mejorado
   - Performance optimizations

3. **Mediano Plazo** (1-3 meses):
   - Custom domains
   - Planes de pago
   - API pública
   - Efectos visuales avanzados

**¡El proyecto tiene un futuro brillante!** 🚀

---

**Última Actualización**: 18 de Noviembre de 2025
**Versión del Documento**: 1.0
**Autor**: Claude Code (Anthropic)
