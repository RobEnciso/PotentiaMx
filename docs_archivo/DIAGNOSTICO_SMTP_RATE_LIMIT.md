# 🔍 DIAGNÓSTICO: Email Rate Limit Exceeded

**Problema:** Sigues recibiendo "email rate limit exceeded" aunque tengas SMTP personalizado configurado.

**Posibles causas:**

1. SMTP personalizado no está realmente activo
2. Error en la configuración de SMTP
3. Dominio no verificado en Resend
4. Supabase hace fallback al SMTP por defecto
5. Rate limit viene de otro lado (no del SMTP)

---

## ✅ PASO 1: Verificar que SMTP Personalizado esté ACTIVO

### **En Supabase Dashboard:**

1. Ve a tu proyecto en Supabase
2. **Settings** → **Authentication** → **SMTP Settings**
3. **Verifica que el toggle "Enable Custom SMTP" esté ON (verde)**

**Si está OFF (gris):**

- ❌ Supabase usa su SMTP por defecto (con rate limits)
- ✅ Actívalo y guarda

**Si está ON pero sigue fallando:**

- Continúa al Paso 2

---

## ✅ PASO 2: Verificar Configuración de SMTP

### **Revisa que los valores sean EXACTOS:**

```
Sender email: noreply@potentiamx.com
Sender name: Potentia MX

Host: smtp.resend.com
Port: 465

Username: resend
Password: re_RXaun1gw_A1KbSaYQEW77mKaVoRiQ1sZn
```

### **⚠️ ERRORES COMUNES:**

❌ **Puerto incorrecto:**

- Si usas 587 en lugar de 465, puede fallar
- **Solución:** Cambia a puerto 465

❌ **Username incorrecto:**

- Debe ser exactamente: `resend` (en minúsculas)
- NO tu email
- NO tu nombre de usuario de Resend

❌ **Password con espacios:**

- Asegúrate de copiar la API key SIN espacios al inicio/final
- Usa: `re_RXaun1gw_A1KbSaYQEW77mKaVoRiQ1sZn`

❌ **Sender email incorrecto:**

- Debe coincidir con un dominio verificado en Resend
- Si tu dominio NO está verificado, Resend rechazará los emails

---

## ✅ PASO 3: Verificar Dominio en Resend

### **1. Ve a Resend Dashboard:**

https://resend.com/domains

### **2. Verifica que `potentiamx.com` esté:**

- ✅ **Verified** (con check verde)

**Si NO está verificado:**

- Resend rechazará todos los emails
- Supabase hará fallback a su SMTP por defecto
- Resultado: Rate limit de Supabase (3 emails/hora)

**Si dice "Pending" o "Not Verified":**

1. Haz click en el dominio
2. Copia los registros DNS (SPF, DKIM, DMARC)
3. Agrégalos en tu proveedor DNS (Namecheap/Cloudflare)
4. Espera 15-30 minutos
5. Click "Verify" en Resend

---

## ✅ PASO 4: Revisar Logs de Supabase

### **Opción A: Logs de Auth**

1. En Supabase Dashboard
2. **Logs** → **Auth Logs**
3. Busca errores recientes relacionados con SMTP:
   - "SMTP connection failed"
   - "Authentication failed"
   - "Failed to send email"

**Si ves errores SMTP:**

- Supabase está intentando usar tu SMTP personalizado pero falla
- Revisa la configuración (Paso 2)
- Revisa dominio verificado (Paso 3)

**Si NO ves errores SMTP:**

- Puede que SMTP personalizado no esté activo (vuelve a Paso 1)

### **Opción B: Logs de Edge Functions**

1. **Logs** → **Edge Functions**
2. Busca errores de rate limit:
   ```
   "rate_limit_exceeded"
   "Too many requests"
   ```

---

## ✅ PASO 5: Probar SMTP Directamente

### **Test desde Terminal (Windows):**

Prueba si Resend funciona independientemente:

```bash
curl -X POST https://api.resend.com/emails ^
  -H "Authorization: Bearer re_RXaun1gw_A1KbSaYQEW77mKaVoRiQ1sZn" ^
  -H "Content-Type: application/json" ^
  -d "{\"from\":\"Potentia MX <noreply@potentiamx.com>\",\"to\":\"tu-email@gmail.com\",\"subject\":\"Test SMTP\",\"html\":\"<h1>Test directo de Resend</h1>\"}"
```

**Reemplaza:** `tu-email@gmail.com` con tu email real

**Resultado esperado:**

```json
{
  "id": "abc123...",
  "from": "Potentia MX <noreply@potentiamx.com>",
  "to": "tu-email@gmail.com"
}
```

**Si falla:**

- Verifica que el dominio esté verificado en Resend
- Verifica que la API key sea correcta

**Si funciona:**

- Resend está bien configurado
- El problema está en la configuración de Supabase

---

## ✅ PASO 6: Revisar Quotas de Resend

### **Ve a Resend Dashboard:**

https://resend.com/overview

### **Verifica:**

1. **Emails enviados hoy:**
   - Plan FREE: 100 emails/día
   - Si ya enviaste 100+ → espera hasta mañana

