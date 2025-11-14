# 🧪 GUÍA DE TESTING: Recuperación de Contraseña

**Fecha:** 19 de Octubre, 2025
**Objetivo:** Identificar por qué el link de recuperación no redirige al formulario
**Status:** Debugging con logs habilitados

---

## 📋 PRERREQUISITOS

Antes de empezar, verifica:

- [ ] El servidor de desarrollo está corriendo (`npm run dev`)
- [ ] Tienes acceso al email donde recibirás el link de recuperación
- [ ] El límite de emails en Supabase está configurado a 30 (ya hecho ✓)
- [ ] **IMPORTANTE:** Vas a usar un email que YA ESTÉ REGISTRADO en la plataforma

---

## 🔍 PASO A PASO COMPLETO

### **PASO 1: Preparar el Navegador para Debugging**

1. **Abre una ventana nueva de navegador** (usa Chrome, Edge o Firefox)
2. **Presiona F12** para abrir las DevTools
3. **Ve a la pestaña "Console"** (Consola)
4. **IMPORTANTE:** Deja esta consola abierta durante TODO el proceso
5. (Opcional) Click derecho en la consola → "Clear console" para limpiar

**Screenshot de referencia:**

```
┌─────────────────────────────────────┐
│ Elements  Console  Sources  Network │  ← Selecciona "Console"
├─────────────────────────────────────┤
│                                     │
│  (Aquí aparecerán los logs)        │
│                                     │
└─────────────────────────────────────┘
```

---

### **PASO 2: Solicitar el Link de Recuperación**

1. **En la barra de direcciones, ve a:**

   ```
   http://localhost:3000/login
   ```

2. **Click en el botón:** `"¿Olvidaste tu contraseña?"`

3. **En el modal que aparece:**
   - Ingresa tu email: `creafilmsvallarta@gmail.com` (o cualquier email que YA esté registrado)
   - Click en **"Enviar Enlace de Recuperación"**

4. **Espera el mensaje de éxito:**

   ```
   "Enlace de recuperación enviado. Revisa tu email..."
   ```

5. **Verifica en la consola** que NO haya errores de rate limiting

---

### **PASO 3: Abrir el Email de Recuperación**

1. **Abre tu cliente de email** (Gmail, Outlook, etc.)
2. **Busca el email de Supabase** con asunto similar a:
   - "Reset your password" o
   - "Restablecer contraseña"
3. **IMPORTANTE:** NO hagas click en el link todavía

---

### **PASO 4: Preparar para Capturar Logs**

1. **Vuelve al navegador** donde tienes la consola abierta (F12)
2. **Asegúrate que la consola esté visible**
3. **Verifica que el servidor de desarrollo esté corriendo**
4. **Limpia la consola** (Click derecho → Clear console) para ver solo los nuevos logs

---

### **PASO 5: Click en el Link de Recuperación (CRÍTICO)**

1. **En el email, haz click derecho sobre el botón/link de recuperación**
2. **Selecciona "Copiar dirección del enlace"** (NO hagas click normal todavía)
3. **Pega el link en un editor de texto** (Notepad) para verificar su estructura

**El link debería verse así:**

```
http://localhost:3000/reset-password#access_token=ey...&expires_in=3600&refresh_token=...&token_type=bearer&type=recovery
```

4. **Verifica que tenga:**
   - ✅ `#access_token=...`
   - ✅ `refresh_token=...`
   - ✅ `type=recovery`

5. **Si el link se ve correcto:**
   - Copia el link completo
   - Pégalo en la barra de direcciones del navegador donde tienes la consola abierta
   - Presiona Enter

6. **INMEDIATAMENTE después de presionar Enter:**
   - **OBSERVA LA CONSOLA** (F12)
   - Deberían aparecer logs que empiezan con `🔍 [RESET]`

---

### **PASO 6: Capturar y Analizar los Logs**

**Deberías ver una secuencia de logs como esta:**

✅ **Escenario EXITOSO (el que queremos ver):**

```
🔍 [RESET] Iniciando verificación de sesión...
🔍 [RESET] URL completa: http://localhost:3000/reset-password#access_token=ey...
🔍 [RESET] Hash: #access_token=ey...&refresh_token=...&type=recovery
🔍 [RESET] Tokens encontrados en hash: {hasAccessToken: true, hasRefreshToken: true, type: "recovery", ...}
✅ [RESET] Intentando establecer sesión con tokens del hash...
🔍 [RESET] Resultado de setSession: {hasData: true, hasSession: true, hasUser: true, error: null}
✅ [RESET] Sesión establecida exitosamente!
```

❌ **Escenario FALLIDO (posibles problemas):**

**Problema 1: No hay tokens en el hash**

```
🔍 [RESET] Iniciando verificación de sesión...
🔍 [RESET] URL completa: http://localhost:3000/reset-password
🔍 [RESET] Hash: (vacío o sin tokens)
🔍 [RESET] Tokens encontrados en hash: {hasAccessToken: false, hasRefreshToken: false}
⚠️ [RESET] No se encontraron tokens en el hash
🔍 [RESET] Intentando getSession()...
❌ [RESET] No hay sesión válida
```

→ **Causa:** El link del email no tiene el hash con tokens

**Problema 2: Error al establecer sesión**

```
🔍 [RESET] Tokens encontrados en hash: {hasAccessToken: true, hasRefreshToken: true, ...}
✅ [RESET] Intentando establecer sesión con tokens del hash...
🔍 [RESET] Resultado de setSession: {hasData: false, error: {message: "..."}}
❌ [RESET] Error estableciendo sesión: {...}
```

