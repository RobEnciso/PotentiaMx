# 🔧 Solución: Solo se ve 1 terreno en Marketplace (deberían ser 2)

## 📋 Problema

Tienes 2 terrenos marcados con:

- `is_marketplace_listing = true`
- `status = 'active'`

Pero solo se muestra 1 en la página `/propiedades`

---

## 🔍 PASO 1: Verificar los Datos (5 minutos)

### Opción A: Desde Supabase Dashboard

1. Ve a **Supabase Dashboard** → https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Table Editor** (menú lateral)
4. Selecciona la tabla **`terrenos`**
5. **Busca** todos los terrenos que tienen `is_marketplace_listing = true`

**¿Qué buscar?**

- ✅ Ambos terrenos tienen `is_marketplace_listing = true`
- ✅ Ambos terrenos tienen `status = 'active'`
- ✅ Ambos terrenos tienen imágenes en `image_urls` o `cover_image_url`
- ⚠️ Si uno tiene `status = 'pending_approval'`, cámbialo manualmente a `'active'`

### Opción B: Desde SQL Editor (Más preciso)

1. Ve a **SQL Editor** en Supabase
2. Ejecuta esta consulta:

```sql
SELECT
  id,
  title,
  is_marketplace_listing,
  status,
  user_id,
  created_at
FROM terrenos
WHERE is_marketplace_listing = true
ORDER BY created_at DESC;
```

**Resultado esperado:** Deberías ver 2 filas

---

## 🔍 PASO 2: Revisar Políticas RLS (10 minutos)

### Ver Políticas Actuales

En **SQL Editor**, ejecuta:

```sql
SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'terrenos';
```

### Políticas Necesarias

Debes tener una política llamada algo como:

- `"Anyone can view marketplace listings"` O
- `"Public marketplace access"` O
- Similar

### ⚠️ PROBLEMA COMÚN

Si la política tiene `auth.uid()` en el `USING`, **no funcionará para usuarios anónimos**.

La política correcta debe ser:

```sql
CREATE POLICY "Public marketplace access"
ON terrenos
FOR SELECT
USING (
  is_marketplace_listing = true
  AND status = 'active'
);
```

**SIN `auth.uid()`** porque el marketplace es público.

---

## 🔧 PASO 3: Solución Rápida (Ejecuta esto en SQL Editor)

Copia y pega COMPLETO en **SQL Editor** de Supabase:

```sql
-- 1. Eliminar política antigua si existe
DROP POLICY IF EXISTS "Anyone can view marketplace listings" ON terrenos;
DROP POLICY IF EXISTS "Public marketplace access" ON terrenos;
DROP POLICY IF EXISTS "anon_marketplace" ON terrenos;

-- 2. Crear política correcta para marketplace público
CREATE POLICY "public_marketplace_listings"
ON terrenos
FOR SELECT
USING (
  is_marketplace_listing = true
  AND status = 'active'
);

-- 3. Verificar que funcionó
SELECT
  id,
  title,
  is_marketplace_listing,
  status
FROM terrenos
WHERE is_marketplace_listing = true
  AND status = 'active';
```

**Resultado esperado de la consulta final:** 2 filas

---

## 🐛 PASO 4: Debugging en el Navegador

Ya agregué código de debugging a `/propiedades`. Ahora:

1. **Abre** tu aplicación en: `http://localhost:3000/propiedades`
2. **Presiona F12** para abrir la consola del navegador
3. **Busca** los logs que dicen: `=== DEBUGGING MARKETPLACE ===`

### Qué Verificar en la Consola:

```
=== DEBUGGING MARKETPLACE ===
📊 Total terrenos recibidos: 1   ← DEBERÍA DECIR 2
📋 Datos completos: Array(1)     ← DEBERÍA SER Array(2)
❌ Error (si existe): null
============================
```

**Si dice "Total terrenos recibidos: 1":**

- El problema está en **Supabase RLS**
- Ejecuta el PASO 3 de nuevo

**Si dice "Total terrenos recibidos: 2":**

- Los datos llegan correctamente
- El problema podría ser en el renderizado (poco probable)

