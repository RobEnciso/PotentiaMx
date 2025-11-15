# 🚀 Implementación SEO: Conectar Formulario → Google

## 📝 Datos que YA capturas en el formulario:

```javascript
// app/dashboard/add-terrain/page.js
const formData = {
  title: "Terreno para desarrollo",           // ✅ Para SEO Title
  description: "Terreno ubicado en...",        // ✅ Para SEO Description
  property_type: "terreno",                    // ✅ Para Keywords
  land_category: "desarrollo",                 // ✅ Para Keywords
  total_square_meters: 666,                    // ✅ Para Title y Description
  sale_price: 665640,                          // ✅ Para Title y Description
  latitude: 20.5692,                           // ✅ Para ubicación (Puerto Vallarta)
  longitude: -105.3581,                        // ✅ Para ubicación
  land_use: "Residencial",                     // ✅ Para Keywords
};
```

## 🎯 Cómo se convierte en SEO:

### Paso 1: Generar Title SEO

**Fórmula:**
```
{title} {total_square_meters}m² Puerto Vallarta | ${sale_price} MXN | Tour 360°
```

**Resultado:**
```
Terreno para Desarrollo 666 m² Puerto Vallarta | $665,640 MXN | Tour 360°
```

**Código:**
```typescript
const seoTitle = `${terreno.title} ${terreno.total_square_meters}m² Puerto Vallarta | $${terreno.sale_price.toLocaleString('es-MX')} MXN | Tour 360°`;
```

---

### Paso 2: Generar Description SEO

**Fórmula:**
```
{property_type} {land_category} de {total_square_meters} m² en Puerto Vallarta, Jalisco.
{description_primeras_150_palabras}.
Tour virtual 360° interactivo. Uso: {land_use}.
Precio: ${sale_price} MXN (${price_per_sqm}/m²).
```

**Resultado:**
```
Terreno para desarrollo de 666 m² en Puerto Vallarta, Jalisco. Terreno ubicado en zona privilegiada, ideal para proyecto residencial. Tour virtual 360° interactivo. Uso: Residencial. Precio: $665,640 MXN ($1,000/m²).
```

**Código:**
```typescript
const seoDescription = `${terreno.property_type === 'terreno' ? 'Terreno' : terreno.property_type} ${terreno.land_category || ''} de ${terreno.total_square_meters} m² en Puerto Vallarta, Jalisco. ${terreno.description?.substring(0, 150)}. Tour virtual 360° interactivo. ${terreno.land_use ? `Uso: ${terreno.land_use}.` : ''} Precio: $${terreno.sale_price.toLocaleString('es-MX')} MXN${terreno.price_per_sqm ? ` ($${terreno.price_per_sqm.toLocaleString('es-MX')}/m²)` : ''}.`;
```

---

### Paso 3: Generar Keywords SEO

**Fórmula: Combinar todos los datos relevantes**

```javascript
const keywords = [
  terreno.property_type,           // "terreno"
  terreno.land_category,           // "desarrollo"
  "puerto vallarta",
  "bahía banderas",
  "jalisco",
  terreno.land_use?.toLowerCase(), // "residencial"
  `${terreno.total_square_meters} m²`,
  "tour virtual 360",
  "bienes raíces",
  "venta",
  terreno.available_for_contribution ? "aportación" : null,
].filter(Boolean).join(', ');
```

**Resultado:**
```
terreno, desarrollo, puerto vallarta, bahía banderas, jalisco, residencial, 666 m², tour virtual 360, bienes raíces, venta
```

---

### Paso 4: Ubicación automática (Reverse Geocoding)

**Problema:** Solo tienes coordenadas (20.5692, -105.3581)
**Solución:** Convertir coordenadas → "Puerto Vallarta, Jalisco"

**Opción 1: API de Google Maps (Gratis hasta 40,000 requests/mes)**