→ **Causa:** Tokens inválidos o expirados

**Problema 3: setSession no devuelve sesión**

```
✅ [RESET] Intentando establecer sesión con tokens del hash...
🔍 [RESET] Resultado de setSession: {hasData: true, hasSession: false, hasUser: false}
⚠️ [RESET] setSession no devolvió sesión válida
```

→ **Causa:** Problema con la configuración de Supabase Auth

---

### **PASO 7: Copiar TODOS los Logs**

1. **Click derecho en la consola**
2. **Selecciona "Save as..."** o "Guardar como..."
3. **Guarda el archivo como:** `console-logs-password-recovery.txt`

**O ALTERNATIVAMENTE:**

1. **Selecciona todos los logs** (Ctrl+A en la consola)
2. **Copia** (Ctrl+C)
3. **Pégalos en un nuevo archivo de texto**

---

### **PASO 8: Verificar el Comportamiento de la UI**

Después de hacer click en el link, la pantalla debería:

✅ **Si funciona correctamente:**

1. Mostrar por 1-2 segundos: "Verificando enlace de recuperación..."
2. Luego mostrar el **formulario de nueva contraseña** con:
   - Campo "Nueva Contraseña"
   - Campo "Confirmar Contraseña"
   - Indicador de fortaleza de contraseña
   - Botón "Cambiar Contraseña"

❌ **Si falla (lo que está pasando ahora):**

1. Muestra: "Verificando enlace de recuperación..." por 1-2 segundos
2. Luego muestra: **"Enlace No Válido"** con ícono rojo ❌
3. Texto: "El enlace de recuperación no es válido o ha expirado..."
4. Botón "Volver al Login"

---

## 📊 INFORMACIÓN QUE NECESITO DE TI

Después de completar el test, compárteme:

### **1. Los logs completos de la consola** (más importante)

```
🔍 [RESET] Iniciando verificación...
... (todos los logs)
```

### **2. La URL completa del link de recuperación**

```
http://localhost:3000/reset-password#access_token=...
```

(Puedes censurar el token real si quieres, pero dime si tiene el formato correcto)

### **3. Qué viste en la pantalla**

- ¿Mostraba "Verificando..."? (Sí/No)
- ¿Llegaste al formulario? (Sí/No)
- ¿Viste el error "Enlace No Válido"? (Sí/No)

### **4. Captura de pantalla** (opcional pero útil)

- Screenshot de la consola con los logs
- Screenshot de la pantalla que viste

---

## 🔧 VERIFICACIÓN ALTERNATIVA (Si el anterior falla)

### **Verificar la configuración de Email en Supabase:**

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto: **PotentiaMX**
3. **Authentication** → **Email Templates**
4. Click en **"Reset Password"**
5. Verifica que el link sea:
   ```
   {{ .SiteURL }}/reset-password?token={{ .Token }}
   ```
   **O:**
   ```
   {{ .ConfirmationURL }}
   ```

**IMPORTANTE:** Debería redirigir a `/reset-password` con el token

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### **"No recibí el email"**

- Verifica spam/correo no deseado
- Espera 2-3 minutos (a veces tarda)
- Verifica en Supabase Dashboard → Authentication → Logs si se envió

### **"El link abre una página en blanco"**

- Verifica que el servidor de desarrollo esté corriendo
- Prueba en modo incógnito/privado

### **"La consola no muestra ningún log 🔍 [RESET]"**

- Verifica que la página se haya recargado
- Presiona F5 para recargar
- Verifica que estés en la pestaña "Console" de DevTools

### **"Los logs dicen que no hay tokens en el hash"**

- Verifica la configuración del Email Template en Supabase
- El link debe incluir `#access_token=...` en la URL

---

## ✅ CHECKLIST COMPLETO

Antes de compartir los resultados, verifica:

- [ ] Servidor de desarrollo corriendo (`npm run dev`)
- [ ] Email registrado en la plataforma
- [ ] Consola del navegador abierta (F12) ANTES de hacer click
- [ ] Click en el link de recuperación del email
- [ ] Capturé los logs que empiezan con `🔍 [RESET]`
- [ ] Verifiqué qué pantalla se mostró (formulario o error)
- [ ] Copié la URL completa del link de recuperación
- [ ] (Opcional) Tomé screenshots

---

## 📤 CÓMO COMPARTIR LOS RESULTADOS

Responde con:

```
RESULTADOS DEL TEST:

1. LOGS DE CONSOLA:
[Pegar aquí todos los logs que empiezan con 🔍 [RESET]]

2. URL DEL LINK:
[http://localhost:3000/reset-password#access_token=...]

3. COMPORTAMIENTO:
- ¿Mostró "Verificando..."? Sí/No
- ¿Llegó al formulario? Sí/No
- ¿Mostró "Enlace No Válido"? Sí/No

4. SCREENSHOTS (si los tienes):
[Adjuntar o describir]
```

---

Una vez que tenga esta información, podré identificar exactamente dónde está el problema y aplicar el fix correcto.

**Tiempo estimado del test:** 5-10 minutos
**Siguiente paso:** Analizar los logs y aplicar el fix definitivo

---

**Creado:** 19 de Octubre, 2025
**Última actualización:** Hoy
**Contacto:** Roberto (Founder/Dev)
