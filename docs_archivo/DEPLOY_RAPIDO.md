# ⚡ Deploy Rápido - 5 Minutos

Guía ultra-rápida para deployar en Vercel en 5 minutos.

---

## 🚀 Opción 1: Deploy con Vercel CLI (Más Rápido)

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# En la carpeta del proyecto:
vercel

# Seguir las preguntas:
# - Setup and deploy? Yes
# - Which scope? [tu usuario/org]
# - Link to existing project? No
# - What's your project's name? potentiamx
# - In which directory is your code located? ./
# - Want to override settings? No
```

### 4. Configurar Variables de Entorno

```bash
# Agregar cada variable:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
```

Cuando pregunte por el environment, selecciona: `Production`, `Preview`, `Development`

### 5. Re-deploy con las variables

```bash
vercel --prod
```

**¡Listo!** Tu sitio estará en: `https://potentiamx.vercel.app`

---

## 🌐 Opción 2: Deploy desde GitHub (Más Fácil)

### 1. Push a GitHub

```bash
git add .
git commit -m "feat: preparar para deployment"
git push origin master
```

### 2. Ir a Vercel

👉 [https://vercel.com/new](https://vercel.com/new)

### 3. Importar Repositorio

1. Click en "Import Git Repository"
2. Selecciona tu repo
3. Click en "Import"

### 4. Configurar Variables de Entorno

En la pantalla de configuración, agregar en "Environment Variables":

```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGci...
RESEND_API_KEY = re_xxx...
```

### 5. Deploy

Click en "Deploy" y esperar ~3 minutos.

**¡Listo!** Tu sitio estará en: `https://potentiamx.vercel.app`

---

## 📍 Obtener Credenciales de Supabase

1. Ir a: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Settings → API
4. Copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️

---

## ✅ Verificar Deployment

1. Abrir el URL de Vercel
2. Probar login: `/login`
3. Crear un tour de prueba
4. Ver en marketplace: `/propiedades`

---

## 🐛 Si algo sale mal

### Error: "Supabase client not initialized"

→ Revisar que las variables de entorno estén en Vercel:

```
Vercel Dashboard → Settings → Environment Variables
```

### Error: "Build failed"

→ Ver logs en Vercel:

```
Vercel Dashboard → Deployments → [Latest] → View Function Logs
```

### Error: "Images not loading"

→ Verificar `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'YOUR_PROJECT_ID.supabase.co',
    },
  ],
}
```

---

## 📞 ¿Necesitas ayuda?

Revisa la guía completa en: `GUIA_DEPLOYMENT_PRODUCCION.md`

---

**Tiempo estimado: 5-10 minutos** ⏱️
