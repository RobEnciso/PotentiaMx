# 🎯 Lógica Adaptativa por Tipo de Propiedad - Analytics Dashboard

## Descripción General

El dashboard de Analytics ahora es **inteligente** y se adapta automáticamente según el tipo de propiedad (`property_type`) almacenado en la base de datos. Ya no muestra "Cocina" y "Baño" para un terreno vacío.

## Tipos de Propiedad Soportados

```typescript
type PropertyType = 'terreno' | 'casa' | 'departamento';
```

## Configuración Adaptativa (PROPERTY_CONFIG)

### 🏞️ TERRENO

**Perfil del comprador**: Inversionista racional que busca retorno de inversión

#### KPIs Específicos:
- **Nombre**: "Inversionistas Potenciales" (en lugar de "Clientes Muy Interesados")
- **Icono**: 💼 Briefcase (maletín) - más profesional
- **Color**: Amber (dorado) - representa inversión

#### Mapa de Calor:
**Título**: "¿Qué ángulos enamoran más?"
**Descripción**: "Vistas más observadas por tiempo de permanencia"

**Escenas/Vistas**:
1. 🚁 **Vista Aérea (Drone)** - 312 vistas (100%)
   - 💡 *Sugerencia: La vista aérea es tu mayor gancho. Úsala en tus campañas de Instagram Ads.*
2. 🌄 **Vista Panorámica/Horizonte** - 267 vistas (86%)
3. 🏗️ **Plataforma de Construcción** - 198 vistas (63%)
4. 🚪 **Acceso Principal** - 176 vistas (56%)
5. 🏘️ **Colindancias/Vecinos** - 145 vistas (46%)
6. 🛒 **Servicios Cercanos** - 98 vistas (31%)

**Insight clave**: Enfoca el marketing en la vista aérea y el potencial de construcción.

---

### 🏠 CASA

**Perfil del comprador**: Familia buscando hogar emocional

#### KPIs Específicos:
- **Nombre**: "Clientes Muy Interesados"
- **Icono**: 🔥 Flame (fuego) - emoción y urgencia
- **Color**: Naranja - atención y calidez

#### Mapa de Calor:
**Título**: "¿Qué enamora más a tus clientes?"
**Descripción**: "Espacios más visitados y tiempo de permanencia"

**Escenas/Habitaciones**:
1. 👨‍🍳 **Cocina Integral** - 245 vistas (100%)
   - 💡 *Sugerencia: Sube esta foto a tu portada de Facebook.*
2. 🌳 **Jardín Posterior** - 198 vistas (81%)
3. 🛏️ **Recámara Principal** - 187 vistas (76%)
4. 🛋️ **Sala de Estar** - 156 vistas (64%)
5. 🚿 **Baño Principal** - 134 vistas (55%)
6. 🚗 **Estacionamiento** - 89 vistas (36%)

**Insight clave**: La cocina es el corazón de la casa, destácala en redes sociales.

---

### 🏢 DEPARTAMENTO

**Perfil del comprador**: Familia joven o pareja que busca practicidad y ubicación

#### KPIs Específicos:
- **Nombre**: "Familias Interesadas"
- **Icono**: 👨‍👩‍👧 Users (familias) - enfoque en grupo familiar
- **Color**: Indigo - moderno y urbano

#### Mapa de Calor:
**Título**: "¿Qué espacios destacan más?"
**Descripción**: "Áreas más atractivas para tus compradores"

**Escenas/Áreas**:
1. 🌆 **Vista desde el Balcón** - 289 vistas (100%)
   - 💡 *Sugerencia: La vista desde el balcón vende. Destácala en MercadoLibre.*
2. 🍽️ **Cocina Moderna** - 234 vistas (81%)
3. 🛏️ **Recámara Principal** - 201 vistas (70%)
4. 🚿 **Baño Completo** - 178 vistas (62%)
5. 🪑 **Sala-Comedor** - 156 vistas (54%)
6. 🏊 **Amenidades del Edificio** - 123 vistas (43%)

**Insight clave**: La vista y las amenidades son factores decisivos para departamentos.

---

## Cómo Funciona la Detección

### 1. Lectura desde Base de Datos

```typescript
const { data, error } = await supabase
  .from('terrenos')
  .select('*')
  .eq('slug', slug)
  .single();

setTerrain(data);
```

### 2. Extracción del Tipo

```typescript
const propertyType: PropertyType = terrain?.property_type || 'terreno';
```

**Fallback**: Si no hay `property_type` en la base de datos, por defecto usa `'terreno'`.

### 3. Selección de Configuración

```typescript
const config = PROPERTY_CONFIG[propertyType];
```

Esto carga automáticamente:
- Los textos correctos
- Los iconos apropiados
- Los datos de escenas/habitaciones
- Los insights personalizados

### 4. Renderizado Dinámico

```tsx
<KPICard
  icon={<config.hotLeadsIcon className={cn('w-6 h-6', config.hotLeadsIconColor)} />}
  label={config.hotLeadsLabel}
  // ... resto de props
/>
```

