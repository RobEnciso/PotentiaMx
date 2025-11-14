# 📋 RESUMEN DEL PANEL DE ADMINISTRADOR - POTENTIAMX

**Fecha de revisión**: 2025-01-19
**Admin Principal**: admin@potentiamx.com (Roberto)

---

## 🎯 FUNCIONALIDADES ACTUALES DEL PANEL ADMIN

Tu panel de administrador tiene **3 TABS principales**:

### 1️⃣ TAB: **SUPERVISIÓN** ✅

#### A. **Estadísticas del Sistema**

- **Usuarios Activos**: Cuenta total de usuarios registrados
- **Total Terrenos**: Número total de tours 360° en el sistema
- **Total Imágenes**: Suma de todas las imágenes panorámicas
- **Almacenamiento Usado**: Espacio usado en Supabase Storage

#### B. **Herramientas de Gestión**

**Actualizar Datos** 🔄

- Refresca todas las estadísticas del sistema
- Recalcula uso de almacenamiento
- Ubicación: `Dashboard.js:1052-1077`

**Analizar Storage** 💾

- Escanea TODOS los archivos en Supabase Storage
- Calcula tamaño total en MB
- Muestra distribución por tipo de archivo (.jpg, .png, etc.)
- Detecta si hay archivos muy grandes
- Ubicación: `Dashboard.js:384-455`

**Limpiar Archivos Huérfanos** 🗑️

- Encuentra imágenes en Storage que NO están referenciadas en la base de datos
- Te muestra cuántos archivos huérfanos encontró
- Permite eliminarlos para liberar espacio
- ⚠️ **ADVERTENCIA**: Esta acción NO se puede deshacer
- Ubicación: `Dashboard.js:458-583`

#### C. **Aprobación de Marketplace** ✅❌

- Lista todos los terrenos con estado `pending_approval`
- Muestra email del usuario que publicó
- Muestra vista previa del tour
- **Botones de acción**:
  - ✅ **Aprobar**: Cambia status a `active` → aparece en marketplace
  - ❌ **Rechazar**: Cambia status a `rejected` → NO aparece en marketplace
  - 👁️ **Vista previa**: Abre el tour en nueva pestaña
- Ubicación: `Dashboard.js:685-753`

#### D. **Tours Oficiales de PotentiaMX** 🎭

- Sección especial para gestionar tours de demostración
- Usuario interno: `tours@potentiamx.com`
- Estos tours se muestran como "DEMO OFICIAL" en el marketplace
- Ubicación: `Dashboard.js:1315-1372`

---

### 2️⃣ TAB: **DOCUMENTACIÓN** 📚

**Ubicación**: `components/admin/DocumentationTab.js`

#### Funcionalidades:

- **Búsqueda Global**: Busca en todos los documentos técnicos y scripts SQL
- **Google Drive Integration**: Enlaces directos a la carpeta del proyecto en Drive
- **Documentación Técnica**: Acceso rápido a archivos .md del proyecto
- **Scripts SQL**: Lista de todas las migraciones y scripts de base de datos
- **Enlaces Externos**: Links a Supabase, GitHub, documentación de librerías, etc.

#### Secciones:

1. **Google Drive Workspace**:
   - Carpeta principal
   - Subcarpeta de Docs
   - Subcarpeta de SQL
   - Subcarpeta de Branding

2. **Documentos Técnicos**:
   - Todos los archivos .md del proyecto
   - Categorizados por tipo
   - Con íconos y descripciones

3. **Scripts SQL**:
   - Todas las migraciones
   - Scripts de configuración
   - Scripts de verificación

4. **Enlaces Externos**:
   - Supabase Dashboard
   - GitHub Repository
   - Photo Sphere Viewer Docs
   - Next.js Docs
   - etc.

---

### 3️⃣ TAB: **LOGS & AUDITORÍA** 📜

**Ubicación**: `components/admin/LogsTab.js`

#### A. **Admin Logs** (Acciones de Admin)

Registra TODAS las acciones que haces como administrador:

**Tipos de acciones registradas**:

- ✅ `approve_tour`: Aprobar un tour para marketplace
- ❌ `reject_tour`: Rechazar un tour
- 🗑️ `clean_storage`: Limpiar archivos huérfanos
- 💾 `analyze_storage`: Analizar uso de almacenamiento
- 🏥 `run_health_check`: Ejecutar diagnóstico del sistema
- 🔧 `repair_system`: Reparar problemas encontrados
- 📋 `other`: Otras acciones

**Información registrada**:

- Fecha y hora exacta
- Email del admin
- Acción realizada
- ID del recurso afectado (si aplica)
- Detalles adicionales (JSON)
- IP del administrador
- User agent (navegador)

**Funcionalidades**:

- ⚡ **Filtros**: Por tipo de acción
- 🔍 **Búsqueda**: Busca en todos los campos
- 📥 **Exportar CSV**: Descarga todos los logs
- 🔄 **Actualizar**: Refresca los datos

#### B. **Health Checks** (Diagnósticos del Sistema)

Sistema automático de detección de errores.

