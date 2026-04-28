# 📊 Centro de Comando de Ventas - Guía de Uso

## Descripción General

La página de Analytics ha sido diseñada como un **Centro de Comando de Ventas** para agentes inmobiliarios, no como un dashboard técnico tradicional. El objetivo es responder a la pregunta: "¿Esta casa gusta o no?" y "¿Qué hago para venderla?".

## Acceso a la Página

Desde el Dashboard principal (`/dashboard`), cada tarjeta de propiedad tiene un botón azul "Analytics" que lleva a:

```
/dashboard/analytics/[slug]
```

Ejemplo: `/dashboard/analytics/casa-en-venta-lomas`

## Características Principales

### 1. KPI Cards (Los Signos Vitales) ✅

Cuatro métricas clave con animación de números que suben:

#### 📍 **Visitas Virtuales** (Icono: Ojo)
- **Qué muestra**: Total de vistas del tour 360°
- **Color**: Azul
- **Tendencia**: ↗ 12% vs semana pasada

#### ⏱️ **Tiempo Promedio de Enamoramiento** (Icono: Reloj)
- **Qué muestra**: Tiempo promedio que pasan en el tour
- **Color**: Púrpura
- **Ejemplo**: "2:34 min"
- **Tendencia**: ↗ 8% vs semana pasada

#### 🔥 **Clientes Muy Interesados** (Icono: Fuego)
- **Qué muestra**: Usuarios que estuvieron >30seg Y vieron >3 habitaciones
- **Color**: Naranja
- **Estado**: 🔒 BLOQUEADO (solo usuarios PRO)
- **Tendencia**: ↘ -5% vs semana pasada

#### 💬 **Intención de Compra** (Icono: WhatsApp)
- **Qué muestra**: Clics en el botón de contacto
- **Color**: Verde esmeralda
- **Tendencia**: ↗ 25% vs semana pasada

### 2. Selector de Rango Temporal ⏰

Tres pestañas simples en la esquina superior derecha:
- **7 días**: Vista semanal
- **30 días**: Vista mensual (por defecto)
- **Todo**: Desde el inicio

### 3. Gráfico de Tendencia de Visitas 📈

- **Tipo**: Area Chart con gradiente verde esmeralda
- **Qué muestra**: Evolución de las visitas día a día
- **Interactividad**: Tooltip al pasar el mouse
- **Diseño**: Suave y moderno, NO parece Excel

### 4. Mapa de Calor de Habitaciones 🗺️

**Estado**: 🔒 BLOQUEADO para usuarios FREE (con blur)

#### Para usuarios PRO:
- **Qué muestra**: Habitaciones ordenadas por popularidad
- **Visualización**: Barras horizontales con gradientes:
  - 1er lugar: Verde esmeralda (100%)
  - 2do lugar: Azul (81%)
  - Resto: Gris (menos populares)

#### Ejemplo de datos:
1. **Cocina Integral** - 245 vistas (100%)
   - 💡 *Sugerencia: Sube esta foto a tu portada de Facebook*
2. **Jardín Posterior** - 198 vistas (81%)
3. **Recámara Principal** - 187 vistas (76%)
4. **Sala de Estar** - 156 vistas (64%)
5. **Baño Principal** - 134 vistas (55%)
6. **Estacionamiento** - 89 vistas (36%)

### 5. Paywall "Upgrade" 🔓

**Para usuarios FREE**, las siguientes secciones están borrosas (blur):
- Clientes Muy Interesados (KPI)
- Mapa de Calor de Habitaciones

**Overlay visual**:
```
🔒 Icono de candado grande
"Inteligencia de Ventas Bloqueada"
"Descubre qué enamora a tus clientes..."
[Botón brillante: "🔓 Desbloquear Inteligencia de Ventas (Upgrade)"]
```

## Diseño Visual

