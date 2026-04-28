# Guía Completa de Analytics y Optimización de Tráfico Web - LandView App 2025

## Fecha: 18 de Noviembre de 2025

---

## 📊 RESUMEN EJECUTIVO

Este documento define la estrategia de medición y optimización del tráfico web para **LandView App**, una plataforma de tours virtuales 360° para propiedades inmobiliarias. El enfoque está en proporcionar métricas simples y accionables para clientes del **Plan Pro** que no son técnicos, mientras se mantiene una infraestructura robusta de analytics.

### Estado Actual
- ✅ Google Tag Manager instalado
- ✅ Eventos de conversión configurados (sesiones navideñas)
- 🎯 **Objetivo**: Implementar dashboard de métricas para clientes Plan Pro
- 🎯 **Prioridad**: Métricas comprensibles para usuarios no técnicos

---

## 1️⃣ ARQUITECTURA DE MEDICIÓN

### 1.1 Stack de Analytics Recomendado

```
┌─────────────────────────────────────────────────┐
│     CAPA DE RECOLECCIÓN DE DATOS                │
├─────────────────────────────────────────────────┤
│ • Google Tag Manager (GTM) ✅ INSTALADO         │
│ • Google Analytics 4 (GA4)                      │
│ • Posthog (alternativa open-source)             │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│     CAPA DE ALMACENAMIENTO                      │
├─────────────────────────────────────────────────┤
│ • Supabase Analytics (views personalizados)     │
│ • Tabla 'property_analytics' en PostgreSQL      │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│     CAPA DE PRESENTACIÓN (Plan Pro)             │
├─────────────────────────────────────────────────┤
│ • Dashboard Next.js con gráficas simples        │
│ • Reporte PDF descargable                       │
│ • Notificaciones de hitos (100, 500, 1K views)  │
└─────────────────────────────────────────────────┘
```

---

## 2️⃣ MÉTRICAS PARA CLIENTES PLAN PRO (NO TÉCNICOS)

### 2.1 Dashboard Simple - 5 Métricas Clave

```
┌─────────────────────────────────────────────────┐
│  📈 DASHBOARD DE TU PROPIEDAD                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  👥 VISITANTES                                  │
│  ┌──────────────────────────┐                  │
│  │   1,247 personas         │                  │
│  │   ↑ 23% vs semana pasada │                  │
│  └──────────────────────────┘                  │
│                                                 │
│  ⏱️ TIEMPO PROMEDIO EN TU TOUR                  │
│  ┌──────────────────────────┐                  │
│  │   3 min 42 seg           │                  │
│  │   😊 Muy bueno           │                  │
│  └──────────────────────────┘                  │
│                                                 │
│  🎯 HABITACIONES MÁS VISTAS                     │
│  ┌──────────────────────────┐                  │
│  │  1. Jardín       (67%)   │                  │
│  │  2. Sala         (45%)   │                  │
│  │  3. Cocina       (38%)   │                  │
│  └──────────────────────────┘                  │
│                                                 │
│  📱 ¿CÓMO TE VISITAN?                           │
│  ┌──────────────────────────┐                  │
│  │  📱 Celular:     73%     │                  │
│  │  💻 Computadora: 22%     │                  │
│  │  📱 Tablet:      5%      │                  │
│  └──────────────────────────┘                  │
│                                                 │
│  🔗 ENLACES COMPARTIDOS                         │
│  ┌──────────────────────────┐                  │
│  │   34 veces               │                  │
│  │   🎉 ¡Tu tour se viraliza!│                 │
│  └──────────────────────────┘                  │
│                                                 │
│  [📥 Descargar Reporte PDF]                    │
└─────────────────────────────────────────────────┘
```

### 2.2 Tabla de Métricas Simplificada

| Métrica | Qué Significa | Valor Ideal | Tu Resultado | Estado |
|---------|---------------|-------------|--------------|--------|
| **Visitantes** | Cuántas personas vieron tu propiedad | 500+/mes | 1,247 | ✅ Excelente |
| **Tiempo en Tour** | Cuánto tiempo exploraron | 2-4 min | 3:42 | ✅ Muy bueno |
| **Tasa de Rebote** | % que salió inmediatamente | <40% | 28% | ✅ Excelente |
| **Habitaciones Visitadas** | Cuántas áreas exploraron | 3+ | 4.2 | ✅ Muy bueno |
| **Compartidos** | Veces que enviaron tu link | 10+/mes | 34 | ✅ Muy bueno |
| **Dispositivo Principal** | Dónde te ven más | Móvil | 73% móvil | ℹ️ Normal |

