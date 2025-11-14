# 🎨 REDISEÑO DEL DASHBOARD DE ADMINISTRADOR

**Fecha:** 18 de Enero, 2025
**Objetivo:** Separar contextos y organizar mejor el panel de administrador

---

## 📊 ESTRUCTURA PROPUESTA

### **Dashboard de Admin con Navegación por Tabs**

```
┌─────────────────────────────────────────────────────────────┐
│  PotentiaMX Admin Dashboard                    [Logout]     │
├─────────────────────────────────────────────────────────────┤
│  [📊 Supervisión] [🏠 Tours Potentia] [📚 Documentación]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CONTENIDO DEL TAB SELECCIONADO                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 TAB 1: SUPERVISIÓN (Principal)

**Este es el tab por defecto cuando entras como admin**

### Secciones:

#### 1️⃣ **Métricas del Sistema** (Top)

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 👥 Usuarios │ 🏠 Tours    │ 📸 Imágenes │ 💾 Storage  │
│    156      │    342      │   1,284     │  245 MB     │
└─────────────┴─────────────┴─────────────┴─────────────┘

[████████████░░░░░░░░] 23.9% de storage usado
```

#### 2️⃣ **Health Check del Sistema**

```
┌──────────────────────────────────────────────────┐
│ 🏥 Estado del Sistema: ✅ SALUDABLE             │
├──────────────────────────────────────────────────┤
│ Último chequeo: Hace 2 horas                     │
│ • 0 errores críticos                             │
│ • 2 advertencias menores                         │
│                                                   │
│ [🔍 Ejecutar Health Check]  [📜 Ver Historial]  │
└──────────────────────────────────────────────────┘
```

#### 3️⃣ **Herramientas de Gestión**

```
┌────────────────────────────────────────────────┐
│ [📊 Actualizar Datos]  [🗑️ Limpiar Storage]   │
│ [🔧 Reparar Sistema]   [📜 Ver Logs Admin]    │
└────────────────────────────────────────────────┘
```

#### 4️⃣ **Aprobación de Marketplace**

```
┌──────────────────────────────────────────────────┐
│ 🏪 Tours Pendientes de Aprobación (3)           │
├──────────────────────────────────────────────────┤
│ 1. "Casa en Guadalajara" - user@email.com       │
│    [✅ Aprobar] [❌ Rechazar] [👁️ Preview]      │
│                                                   │
│ 2. "Terreno en Zapopan" - otro@email.com        │
│    [✅ Aprobar] [❌ Rechazar] [👁️ Preview]      │
└──────────────────────────────────────────────────┘
```

#### 5️⃣ **Gráficas y Analytics**

```
┌──────────────────────────────────────────────────┐
│ 📈 Crecimiento de Usuarios (Últimos 30 días)    │
│                                                   │
│     ▁▂▃▄▅▆█ (Gráfica de líneas)                │
│                                                   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 📊 Tours Creados por Mes                        │
│                                                   │
│  ████ Jan  ██████ Feb  ███ Mar                  │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 🏠 TAB 2: TOURS POTENTIA MX

**Tours oficiales de la empresa (demos, ejemplos, showroom)**

### Propósito:

- Tours de demostración para mostrar a clientes potenciales
- Ejemplos de "mejores prácticas"
- Showroom de funcionalidades

### Contenido:

```
┌──────────────────────────────────────────────────┐
│ 🏠 Tours Oficiales de Potentia MX               │
├──────────────────────────────────────────────────┤
│                                                   │
│ ┌─────────────────┐  ┌─────────────────┐        │
│ │ [Imagen Tour 1] │  │ [Imagen Tour 2] │        │
│ │ Casa Demo       │  │ Terreno Ejemplo │        │
│ │ [Editar] [Ver]  │  │ [Editar] [Ver]  │        │
│ └─────────────────┘  └─────────────────┘        │
│                                                   │
│ [➕ Agregar Tour Oficial]                        │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Funcionalidades especiales:

- ✅ Badge "DEMO OFICIAL" en estos tours
- ✅ Siempre visibles en marketplace (no requieren aprobación)
- ✅ Usados como templates/ejemplos
- ✅ Métricas separadas (visitas, conversiones)

---

## 📚 TAB 3: DOCUMENTACIÓN

**Centro de documentos y recursos administrativos**

### Secciones:

#### 1️⃣ **Documentación Técnica**

```
┌──────────────────────────────────────────────────┐
│ 📁 Documentación del Proyecto                   │
├──────────────────────────────────────────────────┤
│ 📄 ROADMAP_PRIORIZADO.md          [Ver] [Drive] │
│ 📄 ADMIN_PANEL_SECURITY_AUDIT.md  [Ver] [Drive] │
│ 📄 SPRINT_0_COMPLETADO.md         [Ver] [Drive] │
│ 📄 MODELO_NEGOCIO_TRIPLE.md       [Ver] [Drive] │
│ 📄 IDENTIDAD_VISUAL_POTENTIA.md   [Ver] [Drive] │
│                                                   │
│ [📂 Ver Todos en Google Drive]                  │
└──────────────────────────────────────────────────┘
```