---

## Badge de Tipo de Propiedad

En el header se muestra un badge que indica el tipo:

```tsx
<span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
  {propertyTypeLabel} {/* "Terreno" | "Casa" | "Departamento" */}
</span>
```

---

## Comparativa Visual

### ANTES (Generic)
```
❌ KPI: "Clientes Muy Interesados" 🔥 (para terreno)
❌ Mapa: "Cocina", "Baño", "Jardín" (para lote vacío)
❌ Insight: "Sube esta foto a Facebook" (no específico)
```

### DESPUÉS (Adaptive)

#### Para TERRENO:
```
✅ KPI: "Inversionistas Potenciales" 💼
✅ Mapa: "Vista Aérea", "Plataforma de Construcción", "Acceso Principal"
✅ Insight: "La vista aérea es tu mayor gancho. Úsala en Instagram Ads"
```

#### Para CASA:
```
✅ KPI: "Clientes Muy Interesados" 🔥
✅ Mapa: "Cocina Integral", "Jardín Posterior", "Recámara Principal"
✅ Insight: "Sube esta foto a tu portada de Facebook"
```

#### Para DEPARTAMENTO:
```
✅ KPI: "Familias Interesadas" 👨‍👩‍👧
✅ Mapa: "Vista desde el Balcón", "Cocina Moderna", "Amenidades del Edificio"
✅ Insight: "La vista desde el balcón vende. Destácala en MercadoLibre"
```

---

## Agregar Nuevos Tipos de Propiedad

Si en el futuro quieres agregar "bodega", "local_comercial", etc:

### 1. Actualizar el type

```typescript
type PropertyType = 'terreno' | 'casa' | 'departamento' | 'local_comercial';
```

### 2. Agregar configuración

```typescript
const PROPERTY_CONFIG = {
  // ... existentes
  local_comercial: {
    hotLeadsLabel: 'Empresarios Interesados',
    hotLeadsIcon: Store,
    hotLeadsColor: 'bg-teal-50',
    hotLeadsIconColor: 'text-teal-600',
    heatmapTitle: '¿Qué áreas generan más interés?',
    heatmapDescription: 'Zonas clave para tu negocio',
    topInsight: '💡 Sugerencia: El frente del local es crucial. Enfatiza la visibilidad.',
    scenes: [
      { name: 'Fachada Principal', views: 280, percentage: 100 },
      { name: 'Área de Ventas', views: 220, percentage: 79 },
      { name: 'Bodega/Almacén', views: 165, percentage: 59 },
      { name: 'Baño de Empleados', views: 98, percentage: 35 },
      { name: 'Estacionamiento Clientes', views: 145, percentage: 52 },
      { name: 'Oficina Administrativa', views: 110, percentage: 39 },
    ],
  },
};
```

### 3. Actualizar el label español

```typescript
const propertyTypeLabel = {
  terreno: 'Terreno',
  casa: 'Casa',
  departamento: 'Departamento',
  local_comercial: 'Local Comercial',
}[propertyType];
```

¡Listo! El sistema se adapta automáticamente.

---

## Beneficios de Esta Arquitectura

### 1. **Escalable**
- Fácil agregar nuevos tipos de propiedad
- Configuración centralizada en un solo lugar

### 2. **Mantenible**
- Todo el contenido adaptativo en `PROPERTY_CONFIG`
- Un solo componente sirve para todos los tipos

### 3. **User-Friendly**
- El agente inmobiliario ve datos relevantes a SU producto
- Insights específicos que realmente ayudan a vender

### 4. **DRY (Don't Repeat Yourself)**
- No necesitas crear 3 páginas diferentes
- Un solo código, múltiples experiencias

---

## Testing

### Ver como TERRENO:
1. Ve al dashboard
2. Haz clic en Analytics de cualquier propiedad con `property_type: 'terreno'`
3. Verás: Vista Aérea, Plataforma de Construcción, etc.

### Ver como CASA:
1. Cambia en Supabase el `property_type` de un terreno a `'casa'`
2. Recarga la página de Analytics
3. Verás: Cocina, Jardín, Recámaras, etc.

### Ver como DEPARTAMENTO:
1. Cambia en Supabase el `property_type` a `'departamento'`
2. Recarga la página de Analytics
3. Verás: Vista desde el Balcón, Amenidades, etc.

---

## Código Clave

**Ubicación**: `app/dashboard/analytics/[slug]/page.tsx`

**Líneas importantes**:
- **31-96**: Configuración `PROPERTY_CONFIG`
- **271**: Extracción del tipo desde base de datos
- **272**: Selección de config adaptativa
- **394-404**: KPI adaptativo (icon y label dinámicos)
- **473-481**: Título y descripción adaptativos del mapa de calor
- **493-532**: Renderizado de escenas/habitaciones según tipo

---

**Desarrollado con ❤️ y lógica adaptativa**
