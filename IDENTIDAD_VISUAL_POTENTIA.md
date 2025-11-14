# 🎨 Identidad Visual - Potentia MX

**Fecha de Creación**: 17 de Enero, 2025
**Versión**: 1.0
**Proyecto**: Potentia MX - Plataforma SaaS de Tours Virtuales 360°

---

## 📖 Tabla de Contenidos

1. [Naming & Tagline](#naming--tagline)
2. [Tipografía](#tipografía)
3. [Paleta de Colores](#paleta-de-colores)
4. [Logo y Variaciones](#logo-y-variaciones)
5. [Iconografía](#iconografía)
6. [Tono y Voz de Marca](#tono-y-voz-de-marca)
7. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🏷️ Naming & Tagline

### Nombre Principal

```
Potentia
```

### Nombre Completo (Legal/Corporativo)

```
Potentia MX
```

### Dominio

```
potentiamx.com
```

### Taglines

**Principal**:

```
Potencia tu propiedad
```

**Secundario**:

```
Tours virtuales 360° que venden
```

**Descriptivo**:

```
La plataforma mexicana de tours inmersivos
```

---

## ✍️ Tipografía

### Fuente Principal: **Montserrat**

**Familia**: Sans-serif geométrica moderna
**Licencia**: Open Font License (Gratuita)
**Fuente**: Google Fonts

#### Pesos Utilizados:

| Uso                 | Peso                     | Ejemplo                    |
| ------------------- | ------------------------ | -------------------------- |
| **Logo**            | 900 (Black)              | `Potentia MX`              |
| **Títulos H1-H2**   | 800 (ExtraBold)          | Grandes títulos de sección |
| **Títulos H3-H4**   | 700 (Bold)               | Subtítulos, cards          |
| **Navegación**      | 600 (SemiBold)           | Menús, botones principales |
| **Cuerpo de texto** | 400-500 (Regular/Medium) | Párrafos, descripciones    |

#### Implementación en CSS:

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

/* Aplicación Global */
body {
  font-family:
    'Montserrat',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

/* Logo */
.logo {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  letter-spacing: -0.02em;
  font-size: 2rem;
}

/* Títulos */
h1,
h2 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
}

h3,
h4 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}
```

#### Implementación en Tailwind CSS:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        black: 900,
        extrabold: 800,
      },
    },
  },
};
```

#### Características Tipográficas:

- **Letter Spacing en Logo**: `-0.02em` (tight) para impacto visual
- **Line Height en Títulos**: `1.2` (compacto, potente)
- **Line Height en Cuerpo**: `1.6` (legibilidad)

---

## 🎨 Paleta de Colores

### Colores Primarios

#### **Teal** (Color de Marca)

```
Nombre: Teal / Turquesa / Verde-azulado
Uso: Acentos, highlights, "MX" en logo
```

| Variación    | Hex       | Tailwind        | Uso                          |
| ------------ | --------- | --------------- | ---------------------------- |
| **Teal 50**  | `#f0fdfa` | `bg-teal-50`    | Fondos sutiles, hover states |
| **Teal 100** | `#ccfbf1` | `bg-teal-100`   | Fondos de destacados         |
| **Teal 400** | `#2dd4bf` | `text-teal-400` | Links en fondos oscuros      |
| **Teal 500** | `#14b8a6` | `text-teal-500` | **Color principal de marca** |
| **Teal 600** | `#0d9488` | `bg-teal-600`   | Botones hover, interactivos  |
| **Teal 700** | `#0f766e` | `text-teal-700` | Textos sobre fondos claros   |

**Color Hex Principal**: `#14b8a6` (Teal 500)

#### **Slate** (Grises Neutros)

```
Nombre: Slate / Gris neutro
Uso: Textos, fondos, elementos UI
```

| Variación     | Hex       | Tailwind         | Uso                        |
| ------------- | --------- | ---------------- | -------------------------- |
| **Slate 50**  | `#f8fafc` | `bg-slate-50`    | Fondos claros, hover       |
| **Slate 100** | `#f1f5f9` | `bg-slate-100`   | Cards, contenedores        |
| **Slate 400** | `#94a3b8` | `text-slate-400` | Textos secundarios         |
| **Slate 700** | `#334155` | `text-slate-700` | Textos principales         |
| **Slate 800** | `#1e293b` | `bg-slate-800`   | Fondos oscuros             |
| **Slate 900** | `#0f172a` | `bg-slate-900`   | Fondos muy oscuros, código |

### Colores Secundarios

#### **Blue** (Acento Complementario)

```
Uso: CTAs secundarios, badges, estadísticas
```

| Variación    | Hex       | Tailwind        | Uso                 |
| ------------ | --------- | --------------- | ------------------- |
| **Blue 500** | `#3b82f6` | `text-blue-500` | Badges, info        |
| **Blue 600** | `#2563eb` | `bg-blue-600`   | Botones secundarios |

#### **Purple** (Premium/Destacados)

```
Uso: Features premium, llamadas especiales
```

| Variación      | Hex       | Tailwind          | Uso              |
| -------------- | --------- | ----------------- | ---------------- |
| **Purple 500** | `#a855f7` | `text-purple-500` | Premium features |
| **Purple 600** | `#9333ea` | `bg-purple-600`   | Botones premium  |

### Colores de Estado

```
✅ Success (Green): #10b981 (green-500)
⚠️ Warning (Yellow): #f59e0b (yellow-500)
❌ Error (Red): #ef4444 (red-500)
ℹ️ Info (Blue): #3b82f6 (blue-500)
```

---

## 🖼️ Logo y Variaciones

### Logo Principal (Dos Colores)

```jsx
// Versión Completa
<span className="font-black text-3xl tracking-tight">
  Potentia<span className="text-teal-500">MX</span>
</span>
```

**Visualización**:

```
Potentia MX
━━━━━━━━ ━━
Blanco    Teal (#14b8a6)
```

### Logo Secundario (Monocromático)

**Versión Blanca** (sobre fondos oscuros):

```jsx
<span className="font-black text-3xl tracking-tight text-white">
  PotentiaMX
</span>
```

**Versión Oscura** (sobre fondos claros):

```jsx
<span className="font-black text-3xl tracking-tight text-slate-900">
  PotentiaMX
</span>
```

### Logo Compacto (Solo Iniciales)

**Para favicons, avatares, mobile**:

```
PMX
```

```jsx
<span className="font-black text-xl tracking-tighter">
  P<span className="text-teal-500">MX</span>
</span>
```

### Reglas de Uso del Logo

#### ✅ Correcto:

- Usar Montserrat Black (900)
- "Potentia" en blanco/oscuro según fondo
- "MX" siempre en Teal 500 (#14b8a6)
- Mantener letter-spacing tight (-0.02em)
- Tamaños mínimos: 24px desktop, 20px mobile

#### ❌ Incorrecto:

- No cambiar tipografía
- No usar otros colores para "MX"
- No separar "Potentia" y "MX" con espacios
- No distorsionar proporciones
- No usar gradientes (por ahora)
- No agregar sombras excesivas

---

## 🎯 Iconografía

### Sistema de Iconos: **Lucide React**

**Librería**: `lucide-react`
**Estilo**: Outline, stroke weight 2px
**Tamaños estándar**: 16px, 20px, 24px

#### Iconos de Marca (Principales):

| Concepto             | Icono                   | Uso                     |
| -------------------- | ----------------------- | ----------------------- |
| **Vista 360°**       | `Maximize2`             | Tours, panoramas        |
| **Potencia/Energía** | `Zap`, `Sparkles`       | Representar "potenciar" |
| **Inmersión**        | `Eye`, `Scan`           | Visualización           |
| **Propiedades**      | `Home`, `Building2`     | Terrenos, casas         |
| **Navegación**       | `Compass`, `Navigation` | Hotspots, explorar      |
| **Compartir/Embed**  | `Code2`, `Share2`       | Funcionalidad embed     |

#### Colores de Iconos:

```css
/* Iconos primarios */
.icon-primary {
  color: #14b8a6;
} /* teal-500 */

/* Iconos secundarios */
.icon-secondary {
  color: #64748b;
} /* slate-500 */

/* Iconos en fondos oscuros */
.icon-light {
  color: #f0fdfa;
} /* teal-50 */
```

---

## 🗣️ Tono y Voz de Marca

### Personalidad de Marca

```
🔥 Potente      → Inspiramos acción y empoderamiento
💡 Innovadora   → Tecnología de vanguardia
🤝 Profesional  → Confianza para agentes inmobiliarios
🚀 Aspiracional → Impulsamos el éxito de nuestros usuarios
```

### Principios de Comunicación

#### ✅ SÍ somos:

- Directos y claros
- Empoderadores ("Potencia tu...")
- Profesionales pero accesibles
- Orientados a resultados ("que venden", "que convierten")
- Mexicanos con proyección internacional

#### ❌ NO somos:

- Informales o demasiado casuales
- Técnicos sin contexto
- Sobrios o aburridos
- Regionales/localistas (no limitamos a Vallarta)

### Ejemplos de Mensajes:

| Contexto              | ❌ Evitar        | ✅ Usar                                    |
| --------------------- | ---------------- | ------------------------------------------ |
| **CTA Principal**     | "Haz clic aquí"  | "Potencia tu portafolio hoy"               |
| **Feature Highlight** | "Comparte tours" | "Multiplica tu alcance con embedding"      |
| **Onboarding**        | "Bienvenido"     | "Transforma cómo vendes propiedades"       |
| **Error**             | "Error 404"      | "Esta página no existe, exploremos juntos" |

---

## 📐 Ejemplos de Uso

### Ejemplo 1: Header de Dashboard

```jsx
<header className="bg-white border-b border-slate-200 shadow-sm">
  <div className="flex items-center justify-between px-6 py-4">
    <h1 className="text-3xl font-black tracking-tight">
      Potentia<span className="text-teal-500">MX</span>
    </h1>
    <nav className="flex items-center gap-6">
      <Link className="text-slate-700 hover:text-teal-500 font-semibold">
        Mis Tours
      </Link>
      <button className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg">
        Crear Tour
      </button>
    </nav>
  </div>
</header>
```

### Ejemplo 2: Hero Section Landing Page

```jsx
<section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
  <div className="container mx-auto px-6 py-24 text-center">
    <h1 className="text-5xl font-extrabold text-white mb-6">
      <span className="text-teal-400">Potencia</span> tu Propiedad
    </h1>
    <p className="text-xl text-slate-300 mb-10">
      Tours virtuales 360° que venden
    </p>
    <button className="px-10 py-5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg rounded-xl">
      Comenzar Gratis
    </button>
  </div>
</section>
```

### Ejemplo 3: Card de Propiedad

```jsx
<div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
  <div className="relative h-48 bg-slate-200">
    <Image src={imageUrl} fill className="object-cover" />
    <div className="absolute top-3 right-3 px-3 py-1 bg-teal-500 text-white text-sm font-bold rounded-full">
      360°
    </div>
  </div>
  <div className="p-6">
    <h3 className="text-xl font-bold text-slate-900 mb-2">
      Casa Moderna en Zona Romántica
    </h3>
    <p className="text-slate-600">3 habitaciones • Vista al mar</p>
  </div>
</div>
```

### Ejemplo 4: Footer

```jsx
<footer className="bg-slate-900 text-white py-12">
  <div className="container mx-auto px-6">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-black">
        Potentia<span className="text-teal-400">MX</span>
      </h2>
      <p className="text-slate-400">Potencia tu propiedad</p>
    </div>
    <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
      © 2025 Potentia MX. Todos los derechos reservados.
    </div>
  </div>
</footer>
```

---

## 📱 Aplicaciones Responsive

### Breakpoints

```javascript
// Tailwind breakpoints
sm: '640px'; // Mobile landscape
md: '768px'; // Tablet
lg: '1024px'; // Desktop
xl: '1280px'; // Large desktop
```

### Tamaños de Logo por Dispositivo

```css
/* Mobile */
@media (max-width: 640px) {
  .logo {
    font-size: 1.5rem;
  } /* 24px */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .logo {
    font-size: 2rem;
  } /* 32px */
}

/* Desktop */
@media (min-width: 1025px) {
  .logo {
    font-size: 2.5rem;
  } /* 40px */
}
```

---

## 🚀 Próximos Pasos de Identidad

### Fase 1: Implementación Actual ✅

- [x] Definir naming y tagline
- [x] Seleccionar tipografía
- [x] Definir paleta de colores
- [x] Crear logo textual
- [ ] Aplicar en todo el código

### Fase 2: Diseño Avanzado (Q1 2025)

- [ ] Logo gráfico/isotipo (diseñador profesional)
- [ ] Animaciones de marca (loading, transitions)
- [ ] Ilustraciones custom para landing
- [ ] Sistema de gradientes avanzado

### Fase 3: Materiales de Marketing (Q2 2025)

- [ ] Templates de email
- [ ] Social media templates
- [ ] Presentaciones de ventas
- [ ] Brand guidelines completo (PDF)

---

## 📞 Contacto y Actualizaciones

**Documento mantenido por**: Equipo de Producto
**Última revisión**: 17 de Enero, 2025
**Próxima revisión**: Marzo 2025

Para sugerencias de cambios a la identidad visual, contactar a: branding@potentiamx.com

---

**Versión**: 1.0
**Estado**: Activo 🟢
