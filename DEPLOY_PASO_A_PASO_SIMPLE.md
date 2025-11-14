# 🚀 Guía SÚPER SIMPLE - Deploy Paso a Paso

**Para:** Roberto (no programador)
**Tiempo:** 15-20 minutos
**Nivel:** Principiante total

---

## 📝 ANTES DE EMPEZAR

### Cosas que necesitas tener:

1. ✅ Tu computadora con el proyecto abierto (ya lo tienes)
2. ✅ Cuenta en GitHub (si no la tienes, créala en github.com)
3. ✅ Cuenta en Netlify (si no la tienes, créala en netlify.com)
4. ✅ Tu archivo `.env.local` abierto (lo abriste, perfecto)

---

## PARTE 1: Verificar que tu proyecto funciona (3 minutos)

### Paso 1.1: Abrir la Terminal

**Windows:**

1. Presiona tecla **Windows + R**
2. Escribe: `cmd`
3. Presiona Enter
4. Te aparecerá una ventana negra (la terminal)

### Paso 1.2: Ir a la carpeta de tu proyecto

En la terminal negra, copia y pega esto (luego Enter):

```bash
cd C:\Users\Roberto\landview-app-cms
```

### Paso 1.3: Probar que compile

Copia y pega esto en la terminal:

```bash
npm run build:netlify
```

**¿Qué va a pasar?**

- Verás muchas líneas moviéndose
- Tarda 1-2 minutos
- Al final debe decir algo como "Compiled successfully"

**Si sale error:**

- Toma captura de pantalla del error
- Me lo envías y lo arreglamos

**Si dice "Compiled successfully":**

- ✅ ¡Perfecto! Continúa al siguiente paso

---

## PARTE 2: Subir tu proyecto a GitHub (5 minutos)

### Paso 2.1: ¿Ya tienes GitHub Desktop?

**SI NO LO TIENES:**

1. Ve a https://desktop.github.com/
2. Descarga e instala GitHub Desktop
3. Abre GitHub Desktop
4. Inicia sesión con tu cuenta de GitHub

**SI YA LO TIENES:**

1. Abre GitHub Desktop

### Paso 2.2: Agregar tu proyecto a GitHub Desktop

En GitHub Desktop:

1. Click en **"File"** (arriba a la izquierda)
2. Click en **"Add local repository"**
3. Click en **"Choose..."**
4. Navega a: `C:\Users\Roberto\landview-app-cms`
5. Click en **"Add repository"**

**Si te dice "This directory does not appear to be a Git repository":**

1. Click en **"create a repository"**
2. Deja todo como está
3. Click en **"Create repository"**

### Paso 2.3: Publicar en GitHub

En GitHub Desktop:

1. Verás una lista de archivos a la izquierda
2. En la esquina inferior izquierda, donde dice "Summary", escribe:
   ```
   Sistema completo listo para producción
   ```
3. Click en el botón azul **"Commit to main"**
4. Arriba verás un botón **"Publish repository"** o **"Push origin"**
5. Click en ese botón
6. Si te pregunta si quieres hacerlo privado o público, selecciona **"Keep this code private"**
7. Click en **"Publish repository"**

**Espera 30 segundos** mientras sube los archivos.

✅ **¡Listo!** Tu código está en GitHub.

---

## PARTE 3: Configurar Netlify (7 minutos)

### Paso 3.1: Entrar a Netlify

1. Ve a https://app.netlify.com/
2. Inicia sesión (o regístrate si no tienes cuenta)
   - **Recomendación:** Usa "Sign up with GitHub" (es más fácil)

### Paso 3.2: Crear nuevo sitio

1. Click en el botón verde grande **"Add new site"**
2. Click en **"Import an existing project"**
3. Click en **"Deploy with GitHub"**
4. Si te pide autorización, click en **"Authorize Netlify"**
5. Verás una lista de tus repositorios
6. **BUSCA:** "landview-app-cms" o "potentiamx"
7. Click en ese repositorio

### Paso 3.3: Configuración del Build

Te aparecerá una pantalla con opciones. **NO CAMBIES NADA**, solo:

1. Baja hasta el final de la página
2. Click en el botón **"Deploy [nombre-del-repo]"**

**Espera 3-5 minutos** mientras Netlify construye tu sitio.

Verás una pantalla que dice "Site deploy in progress"

---

## PARTE 4: Agregar tus Claves Secretas (5 minutos)

### Paso 4.1: Abrir tu archivo .env.local

1. En tu computadora, abre el archivo `.env.local` (ya lo tienes abierto)
2. Verás algo como esto:

```
NEXT_PUBLIC_SUPABASE_URL=https://tuhojmupstisctgaepsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_...
```

3. **Deja esa ventana abierta** (la necesitarás para copiar)

