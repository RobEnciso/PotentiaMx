# 🚀 Guía de Deployment - PotentiaMX

**Plataforma:** Netlify
**Dominio:** www.potentiamx.com (Namecheap)
**Repositorio:** GitHub
**Stack:** Next.js 15 + Supabase + Tailwind CSS

---

## 📋 Pre-requisitos

Antes de hacer deployment, verifica que tienes:

- [x] Cuenta en GitHub con el repositorio listo
- [x] Cuenta en Netlify
- [x] Dominio configurado en Namecheap (potentiamx.com)
- [x] Proyecto de Supabase creado y configurado
- [x] (Opcional) Cuenta en Resend para emails

---

## 🔐 Variables de Entorno Requeridas

### 1. Obtener credenciales de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Copia:
   - `Project URL` → será `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → será `SUPABASE_SERVICE_ROLE_KEY` (¡SECRETA!)

### 2. (Opcional) Obtener API Key de Resend

1. Ve a [Resend Dashboard](https://resend.com/api-keys)
2. Crea un nuevo API key
3. Copia la key → será `RESEND_API_KEY`

### 3. Variables de Entorno para Netlify

```bash
# ✅ PÚBLICAS (visibles en el navegador)
NEXT_PUBLIC_SUPABASE_URL=https://tuhojmupstisctgaepsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 🔒 SECRETAS (solo en servidor)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

---

## 📦 Paso 1: Preparar el Repositorio

### 1.1 Subir código a GitHub

```bash
# Si aún no has inicializado git
git init
git add .
git commit -m "feat: Sistema completo con tutorial minimalista y tour demo"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/potentiamx.git
git branch -M main
git push -u origin main
```

### 1.2 Verificar archivos incluidos

Asegúrate de que estos archivos estén en el repo:

- ✅ `netlify.toml` (configuración de Netlify)
- ✅ `.env.example` (ejemplo de variables)
- ✅ `package.json` con script `build:netlify`
- ✅ Carpeta `config/` con `demoTour.ts`

Archivos que NO deben estar en el repo:

- ❌ `.env.local` (contiene tus secretos)
- ❌ `node_modules/`
- ❌ `.next/`

---

## 🌐 Paso 2: Deploy en Netlify

### 2.1 Importar desde GitHub

