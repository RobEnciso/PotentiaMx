# 📐 Tabla de Polígonos - Sistema de Límites 360°

## Descripción

Esta migración crea la tabla `polygons` para almacenar polígonos que representan límites visuales en las vistas 360° de los terrenos. Cada vista panorámica puede tener múltiples polígonos independientes.

## 🏗️ Estructura de la Tabla

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID autoincrementado (PK) |
| `terreno_id` | UUID | FK al terreno (CASCADE delete) |
| `panorama_index` | INTEGER | Índice de la vista 360° (0, 1, 2...) |
| `points` | JSONB | Array de puntos `[{yaw:"Xrad", pitch:"Yrad"}]` |
| `name` | TEXT | Nombre del polígono (ej: "Límite Norte") |
| `description` | TEXT | Descripción opcional |
| `color` | VARCHAR(7) | Color hex (#RRGGBB), default: `#00ff00` |
| `fill_opacity` | NUMERIC(3,2) | Opacidad 0.0-1.0, default: `0.25` |
| `stroke_width` | INTEGER | Grosor del borde px, default: `4` |
| `visible` | BOOLEAN | Visibilidad, default: `true` |
| `z_index` | INTEGER | Orden renderizado, default: `5` |
| `created_at` | TIMESTAMPTZ | Timestamp de creación |
| `updated_at` | TIMESTAMPTZ | Auto-actualizado en UPDATE |
| `created_by` | UUID | FK al usuario creador |

## 📋 Características

### ✅ Relaciones
- **FK a `terrenos`**: `ON DELETE CASCADE` (eliminar terreno = eliminar sus polígonos)
- **FK a `auth.users`**: `ON DELETE SET NULL` (eliminar usuario = mantener polígonos)

### ✅ Índices
- `idx_polygons_terreno_id`: Búsqueda por terreno
- `idx_polygons_terreno_panorama`: Búsqueda por terreno + vista
- `idx_polygons_visible`: Filtro de visibles (partial index)

### ✅ Triggers
- Auto-actualización de `updated_at` en cada UPDATE

### ✅ Row Level Security (RLS)
1. **Lectura pública**: Cualquiera puede ver polígonos de terrenos existentes
2. **Inserción**: Solo usuarios autenticados en sus propios terrenos
3. **Actualización**: Solo dueños del terreno
4. **Eliminación**: Solo dueños del terreno

## 🚀 Instalación

### Paso 1: Ejecutar en Supabase SQL Editor

```sql
-- Copia y pega el contenido completo de:
-- sql_migrations/CREATE_POLYGONS_TABLE.sql
```

### Paso 2: Verificar instalación

```sql
-- Ver columnas creadas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'polygons'
ORDER BY ordinal_position;

-- Ver políticas RLS
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'polygons';

-- Ver índices
SELECT indexname FROM pg_indexes
WHERE tablename = 'polygons';
```

## 📝 Ejemplos de Uso

### Insertar un polígono

```sql
INSERT INTO public.polygons (
  terreno_id,
  panorama_index,
  points,
  name,
  color,
  fill_opacity,
  created_by
) VALUES (
  'uuid-del-terreno-aqui',
  0, -- Primera vista
  '[
    {"yaw": "0.5rad", "pitch": "0.2rad"},
    {"yaw": "1.0rad", "pitch": "0.1rad"},
    {"yaw": "0.8rad", "pitch": "-0.3rad"}
  ]'::jsonb,
  'Límite Norte',
  '#00ff00',
  0.25,
  auth.uid()
);
```

### Consultar polígonos de un terreno

```sql
SELECT
  id,
  panorama_index,
  name,
  color,
  jsonb_array_length(points) as num_points,
  visible,
  created_at
FROM public.polygons
WHERE terreno_id = 'uuid-del-terreno'
ORDER BY panorama_index, created_at;
```

### Consultar polígonos de una vista específica

```sql
SELECT * FROM public.polygons
WHERE terreno_id = 'uuid-del-terreno'
  AND panorama_index = 0
  AND visible = true
ORDER BY z_index DESC;
```

### Actualizar color de un polígono

```sql
UPDATE public.polygons
SET color = '#ff0000',
    fill_opacity = 0.5
WHERE id = 123;
-- updated_at se actualiza automáticamente
```

### Eliminar polígonos de una vista

```sql
DELETE FROM public.polygons
WHERE terreno_id = 'uuid-del-terreno'
  AND panorama_index = 2;
```

## 🔒 Seguridad

### RLS Habilitado
La tabla tiene RLS activado con políticas que aseguran:
- Solo los dueños pueden modificar/eliminar sus polígonos
- Lectura pública para mostrar en viewer
- Usuarios anónimos NO pueden crear polígonos

### Validaciones
- `fill_opacity`: CHECK entre 0.0 y 1.0
- `stroke_width`: CHECK > 0
- `color`: Formato VARCHAR(7) para hex colors (#RRGGBB)

## 📊 Modelo de Datos

```
terrenos (1) ──────────────< (N) polygons
   │                              │
   │                              │
   └─ user_id                     └─ created_by ──> auth.users
```

### Relación con vistas 360°

```javascript
// Ejemplo: terreno con 3 vistas panorámicas
terreno = {
  id: "uuid-123",
  image_urls: [
    "url-vista-0.jpg",  // panorama_index = 0
    "url-vista-1.jpg",  // panorama_index = 1
    "url-vista-2.jpg",  // panorama_index = 2
  ]
}

// Polígono en la primera vista
polygon = {
  terreno_id: "uuid-123",
  panorama_index: 0,  // Aparece en "url-vista-0.jpg"
  points: [{yaw:"...", pitch:"..."}, ...]
}
```

## 🎨 Formato de Puntos (JSONB)

Los puntos se almacenan como array JSON con coordenadas esféricas:

```json
[
  {"yaw": "0.5rad", "pitch": "0.2rad"},
  {"yaw": "1.0rad", "pitch": "0.1rad"},
  {"yaw": "0.8rad", "pitch": "-0.3rad"}
]
```

- **yaw**: Rotación horizontal en radianes (string con "rad")
- **pitch**: Rotación vertical en radianes (string con "rad")
- **Formato**: Photo Sphere Viewer usa este formato directamente

## 🛠️ Integración con la App

### Service Layer (próximo paso)

Crear `lib/polygonsService.js`:

```javascript
export async function getPolygonsByTerreno(terrenoId) {
  const { data, error } = await supabase
    .from('polygons')
    .select('*')
    .eq('terreno_id', terrenoId)
    .eq('visible', true)
    .order('panorama_index', { ascending: true })
    .order('z_index', { ascending: false });

  return { data, error };
}

export async function createPolygon(polygon) {
  const { data, error } = await supabase
    .from('polygons')
    .insert({
      terreno_id: polygon.terrenoId,
      panorama_index: polygon.panoramaIndex,
      points: polygon.points,
      name: polygon.name,
      color: polygon.color || '#00ff00',
      fill_opacity: polygon.fillOpacity || 0.25,
      stroke_width: polygon.strokeWidth || 4,
      visible: true,
      created_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  return { data, error };
}
```

## ✅ Checklist de Instalación

- [ ] Ejecutar `CREATE_POLYGONS_TABLE.sql` en Supabase
- [ ] Verificar que la tabla existe: `SELECT * FROM polygons LIMIT 1;`
- [ ] Verificar RLS: `SELECT * FROM pg_policies WHERE tablename='polygons';`
- [ ] Probar inserción de un polígono de prueba
- [ ] Probar consulta pública (sin auth)
- [ ] Probar actualización (con auth del dueño)
- [ ] Crear servicio CRUD en `lib/polygonsService.js`
- [ ] Integrar con HotspotEditor para guardar/cargar

## 📚 Documentación Relacionada

- [Photo Sphere Viewer - Markers Plugin](https://photo-sphere-viewer.js.org/plugins/markers.html)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)

---

**Fecha de creación**: 2025-11-25
**Versión**: 1.0.0
**Estado**: ✅ Listo para implementar
