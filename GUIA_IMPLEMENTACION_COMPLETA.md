# 🚀 LandView - Guía de Implementación Completa

## ✅ Lo que YA Está Implementado

### **1. Script SQL (`SETUP_DUAL_MODEL.sql`)** ✅

- Multi-tenancy completo
- Columnas nuevas en `terrenos`: `is_marketplace_listing`, `is_public_embed`, `status`
- Tabla `user_profiles` para roles y suscripciones
- Políticas RLS que protegen datos por usuario
- Trigger automático para crear perfil al registrarse

### **2. Página Embed (`/embed/terreno/[id]`)** ✅

- Visor limpio sin header/footer
- Para clientes SaaS que quieren embeber en sus webs
- Incluye marca de agua (opcional quitar en planes premium)
- URL: `https://landview.com/embed/terreno/123`

### **3. Dashboard Rediseñado (`/dashboard/page.js`)** ✅

- **UI moderna** con Tailwind (coherente con landing)
- **Toggle "Publicar en Marketplace"** en cada tour
- **Botón "Embed"** que abre modal con código iframe
- **Badges de estado**: Pendiente, Publicado, Rechazado
- **Modal embed** con copy to clipboard
- **Muestra límite de tours** según plan del usuario
- **Multi-tenancy**: Solo muestra tus tours

### **4. Página Propiedades (`/propiedades`)** ✅

- **Filtra SOLO tours con `is_marketplace_listing = true`**
- **Filtra SOLO tours con `status = 'active'`**
- Marketplace público (no requiere login)

---

## 📋 Lo que TÚ Debes Hacer (Pasos)

### **Paso 1: Ejecutar Script SQL en Supabase (10 min)**

1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (menú lateral)
4. Abre el archivo **`SETUP_DUAL_MODEL.sql`** de tu proyecto
5. **Copia TODO el contenido**
6. **Pégalo en el SQL Editor**
7. Haz clic en **"Run"** (botón verde)
8. Deberías ver mensajes de éxito ✅

**Verificar que funcionó:**

```sql
-- Ejecuta esta consulta para ver las políticas:
SELECT tablename, policyname FROM pg_policies
WHERE tablename IN ('terrenos', 'hotspots', 'user_profiles');

-- Deberías ver varias políticas listadas
```

---

### **Paso 2: Actualizar Signup (Pendiente)**

El signup actual necesita capturar `user_type`. Opciones:

#### **Opción A: Preguntar al usuario (Recomendado)**

Agregar en el formulario de signup:

```javascript
<div>
  <label>¿Qué quieres hacer con LandView?</label>
  <select name="userType" required>
    <option value="">Selecciona una opción</option>
    <option value="client_marketplace">
      Vender mi propiedad en el marketplace
    </option>
    <option value="client_saas">Crear tours 360° para mi web</option>
    <option value="client_both">Ambas</option>
  </select>
</div>
```

Luego al hacer signup, pasar `userType` en `user_metadata`:

```javascript
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.fullName,
      phone: formData.phone,
      company_name: formData.companyName,
      user_type: formData.userType, // ← NUEVO
      client_type: formData.clientType,
      property_count: formData.propertyCount,
    },
  },
});
```

#### **Opción B: Automático por default**

Si no quieres preguntar, todos los usuarios serán `client_saas` por defecto (pueden hacer ambas cosas).

---

### **Paso 3: Probar el Sistema (20 min)**

#### **Test 1: Crear Usuario y Tour**

1. **Regístrate** con una cuenta de prueba
2. **Ve al Dashboard**
3. **Crea un tour** (agrega fotos, datos, etc.)
4. Verifica que aparece en tu dashboard

#### **Test 2: Obtener Código Embed**

1. En el dashboard, haz clic en **"Embed"** de un tour
2. **Copia el código** del modal
3. **Pégalo** en un archivo HTML local:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test Embed</title>
  </head>
  <body>
    <h1>Mi Tour Embebido</h1>
    <iframe
      src="http://localhost:3000/embed/terreno/TU-ID-AQUI"
      width="100%"
      height="600"
      frameborder="0"
    ></iframe>
  </body>
