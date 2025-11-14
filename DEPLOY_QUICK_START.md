# ⚡ Quick Start - Deploy en 10 Minutos

Esta es la versión rápida. Para la guía completa, ve a [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

---

## 🚀 Pasos Rápidos

### 1. Subir a GitHub (2 min)

```bash
git add .
git commit -m "feat: Ready for production deployment"
git push origin main
```

### 2. Deploy en Netlify (3 min)

1. Ve a https://app.netlify.com/
2. **"Add new site"** → **"Import an existing project"**
3. Conecta con **GitHub**
4. Selecciona tu repositorio **potentiamx**
5. Click **"Deploy site"**

✅ Netlify detectará automáticamente `netlify.toml` con la configuración

### 3. Agregar Variables de Entorno en Netlify (2 min)

Ve a **Site settings → Environment variables** y agrega:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tuhojmupstisctgaepsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
RESEND_API_KEY=tu_resend_key_aqui
```

**Redeploy después de agregar variables:**

- **Deploys → Trigger deploy → Deploy site**

### 4. Configurar Dominio en Namecheap (3 min)

**En Netlify:**

- Site settings → Domain management → Add custom domain: `www.potentiamx.com`

**En Namecheap:**

- Advanced DNS → Agregar:

| Type  | Host | Value                |
| ----- | ---- | -------------------- |
| CNAME | www  | tu-sitio.netlify.app |
| A     | @    | 75.2.60.5            |

**Espera 5-10 minutos** para que propague el DNS.

---

## ✅ Verificar que Todo Funciona

Ve a `https://www.potentiamx.com` y prueba:

- [ ] Landing page carga
- [ ] Login funciona
- [ ] Dashboard aparece después del login
- [ ] Tour demo funciona (botón de ayuda → Ver Tour Demo)
- [ ] Tutorial minimalista aparece

---

## 🐛 Si Algo Falla

**Build failed:**

```bash
# Verifica localmente que compile
npm run build:netlify
```

**Variables de entorno no funcionan:**

- Verifica que están en Netlify → Site settings → Environment variables
- Haz redeploy después de agregar variables

**Dominio no funciona:**

- Espera 10-30 minutos (propagación DNS)
- Verifica records en Namecheap

---

## 📞 Ayuda

- Guía completa: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
- Netlify Status: https://www.netlifystatus.com/

---

**🎉 ¡Listo! Tu app está en producción en www.potentiamx.com**