---

## 🔍 PASO 5: Verificación Final

### En Modo Incógnito (Importante)

1. **Abre** una ventana de incógnito en tu navegador
2. Ve a: `http://localhost:3000/propiedades`
3. **Deberías ver 2 terrenos**

¿Por qué incógnito?

- Modo incógnito simula un usuario NO autenticado
- El marketplace debe funcionar sin login
- Si funciona solo cuando estás logueado, hay un problema de políticas RLS

---

## ✅ PASO 6: Verificar Cada Terreno Individualmente

Ejecuta en **SQL Editor**:

```sql
-- Ver terreno 1 (reemplaza con el ID real)
SELECT * FROM terrenos WHERE id = 'AQUI-TU-PRIMER-ID';

-- Ver terreno 2 (reemplaza con el ID real)
SELECT * FROM terrenos WHERE id = 'AQUI-TU-SEGUNDO-ID';
```

Verifica que AMBOS tengan:

- `is_marketplace_listing = true` ✅
- `status = 'active'` ✅
- `image_urls` con al menos 1 imagen ✅

---

## 🚨 Problemas Comunes y Soluciones

### Problema 1: Solo veo 1 terreno

**Causa:** Uno de los terrenos no cumple los filtros
**Solución:**

```sql
-- Actualizar manualmente
UPDATE terrenos
SET
  is_marketplace_listing = true,
  status = 'active'
WHERE id = 'ID-DEL-TERRENO-FALTANTE';
```

### Problema 2: No veo ningún terreno

**Causa:** Políticas RLS bloqueando acceso público
**Solución:** Ejecutar el PASO 3 completo

### Problema 3: Veo los 2 terrenos solo cuando estoy logueado

**Causa:** Política RLS requiere autenticación
**Solución:**

```sql
-- La política NO debe tener auth.uid()
-- Debe ser así:
CREATE POLICY "public_marketplace"
ON terrenos FOR SELECT
USING (is_marketplace_listing = true AND status = 'active');
```

### Problema 4: Error "new row violates row-level security policy"

**Causa:** Intentas crear terrenos sin `user_id`
**Solución:** Esto es diferente al problema del marketplace, pero asegúrate de que al crear terrenos siempre incluyes `user_id: user.id`

---

## 📊 Checklist Final

- [ ] Ejecuté la consulta del PASO 1 y veo 2 terrenos
- [ ] Ambos terrenos tienen `is_marketplace_listing = true`
- [ ] Ambos terrenos tienen `status = 'active'`
- [ ] Ejecuté el script SQL del PASO 3 (políticas RLS)
- [ ] Abrí `/propiedades` en modo incógnito
- [ ] Veo 2 terrenos en la página
- [ ] Revisé la consola (F12) y dice "Total terrenos recibidos: 2"

---

## 🆘 Si Nada Funciona

Si después de todo esto sigues viendo solo 1 terreno:

1. **Copia** los resultados de esta consulta:

```sql
SELECT
  id,
  title,
  is_marketplace_listing,
  status,
  is_public_embed,
  user_id,
  created_at,
  image_urls
FROM terrenos
ORDER BY created_at DESC;
```

2. **Toma screenshot** de:
   - La consola del navegador (F12) en `/propiedades`
   - Las políticas RLS en Supabase (resultado de ver pg_policies)

3. **Avísame** y revisamos juntos

---

## 📝 Nota sobre RLS

**Row Level Security (RLS)** funciona así:

- ✅ **CON auth.uid()**: Solo usuarios autenticados ven datos
- ✅ **SIN auth.uid()**: Usuarios anónimos también ven datos

Para marketplace PÚBLICO necesitas políticas **SIN auth.uid()**.

Para datos privados del usuario necesitas políticas **CON auth.uid()**.

En tu caso:

- Dashboard → Necesita `auth.uid() = user_id`
- Marketplace → NO necesita `auth.uid()`
- Embed → NO necesita `auth.uid()`

---

**¡Mucha suerte!** Avísame qué encuentras después de ejecutar estos pasos.
