# 🚀 Estrategia SEO para PotentiaMX

## 📊 Análisis de Estado Actual

### ✅ Lo que SÍ tienes configurado:
1. **Metadata global** en `app/layout.tsx`:
   - Title: "PotentiaMX - Tours Virtuales 360° | México"
   - Description genérica
   - Keywords básicas
   - Open Graph básico

### ❌ Lo que NO tienes (y es CRÍTICO):
1. **NO hay metadata por propiedad** (cada terreno usa el mismo título)
2. **NO hay sitemap.xml** (Google no sabe qué páginas indexar)
3. **NO hay robots.txt** (no controlas qué indexar)
4. **NO hay Open Graph por propiedad** (no se ve bien al compartir en redes)
5. **NO hay schema.org markup** (Google no entiende que son propiedades)
6. **URLs no son SEO-friendly** (terreno/123abc en lugar de terreno-vista-hermosa-puerto-vallarta)

---

## 🎯 Estrategia: Cada Propiedad = 1 Página Optimizada

### Ejemplo de lo que queremos lograr:

**URL Actual:**
```
https://potentiamx.com/terreno/062e89fd-6629-40a4-8eaa-9f51cbe9ecdf
```

**URL Optimizada:**
```
https://potentiamx.com/terreno/terreno-desarrollo-puerto-vallarta-666m2
```

**Metadata Actual:**
- Title: "PotentiaMX - Tours Virtuales 360° | México" (todas iguales)
- Description: Genérica para todo el sitio

**Metadata Optimizada:**
```html
<title>Terreno para Desarrollo 666 m² en Puerto Vallarta | $665,640 MXN</title>
<meta name="description" content="Terreno para desarrollo de 666 m² en Puerto Vallarta, México. Tour virtual 360°, ubicación privilegiada, uso residencial. Precio: $665,640 MXN ($1,000/m²)">
<meta name="keywords" content="terreno puerto vallarta, terreno desarrollo, 666 m², bahía banderas, tour virtual 360, bienes raíces vallarta">
```

---

## 🛠️ Implementación Paso a Paso

### FASE 1: Metadata Dinámica por Propiedad (CRÍTICO) ⚡

#### 1.1 Convertir terreno/[id]/page.js a TypeScript

**Crear:** `app/terreno/[id]/page.tsx` (reemplazar el .js actual)

```typescript
import { Metadata } from 'next';
import { createClient } from '@/lib/supabaseClient';
import TerrenoClientPage from './TerrenoClientPage';

// ✅ Esta función genera metadata ÚNICA para cada propiedad
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient();

  const { data: terreno } = await supabase
    .from('terrenos')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!terreno) {
    return {
      title: 'Propiedad no encontrada | PotentiaMX',
    };
  }

  // 🎯 KEYWORDS DINÁMICAS basadas en la propiedad
  const keywords = [
    terreno.property_type || 'terreno', // "terreno", "casa", "departamento"
    terreno.land_use || 'residencial', // "residencial", "comercial", "mixto"
    terreno.land_category, // "desarrollo", "residencia", "proyecto"
    'puerto vallarta',
    'bahía banderas',
    'tour virtual 360',
    'bienes raíces',
    terreno.total_square_meters ? `${terreno.total_square_meters} m²` : '',
    terreno.sale_price ? `$${terreno.sale_price} MXN` : '',
  ].filter(Boolean).join(', ');

  // 🎯 TITLE optimizado para SEO
  const title = `${terreno.title || 'Propiedad'} | ${terreno.total_square_meters ? `${terreno.total_square_meters} m²` : ''} Puerto Vallarta | $${terreno.sale_price?.toLocaleString('es-MX') || 'Consultar'} MXN`;

  // 🎯 DESCRIPTION optimizada
  const description = terreno.description
    ? terreno.description.substring(0, 155) + '...'
    : `${terreno.property_type === 'terreno' ? 'Terreno' : terreno.property_type === 'casa' ? 'Casa' : 'Departamento'} ${terreno.land_category || ''} de ${terreno.total_square_meters || ''} m² en Puerto Vallarta. Tour virtual 360° interactivo. ${terreno.land_use ? `Uso: ${terreno.land_use}.` : ''} Precio: $${terreno.sale_price?.toLocaleString('es-MX') || 'Consultar'} MXN`;

  return {
    title,
    description,
    keywords,

    // 🌐 Open Graph para redes sociales
    openGraph: {
      title,
      description,
      url: `https://potentiamx.com/terreno/${params.id}`,
      siteName: 'PotentiaMX',
      images: terreno.cover_image_url ? [
        {
          url: terreno.cover_image_url,
          width: 1200,
          height: 630,
          alt: terreno.title,
        }
      ] : [],
      locale: 'es_MX',
      type: 'website',
    },

    // 🐦 Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: terreno.cover_image_url ? [terreno.cover_image_url] : [],
    },

    // 🤖 Robots
    robots: {
      index: terreno.is_marketplace_listing && terreno.status === 'active',
      follow: true,
      googleBot: {
        index: terreno.is_marketplace_listing && terreno.status === 'active',
        follow: true,
      },
    },
  };
}