### 2.3 Semáforo de Rendimiento

```
🟢 VERDE (Excelente)
   → Tiempo en tour > 3 min
   → Visitantes aumentando
   → Más de 3 habitaciones vistas

🟡 AMARILLO (Mejorable)
   → Tiempo en tour 1-3 min
   → Visitantes estables
   → 2-3 habitaciones vistas

🔴 ROJO (Necesita atención)
   → Tiempo en tour < 1 min
   → Visitantes bajando
   → Solo 1 habitación vista
```

---

## 3️⃣ IMPLEMENTACIÓN TÉCNICA

### 3.1 Eventos de GTM a Configurar

```javascript
// dataLayer.js - Eventos esenciales para LandView

// 1. Vista de Propiedad
window.dataLayer.push({
  'event': 'property_view',
  'property_id': 'abc123',
  'property_title': 'Casa en Polanco',
  'user_plan': 'pro'
});

// 2. Cambio de Panorama (navegación entre habitaciones)
window.dataLayer.push({
  'event': 'panorama_change',
  'property_id': 'abc123',
  'from_panorama': 0,
  'to_panorama': 1,
  'panorama_title': 'Jardín',
  'time_spent': 45 // segundos
});

// 3. Click en Hotspot
window.dataLayer.push({
  'event': 'hotspot_click',
  'property_id': 'abc123',
  'hotspot_title': 'Ir a Cocina',
  'current_panorama': 'Sala'
});

// 4. Tiempo Total en Tour (al salir)
window.dataLayer.push({
  'event': 'tour_complete',
  'property_id': 'abc123',
  'total_time': 223, // segundos
  'panoramas_visited': 5,
  'total_panoramas': 8,
  'completion_rate': 62.5 // porcentaje
});

// 5. Compartir Tour
window.dataLayer.push({
  'event': 'share_tour',
  'property_id': 'abc123',
  'share_method': 'whatsapp', // whatsapp, facebook, link_copy
});

// 6. Acción de Contacto
window.dataLayer.push({
  'event': 'contact_action',
  'property_id': 'abc123',
  'action_type': 'phone_click' // phone_click, email_click, form_submit
});
```

### 3.2 Schema de Base de Datos

```sql
-- Tabla para almacenar analytics de propiedades
CREATE TABLE property_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  terreno_id UUID REFERENCES terrenos(id) ON DELETE CASCADE,

  -- Datos del evento
  event_type VARCHAR(50) NOT NULL, -- 'view', 'panorama_change', 'share', etc.
  session_id VARCHAR(100), -- Para agrupar sesiones

  -- Datos del panorama
  panorama_index INTEGER,
  panorama_title VARCHAR(255),
  time_spent INTEGER, -- segundos en este panorama

  -- Datos del usuario/dispositivo
  device_type VARCHAR(20), -- 'mobile', 'desktop', 'tablet'
  browser VARCHAR(50),
  country VARCHAR(2),
  city VARCHAR(100),

  -- Referencia de origen
  referrer VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Índices para queries rápidas
  INDEX idx_terreno_created (terreno_id, created_at),
  INDEX idx_event_type (event_type),
  INDEX idx_session (session_id)
);

-- Vista para métricas agregadas (Plan Pro Dashboard)
CREATE VIEW property_metrics_summary AS
SELECT
  terreno_id,

  -- Visitantes únicos (últimos 30 días)
  COUNT(DISTINCT session_id) FILTER (
    WHERE event_type = 'view'
    AND created_at >= NOW() - INTERVAL '30 days'
  ) as visitors_30d,

  -- Visitantes últimos 7 días
  COUNT(DISTINCT session_id) FILTER (
    WHERE event_type = 'view'
    AND created_at >= NOW() - INTERVAL '7 days'
  ) as visitors_7d,

  -- Tiempo promedio en tour
  AVG(time_spent) FILTER (
    WHERE event_type = 'tour_complete'
    AND created_at >= NOW() - INTERVAL '30 days'
  ) as avg_time_seconds,

  -- Panoramas promedio visitados
  AVG((metadata->>'panoramas_visited')::int) FILTER (
    WHERE event_type = 'tour_complete'
    AND created_at >= NOW() - INTERVAL '30 days'
  ) as avg_panoramas_visited,

  -- Veces compartido
  COUNT(*) FILTER (
    WHERE event_type = 'share'
    AND created_at >= NOW() - INTERVAL '30 days'
  ) as shares_30d,

  -- Dispositivo más usado
  MODE() WITHIN GROUP (ORDER BY device_type) as primary_device,

  -- Última actualización
  MAX(created_at) as last_activity

FROM property_analytics
GROUP BY terreno_id;

-- Función para obtener panoramas más vistos
CREATE FUNCTION get_top_panoramas(p_terreno_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  panorama_title VARCHAR,
  views BIGINT,
  percentage NUMERIC
) AS $$
  WITH total_views AS (
    SELECT COUNT(*) as total
    FROM property_analytics
    WHERE terreno_id = p_terreno_id
      AND event_type = 'panorama_change'
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  )
  SELECT
    pa.panorama_title,
    COUNT(*) as views,
    ROUND((COUNT(*) * 100.0 / total_views.total), 1) as percentage
  FROM property_analytics pa, total_views
  WHERE pa.terreno_id = p_terreno_id
    AND pa.event_type = 'panorama_change'
    AND pa.created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND pa.panorama_title IS NOT NULL
  GROUP BY pa.panorama_title, total_views.total
  ORDER BY views DESC
  LIMIT 5;
$$ LANGUAGE SQL;
```

