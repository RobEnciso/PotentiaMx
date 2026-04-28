# PostHog Analytics - Guía de Configuración

## ✅ Implementación Completada

Se ha integrado PostHog Analytics en toda la aplicación para rastrear el comportamiento de los usuarios en los tours virtuales 360°.

## 🔑 Configuración Requerida

### 1. Crear cuenta en PostHog

1. Ve a [PostHog](https://posthog.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. Copia tu **Project API Key**

### 2. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=tu_clave_de_proyecto_aqui
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Nota:** Si usas PostHog self-hosted, cambia el `NEXT_PUBLIC_POSTHOG_HOST` a tu URL personalizada.

## 📊 Eventos Rastreados

### Eventos Automáticos

1. **`$pageview`** - Cada vez que el usuario navega a una nueva página
2. **`tour_scene_view`** - Cuando el usuario ve una escena/vista del tour
   - `tour_id`, `tour_title`, `scene_index`, `total_scenes`

3. **`tour_scene_time`** - Tiempo que el usuario pasó en cada escena
   - `tour_id`, `tour_title`, `scene_index`, `time_spent_seconds`

4. **`tour_high_interest`** - Usuario pasó más de 10 segundos en una escena (alto interés)
   - `tour_id`, `tour_title`, `scene_index`, `time_on_scene_seconds`

### Eventos de Interacción

5. **`tour_contact_click`** - Usuario hizo clic en WhatsApp o Formulario de Email
   - `tour_id`, `contact_type` (whatsapp/email), `current_scene`

6. **`tour_conversion_intent`** - Usuario mostró intención de conversión
   - `tour_id`, `intent_level` (high), `action` (clicked_whatsapp/clicked_email)

7. **`tour_share`** - Usuario compartió el tour (copió link)
   - `tour_id`, `current_scene`

8. **`tour_info_view`** - Usuario abrió el panel de información de la propiedad
   - `tour_id`, `current_scene`

9. **`tour_hotspot_click`** - Usuario hizo clic en un hotspot
   - `tour_id`, `hotspot_id`, `hotspot_title`, `hotspot_type`, `from_scene`

## 🎯 Cómo Usar los Datos

### En PostHog Dashboard

1. **Funnel de Conversión:**
   - `tour_scene_view` → `tour_high_interest` → `tour_contact_click`
   - Te muestra qué % de visitantes se convierten en leads

2. **Tours Más Populares:**
   - Filtra eventos por `tour_id` y `tour_title`
   - Ordena por cantidad de `tour_scene_view`

3. **Escenas Más Vistas:**
   - Agrupa `tour_scene_view` por `scene_index`
   - Identifica qué habitaciones/vistas generan más interés

4. **Tiempo Promedio por Escena:**
   - Promedia `time_spent_seconds` en `tour_scene_time`
   - Identifica qué escenas retienen más atención

5. **Tasa de Contacto:**
   - Cuenta `tour_contact_click` / `tour_scene_view` únicos
   - Mide la efectividad del tour para generar leads

## 🔗 Botón de Analytics en Dashboard

Se agregó un botón **"📊 Analytics"** en cada card de tour en el dashboard que redirige a:

```
/dashboard/analytics/[slug]
```

**Próximos Pasos:**
- Crear una página de analytics embebida de PostHog en esta ruta
- O redirigir a PostHog con filtros pre-configurados por tour

## 🧪 Prueba Local

1. Configura las variables de entorno
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Abre la consola del navegador (modo desarrollo)
4. Verás logs: `📊 PostHog initialized`
5. Navega a un tour y verás eventos en tiempo real en PostHog

## 📱 Eventos Móviles

Todos los eventos funcionan igual en dispositivos móviles. El tracking es automático.

## 🎨 Personalización

Para agregar más eventos, usa el hook `useTourAnalytics`:

```tsx
const analytics = useTourAnalytics({
  tourId: terrain.id,
  tourTitle: terrain.title,
  currentSceneIndex,
  totalScenes: images.length
});

// Luego usa las funciones:
analytics.trackContactClick('whatsapp');
analytics.trackShare();
analytics.trackInfoView();
analytics.trackHotspotClick(id, title, type);
```

## 🚀 Deploy en Producción

1. Agrega las variables de entorno a Vercel/Netlify/tu hosting
2. Asegúrate de usar el Project API Key correcto
3. PostHog comenzará a rastrear automáticamente

## 🔒 Privacidad

- PostHog no rastrea información personal identificable por defecto
- Solo rastreamos eventos de interacción con el tour
- Los usuarios pueden optar por no ser rastreados usando extensiones de privacidad

---

**¿Dudas?** Revisa la [documentación oficial de PostHog](https://posthog.com/docs)
