# 📋 PASO 1: Preparar Base de Datos con Slugs

## 🎯 Objetivo
Agregar y generar slugs SEO-friendly para todos los terrenos en tu base de datos Supabase.

---

## 🚀 Instrucciones de Ejecución

### 1️⃣ Abrir Supabase SQL Editor

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: **landview-app-cms**
3. En el menú lateral, haz clic en **SQL Editor**
4. Haz clic en **New Query** (+ New Query)

---

### 2️⃣ Ejecutar Scripts en Orden

#### **Script 1: Verificar si existe la columna slug**

📄 **Archivo:** `STEP1_VERIFICAR_SLUG.sql`

**Qué hace:** Revisa si tu tabla ya tiene el campo `slug`

**Cómo ejecutar:**
1. Abre el archivo `STEP1_VERIFICAR_SLUG.sql`
2. Copia todo el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **Run** (o presiona Ctrl+Enter)

**Resultado esperado:**
- ✅ **Si devuelve 1 fila:** Ya tienes el campo slug → **Salta al Script 3**
- ❌ **Si no devuelve nada:** No existe → **Continúa al Script 2**

---

#### **Script 2: Crear columna slug (SOLO si no existe)**

📄 **Archivo:** `STEP1_CREAR_SLUG.sql`

**Qué hace:** Crea la columna `slug` y su índice

**Cómo ejecutar:**
1. Abre el archivo `STEP1_CREAR_SLUG.sql`
2. Copia todo el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **Run**

**Resultado esperado:**
```
column_name | data_type         | is_nullable
slug        | character varying | YES
```

---

#### **Script 3: Generar slugs para todos los terrenos**

📄 **Archivo:** `STEP1_GENERAR_SLUGS.sql`

**Qué hace:**
- Crea una función que convierte títulos en slugs
- Genera slugs para todos los terrenos existentes
- Agrega constraint UNIQUE para evitar duplicados

**Cómo ejecutar:**
1. Abre el archivo `STEP1_GENERAR_SLUGS.sql`
2. Copia todo el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **Run**

**Resultado esperado:**
```
total_terrenos | terrenos_con_slug | terrenos_sin_slug
             5 |                 5 |                 0
```

**⚠️ IMPORTANTE:** Si este script falla con el error:
```
Se encontraron X slugs duplicados
```
→ **Continúa al Script 4 (Opcional)**

**✅ SI NO HAY ERROR:** Salta al Script 5 (Verificación Final)

---

#### **Script 4: Corregir slugs duplicados (OPCIONAL - Solo si hubo error)**

📄 **Archivo:** `STEP1_VERIFICAR_DUPLICADOS.sql`

**Qué hace:** Detecta y corrige automáticamente slugs duplicados

**Cómo ejecutar:**
1. Abre el archivo `STEP1_VERIFICAR_DUPLICADOS.sql`
2. Copia todo el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **Run**

**Resultado esperado:**
```
(no rows) ← Significa que ya no hay duplicados
```

**Después de ejecutar este script:** Vuelve a ejecutar el **Script 3** para agregar el constraint UNIQUE.

---

#### **Script 5: Verificación completa**

📄 **Archivo:** `STEP1_VERIFICACION_COMPLETA.sql`

**Qué hace:** Verifica que todo esté configurado correctamente

**Cómo ejecutar:**
1. Abre el archivo `STEP1_VERIFICACION_COMPLETA.sql`
2. Copia todo el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **Run**

**Resultado esperado:**
```
verificacion                    | resultado
------------------------------- | ---------
Columna slug existe            | ✅ SÍ
Todos los terrenos tienen slug | ✅ SÍ
No hay slugs duplicados        | ✅ SÍ
Índice idx_terrenos_slug existe| ✅ SÍ
Constraint UNIQUE en slug      | ✅ SÍ
```

**También verás:**
- Estadísticas generales de tus terrenos
- Muestra de los primeros 10 slugs generados

---

## 📊 Ejemplos de Slugs Generados

Así se verán tus slugs después de ejecutar los scripts:

| Título Original | Slug Generado |
|----------------|---------------|
| "Terreno para Desarrollo 666 m²" | `terreno-para-desarrollo-666-m2-78c9a3b2` |
| "Casa Vista al Mar Puerto Vallarta" | `casa-vista-al-mar-puerto-vallarta-4f5e6d7a` |
| "Departamento Amueblado Zona Hotelera" | `departamento-amueblado-zona-hotelera-1a2b3c4d` |

**Nota:** El sufijo al final (`78c9a3b2`) son los primeros 8 caracteres del UUID del terreno, lo que garantiza que el slug sea único.

---

## ✅ Confirmación Final

Cuando hayas ejecutado todos los scripts y el Script 5 muestre todos ✅, escribe a Claude:

```
Claude, los slugs están listos en Supabase.
Procede con el PASO 2 (Refactorización de Ruta).
```

---

## 🆘 Problemas Comunes

### Error: "permission denied for table terrenos"
**Solución:** Asegúrate de estar conectado con el usuario correcto de Supabase (service_role o postgres)

### Error: "function generate_slug already exists"
**Solución:** Es normal si ejecutas el script más de una vez. El script usa `CREATE OR REPLACE`, así que sobrescribirá la función existente.

### Error: "duplicate key value violates unique constraint"
**Solución:** Hay slugs duplicados. Ejecuta el Script 4 (STEP1_VERIFICAR_DUPLICADOS.sql)

### Los slugs se ven raros o cortados
**Solución:** Es normal. La función limpia caracteres especiales y acentos para hacer URLs válidas.

---

## 🔒 Seguridad

Estos scripts:
- ✅ NO eliminan datos existentes
- ✅ NO modifican tus terrenos actuales (solo agregan el campo slug)
- ✅ Son reversibles (puedes eliminar la columna slug si algo sale mal)
- ✅ Usan transacciones seguras

**Backup recomendado:** Antes de ejecutar, exporta tu tabla `terrenos` desde Supabase Dashboard → Table Editor → Export.

---

## 📞 Soporte

Si algo sale mal o tienes dudas:
1. Copia el mensaje de error completo
2. Envíaselo a Claude
3. Claude te ayudará a solucionarlo

---

**Creado por:** Claude Code
**Fecha:** 2025-11-19
**Proyecto:** LandView App CMS - Implementación de Slugs SEO
