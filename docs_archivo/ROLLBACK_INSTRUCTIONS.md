# 🔄 INSTRUCCIONES DE ROLLBACK - Optimización Performance Landing

**Fecha de Backup**: 7 de diciembre de 2025
**Commit de Seguridad**: Se creará automáticamente antes de los cambios

---

## ⚠️ SI ALGO SALE MAL - ROLLBACK INMEDIATO

### Opción 1: Rollback Git (Recomendado - 1 comando)

```bash
# Ver los últimos commits
git log --oneline -5

# Buscar el commit que dice: "checkpoint: backup before performance optimization (Solución C)"
# Copiar el hash (ej: a1b2c3d)

# Hacer rollback a ese punto
git reset --hard <HASH_DEL_COMMIT_BACKUP>

# Ejemplo:
# git reset --hard a1b2c3d

# Push forzado a Netlify (si ya deployaste)
git push origin master --force
```

**Netlify detectará el push y hará redeploy automático con la configuración anterior.**

---

### Opción 2: Restaurar Archivos Manualmente

Si no quieres usar git reset, restaura estos 3 archivos específicos:

#### Archivo 1: `netlify.toml`

**Ubicación**: `C:\Users\Roberto\landview-app-cms\netlify.toml`

**Contenido Original (BACKUP)**:

```toml
# ═══════════════════════════════════════════════════
# Configuración de Netlify para PotentiaMX
# Next.js 15.5.4 + Supabase + React 19
# ═══════════════════════════════════════════════════

[build]
  # Comando de build (sin Turbopack - Netlify no lo soporta aún)
  command = "npm run build:netlify"

  # Directorio de publicación para Next.js (requerido por @netlify/plugin-nextjs)
  publish = ".next"

  # Funciones serverless
  functions = "netlify/functions"

[build.environment]
  # Node.js version (requerido para Next.js 15)
  NODE_VERSION = "20.11.0"

  # Next.js environment
  NEXT_TELEMETRY_DISABLED = "1"

  # Optimizaciones
  NPM_FLAGS = "--legacy-peer-deps"

# ═══════════════════════════════════════════════════
# PLUGIN DE NEXT.JS (ESENCIAL)
# ═══════════════════════════════════════════════════
[[plugins]]
  package = "@netlify/plugin-nextjs"

# ═══════════════════════════════════════════════════
# REDIRECTS Y REWRITES
# ═══════════════════════════════════════════════════

# Redirect www a apex domain (sin www)
[[redirects]]
  from = "https://www.potentiamx.com/*"
  to = "https://potentiamx.com/:splat"
  status = 301
  force = true

# Redirect HTTP a HTTPS
[[redirects]]
  from = "http://potentiamx.com/*"
  to = "https://potentiamx.com/:splat"
  status = 301
  force = true

# ═══════════════════════════════════════════════════
# HEADERS DE SEGURIDAD
# ═══════════════════════════════════════════════════

[[headers]]
  for = "/*"
  [headers.values]
    # Prevenir clickjacking
    X-Frame-Options = "DENY"

    # Prevenir MIME sniffing
    X-Content-Type-Options = "nosniff"

    # XSS Protection
    X-XSS-Protection = "1; mode=block"

    # Referrer Policy
    Referrer-Policy = "strict-origin-when-cross-origin"

    # Permissions Policy
    Permissions-Policy = "camera=(), microphone=(), geolocation=(self)"

    # Content Security Policy (CSP) - Ajustar según necesites
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://vercel.live;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co;
      frame-src 'self';
    """

# ═══════════════════════════════════════════════════
# CACHE OPTIMIZATION
# ═══════════════════════════════════════════════════

# Cache agresivo para assets estáticos
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache de imágenes optimizadas
[[headers]]
  for = "/_next/image/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache de fonts
[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# ═══════════════════════════════════════════════════
# CONFIGURACIÓN DE CONTEXTOS
# ═══════════════════════════════════════════════════

# Production
[context.production]
  environment = { NODE_ENV = "production" }

# Deploy previews (branches)
[context.deploy-preview]
  environment = { NODE_ENV = "production" }

# Branch deploys
[context.branch-deploy]
  environment = { NODE_ENV = "production" }

# ═══════════════════════════════════════════════════
# NOTAS
# ═══════════════════════════════════════════════════
#
# Variables de entorno a configurar en Netlify UI:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY (sensitive)
# - RESEND_API_KEY (sensitive)
#
# Configurar en: Site settings → Environment variables
#
```

