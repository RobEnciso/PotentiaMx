# 📱 Mobile-First Editor UX - Especificación de Diseño

## 🎯 Objetivo del Proyecto

Diseñar una experiencia de edición **100% nativa para móviles** que sea superior a la competencia (Kuula). El flujo debe ser intuitivo al tacto y enfocado en las 3 tareas más valiosas que un agente realizaría desde su teléfono.

---

## 📊 Análisis del Problema Actual

### ❌ Problemas del Flujo Desktop Actual:

1. **Modo de Colocación + Click**
   - Requiere click en botón "Agregar Hotspot"
   - Luego click en el panorama
   - **Problema en móvil**: El segundo click puede ser impreciso con dedos
   - **Problema UX**: Requiere 2 pasos separados

2. **Formulario en Sidebar**
   - Panel lateral que ocupa 30% de la pantalla
   - **Problema en móvil**: Reduce visibilidad del panorama
   - **Problema UX**: Formulario largo y abrumador

3. **Arrastrar y Soltar**
   - No funciona bien en touch
   - **Problema técnico**: Eventos touch !== eventos mouse

4. **Múltiples Opciones Simultáneas**
   - Tipo de hotspot, destino, icono, multimedia, etc.
   - **Problema UX**: Demasiadas opciones al mismo tiempo

---

## 🔍 Investigación de Competencia: Kuula.com

### ✅ Lo que Kuula hace bien:

1. **Touch Directo**
   - Tap en panorama = agregar hotspot inmediatamente
   - Sin modo de colocación previo

2. **Formulario Simplificado**
   - Solo pide lo esencial primero
   - Opciones avanzadas en segundo plano

### ❌ Puntos Débiles de Kuula (Oportunidades):

1. **Interfaz Genérica**
   - No se siente nativa en iOS/Android
   - Botones pequeños, difíciles de tocar

2. **Sin Feedback Táctil**
   - No hay vibración al colocar hotspot
   - Sin confirmación visual clara

3. **Navegación Confusa**
   - Demasiados menús anidados
   - Difícil volver atrás

4. **Sin Modo Offline**
   - Requiere conexión constante

---

## 💡 Solución Propuesta: Flujo Mobile-First

### 🎨 Principios de Diseño:

1. **Touch-First**: Toda interacción optimizada para dedos (mínimo 44x44px)
2. **Progressive Disclosure**: Mostrar opciones gradualmente
3. **Feedback Inmediato**: Respuesta visual/táctil instantánea
4. **Modo Pantalla Completa**: Maximizar espacio para panorama
5. **Gestos Nativos**: Usar gestos familiares (tap, long-press, swipe)

---

## 📱 Flujo de Usuario Propuesto

### **Escenario**: Agente en propiedad quiere agregar hotspot "Cocina Renovada"

#### **PASO 1: Entrada al Modo Edición (Optimizado Móvil)**

```
┌─────────────────────────────────┐
│  [Panorama 360° - Pantalla Full]│
│                                 │
│                                 │
│         🏠 Sala                 │
│                                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Flotante (Bottom Bar)   │   │
│  │  [➕ Agregar] [👁️ Ver] │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Cambios vs Desktop**:
- ✅ Bottom bar en lugar de sidebar
- ✅ Solo 2 botones grandes y táctiles
- ✅ Panorama ocupa 90% de pantalla

---

#### **PASO 2: Activar Modo Colocación**

Usuario toca **[➕ Agregar]**

```
┌─────────────────────────────────┐
│  [Panorama con Overlay Semi-    │
│   Transparente + Cruz Central]  │
│                                 │
│          ┼  ← Toca aquí        │
│         para colocar            │
│                                 │
│  ┌─────────────────────────┐   │
│  │ "Toca donde quieres      │   │
│  │  colocar el hotspot"     │   │
│  │  [❌ Cancelar]           │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Innovaciones**:
- ✅ **Overlay semi-transparente** (50% opacidad) guía visualmente
- ✅ **Cruz central** como guía de precisión
- ✅ **Texto instructivo claro** en lenguaje natural
- ✅ **Vibración leve** (haptic feedback) al entrar en modo
- ✅ **Botón cancelar grande** (fácil de alcanzar con pulgar)

---

#### **PASO 3: Usuario Toca el Panorama**

