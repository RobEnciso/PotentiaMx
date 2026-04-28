# 🔧 GUÍA DE INTEGRACIÓN - Dashboard Admin con Tabs

**Fecha:** 18 de Enero, 2025
**Objetivo:** Reorganizar dashboard admin en 3 tabs (Supervisión, Documentación, Logs)

---

## 📋 ARCHIVOS CREADOS

### ✅ Funciones de Utilidad:

1. `lib/adminImpersonate.js` - Funciones de impersonación
2. `lib/adminDocumentation.js` - Gestión de documentación y Drive
3. `lib/adminSecurity.js` - Ya existía (health checks, logs)

### ✅ Componentes:

1. `components/AdminImpersonateBanner.js` - Banner cuando estás impersonando
2. `components/admin/DocumentationTab.js` - Tab de documentación
3. `components/admin/LogsTab.js` - Tab de logs

---

## 🔨 CAMBIOS A REALIZAR EN `app/dashboard/page.js`

### PASO 1: Agregar Imports (al inicio del archivo)

```javascript
// NUEVO: Imports para tabs y funcionalidades admin
import { useState } from 'react'; // Asegurar que useState está importado
import AdminImpersonateBanner from '@/components/AdminImpersonateBanner';
import DocumentationTab from '@/components/admin/DocumentationTab';
import LogsTab from '@/components/admin/LogsTab';
import { isImpersonating } from '@/lib/adminImpersonate';
```

### PASO 2: Agregar Estado para Tabs (después de los useState existentes)

Buscar la sección donde están los estados (useState) y agregar:

```javascript
// NUEVO: Estado para tabs del admin
const [adminActiveTab, setAdminActiveTab] = useState('supervision');
// Opciones: 'supervision', 'documentation', 'logs'
```

### PASO 3: Agregar Banner de Impersonación (después del <header> pero antes del <main>)

Buscar donde termina el `</header>` y antes de `<main>`, agregar:

```javascript
{
  /* NUEVO: Banner de impersonación */
}
<AdminImpersonateBanner />;
```

### PASO 4: Reorganizar Sección de Admin en Tabs

Buscar la sección que empieza con:

```javascript
{/* Admin Tools Section */}
{isAdmin && (
  <div className="mb-8">
```

Y REEMPLAZARLA con:

```javascript
{
  /* Admin Section con Tabs */
}
{
  isAdmin && (
    <div className="mb-8">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-2 mb-6 flex gap-2">
        <button
          onClick={() => setAdminActiveTab('supervision')}
          className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            adminActiveTab === 'supervision'
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          📊 Supervisión
        </button>
        <button
          onClick={() => setAdminActiveTab('documentation')}
          className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            adminActiveTab === 'documentation'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          📚 Documentación
        </button>
        <button
          onClick={() => setAdminActiveTab('logs')}
          className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            adminActiveTab === 'logs'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          📜 Logs & Auditoría
        </button>
      </div>

      {/* Tab Content */}
      {adminActiveTab === 'supervision' && (
        <div>
          {/* TODO CONTENIDO ADMIN ACTUAL VA AQUÍ */}
          {/* Estadísticas del Sistema */}
          {/* Herramientas de Gestión */}
          {/* Aprobación de Marketplace */}
          {/* etc. */}

          {/* NOTA: NO tocar el contenido, solo envolverlo en este <div> */}
        </div>
      )}

      {adminActiveTab === 'documentation' && <DocumentationTab />}

      {adminActiveTab === 'logs' && <LogsTab />}
    </div>
  );
}
```

### PASO 5: Agregar Sección "Tours Oficiales de Potentia MX"

Dentro del tab 'supervision', DESPUÉS de las estadísticas del sistema pero ANTES de las herramientas de gestión, agregar:

