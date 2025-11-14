# 🏡 Landing Page - LandView

Landing page profesional y minimalista para la plataforma inmobiliaria LandView, diseñada con Next.js 15, TypeScript y Tailwind CSS.

## 📦 Componentes Creados

### Estructura de Archivos

```
components/
├── landing/
│   ├── HeroSection.tsx
│   ├── SocialProofSection.tsx
│   ├── ProblemSolutionSection.tsx
│   ├── ProductTourSection.tsx
│   ├── TestimonialSection.tsx
│   └── FinalCTASection.tsx
└── layout/
    ├── Navbar.tsx
    └── Footer.tsx

app/
└── page_new.tsx (nueva landing page)
```

## 🚀 Activación de la Nueva Landing Page

### Opción 1: Reemplazar la página actual (Recomendado)

```bash
# Respaldar la página actual
mv app/page.tsx app/page_old.tsx

# Activar la nueva landing
mv app/page_new.tsx app/page.tsx
```

### Opción 2: Agregar Navbar (Opcional)

Si quieres tener navegación persistente en toda la app, agrega el Navbar al layout:

```typescript
// app/layout.tsx
import Navbar from '@/components/layout/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

## 🎨 Personalización

### 1. Colores de Marca

Los colores principales están definidos en Tailwind. Para cambiarlos:

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        // Cambia 'teal' por tu color de marca
        primary: colors.teal,
      },
    },
  },
};
```

Luego reemplaza `teal-500`, `teal-600`, etc. por `primary-500`, `primary-600`.

### 2. Contenido de Texto

Cada componente tiene su contenido hardcoded. Para cambiarlo:

**HeroSection.tsx:**

- Línea 21-26: Título principal
- Línea 28-31: Subtítulo
- Línea 38 y 45: Textos de botones

**TestimonialSection.tsx:**

- Línea 56-62: Testimonio del cliente
- Línea 66-70: Nombre y empresa

### 3. Imágenes y Logos

**Placeholder del Hero:**

```typescript
// components/landing/HeroSection.tsx
// Línea 8: Reemplaza con tu imagen
bg - [url('/hero-background.jpg')];
```

**Logos de Partners:**

```typescript
// components/landing/SocialProofSection.tsx
// Línea 19-25: Reemplaza con tus logos reales
```

### 4. Links de Navegación

Actualiza los enlaces en:

```typescript
// components/landing/HeroSection.tsx
href = '/propiedades'; // Línea 35
href = '/publicar'; // Línea 42

// components/landing/FinalCTASection.tsx
href = '/signup'; // Línea 26
```

## 📱 Características Implementadas

✅ **Diseño Responsive**

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

✅ **Animaciones Sutiles**

- Hover effects en botones
- Transiciones suaves (300ms)
- Transform scale en CTAs
- Fade-in de elementos

✅ **Accesibilidad**

- Textos con contraste adecuado
- Botones con estados hover/focus
- Semantic HTML (section, nav, footer)
- ARIA labels en iconos

✅ **SEO Ready**

- Estructura semántica
- Headings jerárquicos (H1, H2, H3)
- Meta tags (agregar en layout.tsx)

## 🎯 Próximas Mejoras Sugeridas

### Prioridad Alta 🔴

1. **Agregar Imágenes Reales**
   - Hero background de alta calidad
   - Screenshots del editor
   - Logos de partners
   - Fotos de propiedades

2. **Metadata SEO**

   ```typescript
   // app/page.tsx
   export const metadata = {
     title: 'LandView - Tours Virtuales 360° | Puerto Vallarta',
     description: 'Plataforma inmobiliaria con tours virtuales 360° y SEO...',
     openGraph: {
       images: ['/og-image.jpg'],
     },
   };
   ```

3. **Optimización de Imágenes**
   - Usar Next.js `<Image>` component
   - Agregar blur placeholders
   - Lazy loading automático

### Prioridad Media 🟡

4. **Animaciones con Framer Motion**

   ```bash
   npm install framer-motion
   ```

   - Scroll-triggered animations
   - Parallax effects sutiles
   - Stagger animations en listas

5. **Dark Mode (Opcional)**
   - Usar Tailwind dark: variants
   - Toggle de tema persistente
   - Respeta preferencias del sistema

6. **Formulario de Contacto**
   - Crear `ContactFormSection.tsx`
   - Integrar con Resend o SendGrid
   - Validación con Zod

### Prioridad Baja 🟢

7. **Analytics**
   - Google Analytics 4
   - Hotjar para heatmaps
   - Track conversions en CTAs

8. **Internacionalización (i18n)**

   ```bash
   npm install next-intl
   ```

   - Soporte para inglés/español
   - URLs localizadas

9. **Blog Section**
   - MDX para contenido
   - Artículos sobre inmobiliaria
   - Mejora SEO orgánico

## 🎨 Guía de Estilo Visual

### Tipografía

- **Headlines**: `font-bold` (700)
- **Subheadings**: `font-semibold` (600)
- **Body**: `font-medium` (500) o `font-normal` (400)

### Espaciado

- **Section padding**: `py-20 sm:py-28`
- **Container max-width**: `max-w-7xl mx-auto`
- **Gaps internos**: `gap-8 lg:gap-12`

### Colores (Tailwind)

- **Primary**: `teal-500` (#14b8a6)
- **Background**: `white` / `slate-50`
- **Text**: `slate-900` / `slate-700` / `slate-600`
- **Borders**: `slate-200`

### Sombras

- **Cards**: `shadow-xl`
- **Hover**: `hover:shadow-2xl`

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview production
npm start

# Linting
npm run lint

# Format
npm run format
```

## 📊 Checklist de Lanzamiento

- [ ] Reemplazar imágenes placeholder
- [ ] Actualizar todos los textos con copy final
- [ ] Agregar metadata SEO
- [ ] Configurar dominio y SSL
- [ ] Agregar Google Analytics
- [ ] Probar en dispositivos móviles reales
- [ ] Verificar accesibilidad (WAVE, Lighthouse)
- [ ] Optimizar Core Web Vitals
- [ ] Agregar favicon y app icons
- [ ] Configurar Open Graph images

## 💡 Tips de Implementación

### Agregar una Nueva Sección

1. Crear componente en `components/landing/`:

```typescript
export default function NewSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Contenido */}
      </div>
    </section>
  );
}
```

2. Importar en `app/page.tsx`:

```typescript
import NewSection from '@/components/landing/NewSection';
```

3. Agregar en el orden deseado.

### Mantener Consistencia

- Usa los mismos espaciados (`py-20`, `gap-8`)
- Reutiliza clases de botones
- Mantén la paleta de colores
- Usa los mismos breakpoints

## 🐛 Troubleshooting

**Problema**: Iconos de lucide-react no se ven

```bash
npm install lucide-react
```

**Problema**: Tailwind no compila

```bash
# Verificar que tailwind.config.ts tenga:
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
]
```

**Problema**: Errores de TypeScript

```bash
# Regenerar types
npm run build
```

## 📞 Soporte

Para dudas sobre la implementación, revisa:

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

---

**Autor**: Claude Code
**Fecha**: 2025-01-16
**Versión**: 1.0.0