```
┌─────────────────────────────────┐
│  [Panorama con Marcador         │
│   Temporal Pulsante]            │
│                                 │
│         📍 ← Nuevo              │
│            (pulsando)            │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ✨ Hotspot colocado     │   │
│  │                          │   │
│  │  [✅ Configurar]         │   │
│  │  [🔄 Mover]  [❌ Borrar] │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Innovaciones**:
- ✅ **Marcador pulsante** (animación de escala) = confirmación visual
- ✅ **Vibración corta** (200ms) al colocar
- ✅ **3 acciones claras**: Configurar (principal), Mover (secundaria), Borrar
- ✅ **Botón principal destacado** (verde, más grande)

---

#### **PASO 4: Formulario Mobile-First (Pantalla Completa)**

Usuario toca **[✅ Configurar]**

```
┌─────────────────────────────────┐
│ [← Volver]  Nuevo Hotspot  [💾]│
├─────────────────────────────────┤
│                                 │
│  Paso 1 de 2: ¿Qué tipo?       │
│                                 │
│  ┌─────────────────────────┐   │
│  │   🧭 Navegación          │   │
│  │   Ir a otra vista        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │   ℹ️ Información          │   │
│  │   Mostrar texto/fotos    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │   🎥 Video               │   │
│  │   Reproducir video       │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Innovaciones**:
- ✅ **Pantalla completa** (bottom sheet deslizable)
- ✅ **Paso a paso** (2 pasos máximo)
- ✅ **Cards grandes** (mínimo 60px alto) fáciles de tocar
- ✅ **Iconos + Descripción** (auto-explicativo)
- ✅ **Progreso visual** ("Paso 1 de 2")

---

#### **PASO 5: Formulario Específico (Ejemplo: Navegación)**

Usuario selecciona **🧭 Navegación**

```
┌─────────────────────────────────┐
│ [← Volver]  Navegación      [💾]│
├─────────────────────────────────┤
│                                 │
│  Nombre del Hotspot *           │
│  ┌─────────────────────────┐   │
│  │ Cocina Renovada          │   │
│  └─────────────────────────┘   │
│                                 │
│  Va a la vista... *             │
│  ┌─────────────────────────┐   │
│  │ 🏠 Sala         [▼]     │   │
│  │ 🍳 Cocina               │   │
│  │ 🛏️ Recámara             │   │
│  └─────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐  │
│ │   💾 Guardar Hotspot      │  │
│ │   (Botón Grande Verde)    │  │
│ └───────────────────────────┘  │
│                                 │
│  [⚙️ Opciones Avanzadas] ↓     │
│                                 │
└─────────────────────────────────┘
```

**Innovaciones**:
- ✅ **Solo 2 campos requeridos** (nombre + destino)
- ✅ **Selector visual** (thumbnails de vistas)
- ✅ **Opciones avanzadas colapsadas** (no abrumar)
- ✅ **Botón guardar fijo** en bottom (siempre accesible)
- ✅ **Validación en tiempo real** (marca campos vacíos)

---

#### **PASO 6: Confirmación y Vuelta al Editor**

Usuario toca **[💾 Guardar Hotspot]**

```
┌─────────────────────────────────┐
│  [Panorama con Hotspot Nuevo]   │
│                                 │
│         📍 Cocina Renovada      │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ✅ Hotspot guardado     │   │
│  │                          │   │
│  │  Se guardó en la nube ☁️ │   │
│  └─────────────────────────┘   │
│           (Auto-cierra 2s)      │
│                                 │
│  [➕ Agregar Otro] [👁️ Ver]    │
└─────────────────────────────────┘
```

**Innovaciones**:
- ✅ **Toast de confirmación** (auto-cierra en 2s)
- ✅ **Guardado automático** en segundo plano
- ✅ **Vibración de éxito** (patrón de 2 pulsos)
- ✅ **Hotspot visible inmediatamente** en panorama
- ✅ **Sugerencia de siguiente acción** ("Agregar Otro")

---

## 🎨 Componentes de Diseño Clave

### 1. **Bottom Action Bar** (Siempre Visible)

```css
.mobile-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 16px;
  display: flex;
  gap: 12px;
}

.action-button {
  flex: 1;
  height: 56px; /* Mínimo para touch */
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-action {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.secondary-action {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

---

### 2. **Bottom Sheet Modal** (Formularios)

```javascript
// Comportamiento:
// - Deslizar hacia arriba = abrir
// - Deslizar hacia abajo = cerrar
// - Tap fuera = cerrar
// - Animación suave (300ms cubic-bezier)

const BottomSheet = {
  height: '90vh', // Casi pantalla completa
  borderRadius: '20px 20px 0 0',
  background: 'white',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',

  // Indicador de arrastre
  dragHandle: {
    width: '40px',
    height: '4px',
    background: '#e0e0e0',
    borderRadius: '2px',
    margin: '12px auto'
  }
}
```

---

### 3. **Card Selector** (Tipo de Hotspot)

```css
.type-card {
  height: 80px;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  gap: 16px;

  /* Touch feedback */
  active-scale: 0.95;
  transition: all 0.2s ease;
}

.type-card:active {
  transform: scale(0.95);
  border-color: #10b981;
  background: #f0fdf4;
}

.type-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-info {
  flex: 1;
}

