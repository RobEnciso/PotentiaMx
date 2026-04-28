# Convertir PotentiaMX en PWA (App Instalable)

## ¿Qué es una PWA?
Progressive Web App - Tu sitio web se puede instalar como app en el celular.

## Pasos para convertir PotentiaMX en PWA

### 1. Crear Manifest (archivo de configuración)

Crear archivo: `public/manifest.json`

```json
{
  "name": "PotentiaMX - Tours Virtuales 360°",
  "short_name": "PotentiaMX",
  "description": "Tours virtuales 360° de propiedades en Puerto Vallarta",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#14b8a6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 2. Agregar manifest al layout

En `app/layout.tsx`, agregar en el `<head>`:

```tsx
export const metadata: Metadata = {
  // ... metadata existente
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PotentiaMX',
  },
};
```

### 3. Crear iconos de la app

Necesitas 2 iconos:
- `public/icon-192.png` (192x192 px)
- `public/icon-512.png` (512x512 px)

Puedes usar tu logo actual y redimensionarlo en:
- https://realfavicongenerator.net/
- O Figma/Canva

### 4. Agregar Service Worker (opcional pero recomendado)

Instalar next-pwa:

```bash
npm install next-pwa
```

Crear `next.config.js` (o actualizar el existente):

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // tu configuración existente de Next.js
});
```

### 5. Agregar meta tags para iOS

En `app/layout.tsx`:

```tsx
<head>
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="PotentiaMX" />
  <link rel="apple-touch-icon" href="/icon-192.png" />
</head>
```

### 6. Deploy y prueba

1. Deploy a producción (Netlify/Vercel)
2. Abre el sitio en tu celular
3. En Chrome (Android): "Agregar a pantalla de inicio"
4. En Safari (iOS): Botón compartir → "Agregar a pantalla de inicio"

## ¿Cómo se ve para el usuario?

### Android:
1. Entra a https://potentiamx.com
2. Le sale un banner: "Instalar app"
3. Click → se instala como app
4. Aparece en la pantalla de inicio
5. Abre como app (sin barra del navegador)

### iOS:
1. Entra a https://potentiamx.com en Safari
2. Click en botón "Compartir"
3. "Agregar a pantalla de inicio"
4. Se ve como app normal

## Ventajas de PWA para PotentiaMX:

✅ Los tours 360° funcionan perfecto (Photo Sphere Viewer es compatible)
✅ Se puede usar offline (una vez visitado)
✅ Rápido (carga instantánea)
✅ Notificaciones push (Android)
✅ Icono en pantalla de inicio
✅ Pantalla de splash personalizada
✅ No ocupa casi espacio (es web)

## Limitaciones:

❌ En iOS no tiene todas las funciones (notificaciones limitadas)
❌ No está en App Store/Play Store (pero no lo necesitas)
❌ GPS menos preciso que app nativa (pero suficiente para mapas)

## Tiempo estimado: 4-6 horas

- 2 horas: configurar manifest y service worker
- 1 hora: crear iconos
- 1 hora: probar en diferentes dispositivos
- 2 horas: ajustes finales

## Costo: $0

Todo es gratis, solo usa herramientas que ya tienes.
