# Testing Checklist - LandView App CMS

Este documento contiene las pruebas esenciales para verificar que todo funciona correctamente.

## Pruebas Rápidas (5 minutos)

### 1. Editor de Hotspots

```
✓ Abre un terreno en el editor
✓ Verifica que los hotspots aparecen en Vista 1 inmediatamente
✓ Crea un nuevo hotspot a vista existente
✓ Haz clic en el hotspot → Debe navegar
✓ Presiona "Guardar Cambios" → Debe mostrar confirmación
```

### 2. Auto-Guardado

```
✓ Clic en "Nuevo Hotspot"
✓ Marca "Crear nueva vista (subir imagen 360°)"
✓ Selecciona imagen
✓ Escribe título
✓ Clic en "Crear Hotspot"
✓ Observa: "⏳ Subiendo imagen..." → "💾 Guardando automáticamente..."
✓ Sale del editor SIN hacer clic en "Guardar Cambios"
✓ Regresa al editor → El hotspot debe estar ahí
```

### 3. Eliminar Vista

```
✓ Identifica una vista duplicada o de prueba
✓ Haz clic en la cruz roja (✕) del botón de vista
✓ Lee la advertencia (hotspots afectados)
✓ Confirma la eliminación
✓ Verifica que la vista desapareció
✓ (Opcional) Revisa Supabase Storage → El archivo debe haber sido eliminado
```

## Pruebas Completas (15 minutos)

### Flujo Completo: Crear Recorrido Virtual

#### Paso 1: Crear Terreno

- [ ] Dashboard → "Nuevo Terreno"
- [ ] Completa el formulario
- [ ] Sube primera imagen 360°
- [ ] Guarda → Debe aparecer en dashboard

#### Paso 2: Agregar Vistas Adicionales

- [ ] Entra al editor del terreno
- [ ] Crea hotspot con nueva imagen en 3-4 posiciones
- [ ] Verifica auto-guardado en cada una

#### Paso 3: Conectar Vistas

- [ ] En cada vista, crea hotspots a otras vistas
- [ ] Navega haciendo clic en los hotspots
- [ ] Verifica que el recorrido tenga sentido espacialmente

#### Paso 4: Verificar en Visor Público

- [ ] Dashboard → "Ver Recorrido"
- [ ] Navega por todos los hotspots
- [ ] **Verificar transiciones suaves**: Al hacer clic en hotspot, los marcadores deben desaparecer ANTES de que cargue la nueva imagen
- [ ] **Verificar fade-in**: Después de cargar imagen, hotspots deben aparecer suavemente (fade in + escala)
- [ ] Verifica que los nombres sean claros
- [ ] Prueba el panel de información (ℹ️)

#### Paso 5: Mantenimiento

- [ ] Regresa al editor
- [ ] Elimina un hotspot redundante
- [ ] Guarda cambios
- [ ] Verifica en visor público que se eliminó

## Verificación de Consola (Desarrollo)

Al abrir el editor, debes ver EXACTAMENTE:

```
📥 Cargando hotspots iniciales: X       ← Cantidad correcta
🎬 Inicializando viewer por primera vez ← SOLO UNA VEZ
HotspotEditor: Viewer listo
✨ Viewer listo y hotspots disponibles, renderizando marcadores
📍 Actualizando X marcadores en Vista 1
```

### ❌ Señales de Problemas

**Si ves esto, algo está MAL:**

```
🎬 Inicializando viewer por primera vez
🎬 Inicializando viewer por primera vez  ← ¡DUPLICADO! Problema grave
🎬 Inicializando viewer por primera vez
```

→ **Solución**: Revisa que el useEffect de inicialización tenga deps `[]`

**Si ves esto:**

```
📥 Cargando hotspots iniciales: 3
📥 Cargando hotspots iniciales: 3  ← ¡DUPLICADO! Problema de sync
📥 Cargando hotspots iniciales: 3
```

→ **Solución**: Revisa la lógica de sincronización de hotspots

## Pruebas de Transiciones Suaves (Visor Público)

### Comportamiento Esperado (Estilo Google Street View)

**Secuencia correcta al navegar entre hotspots:**

1. Usuario hace clic en hotspot
2. ✅ Hotspots actuales desaparecen INMEDIATAMENTE
3. ✅ La vista hace ZOOM-IN hacia adelante (600ms) + **Nueva imagen empieza a cargar en paralelo**
4. ✅ Cuando la imagen está lista, inicia el CROSSFADE (800ms)
5. ✅ NO debe aparecer animación de "Cargando..." ni pausas largas
6. ✅ Hotspots aparecen rápidamente después (300ms)
7. ✅ **NO debe haber espera entre zoom y crossfade** (la imagen carga durante el zoom)

