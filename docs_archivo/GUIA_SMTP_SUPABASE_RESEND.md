# 🔧 Configurar SMTP Personalizado en Supabase con Resend

**Problema:** Los emails de autenticación de Supabase (signup, password reset) salen desde `noreply@mail.app.supabase.io` en lugar de tu dominio `potentiamx.com`.

**Solución:** Configurar Resend como proveedor SMTP en Supabase para que TODOS los emails salgan con tu branding.

---

## 📋 PASO 1: Obtener Credenciales SMTP de Resend

1. **Ve a Resend Dashboard:**
   https://resend.com/api-keys

2. **Crea una nueva API Key** (si no tienes una):
   - Click en "Create API Key"
   - Nombre: `Supabase Auth SMTP`
   - Permissions: **Full Access**
   - Click "Create"
   - **COPIA LA KEY** (solo se muestra una vez)

3. **Credenciales SMTP de Resend:**
   ```
   Host: smtp.resend.com
   Port: 465 (SSL) o 587 (TLS)
   Username: resend
   Password: [Tu API Key de Resend]
   From Email: noreply@potentiamx.com
   From Name: Potentia MX
   ```

---

## 📋 PASO 2: Configurar SMTP en Supabase

1. **Ve a tu proyecto en Supabase:**
   https://supabase.com/dashboard

2. **Navega a:**
   `Project Settings` → `Authentication` → `SMTP Settings`

3. **Activa "Enable Custom SMTP":**
   - Toggle ON

4. **Llena los campos:**

   ```
   Sender email: noreply@potentiamx.com
   Sender name: Potentia MX

   Host: smtp.resend.com
   Port number: 465

   Username: resend
   Password: [Tu Resend API Key - ejemplo: re_RXaun1gw_A1KbSaYQEW77mKaVoRiQ1sZn]
   ```

5. **Click "Save"**

---

## 📋 PASO 3: Personalizar Plantillas de Email

Supabase tiene plantillas por defecto, pero puedes personalizarlas con tu branding.

1. **Ve a:**
   `Authentication` → `Email Templates`

2. **Personaliza cada plantilla:**

### **Confirm signup (Confirmación de Registro)**

**Subject:**

```
Confirma tu registro en Potentia MX 🚀
```

**Body (HTML):**

```html
<h2>¡Bienvenido a Potentia MX!</h2>

<p>Hola,</p>

<p>
  Gracias por registrarte en Potentia MX. Para completar tu registro y activar
  tu cuenta, confirma tu email haciendo click en el botón:
</p>

<p style="text-align: center; margin: 30px 0;">
  <a
    href="{{ .ConfirmationURL }}"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;"
  >
    Confirmar mi email
  </a>
</p>

<p>O copia y pega este enlace en tu navegador:</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<p>Si no creaste esta cuenta, puedes ignorar este email.</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

<p style="color: #666; font-size: 12px;">
  Este es un email automático de <strong>Potentia MX</strong><br />
  Tours virtuales 360° para bienes raíces<br />
  <a href="https://potentiamx.com">potentiamx.com</a>
</p>
```

---

### **Magic Link (Inicio de Sesión sin Contraseña)**

**Subject:**

```
Tu enlace de acceso a Potentia MX 🔐
```

**Body:**

```html
<h2>Inicia sesión en Potentia MX</h2>

<p>Hola,</p>

<p>Haz click en el botón para iniciar sesión en tu cuenta:</p>

<p style="text-align: center; margin: 30px 0;">
  <a
    href="{{ .ConfirmationURL }}"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;"
  >
    Iniciar Sesión
  </a>
</p>

<p>O copia y pega este enlace:</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<p><strong>Este enlace expira en 1 hora.</strong></p>

<p>Si no solicitaste este email, puedes ignorarlo.</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

<p style="color: #666; font-size: 12px;">
  Este es un email automático de <strong>Potentia MX</strong><br />
  <a href="https://potentiamx.com">potentiamx.com</a>
</p>
```

---

### **Reset Password (Recuperar Contraseña)**

**Subject:**

```
Recupera tu contraseña de Potentia MX 🔑
```

**Body:**