#### 2️⃣ **Scripts SQL**

```
┌──────────────────────────────────────────────────┐
│ 💾 Migraciones SQL                              │
├──────────────────────────────────────────────────┤
│ ⚙️ add_property_types.sql                       │
│ ⚙️ create_admin_security_system.sql             │
│ ⚙️ fix_plan_free_limit_to_2_tours.sql           │
│                                                   │
│ [📂 Ver Carpeta sql_migrations]                 │
└──────────────────────────────────────────────────┘
```

#### 3️⃣ **Enlaces Rápidos**

```
┌──────────────────────────────────────────────────┐
│ 🔗 Recursos Externos                            │
├──────────────────────────────────────────────────┤
│ 🌐 Supabase Dashboard                           │
│ 📧 Resend Email Dashboard                       │
│ 📊 Google Analytics                              │
│ 💳 Stripe Dashboard (cuando se integre)         │
│ 📁 Google Drive - Potentia MX                   │
│ 📝 Google Docs - Documentación                  │
└──────────────────────────────────────────────────┘
```

#### 4️⃣ **Integración con Google Drive**

```
┌──────────────────────────────────────────────────┐
│ ☁️ Google Drive Workspace                       │
├──────────────────────────────────────────────────┤
│                                                   │
│ 📁 Potentia MX (Carpeta Principal)              │
│   ├─ 📄 Documentación/                          │
│   ├─ 💻 Scripts SQL/                            │
│   ├─ 🎨 Activos de Marca/                       │
│   └─ 📈 Marketing y Ventas/                     │
│                                                   │
│ [🔗 Abrir en Google Drive]                      │
│                                                   │
│ Última sincronización: Hace 5 minutos           │
└──────────────────────────────────────────────────┘
```

---

## 🎯 DECISIÓN: ¿Usuario Interno o Admin?

### **OPCIÓN A: Usuario Interno Separado** ⭐ RECOMENDADA

**Crear usuario:** `tours@potentiamx.com`

**Ventajas:**

- ✅ Separación total de roles
- ✅ Admin dashboard 100% enfocado en supervisión
- ✅ Permisos claros (admin vs usuario normal)
- ✅ Más profesional y escalable
- ✅ Facilita testing (puedes probar flujos como usuario normal)

**Desventajas:**

- ⚠️ Requiere login separado para gestionar esos tours
- ⚠️ Necesitas cambiar de cuenta

**Solución a la desventaja:**

- Agregar botón en dashboard admin: "Ver como Usuario Normal"
- Te permite hacer "impersonate" del usuario tours@potentiamx.com
- Similar a cómo funciona Shopify/WordPress

```javascript
// Botón en admin dashboard
<button onClick={() => loginAsUser('tours@potentiamx.com')}>
  🎭 Ver como Usuario Tours
</button>
```

---

### **OPCIÓN B: Tab Especial en Admin**

**Tours del admin en sección separada**

**Ventajas:**

- ✅ Todo en un solo lugar
- ✅ No necesitas cambiar de cuenta
- ✅ Fácil acceso

**Desventajas:**

- ⚠️ Mezcla roles (eres admin Y usuario)
- ⚠️ Menos limpio arquitectónicamente
- ⚠️ Puede confundir en el futuro

---

## 📋 MI RECOMENDACIÓN FINAL

### **Implementar OPCIÓN A + Mejoras UX**

1. **Crear usuario interno:** `tours@potentiamx.com`
   - Plan: Premium (para probar todas las features)
   - Tours: 2-3 demos oficiales de Potentia MX

2. **Dashboard Admin con 3 tabs:**
   - 📊 Supervisión (principal)
   - 📚 Documentación
   - 🎭 (Opcional) Gestión Rápida

3. **En tab "Supervisión", agregar sección:**

   ```
   ┌────────────────────────────────────────┐
   │ 🏠 Tours Oficiales de Potentia MX      │
   ├────────────────────────────────────────┤
   │ Usuario: tours@potentiamx.com          │
   │ Tours activos: 2                       │
   │                                         │
   │ [🎭 Gestionar Tours Oficiales]         │
   │     ↓                                   │
   │ (Te lleva al dashboard de ese usuario) │
   └────────────────────────────────────────┘
   ```

4. **Funcionalidad "Impersonate User":**
   - Te permite "loguearte como" el usuario tours@
   - Sin necesidad de saber la contraseña
   - Solo admin puede hacer esto
   - Similar a Laravel Nova, Shopify, etc.

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### **1. Crear Usuario Interno**

```sql
-- Ejecutar en Supabase SQL Editor

-- 1. Crear usuario en auth.users (esto se hace desde el dashboard de Supabase)
-- Dashboard → Authentication → Add User
-- Email: tours@potentiamx.com
-- Password: (generar una segura)
-- Confirm email: YES

-- 2. Actualizar su perfil a Premium
UPDATE user_profiles
SET
  subscription_plan = 'premium',
  max_tours = 999, -- ilimitado
  company_name = 'Potentia MX',
  role = 'official_tours' -- nuevo campo opcional
WHERE email = 'tours@potentiamx.com';
```