### 3.3 Componente React para Dashboard

```typescript
// app/dashboard/analytics/[terrenoId]/page.tsx

'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Card } from '@/components/ui/Card';
import { BarChart, LineChart, PieChart } from '@/components/ui/Charts';
import { TrendIndicator } from '@/components/ui/TrendIndicator';

interface PropertyMetrics {
  visitors_30d: number;
  visitors_7d: number;
  avg_time_seconds: number;
  avg_panoramas_visited: number;
  shares_30d: number;
  primary_device: 'mobile' | 'desktop' | 'tablet';
  top_panoramas: Array<{
    panorama_title: string;
    views: number;
    percentage: number;
  }>;
}

export default function AnalyticsDashboard({
  params
}: {
  params: { terrenoId: string }
}) {
  const supabase = useMemo(() => createClient(), []);
  const [metrics, setMetrics] = useState<PropertyMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      // Obtener métricas agregadas
      const { data: summary } = await supabase
        .from('property_metrics_summary')
        .select('*')
        .eq('terreno_id', params.terrenoId)
        .single();

      // Obtener panoramas más vistos
      const { data: topPanoramas } = await supabase
        .rpc('get_top_panoramas', {
          p_terreno_id: params.terrenoId,
          p_days: 30
        });

      setMetrics({
        ...summary,
        top_panoramas: topPanoramas || []
      });
      setLoading(false);
    };

    fetchMetrics();
  }, [supabase, params.terrenoId]);

  if (loading) return <LoadingSkeleton />;
  if (!metrics) return <EmptyState />;

  // Calcular tendencia (comparar 7 días vs semana anterior)
  const trend = calculateTrend(metrics.visitors_7d, metrics.visitors_30d);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">📈 Tu Propiedad en Números</h1>

      {/* Métrica Principal: Visitantes */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 p-8">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">👥 Visitantes (últimos 30 días)</p>
          <p className="text-6xl font-bold text-blue-600">
            {metrics.visitors_30d.toLocaleString()}
          </p>
          <TrendIndicator
            value={trend}
            label="vs semana pasada"
            className="mt-4"
          />
        </div>
      </Card>

      {/* Grid de Métricas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tiempo en Tour */}
        <MetricCard
          icon="⏱️"
          title="Tiempo Promedio en tu Tour"
          value={formatTime(metrics.avg_time_seconds)}
          status={getTimeStatus(metrics.avg_time_seconds)}
          description="Mientras más tiempo, ¡mejor!"
        />

        {/* Habitaciones Vistas */}
        <MetricCard
          icon="🏠"
          title="Habitaciones Exploradas"
          value={metrics.avg_panoramas_visited.toFixed(1)}
          status={getRoomStatus(metrics.avg_panoramas_visited)}
          description="Promedio por visitante"
        />

        {/* Compartidos */}
        <MetricCard
          icon="🔗"
          title="Veces Compartido"
          value={metrics.shares_30d}
          status={getShareStatus(metrics.shares_30d)}
          description="Tu tour se está viralizando"
        />

        {/* Dispositivo */}
        <MetricCard
          icon="📱"
          title="¿Cómo te Visitan?"
          value={getDeviceEmoji(metrics.primary_device)}
          status="info"
          description={`Principalmente desde ${getDeviceLabel(metrics.primary_device)}`}
        />
      </div>

      {/* Top Habitaciones */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">🎯 Habitaciones Más Vistas</h2>
        <div className="space-y-3">
          {metrics.top_panoramas.map((pano, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-300 w-8">
                {idx + 1}
              </span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{pano.panorama_title}</span>
                  <span className="text-gray-600">{pano.percentage}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                    style={{ width: `${pano.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {pano.views} vistas
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Botón de Descarga */}
      <div className="text-center">
        <button
          onClick={() => generatePDFReport(params.terrenoId)}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          📥 Descargar Reporte PDF
        </button>
      </div>
    </div>
  );
}

