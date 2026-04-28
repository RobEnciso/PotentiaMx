# 🔐 Configuración de Multi-Tenancy (Cuentas Independientes)

**Problema que resolvemos:** Actualmente, TODOS los usuarios ven y pueden editar TODOS los terrenos. Esto es un problema crítico de seguridad.

**Solución:** Cada usuario solo verá y podrá editar SUS propios terrenos.

---

## 📋 ¿Qué se Hizo?

### 1. ✅ Código Actualizado (Ya está listo)

He actualizado el código de tu aplicación para que:

#### **Dashboard (`app/dashboard/page.js`)**

- ✅ Ahora filtra terrenos por `user_id` (solo muestra TUS propiedades)
- ✅ Verifica ownership antes de permitir eliminar un terreno

#### **Editar Terreno (`app/dashboard/edit-terrain/[id]/page.js`)**

- ✅ Verifica que el terreno pertenece al usuario actual
- ✅ Redirige al dashboard si intentas editar un terreno que no es tuyo

#### **Editor de Hotspots (`app/terreno/[id]/editor/page.js`)**

- ✅ Verifica ownership antes de permitir editar hotspots
- ✅ Redirige al dashboard si intentas editar hotspots de otro usuario

#### **Crear Terreno (`app/dashboard/add-terrain/page.js`)**

- ✅ Ya guardaba el `user_id` correctamente (no se modificó)

---

## 🚀 Lo que TÚ Debes Hacer: Configurar Supabase

### Paso 1: Abrir Supabase Dashboard

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **"SQL Editor"**

---

### Paso 2: Copiar el Script SQL

1. Abre el archivo que acabo de crear: **`SUPABASE_RLS_SETUP.sql`**
2. Copia TODO el contenido (desde la línea 1 hasta el final)

---

### Paso 3: Ejecutar en Supabase

1. Pega el código en el SQL Editor de Supabase
2. Haz clic en **"Run"** (botón verde abajo a la derecha)
3. Deberías ver un mensaje de éxito ✅

---

### Paso 4: Verificar que Funcionó

Ejecuta estas consultas en el SQL Editor para verificar:

```sql
-- Ver políticas de la tabla terrenos
SELECT * FROM pg_policies WHERE tablename = 'terrenos';

-- Ver políticas de la tabla hotspots
SELECT * FROM pg_policies WHERE tablename = 'hotspots';
```

Deberías ver **4 políticas para terrenos** y **4 políticas para hotspots**.

---

## 🧪 Probar que Funciona

### Test 1: Crear Dos Cuentas de Usuario

1. **Logout** de tu cuenta actual
2. **Registra** un nuevo usuario (Usuario A): `usuarioA@ejemplo.com`
3. **Crea** 2-3 terrenos con Usuario A
4. **Logout** de Usuario A
5. **Registra** otro usuario (Usuario B): `usuarioB@ejemplo.com`
6. **Crea** 1-2 terrenos con Usuario B

---

### Test 2: Verificar Aislamiento

#### Con Usuario B logueado:

1. **Ve al Dashboard**
   - ✅ Deberías ver SOLO los terrenos de Usuario B
   - ❌ NO deberías ver los terrenos de Usuario A

2. **Intenta acceder manualmente a un terreno de Usuario A**
   - Copia el ID de un terreno de Usuario A desde la base de datos
   - Intenta navegar a: `http://localhost:3000/dashboard/edit-terrain/[ID_DE_USUARIO_A]`
   - ✅ Deberías ver un mensaje de error: "No tienes permiso para editar este terreno"
   - ✅ Deberías ser redirigido al dashboard

3. **Intenta editar hotspots de Usuario A**
   - Navega a: `http://localhost:3000/terreno/[ID_DE_USUARIO_A]/editor`
   - ✅ Deberías ver: "No tienes permiso para editar este terreno"

---

### Test 3: Verificar Funcionalidad Normal

Con Usuario B logueado:

1. ✅ Puedes crear nuevos terrenos (se guardan con tu user_id)
2. ✅ Puedes editar TUS terrenos
3. ✅ Puedes eliminar TUS terrenos
4. ✅ Puedes editar hotspots de TUS terrenos
5. ❌ NO puedes ver/editar terrenos de otros usuarios

---

## 🔍 ¿Qué es Row Level Security (RLS)?

**Explicación simple:**

Imagina que tu base de datos es como un edificio de apartamentos:

- **SIN RLS**: Todos tienen llaves maestras y pueden entrar a cualquier apartamento 🚨
- **CON RLS**: Cada persona solo puede abrir SU propio apartamento 🔐

**RLS hace cumplir las reglas a nivel de base de datos**, no solo en el frontend. Esto significa que incluso si alguien intenta acceder directamente a la API, Supabase bloqueará el acceso.

---

## 📊 Cómo Funciona en tu App

### Antes (❌ Inseguro):

```javascript
// Dashboard mostraba TODOS los terrenos
const { data } = await supabase.from('terrenos').select('*');
// Resultado: [{terreno de Juan}, {terreno de María}, {terreno de Pedro}]
```

### Ahora (✅ Seguro):

```javascript
// Dashboard muestra SOLO tus terrenos
const { data } = await supabase
  .from('terrenos')
  .select('*')
  .eq('user_id', user.id); // ← Filtra por tu ID

// Resultado: [{solo TUS terrenos}]
```

