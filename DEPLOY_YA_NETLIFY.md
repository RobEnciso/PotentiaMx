# ⚡ Deploy YA - GitHub + Netlify + Namecheap

Guía ultra-rápida para deployar **PotentiaMX** en 20 minutos.

---

## 🎯 Stack

- **Código:** GitHub
- **Hosting:** Netlify
- **Dominio:** Namecheap

---

## ⚡ PASO 1: Push a GitHub (2 minutos)

```bash
# 1. Add y commit todos los cambios
git add .
git commit -m "feat: preparar deployment para Netlify"

# 2. Push a GitHub
git push origin master
```

**✅ Listo!** Tu código ya está en GitHub.

---

## 🚀 PASO 2: Deploy en Netlify (10 minutos)

### 2.1 Conectar Repositorio

1. **Ir a:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Conectar:** GitHub
4. **Seleccionar:** Tu repositorio `landview-app-cms`

### 2.2 Configurar Build

**Netlify auto-detecta Next.js, pero verifica:**

```
Build command: npm run build:netlify
Publish directory: .next
```

### 2.3 Agregar Variables de Entorno

**Antes de deployar**, click en "Show advanced" → "New variable"

**Agregar estas 4 variables:**

```
NEXT_PUBLIC_SUPABASE_URL = https://tuhojmupstisctgaepsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci... (tu key)
SUPABASE_SERVICE_ROLE_KEY = eyJhbGci... (tu key) ⚠️
RESEND_API_KEY = re_xxx... (opcional)
```

**Dónde obtener:**
- Supabase Dashboard → Settings → API

### 2.4 Deploy!

1. Click en **"Deploy site"**
2. Esperar 3-5 minutos
3. ¡Listo! Tu sitio está en: `https://random-name.netlify.app`

---

## 🌐 PASO 3: Conectar Dominio Namecheap (8 minutos)

### 3.1 Obtener Nameservers de Netlify

1. **En Netlify:** Domain settings → Add custom domain
2. **Escribir:** `potentiamx.com` (tu dominio)
3. **Copiar** los 4 nameservers que te muestra:
   ```
   dns1.p08.nsone.net
   dns2.p08.nsone.net
   dns3.p08.nsone.net
   dns4.p08.nsone.net
   ```

### 3.2 Configurar en Namecheap

1. **Ir a:** https://namecheap.com → Domain List
2. **Click:** "Manage" junto a tu dominio
3. **Sección Nameservers:**
   - Cambiar a "Custom DNS"
   - Pegar los 4 nameservers de Netlify
   - Click en "✓ Save"

### 3.3 Esperar Propagación

⏰ **Típico:** 2-6 horas
⏰ **Máximo:** 48 horas

**Verificar:**
```powershell
nslookup potentiamx.com
```

Debe mostrar IP de Netlify (75.x.x.x)

---

## 🔒 PASO 4: SSL (Automático)

**Netlify configura HTTPS automáticamente** cuando DNS propague.

**Verificar:**
1. Netlify → Domain settings → HTTPS
2. "Verify DNS configuration"
3. Esperar 1-5 minutos
4. ¡SSL activo! 🔒

---

## ✅ Verificación Rápida

```bash
# 1. Sitio funciona
https://potentiamx.com

# 2. Login funciona
https://potentiamx.com/login

# 3. Dashboard funciona
https://potentiamx.com/dashboard

# 4. HTTPS activo
# Debe mostrar candado 🔒 en navegador
```

---

## 🐛 Si Algo Sale Mal

### Build failed

**Ver logs:**
```
Netlify → Deploys → [Latest] → Deploy log
```

**Común:** Verificar que exista `build:netlify` en `package.json`

### Variables no funcionan

**Re-deployar:**
```
Netlify → Deploys → Trigger deploy → Deploy site
```

### Dominio no apunta

**Verificar nameservers:**
```
Namecheap → Domain List → Manage → Nameservers
```

Deben ser los de Netlify (dns1.p08.nsone.net, etc.)

---

## 📚 Guías Completas

Para más detalles, ver:

- **`DEPLOY_NETLIFY_NAMECHEAP.md`** - Guía completa paso a paso
- **`NAMECHEAP_DNS_SETUP.md`** - DNS detallado con screenshots
- **`CHECKLIST_PRE_DEPLOYMENT.md`** - Verificación completa

---

## 🎯 Checklist Express

- [ ] ⬜ Git push a GitHub
- [ ] ⬜ Netlify conectado
- [ ] ⬜ Variables agregadas
- [ ] ⬜ Deploy exitoso
- [ ] ⬜ Nameservers en Namecheap
- [ ] ⬜ DNS propagado
- [ ] ⬜ SSL activo
- [ ] ⬜ Sitio funciona

---

## ✨ Próximos Pasos

1. ✅ **Ahora:** Crear datos demo
2. ✅ **Después:** Compartir link para feedback
3. ⏳ **Luego:** Iterar según feedback

---

**URLs que necesitas:**

```
Netlify: https://app.netlify.com
Namecheap: https://namecheap.com
Supabase: https://supabase.com/dashboard
```

---

**Tiempo total: ~20 minutos** ⏱️
(+ espera de DNS 2-6 horas)

## 🎉 ¡Éxito!

Tu sitio estará live en:
```
https://potentiamx.com 🚀
```