// El componente client que ya tienes
export default function TerrenoPage({ params }: { params: { id: string } }) {
  return <TerrenoClientPage id={params.id} />;
}
```

#### 1.2 Crear componente cliente

**Crear:** `app/terreno/[id]/TerrenoClientPage.tsx`

(Mover todo el código actual de page.js aquí)

---

### FASE 2: Schema.org Markup (Google entiende que es propiedad) 🏠

Agregar en `TerrenoClientPage.tsx`:

```typescript
// Agregar JSON-LD Schema.org
useEffect(() => {
  if (terrain) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: terrain.title,
      description: terrain.description,
      url: `https://potentiamx.com/terreno/${params.id}`,
      image: terrain.cover_image_url || terrain.image_urls?.[0],
      offers: {
        '@type': 'Offer',
        price: terrain.sale_price,
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Puerto Vallarta',
        addressRegion: 'Jalisco',
        addressCountry: 'MX',
      },
      geo: terrain.latitude && terrain.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: terrain.latitude,
        longitude: terrain.longitude,
      } : undefined,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: terrain.total_square_meters,
        unitCode: 'MTK',
      },
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }
}, [terrain]);
```

---

### FASE 3: Sitemap Dinámico 🗺️

**Crear:** `app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabaseClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Obtener todas las propiedades públicas
  const { data: terrenos } = await supabase
    .from('terrenos')
    .select('id, updated_at')
    .eq('is_marketplace_listing', true)
    .eq('status', 'active');

  // URLs estáticas
  const staticUrls = [
    {
      url: 'https://potentiamx.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://potentiamx.com/propiedades',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // URLs dinámicas (cada propiedad)
  const propertyUrls = (terrenos || []).map((terreno) => ({
    url: `https://potentiamx.com/terreno/${terreno.id}`,
    lastModified: new Date(terreno.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...propertyUrls];
}
```

---

### FASE 4: Robots.txt 🤖

**Crear:** `app/robots.ts`

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/login',
          '/signup',
        ],
      },
    ],
    sitemap: 'https://potentiamx.com/sitemap.xml',
  };
}
```

---

### FASE 5: URLs SEO-Friendly (Opcional pero recomendado) 🔗

Cambiar de:
```
/terreno/062e89fd-6629-40a4-8eaa-9f51cbe9ecdf
```

A:
```
/terreno/terreno-desarrollo-puerto-vallarta-666m2
```

**Implementación:**

1. Agregar campo `slug` en tabla `terrenos`
2. Generar slug automáticamente al crear/editar
3. Actualizar rutas para usar slug en lugar de ID

```sql
-- Migración
ALTER TABLE terrenos ADD COLUMN slug TEXT UNIQUE;

-- Generar slugs para existentes
UPDATE terrenos
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
) || '-' || SUBSTRING(id::TEXT, 1, 8);
```

---

## 📈 Integración con n8n (Automatización SEO)

### Webhook cuando se publica propiedad:

```javascript
// Trigger n8n cuando is_marketplace_listing cambia a true
// n8n recibe:
{
  "property_id": "xxx",
  "title": "Terreno para desarrollo...",
  "keywords": ["terreno", "puerto vallarta", ...],
  "url": "https://potentiamx.com/terreno/xxx",
  "price": 665640,
  "location": "Puerto Vallarta"
}

// n8n puede:
1. Generar keywords adicionales con AI
2. Sugerir mejoras al título/descripción
3. Indexar en Google Search Console
4. Compartir en redes sociales
5. Notificar si competencia rankea mejor
```

---

## 🎯 Palabras Clave Estratégicas por Tipo

### Terrenos:
- "terreno [ubicación] [m²]"
- "terreno desarrollo puerto vallarta"
- "terreno residencial bahía banderas"
- "terreno vista mar puerto vallarta"
- "terreno inversión jalisco"

### Casas:
- "casa venta puerto vallarta [m²]"
- "casa amueblada puerto vallarta"
- "casa playa puerto vallarta"
- "casa tour virtual 360"

### Departamentos:
- "departamento venta puerto vallarta"
- "departamento amueblado zona hotelera"
- "departamento vista mar puerto vallarta"

---

## 📊 Métricas de Éxito

### Después de implementar, medir:

1. **Google Search Console:**
   - Impresiones (cuántos ven tu resultado)
   - Clicks (cuántos hacen click)
   - CTR (% que hace click)
   - Posición promedio

2. **Google Analytics:**
   - Tráfico orgánico
   - Páginas más visitadas
   - Tiempo en página
   - Conversiones (leads)

3. **Por propiedad:**
   - Vistas del tour 360°
   - Clicks en contacto
   - Compartidas en redes

---

## ⏱️ Tiempo de Implementación

| Fase | Tiempo | Prioridad |
|------|--------|-----------|
| Metadata dinámica | 2-3 horas | 🔴 CRÍTICO |
| Schema.org | 1 hora | 🟠 Alta |
| Sitemap | 1 hora | 🟠 Alta |
| Robots.txt | 15 min | 🟡 Media |
| URLs amigables | 3-4 horas | 🟢 Baja |

**Total MVP SEO:** 4-5 horas

---

## 🚀 Próximos Pasos

1. ✅ **HOY:** Implementar metadata dinámica (2-3 horas)
2. ✅ **HOY:** Sitemap y robots.txt (1 hora)
3. ✅ **Esta semana:** Schema.org (1 hora)
4. ⏳ **Opcional:** URLs amigables (3-4 horas)
5. ⏳ **Después:** Integración n8n

---

**¿Empezamos con la metadata dinámica?** Es lo más importante y lo que más impacto tendrá.