// Componente auxiliar para tarjetas de métrica
function MetricCard({ icon, title, value, status, description }) {
  const statusColors = {
    excellent: 'bg-green-50 border-green-200',
    good: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-gray-50 border-gray-200'
  };

  const statusEmojis = {
    excellent: '😊',
    good: '👍',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <Card className={`p-6 border-2 ${statusColors[status]}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-4xl font-bold mb-2">{value}</p>
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <span>{statusEmojis[status]}</span>
        {description}
      </p>
    </Card>
  );
}

// Helpers
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins} min ${secs} seg`;
}

function getTimeStatus(seconds: number) {
  if (seconds >= 180) return 'excellent'; // 3+ min
  if (seconds >= 60) return 'good';       // 1-3 min
  return 'warning';                        // <1 min
}

function getRoomStatus(rooms: number) {
  if (rooms >= 3) return 'excellent';
  if (rooms >= 2) return 'good';
  return 'warning';
}

function getShareStatus(shares: number) {
  if (shares >= 20) return 'excellent';
  if (shares >= 10) return 'good';
  return 'info';
}

function getDeviceEmoji(device: string) {
  const map = { mobile: '📱', desktop: '💻', tablet: '📱' };
  return map[device] || '📱';
}

function getDeviceLabel(device: string) {
  const map = { mobile: 'celular', desktop: 'computadora', tablet: 'tablet' };
  return map[device] || 'celular';
}

function calculateTrend(week: number, month: number): number {
  const prevWeek = month - week;
  if (prevWeek === 0) return 0;
  return Math.round(((week - prevWeek) / prevWeek) * 100);
}
```

### 3.4 Integración en PhotoSphereViewer.js

```javascript
// app/terreno/[id]/PhotoSphereViewer.js
// Agregar tracking de eventos

'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

export default function PhotoSphereViewer({ terreno, hotspots }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tracking state
  const sessionId = useRef(generateSessionId());
  const panoramaStartTime = useRef(Date.now());
  const viewStartTime = useRef(Date.now());

  // Enviar evento de vista inicial
  useEffect(() => {
    trackEvent('property_view', {
      property_id: terreno.id,
      property_title: terreno.title,
      total_panoramas: terreno.image_urls.length
    });

    return () => {
      // Al salir, enviar evento de tour_complete
      const totalTime = Math.floor((Date.now() - viewStartTime.current) / 1000);
      trackEvent('tour_complete', {
        property_id: terreno.id,
        total_time: totalTime,
        panoramas_visited: getUniquePanoramasVisited(),
        total_panoramas: terreno.image_urls.length
      });
    };
  }, [terreno.id]);

  // Tracking de cambio de panorama
  useEffect(() => {
    if (viewerRef.current) {
      const timeSpent = Math.floor((Date.now() - panoramaStartTime.current) / 1000);

      if (timeSpent > 0) { // Evitar tracking del primer render
        trackEvent('panorama_change', {
          property_id: terreno.id,
          panorama_index: currentIndex,
          panorama_title: getPanoramaTitle(currentIndex),
          time_spent: timeSpent
        });
      }

      panoramaStartTime.current = Date.now();
    }
  }, [currentIndex, terreno.id]);

  // Función de tracking
  function trackEvent(eventType, data) {
    // 1. Enviar a Google Analytics vía dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventType,
        session_id: sessionId.current,
        device_type: getDeviceType(),
        ...data
      });
    }

    // 2. Guardar en Supabase
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        session_id: sessionId.current,
        terreno_id: data.property_id,
        panorama_index: data.panorama_index,
        panorama_title: data.panorama_title,
        time_spent: data.time_spent,
        device_type: getDeviceType(),
        metadata: data
      })
    });
  }

  // ... resto del código del viewer
}

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}
```

### 3.5 API Route para Guardar Analytics

```typescript
// app/api/analytics/track/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side key
    );

    // Extraer info del request
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Insertar en DB
    const { error } = await supabase
      .from('property_analytics')
      .insert({
        terreno_id: data.terreno_id,
        event_type: data.event_type,
        session_id: data.session_id,
        panorama_index: data.panorama_index,
        panorama_title: data.panorama_title,
        time_spent: data.time_spent,
        device_type: data.device_type,
        browser: getBrowser(userAgent),
        referrer: referer,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        metadata: data.metadata
      });

    if (error) {
      console.error('Error saving analytics:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function getBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
}
```

---

## 4️⃣ OPTIMIZACIÓN DE TRÁFICO

### 4.1 SEO para Tours Virtuales

```typescript
// app/terreno/[id]/page.js - Metadata optimizada

export async function generateMetadata({ params }) {
  const terreno = await fetchTerreno(params.id);

  return {
    title: `${terreno.title} - Tour Virtual 360°`,
    description: `Explora ${terreno.title} con nuestro tour virtual interactivo. Recorre cada rincón en 360° desde tu celular o computadora.`,
    openGraph: {
      title: `${terreno.title} - Tour Virtual 360°`,
      description: `Explora esta propiedad en 360°`,
      images: [terreno.image_urls[0]],
      type: 'website',
      url: `https://tudominio.com/terreno/${params.id}`
    },
    twitter: {
      card: 'summary_large_image',
      title: `${terreno.title} - Tour Virtual 360°`,
      description: `Explora esta propiedad en 360°`,
      images: [terreno.image_urls[0]]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
```

### 4.2 Schema Markup para Rich Results

```typescript
// app/terreno/[id]/page.js - Agregar JSON-LD

export default function TerrenoPage({ terreno }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateProperty',
    name: terreno.title,
    url: `https://tudominio.com/terreno/${terreno.id}`,
    image: terreno.image_urls,
    description: `Tour virtual 360° de ${terreno.title}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: terreno.city,
      addressRegion: terreno.state,
      addressCountry: 'MX'
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: terreno.price,
      priceCurrency: 'MXN'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* ... resto del componente */}
    </>
  );
}
```

### 4.3 Estrategia de UTM Tracking

```javascript
// Genera links con UTM para compartir

function generateShareLink(terrenoId, platform) {
  const baseUrl = `https://tudominio.com/terreno/${terrenoId}`;
  const params = new URLSearchParams({
    utm_source: platform,
    utm_medium: 'social',
    utm_campaign: 'share_button'
  });

  return `${baseUrl}?${params.toString()}`;
}

// Uso:
const whatsappLink = generateShareLink(terreno.id, 'whatsapp');
const facebookLink = generateShareLink(terreno.id, 'facebook');
const emailLink = generateShareLink(terreno.id, 'email');
```

### 4.4 Performance Optimization Checklist

```markdown
✅ OPTIMIZACIONES CRÍTICAS

1. **Imágenes Panorámicas**
   - [ ] Comprimir a WebP (calidad 85%)
   - [ ] Servir responsive sizes (móvil: 2K, desktop: 4K)
   - [ ] Lazy loading para panoramas no visibles
   - [ ] Preload del primer panorama

2. **Photo Sphere Viewer**
   - [ ] Code splitting del viewer
   - [ ] Dynamic import solo cuando se necesita
   - [ ] Web Worker para procesamiento pesado

3. **Next.js Config**
   - [ ] Habilitar compresión Gzip/Brotli
   - [ ] Cache headers optimizados
   - [ ] Edge caching con Vercel/Cloudflare

4. **Analytics**
   - [ ] Batch events (enviar cada 30seg en lugar de tiempo real)
   - [ ] Service Worker para offline tracking
   - [ ] Comprimir payloads de analytics
```

---

## 5️⃣ PLAN DE IMPLEMENTACIÓN

### Fase 1: Setup Básico (Semana 1)
1. ✅ Crear tabla `property_analytics` en Supabase
2. ✅ Crear vista `property_metrics_summary`
3. ✅ Implementar API route `/api/analytics/track`
4. ✅ Agregar tracking básico en PhotoSphereViewer

### Fase 2: Dashboard (Semana 2)
1. ✅ Crear página `/dashboard/analytics/[terrenoId]`
2. ✅ Implementar 5 métricas principales
3. ✅ Componente de "Top Panoramas"
4. ✅ Sistema de semáforo (verde/amarillo/rojo)

### Fase 3: Reporting (Semana 3)
1. ✅ Generador de PDF con charts
2. ✅ Notificaciones de hitos (email/push)
3. ✅ Exportar CSV de datos raw
4. ✅ Comparación mes a mes

### Fase 4: Optimización (Semana 4)
1. ✅ Implementar UTM tracking
2. ✅ SEO + Schema markup
3. ✅ Performance optimizations
4. ✅ A/B testing framework

---

## 6️⃣ COSTOS Y HERRAMIENTAS

### Opción 1: Stack Completo Gratis
- **Google Analytics 4**: Gratis
- **Google Tag Manager**: Gratis
- **Supabase Analytics**: Incluido en plan actual
- **Chart.js / Recharts**: Open source
- **PDF Generation**: jsPDF (gratis)

### Opción 2: Stack Premium
- **Mixpanel**: $25/mes (mejores insights)
- **Posthog**: $20/mes (open source, self-hosted gratis)
- **Amplitude**: Gratis hasta 10M eventos/mes
- **Heap Analytics**: $3,600/año (auto-tracking)

### Recomendación
**Empezar con Stack Gratis (GA4 + Supabase)**, luego escalar a Posthog si necesitas:
- Grabaciones de sesión
- Heatmaps
- Feature flags
- Análisis de cohortes

---

## 7️⃣ KPIs PARA ÉXITO DEL PLAN PRO

| KPI | Meta Mensual | Tracking |
|-----|--------------|----------|
| **Visitantes por Propiedad** | 500+ | GA4 + Supabase |
| **Tiempo Promedio en Tour** | 3+ min | Custom tracking |
| **Tasa de Compartidos** | 5% de visitantes | Share button events |
| **Engagement Rate** | 60%+ ven 3+ panoramas | Panorama changes |
| **Retención** | 20% vuelven en 30 días | Session tracking |
| **Conversiones** | 2% toman acción (contacto) | Contact events |

---

## 8️⃣ RECURSOS Y REFERENCIAS

### Documentación Oficial
- [Google Analytics 4 Docs](https://developers.google.com/analytics/devguides/collection/ga4)
- [Google Tag Manager](https://developers.google.com/tag-platform/tag-manager)
- [Supabase Analytics](https://supabase.com/docs/guides/platform/metrics)

### Librerías Recomendadas
```json
{
  "dependencies": {
    "recharts": "^2.15.0",        // Gráficas React
    "jspdf": "^2.5.2",             // Generación PDF
    "html2canvas": "^1.4.1",        // Screenshots para PDF
    "date-fns": "^4.1.0",          // Manejo de fechas
    "posthog-js": "^1.204.1"       // Opcional: Posthog analytics
  }
}
```

### Tutoriales
- [GA4 + Next.js Setup](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Supabase Custom Analytics](https://supabase.com/blog/supabase-reports)

---

## 9️⃣ CHECKLIST DE LANZAMIENTO

```markdown
### PRE-LANZAMIENTO
- [ ] Tabla `property_analytics` creada en Supabase
- [ ] Vista `property_metrics_summary` funcionando
- [ ] API route `/api/analytics/track` desplegada
- [ ] Eventos GTM configurados
- [ ] Dashboard accesible en `/dashboard/analytics/[id]`
- [ ] Tested en mobile + desktop

### POST-LANZAMIENTO (30 días)
- [ ] Validar datos con muestra de 10+ propiedades
- [ ] Comparar GA4 vs Supabase (deben coincidir ±5%)
- [ ] Feedback de 5 clientes Plan Pro
- [ ] Optimizar queries lentas (usar EXPLAIN ANALYZE)
- [ ] Documentar en Knowledge Base

### MANTENIMIENTO CONTINUO
- [ ] Review semanal de performance de queries
- [ ] Limpiar datos >1 año (GDPR compliance)
- [ ] A/B testing de mejoras al dashboard
- [ ] Agregar nuevas métricas basadas en feedback
```

---

## 🎯 CONCLUSIÓN

Este sistema de analytics está diseñado para:

1. **Clientes No Técnicos**: Dashboard simple con 5 métricas clave
2. **Escalabilidad**: Arquitectura que soporta millones de eventos
3. **Bajo Costo**: Stack mayormente gratuito (GA4 + Supabase)
4. **Accionable**: Métricas que guían decisiones de marketing

**Próximos Pasos**:
1. Implementar Fase 1 (DB + tracking básico)
2. Probar con 3-5 propiedades piloto
3. Iterar dashboard basado en feedback real
4. Escalar a todos los clientes Plan Pro

---

**Última actualización**: 18 de Noviembre de 2025
**Versión**: 2.0
**Autor**: Sistema de Analytics LandView