#### Archivo 2: `app/providers/PostHogProvider.tsx`

**Ubicación**: `C:\Users\Roberto\landview-app-cms\app\providers\PostHogProvider.tsx`

**Contenido Original (BACKUP)**:

```tsx
'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track pageviews on route change
    if (pathname && posthog.__loaded) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog
    if (typeof window !== 'undefined') {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

      // Skip initialization if no key or in development without key
      if (!posthogKey) {
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 PostHog: No API key found, analytics disabled');
        }
        return;
      }

      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('📊 PostHog initialized successfully');
          }
        },
        capture_pageview: false, // Manual pageview tracking
        capture_pageleave: true, // Track when users leave
        autocapture: false, // Manual event tracking only
      });
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
```

#### Archivo 3: `public/_headers`

**Ubicación**: `C:\Users\Roberto\landview-app-cms\public\_headers`

**Contenido Original (BACKUP)**:

```
# Cache headers for Netlify
# https://docs.netlify.com/routing/headers/

# Cache static assets for 1 year
/terreno/*
  Cache-Control: public, max-age=31536000, immutable

# Cache images for 1 year
/*.jpg
  Cache-Control: public, max-age=31536000, immutable
/*.jpeg
  Cache-Control: public, max-age=31536000, immutable
/*.webp
  Cache-Control: public, max-age=31536000, immutable
/*.png
  Cache-Control: public, max-age=31536000, immutable
/*.gif
  Cache-Control: public, max-age=31536000, immutable

# Cache fonts for 1 year
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
/*.woff
  Cache-Control: public, max-age=31536000, immutable
/*.ttf
  Cache-Control: public, max-age=31536000, immutable

# Don't cache HTML and API routes
/*.html
  Cache-Control: public, max-age=0, must-revalidate
/api/*
  Cache-Control: no-cache, no-store, must-revalidate

# Cache JS and CSS for 1 year (Next.js uses content hashing)
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## 📋 Pasos para Rollback Manual

1. Copia el contenido de cada archivo de arriba
2. Pega en el archivo correspondiente
3. Guarda los cambios
4. Commit y push:

```bash
git add netlify.toml app/providers/PostHogProvider.tsx public/_headers
git commit -m "rollback: restore original configuration before performance optimization"
git push origin master
```

5. Netlify hará redeploy automático en ~2 minutos

---

## 🧪 Verificar que el Rollback Funcionó

Después de hacer rollback:

```bash
# Verificar que los archivos están en versión original
git diff HEAD~1 netlify.toml
git diff HEAD~1 app/providers/PostHogProvider.tsx
git diff HEAD~1 public/_headers

# No debe haber diferencias (o solo las líneas que modificaste)
```

---

## 📞 Contacto de Emergencia

Si el rollback falla o tienes dudas:

1. **No hagas más cambios**
2. **Captura de pantalla del error**
3. **Comparte el mensaje de error completo**
4. **Especifica qué intentaste (git reset o restauración manual)**

---

## ✅ Checklist Post-Rollback

Después de hacer rollback, verifica:

- [ ] Sitio carga (aunque sea lento)
- [ ] Login funciona
- [ ] Dashboard accesible
- [ ] Tours 360° se ven correctamente
- [ ] No hay errores en consola del navegador

Si TODO funciona → Rollback exitoso ✅

---

## 💾 Archivos de Backup Adicionales

Este commit también incluye backups de:
- `ANALISIS_SOLUCIONES_COLD_START.md` - Análisis completo de soluciones
- `RESUMEN_PROBLEMA_PERFORMANCE_LANDING.md` - Historial del problema
- Todos los archivos de documentación

---

**Última actualización**: 2025-12-07
**Autor**: Claude Code
**Commit de seguridad**: Ver próximo commit con mensaje "checkpoint: backup before performance optimization"