2. **Emails enviados este mes:**
   - Plan FREE: 3,000 emails/mes
   - Si ya enviaste 3,000+ → upgrade o espera al próximo mes

3. **Estado de la cuenta:**
   - Verifica que no esté suspendida
   - Verifica que no haya bounces excesivos

---

## ✅ PASO 7: Revisar Rate Limits de Supabase Auth

Aunque uses SMTP personalizado, Supabase Auth tiene sus propios rate limits:

### **Límites de Supabase Auth (independientes del SMTP):**

- **Signup:** 2 registros por minuto desde la misma IP
- **Login:** 10 intentos fallidos por hora
- **Password Reset:** **4 solicitudes por hora por usuario** ⚠️

### **⚠️ IMPORTANTE: Rate Limit de Password Reset**

Incluso con SMTP personalizado, Supabase limita:

- **4 solicitudes de reset por hora** por email
- Este límite NO se puede cambiar en plan FREE
- Es una medida de seguridad anti-spam

**Si hiciste 4+ solicitudes:**

- Espera 1 hora desde la primera solicitud
- El contador se resetea automáticamente

---

## 🔍 DIAGNÓSTICO RÁPIDO

Ejecuta esto en **Supabase SQL Editor** para ver cuántas solicitudes has hecho:

```sql
-- Ver cuántos emails de reset se han enviado en la última hora
SELECT
  email,
  created_at,
  COUNT(*) as intentos
FROM auth.users
WHERE updated_at > NOW() - INTERVAL '1 hour'
GROUP BY email, created_at
ORDER BY created_at DESC;
```

---

## 🎯 SOLUCIÓN PROBABLE

Basándome en que ya tienes SMTP configurado, el problema es **muy probablemente**:

### **Rate Limit de Auth, NO de SMTP**

Supabase Auth limita a **4 solicitudes de password reset por hora** por seguridad, independientemente del SMTP que uses.

**Solución:**

- Espera 1 hora desde tu primera solicitud
- El límite se resetea automáticamente
- Usa con moderación (máximo 4 veces por hora por usuario)

---

## 🔧 CONFIGURACIÓN CORRECTA FINAL

Para confirmar que todo está bien, verifica:

### **✅ Checklist:**

**Supabase SMTP:**

- [ ] Toggle "Enable Custom SMTP" está **ON**
- [ ] Host: `smtp.resend.com`
- [ ] Port: `465`
- [ ] Username: `resend`
- [ ] Password: Tu API key completa de Resend
- [ ] Sender: `noreply@potentiamx.com`

**Resend:**

- [ ] Dominio `potentiamx.com` está **Verified** ✅
- [ ] API key es válida
- [ ] No has excedido 100 emails/día

**Rate Limits:**

- [ ] No has hecho más de 4 solicitudes de reset en la última hora
- [ ] Han pasado al menos 60 minutos desde la primera solicitud

---

## 📊 TABLA DE RATE LIMITS

| Tipo           | SMTP Default       | SMTP Personalizado | Auth Limit                |
| -------------- | ------------------ | ------------------ | ------------------------- |
| Signup         | 30/hora            | 100/día (Resend)   | 2/min por IP              |
| Password Reset | 3/hora por usuario | 100/día (Resend)   | **4/hora por usuario** ⚠️ |
| Total emails   | 30/hora proyecto   | 3,000/mes (Resend) | N/A                       |

**El límite de 4 solicitudes/hora de Auth NO se puede cambiar** en plan FREE.

---

## 🚀 RECOMENDACIONES

### **Para Desarrollo:**

- Usa emails diferentes para cada prueba
- Espera 1 hora entre ciclos de pruebas intensivas
- Considera crear usuarios de prueba temporales

### **Para Producción:**

- Educación a usuarios: "Si no recibiste el email, espera unos minutos antes de solicitarlo nuevamente"
- Mensaje claro cuando se alcanza el límite: "Has solicitado demasiados códigos de recuperación. Por favor espera 1 hora e intenta nuevamente."
- Logs de monitoreo de rate limits

---

## 💡 MENSAJE DE ERROR MEJORADO

Actualiza el mensaje de error en `/app/login/page.js` para ser más claro:

```javascript
if (error.message.includes('rate limit')) {
  setResetError(
    'Has solicitado demasiados enlaces de recuperación. ' +
      'Por favor espera 1 hora e intenta nuevamente. ' +
      'Si necesitas ayuda inmediata, contacta a soporte.',
  );
} else {
  setResetError(error.message);
}
```

---

## ✅ SIGUIENTE PASO

1. **Verifica** que SMTP personalizado esté ON
2. **Confirma** que dominio esté verificado en Resend
3. **Espera** 1 hora desde tu primera solicitud
4. **Prueba** nuevamente

Si después de estos pasos sigue fallando, el problema está en la configuración de SMTP. Revisa los logs de Supabase para ver el error exacto.

---

**Documento creado:** 18 de Enero, 2025
**Problema:** Email rate limit exceeded
**Solución probable:** Rate limit de Auth (4 solicitudes/hora), no de SMTP