```typescript
async function getLocationName(lat: number, lng: number): Promise<string> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY&language=es`
  );
  const data = await response.json();

  if (data.results[0]) {
    // Extraer ciudad y estado
    const components = data.results[0].address_components;
    const city = components.find(c => c.types.includes('locality'))?.long_name || 'Puerto Vallarta';
    const state = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || 'Jalisco';
    return `${city}, ${state}`;
  }

  return 'Puerto Vallarta, Jalisco'; // fallback
}
```

**Opción 2: Simplificado (Sin API)**

Por ahora, como tus propiedades están en Puerto Vallarta:

```typescript
const location = 'Puerto Vallarta, Jalisco, México';
```

---

## 🛠️ Implementación Completa

### Archivo: `app/terreno/[id]/page.tsx` (NUEVO)

```typescript
import { Metadata } from 'next';
import { createClient } from '@/lib/supabaseClient';
import TerrenoClientPage from './TerrenoClientPage';

// ✅ Función que genera SEO dinámico
export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = createClient();

  // Obtener datos del terreno
  const { data: terreno } = await supabase
    .from('terrenos')
    .select('*')
    .eq('id', params.id)
    .single();

  // Si no existe, metadata genérica
  if (!terreno) {
    return {
      title: 'Propiedad no encontrada | PotentiaMX',
      description: 'La propiedad que buscas no está disponible.',
    };
  }

  // 🎯 GENERAR TITLE SEO
  const propertyTypeSpanish =
    terreno.property_type === 'terreno' ? 'Terreno' :
    terreno.property_type === 'casa' ? 'Casa' :
    terreno.property_type === 'departamento' ? 'Departamento' :
    'Propiedad';

  const title = [
    terreno.title || propertyTypeSpanish,
    terreno.total_square_meters ? `${terreno.total_square_meters}m²` : null,
    'Puerto Vallarta',
    terreno.sale_price ? `| $${terreno.sale_price.toLocaleString('es-MX')} MXN` : null,
    '| Tour 360°'
  ].filter(Boolean).join(' ');

  // 🎯 GENERAR DESCRIPTION SEO
  const description = [
    `${propertyTypeSpanish} ${terreno.land_category || ''} de ${terreno.total_square_meters || 'N/A'} m² en Puerto Vallarta, Jalisco.`,
    terreno.description ? terreno.description.substring(0, 100) + '...' : '',
    'Tour virtual 360° interactivo.',
    terreno.land_use ? `Uso: ${terreno.land_use}.` : '',
    terreno.sale_price ? `Precio: $${terreno.sale_price.toLocaleString('es-MX')} MXN` : '',
    terreno.price_per_sqm ? `($${terreno.price_per_sqm.toLocaleString('es-MX')}/m²).` : '',
  ].filter(Boolean).join(' ');

  // 🎯 GENERAR KEYWORDS SEO
  const keywords = [
    terreno.property_type,
    terreno.land_category,
    'puerto vallarta',
    'bahía banderas',
    'jalisco',
    'méxico',
    terreno.land_use?.toLowerCase(),
    terreno.total_square_meters ? `${terreno.total_square_meters} m²` : null,
    terreno.total_square_meters ? `${terreno.total_square_meters} metros cuadrados` : null,
    'tour virtual 360',
    'tour virtual',
    'recorrido virtual',
    'bienes raíces',
    'inmobiliaria',
    'venta',
    terreno.available_for_contribution ? 'aportación' : null,
    terreno.available_for_contribution ? 'desarrollo inmobiliario' : null,
  ].filter(Boolean).join(', ');

  return {
    title,
    description,
    keywords,

    // 🌐 Open Graph (Facebook, WhatsApp, LinkedIn)
    openGraph: {
      title,
      description,
      url: `https://potentiamx.com/terreno/${params.id}`,
      siteName: 'PotentiaMX',
      images: terreno.cover_image_url ? [{
        url: terreno.cover_image_url,
        width: 1200,
        height: 630,
        alt: terreno.title || propertyTypeSpanish,
      }] : terreno.image_urls?.[0] ? [{
        url: terreno.image_urls[0],
        width: 1200,
        height: 630,
        alt: terreno.title || propertyTypeSpanish,
      }] : [],
      locale: 'es_MX',
      type: 'website',
    },

    // 🐦 Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: terreno.cover_image_url ? [terreno.cover_image_url] :
              terreno.image_urls?.[0] ? [terreno.image_urls[0]] : [],
    },

    // 🤖 Control de indexación
    robots: {
      // Solo indexar si está publicado en marketplace y activo
      index: terreno.is_marketplace_listing === true && terreno.status === 'active',
      follow: true,
      googleBot: {
        index: terreno.is_marketplace_listing === true && terreno.status === 'active',
        follow: true,
      },
    },

    // 📱 Otras metadata útiles
    other: {
      'geo.region': 'MX-JAL',
      'geo.placename': 'Puerto Vallarta',
      'geo.position': terreno.latitude && terreno.longitude ?
        `${terreno.latitude};${terreno.longitude}` : undefined,
    },
  };
}

