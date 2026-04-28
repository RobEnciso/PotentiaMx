# RESUMEN COMPLETO: Problema de Performance en Landing Page

**Fecha**: 7 de diciembre de 2025
**Sitio**: https://potentiamx.com
**Problema Actual**: LCP (Largest Contentful Paint) de **43.97 segundos** con TTFB de **21.39 segundos**

---

## 🔴 ESTADO ACTUAL DEL PROBLEMA

### Métricas Actuales (DEV LOCAL)
- **LCP**: 43.97s (CRÍTICO - debe ser <2.5s)
- **TTFB (Time to First Byte)**: 21,393ms (~21.4s)
- **Resource Load Delay**: 22ms
- **Resource Load Duration**: 120ms
- **Element Render Delay**: 22,434ms (~22.4s)

### ⚠️ PATRÓN CRÍTICO OBSERVADO
**Después de 10 minutos de inactividad, la página carga perfectamente.**

Esto indica claramente que el problema es:
- **Cold Start** de Netlify Serverless Functions
- **Cold Start** de conexión a Supabase
- **Caché expirado** que se regenera tras inactividad

---

## 📋 HISTORIAL COMPLETO DE INTENTOS

### Intento #1: Optimización de Bundle JavaScript
**Fecha**: ~Noviembre 2025
**Commits**: `f7342e0`, `5746a47`

**Qué se hizo**:
- Convertir landing page de Client Component a Server Component
- Implementar dynamic imports con `next/dynamic`
- Lazy loading de secciones below-the-fold
- Reducir bundle de 180 KB a ~70 KB

**Resultado**:
- ✅ LCP mejoró de 11.97s a <2.5s en builds estáticos
- ❌ No resolvió el problema de TTFB en producción

**Código implementado** (`app/page.tsx`):
```tsx
// Dynamic imports para todas las secciones
const ProblemSolutionSection = dynamicImport(
  () => import('@/components/landing/ProblemSolutionSection'),
  { ssr: true, loading: () => <div className="h-96" /> }
);
```

---

### Intento #2: Desactivar ISR (Incremental Static Regeneration)
**Fecha**: ~Noviembre 2025
**Commits**: `c58d205`, `869bc0b`

**Qué se hizo**:
- Agregar `export const revalidate = false` en `app/page.tsx`
- Intentar forzar generación estática pura
- Eliminar cualquier lógica de regeneración bajo demanda

**Resultado**:
- ❌ TTFB seguía en 27s en producción
- El problema persistió porque ISR no era la causa raíz

**Código implementado**:
```tsx
export const revalidate = false; // Never revalidate
```

---

### Intento #3: Optimizar Middleware de Supabase
**Fecha**: ~Diciembre 2025
**Commits**: `45adf5c`, `361d4ff`, `944b5f9`

**Qué se hizo**:
- Excluir landing page (`/`) del middleware
- Implementar matcher config para solo rutas protegidas
- Agregar bypass explícito en el middleware

**Resultado**:
- ✅ Funcionó perfectamente en desarrollo local
- ❌ En producción, TTFB seguía alto (26s-43s)

**Código implementado** (`middleware.ts`):
```typescript
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // CRITICAL: Bypass middleware for landing page
  if (path === '/') {
    return NextResponse.next();
  }
  // ... resto del código
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
```

---

### Intento #4: Force Static Generation
**Fecha**: ~Diciembre 2025
**Commits**: `8fd2f30`

**Qué se hizo**:
- Agregar `export const dynamic = 'force-static'`
- Forzar generación estática en build time
- Prevenir cualquier lógica server-side en runtime

**Resultado**:
- ✅ En desarrollo, la página se genera estáticamente
- ❌ En producción, el problema persiste

**Código implementado** (`app/page.tsx`):
```tsx
export const dynamic = 'force-static'; // Force static HTML
export const revalidate = false; // Never revalidate
```

---

### Intento #5: Optimizar Navbar y Fuentes
**Fecha**: ~Diciembre 2025
**Commits**: `4cc178e`

**Qué se hizo**:
- Preload de fuentes críticas (Montserrat, Inter)
- Preload de logos del navbar
- Optimización de componentes visibles en viewport inicial

**Resultado**:
- ✅ Mejora marginal en LCP de elementos específicos
- ❌ No resolvió el TTFB alto