```html
<h2>Recuperar contraseña</h2>

<p>Hola,</p>

<p>
  Recibimos una solicitud para restablecer la contraseña de tu cuenta de
  Potentia MX.
</p>

<p>Haz click en el botón para crear una nueva contraseña:</p>

<p style="text-align: center; margin: 30px 0;">
  <a
    href="{{ .ConfirmationURL }}"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;"
  >
    Restablecer Contraseña
  </a>
</p>

<p>O copia y pega este enlace:</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<p><strong>Este enlace expira en 1 hora.</strong></p>

<p>
  Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá
  sin cambios.
</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

<p style="color: #666; font-size: 12px;">
  Este es un email automático de <strong>Potentia MX</strong><br />
  <a href="https://potentiamx.com">potentiamx.com</a>
</p>
```

---

### **Change Email Address (Cambiar Email)**

**Subject:**

```
Confirma tu nuevo email en Potentia MX ✉️
```

**Body:**

```html
<h2>Confirma tu nuevo email</h2>

<p>Hola,</p>

<p>
  Recibimos una solicitud para cambiar el email de tu cuenta de Potentia MX.
</p>

<p>Haz click en el botón para confirmar tu nuevo email:</p>

<p style="text-align: center; margin: 30px 0;">
  <a
    href="{{ .ConfirmationURL }}"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;"
  >
    Confirmar Nuevo Email
  </a>
</p>

<p>O copia y pega este enlace:</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<p>Si no solicitaste este cambio, ignora este email.</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

<p style="color: #666; font-size: 12px;">
  Este es un email automático de <strong>Potentia MX</strong><br />
  <a href="https://potentiamx.com">potentiamx.com</a>
</p>
```

---

## 📋 PASO 4: Probar el Sistema

1. **Cierra sesión** en tu aplicación

2. **Registra un nuevo usuario de prueba:**
   - Ve a: http://localhost:3000/signup
   - Usa un email de prueba diferente
   - Submit

3. **Revisa tu inbox:**
   - Deberías recibir **2 emails:**
     1. ✅ Confirmación de Supabase desde `noreply@potentiamx.com`
     2. ✅ Bienvenida de Resend desde `hola@potentiamx.com`

4. **Verifica el remitente:**
   - Ambos emails deben mostrar "Potentia MX"
   - Ninguno debe venir de `mail.app.supabase.io`

---

## ⚠️ PROBLEMAS COMUNES

### **Problema 1: "SMTP Connection Failed"**

**Causa:** Credenciales incorrectas o puerto bloqueado

**Solución:**

1. Verifica que copiaste la API key completa de Resend
2. Intenta cambiar el puerto:
   - Puerto 465 con SSL
   - Puerto 587 con TLS
3. Verifica que tu firewall no bloquee el puerto

---

### **Problema 2: Emails siguen llegando desde Supabase**

**Causa:** SMTP personalizado no está activado

**Solución:**

1. Verifica que "Enable Custom SMTP" esté ON
2. Click "Save" nuevamente
3. Espera 1-2 minutos para que los cambios se apliquen
4. Prueba con un nuevo registro

---

### **Problema 3: Emails van a spam**

**Causa:** DNS de Resend no verificado

**Solución:**

1. Verifica que completaste la configuración DNS en `GUIA_CONFIGURACION_RESEND.md`
2. Confirma que tu dominio está verificado en Resend Dashboard
3. Revisa SPF/DKIM/DMARC en https://mxtoolbox.com

---

## 🔍 VERIFICAR CONFIGURACIÓN

### **Test 1: Verificar SMTP en Supabase**

En Supabase Dashboard → Authentication → SMTP Settings:

- ✅ "Enable Custom SMTP" debe estar ON
- ✅ Host: `smtp.resend.com`
- ✅ Sender email: `noreply@potentiamx.com`

