# 🚀 Guía Rápida: Activar Landing Page

## ✅ ¿Qué se creó?

Una landing page profesional completa con:

- ✨ Diseño minimalista y moderno
- 📱 100% responsive (móvil, tablet, desktop)
- 🎨 Paleta de colores profesional (teal/slate)
- ⚡ Animaciones suaves en hover
- 🧩 7 secciones modulares

## 📋 Archivos Creados

```
components/
├── landing/
│   ├── HeroSection.tsx           (Hero con video de fondo)
│   ├── SocialProofSection.tsx    (Logos de partners)
│   ├── ProblemSolutionSection.tsx (3 beneficios principales)
│   ├── ProductTourSection.tsx    (Features con imágenes)
│   ├── TestimonialSection.tsx    (Testimonio de cliente)
│   └── FinalCTASection.tsx       (CTA final grande)
└── layout/
    ├── Navbar.tsx                (Navegación sticky opcional)
    └── Footer.tsx                (Footer con links)

app/
└── page_new.tsx                  (Landing page ensamblada)
```

## 🎯 Paso 1: Activar la Landing Page

Tienes dos opciones:

### Opción A: Reemplazar página actual (Recomendado)

Abre tu terminal y ejecuta:

```bash
# Respaldar página actual
mv app/page.tsx app/page_old_nextjs.tsx

# Activar nueva landing
mv app/page_new.tsx app/page.tsx
```

### Opción B: Previsualizar primero

1. Ve a: `http://localhost:3000` (verás la página antigua de Next.js)
2. Para ver la nueva landing, temporalmente edita `app/page.tsx` e importa desde `page_new.tsx`

## 🎨 Paso 2: Personalizar Contenido

### 1. Cambiar Nombre del Proyecto

**Actualmente dice**: "NUEVO_NOMBRE_AQUI"

**Ubicaciones a cambiar**:

**Footer.tsx** (línea 49):

```typescript
<h3 className="text-2xl font-bold text-white">
  Land<span className="text-teal-400">View</span>
</h3>
```

**Navbar.tsx** (línea 42):

```typescript
<h1 className="text-2xl font-bold">
  Land<span className="text-teal-500">View</span>
</h1>
```

**Sugerencias de nombres**:

- TerraView
- VallartaVR
- PropView360
- CasaVirtual
- TourVallarta

### 2. Cambiar Textos Principales

**HeroSection.tsx**:

- Línea 21: Título principal
- Línea 28: Subtítulo descriptivo
- Línea 42: Texto de prueba social

**ProblemSolutionSection.tsx**:

- Líneas 4-28: Los 3 beneficios principales
- Puedes cambiar íconos importando otros de `lucide-react`

**TestimonialSection.tsx**:

- Línea 56: Cita del testimonio
- Línea 66: Nombre y empresa del cliente
- Líneas 77-81: Estadísticas (40%, 250+, 15K+)

### 3. Actualizar Links

**Actualmente los botones apuntan a rutas placeholder**:

**HeroSection.tsx**:

```typescript
// Línea 35
href = '/propiedades'; // ← Cambiar a ruta real

// Línea 42
href = '/publicar'; // ← Cambiar a ruta real
```

**FinalCTASection.tsx**:

```typescript
// Línea 26
href = '/signup'; // ← Cambiar a tu página de registro
```

**Para integrar con tu sistema actual**:

```typescript
// Si quieres que "Explorar Propiedades" vaya al dashboard
href = '/dashboard';

// Si quieres que "Publicar" vaya a agregar terreno
href = '/dashboard/add-terrain';
```

## 🖼️ Paso 3: Agregar Imágenes Reales

### Hero Background

1. Coloca una imagen panorámica de alta calidad en `public/hero-background.jpg`
2. Recomendación: 1920x1080px mínimo, formato JPEG optimizado

**Fuentes sugeridas**:

- Foto de una propiedad premium en Vallarta
- Vista aérea de la bahía
- Interior de lujo con vista al mar

### Social Proof Logos

Reemplaza los placeholders en `SocialProofSection.tsx`:

```typescript
// Línea 19-25: Cambia los placeholders por:
<img
  src="/logos/partner1.svg"
  alt="Partner Name"
  className="h-12 w-auto"
/>
```

### Product Tour Visuals

En `ProductTourSection.tsx`, reemplaza los placeholders (líneas 28, 74, 120) con:

**Opción 1**: Screenshots de tu app

```typescript
<img
  src="/screenshots/editor.png"
  alt="Editor de Tours"
  className="rounded-2xl shadow-xl"
/>
```

**Opción 2**: GIFs animados (mejor)

```typescript
<img
  src="/gifs/editor-demo.gif"
  alt="Demo del Editor"
  className="rounded-2xl shadow-xl"
/>
```

## 🎨 Paso 4: Ajustar Colores de Marca