### Colores
- **Fondo**: Gris muy claro (`bg-gray-50`)
- **Tarjetas**: Blanco con sombra suave y bordes redondeados
- **Gradientes**: Verde esmeralda para éxito/dinero
- **Acento**: Naranja para llamadas de atención

### Animaciones
- **Números KPI**: Animación de contador ascendente (1.5 segundos)
- **Gráficos**: Aparición suave con delay escalonado
- **Barras**: Crecimiento animado de izquierda a derecha
- **Botones**: Hover con scale y sombra

### Responsive
- Mobile: KPIs apilados verticalmente (1 columna)
- Tablet: 2 columnas
- Desktop: 4 columnas

## Cambiar entre FREE y PRO

En el archivo `app/dashboard/analytics/[slug]/page.tsx`, línea ~217:

```typescript
// Simulated user plan - Change to true to unlock premium features
const isPro = false; // ← Cambiar a true para ver versión PRO
```

## Stack Técnico Utilizado

### Bibliotecas
```json
{
  "recharts": "^2.x",           // Gráficos hermosos
  "framer-motion": "^11.x",     // Animaciones premium
  "lucide-react": "^0.x",       // Iconos modernos
  "tailwind-merge": "^2.x",     // Merge de clases Tailwind
  "clsx": "^2.x"                // Manejo condicional de clases
}
```

### Componentes Clave
- `KPICard`: Tarjeta animada con contador
- `PaywallOverlay`: Blur con botón de upgrade
- `ResponsiveContainer` (Recharts): Gráficos adaptativos

## Datos Mock vs Datos Reales

**Actualmente usa datos MOCK** generados en la función `generateMockData()`.

### Para conectar con PostHog real:

1. **Importar el hook**:
```typescript
import { useTourAnalytics } from '@/hooks/useTourAnalytics';
```

2. **Reemplazar datos mock** con llamadas a PostHog API:
```typescript
const analytics = useTourAnalytics();
// Usar analytics.trackSceneView(), etc.
```

3. **Configurar PostHog Events**:
- `tour_scene_view` → Alimenta "Visitas Virtuales"
- `tour_scene_time` → Calcula "Tiempo de Enamoramiento"
- `tour_high_interest` → Detecta "Clientes Muy Interesados"
- `tour_contact_click` → Cuenta "Intención de Compra"

## Estado del Loading

Mientras carga los datos:
- **KPI Cards**: Skeleton animado (gris pulsante)
- **Gráfico**: Barra gris pulsante
- **Mapa de Calor**: 5 barras skeleton

Transición suave de 800ms después de cargar los datos.

## Experiencia del Usuario

### Usuario FREE ve:
✅ Visitas Virtuales (completo)
✅ Tiempo de Enamoramiento (completo)
🔒 Clientes Muy Interesados (borroso)
✅ Intención de Compra (completo)
✅ Gráfico de Tendencia (completo)
🔒 Mapa de Calor (borroso + overlay)

### Usuario PRO ve:
✅ TODO sin restricciones
✅ Insights personalizados ("Sube esta foto a Facebook")
✅ Tendencias comparativas
✅ Análisis completo de comportamiento

## Próximos Pasos Sugeridos

1. **Conectar PostHog real**: Reemplazar datos mock
2. **Sistema de suscripciones**: Implementar Stripe/MercadoPago
3. **Más insights**:
   - "Hora del día con más visitas"
   - "Dispositivo más usado (móvil/desktop)"
   - "Geografía de visitantes"
4. **Exportar reportes**: PDF con gráficos
5. **Alertas**: "¡Tu propiedad tuvo 50 vistas hoy!"

## Prueba la Página

1. Inicia sesión en el dashboard
2. Haz clic en "Analytics" en cualquier propiedad
3. Cambia entre rangos de tiempo (7d, 30d, Todo)
4. Observa las animaciones de los números
5. Cambia `isPro = true` para ver la versión completa

---

**Desarrollado con ❤️ por Claude Code**
