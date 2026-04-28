# 🔌 Conectar PostHog Real al Dashboard de Analytics - Paso a Paso

## Prerequisitos

✅ PostHog ya está instalado y funcionando (`posthog-js@1.297.2`)
✅ El hook `useTourAnalytics` ya está creado y tracking eventos
✅ La API key de PostHog está en `.env.local`

---

## Paso 1: Crear Servicio de Analytics API

Vamos a crear un servicio que consulte los datos de PostHog.

### Crear archivo: `lib/analyticsService.ts`

```typescript
import posthog from 'posthog-js';

export interface TourAnalyticsData {
  totalViews: number;
  avgTimeSpent: string;
  hotLeads: number;
  conversions: number;
  dailyViews: Array<{
    date: string;
    views: number;
    uniqueVisitors: number;
  }>;
  sceneHeatmap: Array<{
    name: string;
    views: number;
    percentage: number;
  }>;
}

/**
 * Fetch analytics data for a specific property from PostHog
 * @param propertySlug - The slug of the property to get analytics for
 * @param timeRange - Time range: '7d', '30d', or 'all'
 * @param propertyType - Type of property (terreno, casa, departamento)
 */
export async function fetchTourAnalytics(
  propertySlug: string,
  timeRange: '7d' | '30d' | 'all' = '30d',
  propertyType: 'terreno' | 'casa' | 'departamento' = 'terreno'
): Promise<TourAnalyticsData> {
  // Check if PostHog is loaded
  if (!posthog.__loaded) {
    console.warn('PostHog not loaded yet, returning mock data');
    return getMockAnalyticsData(propertyType);
  }

  try {
    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 365;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Note: PostHog's client-side library doesn't directly support querying historical data
    // You'll need to use PostHog's API (server-side) for real analytics
    // For now, we'll use the capture data to build a basic implementation

    // This is a placeholder - you'll need to implement server-side API calls
    console.log('Fetching analytics for:', { propertySlug, timeRange, propertyType });

    // Return mock data for now
    // TODO: Replace with actual PostHog API calls
    return getMockAnalyticsData(propertyType);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return getMockAnalyticsData(propertyType);
  }
}

/**
 * Get mock analytics data (fallback)
 */
function getMockAnalyticsData(
  propertyType: 'terreno' | 'casa' | 'departamento'
): TourAnalyticsData {
  const daysData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
      .replace('.', ''),
    views: Math.floor(Math.random() * 50) + 10,
    uniqueVisitors: Math.floor(Math.random() * 30) + 5,
  }));

  const sceneHeatmaps = {
    terreno: [
      { name: 'Vista Aérea (Drone)', views: 312, percentage: 100 },
      { name: 'Vista Panorámica/Horizonte', views: 267, percentage: 86 },
      { name: 'Plataforma de Construcción', views: 198, percentage: 63 },
      { name: 'Acceso Principal', views: 176, percentage: 56 },
      { name: 'Colindancias/Vecinos', views: 145, percentage: 46 },
      { name: 'Servicios Cercanos', views: 98, percentage: 31 },
    ],
    casa: [
      { name: 'Cocina Integral', views: 245, percentage: 100 },
      { name: 'Jardín Posterior', views: 198, percentage: 81 },
      { name: 'Recámara Principal', views: 187, percentage: 76 },
      { name: 'Sala de Estar', views: 156, percentage: 64 },
      { name: 'Baño Principal', views: 134, percentage: 55 },
      { name: 'Estacionamiento', views: 89, percentage: 36 },
    ],
    departamento: [
      { name: 'Vista desde el Balcón', views: 289, percentage: 100 },
      { name: 'Cocina Moderna', views: 234, percentage: 81 },
      { name: 'Recámara Principal', views: 201, percentage: 70 },
      { name: 'Baño Completo', views: 178, percentage: 62 },
      { name: 'Sala-Comedor', views: 156, percentage: 54 },
      { name: 'Amenidades del Edificio', views: 123, percentage: 43 },
    ],
  };

  return {
    totalViews: daysData.reduce((sum, day) => sum + day.views, 0),
    avgTimeSpent: '2:34',
    hotLeads: 23,
    conversions: 8,
    dailyViews: daysData,
    sceneHeatmap: sceneHeatmaps[propertyType],
  };
}
```

