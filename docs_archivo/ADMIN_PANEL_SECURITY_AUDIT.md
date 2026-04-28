# 🛡️ PANEL DE ADMINISTRADOR - Auditoría de Seguridad y Funcionalidad

**Fecha:** 18 de Enero, 2025
**Objetivo:** Revisar, mejorar y documentar herramientas de administrador
**Responsable:** Admin dashboard security & monitoring

---

## 📊 HERRAMIENTAS ACTUALES IMPLEMENTADAS

### ✅ 1. **Estadísticas del Sistema** (Ya implementado)

**Métricas mostradas:**

- 👥 Usuarios Activos totales
- 🏠 Total de Terrenos en la plataforma
- 📸 Total de Imágenes almacenadas
- 💾 Uso de Almacenamiento (MB)

**Ubicación:** `app/dashboard/page.js` líneas 498-553
**Función:** `loadSystemStats()`

---

### ✅ 2. **Análisis de Storage** (Ya implementado)

**Funciones:**

- Analiza todos los archivos en Supabase Storage
- Cuenta total de archivos
- Calcula tamaño total en MB
- Agrupa por tipo de archivo (jpg, png, webp, etc.)
- Muestra barra de progreso visual

**Ubicación:** `app/dashboard/page.js` líneas 261-380
**Función:** `analyzeStorage()`

**Visualización:**

```
Almacenamiento: 245 MB / 1024 MB
[████████░░░░░░░░░░░░] 23.9% usado

Detalle:
- Total Archivos: 342
- Tamaño Total: 245 MB
- .jpg: 180
- .png: 120
- .webp: 42
```

---

### ✅ 3. **Limpieza de Archivos Huérfanos** (Ya implementado)

**Función:** Detecta y elimina imágenes en storage que no están referenciadas en la base de datos

**Proceso:**

1. Escanea todos los terrenos en BD y sus URLs de imágenes
2. Escanea todos los archivos en Supabase Storage
3. Compara y detecta archivos sin referencia
4. Permite eliminarlos en lotes de 100
5. Confirma antes de eliminar (seguridad)

**Ubicación:** `app/dashboard/page.js` líneas 382-496
**Función:** `cleanOrphanFiles()`

**Seguridad implementada:**

- ✅ Confirmación con alert antes de eliminar
- ✅ Muestra cantidad de archivos a eliminar
- ✅ Mensaje claro: "Esta acción NO se puede deshacer"
- ✅ Eliminación en lotes (evita timeout)

---

### ✅ 4. **Panel de Aprobación de Marketplace** (Ya implementado)

**Funciones:**

- Lista terrenos pendientes de aprobación
- Muestra datos del propietario (email)
- Preview del tour antes de aprobar
- Aprobar o rechazar publicaciones

**Ubicación:** `app/dashboard/page.js` líneas 555-665
**Funciones:**

- `loadPendingTerrenos()`
- `approveTerrenoForMarketplace()`
- `rejectTerrenoForMarketplace()`

**Seguridad implementada:**

- ✅ Solo admin puede ver esta sección
- ✅ Usa función RPC `get_user_email()` (solo admin tiene permiso)
- ✅ Confirmación antes de aprobar/rechazar

---

## 🔐 CONFIGURACIÓN DE SEGURIDAD ACTUAL

### **Control de Acceso Admin**

```javascript
// Líneas 56-60
const ADMIN_EMAILS = ['creafilmsvallarta@gmail.com', 'admin@potentia.mx'];

// Línea 124
if (user && ADMIN_EMAILS.includes(user.email)) {
  setIsAdmin(true);
}
```

**Tipo de seguridad:** Lista blanca de emails (hardcoded)

**Ventajas:**

- ✅ Simple de implementar
- ✅ Funciona sin tabla adicional
- ✅ Fácil de entender

**Desventajas:**

- ⚠️ Requiere redeploy para agregar/quitar admins
- ⚠️ No hay logs de acciones de admin
- ⚠️ No hay roles diferenciados (todos admin tienen mismo poder)

---

## 🚨 VULNERABILIDADES Y RIESGOS DETECTADOS

### 🔴 **CRÍTICO - Alta Prioridad**

#### 1. **Sin logs de auditoría**

**Problema:** No hay registro de acciones administrativas
**Riesgo:** No se puede rastrear quién hizo qué y cuándo
**Impacto:** Si algo sale mal, no hay forma de investigar

**Acciones sin log:**

- Eliminación de archivos huérfanos
- Aprobación/rechazo de tours
- Modificación de datos sensibles

#### 2. **Sin protección contra eliminación accidental masiva**