```javascript
{
  /* Gestión de Tours Oficiales de Potentia MX */
}
<div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 mb-6">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
        <Home className="w-6 h-6 text-white" />
      </div>
      <div className="text-white">
        <h3 className="text-xl font-bold">Tours Oficiales de Potentia MX</h3>
        <p className="text-blue-100 text-sm">
          Tours de demostración y ejemplos para clientes
        </p>
      </div>
    </div>
  </div>

  <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
    <div className="grid md:grid-cols-3 gap-4 text-white">
      <div>
        <p className="text-sm text-blue-100">Usuario Interno</p>
        <p className="font-bold">tours@potentiamx.com</p>
      </div>
      <div>
        <p className="text-sm text-blue-100">Tours Activos</p>
        <p className="font-bold">2 demos oficiales</p>
      </div>
      <div>
        <p className="text-sm text-blue-100">Plan</p>
        <p className="font-bold">Premium (Ilimitado)</p>
      </div>
    </div>
  </div>

  <div className="mt-4 flex gap-3">
    <a
      href="/login"
      target="_blank"
      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
    >
      🎭 Gestionar Tours Oficiales
    </a>
    <button
      onClick={() => {
        alert(
          'Para gestionar los tours oficiales:\n\n1. Haz clic en "Gestionar Tours Oficiales"\n2. Inicia sesión con: tours@potentiamx.com\n3. Gestiona los tours normalmente\n4. Cuando termines, cierra sesión y vuelve a entrar como admin',
        );
      }}
      className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-lg transition-all"
    >
      ℹ️ Cómo funciona
    </button>
  </div>

  <div className="mt-3 p-3 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-400/30">
    <p className="text-sm text-yellow-100">
      💡 <strong>Tip:</strong> Los tours de este usuario se mostrarán en el
      marketplace con badge "DEMO OFICIAL" y se usan como ejemplos para clientes
      potenciales.
    </p>
  </div>
</div>;
```

---

## 📝 RESUMEN DE CAMBIOS

### Estructura Final del Dashboard Admin:

```
┌────────────────────────────────────────────────┐
│  [⚠️ Banner de Impersonación] (si aplica)     │
├────────────────────────────────────────────────┤
│  Header con Logo, User Info, Logout            │
├────────────────────────────────────────────────┤
│                                                 │
│  [📊 Supervisión] [📚 Documentación] [📜 Logs]│
│  ─────────────────────────────────────────────│
│                                                 │
│  TAB SUPERVISIÓN:                              │
│  • Estadísticas del Sistema                    │
│  • Tours Oficiales de Potentia MX (NUEVO)     │
│  • Herramientas de Gestión                     │
│  • Aprobación de Marketplace                   │
│                                                 │
│  TAB DOCUMENTACIÓN:                            │
│  • Google Drive Integration                    │
│  • Documentación Técnica                       │
│  • Scripts SQL                                 │
│  • Enlaces Externos                            │
│                                                 │
│  TAB LOGS:                                     │
│  • Logs de Acciones de Admin                   │
│  • Historial de Health Checks                  │
│  • Filtros y búsqueda                          │
│  • Exportar a CSV                              │
│                                                 │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  Sección de "Mis Tours" (Usuarios Normales)   │
│  (Solo se muestra si NO eres admin)            │
└────────────────────────────────────────────────┘
```

---

## ⚙️ CONFIGURACIÓN ADICIONAL

### 1. Actualizar URLs de Google Drive

Editar `lib/adminDocumentation.js` y reemplazar los placeholders:

```javascript
export const GOOGLE_DRIVE_CONFIG = {
  mainFolder: 'https://drive.google.com/drive/folders/TU_ID_AQUI',
  folders: {
    documentation: 'https://drive.google.com/drive/folders/TU_ID_AQUI',
    sqlScripts: 'https://drive.google.com/drive/folders/TU_ID_AQUI',
    branding: 'https://drive.google.com/drive/folders/TU_ID_AQUI',
    marketing: 'https://drive.google.com/drive/folders/TU_ID_AQUI',
  },
};
```

### 2. Crear Usuario Interno en Supabase

1. **Ir a Supabase Dashboard → Authentication → Users**
2. **Click "Add User"**
   - Email: `tours@potentiamx.com`
   - Password: (genera una segura y guárdala)
   - Email Confirmed: ✅ Yes
3. **Click "Create User"**

4. **Actualizar perfil del usuario:**