---

## Paso 2: Crear API Route en Next.js (Server-Side)

PostHog requiere llamadas server-side para consultar datos históricos. Vamos a crear una API route.

### Crear archivo: `app/api/analytics/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const POSTHOG_PROJECT_API_KEY = process.env.POSTHOG_PROJECT_API_KEY; // Personal API Key
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || '30d';
  const propertyType = searchParams.get('propertyType') || 'terreno';

  if (!POSTHOG_PROJECT_API_KEY) {
    return NextResponse.json(
      { error: 'PostHog API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 365;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    // 1. Get total views (tour_scene_view events)
    const viewsQuery = {
      kind: 'EventsQuery',
      select: ['count()'],
      where: [
        `event = 'tour_scene_view'`,
        `properties.$current_url LIKE '%${slug}%'`,
        `timestamp >= '${startDate}'`,
        `timestamp <= '${endDate}'`,
      ],
    };

    // 2. Get scene-by-scene breakdown
    const scenesQuery = {
      kind: 'EventsQuery',
      select: ['properties.scene_index', 'count()'],
      where: [
        `event = 'tour_scene_view'`,
        `properties.$current_url LIKE '%${slug}%'`,
        `timestamp >= '${startDate}'`,
        `timestamp <= '${endDate}'`,
      ],
      group_by: ['properties.scene_index'],
      order_by: ['count() DESC'],
    };

    // 3. Get daily views trend
    const dailyViewsQuery = {
      kind: 'EventsQuery',
      select: ['timestamp::date as date', 'count() as views'],
      where: [
        `event = 'tour_scene_view'`,
        `properties.$current_url LIKE '%${slug}%'`,
        `timestamp >= '${startDate}'`,
        `timestamp <= '${endDate}'`,
      ],
      group_by: ['timestamp::date'],
      order_by: ['timestamp::date ASC'],
    };

    // 4. Get hot leads (high interest events)
    const hotLeadsQuery = {
      kind: 'EventsQuery',
      select: ['count(distinct properties.distinct_id)'],
      where: [
        `event = 'tour_high_interest'`,
        `properties.$current_url LIKE '%${slug}%'`,
        `timestamp >= '${startDate}'`,
        `timestamp <= '${endDate}'`,
      ],
    };

    // 5. Get conversions (contact clicks)
    const conversionsQuery = {
      kind: 'EventsQuery',
      select: ['count()'],
      where: [
        `event = 'tour_contact_click'`,
        `properties.$current_url LIKE '%${slug}%'`,
        `timestamp >= '${startDate}'`,
        `timestamp <= '${endDate}'`,
      ],
    };

    // Execute queries in parallel
    const [viewsData, scenesData, dailyData, hotLeadsData, conversionsData] =
      await Promise.all([
        queryPostHog(viewsQuery),
        queryPostHog(scenesQuery),
        queryPostHog(dailyViewsQuery),
        queryPostHog(hotLeadsQuery),
        queryPostHog(conversionsQuery),
      ]);

    // Process and return data
    return NextResponse.json({
      totalViews: viewsData?.results?.[0]?.[0] || 0,
      hotLeads: hotLeadsData?.results?.[0]?.[0] || 0,
      conversions: conversionsData?.results?.[0]?.[0] || 0,
      avgTimeSpent: '2:34', // TODO: Calculate from tour_scene_time events
      dailyViews: processDailyViews(dailyData?.results || []),
      sceneHeatmap: processSceneHeatmap(scenesData?.results || [], propertyType),
    });
  } catch (error) {
    console.error('Error fetching PostHog analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

async function queryPostHog(query: any) {
  const response = await fetch(`${POSTHOG_HOST}/api/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${POSTHOG_PROJECT_API_KEY}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`PostHog API error: ${response.statusText}`);
  }

  return response.json();
}

function processDailyViews(results: any[]) {
  return results.map((row) => ({
    date: new Date(row[0]).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
    }),
    views: row[1],
    uniqueVisitors: row[1], // Approximate
  }));
}

function processSceneHeatmap(results: any[], propertyType: string) {
  // Map scene indices to scene names based on property type
  const sceneNames = {
    terreno: [
      'Vista Aérea (Drone)',
      'Vista Panorámica/Horizonte',
      'Plataforma de Construcción',
      'Acceso Principal',
      'Colindancias/Vecinos',
      'Servicios Cercanos',
    ],
    casa: [
      'Cocina Integral',
      'Jardín Posterior',
      'Recámara Principal',
      'Sala de Estar',
      'Baño Principal',
      'Estacionamiento',
    ],
    departamento: [
      'Vista desde el Balcón',
      'Cocina Moderna',
      'Recámara Principal',
      'Baño Completo',
      'Sala-Comedor',
      'Amenidades del Edificio',
    ],
  };

  const names = sceneNames[propertyType as keyof typeof sceneNames] || sceneNames.terreno;
  const maxViews = results[0]?.[1] || 1;

  return results.map((row, index) => ({
    name: names[row[0]] || `Vista ${row[0] + 1}`,
    views: row[1],
    percentage: Math.round((row[1] / maxViews) * 100),
  }));
}
```

---

## Paso 3: Agregar Variable de Entorno

Necesitas una **Personal API Key** de PostHog (diferente a la pública).

### En `.env.local`, agrega:

```bash
# Existing
NEXT_PUBLIC_POSTHOG_KEY=phc_zh5ppYkGMYHAhE6UQpKRow87AIKZZKBCpGfwpP0TkCR
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# NEW - Para consultas server-side
POSTHOG_PROJECT_API_KEY=phx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Cómo obtener la Personal API Key:

1. Ve a PostHog → Settings (⚙️) → Project Settings
2. Scroll hasta "Project API Key"
3. Copia la key que empieza con `phx_`
4. **NO** uses la pública (`phc_`) para queries server-side

---

## Paso 4: Actualizar la Página de Analytics

Reemplaza la función `generateMockData()` con una llamada al API.

### En `app/dashboard/analytics/[slug]/page.tsx`:

**Cambiar esto:**

```typescript
const { daysData } = useMemo(() => generateMockData(), []);
```

**Por esto:**

```typescript
const [analyticsData, setAnalyticsData] = useState<any>(null);
const [analyticsLoading, setAnalyticsLoading] = useState(true);

useEffect(() => {
  const fetchAnalytics = async () => {
    if (!terrain || !propertyType) return;

    setAnalyticsLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/${slug}?timeRange=${timeRange}&propertyType=${propertyType}`
      );

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data
      setAnalyticsData(generateMockData(propertyType));
    } finally {
      setAnalyticsLoading(false);
    }
  };

  fetchAnalytics();
}, [slug, timeRange, terrain, propertyType]);

// Use real data instead of mock
const filteredData = analyticsData?.dailyViews || [];
const totalViews = analyticsData?.totalViews || 0;
const avgTimeSpent = analyticsData?.avgTimeSpent || '0:00';
const hotLeads = analyticsData?.hotLeads || 0;
const conversions = analyticsData?.conversions || 0;
const config = {
  ...PROPERTY_CONFIG[propertyType],
  scenes: analyticsData?.sceneHeatmap || PROPERTY_CONFIG[propertyType].scenes,
};
```

---

## Paso 5: Actualizar el Hook useTourAnalytics

Asegúrate de que estés enviando el `slug` en los eventos.

### En `hooks/useTourAnalytics.ts`:

**Agregar slug a las propiedades:**

```typescript
export function useTourAnalytics(propertySlug?: string) {
  const trackSceneView = useCallback(
    (sceneIndex: number, sceneName?: string) => {
      safeCapture('tour_scene_view', {
        scene_index: sceneIndex,
        scene_name: sceneName,
        property_slug: propertySlug, // ← AGREGAR ESTO
      });
    },
    [propertySlug]
  );

  // ... hacer lo mismo para todos los métodos
}
```

### Actualizar PhotoSphereViewer.js:

```javascript
// Al inicio del componente
const analytics = useTourAnalytics(terrain?.slug);

// Ahora todos los eventos incluirán el slug
analytics.trackSceneView(currentIndex, `Vista ${currentIndex + 1}`);
```

---

## Paso 6: Testing

### 1. Verificar que los eventos se estén enviando:

```javascript
// En la consola del navegador:
posthog.debug();
// Navega por el tour y verifica que se envíen eventos con 'property_slug'
```

### 2. Verificar el API:

```bash
# En el navegador, abre:
http://localhost:3000/api/analytics/tu-propiedad-slug?timeRange=30d&propertyType=terreno
```

Deberías ver JSON con los datos.

### 3. Verificar el Dashboard:

- Ve a `/dashboard/analytics/tu-propiedad-slug`
- Abre DevTools → Network
- Verifica que se llame al `/api/analytics/...`
- Los datos deberían cargarse dinámicamente

---

## Paso 7: Mapear Scene Index a Nombres

PostHog guardará `scene_index: 0, 1, 2...` pero necesitas nombres legibles.

### Opción A: Guardar nombres en la base de datos

Agregar campo `scene_names` a la tabla `terrenos`:

```sql
ALTER TABLE terrenos
ADD COLUMN scene_names TEXT[];

-- Ejemplo de datos:
UPDATE terrenos
SET scene_names = ARRAY[
  'Vista Aérea (Drone)',
  'Vista Panorámica',
  'Acceso Principal',
  'Plataforma de Construcción'
]
WHERE id = 'abc-123';
```

### Opción B: Usar convención por tipo de propiedad

Ya lo hicimos en el API route (`processSceneHeatmap`).

---

## Paso 8: Calcular Tiempo Promedio

Para obtener el tiempo real de permanencia:

### En el API route, agrega:

```typescript
const avgTimeQuery = {
  kind: 'EventsQuery',
  select: ['avg(properties.time_spent)'],
  where: [
    `event = 'tour_scene_time'`,
    `properties.$current_url LIKE '%${slug}%'`,
    `timestamp >= '${startDate}'`,
    `timestamp <= '${endDate}'`,
  ],
};

const avgTimeData = await queryPostHog(avgTimeQuery);
const avgSeconds = avgTimeData?.results?.[0]?.[0] || 0;
const avgTimeSpent = formatTime(avgSeconds);

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

---

## Resumen de Archivos a Crear/Modificar

### ✅ Crear:
1. `lib/analyticsService.ts` - Servicio helper (opcional)
2. `app/api/analytics/[slug]/route.ts` - API route server-side
3. `.env.local` - Agregar `POSTHOG_PROJECT_API_KEY`

### ✅ Modificar:
1. `app/dashboard/analytics/[slug]/page.tsx` - Usar API en lugar de mock
2. `hooks/useTourAnalytics.ts` - Agregar `property_slug` a eventos
3. `app/terreno/[slug]/PhotoSphereViewer.js` - Pasar slug al hook

---

## Troubleshooting

### Error: "PostHog API key not configured"
- Verifica que `POSTHOG_PROJECT_API_KEY` esté en `.env.local`
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Failed to fetch analytics"
- Verifica que la API key sea la Personal (`phx_`), no la pública
- Revisa los logs del servidor en la consola

### Los datos no aparecen:
- Verifica que haya eventos en PostHog (ve a PostHog → Events)
- Asegúrate de que los eventos tengan `property_slug`
- Revisa la consola del navegador para errores

### Los nombres de escenas están mal:
- Actualiza el mapping en `processSceneHeatmap`
- O agrega `scene_names` a la base de datos

---

## Próximos Pasos (Avanzado)

1. **Cachear resultados**: Agregar Redis/Next.js cache para no consultar PostHog cada vez
2. **Real-time updates**: WebSockets para actualizar datos en vivo
3. **Exportar reportes**: PDF con gráficos generados server-side
4. **Comparativas**: Comparar propiedades similares
5. **Predicciones**: ML para predecir qué propiedades se venderán más rápido

---

**¿Necesitas ayuda implementando alguno de estos pasos?** Puedo crear los archivos paso a paso.
