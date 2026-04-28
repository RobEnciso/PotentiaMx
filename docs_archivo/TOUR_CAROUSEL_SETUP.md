# 🎠 Configuración del Carrusel de Tours

## 📍 Ubicación del Componente
`components/landing/TourCarousel.tsx`

## 🛠️ Cómo Agregar Tus Tours Reales

### Paso 1: Identifica los IDs de tus tours
Ve a tu dashboard y encuentra los IDs de 3 tours que quieras mostrar.
Ejemplo de URL: `https://potentiamx.com/terreno/abc123` → el ID es `abc123`

### Paso 2: Edita el archivo TourCarousel.tsx

Busca esta sección (línea ~11):

```tsx
const tours = [
  {
    id: 'tour-1', // ← REEMPLAZAR con ID real
    title: 'Villa Moderna con Vista al Mar',
    location: 'Puerto Vallarta',
  },
  {
    id: 'tour-2', // ← REEMPLAZAR con ID real
    title: 'Departamento de Lujo en Zona Romántica',
    location: 'Zona Romántica',
  },
  {
    id: 'tour-3', // ← REEMPLAZAR con ID real
    title: 'Casa en la Playa con Alberca',
    location: 'Nuevo Vallarta',
  },
];
```

### Paso 3: Reemplaza con tus datos

Ejemplo:
```tsx
const tours = [
  {
    id: 'cm3s8k9l40000ld0f9z1x2y3z', // ID real de Supabase
    title: 'Villa Paraíso con Alberca',
    location: 'Marina Vallarta',
  },
  {
    id: 'cm3s8k9l40001ld0f9a4b5c6d',
    title: 'Penthouse Vista al Océano',
    location: 'Zona Hotelera',
  },
  {
    id: 'cm3s8k9l40002ld0f9e7f8g9h',
    title: 'Casa Frente al Mar',
    location: 'Conchas Chinas',
  },
];
```

## 🎨 Características del Carrusel

✅ **Diseño Apple-Style:**
- Navegación con botones circulares glassmorphism
- Dots indicators en la parte inferior
- Animaciones suaves (250ms)
- Bordes redondeados (24px)
- Sombras sutiles

✅ **Responsive:**
- Se adapta a mobile, tablet y desktop
- iframe con aspect ratio 16:9
- Controles táctiles en móvil

✅ **Interactivo:**
- Los usuarios pueden navegar el tour 360° dentro del iframe
- Botones prev/next para cambiar de tour
- Contador de tours (1/3, 2/3, 3/3)

## 📊 Obtener IDs de tus Tours

### Opción 1: Desde el Dashboard
1. Ve a `/dashboard`
2. Click en "Editar" en cualquier tour
3. La URL mostrará: `/dashboard/edit-terrain/[ID]`
4. Copia ese ID

### Opción 2: Desde Supabase
1. Ve a tu proyecto Supabase
2. Tabla `terrenos`
3. Copia la columna `id` de los tours que quieras mostrar

### Opción 3: Desde la consola del navegador
```javascript
// En tu dashboard, ejecuta:
console.table(
  Array.from(document.querySelectorAll('[href*="/terreno/"]'))
    .map(a => ({
      title: a.textContent,
      id: a.href.split('/terreno/')[1]
    }))
);
```

## 🔄 Agregar/Quitar Tours

### Agregar más tours (4, 5, etc.):
```tsx
const tours = [
  // ... tours existentes
  {
    id: 'nuevo-tour-id',
    title: 'Nuevo Tour',
    location: 'Ubicación',
  },
];
```

### Reducir a 2 tours:
Simplemente elimina uno de los objetos del array.

## 🎯 Próximos Pasos

1. ✅ Reemplaza los IDs placeholder con tus tours reales
2. ✅ Actualiza títulos y ubicaciones
3. ✅ Prueba la navegación en desktop y mobile
4. ✅ Opcional: Agrega más tours si lo deseas

## 💡 Tips

- **Elige tours diversos:** Diferentes tipos de propiedades para mostrar variedad
- **Prioriza calidad:** Tours con buenas fotos 360° y hotspots bien configurados
- **Actualiza regularmente:** Cambia los tours cada mes para mostrar nuevas propiedades

---

¿Necesitas ayuda? Revisa el código en `components/landing/TourCarousel.tsx`