```sql
-- Ejecutar en Supabase SQL Editor
UPDATE user_profiles
SET
  subscription_plan = 'premium',
  max_tours = 999,
  company_name = 'Potentia MX - Tours Oficiales',
  full_name = 'Potentia MX'
WHERE email = 'tours@potentiamx.com';
```

### 3. Ejecutar Scripts SQL (si no lo has hecho)

```sql
-- 1. Sistema de logs y seguridad
\i sql_migrations/create_admin_security_system.sql

-- 2. Verificar que la función is_admin incluya el nuevo admin si es necesario
-- (Ya debería estar configurada en create_admin_security_system.sql)
```

---

## 🧪 CÓMO PROBAR

### Test 1: Navegación por Tabs

1. Entra al dashboard como admin
2. Verifica que se muestran 3 tabs: Supervisión, Documentación, Logs
3. Haz clic en cada tab y verifica que el contenido cambia
4. El tab activo debe tener fondo con gradiente

### Test 2: Gestionar Tours Oficiales

1. En tab "Supervisión", busca la sección "Tours Oficiales de Potentia MX"
2. Click en "🎭 Gestionar Tours Oficiales"
3. Te abre el login en nueva pestaña
4. Inicia sesión con `tours@potentiamx.com`
5. Gestiona los tours como usuario normal
6. Cierra sesión y vuelve a entrar como admin

### Test 3: Documentación

1. Ir a tab "Documentación"
2. Verifica que se muestran todos los archivos .md
3. Click en "Ver Archivo" debe abrir el documento
4. Click en botón de Drive debe abrir Google Drive
5. Buscar un documento en el buscador

### Test 4: Logs

1. Ir a tab "Logs"
2. Ver historial de acciones de admin
3. Filtrar por tipo de acción
4. Buscar logs específicos
5. Exportar a CSV

### Test 5: Banner de Impersonación (cuando esté implementado)

1. (Futuro) Al impersonar a otro usuario, debe aparecer banner amarillo en la parte superior
2. Banner debe mostrar email del usuario impersonado
3. Botón "Volver a Admin" debe funcionar

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Agregar imports al inicio de dashboard/page.js
- [ ] Agregar estado `adminActiveTab`
- [ ] Agregar `<AdminImpersonateBanner />` después del header
- [ ] Reorganizar sección admin con tabs
- [ ] Agregar sección "Tours Oficiales de Potentia MX"
- [ ] Actualizar URLs de Google Drive en adminDocumentation.js
- [ ] Crear usuario `tours@potentiamx.com` en Supabase
- [ ] Actualizar perfil del usuario a Premium
- [ ] Ejecutar SQL de sistema de logs (si no está hecho)
- [ ] Probar navegación por tabs
- [ ] Probar acceso a documentación
- [ ] Probar visualización de logs
- [ ] Crear 2 tours de demostración con usuario tours@potentiamx.com

---

## 🎯 BENEFICIOS DE ESTA IMPLEMENTACIÓN

✅ **Separación de Contextos**

- Admin del sistema ≠ Usuario con tours
- Dashboard limpio y enfocado

✅ **Mejor Organización**

- Toda la documentación en un solo lugar
- Logs y auditoría centralizados
- Herramientas de supervisión agrupadas

✅ **Escalabilidad**

- Fácil agregar nuevos tabs
- Fácil agregar nuevas herramientas admin
- Estructura modular con componentes

✅ **Profesionalismo**

- UX más clara
- Navegación intuitiva
- Documentación accesible

✅ **Aprovechamiento de Google Workspace**

- Integración con Google Drive
- Toda la documentación respaldada en la nube
- Fácil colaboración con equipo

---

## 📞 SOPORTE

Si encuentras problemas durante la implementación:

1. Revisa que todos los archivos están en las rutas correctas
2. Verifica que no hay errores en la consola del navegador
3. Asegúrate que los imports están correctos
4. Verifica que el usuario tours@potentiamx.com fue creado

---

**Documento creado:** 18 de Enero, 2025
**Siguiente paso:** Implementar cambios en dashboard/page.js