// Componente que renderiza la página
export default function TerrenoPage({ params }: { params: { id: string } }) {
  return <TerrenoClientPage id={params.id} />;
}
```

### Archivo: `app/terreno/[id]/TerrenoClientPage.tsx` (MOVER código actual aquí)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';
import PhotoSphereViewer from './PhotoSphereViewer';

// ✅ Todo el código que actualmente está en page.js VA AQUÍ
// Solo cambia el export:

export default function TerrenoClientPage({ id }: { id: string }) {
  // ... todo tu código actual de page.js
  // pero usa `id` en lugar de `params.id`

  const supabase = createClient();
  const [terrain, setTerrain] = useState(null);
  // ... resto del código igual
}
```

---

## 🧪 Cómo Probar que Funciona

### 1. Deploy a producción
```bash
git add .
git commit -m "feat: SEO dinámico por propiedad"
git push
```

### 2. Espera el deploy en Netlify (2-3 min)

### 3. Prueba en Google

**Opción A: Simulador de Google (Instantáneo)**
```
https://search.google.com/test/rich-results
```
Pega la URL de una propiedad:
```
https://potentiamx.com/terreno/062e89fd-6629-40a4-8eaa-9f51cbe9ecdf
```

**Opción B: Vista real (lo que verá Google)**
```
curl -A "Googlebot" https://potentiamx.com/terreno/062e89fd-6629-40a4-8eaa-9f51cbe9ecdf
```

Deberías ver:
```html
<title>Terreno para Desarrollo 666 m² Puerto Vallarta | $665,640 MXN | Tour 360°</title>
<meta name="description" content="Terreno para desarrollo de 666 m²...">
```

### 4. Inspeccionar en navegador

1. Abre propiedad en Chrome
2. F12 → Elements
3. Busca `<head>`
4. Verifica que `<title>` y `<meta>` sean únicos

### 5. Compartir en WhatsApp/Facebook

Comparte el link de una propiedad en WhatsApp.
Debería verse:
```
[Imagen de portada]
Terreno para Desarrollo 666 m² Puerto Vallarta | $665,640 MXN
Terreno para desarrollo de 666 m² en Puerto Vallarta...
potentiamx.com
```

---

## 📊 Resultados Esperados

### Semana 1-2:
- ✅ Google empieza a indexar propiedades individuales
- ✅ Apareces en búsquedas super específicas
  - "terreno 666 m² puerto vallarta"
  - "terreno desarrollo puerto vallarta $665640"

### Mes 1:
- ✅ Empiezas a rankear en búsquedas de cola larga
  - "terreno para desarrollo puerto vallarta"
  - "terreno residencial bahía banderas"

### Mes 2-3:
- ✅ Compites en búsquedas generales
  - "terreno puerto vallarta"
  - "terrenos venta puerto vallarta"

---

## ⏱️ Tiempo de Implementación

| Tarea | Tiempo |
|-------|--------|
| Crear page.tsx con generateMetadata | 1 hora |
| Mover código a TerrenoClientPage.tsx | 30 min |
| Probar y ajustar | 30 min |
| Deploy y verificar | 30 min |
| **TOTAL** | **2.5 horas** |

---

## 🚀 ¿Siguiente Paso?

**¿Quieres que implementemos esto ahora?**

Es relativamente rápido (2-3 horas) y el impacto es ENORME para SEO.

Cada propiedad que publiques será automáticamente una página optimizada para Google.