.type-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.type-description {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}
```

---

### 4. **Marcador Temporal** (Al colocar hotspot)

```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.temp-marker {
  animation: pulse 1s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.4));
}
```

---

## 📐 Especificaciones Técnicas

### Tamaños Mínimos (Touch Targets):

| Elemento | Tamaño Mínimo | Recomendado |
|----------|---------------|-------------|
| Botón Principal | 44x44px | 56x56px |
| Botón Secundario | 44x44px | 48x48px |
| Campo de Texto | - altura | 48px |
| Card Seleccionable | - altura | 72px |
| Lista Item | - altura | 60px |
| Espacio entre elementos | 8px | 12px |

### Gestos Soportados:

1. **Tap** (Touch simple)
   - Colocar hotspot
   - Seleccionar opción
   - Abrir modal

2. **Long Press** (Touch prolongado 500ms)
   - Editar hotspot existente
   - Ver opciones avanzadas

3. **Swipe Down** (Deslizar hacia abajo)
   - Cerrar modal
   - Volver atrás

4. **Pinch** (Pellizcar)
   - Zoom en panorama (nativo de PhotoSphere)

---

## 🎯 Las 3 Tareas Más Valiosas (Prioridad)

### 1. **Agregar Hotspot de Navegación** ⭐⭐⭐
   - **Uso**: 80% de los hotspots
   - **Complejidad**: Baja
   - **Tiempo objetivo**: <30 segundos

### 2. **Agregar Hotspot Informativo (texto/foto)** ⭐⭐
   - **Uso**: 15% de los hotspots
   - **Complejidad**: Media
   - **Tiempo objetivo**: <45 segundos

### 3. **Renombrar Vista** ⭐
   - **Uso**: 1 vez por tour
   - **Complejidad**: Muy baja
   - **Tiempo objetivo**: <15 segundos

---

## 🚀 Próximos Pasos (Implementación)

### Fase 1: Detección y Adaptación Móvil
- [ ] Detectar dispositivo móvil (user agent + screen width)
- [ ] Renderizar interfaz móvil alternativa
- [ ] Implementar bottom action bar

### Fase 2: Flujo de Colocación Touch
- [ ] Implementar overlay de colocación
- [ ] Añadir cruz de guía central
- [ ] Agregar feedback táctil (vibración)
- [ ] Marcador temporal con animación pulse

### Fase 3: Bottom Sheet Formulario
- [ ] Crear componente BottomSheet reutilizable
- [ ] Implementar selector de tipo (cards grandes)
- [ ] Formulario específico por tipo
- [ ] Validación en tiempo real

### Fase 4: Refinamiento UX
- [ ] Animaciones suaves (300ms)
- [ ] Toast de confirmación
- [ ] Gestos de swipe para cerrar
- [ ] Testing en dispositivos reales

---

## 📱 Prototipo Figma (Entregable)

### Pantallas a Diseñar:

1. **Vista Principal** (Editor móvil con bottom bar)
2. **Modo Colocación** (Overlay + instrucciones)
3. **Confirmación Colocación** (Marcador + acciones)
4. **Selector de Tipo** (Bottom sheet con cards)
5. **Formulario Navegación** (Campos + guardar)
6. **Formulario Info** (Texto + fotos)
7. **Confirmación Guardado** (Toast)

### Interacciones a Prototipar:

- Tap en "Agregar" → Modo colocación
- Tap en panorama → Marcador aparece
- Tap en "Configurar" → Bottom sheet sube
- Tap en tipo → Formulario específico
- Tap en "Guardar" → Toast + volver

---

## ✅ Criterios de Éxito

### Métricas Cuantitativas:

- ⏱️ **Tiempo para agregar hotspot**: <30s (vs 60s desktop)
- 👆 **Taps requeridos**: <5 (vs 8+ desktop)
- ❌ **Tasa de error**: <5% (vs 20% arrastrar y soltar)
- 📏 **Precisión de colocación**: <10px de error

### Métricas Cualitativas:

- ✅ Se siente nativo iOS/Android
- ✅ Más intuitivo que Kuula
- ✅ No requiere tutorial
- ✅ Funciona con una mano (pulgar)

---

## 🎨 Inspiración Visual

### Referencias de Diseño:

1. **Instagram Stories** - Bottom toolbar + fullscreen
2. **Google Maps** - Bottom sheet para detalles
3. **Airbnb App** - Cards grandes táctiles
4. **Notion Mobile** - Formularios progresivos

---

## 📝 Notas de Implementación

### Detección de Móvil:

```javascript
const isMobile = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileDevice = /android|iphone|ipad|ipod|mobile/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 768;
  return isMobileDevice || isSmallScreen;
};
```

### Vibración (Haptic Feedback):

```javascript
const vibrate = (pattern) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Ejemplos:
vibrate(200);        // Tap simple
vibrate([100, 50, 100]); // Éxito
vibrate(400);        // Error
```

---

**Documento creado**: 2025-01-XX
**Última actualización**: 2025-01-XX
**Autor**: Claude + Equipo PotentiaMX
**Estado**: ✅ Listo para revisión e implementación