**Problema:** Al limpiar archivos huérfanos, si hay un bug en la lógica, podría eliminar archivos válidos
**Riesgo:** Pérdida de datos irreversible
**Impacto:** Tours completos podrían quedar sin imágenes

#### 3. **Sin validación de permisos en backend**

**Problema:** La validación de admin solo es en frontend
**Riesgo:** Usuario malicioso podría llamar funciones directamente con consola del navegador
**Impacto:** Bypass de seguridad

**Ejemplo de ataque:**

```javascript
// Usuario NO-admin podría ejecutar en consola del navegador:
document.querySelector('button[onClick*="cleanOrphanFiles"]').click();
```

### 🟡 **MEDIO - Media Prioridad**

#### 4. **Sin monitoreo de salud del sistema**

**Problema:** No hay chequeos automáticos periódicos
**Riesgo:** Problemas pueden pasar desapercibidos
**Ejemplos:**

- Storage llegando al límite
- Terrenos corruptos (sin imágenes)
- Hotspots rotos (apuntando a vistas que no existen)

#### 5. **Sin alertas proactivas**

**Problema:** Admin debe revisar manualmente el panel
**Riesgo:** Problemas críticos pueden tardar días en detectarse
**Ejemplos:**

- Usuario reporta error pero admin no lo ve
- Storage lleno bloquea nuevos uploads
- Base de datos con inconsistencias

#### 6. **Sin backup/restore explícito**

**Problema:** No hay herramienta para hacer backup de la BD
**Riesgo:** En caso de error crítico, difícil recuperar datos

### 🟢 **BAJO - Baja Prioridad**

#### 7. **Sin métricas de rendimiento**

**Problema:** No se mide velocidad de carga de tours
**Sugerencia:** Agregar métricas APM (Application Performance Monitoring)

#### 8. **Sin dashboard de errores**

**Problema:** Errores de JavaScript en producción no se rastrean
**Sugerencia:** Integrar Sentry o similar

---

## ✅ MEJORAS PROPUESTAS - PLAN DE ACCIÓN

### **FASE 1: Seguridad Crítica** (1-2 días)

#### ✅ Mejora 1: Sistema de Logs de Auditoría

**Crear tabla:**

```sql
-- admin_logs
CREATE TABLE admin_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'approve_tour', 'reject_tour', 'clean_storage', etc.
  target_id UUID, -- ID del terreno/archivo afectado
  details JSONB, -- Detalles adicionales
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_admin_logs_user ON admin_logs(admin_user_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created ON admin_logs(created_at DESC);
```

**Función para registrar:**

```javascript
const logAdminAction = async (action, targetId = null, details = {}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from('admin_logs').insert({
    admin_user_id: user.id,
    admin_email: user.email,
    action,
    target_id: targetId,
    details,
    ip_address: await fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((d) => d.ip),
    user_agent: navigator.userAgent,
  });
};
```

**Uso:**

```javascript
// Antes de aprobar un tour
await logAdminAction('approve_tour', terrenoId, { title: terreno.title });

// Antes de limpiar archivos
await logAdminAction('clean_storage', null, {
  files_deleted: deletedCount,
  storage_freed_mb: freedSpace,
});
```

---

#### ✅ Mejora 2: Validación Backend con RLS (Row Level Security)

**Crear función SQL:**

```sql
-- Función para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_email IN ('creafilmsvallarta@gmail.com', 'admin@potentia.mx');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policy para admin_logs (solo admins pueden insertar/ver)
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admins pueden insertar logs"
  ON admin_logs FOR INSERT
  WITH CHECK (is_admin(auth.email()));

CREATE POLICY "Solo admins pueden ver logs"
  ON admin_logs FOR SELECT
  USING (is_admin(auth.email()));
```

---

#### ✅ Mejora 3: Protección contra eliminación masiva accidental

**Agregar límite de seguridad:**

```javascript
const cleanOrphanFiles = async () => {
  // ... código existente ...

  // NUEVA VALIDACIÓN DE SEGURIDAD
  const percentageOrphan = (orphanFiles.length / allFiles.length) * 100;

  // Si más del 50% de archivos son "huérfanos", algo está mal
  if (percentageOrphan > 50) {
    setAdminMessage({
      type: 'error',
      text: `⚠️ ALERTA DE SEGURIDAD: ${percentageOrphan.toFixed(1)}% de archivos detectados como huérfanos. Esto es sospechosamente alto. Puede haber un error en la lógica. Revisa manualmente antes de continuar.`,
    });
    setCleaningOrphans(false);
    return;
  }

  // ... resto del código ...
};
```

---

### **FASE 2: Monitoreo y Salud del Sistema** (2-3 días)

#### ✅ Mejora 4: Health Check Automático

**Crear función de diagnóstico:**