Si quieres usar colores diferentes a teal:

### Método 1: Buscar y Reemplazar

1. Abre VS Code
2. Buscar (Ctrl+Shift+F): `teal-`
3. Reemplazar por: `blue-` (o el color que prefieras)

**Colores de Tailwind disponibles**:

- `blue` (azul corporativo)
- `indigo` (azul-violeta)
- `purple` (morado)
- `emerald` (verde esmeralda)
- `cyan` (cyan/turquesa)
- `sky` (azul cielo)

### Método 2: Personalizar en Tailwind Config

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          // ... define tus colores
          500: '#14b8a6', // Color principal
          600: '#0d9488', // Hover
        },
      },
    },
  },
};
```

Luego cambia `teal-500` por `brand-500`.

## 🔧 Paso 5: Agregar Navbar (Opcional)

Si quieres tener navegación sticky en toda la app:

1. Edita `app/layout.tsx`:

```typescript
import Navbar from '@/components/layout/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={geistSans.variable}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

2. El Navbar tiene:
   - Logo sticky
   - Links de navegación
   - Botón de login/signup
   - Menú hamburguesa en móvil
   - Cambia de transparente a blanco al hacer scroll

## 📱 Paso 6: Probar en Móvil

1. Abre Chrome DevTools (F12)
2. Clic en el ícono de dispositivo móvil
3. Prueba en:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1440px)

**Verifica**:

- ✅ Textos legibles
- ✅ Botones presionables (mínimo 44px de altura)
- ✅ Imágenes no distorsionadas
- ✅ Espaciados apropiados

## 🚀 Paso 7: Optimizar para Producción

### 1. Agregar Metadata SEO

En `app/page.tsx`, agrega al inicio:

```typescript
export const metadata = {
  title: 'TuNombre - Tours Virtuales 360° en Puerto Vallarta',
  description:
    'Explora propiedades con recorridos virtuales inmersivos. La plataforma inmobiliaria más avanzada de la bahía.',
  keywords:
    'tours virtuales, inmobiliaria puerto vallarta, casas en venta, 360',
  openGraph: {
    title: 'TuNombre - Tours Virtuales Inmobiliarios',
    description: 'Tours 360° interactivos para vender más rápido',
    images: ['/og-image.jpg'],
    url: 'https://tudominio.com',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
};
```

### 2. Crear Open Graph Image

- Dimensiones: 1200x630px
- Guardar en: `public/og-image.jpg`
- Incluye: Logo + texto descriptivo

### 3. Agregar Favicon

```bash
# Coloca tus favicons en public/
public/
├── favicon.ico
├── apple-touch-icon.png
└── favicon-32x32.png
```

## 🎯 Checklist Final

Antes de lanzar, verifica:

- [ ] Cambié el nombre "LandView" por mi marca
- [ ] Actualicé todos los textos con mi copy
- [ ] Agregué imagen de hero background
- [ ] Reemplacé logos de partners (o quité la sección)
- [ ] Actualicé los links de navegación
- [ ] Agregué metadata SEO
- [ ] Probé en móvil y desktop
- [ ] Verifiqué que todos los botones funcionen
- [ ] Optimicé imágenes (< 500KB cada una)
- [ ] Agregué favicon

## 💡 Próximos Pasos Sugeridos

### Corto Plazo (Esta semana)

1. ✅ Activar landing page
2. 🖼️ Agregar imágenes reales
3. ✍️ Personalizar textos
4. 🔗 Conectar links al dashboard

### Mediano Plazo (Este mes)

5. 📧 Agregar formulario de contacto
6. 📊 Instalar Google Analytics
7. 🎥 Crear video demo del producto
8. 📱 Agregar botón de WhatsApp flotante

### Largo Plazo (Próximos meses)

9. 🏘️ Crear página de galería de propiedades
10. 📝 Agregar sección de blog
11. 🌐 Agregar soporte multiidioma (inglés)
12. 💳 Integrar sistema de pagos

## 🆘 ¿Necesitas Ayuda?

**Errores comunes**:

**1. "lucide-react not found"**

```bash
npm install lucide-react
```

**2. "Tailwind classes not working"**

```bash
# Reinicia el servidor
Ctrl+C
npm run dev
```

**3. "Componentes no se ven"**

- Verifica que `page_new.tsx` se haya renombrado a `page.tsx`
- Asegúrate de estar en `http://localhost:3000` (no en `/dashboard`)

## 📞 Contacto

Si tienes dudas durante la implementación, puedes:

1. Revisar `LANDING_PAGE_README.md` (documentación técnica completa)
2. Consultar los comentarios en cada componente
3. Preguntar a Claude Code para ajustes específicos

---

**¡Listo para lanzar! 🚀**

Tu landing page ya está lista para impresionar a tus clientes. Solo personaliza el contenido y estarás en línea.