### **2. Función "Impersonate User"**

```javascript
// lib/adminImpersonate.js

export async function impersonateUser(targetUserEmail) {
  const supabase = createClient();

  // 1. Verificar que quien llama sea admin
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const ADMIN_EMAILS = ['creafilmsvallarta@gmail.com', 'admin@potentia.mx'];

  if (!ADMIN_EMAILS.includes(currentUser.email)) {
    throw new Error('Solo admins pueden impersonar usuarios');
  }

  // 2. Guardar sesión admin actual en localStorage
  localStorage.setItem(
    'admin_impersonating',
    JSON.stringify({
      admin_email: currentUser.email,
      target_email: targetUserEmail,
      started_at: new Date().toISOString(),
    }),
  );

  // 3. Crear sesión temporal como el otro usuario
  // NOTA: Esto requiere una función RPC especial en Supabase
  const { error } = await supabase.rpc('admin_create_impersonate_session', {
    target_email: targetUserEmail,
  });

  if (error) throw error;

  // 4. Recargar página (ahora estás como el otro usuario)
  window.location.href = '/dashboard';
}

export function stopImpersonating() {
  const impersonateData = localStorage.getItem('admin_impersonating');
  if (!impersonateData) return;

  localStorage.removeItem('admin_impersonating');

  // Volver a loguearte como admin
  window.location.href = '/dashboard';
}

export function isImpersonating() {
  return localStorage.getItem('admin_impersonating') !== null;
}
```

### **3. Banner de Advertencia cuando estás Impersonando**

```javascript
// Mostrar en top del dashboard
{
  isImpersonating() && (
    <div className="bg-yellow-500 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span className="font-semibold">
          Estás viendo como:{' '}
          {JSON.parse(localStorage.getItem('admin_impersonating')).target_email}
        </span>
      </div>
      <button
        onClick={stopImpersonating}
        className="px-4 py-1 bg-white text-yellow-700 font-semibold rounded hover:bg-yellow-50"
      >
        Volver a Admin
      </button>
    </div>
  );
}
```

---

## 📁 INTEGRACIÓN CON GOOGLE DRIVE

### **Opción 1: Enlaces Directos (Más Simple)**

```javascript
// En tab de Documentación
const GOOGLE_DRIVE_LINKS = {
  mainFolder: 'https://drive.google.com/drive/folders/TU_ID_DE_CARPETA',
  docs: 'https://drive.google.com/drive/folders/ID_CARPETA_DOCS',
  sql: 'https://drive.google.com/drive/folders/ID_CARPETA_SQL',
  branding: 'https://drive.google.com/drive/folders/ID_CARPETA_BRANDING',
};

// Botón
<a href={GOOGLE_DRIVE_LINKS.mainFolder} target="_blank" className="...">
  📂 Abrir en Google Drive
</a>;
```

### **Opción 2: Google Drive API (Más Avanzado)**

Mostrar archivos directamente en el dashboard:

```javascript
// Requiere configurar Google Drive API
import { GoogleDriveClient } from '@/lib/googleDrive';

const files = await GoogleDriveClient.listFiles({
  folderId: 'TU_FOLDER_ID',
  mimeType: 'application/vnd.google-apps.document',
});

// Mostrar lista
{
  files.map((file) => (
    <div key={file.id}>
      <a href={file.webViewLink} target="_blank">
        📄 {file.name}
      </a>
    </div>
  ));
}
```

---

## 🎯 RESUMEN DE LA PROPUESTA

### **Arquitectura Final:**

1. **Usuario Admin** (`creafilmsvallarta@gmail.com`)
   - Dashboard con 3 tabs: Supervisión, Documentación, Logs
   - Herramientas de gestión y monitoreo
   - Puede "impersonar" a otros usuarios

2. **Usuario Interno** (`tours@potentiamx.com`)
   - Dueño de los 2-3 tours oficiales de Potentia MX
   - Plan Premium
   - Tours marcados como "DEMO OFICIAL"

3. **Integración Google Drive**
   - Tab de Documentación con enlaces directos
   - Carpetas organizadas en Drive
   - Acceso rápido a todos los .md y SQL

### **Beneficios:**

- ✅ Separación clara de roles
- ✅ Dashboard admin enfocado en supervisión
- ✅ Fácil acceso a documentación
- ✅ Tours oficiales gestionables
- ✅ Escalable para el futuro

---

## 📋 PRÓXIMOS PASOS

¿Qué quieres implementar primero?

**A)** Reorganizar dashboard admin en tabs (1-2 horas)
**B)** Crear usuario interno + función impersonate (1 hora)
**C)** Agregar tab de Documentación con Drive (30 min)
**D)** Todo lo anterior en orden (3-4 horas total)

Dime cómo quieres proceder y empezamos.