```javascript
const runSystemHealthCheck = async () => {
  const issues = [];

  // 1. Verificar terrenos sin imágenes
  const { data: terrenosVacios } = await supabase
    .from('terrenos')
    .select('id, title')
    .or('image_urls.is.null,image_urls.eq.{}');

  if (terrenosVacios?.length > 0) {
    issues.push({
      severity: 'warning',
      type: 'terrenos_sin_imagenes',
      count: terrenosVacios.length,
      message: `${terrenosVacios.length} terrenos sin imágenes`,
      items: terrenosVacios,
    });
  }

  // 2. Verificar hotspots rotos
  const { data: allHotspots } = await supabase.from('hotspots').select('*');
  const { data: allTerrenos } = await supabase
    .from('terrenos')
    .select('id, image_urls');

  const brokenHotspots = allHotspots.filter((h) => {
    const terreno = allTerrenos.find((t) => t.id === h.terreno_id);
    if (!terreno) return true; // Terreno no existe
    return h.target_panorama_index >= terreno.image_urls?.length; // Índice fuera de rango
  });

  if (brokenHotspots.length > 0) {
    issues.push({
      severity: 'error',
      type: 'hotspots_rotos',
      count: brokenHotspots.length,
      message: `${brokenHotspots.length} hotspots apuntan a vistas inexistentes`,
    });
  }

  // 3. Verificar uso de storage
  if (storageData && systemStats) {
    const usagePercent =
      (storageData.totalSizeMB / systemStats.storageLimitMB) * 100;
    if (usagePercent > 80) {
      issues.push({
        severity: 'warning',
        type: 'storage_alto',
        message: `Storage al ${usagePercent.toFixed(1)}% de capacidad`,
        details: `${storageData.totalSizeMB} MB de ${systemStats.storageLimitMB} MB`,
      });
    }
  }

  // 4. Verificar usuarios sin perfil
  const { data: users } = await supabase.from('user_profiles').select('id');
  const { count: authUsersCount } = await supabase.auth.admin.listUsers();

  if (authUsersCount > users.length) {
    issues.push({
      severity: 'error',
      type: 'usuarios_sin_perfil',
      count: authUsersCount - users.length,
      message: `${authUsersCount - users.length} usuarios sin perfil en user_profiles`,
    });
  }

  return issues;
};
```

**UI para mostrar resultados:**

```javascript
// Botón en dashboard
<button onClick={runSystemHealthCheck}>🏥 Chequeo de Salud del Sistema</button>;

// Panel de resultados
{
  healthCheckIssues && (
    <div className="space-y-2">
      {healthCheckIssues.map((issue, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg ${
            issue.severity === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          } border-2`}
        >
          <p className="font-semibold">{issue.message}</p>
          {issue.details && <p className="text-sm">{issue.details}</p>}
        </div>
      ))}
    </div>
  );
}
```

---

#### ✅ Mejora 5: Cron Job / Chequeos Periódicos

**Opción A: Usar Supabase Edge Functions (Recomendado)**

Crear función que se ejecute cada 24h:

```typescript
// supabase/functions/daily-health-check/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const supabase = createClient(...)

  // Ejecutar health check
  const issues = await runSystemHealthCheck(supabase)

  // Si hay problemas críticos, enviar email al admin
  if (issues.some(i => i.severity === 'error')) {
    await sendAdminAlert(issues)
  }

  // Guardar log
  await supabase.from('system_health_logs').insert({
    checked_at: new Date(),
    issues_found: issues.length,
    details: issues
  })

  return new Response('OK')
})
```

**Configurar en Supabase Dashboard:**

```
Functions → Create → daily-health-check
Trigger: CRON → 0 2 * * * (ejecutar a las 2 AM diariamente)
```

**Opción B: Usar Vercel Cron Jobs**

```typescript
// pages/api/cron/health-check.ts
export default async function handler(req, res) {
  // Validar secret para seguridad
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Ejecutar health check
  const issues = await runSystemHealthCheck();

  res.json({ success: true, issues });
}
```

```javascript
// vercel.json
{
  "crons": [{
    "path": "/api/cron/health-check",
    "schedule": "0 2 * * *"
  }]
}
```

---

### **FASE 3: Herramientas Avanzadas** (4-5 días)

#### ✅ Mejora 6: Panel de Logs de Admin

**UI para ver logs:**

```javascript
// Estado
const [adminLogs, setAdminLogs] = useState([]);

