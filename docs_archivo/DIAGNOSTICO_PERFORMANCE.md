# Diagnóstico de Performance - Carga Lenta del Sitio

## Problema Reportado

El sitio está tardando bastante en abrir y carga muy lento.

## Causas Posibles y Soluciones

### 1. Imágenes Pesadas (Más Probable)

**Síntoma**: Las imágenes panorámicas 360° suelen ser muy pesadas (5-20 MB cada una)

**Solución**:

- Las imágenes se optimizan a WebP 92% de calidad al subirlas
- Verificar que la optimización esté funcionando
- Considerar lazy loading para imágenes

**Script para verificar tamaño de imágenes**:

```sql
-- Ver tamaño de archivos en Supabase Storage
SELECT
  name,
  metadata->>'size' as size_bytes,
  ROUND((metadata->>'size')::numeric / 1024 / 1024, 2) as size_mb
FROM storage.objects
WHERE bucket_id = 'terrenos'
ORDER BY (metadata->>'size')::numeric DESC
LIMIT 20;
```

### 2. Demasiadas Consultas a Base de Datos

**Síntoma**: Múltiples consultas en el dashboard

**Código a revisar**:

- `app/dashboard/page.js` - Hace varias consultas separadas
- Posible optimización: Combinar consultas con JOIN

### 3. Build Size Grande

**Verificar en build output**:

```
Route (app)                          Size  First Load JS
├ ○ /dashboard                    31.6 kB         196 kB  ← Grande
├ ƒ /terreno/[id]/editor          7.68 kB         356 kB  ← MUY GRANDE
```

**Causa**: Photo Sphere Viewer es pesado (328 kB)
**Solución**: Ya está usando dynamic import, pero podría mejorarse

### 4. Netlify Cold Start

**Síntoma**: Primera carga muy lenta, luego mejora

**Solución**:

- Netlify free tier tiene cold starts
- Considerar mantener el sitio "caliente" con ping automático
- O upgrade a plan pagado

### 5. No hay Caché de Imágenes

**Problema**: Cada vez que cargas el dashboard, descarga todas las imágenes de nuevo

**Solución**: Configurar headers de caché en Netlify

## Acciones Inmediatas para Mejorar Performance

### Acción 1: Agregar Headers de Caché en Netlify

Crea archivo `public/_headers`:

```
/terreno/*
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000

/*.webp
  Cache-Control: public, max-age=31536000

/*.png
  Cache-Control: public, max-age=31536000
```

### Acción 2: Lazy Loading de Imágenes en Dashboard

En `app/dashboard/page.js`, las imágenes de las cards deberían tener:

```jsx
<Image
  src={imageUrl}
  loading="lazy"
  priority={false}
  // ...
/>
```

### Acción 3: Reducir Imágenes del Dashboard

En lugar de cargar la imagen completa en cada card, usar thumbnails.

### Acción 4: Implementar Skeleton Loading

Mientras carga, mostrar skeletons en lugar de pantalla en blanco.

### Acción 5: Verificar Network Tab

1. Abre Chrome DevTools (F12)
2. Network tab
3. Recarga la página
4. Ordena por "Size" descendente
5. Identifica qué recursos son más pesados

## Métricas a Medir

### Usar Lighthouse (Chrome DevTools)

1. F12 → Lighthouse tab
2. Run audit
3. Verificar:
   - Performance score (debería ser >80)
   - LCP (Largest Contentful Paint) <2.5s
   - FID (First Input Delay) <100ms
   - CLS (Cumulative Layout Shift) <0.1

### Usar WebPageTest

https://www.webpagetest.org/

- Ingresa: https://potentiamx.com
- Location: Mexico City (más cercano)
- Analiza tiempo de carga real

## Plan de Optimización Priorizado

### Fase 1: Quick Wins (hoy)

1. ✅ Agregar headers de caché en Netlify
2. ✅ Verificar tamaño de imágenes en storage
3. ✅ Agregar lazy loading a imágenes del dashboard

### Fase 2: Optimizaciones Medium (esta semana)

1. Implementar skeleton loading
2. Optimizar consultas de dashboard (combinar en una sola)
3. Agregar compresión de imágenes más agresiva

### Fase 3: Optimizaciones Advanced (siguiente semana)

1. Implementar CDN para imágenes
2. Code splitting más granular
3. Implementar Service Worker para caché offline

## Debugging en Vivo

Para diagnosticar AHORA:

1. Ve a https://potentiamx.com
2. Abre DevTools (F12)
3. Network tab
4. Marca "Disable cache"
5. Recarga (Ctrl+Shift+R)
6. Ordena por "Time" descendente
7. Toma screenshot y comparte los 5 recursos más lentos
