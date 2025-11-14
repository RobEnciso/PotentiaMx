# 🌐 Guía de Embedding - LandView

**Fecha**: 17 de Enero, 2025

Esta guía explica cómo incrustar tus tours virtuales 360° en sitios web externos.

---

## 📖 ¿Qué es el Embedding?

El **embedding** (incrustación) permite mostrar tus tours 360° de LandView directamente en tu propio sitio web, sin que tus visitantes tengan que salir de tu página.

---

## 🚀 Cómo Obtener el Código Embed

### Opción 1: Desde tu Dashboard (Recomendado)

1. Inicia sesión en tu dashboard: `https://tu-dominio.com/dashboard`
2. Localiza el tour que quieres compartir
3. Haz clic en el botón **"Embed"** (icono `</>`)
4. Se abrirá un modal con el código embed
5. Haz clic en **"Copiar Código"**
6. Pega el código en tu sitio web

### Opción 2: Manual

Si conoces el ID de tu tour, puedes crear el código manualmente:

```html
<iframe
  src="https://tu-dominio.com/embed/terreno/TU-ID-AQUI"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen
  loading="lazy"
  title="Tour Virtual 360°"
></iframe>
```

**Reemplaza**:

- `https://tu-dominio.com` → Tu dominio de LandView
- `TU-ID-AQUI` → El ID de tu terreno (UUID)

---

## 📐 Opciones de Dimensiones

### 1. Responsive (Recomendado para móviles)

Este código mantiene una proporción 16:9 y se adapta a cualquier pantalla:

```html
<div
  style="position: relative; width: 100%; padding-bottom: 56.25%; overflow: hidden;"
>
  <iframe
    src="https://tu-dominio.com/embed/terreno/TU-ID-AQUI"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allowfullscreen
    loading="lazy"
    title="Tour Virtual 360°"
  ></iframe>
</div>
```

**Ventajas**:

- ✅ Se adapta a pantallas móviles
- ✅ Mantiene proporción 16:9
- ✅ No se deforma en dispositivos pequeños

### 2. Dimensiones Fijas

Para páginas donde necesitas un tamaño específico:

```html
<iframe
  src="https://tu-dominio.com/embed/terreno/TU-ID-AQUI"
  width="1200"
  height="675"
  frameborder="0"
  allowfullscreen
  loading="lazy"
  title="Tour Virtual 360°"
></iframe>
```

### 3. Altura Automática (100%)

Para ocupar toda la altura disponible:

```html
<div style="width: 100%; height: 100vh;">
  <iframe
    src="https://tu-dominio.com/embed/terreno/TU-ID-AQUI"
    style="width: 100%; height: 100%; border: none;"
    allowfullscreen
    loading="lazy"
    title="Tour Virtual 360°"
  ></iframe>
</div>
```

---

## 🎨 Personalización Avanzada

### Cambiar la Altura

Modifica el valor de `height` en el iframe:

```html
height="400"
<!-- Más compacto -->
height="600"
<!-- Altura media (default) -->
height="800"
<!-- Más alto -->
```

### Sin Bordes

Ya incluido por defecto con `frameborder="0"`, pero para asegurar en todos los navegadores:

```html
<iframe src="..." style="border: none;" ...></iframe>
```

### Centrar el Iframe

```html
<div style="text-align: center; margin: 40px 0;">
  <iframe
    src="https://tu-dominio.com/embed/terreno/TU-ID-AQUI"
    width="90%"
    height="600"
    frameborder="0"
    allowfullscreen
    loading="lazy"
    title="Tour Virtual 360°"
  ></iframe>
</div>
```

---

## 🔒 Seguridad y Privacidad

### Tours Públicos vs Privados

- **Tours públicos**: Cualquier persona con el link puede verlos
- **Tours privados** (próximamente): Solo usuarios autorizados

**Por ahora**, todos los tours son públicos una vez embebidos. Si necesitas privacidad, no compartas el link embed.

### Bloquear Dominios (Próximamente)

En planes premium, podrás restringir dónde se puede embeber tu tour:

```
Permitir solo en:
- https://mi-sitio-web.com
- https://www.mi-sitio-web.com
```

---

## 🌍 Dónde Puedes Usar el Embedding

### ✅ Plataformas Compatibles

- **WordPress**: Editor Gutenberg o modo HTML
- **Wix**: Elemento "Embed HTML"
- **Squarespace**: Bloque "Code"
- **Webflow**: Elemento "Embed"
- **Shopify**: Sección HTML personalizada
- **HTML puro**: Simplemente pega el código

### Ejemplo en WordPress

1. Crea o edita una página
2. Agrega un bloque "HTML personalizado"
3. Pega el código embed
4. Publica o actualiza la página

### Ejemplo en Wix

1. En el editor, haz clic en "Agregar" (+)
2. Selecciona "Embed"
3. Elige "Embed HTML"
4. Pega el código iframe
5. Ajusta el tamaño del contenedor
6. Publica tu sitio

---

## 🎯 Mejores Prácticas

### 1. Lazy Loading

Siempre incluye `loading="lazy"` para mejor rendimiento:

```html
<iframe ... loading="lazy"></iframe>
```

Esto evita que el tour cargue hasta que el usuario haga scroll hasta esa sección.

### 2. Título Descriptivo