**ADEMÁS**, Supabase ahora verifica a nivel de base de datos:

- Si intentas hacer `SELECT * FROM terrenos`, solo verás los tuyos
- Si intentas hacer `UPDATE terrenos WHERE id = 'terreno-de-otro'`, Supabase lo rechazará
- Si intentas hacer `DELETE FROM terrenos WHERE id = 'terreno-de-otro'`, Supabase lo rechazará

---

## 🌐 ¿Qué Pasa con la Página Pública `/propiedades`?

### Opción 1: Mostrar TODAS las propiedades (Marketplace)

Si quieres que `/propiedades` muestre propiedades de TODOS los usuarios (como un marketplace):

1. **Descomenta** esta línea en `SUPABASE_RLS_SETUP.sql`:

```sql
CREATE POLICY "Anyone can view all terrenos for public display"
ON terrenos
FOR SELECT
USING (true);
```

2. Ejecuta esa línea en el SQL Editor
3. Ahora `/propiedades` mostrará todas las propiedades públicamente
4. Pero el dashboard seguirá siendo privado (solo tus propiedades)

### Opción 2: Mostrar SOLO tus propiedades (Privado)

Si quieres que cada usuario solo vea SUS propiedades en `/propiedades`:

- No hagas nada, ya está configurado así por defecto
- `/propiedades` y `/dashboard` mostrarán lo mismo (solo tus terrenos)

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa con los terrenos que ya creé antes?

Todos los terrenos que creaste ya tienen tu `user_id` guardado. No necesitas hacer nada, seguirán siendo tuyos.

### ¿Puedo compartir un terreno con otro usuario?

Actualmente no. Si necesitas esto en el futuro, podríamos agregar:

- Una tabla `terreno_permissions` que permita compartir acceso
- Roles (admin, editor, viewer)

### ¿Los viewers del tour 360° necesitan cuenta?

NO. Cualquiera puede ver los tours 360° en `/terreno/[id]` sin tener cuenta. Las restricciones solo aplican al dashboard y a la edición.

### ¿Qué pasa si borro las políticas RLS?

Si eliminas las políticas, TODOS los usuarios volverían a ver TODOS los terrenos (como estaba antes). **No lo hagas** a menos que sepas lo que haces.

---

## 🆘 Solución de Problemas

### Error: "new row violates row-level security policy"

**Causa:** Intentas insertar un terreno sin `user_id` o con un `user_id` que no es el tuyo.

**Solución:** Verifica que en `add-terrain/page.js` se esté enviando `user_id: user.id`

---

### Error: "No hay usuario autenticado"

**Causa:** Tu sesión expiró.

**Solución:** Logout y login de nuevo.

---

### No veo ningún terreno en el dashboard

**Posibles causas:**

1. **No has creado terrenos con esta cuenta**
   - Solución: Crea un terreno nuevo

2. **Los terrenos fueron creados con otra cuenta**
   - Solución: Busca en la base de datos qué `user_id` tienen tus terrenos
   - Ve a Supabase → Table Editor → terrenos → Revisa la columna `user_id`

3. **Las políticas RLS están bloqueando todo**
   - Solución: Ejecuta en SQL Editor:

   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'terrenos';
   ```

   - Deberías ver 4 políticas. Si no las ves, vuelve a ejecutar `SUPABASE_RLS_SETUP.sql`

---

## 📝 Checklist Final

Marca cuando completes cada paso:

- [ ] Ejecutar `SUPABASE_RLS_SETUP.sql` en Supabase SQL Editor
- [ ] Verificar que las políticas se crearon (4 para terrenos, 4 para hotspots)
- [ ] Crear dos cuentas de prueba (Usuario A y Usuario B)
- [ ] Crear terrenos con cada usuario
- [ ] Verificar que Usuario A NO ve terrenos de Usuario B
- [ ] Verificar que Usuario B NO puede editar terrenos de Usuario A
- [ ] Decidir si `/propiedades` será público o privado
- [ ] (Opcional) Ejecutar la política adicional para `/propiedades` público

---

## ✅ ¡Listo!

Después de completar estos pasos:

- ✅ Cada usuario solo verá sus propios terrenos en el dashboard
- ✅ Los usuarios no podrán editar/eliminar terrenos de otros
- ✅ La seguridad está garantizada a nivel de base de datos
- ✅ Tu aplicación está lista para múltiples clientes

---

## 🚀 Próximos Pasos (Opcional)

Una vez que tengas multi-tenancy funcionando, podrías agregar:

1. **Panel de Administración** (para ti como super admin)
   - Ver TODOS los terrenos de TODOS los usuarios
   - Estadísticas de uso
   - Gestión de usuarios

2. **Planes de Suscripción**
   - Limitar cantidad de terrenos por usuario
   - Planes Free, Pro, Enterprise

3. **Compartir Acceso**
   - Permitir que un usuario invite a otros a colaborar en un terreno

4. **Onboarding Mejorado**
   - Tutorial interactivo para nuevos usuarios
   - Demo con datos de ejemplo

---

**¿Tienes dudas?** Avísame y te ayudo a configurar todo paso a paso.