### Paso 4.2: Ir a configuración de Netlify

1. En Netlify, click en **"Site configuration"** (arriba)
2. En el menú de la izquierda, click en **"Environment variables"**
3. Click en el botón **"Add a variable"** (o "Add a single variable")

### Paso 4.3: Agregar PRIMERA variable

1. En **"Key"**, escribe exactamente: `NEXT_PUBLIC_SUPABASE_URL`
2. En **"Value"**, COPIA el valor de tu `.env.local` (la línea que dice `NEXT_PUBLIC_SUPABASE_URL=...`)
   - Solo copia lo que está DESPUÉS del `=`
   - Ejemplo: `https://tuhojmupstisctgaepsc.supabase.co`
3. Click en **"Add variable"**

### Paso 4.4: Agregar SEGUNDA variable

Repite el proceso para:

**Variable 2:**

- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: (copia el valor de tu `.env.local`)

**Variable 3:**

- Key: `SUPABASE_SERVICE_ROLE_KEY`
- Value: (copia el valor de tu `.env.local`)

**Variable 4 (opcional):**

- Key: `RESEND_API_KEY`
- Value: (copia el valor de tu `.env.local`, si lo tienes)

### Paso 4.5: Volver a hacer deploy

**IMPORTANTE:** Después de agregar las variables, necesitas hacer deploy de nuevo.

1. Click en **"Deploys"** (arriba)
2. Click en el botón **"Trigger deploy"**
3. Click en **"Deploy site"**
4. **Espera 3-5 minutos**

---

## PARTE 5: Verificar que funciona (2 minutos)

### Paso 5.1: Ver tu sitio en vivo

1. Cuando termine de hacer deploy, verás un mensaje verde **"Published"**
2. Arriba verás una URL como: `https://nombre-random-123.netlify.app`
3. **Click en esa URL**
4. Se abre tu sitio en el navegador

### Paso 5.2: Probar que funciona

En tu sitio:

1. ¿Ves la página de inicio? ✅
2. ¿Puedes hacer login? ✅
3. Click en **"Login"**
4. Ingresa tu email y password
5. ¿Te lleva al dashboard? ✅

**Si todo funciona:**

- ✅ ¡FELICIDADES! Tu sitio está en línea

**Si algo NO funciona:**

- Toma captura de pantalla
- Dime qué error ves

---

## PARTE 6 (OPCIONAL): Conectar tu dominio potentiamx.com

### Solo si quieres que sea www.potentiamx.com en lugar de la URL random

### Paso 6.1: En Netlify

1. Click en **"Domain management"** (en el menú de la izquierda)
2. Click en **"Add domain"**
3. Escribe: `www.potentiamx.com`
4. Click en **"Add domain"**
5. Te mostrará algo como: "Point www to [tu-sitio].netlify.app"
6. **Deja esta página abierta**

### Paso 6.2: En Namecheap

1. Ve a https://www.namecheap.com/
2. Inicia sesión
3. Click en **"Domain List"**
4. Encuentra `potentiamx.com`
5. Click en **"Manage"**
6. Click en la pestaña **"Advanced DNS"**
7. En "HOST RECORDS", click en **"Add new record"**

**Agregar registro 1:**

- Type: **CNAME Record**
- Host: **www**
- Value: **[tu-sitio].netlify.app** (copia esto de Netlify)
- TTL: **Automatic**
- Click en el checkmark ✓ para guardar

**Agregar registro 2:**

- Type: **A Record**
- Host: **@**
- Value: **75.2.60.5**
- TTL: **Automatic**
- Click en el checkmark ✓ para guardar

### Paso 6.3: Esperar

- DNS tarda entre 10 minutos a 2 horas en propagarse
- Ve a tomar un café ☕
- Después de 30 minutos, prueba: https://www.potentiamx.com

---

## 🎉 ¡TERMINASTE!

Tu sitio está en:

- **Temporal:** https://[nombre-random].netlify.app
- **Tu dominio:** https://www.potentiamx.com (después de configurar DNS)

---

## 🆘 Si algo sale mal

**Error al hacer build:**

- Copia el error completo
- Envíamelo para ayudarte

**El sitio no carga:**

- Espera 5 minutos más
- Revisa que agregaste TODAS las variables de entorno

**Login no funciona:**

- Verifica que copiaste bien las claves de Supabase
- Haz deploy de nuevo después de corregir

---

## 📞 Siguiente Sesión

Cuando tengas tu sitio funcionando, podemos:

1. Agregar Google Analytics
2. Configurar correos automáticos
3. Mejorar el SEO
4. ¡Lo que necesites!

---

**Creado por:** Claude
**Para:** Roberto - PotentiaMX
**Fecha:** 21 de Octubre 2025