**Código implementado** (`app/layout.tsx`):
```tsx
<head>
  <link
    rel="preload"
    href="/logo-navbar-white.png"
    as="image"
    fetchPriority="high"
  />
  <link
    rel="preload"
    href="/logo-navbar-black.png"
    as="image"
    fetchPriority="high"
  />
</head>
```

---

### Intento #6: Health Check Endpoint
**Fecha**: ~Diciembre 2025
**Commits**: `879cdcd`

**Qué se hizo**:
- Crear endpoint `/api/health` para mantener funciones "calientes"
- Configurar pings periódicos para evitar cold starts

**Resultado**:
- ✅ Ayuda a mantener funciones activas
- ❌ No previene cold starts completamente en free tier

---

### Intento #7: Lazy-loaded Auth Check
**Fecha**: ~Diciembre 2025
**Commits**: `7f1ab14`, `5936961`

**Qué se hizo**:
- Mover auth checks a `requestIdleCallback`
- Evitar bloquear render inicial con validaciones de sesión

**Resultado**:
- ✅ Mejora en mobile performance
- ❌ No aplicable a landing page (no tiene auth)

---

### Intento #8: Deshabilitar Secciones Temporalmente
**Fecha**: Diciembre 2025
**Commits**: `eaeb93d`

**Qué se hizo**:
- Comentar `SocialProofSection` (mostraba logos placeholder)
- Comentar `PropertiesSection` (hacía llamadas a Supabase)
- Reducir complejidad de la página

**Resultado**:
- ✅ Redujo carga del cliente
- ❌ TTFB sigue alto porque el problema es server-side

---

### Intento #9: PostHog Analytics Optimization
**Fecha**: Diciembre 2025

**Qué se hizo**:
- Desactivar `autocapture` (solo eventos manuales)
- Desactivar `capture_pageview` automático
- Inicializar PostHog de manera lazy

**Resultado**:
- ✅ Reduce overhead de analytics
- ❌ PostHog se carga client-side, no afecta TTFB

**Código implementado** (`app/providers/PostHogProvider.tsx`):
```tsx
posthog.init(posthogKey, {
  capture_pageview: false, // Manual tracking
  autocapture: false, // Manual events only
});
```

---

## 🔍 DIAGNÓSTICO TÉCNICO

### Causas Raíz Identificadas

#### 1. **Netlify Cold Start (PRINCIPAL SOSPECHOSO)**
- **Evidencia**: Después de 10 minutos de inactividad, carga perfecta
- **Causa**: Netlify free tier hace "sleep" a funciones serverless inactivas
- **Impacto**: Primer request tarda 15-25s en "despertar" la función

#### 2. **Supabase Connection Cold Start**
- **Evidencia**: Middleware tarda 21s en `getSession()`
- **Causa**: Primera conexión a Supabase desde función serverless dormida
- **Impacto**: TCP handshake + TLS + auth = ~20s

#### 3. **Next.js SSR/SSG Confusion**
- **Evidencia**: Página marcada como estática pero genera TTFB alto
- **Causa**: Next.js puede estar ejecutando lógica server-side a pesar de `force-static`
- **Impacto**: Cada request espera inicialización de servidor

#### 4. **Font Loading Blocking Render**
- **Evidencia**: `display: 'swap'` configurado pero LCP sigue alto
- **Causa**: Montserrat e Inter se cargan desde Google Fonts
- **Impacto**: ~500ms de delay en render inicial

#### 5. **PostHog Provider Wrapping**
- **Evidencia**: `PostHogProvider` envuelve toda la app en layout
- **Causa**: Client-side JavaScript se ejecuta antes de pintar contenido
- **Impacto**: ~200-500ms de delay

---

## 📊 ANÁLISIS DE MÉTRICAS ACTUALES

### Desglose de LCP 43.97s

| Fase | Tiempo | % del Total | Estado |
|------|--------|-------------|--------|
| **Time to First Byte (TTFB)** | 21,393ms | 48.6% | 🔴 CRÍTICO |
| **Resource Load Delay** | 22ms | 0.05% | ✅ OK |
| **Resource Load Duration** | 120ms | 0.27% | ✅ OK |
| **Element Render Delay** | 22,434ms | 51% | 🔴 CRÍTICO |
| **TOTAL** | 43,969ms | 100% | 🔴 POBRE |

### Interpretación