### **Test 2: Verificar Resend API Key**

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer [TU_API_KEY]" \
  -H "Content-Type: application/json" \
  -d "{\"from\":\"Potentia MX <noreply@potentiamx.com>\",\"to\":\"tu-email@gmail.com\",\"subject\":\"Test\",\"html\":\"<h1>Test</h1>\"}"
```

Debe retornar:

```json
{
  "id": "abc123...",
  "from": "Potentia MX <noreply@potentiamx.com>"
}
```

### **Test 3: Registro de Usuario**

1. Registra usuario nuevo
2. Revisa logs en Resend Dashboard → Logs
3. Debes ver 2 emails enviados:
   - Uno desde `/api/send-welcome` (bienvenida)
   - Uno desde Supabase SMTP (confirmación)

---

## 📊 FLUJO COMPLETO DE EMAILS

```
Usuario se registra en /signup
    ↓
Supabase Auth crea usuario
    ↓
┌─────────────────────────────────────┐
│  EMAIL 1: Confirmación (Supabase)   │
│  From: noreply@potentiamx.com       │ ← SMTP Personalizado ✅
│  Via: smtp.resend.com               │
│  Template: Plantilla personalizada  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  EMAIL 2: Bienvenida (App)          │
│  From: hola@potentiamx.com          │ ← Resend API ✅
│  Via: /api/send-welcome             │
│  Template: lib/resend.js            │
└─────────────────────────────────────┘
    ↓
Usuario recibe 2 emails con branding Potentia MX
```

---

## ✅ CHECKLIST COMPLETO

### **Configuración SMTP:**

- [ ] API Key de Resend creada
- [ ] SMTP habilitado en Supabase
- [ ] Host configurado: `smtp.resend.com`
- [ ] Puerto configurado: 465 o 587
- [ ] Username: `resend`
- [ ] Password: API Key de Resend
- [ ] Sender email: `noreply@potentiamx.com`

### **Plantillas:**

- [ ] Plantilla de confirmación personalizada
- [ ] Plantilla de password reset personalizada
- [ ] Plantilla de magic link personalizada
- [ ] Plantilla de change email personalizada

### **Pruebas:**

- [ ] Test de registro completado
- [ ] Email de confirmación recibido desde `potentiamx.com`
- [ ] Email de bienvenida recibido desde `potentiamx.com`
- [ ] Ningún email viene de `mail.app.supabase.io`
- [ ] Emails no van a spam

---

## 🎯 RESULTADO FINAL

**ANTES:**

```
Confirmación signup: noreply@mail.app.supabase.io ❌
Bienvenida: hola@potentiamx.com ✅
```

**DESPUÉS:**

```
Confirmación signup: noreply@potentiamx.com ✅
Bienvenida: hola@potentiamx.com ✅
```

**Todos los emails con tu branding** 🎉

---

## 🔐 SEGURIDAD: Guardar API Key

**IMPORTANTE:** La API Key de Resend debe estar en variables de entorno, NO en el código.

Tu `.env.local` ya tiene:

```
RESEND_API_KEY=re_RXaun1gw_A1KbSaYQEW77mKaVoRiQ1sZn
```

**Para Supabase SMTP:**

- La API Key se guarda en Supabase Dashboard (server-side)
- No se expone en el frontend
- No necesitas agregarla a `.env.local` nuevamente

---

## 📚 ALTERNATIVA: Usar Subdominio

Si quieres separar aún más los emails:

```
Emails de autenticación: noreply@auth.potentiamx.com
Emails de bienvenida: hola@potentiamx.com
Emails de notificaciones: noreply@mail.potentiamx.com
```

**Configuración:**

1. En Resend, agrega subdominios adicionales
2. Configura DNS para cada subdominio
3. En Supabase SMTP, usa: `noreply@auth.potentiamx.com`
4. En `lib/resend.js`, mantén: `hola@potentiamx.com`

---

## 🚀 SIGUIENTE PASO

**Ahora mismo:**

1. Ve a https://resend.com/api-keys
2. Crea API Key para SMTP
3. Ve a Supabase → Project Settings → Authentication → SMTP Settings
4. Activa Custom SMTP
5. Llena credenciales de Resend
6. Personaliza plantillas de email
7. Prueba con nuevo registro
8. ¡Listo! Todos tus emails tendrán branding profesional 🎉

---

**Documento creado:** 18 de Enero, 2025
**Soporte:** hola@potentiamx.com