// Cargar logs
const loadAdminLogs = async (limit = 50) => {
  const { data } = await supabase
    .from('admin_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  setAdminLogs(data);
};

// UI
<div className="bg-white rounded-xl shadow-lg p-6">
  <h3 className="font-bold text-lg mb-4">📜 Registro de Actividad Admin</h3>
  <table className="w-full">
    <thead>
      <tr className="border-b">
        <th>Fecha</th>
        <th>Admin</th>
        <th>Acción</th>
        <th>Detalles</th>
      </tr>
    </thead>
    <tbody>
      {adminLogs.map((log) => (
        <tr key={log.id} className="border-b hover:bg-slate-50">
          <td>{new Date(log.created_at).toLocaleString()}</td>
          <td>{log.admin_email}</td>
          <td>
            <span
              className={`px-2 py-1 rounded text-xs ${
                log.action.includes('approve')
                  ? 'bg-green-100 text-green-800'
                  : log.action.includes('reject')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
              }`}
            >
              {log.action}
            </span>
          </td>
          <td className="text-sm text-slate-600">
            {JSON.stringify(log.details)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;
```

---

#### ✅ Mejora 7: Botón de "Reparar Sistema"

**Función para arreglar problemas comunes:**

```javascript
const repairSystem = async () => {
  const fixes = [];

  // 1. Crear perfiles faltantes
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const { data: profiles } = await supabase.from('user_profiles').select('id');

  const missingProfiles = authUsers.filter(
    (u) => !profiles.find((p) => p.id === u.id),
  );

  for (const user of missingProfiles) {
    await supabase.from('user_profiles').insert({
      id: user.id,
      email: user.email,
      subscription_plan: 'free',
      max_tours: 2,
    });
    fixes.push(`Creado perfil para ${user.email}`);
  }

  // 2. Eliminar hotspots rotos
  const { data: brokenHotspots } = await findBrokenHotspots();
  for (const h of brokenHotspots) {
    await supabase.from('hotspots').delete().eq('id', h.id);
    fixes.push(`Eliminado hotspot roto #${h.id}`);
  }

  // 3. Actualizar view_names faltantes
  const { data: terrenos } = await supabase
    .from('terrenos')
    .select('id, image_urls, view_names')
    .or('view_names.is.null');

  for (const t of terrenos) {
    const defaultNames = t.image_urls.map((_, i) => `Vista ${i + 1}`);
    await supabase
      .from('terrenos')
      .update({ view_names: defaultNames })
      .eq('id', t.id);
    fixes.push(`Generados nombres de vista para tour "${t.title}"`);
  }

  return fixes;
};

// Botón en UI
<button
  onClick={async () => {
    const fixes = await repairSystem();
    setAdminMessage({
      type: 'success',
      text: `✅ Reparaciones completadas:\n${fixes.join('\n')}`,
    });
  }}
  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg"
>
  🔧 Reparar Sistema Automáticamente
</button>;
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Seguridad Crítica** (Hacer AHORA)

- [ ] Crear tabla `admin_logs`
- [ ] Implementar función `logAdminAction()`
- [ ] Agregar logging a todas las acciones de admin
- [ ] Crear función SQL `is_admin()`
- [ ] Agregar RLS policies para proteger admin_logs
- [ ] Agregar validación de % de archivos huérfanos antes de eliminar

### **Monitoreo** (Hacer esta semana)

- [ ] Implementar `runSystemHealthCheck()`
- [ ] Crear UI para mostrar resultados del health check
- [ ] Botón "Chequeo de Salud" en dashboard
- [ ] Configurar Cron Job (Supabase Edge Function o Vercel Cron)
- [ ] Crear tabla `system_health_logs` para historial

### **Herramientas Avanzadas** (Hacer próxima semana)

- [ ] Panel de logs de admin con filtros
- [ ] Función `repairSystem()` para arreglar problemas automáticamente
- [ ] Alertas por email cuando hay problemas críticos
- [ ] Exportar logs a CSV
- [ ] Dashboard de métricas (visitas, conversiones, etc.)

---

## 🎯 RECOMENDACIONES FINALES

### **Inmediato (Hoy/Mañana):**

1. ✅ Implementar sistema de logs (crítico para auditoría)
2. ✅ Agregar validación de % de archivos huérfanos
3. ✅ Crear función de health check manual

### **Corto Plazo (Esta semana):**

4. Configurar Cron Job para health checks automáticos
5. Agregar panel de logs de admin

### **Mediano Plazo (Próximas 2 semanas):**

6. Sistema de alertas por email
7. Función de reparación automática
8. Dashboard de métricas avanzadas

### **Largo Plazo (Próximo mes):**

9. Integración con Sentry para tracking de errores
10. Sistema de backups automáticos
11. Roles diferenciados (super-admin, moderador, etc.)

---

**Documento creado:** 18 de Enero, 2025
**Próxima revisión:** Después de implementar Fase 1
**Responsable:** Admin Security & Monitoring