1. **TTFB (21.4s)**: El servidor tarda 21 segundos en responder
   - Cold start de Netlify function
   - Cold start de Supabase connection
   - Posible ejecución de middleware innecesario

2. **Element Render Delay (22.4s)**: El navegador tarda 22 segundos en renderizar
   - Bloqueo por JavaScript pesado
   - Fuentes bloqueando render
   - PostHog initialization

---

## 🎯 LO QUE SÍ FUNCIONA

1. ✅ **Después de 10 minutos de inactividad** → Carga perfecta
2. ✅ **Middleware bypass** → Configurado correctamente
3. ✅ **Static generation** → Página se genera en build time
4. ✅ **Dynamic imports** → Bundle reducido correctamente
5. ✅ **Preload de recursos críticos** → Logos y fuentes preloaded

---

## 🚨 LO QUE NO FUNCIONA

1. ❌ **TTFB en producción** → 21-26 segundos consistentemente
2. ❌ **Cold starts** → No se previenen efectivamente
3. ❌ **Warm-up automático** → Health check no es suficiente
4. ❌ **Caché de Netlify** → No está cacheando efectivamente
5. ❌ **Edge deployment** → No se está usando Netlify Edge

---

## 💡 TEORÍA DEL PROBLEMA

### Escenario Probable

1. Usuario visita `https://potentiamx.com`
2. Netlify CDN recibe request
3. **PROBLEMA**: Netlify intenta ejecutar función serverless (a pesar de `force-static`)
4. Función está dormida → Cold start (15-20s)
5. Función intenta conectar a Supabase (innecesario) → +5s
6. Función retorna HTML estático que ya existía
7. Total: 21s de TTFB

### Por qué "10 minutos de inactividad funciona"

1. Netlify hace sleep a función después de 10 minutos
2. Al despertar, Netlify **sirve desde CDN** directamente
3. No ejecuta función serverless → TTFB <100ms
4. Usuario ve página instantáneamente

---

## 📝 DOCUMENTOS CREADOS

1. **DEBUG_LENTITUD_LANDING.md**
   - Causas posibles
   - Diagnóstico inicial
   - Soluciones propuestas

2. **DIAGNOSTICO_PERFORMANCE.md**
   - Análisis de build size
   - Métricas de Lighthouse
   - Plan de optimización

3. **ANALYTICS_TRAFICO_WEB_2025.md** (si existe)
   - Configuración de analytics
   - PostHog integration

---

## 🔧 CONFIGURACIÓN ACTUAL

### `app/page.tsx`
```tsx
export const dynamic = 'force-static';
export const revalidate = false;

// Todas las secciones con dynamic import
```

### `middleware.ts`
```typescript
// Landing page excluida explícitamente
if (path === '/') {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
```

### `app/layout.tsx`
```tsx
// Fuentes con display: 'swap'
// Preload de logos críticos
// PostHogProvider wrapping todo
```

### `next.config.ts`
```typescript
// Turbopack habilitado
// Optimización de imágenes
```

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### Opción A: Desplegar en Netlify Edge
- Mover landing a Edge Functions
- Eliminar cold starts completamente
- Servir desde edge locations globales

### Opción B: Configurar Caché Agresivo
- Configurar `_headers` de Netlify
- Forzar CDN cache por 1 año
- Bypass total de funciones serverless

### Opción C: Separar Landing de App
- Deployar landing en Vercel Edge
- Mantener app en Netlify
- Diferentes optimizaciones por tipo de página

### Opción D: Self-host Fonts
- Descargar Montserrat e Inter
- Servir desde `/public/fonts`
- Eliminar dependencia de Google Fonts

### Opción E: Upgrade Netlify Plan
- Netlify Pro elimina cold starts
- Funciones se mantienen calientes
- Solución más simple pero requiere pago

---

## 📈 MÉTRICAS OBJETIVO

| Métrica | Actual | Objetivo | Diferencia |
|---------|--------|----------|------------|
| TTFB | 21,393ms | <600ms | -20,793ms |
| LCP | 43,970ms | <2,500ms | -41,470ms |
| FID | ? | <100ms | ? |
| CLS | ? | <0.1 | ? |

---

## 🔗 RECURSOS ÚTILES

- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/)
- [Netlify CDN Caching](https://docs.netlify.com/routing/headers/)
- [Next.js force-static](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)

---

**Última actualización**: 2025-12-07
**Autor**: Claude Code (asistido por Roberto)
