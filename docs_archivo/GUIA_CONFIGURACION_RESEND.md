# 📧 GUÍA COMPLETA: Configurar Resend con Google Workspace

**Dominio:** potentiamx.com
**Email:** hola@potentiamx.com
**Servicio:** Google Workspace (ya funcionando)
**Problema:** Resend necesita verificación DNS

---

## 🎯 OBJETIVO

Configurar Resend para enviar emails transaccionales **desde** `hola@potentiamx.com` o `noreply@potentiamx.com` sin afectar tu Google Workspace.

---

## ⚠️ IMPORTANTE: Diferencia entre Servicios

### **Google Workspace** (Ya tienes)

- Para **emails manuales** (tú escribes y envías)
- Interfaz Gmail
- hola@potentiamx.com funciona normal

### **Resend** (Vamos a configurar)

- Para **emails automáticos** del sistema
- Bienvenida, notificaciones, reportes
- Usa tu dominio pero NO interfiere con Workspace

**Ambos pueden coexistir sin problema** ✅

---

## 📋 PASO 1: Acceder a Resend Dashboard

1. Ve a: https://resend.com/login
2. Inicia sesión con tu cuenta
3. Ve a **"Domains"** en el menú lateral

---

## 📋 PASO 2: Agregar tu Dominio

1. Click en **"Add Domain"**
2. Ingresa: `potentiamx.com`
3. Click **"Add"**

**Resultado:** Resend te mostrará 3 registros DNS que debes agregar

---

## 📋 PASO 3: Obtener Registros DNS de Resend

Resend te dará algo como esto (los valores exactos variarán):

### **Registro 1: SPF (TXT)**

```
Tipo: TXT
Nombre: @ (o potentiamx.com)
Valor: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

### **Registro 2: DKIM (TXT)**

```
Tipo: TXT
Nombre: resend._domainkey
Valor: p=MIGfMA0GCSqGSIb3DQEBAQUAA... (muy largo)
TTL: 3600
```

### **Registro 3: DMARC (TXT)**

```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=none
TTL: 3600
```

**IMPORTANTE:** Copia estos valores EXACTOS desde tu dashboard de Resend

---

## 📋 PASO 4: Agregar Registros DNS

### **Opción A: Si usas Cloudflare** (Recomendado)

1. Ve a: https://dash.cloudflare.com
2. Selecciona tu dominio `potentiamx.com`
3. Ve a **DNS** → **Records**
4. Para cada registro:

#### **Agregar SPF:**

```
Type: TXT
Name: @
Content: v=spf1 include:_spf.google.com include:_spf.resend.com ~all
TTL: Auto
Proxy status: DNS only (nube gris)
```

**NOTA:** Si ya tienes SPF de Google, **modifícalo** agregando `include:_spf.resend.com` ANTES de `~all`

#### **Agregar DKIM:**

```
Type: TXT
Name: resend._domainkey
Content: [El valor largo que te dio Resend]
TTL: Auto
Proxy status: DNS only (nube gris)
```

#### **Agregar DMARC:**

```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none; rua=mailto:hola@potentiamx.com
TTL: Auto
Proxy status: DNS only (nube gris)
```

---

### **Opción B: Si usas GoDaddy**

1. Ve a: https://dcc.godaddy.com/manage/
2. Selecciona `potentiamx.com`
3. Ve a **DNS** → **Manage**
4. Click **"Add"** para cada registro

#### **Agregar SPF:**

```
Type: TXT
Host: @
TXT Value: v=spf1 include:_spf.google.com include:_spf.resend.com ~all
TTL: 1 Hour
```

#### **Agregar DKIM:**

```
Type: TXT
Host: resend._domainkey
TXT Value: [El valor largo de Resend]
TTL: 1 Hour
```

#### **Agregar DMARC:**

```
Type: TXT
Host: _dmarc
TXT Value: v=DMARC1; p=none; rua=mailto:hola@potentiamx.com
TTL: 1 Hour
```

---

### **Opción C: Otro proveedor DNS**

Los registros son los mismos. Busca la sección de DNS de tu proveedor y agrega como TXT records.

---

## 📋 PASO 5: Verificar en Resend

1. Espera **5-15 minutos** para propagación DNS
2. Vuelve a Resend Dashboard → Domains
3. Click en **"Verify"** junto a tu dominio
4. Si todo está bien verás: ✅ **Verified**

**Si falla:**

- Espera otros 15 minutos (DNS puede tardar hasta 24h pero usualmente es rápido)
- Verifica que copiaste los valores EXACTOS
- Verifica que el SPF no tenga múltiples entradas (solo debe haber UNO)

---

## 📋 PASO 6: Revisar SPF Existente

**CRÍTICO:** Si ya tienes un registro SPF de Google Workspace, NO agregues otro. Debes **modificar el existente**.

### **Ver tu SPF actual:**

En terminal (Windows):

```bash
nslookup -type=txt potentiamx.com
```

O usa: https://mxtoolbox.com/spf.aspx

### **SPF Correcto (combinado):**

```
v=spf1 include:_spf.google.com include:_spf.resend.com ~all
```

**Incorrecto:** ❌ Tener dos registros SPF separados

---

## 📋 PASO 7: Configurar Subdominios (Opcional pero Recomendado)

Para mayor organización:

### **Opción A: Usar subdominio para transaccionales**

```
Emails manuales: hola@potentiamx.com (Google Workspace)
Emails automáticos: noreply@mail.potentiamx.com (Resend)
```

**Ventajas:**

- Separación clara
- No mezclas emails
- Mejor deliverability

**Cómo:**

1. En Resend, agrega dominio: `mail.potentiamx.com`
2. Agrega registros DNS solo para ese subdominio
3. Usa `noreply@mail.potentiamx.com` en tus emails

---

### **Opción B: Usar mismo dominio (Más simple)**

```
Emails manuales: hola@potentiamx.com (Google Workspace)
Emails automáticos: noreply@potentiamx.com (Resend)
```

**Ventajas:**

- Más simple
- Solo un dominio

**Desventajas:**

- Debes combinar registros SPF cuidadosamente

---

## 📋 PASO 8: Probar Envío de Email

Una vez verificado, prueba desde terminal:

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_RXaun1gw_A1KbSaYQEW77mKaVoRiQ1sZn" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Potentia MX <hola@potentiamx.com>",
    "to": "TU-EMAIL-PERSONAL@gmail.com",
    "subject": "Prueba de Resend",
    "html": "<h1>Funciona!</h1><p>Resend está configurado correctamente</p>"
  }'
```