### Verificación Visual

```
✓ NO deben verse hotspots "flotando" en posiciones incorrectas
✓ Debe haber efecto de ZOOM-IN hacia adelante al hacer clic
✓ NO debe haber PAUSA/ESPERA después del zoom (imagen carga durante zoom)
✓ El crossfade debe iniciar inmediatamente o poco después del zoom
✓ NO debe aparecer spinner de "Cargando..." entre transiciones
✓ Transición debe sentirse FLUIDA sin pausas largas (5-6 segundos)
✓ Hotspots deben aparecer con transición suave (no instantáneo)
✓ La secuencia debe ser fluida como Google Street View
```

### Prueba Manual

1. [ ] Abre un terreno con múltiples vistas en visor público
2. [ ] Haz clic en un hotspot
3. [ ] Observa: ¿Los hotspots desaparecen instantáneamente?
4. [ ] Observa: ¿La vista hace ZOOM hacia adelante?
5. [ ] **CRÍTICO**: ¿Hay PAUSA después del zoom? (debe ser mínima o ninguna)
6. [ ] Observa: ¿El crossfade inicia durante o inmediatamente después del zoom?
7. [ ] Observa: ¿NO aparece animación de "Cargando..." durante la transición?
8. [ ] Observa: ¿Los nuevos hotspots aparecen con fade-in suave?
9. [ ] Repite con 3-4 navegaciones diferentes para verificar consistencia

### Comparación con Google Street View

**Similitud esperada:**

- Hotspots desaparecen → Zoom-in + (imagen carga en paralelo) → Crossfade inicia cuando imagen lista → Hotspots aparecen
- Sin spinners ni animaciones de carga
- **Sin pausas/esperas entre zoom y crossfade**
- Efecto de "movimiento hacia adelante" fluido

### ❌ Señales de Problemas

**Si ves esto, hay un problema:**

- Hotspots aparecen en posiciones incorrectas antes de que cambie la imagen
- NO hay efecto de zoom hacia adelante
- **⚠️ CRÍTICO: Hay pausa de 5-6 segundos después del zoom** (imagen debe cargar DURANTE zoom, no después)
- Aparece spinner de "Cargando..." durante transición (debe estar oculto)
- Cambio brusco de imagen sin crossfade/disolución
- Hotspots aparecen instantáneamente sin transición
- Los hotspots no desaparecen al hacer clic

**Solución**: Revisa `PhotoSphereViewer.js`:

- Verifica que `markersVisible` se establece en `false` antes de `setPanorama`
- Verifica que existe `viewer.animate({ zoom: currentZoom + 15, speed: 600 })` (speed debe ser número, no string)
- **CRÍTICO**: `viewer.setPanorama()` debe llamarse INMEDIATAMENTE después del zoom (SIN setTimeout)
- Esto permite que la imagen cargue en paralelo con el zoom, eliminando pausas
- Verifica que `transition: 800` está configurado
- Verifica que `showLoader: false` para evitar spinner
- Verifica que NO se llama `setLoading(true)` durante transiciones

## Pruebas de Regresión

Ejecuta estas pruebas después de CUALQUIER cambio en:

- `HotspotEditor.js`
- `page.js` del editor
- `PhotoSphereViewer.js`

### Checklist Rápido

1. [ ] Editor carga sin errores en consola
2. [ ] Hotspots visibles en Vista 1 al entrar
3. [ ] Navegación por click en hotspot funciona
4. [ ] Auto-guardado con nueva imagen funciona
5. [ ] Eliminar vista funciona sin errores
6. [ ] Visor público muestra todo correctamente
7. [ ] Transiciones suaves en visor (estilo Google Street View)

## Comandos Útiles

### Limpiar Caché del Navegador

```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### Ver Logs Filtrados en Consola

```javascript
// Solo logs del editor
console.log → Filtrar por "HotspotEditor"
console.log → Filtrar por "📍" o "🎬"
```

### Verificar Estado en Componente (Dev Tools)

```
React DevTools → HotspotEditor
  → Props: existingHotspots
  → State: hotspots, isViewerReady
```

## Frecuencia de Pruebas Recomendada

- **Antes de cada commit**: Pruebas Rápidas (5 min)
- **Antes de deploy**: Pruebas Completas (15 min)
- **Después de actualizar dependencias**: Todo + Consola
- **Si algo falla en producción**: Reproducir en local con consola abierta

## Contacto de Soporte

Si encuentras algún problema que no está en este documento:

1. Abre la consola del navegador (F12)
2. Captura los logs completos
3. Describe los pasos para reproducir
4. Revisa primero la sección "Common Errors to Avoid" en CLAUDE.md