**Funcionalidad de "Encontrar Errores"**: `lib/adminSecurity.js:79-247`

El sistema verifica automáticamente:

1. **Terrenos sin imágenes** 📸
   - Detecta tours vacíos (sin image_urls)
   - Severity: ⚠️ Warning

2. **Hotspots rotos** 🎯
   - Detecta hotspots que apuntan a vistas que no existen
   - Ejemplo: Hotspot apunta a panorama #5 pero solo hay 3 imágenes
   - Severity: 🔴 Error

3. **Usuarios sin perfil** 👥
   - Detecta usuarios que tienen terrenos pero no tienen user_profile
   - Esto rompe el sistema de permisos
   - Severity: 🔴 Error

4. **View Names faltantes** 🏷️
   - Detecta terrenos que no tienen nombres para sus vistas
   - Severity: ⚠️ Warning

5. **URLs rotas de imágenes** 🖼️
   - Verifica que las URLs de imágenes sean válidas
   - Severity: 🔴 Error

**Resultado del Health Check**:

- ✅ **OK**: Todo funciona perfecto
- ⚠️ **WARNING**: Problemas menores, no afectan funcionamiento
- 🔴 **ERROR**: Problemas serios que hay que arreglar
- 🚨 **CRITICAL**: Sistema en riesgo, requiere atención inmediata

**Información mostrada**:

- Fecha del chequeo
- Tiempo de ejecución (ms)
- Cantidad de issues encontrados
- Severity general
- Detalles de cada issue

---

## ❌ FUNCIONALIDADES QUE **NO** TIENES (y podemos agregar)

### 1. Botón de Borrar Terrenos en Panel Admin

Actualmente los admins **NO** pueden borrar terrenos de otros usuarios.
Solo los usuarios pueden borrar sus propios terrenos.

**Propuesta**:

- Agregar botón "Borrar" en la lista de terrenos pendientes
- Agregar pestaña "Todos los Terrenos" donde puedas ver y borrar cualquier tour
- Incluir confirmación doble para evitar borrados accidentales
- Registrar en admin_logs cada vez que borres algo

---

## 🐛 PROBLEMAS DETECTADOS EN TU CÓDIGO

### 1. Medición de Espacio en Supabase ⚠️

**Ubicación**: `Dashboard.js:618-623`

```javascript
const storageLimitMB = 1024; // 1 GB para plan free
```

**PROBLEMA**: Este valor está **hardcodeado**.
Si cambias a plan PRO, tendrás que modificar el código manualmente.

**SOLUCIÓN PROPUESTA**:

- Guardar el plan de Supabase en una variable de entorno
- Calcular automáticamente el límite según el plan
- Agregar alerta cuando llegues al 80% de capacidad

---

### 2. Función de Health Check No Se Ejecuta Automáticamente

La función `runSystemHealthCheck()` existe pero **NO SE LLAMA** en el dashboard.

**SOLUCIÓN PROPUESTA**:

- Agregar botón "Ejecutar Diagnóstico" en el tab de Supervisión
- Guardar resultados en la tabla `health_check_history`
- Mostrar últimos resultados con severidad

---

## 📊 TABLAS EN SUPABASE QUE USA EL ADMIN

```
terrenos
├── id
├── user_id
├── title
├── description
├── image_urls[]
├── cover_image_url
├── is_marketplace_listing  ← Usada para marketplace
├── status                  ← 'pending_approval', 'active', 'rejected'
├── sale_price              ← ¡Ya existe! Para el mapa
├── property_type           ← 'terreno', 'casa', 'departamento'
└── created_at

user_profiles
├── id
├── user_type               ← 'admin', 'client_saas', etc.
├── subscription_plan       ← 'free', 'basic', 'pro'
├── max_tours
└── ...

admin_logs
├── id
├── admin_user_id
├── admin_email
├── action
├── target_id
├── details                 ← JSON
├── ip_address
├── user_agent
└── created_at

health_check_history
├── id
├── checked_at
├── severity                ← 'ok', 'warning', 'error', 'critical'
├── issues_found
├── details                 ← JSON array
└── execution_time_ms
```

---

## ✅ PRÓXIMOS PASOS PARA IMPLEMENTAR EL MAPA

Ahora que sabes lo que tienes, podemos proceder con:

1. **Ejecutar script de verificación** en Supabase (`verify_terrenos_structure.sql`)
2. **Agregar columnas** `latitude` y `longitude` a terrenos
3. **Agregar botón de borrar** para admins
4. **Mejorar Health Check** para que se muestre en el dashboard
5. **Implementar mapa** estilo Airbnb en `/propiedades`

---

## 🔐 EMAILS DE ADMINISTRADOR CONFIGURADOS

```javascript
const ADMIN_EMAILS = [
  'admin@potentiamx.com', // Admin principal (TÚ)
  'victor.admin@potentiamx.com', // Admin secundario (futuro)
];
```

**Ubicación**: `Dashboard.js:72-76`

Si usas otro email, debes agregarlo a esta lista.

---

**¿Quieres que continúe con la implementación del mapa o prefieres primero arreglar los problemas detectados?**
