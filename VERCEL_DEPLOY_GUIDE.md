# 🚀 Guía de Deploy a Vercel - PotentiaMX

## Pre-requisitos

✅ **IMPORTANTE:** Antes de hacer deploy, ROTA las API keys expuestas:
- [ ] Supabase Service Role Key
- [ ] Resend API Key
- [ ] PostHog Personal API Key

Ver instrucciones al final de este documento.

---

## Opción 1: Deploy desde UI (Recomendado - 5 minutos)

### 1. Ir a Vercel
```
https://vercel.com/new
```

### 2. Importar Repositorio
- Click "Import Git Repository"
- Selecciona: `RobEnciso/PotentiaMx`
- Framework Preset: **Next.js** (auto-detectado)
- Root Directory: `./` (dejar por defecto)

### 3. Configurar Variables de Entorno

**CRÍTICO:** Agregar TODAS estas variables ANTES de hacer deploy:

#### Variables Públicas (Frontend)
```
NEXT_PUBLIC_SUPABASE_URL=https://tuhojmupstisctgaepsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
NEXT_PUBLIC_POSTHOG_KEY=tu_posthog_key_aqui
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_PROJECT_ID=253501
```

#### Variables Secretas (Backend)
```
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_NUEVA
RESEND_API_KEY=tu_resend_key_NUEVA
POSTHOG_PERSONAL_API_KEY=tu_posthog_personal_key_NUEVA
```

**Environments:** Marca las 3 opciones:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Deploy
- Click "Deploy"
- Espera 1-2 minutos
- ✅ Done!

---

## Opción 2: Deploy desde CLI (Avanzado)

### Instalación
```bash
npm i -g vercel
```

### Login
```bash
vercel login
```

### Deploy
```bash
# Deploy a preview
vercel

# Deploy a production
vercel --prod
```

**Nota:** Las variables de entorno se deben configurar en la UI de Vercel primero.

---

## Post-Deploy: Verificación

### 1. Probar la URL de Preview
```
https://potentiamx-[random].vercel.app
```

### 2. Verificar Performance
```bash
# Chrome DevTools
F12 → Lighthouse → Mobile → Analyze

# Métricas esperadas:
✅ TTFB: <200ms
✅ FCP: <1.0s
✅ LCP: <2.0s
✅ Performance Score: >90
```

### 3. Verificar Funcionalidad
- [ ] Login funciona
- [ ] Dashboard carga
- [ ] Upload de imágenes funciona
- [ ] Tours 360° funcionan
- [ ] PostHog analytics registra eventos

---

## Configurar Dominio Personalizado

### Si Performance es buena, migra el dominio:

1. **En Vercel:**
   ```
   Project Settings → Domains → Add Domain
   potentiamx.com
   ```

2. **Copiar DNS records mostrados**

3. **En tu proveedor de DNS:**
   - Tipo: `A`
   - Name: `@`
   - Value: `76.76.21.21` (Vercel IP)

   - Tipo: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

4. **Esperar propagación (5-30 min)**

5. **Verificar:**
   ```bash
   nslookup potentiamx.com
   ```

---

## Comparación Netlify vs Vercel

### Después de deployment, compara:

| Métrica | Netlify | Vercel | Ganador |
|---------|---------|--------|---------|
| TTFB | ? ms | ? ms | ? |
| LCP | ? s | ? s | ? |
| Build Time | ? min | ? min | ? |
| Deploy Time | ? min | ? min | ? |

---

## 🔐 URGENTE: Rotar API Keys Expuestas

### A. Supabase Service Role Key

1. Ir a: https://supabase.com/dashboard/project/tuhojmupstisctgaepsc/settings/api
2. Scroll a "Service role (secret)"
3. Click "Reset key" o contacta soporte para rotación
4. Copia la nueva key
5. Actualiza en:
   - `.env.local` (local)
   - Netlify env vars
   - Vercel env vars (si aplica)

### B. Resend API Key

1. Ir a: https://resend.com/api-keys
2. Encuentra la key `re_D7W29AeR_EVpTYRmTknLK7YF637EyWpWn`
3. Click "Delete" o "Revoke"
4. Click "Create API Key"
   - Name: `PotentiaMX Production`
   - Permissions: `Sending access` (o Full Access)
5. Copia la nueva key
6. Actualiza en todos los environments

### C. PostHog Personal API Key

1. Ir a: https://us.posthog.com/settings/user-api-keys
2. Encuentra la key `phx_xLk72QzU668xDuk4znsQgmOpWwLlFlqdNZS2rYet9qmHZ1i`
3. Click "Delete"
4. Click "Create Personal API Key"
   - Name: `PotentiaMX Analytics`
   - Scopes: Solo lo necesario (probablemente `project:read`, `event:read`)
5. Copia la nueva key
6. Actualiza en todos los environments

### D. Verificar después de rotar

```bash
# Local
npm run dev
# ¿Login funciona? ¿Analytics funciona?

# Production (después de actualizar en Netlify/Vercel)
# Visita tu sitio y prueba las mismas funciones
```

---

## Troubleshooting

### "Build failed"
- Revisa que todas las env vars estén configuradas
- Verifica que no haya errores de TypeScript: `npm run build` local

### "Runtime error"
- Revisa logs en Vercel: Project → Functions → Logs
- Verifica que las API keys sean correctas

### "Page loads slow"
- Verifica que estés usando el dominio de Vercel, no Netlify
- Limpia cache del navegador
- Prueba en modo incógnito

---

## Soporte

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Next.js Docs: https://nextjs.org/docs

---

**Última actualización:** 2025-12-07
**Creado por:** Claude Code
