# Cambiar Favicon de PotentiaMX

## Problema Actual
El sitio muestra el ícono por defecto de Next.js en:
- Google search results
- Browser tabs
- Bookmarks
- Mobile home screen

## Solución Rápida

### Opción 1: Usar Emoji como Favicon Temporal (5 minutos)

Edita `app/layout.tsx` y agrega:

```tsx
export const metadata: Metadata = {
  title: 'PotentiaMX - Tours Virtuales 360°',
  description: 'Plataforma profesional para crear tours virtuales inmersivos',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏡</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};
```

Emojis sugeridos: 🏡 🏘️ 🌍 360 📍

### Opción 2: Crear Favicon Simple con Iniciales (15 minutos)

1. Ve a https://favicon.io/favicon-generator/
2. Configuración:
   - Text: "PMX" o "P"
   - Background: #14b8a6 (teal)
   - Font: Roboto Bold
   - Font Size: 80
   - Font Color: #ffffff
   - Shape: Rounded

3. Descarga el .zip generado

4. Extrae y copia estos archivos a `public/`:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`

5. Actualiza `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: 'PotentiaMX - Tours Virtuales 360°',
  description: 'Plataforma profesional para crear tours virtuales inmersivos',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};
```

### Opción 3: Logo Profesional con IA (30 minutos)

**Herramientas gratuitas recomendadas**:

1. **Looka** (https://looka.com) - Gratis trial
   - Input: "PotentiaMX"
   - Industry: Real Estate Technology
   - Colors: Teal, Orange
   - Style: Modern, Tech

2. **Canva** (https://canva.com/create/logos/)
   - Template: Tech Startup
   - Customize con "PotentiaMX"
   - Export PNG 512x512

3. **Hatchful by Shopify** (https://hatchful.shopify.com/)
   - Free, no signup required
   - Category: Technology
   - Visual style: Modern

## Favicon Completo - Checklist

Una vez tengas el logo definitivo, necesitas:

- [ ] `favicon.ico` (32x32, para navegadores viejos)
- [ ] `favicon-16x16.png`
- [ ] `favicon-32x32.png`
- [ ] `apple-touch-icon.png` (180x180, para iOS)
- [ ] `android-chrome-192x192.png` (PWA)
- [ ] `android-chrome-512x512.png` (PWA)

## Metadata Completo para SEO

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://potentiamx.com'),
  title: {
    default: 'PotentiaMX - Tours Virtuales 360° para Inmobiliarias',
    template: '%s | PotentiaMX'
  },
  description: 'Crea tours virtuales profesionales en 360° para propiedades. Plataforma todo-en-uno para agentes inmobiliarios en México.',
  keywords: ['tours virtuales', '360 grados', 'inmobiliaria', 'México', 'propiedades'],
  authors: [{ name: 'PotentiaMX' }],
  creator: 'PotentiaMX',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://potentiamx.com',
    title: 'PotentiaMX - Tours Virtuales 360°',
    description: 'Plataforma profesional para crear tours virtuales inmersivos',
    siteName: 'PotentiaMX',
    images: [
      {
        url: '/og-image.png', // 1200x630
        width: 1200,
        height: 630,
        alt: 'PotentiaMX - Tours Virtuales 360°',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PotentiaMX - Tours Virtuales 360°',
    description: 'Plataforma profesional para crear tours virtuales inmersivos',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
```

## Generar Favicons desde Logo

Si ya tienes un logo PNG/SVG de alta calidad:

1. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - Upload tu logo
   - Genera todos los tamaños automáticamente
   - Incluye manifest.json para PWA
   - Descarga package completo

2. **Favicon.io** (https://favicon.io/favicon-converter/)
   - Sube imagen PNG cuadrada (512x512 mínimo)
   - Genera automáticamente todos los tamaños

## Siguiente Paso

¿Cuál opción prefieres?
1. Emoji temporal (más rápido)
2. Iniciales PMX (rápido y profesional)
3. Logo con IA (mejor opción a mediano plazo)

Puedo ayudarte a implementar cualquiera de las 3 opciones ahora mismo.
