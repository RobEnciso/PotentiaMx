# 🌐 Configurar DNS en Namecheap para Netlify

Guía paso a paso con capturas descritas para configurar tu dominio en Namecheap.

---

## 🎯 Objetivo

Apuntar tu dominio `potentiamx.com` (o el que tengas) a Netlify para que funcione tu aplicación.

---

## 📋 Antes de Empezar

Necesitas:

- ✅ Dominio comprado en Namecheap
- ✅ Sitio deployado en Netlify
- ✅ Los nameservers de Netlify (los obtienes primero)

---

## PASO 1: Obtener Nameservers de Netlify

### 1.1 Ir a Netlify Dashboard

```
https://app.netlify.com → Sites → [Tu sitio]
```

### 1.2 Agregar Dominio Custom

1. Click en **"Domain settings"** (en el menú lateral)
2. Click en **"Add custom domain"**
3. Escribir tu dominio: `potentiamx.com`
4. Click en **"Verify"**

### 1.3 Ver Nameservers

Netlify te mostrará algo como:

```
┌─────────────────────────────────────────────────┐
│ Your nameservers:                               │
│                                                 │
│ dns1.p08.nsone.net                              │
│ dns2.p08.nsone.net                              │
│ dns3.p08.nsone.net                              │
│ dns4.p08.nsone.net                              │
│                                                 │
│ Update these at your domain registrar          │
└─────────────────────────────────────────────────┘
```

**⚠️ IMPORTANTE: Copia estos 4 nameservers. Los necesitarás en el siguiente paso.**

---

## PASO 2: Configurar Nameservers en Namecheap

### 2.1 Login en Namecheap

1. Ir a: https://namecheap.com
2. Click en **"Sign In"** (arriba derecha)
3. Ingresar email y password

### 2.2 Ir a Domain List

1. Click en tu nombre (arriba derecha)
2. Click en **"Domain List"**

Verás algo como:

```
┌──────────────────────────────────────────────────┐
│ Domain List                                      │
├────────────────────┬─────────┬───────────────────┤
│ Domain             │ Status  │ Actions           │
├────────────────────┼─────────┼───────────────────┤
│ potentiamx.com     │ Active  │ [Manage] [Renew]  │
└────────────────────┴─────────┴───────────────────┘
```

### 2.3 Click en "Manage"

Click en el botón **"Manage"** junto a tu dominio.

### 2.4 Ir a Sección de Nameservers

En la página de configuración del dominio, busca la sección:

```
┌──────────────────────────────────────────────────┐
│ NAMESERVERS                                      │
├──────────────────────────────────────────────────┤
│ ○ Namecheap BasicDNS                            │
│ ● Custom DNS                                     │
│                                                  │
│ Nameserver 1: ┌────────────────────────────┐   │
│               │ dns1.p08.nsone.net          │   │
│               └────────────────────────────┘   │
│                                                  │
│ Nameserver 2: ┌────────────────────────────┐   │
│               │ dns2.p08.nsone.net          │   │
│               └────────────────────────────┘   │
│                                                  │
│ Nameserver 3: ┌────────────────────────────┐   │
│               │ dns3.p08.nsone.net          │   │
│               └────────────────────────────┘   │
│                                                  │
│ Nameserver 4: ┌────────────────────────────┐   │
│               │ dns4.p08.nsone.net          │   │
│               └────────────────────────────┘   │
│                                                  │
│               [✓]  Save                         │
└──────────────────────────────────────────────────┘
```

### 2.5 Cambiar a Custom DNS

1. Click en el radio button **"Custom DNS"**
2. Se habilitarán los campos de nameservers

### 2.6 Pegar Nameservers de Netlify

En cada campo, pega los nameservers que copiaste de Netlify:

```
Nameserver 1: dns1.p08.nsone.net
Nameserver 2: dns2.p08.nsone.net
Nameserver 3: dns3.p08.nsone.net
Nameserver 4: dns4.p08.nsone.net
```

**⚠️ IMPORTANTE:**

- Pegar solo el hostname (ej: `dns1.p08.nsone.net`)
- NO agregar `http://` ni `https://`
- NO agregar puntos al final
- Verificar que no haya espacios extras

### 2.7 Guardar Cambios

1. Click en el botón **"✓ Save"** (checkmark verde)
2. Verás una confirmación:

```
┌──────────────────────────────────────────────────┐
│ ✅ Success!                                      │
│ Your nameservers have been updated.             │
│                                                  │
│ Changes may take up to 48 hours to propagate.   │
└──────────────────────────────────────────────────┘
```

---

## PASO 3: Verificar Propagación DNS

### 3.1 Esperar Propagación

⏰ **Tiempo de espera:**

- **Mínimo:** 30 minutos
- **Típico:** 2-6 horas
- **Máximo:** 48 horas

### 3.2 Verificar con Comando

**En Windows PowerShell:**

```powershell
nslookup potentiamx.com
```

**Respuesta esperada:**