</html>
```

4. Abre el HTML en el navegador
5. **Deberías ver el tour limpio** (sin header/footer)

#### **Test 3: Publicar en Marketplace**

1. En el dashboard, **activa** el toggle "Publicar en Marketplace"
2. Deberías ver badge **"Pendiente Aprobación"**
3. Ve a `/propiedades` (en otra ventana/incógnito)
4. **NO deberías verlo** (porque está pendiente de aprobación)

#### **Test 4: Aprobar Manualmente (Simulando Admin)**

Desde Supabase:

1. Ve a **Table Editor** → `terrenos`
2. Busca tu terreno (el que marcaste como marketplace)
3. Cambia `status` de `pending_approval` a `active`
4. **Guarda**
5. Ve a `/propiedades`
6. **AHORA SÍ** deberías verlo en el marketplace

#### **Test 5: Multi-Tenancy**

1. **Crea** un segundo usuario (otra cuenta)
2. **Crea** 1-2 tours con Usuario 2
3. **Logout** de Usuario 2
4. **Login** con Usuario 1
5. **Ve al Dashboard**
6. **Deberías ver SOLO** los tours de Usuario 1
7. ❌ **NO deberías ver** los tours de Usuario 2

---

## 🎨 Coherencia Visual Implementada

### **Dashboard**

- ✅ Gradientes teal/slate (igual que landing)
- ✅ Cards con sombras y hover effects
- ✅ Botones con íconos de lucide-react
- ✅ Modal moderno para embed
- ✅ Badges de estado con colores semánticos
- ✅ Header sticky con backdrop blur

### **Páginas Pendientes de Rediseño** (Futuro - Si quieres)

Estas páginas todavía tienen el diseño antiguo:

- `/dashboard/add-terrain` (crear tour)
- `/dashboard/edit-terrain/[id]` (editar tour)
- `/terreno/[id]/editor` (editor de hotspots)

**¿Quieres que las rediseñe también?** Confirma y las actualizo.

---

## 🔄 Flujos de Usuario Completos

### **Flujo A: Cliente Marketplace (Vender Terreno)**

```
1. Usuario se registra → user_type: 'client_marketplace'
   ↓
2. Crea tour en dashboard (fotos, datos, hotspots)
   ↓
3. Activa toggle "Publicar en Marketplace"
   ↓
4. Estado: "Pendiente de Aprobación"
   ↓
5. TÚ (admin) revisas y apruebas
   ↓
6. Estado: "Publicado" → Aparece en /propiedades
   ↓
7. Compradores potenciales ven el tour público
```

### **Flujo B: Cliente SaaS (Editor de Tours)**

```
1. Usuario se registra → user_type: 'client_saas'
   ↓
2. Crea tour en dashboard (fotos, datos, hotspots)
   ↓
3. NO activa marketplace (solo quiere embed)
   ↓
4. Click en "Embed" → Copia código iframe
   ↓
5. Pega código en su web (ej: Casa Golla)
   ↓
6. Tour visible en SU sitio, NO en /propiedades
```

### **Flujo C: Ambos (Marketplace + Embed)**

```
1. Usuario se registra → user_type: 'client_both'
   ↓
2. Crea tour en dashboard
   ↓
3. Obtiene código embed para su web (Flujo B)
   Y
4. Activa marketplace para más exposición (Flujo A)
   ↓
5. Tour visible en AMBOS lugares:
   - Su sitio web (embed)
   - /propiedades (marketplace)