**Reemplaza:**

- `TU-EMAIL-PERSONAL@gmail.com` con tu email de prueba

**Resultado esperado:**

```json
{
  "id": "abc123...",
  "from": "Potentia MX <hola@potentiamx.com>",
  "to": "tu-email@gmail.com",
  "created_at": "..."
}
```

---

## 🔍 VERIFICAR PROPAGACIÓN DNS

Usa estas herramientas para verificar:

1. **MXToolbox SPF Check:**
   https://mxtoolbox.com/spf.aspx
   - Ingresa: `potentiamx.com`
   - Debe mostrar: `include:_spf.resend.com` ✅

2. **DKIM Checker:**
   https://mxtoolbox.com/dkim.aspx
   - Selector: `resend`
   - Domain: `potentiamx.com`

3. **DMARC Checker:**
   https://mxtoolbox.com/dmarc.aspx
   - Ingresa: `potentiamx.com`

---

## ⚠️ PROBLEMAS COMUNES

### **Problema 1: "SPF PermError - Too Many DNS Lookups"**

**Causa:** Tienes muchos `include:` en tu SPF

**Solución:** Consolidar o usar subdominio

```
# Malo (>10 lookups)
v=spf1 include:_spf.google.com include:_spf.resend.com include:servers.mcsv.net include:spf.protection.outlook.com ~all

# Bueno (usar subdominio)
mail.potentiamx.com → v=spf1 include:_spf.resend.com ~all
potentiamx.com → v=spf1 include:_spf.google.com ~all
```

---

### **Problema 2: "Domain not verified"**

**Causa:** DNS no propagado o valores incorrectos

**Solución:**

1. Espera 30 minutos más
2. Verifica valores con `nslookup -type=txt resend._domainkey.potentiamx.com`
3. Si no aparece, revisa que agregaste el registro correctamente

---

### **Problema 3: Emails van a spam**

**Causa:** Falta configuración DMARC o SPF

**Solución:**

1. Verifica que SPF, DKIM y DMARC estén configurados
2. Agrega logo a Resend (Settings → Branding)
3. Usa email real en "from" (no noreply si es posible)

---

## ✅ CHECKLIST FINAL

Antes de continuar, verifica:

- [ ] Dominio agregado en Resend
- [ ] SPF actualizado (incluye Google + Resend)
- [ ] DKIM agregado (resend.\_domainkey)
- [ ] DMARC agregado (\_dmarc)
- [ ] Esperado 15-30 minutos para propagación
- [ ] Click "Verify" en Resend → ✅ Verified
- [ ] Prueba de envío exitosa
- [ ] Email recibido (no en spam)

---

## 🚀 SIGUIENTE PASO

Una vez verificado, actualiza el código:

1. Descomenta Resend en `app/api/contact/route.js`
2. Cambia `if (false &&` a `if (true &&`
3. Actualiza el email "from":
   ```javascript
   from: 'Potentia MX <hola@potentiamx.com>';
   ```

---

## 📞 ¿NECESITAS AYUDA?

Si algo falla:

1. Toma screenshot de:
   - Resend dashboard (estado del dominio)
   - Tus registros DNS
   - Error que recibes

2. Revisa logs de Resend:
   https://resend.com/logs

3. Prueba con herramienta de Gmail:
   https://toolbox.googleapps.com/apps/checkmx/

---

**Documento creado:** 18 de Enero, 2025
**Email de contacto:** hola@potentiamx.com
