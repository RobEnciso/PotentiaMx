# 🚀 Deploy en Netlify + Dominio en Namecheap

Guía completa para deployar **PotentiaMX** en Netlify y configurar tu dominio en Namecheap.

---

## 📋 Requisitos Previos

- [x] ✅ Cuenta en GitHub
- [ ] ⬜ Cuenta en [Netlify](https://netlify.com) (gratis)
- [ ] ⬜ Dominio en [Namecheap](https://namecheap.com)
- [ ] ⬜ Proyecto en Supabase configurado

---

## 🌐 PARTE 1: Deploy en Netlify (15 minutos)

### 1.1 Push a GitHub

```bash
# Asegúrate de que todo esté commiteado
git status

# Add y commit si hay cambios
git add .
git commit -m "feat: configurar deployment en Netlify"

# Push a GitHub
git push origin master
# O tu branch principal (main, master, etc.)
```

### 1.2 Conectar Repositorio a Netlify

1. **Ir a Netlify:**

   ```
   https://app.netlify.com
   ```

2. **Click en "Add new site" → "Import an existing project"**

3. **Conectar con GitHub:**
   - Click en "Deploy with GitHub"
   - Autorizar Netlify a acceder a tu cuenta
   - Seleccionar tu repositorio `landview-app-cms`

### 1.3 Configurar el Build

**Site settings:**

- **Branch to deploy:** `master` (o `main`)
- **Build command:** `npm run build:netlify`
- **Publish directory:** `.next`
- **Functions directory:** `netlify/functions` (opcional)

**Configuración automática:**
Netlify detectará que es Next.js y configurará automáticamente con el plugin `@netlify/plugin-nextjs`

### 1.4 Configurar Variables de Entorno

**ANTES de hacer deploy**, click en "Advanced build settings" → "New variable"

Agregar **TODAS** estas variables:

#### Variables Públicas (visibles en el navegador)

| Variable Name                   | Value                     | Dónde Obtener             |
| ------------------------------- | ------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxx.supabase.co` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...`             | Supabase → Settings → API |

#### Variables Secretas (solo servidor)

| Variable Name               | Value         | Dónde Obtener                            |
| --------------------------- | ------------- | ---------------------------------------- |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase → Settings → API → service_role |
| `RESEND_API_KEY`            | `re_xxx...`   | https://resend.com/api-keys              |

**⚠️ IMPORTANTE:**

- La `SERVICE_ROLE_KEY` tiene permisos de admin
- Nunca la compartas ni la expongas en el cliente
- Resend es opcional (solo si quieres emails)

### 1.5 Deploy!

1. **Click en "Deploy site"**
2. **Esperar 3-5 minutos** (primera vez puede tardar más)
3. **Ver el progreso** en tiempo real

Netlify te asignará un URL temporal:

```
https://random-name-12345.netlify.app
```

### 1.6 Verificar Deployment

1. **Abrir el URL de Netlify**
2. **Verificar que cargue la landing page**
3. **Abrir DevTools (F12):**
   - No debe haber errores rojos
   - Variables de Supabase deben estar cargadas

4. **Probar funcionalidades básicas:**
   - `/login` - Login
   - `/signup` - Registro
   - `/propiedades` - Marketplace

---

## 🌍 PARTE 2: Configurar Dominio en Namecheap (10 minutos)

### 2.1 Obtener DNS de Netlify

1. **En Netlify Dashboard:**

   ```
   Site settings → Domain management → Add custom domain
   ```

2. **Escribir tu dominio:**

   ```
   potentiamx.com
   ```

3. **Netlify te mostrará los DNS servers:**

   ```
   dns1.p0X.nsone.net
   dns2.p0X.nsone.net
   dns3.p0X.nsone.net
   dns4.p0X.nsone.net
   ```

   **¡Guárdalos! Los necesitarás en Namecheap.**

### 2.2 Configurar DNS en Namecheap

1. **Ir a Namecheap Dashboard:**

   ```
   https://namecheap.com → Account → Domain List
   ```

2. **Click en "Manage" junto a tu dominio**

3. **Ir a la sección "Nameservers":**
   - Cambiar de "Namecheap BasicDNS" a "Custom DNS"
   - Agregar los 4 nameservers de Netlify:
     ```
     dns1.p0X.nsone.net
     dns2.p0X.nsone.net
     dns3.p0X.nsone.net
     dns4.p0X.nsone.net
     ```
   - Click en "✓" (checkmark) para guardar

### 2.3 Configurar WWW (Opcional pero Recomendado)

Si quieres que `www.potentiamx.com` redirija a `potentiamx.com`:

1. **En Netlify:**

   ```
   Domain settings → Domain aliases → Add domain alias
   ```

2. **Agregar:**

   ```
   www.potentiamx.com
   ```

3. **Netlify configurará el redirect automáticamente** (ya está en `netlify.toml`)

### 2.4 Esperar Propagación DNS

⏰ **Tiempo de espera: 30 minutos a 48 horas**

Para verificar propagación:

```bash
# En terminal/PowerShell:
nslookup potentiamx.com

# Debe mostrar IPs de Netlify (75.x.x.x)
```

Herramientas online:

- https://dnschecker.org
- https://www.whatsmydns.net

---

## 🔒 PARTE 3: Configurar SSL (Automático)

### 3.1 Netlify configura HTTPS automáticamente

1. **Ir a:**

   ```
   Domain settings → HTTPS → Verify DNS configuration
   ```

2. **Netlify detectará tu dominio y:**
   - Generará certificado SSL con Let's Encrypt
   - Configurará HTTPS automáticamente
   - Forzará HTTPS (HTTP → HTTPS redirect)

3. **Esperar 1-5 minutos**

4. **Verificar:**
   ```
   https://potentiamx.com
   ```
   Debe mostrar el candado 🔒 en el navegador

---

## ✅ PARTE 4: Verificación Final

### 4.1 Checklist de Deployment

- [ ] ⬜ Sitio accesible en Netlify URL
- [ ] ⬜ Dominio apuntando a Netlify
- [ ] ⬜ SSL activo (HTTPS)
- [ ] ⬜ WWW redirect funcionando
- [ ] ⬜ Login/Signup funcionan
- [ ] ⬜ Dashboard carga correctamente
- [ ] ⬜ Tours 360° funcionan
- [ ] ⬜ Marketplace funciona
- [ ] ⬜ Formularios de contacto funcionan
- [ ] ⬜ Imágenes de Supabase cargan

### 4.2 Probar Funcionalidades

```
✅ Landing page: https://potentiamx.com
✅ Login: https://potentiamx.com/login
✅ Signup: https://potentiamx.com/signup
✅ Dashboard: https://potentiamx.com/dashboard
✅ Marketplace: https://potentiamx.com/propiedades
✅ Tour ejemplo: https://potentiamx.com/terreno/[id]
```

### 4.3 Performance Check

**Ejecutar Lighthouse en DevTools:**

```
F12 → Lighthouse → Generate report
```

**Metas:**

- Performance: > 80
- SEO: > 90
- Best Practices: > 90
- Accessibility: > 85

---

## 🐛 PARTE 5: Troubleshooting Común

### Error: "Build failed"

**Solución:**

1. Ver logs en Netlify: `Site → Deploys → [Latest] → Deploy log`
2. Buscar el error específico
3. Común: Falta el comando `build:netlify` en `package.json`

```json
// Verificar en package.json:
{
  "scripts": {
    "build:netlify": "next build"
  }
}
```

### Error: "Page not found" después del deploy

**Solución:**
Verificar que `netlify.toml` esté en la raíz del proyecto y tenga:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Error: "Supabase client not initialized"

**Solución:**

1. Ir a `Site settings → Environment variables`
2. Verificar que estén todas las variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Re-deployar: `Deploys → Trigger deploy → Deploy site`

### Dominio no apunta a Netlify

**Solución:**

1. Verificar nameservers en Namecheap
2. Esperar 24-48 horas para propagación
3. Verificar con: `nslookup potentiamx.com`
4. Debe mostrar IPs de Netlify (75.x.x.x)

### Imágenes no cargan

**Solución:**
Verificar `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'tuhojmupstisctgaepsc.supabase.co', // Tu hostname
    },
  ],
}
```

### SSL no se activa

**Solución:**

1. Esperar 1 hora después de configurar DNS
2. Ir a `Domain settings → HTTPS → Verify DNS configuration`
3. Si persiste: `Domain settings → HTTPS → Renew certificate`

---

## 🚀 PARTE 6: Optimizaciones Post-Deploy

### 6.1 Configurar Deploy Previews

**Para cada Pull Request, Netlify crea un preview:**

1. **Habilitar en:**

   ```
   Site settings → Build & deploy → Deploy contexts
   ```

2. **Activar:**
   - ✅ Branch deploys
   - ✅ Deploy previews
   - ✅ Deploy notifications

### 6.2 Configurar Redirects Personalizados

**Editar `netlify.toml` para agregar redirects:**

```toml
# Redirect old URLs
[[redirects]]
  from = "/old-page"
  to = "/new-page"
  status = 301

# Redirect dominio antiguo
[[redirects]]
  from = "https://old-domain.com/*"
  to = "https://potentiamx.com/:splat"
  status = 301
  force = true
```

### 6.3 Configurar Notificaciones

**En Netlify:**

```
Site settings → Build & deploy → Deploy notifications
```

**Opciones:**

- Email cuando falla el deploy
- Slack webhook
- Discord webhook

### 6.4 Habilitar Analytics

**Netlify Analytics (opcional - $9/mes):**

```
Site → Add → Analytics
```

**O usar Google Analytics gratis:**
Ver guía en `GUIA_GOOGLE_ANALYTICS.md` (por crear)

---

## 📊 PARTE 7: Monitoreo Continuo

### 7.1 Ver Logs en Tiempo Real

```
Site → Functions → [Function] → Logs
```

### 7.2 Métricas de Deploy

```
Site → Deploys → Deploy summary
```

**Monitorear:**

- Build time (debe ser < 5 min)
- Deploy time
- Errores de build
- Advertencias

### 7.3 Bandwidth Usage

```
Site → Usage → Bandwidth
```

**Plan gratuito de Netlify:**

- 100 GB bandwidth/mes
- 300 build minutes/mes
- Ilimitado sitios

---

## 🎯 PARTE 8: Workflow de Desarrollo

### 8.1 Flujo Recomendado

```bash
# 1. Desarrollar localmente
npm run dev

# 2. Probar cambios
npm run build && npm start

# 3. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin master

# 4. Netlify auto-deploya
# (esperar 3-5 minutos)

# 5. Verificar en producción
https://potentiamx.com
```

### 8.2 Branches y Deploy Previews

```bash
# Crear branch para feature
git checkout -b feature/nueva-caracteristica

# Desarrollar y commitear
git add .
git commit -m "feat: agregar nueva característica"

# Push del branch
git push origin feature/nueva-caracteristica

# Netlify crea deploy preview automáticamente:
# https://feature-nueva-caracteristica--potentiamx.netlify.app

# Revisar preview, hacer ajustes

# Merge a master cuando esté listo
git checkout master
git merge feature/nueva-caracteristica
git push origin master

# Deploy a producción automático
```

---

## 📞 PARTE 9: Soporte y Recursos

### Documentación Oficial

- **Netlify:** https://docs.netlify.com
- **Next.js en Netlify:** https://docs.netlify.com/frameworks/next-js/
- **Namecheap DNS:** https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/

### Soporte

- **Netlify Support:** https://support.netlify.com
- **Namecheap Support:** https://www.namecheap.com/support/

### Comunidad

- **Netlify Community:** https://answers.netlify.com
- **Next.js Discord:** https://nextjs.org/discord

---

## ✨ CHECKLIST FINAL

Antes de dar por terminado el deployment:

### Configuración

- [x] ✅ `netlify.toml` configurado
- [ ] ⬜ Variables de entorno en Netlify
- [ ] ⬜ DNS configurado en Namecheap
- [ ] ⬜ SSL activo

### Funcionalidad

- [ ] ⬜ Landing page carga
- [ ] ⬜ Login/Signup funciona
- [ ] ⬜ Dashboard accesible
- [ ] ⬜ CRUD de tours funciona
- [ ] ⬜ Visor 360° funciona
- [ ] ⬜ Marketplace funciona
- [ ] ⬜ Formularios funcionan

### Performance

- [ ] ⬜ Lighthouse score > 80
- [ ] ⬜ Imágenes optimizadas
- [ ] ⬜ Tiempo de carga < 3s
- [ ] ⬜ Mobile responsive

### SEO & Marketing

- [ ] ⬜ Meta tags configurados
- [ ] ⬜ Open Graph tags
- [ ] ⬜ Sitemap generado
- [ ] ⬜ Google Search Console conectado

---

## 🎉 ¡Felicidades!

**Tu sitio está live en:**

```
🌐 https://potentiamx.com
```

**Próximos pasos:**

1. ✅ Crear datos demo
2. ✅ Compartir para feedback
3. ⏳ Iterar según feedback
4. ⏳ Marketing y lanzamiento

---

**Tiempo total: ~30-45 minutos** ⏱️

(sin contar propagación DNS que puede tomar hasta 48h)
