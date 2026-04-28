# 🚨 SOLUCIÓN: Rate Limiting de Supabase

**Fecha:** 19 de Octubre, 2025
**Problema:** Error 429 - Email rate limit exceeded
**Afecta:** Signup, Password Recovery, todas las operaciones de Auth
**Severidad:** 🔴 BLOQUEANTE para desarrollo

---

## 📋 SÍNTOMAS DEL PROBLEMA

- ❌ No puedes crear nuevas cuentas (signup)
- ❌ No puedes solicitar recuperación de contraseña
- ❌ Error en consola: `429 (Too Many Requests)`
- ❌ Mensaje: "Email rate limit exceeded"

---

## ⚡ SOLUCIÓN INMEDIATA (5 minutos)

### **PASO 1: Abre Supabase SQL Editor**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: **PotentiaMX**
3. Click en **SQL Editor** (icono de tabla en el menú izquierdo)
4. Click en **"New query"**

### **PASO 2: Ejecuta este script para limpiar rate limits**

Copia y pega TODO este código y presiona **RUN** (o Ctrl+Enter):

```sql
-- ================================================================
-- LIMPIAR RATE LIMITS - SOLO PARA DESARROLLO
-- ================================================================
-- ⚠️ NO ejecutar en producción con usuarios reales
-- ================================================================

-- 1️⃣ Ver qué está bloqueado actualmente
SELECT
  action,
  COUNT(*) as total_intentos,
  payload->>'email' as email,
  MAX(created_at) as ultimo_intento
FROM auth.audit_log_entries
WHERE created_at > NOW() - INTERVAL '2 hours'
GROUP BY action, payload->>'email'
ORDER BY total_intentos DESC
LIMIT 20;

-- 2️⃣ Limpiar intentos de signup
DELETE FROM auth.audit_log_entries
WHERE action IN ('user_signedup', 'user_signup_failed')
  AND created_at > NOW() - INTERVAL '3 hours';

-- 3️⃣ Limpiar intentos de password recovery
DELETE FROM auth.audit_log_entries
WHERE action IN ('user_recovery_requested', 'user_recovery_failed')
  AND created_at > NOW() - INTERVAL '3 hours';

-- 4️⃣ Limpiar intentos de login fallidos
DELETE FROM auth.audit_log_entries
WHERE action IN ('login_failed', 'logout')
  AND created_at > NOW() - INTERVAL '3 hours';

-- 5️⃣ Verificar que se limpiaron (debería mostrar 0 o muy pocos)
SELECT
  action,
  COUNT(*) as total
FROM auth.audit_log_entries
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY action
ORDER BY total DESC;
```

### **PASO 3: Verificar que funcionó**

1. Cierra el navegador donde tienes tu app (Ctrl+W)
2. Abre una **nueva ventana privada/incógnito** (Ctrl+Shift+N)
3. Ve a `http://localhost:3000/signup`
4. Intenta crear una cuenta con un email nuevo

✅ **Si funciona:** ¡Problema resuelto!
❌ **Si sigue fallando:** Continúa con la Solución Avanzada abajo

---

## 🔧 SOLUCIÓN PERMANENTE - Configurar Rate Limits

### **Opción A: Desde Supabase Dashboard** (Recomendado)

1. **Settings** → **Auth** (menú lateral izquierdo)
2. Busca la sección **"Security and Protection"** o **"Rate Limits"**
3. Ajusta estos valores:

```
📊 VALORES RECOMENDADOS PARA DESARROLLO:

✅ SMTP rate limits:
   - Emails per hour: 30 (default: 3-5)

✅ Authentication rate limits:
   - Signup attempts per hour: 100 (default: 10-20)
   - Password recovery per hour: 50 (default: 5)
   - Login attempts per minute: 30 (default: 5)
```

4. Click **"Save"**
5. Espera 1 minuto para que se apliquen los cambios

### **Opción B: Variables de Entorno** (Si no encuentras la UI)

1. **Settings** → **Auth** → **Auth Providers**
2. Scroll hasta el fondo
3. Busca **"Advanced Settings"** o **"Custom Configuration"**
4. Agrega/modifica estas variables:

```
GOTRUE_RATE_LIMIT_EMAIL_SENT=30
GOTRUE_RATE_LIMIT_SIGNUP=100
GOTRUE_RATE_LIMIT_RECOVERY=50
```

---

## 🛡️ SOLUCIÓN PARA PRODUCCIÓN (Futuro)

Cuando lances a producción, NO uses los límites altos. En su lugar:

### **1. Rate Limits Recomendados para PRODUCCIÓN:**

```
✅ Signup: 10 intentos/hora por IP
✅ Recovery: 5 intentos/hora por email
✅ Login: 5 intentos/minuto por IP
✅ SMTP: 10 emails/hora por usuario
```

### **2. Implementar CAPTCHA**

```javascript
// En signup/page.js y login/page.js
import ReCAPTCHA from 'react-google-recaptcha';

const handleSignup = async (e) => {
  // Verificar CAPTCHA primero
  const captchaToken = await recaptchaRef.current.executeAsync();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      captchaToken: captchaToken, // Enviar a Supabase
    },
  });
};
```

### **3. Monitorear intentos sospechosos**

```sql
-- Query para ver IPs con muchos intentos
SELECT
  ip_address,
  COUNT(*) as intentos,
  array_agg(DISTINCT action) as acciones
FROM auth.audit_log_entries
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) > 20
ORDER BY intentos DESC;
```

---

## 📝 MEJORAS IMPLEMENTADAS EN EL CÓDIGO

### **1. Signup (`app/signup/page.js`)** ✅

Ahora muestra mensajes más claros:

```javascript
if (signUpError.message.includes('rate limit') || signUpError.status === 429) {
  setError(
    '⏳ Demasiados intentos de registro. Por favor espera 1 hora e intenta nuevamente. ' +
      'Si necesitas ayuda inmediata, contacta a soporte@potentiamx.com',
  );
}
```

### **2. Login (`app/login/page.js`)** ✅

Ya tenía manejo de rate limit en password recovery:

```javascript
if (error.message.includes('rate limit')) {
  setResetError(
    'Has solicitado demasiados enlaces de recuperación. Por favor espera 1 hora...',
  );
}
```

### **3. Reset Password (`app/reset-password/page.js`)** ✅

Ahora tiene logs de debugging para identificar problemas.

---

## 🧪 TESTING DESPUÉS DE LA SOLUCIÓN

### **Test 1: Signup**

```bash
1. Abre navegador incógnito
2. Ve a http://localhost:3000/signup
3. Registra un nuevo email (ej: test1@potentiamx.com)
4. ✅ Debería funcionar sin errores
```

### **Test 2: Password Recovery**

```bash
1. Ve a http://localhost:3000/login
2. Click "¿Olvidaste tu contraseña?"
3. Ingresa tu email
4. ✅ Debería enviar el email sin errores
```

### **Test 3: Recibir email y resetear**

```bash
1. Revisa tu inbox
2. Click en el enlace del email
3. ✅ Debería redirigir a /reset-password
4. ✅ Debería mostrar formulario (no error)
5. Cambia la contraseña
6. ✅ Debería redirigir a dashboard
```

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### **Problema 1: Sigo viendo 429 después de limpiar**

**Solución:**

```bash
# Limpiar cookies y caché del navegador
1. Ctrl+Shift+Delete
2. Seleccionar "Últimas 4 horas"
3. Marcar "Cookies" y "Caché"
4. Click "Eliminar datos"
5. Reiniciar navegador
```

### **Problema 2: El script SQL da error de permisos**

**Solución:**

```sql
-- Verificar que tienes permisos de admin
SELECT current_user, current_database();

-- Si no eres admin, usa el dashboard de Supabase:
-- Authentication → Users → busca manualmente y elimina duplicados
```

### **Problema 3: Emails no llegan después de limpiar**

**Verificar configuración SMTP:**

```bash
1. Supabase Dashboard → Settings → Auth
2. Scroll a "SMTP Settings"
3. Verificar:
   - Host: smtp.resend.com (o tu SMTP)
   - Port: 587
   - Username: resend
   - Password: [tu API key]
   - Sender: noreply@potentiamx.com
```