Ayuda a la accesibilidad (lectores de pantalla) y SEO:

```html
<iframe ... title="Tour Virtual 360° - Casa en Puerto Vallarta"></iframe>
```

### 3. Allowfullscreen

Permite a los usuarios ver el tour en pantalla completa:

```html
<iframe ... allowfullscreen></iframe>
```

### 4. Responsive

Siempre usa el código responsive para móviles:

```html
<div style="position: relative; width: 100%; padding-bottom: 56.25%;">
  <iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    ...
  ></iframe>
</div>
```

---

## 📊 Analytics (Próximamente)

En futuras versiones, podrás ver:

- **Número de vistas** en tu tour embebido
- **Tiempo promedio** de visualización
- **Dominios** donde está embebido
- **Dispositivos** usados (móvil vs desktop)

---

## 🐛 Solución de Problemas

### El tour no se muestra

**Posibles causas**:

1. **ID incorrecto**: Verifica que el ID del tour sea correcto
   - Ve a tu dashboard y copia el código embed desde ahí

2. **Tour sin imágenes**: El tour debe tener al menos una imagen 360°
   - Edita tu tour y sube imágenes

3. **Bloqueado por navegador**: Algunos navegadores bloquean iframes
   - Verifica la consola del navegador (F12)

4. **HTTPS requerido**: Asegúrate de usar `https://` en producción
   - En desarrollo, `http://localhost:3001` funciona

### El tour se ve cortado en móviles

**Solución**: Usa el código responsive (opción 1) en lugar de dimensiones fijas.

### El tour carga muy lento

**Solución**:

1. Asegúrate de usar `loading="lazy"`
2. Optimiza las imágenes 360° (máximo 4000x2000px)
3. Considera subir imágenes comprimidas

### No puedo hacer scroll en mi página

**Causa**: El iframe captura los eventos del mouse.

**Solución**: Agrega un contenedor con `pointer-events: none` al pasar el mouse fuera:

```html
<div class="tour-container">
  <iframe ...></iframe>
</div>

<style>
  .tour-container:hover iframe {
    pointer-events: auto;
  }
  .tour-container iframe {
    pointer-events: none;
  }
</style>
```

---

## 📞 Soporte

Si tienes problemas con el embedding:

1. **Revisa esta guía** primero
2. **Prueba el código** en `https://tu-dominio.com/test-embed.html`
3. **Contacta soporte** si el problema persiste

---

## 🚀 Próximas Funcionalidades

Estamos trabajando en:

- [ ] **Analytics de embeds**: Ver estadísticas de tours embebidos
- [ ] **Dominios permitidos**: Restringir dónde se puede embeber
- [ ] **Personalización**: Ocultar marca de agua en plan premium
- [ ] **Shortcodes**: Códigos cortos para CMS populares
- [ ] **API de embedding**: Control programático avanzado

---

## 📝 Ejemplos Completos

### Ejemplo 1: Landing Page de Propiedad

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Casa en Venta - Puerto Vallarta</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .hero {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 60px 20px;
        text-align: center;
      }
      .tour-section {
        max-width: 1200px;
        margin: 40px auto;
        padding: 0 20px;
      }
      .cta {
        text-align: center;
        padding: 40px 20px;
      }
      .button {
        display: inline-block;
        background: #14b8a6;
        color: white;
        padding: 15px 30px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="hero">
      <h1>Casa Moderna en Puerto Vallarta</h1>
      <p>3 recámaras • 2 baños • Vista al mar</p>
    </div>

    <div class="tour-section">
      <h2>Recorre la Propiedad en 360°</h2>

      <!-- Tour 360° embebido -->
      <div
        style="position: relative; width: 100%; padding-bottom: 56.25%; margin: 30px 0;"
      >
        <iframe
          src="https://tu-dominio.com/embed/terreno/TU-ID-AQUI"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
          allowfullscreen
          loading="lazy"
          title="Tour Virtual 360° - Casa Moderna"
        ></iframe>
      </div>
    </div>

    <div class="cta">
      <a href="tel:+523221234567" class="button">📞 Contactar Agente</a>
    </div>
  </body>
</html>
```

### Ejemplo 2: Blog Post con Tour

```html
<article>
  <h1>Nueva Propiedad Disponible en la Zona Romántica</h1>
  <p>Publicado el 17 de Enero, 2025</p>

  <p>
    Estamos emocionados de presentar esta hermosa propiedad ubicada en el
    corazón de la Zona Romántica de Puerto Vallarta.
  </p>

  <!-- Tour 360° -->
  <div
    style="position: relative; width: 100%; padding-bottom: 56.25%; margin: 30px 0;"
  >
    <iframe
      src="https://tu-dominio.com/embed/terreno/TU-ID-AQUI"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
      allowfullscreen
      loading="lazy"
      title="Tour Virtual 360°"
    ></iframe>
  </div>

  <h2>Características</h2>
  <ul>
    <li>3 recámaras</li>
    <li>2 baños completos</li>
    <li>Terraza con vista panorámica</li>
    <li>A 5 minutos de la playa</li>
  </ul>

  <p><strong>Precio:</strong> $4,500,000 MXN</p>
</article>
```

---

**Última actualización**: 17 de Enero, 2025
**Versión**: 1.0
