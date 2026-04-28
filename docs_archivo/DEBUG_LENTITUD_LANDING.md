# Debug: Lentitud en Página Principal

## Problema

La página principal (https://potentiamx.com) tarda mucho en cargar, sin imágenes pesadas.

## Causas Posibles

### 1. Demasiados Componentes Cargándose en Cliente

**Problema**: `app/page.tsx` usa `'use client'` y carga 10 secciones diferentes:

- Navbar
- HeroSection
- SocialProofSection
- ProblemSolutionSection
- ProductTourSection
- PricingSection
- TestimonialSection
- ContactFormSection
- FinalCTASection
- Footer

**Impacto**: Todo el JavaScript se ejecuta antes de mostrar contenido

**Solución**: Convertir a Server Components donde sea posible

### 2. JavaScript Bundle Muy Grande

**Del build**:

```
Route (app)                          Size  First Load JS
┌ ○ /                               16 kB         180 kB
```

180 KB de JS para la landing es MUCHO para una página simple.

### 3. Falta de Optimización de Fuentes

Las fuentes (Geist) pueden estar bloqueando el render.

### 4. Netlify Cold Start

Primera carga en Netlify free tier puede tardar 3-5 segundos.

## Diagnóstico AHORA

### Paso 1: Medir Tiempo Real

1. Abre https://potentiamx.com en **modo incógnito**
2. Abre DevTools (F12)
3. Ve a Network tab
4. Marca "Disable cache"
5. Recarga (Ctrl+Shift+R)
6. Mira el **DOMContentLoaded** y **Load** time al final

**Qué buscar**:

- DOMContentLoaded < 1s = Bueno
- DOMContentLoaded 1-3s = Regular
- DOMContentLoaded > 3s = Malo

### Paso 2: Lighthouse Audit

1. F12 → Lighthouse tab
2. Categories: Solo "Performance"
3. Device: Desktop
4. Click "Analyze page load"
5. Espera resultados

**Qué buscar**:

- Performance Score > 80 = Bueno
- LCP (Largest Contentful Paint) < 2.5s = Bueno
- TBT (Total Blocking Time) < 300ms = Bueno

### Paso 3: Identificar Bottleneck

En Network tab, ordena por "Time" y verifica:

- ¿Qué recurso tarda más?
- ¿Es un archivo JS? ¿Cuál?
- ¿Es una API call? ¿A dónde?
- ¿Es una fuente? ¿Cuál?

## Soluciones Rápidas (Sin Cambiar Código)

### Solución 1: Preconnect a Supabase

Agregar en `app/layout.tsx`:

```tsx
<link rel="preconnect" href="https://TUPROYECTO.supabase.co" />
<link rel="dns-prefetch" href="https://TUPROYECTO.supabase.co" />
```

### Solución 2: Lazy Load Secciones Menos Importantes

Las secciones "below the fold" (que no se ven al inicio) pueden cargarse después.

### Solución 3: Remover Analytics/Scripts Innecesarios

¿Tienes Google Analytics, Facebook Pixel, u otros scripts externos?

## Soluciones Medium (Requieren Cambios)

### Convertir Landing a Server Components

La landing NO necesita ser cliente. Puede ser estática.

**Cambio**:

```tsx
// app/page.tsx
// REMOVER 'use client'

export default function Home() {
  return <main className="min-h-screen">{/* ... */}</main>;
}
```

Esto reduciría el JavaScript bundle significativamente.

### Implementar Skeleton Loading

Mostrar estructura mientras carga contenido.

### Code Splitting Manual

Dividir secciones grandes en chunks separados.

## ¿Qué Hacer AHORA?

1. **Primero**: Corre Lighthouse y comparte el score
2. **Segundo**: Comparte los 3 recursos más lentos del Network tab
3. **Tercero**: Dime si hay algún script/analytics extra en el sitio

Con esa información sabré exactamente qué optimizar.

## Comparación con Competencia

Prueba cargar:

- https://www.kuula.co → ¿Es más rápido?
- https://www.pixieset.com → ¿Es más rápido?

Si ellos son más rápidos, entonces SÍ tenemos un problema de performance que resolver.