```

---

## 💰 Modelo de Pricing Sugerido

| Plan           | Precio/mes | Tours     | Marketplace | Embed | Marca de Agua |
| -------------- | ---------- | --------- | ----------- | ----- | ------------- |
| **Free**       | $0         | 2         | ❌ No       | ✅ Sí | ✅ Sí         |
| **Basic**      | $29        | 10        | ✅ Sí       | ✅ Sí | ❌ No         |
| **Pro**        | $59        | 50        | ✅ Sí       | ✅ Sí | ❌ No         |
| **Enterprise** | $149       | Ilimitado | ✅ Sí       | ✅ Sí | ❌ No         |

**Implementación del límite:**

El dashboard ya muestra: `Tours: 3/10` (lo obtiene de `user_profiles.max_tours`)

Para bloquear la creación cuando llegan al límite:

```javascript
// En add-terrain/page.js, antes de guardar:
if (terrenos.length >= userProfile.max_tours) {
  alert(
    `Has alcanzado el límite de ${userProfile.max_tours} tours de tu plan ${userProfile.subscription_plan}.`,
  );
  return;
}
```

---

## 🔐 Seguridad Implementada

### **Multi-Tenancy** ✅

- Cada usuario ve solo SUS tours
- No puede editar/eliminar tours de otros
- RLS a nivel de base de datos (no solo frontend)

### **Marketplace** ✅

- Solo tours con `is_marketplace_listing = true` aparecen
- Solo tours con `status = 'active'` son visibles
- Aprobación manual (tú decides qué se publica)

### **Embed** ✅

- Tours con `is_public_embed = true` son accesibles vía iframe
- Embed NO requiere autenticación (es público)
- Marca de agua opcional (quitar en premium)

---

## 📊 Estados de un Tour

| Estado                   | Descripción                  | Visible en Dashboard | Visible en Marketplace | Visible en Embed |
| ------------------------ | ---------------------------- | -------------------- | ---------------------- | ---------------- |
| **active** (default)     | Tour activo, privado         | ✅ Sí (solo dueño)   | ❌ No                  | ✅ Sí            |
| **active** + marketplace | Tour aprobado en marketplace | ✅ Sí                | ✅ Sí                  | ✅ Sí            |
| **pending_approval**     | Esperando aprobación admin   | ✅ Sí (solo dueño)   | ❌ No                  | ✅ Sí (embed)    |
| **rejected**             | Rechazado por admin          | ✅ Sí (solo dueño)   | ❌ No                  | ✅ Sí (embed)    |
| **paused**               | Pausado temporalmente        | ✅ Sí (solo dueño)   | ❌ No                  | ❌ No            |

---

## 🛠️ Funcionalidades Implementadas

### **Dashboard**

- [x] Multi-tenancy (solo tus tours)
- [x] Toggle "Publicar en Marketplace"
- [x] Botón "Embed" con modal
- [x] Copy to clipboard para código iframe
- [x] Badges de estado (Pendiente, Publicado, Rechazado)
- [x] Contador de tours (3/10 según plan)
- [x] Botones: Ver, Editar, Hotspots, Eliminar
- [x] UI moderna coherente con landing

### **Marketplace (`/propiedades`)**

- [x] Filtra solo tours con `is_marketplace_listing = true`
- [x] Filtra solo tours con `status = 'active'`
- [x] Acceso público (sin login)

### **Embed (`/embed/terreno/[id]`)**

- [x] Visor limpio (sin header/footer)
- [x] Marca de agua "Powered by LandView"
- [x] Acceso público (sin login)
- [x] Compatible con iframe

### **Base de Datos**

- [x] Políticas RLS para terrenos
- [x] Políticas RLS para hotspots
- [x] Tabla user_profiles con roles
- [x] Trigger automático al registrarse
- [x] Columnas: is_marketplace_listing, is_public_embed, status

---

## 🚀 Próximos Pasos (Opcional)

### **1. Panel de Admin** (Futuro)

Crear `/admin` donde TÚ puedas:

- Ver TODOS los tours de TODOS los usuarios
- Aprobar/rechazar publicaciones en marketplace
- Ver estadísticas (usuarios, tours, conversiones)
- Gestionar suscripciones

### **2. Rediseñar Páginas Pendientes**

- `/dashboard/add-terrain` → UI moderna con Tailwind
- `/dashboard/edit-terrain/[id]` → UI moderna
- `/terreno/[id]/editor` → Editor de hotspots moderno

### **3. Notificaciones**

- Email cuando tour es aprobado/rechazado
- Email cuando se acerca al límite de tours
- Email de bienvenida al registrarse

### **4. Integración de Pagos**

- Stripe para suscripciones
- Webhooks para actualizar `subscription_plan`
- Portal de cliente para gestionar suscripción

---

## 🐛 Solución de Problemas

### **Error: "is_marketplace_listing does not exist"**

**Causa:** No ejecutaste el SQL script

**Solución:** Ve a Paso 1 y ejecuta `SETUP_DUAL_MODEL.sql`

---

### **Error: "new row violates row-level security policy"**

**Causa:** Intentas crear un tour sin user_id

**Solución:** Verifica que en `add-terrain/page.js` se envíe:

```javascript
user_id: user.id;
```

---

### **No veo nada en `/propiedades`**

**Posibles causas:**

1. **No has activado marketplace en ningún tour**
   - Solución: En dashboard, activa toggle "Publicar en Marketplace"

2. **Tours están en `pending_approval`**
   - Solución: Cambia `status` a `active` desde Supabase Table Editor

3. **Políticas RLS bloqueando**
   - Solución: Ejecuta consulta para verificar políticas:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'terrenos';
   ```

---

### **Dashboard no muestra plan ni límite de tours**

**Causa:** No existe perfil de usuario en `user_profiles`

**Solución:**

1. Verifica que el trigger `on_auth_user_created` existe
2. Si no existe, ejecuta de nuevo la sección 8 del SQL script
3. O crea manualmente el perfil:

```sql
INSERT INTO user_profiles (id, user_type, subscription_plan, max_tours)
VALUES ('TU-USER-ID', 'client_saas', 'free', 2);
```

---

## ✅ Checklist Final

- [ ] Ejecutar `SETUP_DUAL_MODEL.sql` en Supabase
- [ ] Verificar que las políticas RLS se crearon
- [ ] Registrar usuario de prueba
- [ ] Crear tour de prueba
- [ ] Probar botón "Embed" y copiar código
- [ ] Probar toggle "Publicar en Marketplace"
- [ ] Verificar que `/propiedades` filtra correctamente
- [ ] Probar embed en archivo HTML local
- [ ] Crear segundo usuario y verificar multi-tenancy
- [ ] (Opcional) Actualizar signup para capturar user_type
- [ ] (Opcional) Rediseñar add-terrain y edit-terrain

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:

1. **Revisa los logs** en consola del navegador (F12)
2. **Revisa los logs** en Supabase Dashboard → Logs → Auth
3. **Verifica las políticas RLS** con las consultas SQL del script
4. **Avísame** y te ayudo a resolverlo

---

**¡Todo listo para lanzar tu plataforma dual!** 🚀

Ahora tienes:

- ✅ Marketplace de terrenos (Puerto Vallarta)
- ✅ SaaS de editor de tours 360°
- ✅ Multi-tenancy seguro
- ✅ Embed para clientes
- ✅ UI moderna y coherente