1. Ve a [Netlify Dashboard](https://app.netlify.com/)
2. Click en **"Add new site" → "Import an existing project"**
3. Selecciona **GitHub**
4. Autoriza Netlify para acceder a tus repositorios
5. Selecciona el repositorio `potentiamx`

### 2.2 Configurar Build Settings

Netlify debería detectar automáticamente la configuración desde `netlify.toml`, pero verifica:

```
Build command: npm run build:netlify
Publish directory: .next
```

### 2.3 Agregar Variables de Entorno

En Netlify:

1. Ve a **Site settings → Environment variables**
2. Click en **"Add a variable"**
3. Agrega cada variable:

| Variable                        | Valor                                      | Descripción             |
| ------------------------------- | ------------------------------------------ | ----------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://tuhojmupstisctgaepsc.supabase.co` | URL pública de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...`                            | Key pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbGciOi...`                            | ⚠️ Key secreta (admin)  |
| `RESEND_API_KEY`                | `re_xxxxx...`                              | (Opcional) Para emails  |

### 2.4 Deploy

1. Click en **"Deploy site"**
2. Espera 2-5 minutos
3. Netlify te dará una URL temporal: `https://random-name-123.netlify.app`

---

## 🌍 Paso 3: Configurar Dominio Personalizado

### 3.1 En Netlify

1. Ve a **Site settings → Domain management**
2. Click en **"Add custom domain"**
3. Ingresa: `www.potentiamx.com`
4. Netlify te mostrará los DNS records que necesitas configurar:

```
Type: CNAME
Name: www
Value: random-name-123.netlify.app
```

### 3.2 En Namecheap

1. Ve a [Namecheap Dashboard](https://www.namecheap.com/myaccount/domain-list/)
2. Click en **"Manage"** junto a `potentiamx.com`
3. Ve a **Advanced DNS**
4. Agrega/Modifica los registros:

| Type         | Host | Value                       | TTL       |
| ------------ | ---- | --------------------------- | --------- |
| CNAME Record | www  | random-name-123.netlify.app | Automatic |
| A Record     | @    | 75.2.60.5                   | Automatic |

**Nota:** El IP `75.2.60.5` es el load balancer de Netlify. Verifica en la documentación de Netlify por si ha cambiado.

### 3.3 Habilitar HTTPS

1. En Netlify, ve a **Site settings → Domain management**
2. En la sección **HTTPS**, click en **"Verify DNS configuration"**
3. Una vez verificado, click en **"Provision certificate"**
4. Espera 1-5 minutos
5. ✅ Tu sitio estará en `https://www.potentiamx.com` con SSL

---

## ✅ Paso 4: Verificación Post-Deploy

### 4.1 Checklist de Funcionalidad

Visita `https://www.potentiamx.com` y prueba:

- [ ] Landing page carga correctamente
- [ ] Login/Signup funciona
- [ ] Dashboard carga con autenticación
- [ ] Crear nuevo tour 360° funciona
- [ ] Subir imágenes funciona
- [ ] Editor de hotspots carga
- [ ] Tour demo redirige correctamente (`/terreno/062e89fd-6629-40a4-8eaa-9f51cbe9ecdf`)
- [ ] Tutorial minimalista aparece en primera visita
- [ ] Botón de ayuda flotante funciona
- [ ] Marketplace público funciona (`/propiedades`)

### 4.2 Verificar Variables de Entorno

Abre la consola del navegador (F12) y ejecuta:

```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
// Debe mostrar tu URL de Supabase
```

Si muestra `undefined`, las variables no están configuradas correctamente.

### 4.3 Revisar Logs de Build

Si algo falla:

1. Ve a **Deploys** en Netlify
2. Click en el deploy fallido
3. Revisa los **Deploy logs**
4. Busca errores específicos

---

## 🔧 Troubleshooting

### Error: "Build failed" en Netlify

**Solución:**

1. Verifica que el script `build:netlify` existe en `package.json`
2. Revisa los logs para ver qué dependencia falta
3. Asegúrate de que Node version = 20 (configurado en `netlify.toml`)

### Error: "Cannot read properties of undefined"

**Solución:**

- Verifica que todas las variables de entorno están configuradas en Netlify
- Recuerda que cambios en variables requieren un **redeploy**

### Imágenes no cargan

**Solución:**

- Verifica que el dominio de Supabase está en `next.config.ts` → `remotePatterns`
- Verifica que el bucket de Supabase es público

### Tour demo no funciona

**Solución:**

- Verifica que el tour existe: `https://www.potentiamx.com/terreno/062e89fd-6629-40a4-8eaa-9f51cbe9ecdf`
- Verifica que el ID en `config/demoTour.ts` es correcto
- Verifica RLS policies en Supabase (debe permitir lectura pública)

---

## 🔄 Actualizar el Sitio (Redeploy)

### Método 1: Automático (Recomendado)

```bash
# Hacer cambios en el código
git add .
git commit -m "descripción de cambios"
git push origin main

# Netlify detectará el push y desplegará automáticamente
```

### Método 2: Manual

1. Ve a Netlify Dashboard
2. Click en **"Deploys"**
3. Click en **"Trigger deploy" → "Deploy site"**

---

## 📊 Monitoreo

### Analytics de Netlify

- Ve a **Analytics** en Netlify Dashboard
- Revisa tráfico, performance, y errores

### Logs en Tiempo Real

- Ve a **Functions** (si usas serverless)
- Revisa logs de cada request

---

## 🎯 Siguientes Pasos

Después del primer deploy exitoso:

1. **Configurar CI/CD avanzado**
   - Agregar tests automáticos
   - Preview deploys para branches

2. **Optimizaciones de Performance**
   - Activar Netlify CDN
   - Configurar caching headers

3. **Monitoreo y Analytics**
   - Integrar Google Analytics
   - Configurar Sentry para error tracking

4. **Backups**
   - Configurar backups automáticos de Supabase
   - Exportar datos regularmente

---

## 📞 Soporte

Si tienes problemas:

- Netlify Docs: https://docs.netlify.com
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

---

**✅ ¡Listo! Tu aplicación está en producción en www.potentiamx.com**

🎉 **Fecha de Deploy:** [Agregar fecha cuando esté listo]
👤 **Deployed by:** Roberto (Solo Founder)
🏢 **Proyecto:** PotentiaMX - LandView App CMS