---

## 📊 MONITOREO EN DESARROLLO

### **Query útil para monitorear intentos:**

```sql
-- Ejecutar cada 15 minutos durante desarrollo
SELECT
  action,
  payload->>'email' as email,
  COUNT(*) as intentos,
  MAX(created_at) as ultimo_intento,
  CASE
    WHEN COUNT(*) > 10 THEN '🔴 ALTO'
    WHEN COUNT(*) > 5 THEN '🟡 MEDIO'
    ELSE '🟢 OK'
  END as estado
FROM auth.audit_log_entries
WHERE created_at > NOW() - INTERVAL '30 minutes'
GROUP BY action, payload->>'email'
ORDER BY intentos DESC;
```

---

## 🎯 RECOMENDACIONES PARA TU STARTUP

Como fundador/único dev, para evitar este problema en el futuro:

### **1. Durante Desarrollo (AHORA):**

- ✅ Usa límites altos (30-100 requests/hora)
- ✅ Limpia los logs cada 2-3 días
- ✅ Usa emails de prueba diferentes cada vez

### **2. Antes de Lanzar Beta:**

- ✅ Implementa CAPTCHA en signup/login
- ✅ Configura rate limits moderados (10-20/hora)
- ✅ Activa email de confirmación obligatorio

### **3. En Producción:**

- ✅ Rate limits estrictos (5-10/hora)
- ✅ Monitoreo automático de intentos sospechosos
- ✅ Alertas si una IP hace >20 intentos/hora

---

## 🚀 PRÓXIMOS PASOS

**AHORA MISMO:**

1. ✅ Ejecuta el script SQL de limpieza (arriba)
2. ✅ Verifica que signup funciona
3. ✅ Prueba el flujo de password recovery completo

**ESTA SEMANA:**

1. Ajusta rate limits en Supabase Dashboard
2. Crea 2-3 usuarios de prueba para testing
3. Documenta los emails de prueba que usas

**ANTES DE LANZAR:**

1. Implementa CAPTCHA
2. Configura rate limits de producción
3. Testing completo del flujo de auth

---

## 📝 EMAILS DE PRUEBA RECOMENDADOS

Para evitar rate limiting durante desarrollo, usa estos emails rotativos:

```
✅ Para testing general:
- test1@potentiamx.com
- test2@potentiamx.com
- test3@potentiamx.com

✅ Para testing de recovery:
- recovery-test@potentiamx.com

✅ Tu email personal:
- creafilmsvallarta@gmail.com (úsalo SOLO cuando sea necesario)
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Script SQL ejecutado sin errores
- [ ] Puedo crear una cuenta nueva (signup)
- [ ] Puedo solicitar recuperación de contraseña
- [ ] Email de recovery llega a mi inbox
- [ ] Link de recovery abre /reset-password sin errores
- [ ] Puedo cambiar la contraseña exitosamente
- [ ] Redirige a dashboard después de cambiar contraseña
- [ ] Rate limits ajustados en Supabase Dashboard
- [ ] Documenté emails de prueba que uso

---

**Documento creado:** 19 de Octubre, 2025
**Última actualización:** Hoy
**Próxima revisión:** Después de resolver el issue
**Contacto:** Roberto (Founder/Dev)

---

## 🆘 SI NADA FUNCIONA

Si después de seguir todos los pasos sigues teniendo problemas:

1. **Exporta los datos de usuarios existentes** (por si acaso)
2. **Resetea completamente el proyecto de Supabase Auth:**

   ```sql
   -- ⚠️ CUIDADO: Esto elimina TODOS los usuarios y auditoría
   TRUNCATE auth.audit_log_entries;
   -- NO ejecutes esto a menos que sea absolutamente necesario
   ```

3. **Contacta a Supabase Support:**
   - Dashboard → Help → Support
   - Describe el problema del rate limiting
   - Pide que reseteen los límites desde su lado

4. **Como último recurso:** Crea un nuevo proyecto Supabase y migra los datos
