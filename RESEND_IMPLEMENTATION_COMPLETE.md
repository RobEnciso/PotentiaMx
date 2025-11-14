# ✅ IMPLEMENTACIÓN COMPLETA DE RESEND - POTENTIAMX

**Fecha:** 18 de Enero, 2025
**Email:** hola@potentiamx.com
**Status:** ✅ Código listo, falta verificar dominio DNS

---

## 📦 LO QUE SE IMPLEMENTÓ

### **1. Helper Centralizado de Resend**

`lib/resend.js`

**Features:**

- ✅ Configuración centralizada de emails
- ✅ Wrapper con manejo de errores
- ✅ Templates HTML profesionales
- ✅ 3 tipos de emails implementados:
  - Email de bienvenida por plan
  - Notificación de leads
  - Reporte semanal de analytics

---

### **2. API Routes Actualizadas**

#### **a) `/api/contact` (Actualizado)**

- ✅ Usa nuevo helper `sendLeadNotification()`
- ✅ Código simplificado y mantenible
- ✅ Email desde `hola@potentiamx.com`

#### **b) `/api/send-welcome` (Nuevo)**

- ✅ Envía email de bienvenida según plan
- ✅ Llamar desde signup después de registro

---

### **3. Templates de Email por Plan**

#### **Plan FREE**

```
✨ Incluido en tu plan:
• 2 tours activos
• Editor completo
• Marketplace (1 propiedad)

🚀 Próximos Pasos:
1. Crea tu primer tour 360° en 5 minutos
2. Publica en el marketplace gratis
3. Explora las funcionalidades
```

#### **Plan STARTER**

```
✨ Incluido en tu plan:
• 10 tours activos
• 1 sesión de captura cada 3 meses
• Sin marca de agua
• Captura de leads

🚀 Próximos Pasos:
1. Programa tu primera sesión de captura
2. Configura tu formulario de leads
3. Publica propiedades en marketplace

💡 Tip: Programa tu primera sesión dentro de 48h
     y te damos 10% descuento adicional
```

#### **Plan PRO**

```
✨ Incluido en tu plan:
• 30 tours activos
• 1 sesión de captura mensual
• Analytics con sugerencias IA
• Branding personalizado

🚀 Próximos Pasos:
1. Configura tu logo y colores de marca
2. Programa sesión de captura aérea
3. Activa analytics avanzados
```

#### **Plan BUSINESS**

```
✨ Incluido en tu plan:
• Tours ilimitados
• 2 sesiones de captura mensuales
• White-label completo
• Soporte dedicado

🚀 Próximos Pasos:
1. Agenda call con tu account manager
2. Configura tu dominio personalizado
3. Setup de integración CRM
```

---

## 🔧 CONFIGURACIÓN PENDIENTE

### **PASO 1: Verificar Dominio en Resend** (30 minutos)

1. **Ve a:** https://resend.com/domains

2. **Agrega dominio:** `potentiamx.com`

3. **Copia los 3 registros DNS:**
   - SPF (TXT)
   - DKIM (TXT)
   - DMARC (TXT)

4. **Agrégalos en tu proveedor DNS:**

**Si usas Cloudflare:**

```
Type: TXT
Name: @
Content: v=spf1 include:_spf.google.com include:_spf.resend.com ~all
Proxy: DNS only (gris)

Type: TXT
Name: resend._domainkey
Content: [Valor largo de Resend]
Proxy: DNS only (gris)

Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none; rua=mailto:hola@potentiamx.com
Proxy: DNS only (gris)
```

**Si usas GoDaddy:**

```
Host: @
Type: TXT
Value: v=spf1 include:_spf.google.com include:_spf.resend.com ~all
TTL: 1 Hour

Host: resend._domainkey
Type: TXT
Value: [Valor largo de Resend]
TTL: 1 Hour

Host: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:hola@potentiamx.com
TTL: 1 Hour
```

5. **Espera 15-30 minutos** para propagación DNS

6. **Verifica en Resend:**
   - Click "Verify"
   - Debería mostrar: ✅ Verified

---

### **PASO 2: Probar Envío de Email** (5 minutos)