```
Server:  UnKnown
Address:  192.168.x.x

Non-authoritative answer:
Name:    potentiamx.com
Address:  75.2.60.5  ← IP de Netlify
```

**Si ves la IP de Netlify (75.x.x.x), ¡funciona!**

### 3.3 Verificar con Herramientas Online

**DNSChecker.org:**

```
https://dnschecker.org/#A/potentiamx.com
```

Verás un mapa mundial mostrando:

- ✅ Verde = DNS propagado
- ⏳ Amarillo = Propagando
- ❌ Rojo = No propagado aún

**WhatsMyDNS.net:**

```
https://www.whatsmydns.net/#A/potentiamx.com
```

Similar a DNSChecker, muestra propagación global.

---

## PASO 4: Configurar WWW (Opcional)

### 4.1 Agregar Alias WWW en Netlify

1. Ir a **Netlify → Domain settings**
2. Click en **"Add domain alias"**
3. Escribir: `www.potentiamx.com`
4. Click en **"Add domain"**

### 4.2 Netlify Configurará Automáticamente

Netlify:

- ✅ Creará el alias `www.potentiamx.com`
- ✅ Redirigirá `www` → `potentiamx.com` (sin www)
- ✅ Configurará SSL para ambos

**Ya está configurado en `netlify.toml`:**

```toml
[[redirects]]
  from = "https://www.potentiamx.com/*"
  to = "https://potentiamx.com/:splat"
  status = 301
```

---

## PASO 5: Verificar SSL (HTTPS)

### 5.1 Netlify Configura SSL Automáticamente

**Después de que DNS propague:**

1. Ir a **Netlify → Domain settings → HTTPS**
2. Click en **"Verify DNS configuration"**
3. Netlify detectará tu dominio y generará certificado SSL
4. **Esperar 1-5 minutos**

### 5.2 Verificar HTTPS

Abrir en navegador:

```
https://potentiamx.com
```

**Debe mostrar:**

- 🔒 Candado verde en la barra de direcciones
- Certificado válido (click en el candado para ver)
- Conexión segura

---

## 🐛 Troubleshooting

### Error: "DNS not propagated yet"

**Solución:**

- Esperar más tiempo (hasta 48h)
- Verificar que pegaste los nameservers correctamente
- Verificar que no haya typos

**Verificar en Namecheap:**

```
Domain List → Manage → Nameservers
```

Deben estar exactamente como los de Netlify.

### Error: "This site can't be reached"

**Solución:**

- DNS aún no ha propagado globalmente
- Limpiar caché DNS local:

**Windows:**

```powershell
ipconfig /flushdns
```

**Mac:**

```bash
sudo dscacheutil -flushcache
```

**Linux:**

```bash
sudo systemd-resolve --flush-caches
```

### Error: "NET::ERR_CERT_COMMON_NAME_INVALID"

**Solución:**

- SSL aún no está configurado
- Ir a Netlify → HTTPS → "Renew certificate"
- Esperar 5 minutos

### WWW no funciona

**Solución:**

1. Verificar que agregaste `www.potentiamx.com` como alias en Netlify
2. Verificar que DNS haya propagado para www:
   ```powershell
   nslookup www.potentiamx.com
   ```
3. Debe apuntar a la misma IP que `potentiamx.com`

---

## 📊 Verificación Final

### Checklist de DNS

- [ ] ⬜ Nameservers configurados en Namecheap
- [ ] ⬜ DNS propagado (verificar con nslookup)
- [ ] ⬜ `potentiamx.com` funciona
- [ ] ⬜ `www.potentiamx.com` redirige a `potentiamx.com`
- [ ] ⬜ HTTPS activo (candado 🔒)
- [ ] ⬜ Sitio carga correctamente

### Comandos de Verificación

```powershell
# Verificar DNS
nslookup potentiamx.com

# Verificar DNS www
nslookup www.potentiamx.com

# Verificar con dig (si tienes Git Bash)
dig potentiamx.com

# Verificar con curl
curl -I https://potentiamx.com
```

---

## ✅ ¡Listo!

Tu dominio ahora apunta a Netlify y está funcionando con:

- ✅ DNS configurado
- ✅ WWW redirect
- ✅ HTTPS activo
- ✅ Sitio accesible en tu dominio

**URLs funcionando:**

```
https://potentiamx.com ✅
https://www.potentiamx.com → https://potentiamx.com ✅
```

---

## 📞 Soporte

**Si tienes problemas:**

1. **Namecheap Support:**
   - Live Chat: https://namecheap.com/support/
   - Knowledge Base: https://namecheap.com/support/knowledgebase/

2. **Netlify Support:**
   - Docs: https://docs.netlify.com
   - Community: https://answers.netlify.com

3. **DNS Check Tools:**
   - https://dnschecker.org
   - https://www.whatsmydns.net
   - https://mxtoolbox.com/SuperTool.aspx

---

**Tiempo total: 10-15 minutos** ⏱️
(+ 30 min - 48h para propagación DNS)
