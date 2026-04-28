# Mejoras Pendientes - LandView App CMS

## Prioridad Media

### 1. Renombrar Vistas en Editor de Hotspots

**Descripción**: Permitir al usuario asignar nombres personalizados a cada vista panorámica (ej: "Entrada", "Sala", "Cocina", "Patio") en lugar de solo "Vista 1, 2, 3...".

**Beneficios**:

- Mayor claridad al editar hotspots
- Navegación más intuitiva
- Mejor organización de tours complejos

**Implementación requerida**:

- Agregar campo `view_names` (array de strings) a tabla `terrenos`
- Agregar input de edición en botones de vista con miniaturas
- Modal/input inline para cambiar nombres
- Persistir en base de datos

**Estado**: Pendiente (agregado 2025-01-16)

---

## Prioridad Baja

### 2. Ajustar Compresión de Imágenes 360°

**Descripción**: Mejorar la calidad de las imágenes comprimidas para evitar pixelación en pantallas 4K al hacer zoom.

**Opciones**:

- Aumentar calidad de 85% a 90-92%
- Aumentar resolución máxima de 4K a 5K o 6K
- Permitir configuración manual por terreno

**Configuración actual**:

- Resolución: 3840px (4K)
- Calidad: 85%
- Formato: WebP
- Tamaño máximo: 2MB

**Estado**: Pendiente (agregado 2025-01-16)

---

## Completadas

### ✅ Sistema de Detección de Cambios sin Guardar

**Descripción**: Implementado sistema completo de advertencias y protección contra pérdida de datos.

**Características**:

- Botón "Guardar" parpadeante cuando hay cambios
- Texto dinámico en botón ("💾 Guardar Cambios ⚠️" vs "✅ Todo Guardado")
- Advertencia al intentar salir sin guardar
- Botones "Volver" en rojo cuando hay cambios
- Navegación libre entre vistas (cambios en memoria)

**Estado**: Completado (2025-01-16)

### ✅ Miniaturas en Botones de Navegación

**Descripción**: Agregadas imágenes en miniatura (80x80px) en cada botón de vista del editor.

**Características**:

- Identificación visual instantánea
- Vista activa destacada con fondo púrpura
- Hover effects
- No requiere cambios en BD

**Estado**: Completado (2025-01-16)