**Desde terminal (Windows):**

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_RXaun1gw_A1KbSaYQEW77mKaVoRiQ1sZn" \
  -H "Content-Type: application/json" \
  -d "{\"from\":\"Potentia MX <hola@potentiamx.com>\",\"to\":\"TU-EMAIL@gmail.com\",\"subject\":\"Prueba Resend\",\"html\":\"<h1>Funciona!</h1>\"}"
```

**Reemplaza:** `TU-EMAIL@gmail.com` con tu email personal

**Resultado esperado:**

```json
{
  "id": "abc123...",
  "from": "Potentia MX <hola@potentiamx.com>",
  "to": "tu-email@gmail.com"
}
```

**Revisa tu inbox** → Deberías recibir el email

---

### **PASO 3: Probar desde tu App** (10 minutos)

#### **a) Probar Email de Bienvenida**

**POST a:** `/api/send-welcome`

```bash
curl -X POST http://localhost:3000/api/send-welcome \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"tu-email@gmail.com\",\"name\":\"Roberto\",\"plan\":\"pro\"}"
```

**Revisa tu email** → Deberías recibir email de bienvenida Plan PRO

---

#### **b) Probar Notificación de Lead**

1. Abre un tour público: `http://localhost:3000/terreno/[id]`
2. Haz click en botón de contacto
3. Llena el formulario
4. Submit

**Resultado:**

- Lead guardado en BD ✅
- Email enviado al vendedor ✅
- Email de respuesta al prospecto (opcional)

---

## 📧 CONFIGURACIÓN AVANZADA (Opcional)

### **Usar Subdominios para Emails**

**Recomendación:**

```
hola@potentiamx.com → Google Workspace (emails manuales)
noreply@mail.potentiamx.com → Resend (emails automáticos)
```

**Ventajas:**

- Separación clara de emails
- Mejor deliverability
- No mezclar emails manuales con automáticos

**Cómo:**

1. En Resend, agrega: `mail.potentiamx.com`
2. Agrega registros DNS solo para ese subdominio
3. En `lib/resend.js`, cambia:

```javascript
const FROM_EMAIL = 'Potentia MX <noreply@mail.potentiamx.com>';
```

---

## 🔍 VERIFICAR CONFIGURACIÓN DNS

Usa estas herramientas:

### **1. MXToolbox SPF:**

https://mxtoolbox.com/spf.aspx

- Ingresa: `potentiamx.com`
- Debe mostrar: `include:_spf.resend.com` ✅

### **2. DKIM Checker:**

https://mxtoolbox.com/dkim.aspx

- Selector: `resend`
- Domain: `potentiamx.com`
- Debe mostrar: Valid ✅

### **3. DMARC Checker:**

https://mxtoolbox.com/dmarc.aspx

- Ingresa: `potentiamx.com`
- Debe mostrar: Valid ✅

---

## 🚀 INTEGRAR EN SIGNUP

Actualiza `app/signup/page.js`:

```javascript
// Después de crear el usuario en Supabase
const { data: userData, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.fullName,
      // ...
    },
  },
});

if (!error && userData.user) {
  // Enviar email de bienvenida
  await fetch('/api/send-welcome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userData.user.email,
      name: formData.fullName,
      plan: 'free', // O el plan que seleccionaron
    }),
  });
}
```

---

## 📊 EMAILS AUTOMATIZADOS FUTUROS

### **Email de Recordatorio de Sesión**

Enviar 24h antes de sesión de captura programada

### **Email de Reporte Semanal**

Cada lunes con stats de la semana anterior

### **Email de Upgrade**

Cuando llegan a límite de tours del plan FREE

### **Email de Confirmación de Venta**

Cuando marcan propiedad como vendida en marketplace

### **Email de Factura**

Cuando pagan comisión de marketplace

---

## ⚠️ PROBLEMAS COMUNES

### **Problema 1: "Domain not verified"**

**Solución:**

1. Espera 30 minutos más
2. Usa `nslookup -type=txt resend._domainkey.potentiamx.com`
3. Si no aparece, revisa que agregaste el registro correctamente

---

### **Problema 2: Emails van a spam**

**Soluciones:**

1. Verifica SPF, DKIM, DMARC estén configurados
2. No uses palabras spam ("GRATIS", "URGENTE", etc.)
3. Pide a destinatarios marcar como "No spam"
4. Calienta el dominio (envía poco volumen primero)

---

### **Problema 3: "SPF PermError"**

**Causa:** Tienes >10 includes en SPF

**Solución:**

- Usa subdomain `mail.potentiamx.com` solo para Resend
- O consolida includes

---

## 📝 ARCHIVOS CREADOS

1. ✅ **`lib/resend.js`**
   - Helper centralizado
   - 3 funciones de email
   - Templates profesionales

2. ✅ **`app/api/send-welcome/route.js`**
   - API para email de bienvenida
   - Integrar en signup

3. ✅ **`app/api/contact/route.js`** (actualizado)
   - Usa helper de Resend
   - Código simplificado

4. ✅ **`GUIA_CONFIGURACION_RESEND.md`**
   - Guía completa DNS
   - Paso a paso

5. ✅ **`RESEND_IMPLEMENTATION_COMPLETE.md`** (este archivo)
   - Resumen implementación
   - Checklist

---

## ✅ CHECKLIST COMPLETO

### **Configuración DNS**

- [ ] Dominio agregado en Resend
- [ ] SPF configurado (incluye Google + Resend)
- [ ] DKIM configurado (resend.\_domainkey)
- [ ] DMARC configurado (\_dmarc)
- [ ] Esperado 30 minutos propagación
- [ ] Click "Verify" en Resend → ✅ Verified

### **Pruebas**

- [ ] Prueba con curl exitosa
- [ ] Email recibido (no en spam)
- [ ] Prueba `/api/send-welcome` OK
- [ ] Prueba formulario de contacto OK

### **Integración**

- [ ] Agregar llamada a `/api/send-welcome` en signup
- [ ] Probar registro completo
- [ ] Email de bienvenida recibido

### **Verificación Final**

- [ ] SPF verificado en MXToolbox
- [ ] DKIM verificado en MXToolbox
- [ ] DMARC verificado en MXToolbox
- [ ] Emails llegando a inbox (no spam)

---

## 🎯 SIGUIENTE PASO

**Ahora mismo:**

1. Ve a https://resend.com/domains
2. Agrega `potentiamx.com`
3. Copia los 3 registros DNS
4. Agrégalos en tu proveedor (Cloudflare/GoDaddy)
5. Espera 30 minutos
6. Verifica en Resend
7. Prueba con curl
8. ¡Listo! 🎉

---

**¿Dudas?** Responde a hola@potentiamx.com

**Documento creado:** 18 de Enero, 2025
