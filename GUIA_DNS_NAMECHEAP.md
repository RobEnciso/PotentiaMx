# 📧 GUÍA COMPLETA: Configurar Resend en Namecheap

**Dominio:** potentiamx.com
**Proveedor DNS:** Namecheap
**Tiempo estimado:** 20 minutos

---

## 🎯 PASO 1: Obtener los Registros DNS de Resend

### 1.1 Accede a Resend

1. Ve a: **https://resend.com/login**
2. Inicia sesión con tu cuenta
3. En el menú lateral, haz click en **"Domains"**

### 1.2 Agregar tu Dominio

1. Click en el botón **"Add Domain"** (botón azul)
2. Escribe: `potentiamx.com`
3. Click en **"Add"**

### 1.3 Copia los Registros DNS

Resend te mostrará una pantalla con **3 registros DNS**.

**NO CIERRES ESTA VENTANA** - la necesitarás en el siguiente paso.

Los registros se ven así:

```
✅ SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

✅ DKIM Record
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN... (muy largo)

✅ DMARC Record
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none
```

**IMPORTANTE:** Los valores exactos (especialmente DKIM) serán diferentes para ti. Usa los que Resend te muestre.

---

## 🎯 PASO 2: Acceder a Namecheap DNS

### 2.1 Inicia Sesión en Namecheap

1. Ve a: **https://www.namecheap.com**
2. Click en **"Sign In"** (arriba a la derecha)
3. Ingresa tu usuario y contraseña

### 2.2 Ve a la Lista de Dominios

1. En el menú superior, click en **"Domain List"**
2. Busca tu dominio: `potentiamx.com`
3. Click en el botón **"MANAGE"** al lado del dominio

### 2.3 Accede a DNS Avanzado

1. En la página del dominio, busca las pestañas superiores
2. Click en **"Advanced DNS"**
3. Deberías ver una tabla con tus registros DNS actuales

---

## 🎯 PASO 3: Revisar si Ya Tienes SPF de Google Workspace

**MUY IMPORTANTE:** Si ya tienes Google Workspace configurado, YA tienes un registro SPF. NO puedes tener dos registros SPF.

### 3.1 Busca un Registro SPF Existente

En la tabla de "Advanced DNS", busca un registro que diga:

```
Type: TXT Record
Host: @
Value: v=spf1 include:_spf.google.com ~all
```

### 3.2 Decide qué hacer:

**Caso A: SÍ tienes un registro SPF de Google**

- ✅ Vas a **MODIFICAR** ese registro (no agregar uno nuevo)
- Continúa a "PASO 4 - OPCIÓN A"

**Caso B: NO tienes ningún registro SPF**

- ✅ Vas a **AGREGAR** todos los registros nuevos
- Continúa a "PASO 4 - OPCIÓN B"

---

## 🎯 PASO 4 - OPCIÓN A: Si Ya Tienes SPF de Google

### 4.1 Modificar el Registro SPF Existente

1. En la tabla de DNS, localiza el registro SPF de Google
2. Click en el **ícono de lápiz** (editar) al lado del registro
3. En el campo **"Value"**, cambia de:
   ```
   v=spf1 include:_spf.google.com ~all
   ```
   A:
   ```
   v=spf1 include:_spf.google.com include:_spf.resend.com ~all
   ```
4. Click en el **✓** (checkmark verde) para guardar
5. **NO agregues otro registro SPF** - con esto es suficiente

### 4.2 Agregar DKIM

1. Click en **"ADD NEW RECORD"** (botón verde)
2. Selecciona **Type: TXT Record**
3. Llena los campos:
   ```
   Type: TXT Record
   Host: resend._domainkey
   Value: [Pega el valor LARGO que Resend te dio]
   TTL: Automatic
   ```
4. Click en el **✓** (checkmark verde)

### 4.3 Agregar DMARC

1. Click en **"ADD NEW RECORD"**
2. Selecciona **Type: TXT Record**
3. Llena los campos:
   ```
   Type: TXT Record
   Host: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:hola@potentiamx.com
   TTL: Automatic
   ```
4. Click en el **✓** (checkmark verde)

**✅ LISTO - Ve al PASO 5**

---

## 🎯 PASO 4 - OPCIÓN B: Si NO Tienes SPF (Primera Configuración)

### 4.1 Agregar SPF (Combinado Google + Resend)

1. Click en **"ADD NEW RECORD"** (botón verde)
2. Selecciona **Type: TXT Record**
3. Llena los campos:
   ```
   Type: TXT Record
   Host: @
   Value: v=spf1 include:_spf.google.com include:_spf.resend.com ~all
   TTL: Automatic
   ```
4. Click en el **✓** (checkmark verde)

### 4.2 Agregar DKIM

1. Click en **"ADD NEW RECORD"**
2. Selecciona **Type: TXT Record**
3. Llena los campos:
   ```
   Type: TXT Record
   Host: resend._domainkey
   Value: [Pega el valor LARGO que Resend te dio - empieza con p=MIGf...]
   TTL: Automatic
   ```
4. Click en el **✓** (checkmark verde)

### 4.3 Agregar DMARC

1. Click en **"ADD NEW RECORD"**
2. Selecciona **Type: TXT Record**
3. Llena los campos:
   ```
   Type: TXT Record
   Host: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:hola@potentiamx.com
   TTL: Automatic
   ```
4. Click en el **✓** (checkmark verde)

---

## 🎯 PASO 5: Guardar y Esperar Propagación

### 5.1 Verifica que Todo Esté Guardado

En tu tabla de "Advanced DNS" de Namecheap, deberías ver ahora:

**Si ya tenías Google Workspace (3 registros nuevos):**

```
✅ TXT Record | @                    | v=spf1 include:_spf.google.com include:_spf.resend.com ~all
✅ TXT Record | resend._domainkey    | p=MIGf... (valor largo)
✅ TXT Record | _dmarc               | v=DMARC1; p=none; rua=mailto:hola@potentiamx.com
```

**Si no tenías nada (3 registros nuevos):**

```
✅ TXT Record | @                    | v=spf1 include:_spf.google.com include:_spf.resend.com ~all
✅ TXT Record | resend._domainkey    | p=MIGf... (valor largo)
✅ TXT Record | _dmarc               | v=DMARC1; p=none; rua=mailto:hola@potentiamx.com
```

### 5.2 Espera la Propagación DNS

**Tiempo de espera:** 15-30 minutos (a veces hasta 2 horas)

Durante este tiempo:

- ☕ Tómate un café
- 📧 Revisa otros pendientes
- ⏰ Configura un timer de 20 minutos

**NO CIERRES LA PESTAÑA DE RESEND**

---

## 🎯 PASO 6: Verificar en Resend

### 6.1 Después de 20-30 Minutos

1. Vuelve a la pestaña de **Resend** donde agregaste el dominio
2. Refresca la página (F5)
3. Busca el botón **"Verify DNS Records"** o **"Verify"**
4. Click en el botón

### 6.2 Resultados Esperados

**✅ Si todo salió bien:**

```
✓ SPF Record - Verified
✓ DKIM Record - Verified
✓ DMARC Record - Verified

Status: Verified ✅
```

**❌ Si aún no está listo:**

```
⏳ SPF Record - Pending
⏳ DKIM Record - Pending
⏳ DMARC Record - Pending

Status: Pending Verification
```

**Solución:** Espera otros 15-30 minutos y vuelve a dar click en "Verify"

---

## 🎯 PASO 7: Probar que Funciona

### 7.1 Prueba Desde Terminal (Windows)

Abre **PowerShell** o **CMD** y ejecuta:

```bash
curl -X POST https://api.resend.com/emails ^
  -H "Authorization: Bearer re_RXaun1gw_A1KbSaYQEW77mKaVoRiQ1sZn" ^
  -H "Content-Type: application/json" ^
  -d "{\"from\":\"Potencia MX <hola@potentiamx.com>\",\"to\":\"TU-EMAIL@gmail.com\",\"subject\":\"Prueba Resend\",\"html\":\"<h1>Funciona!</h1><p>Resend configurado correctamente</p>\"}"
```

**CAMBIA:** `TU-EMAIL@gmail.com` por tu email personal

**Resultado esperado:**

```json
{
  "id": "abc123-def456-...",
  "from": "Potencia MX <hola@potentiamx.com>",
  "to": ["tu-email@gmail.com"],
  "created_at": "2025-01-18T..."
}
```

### 7.2 Revisa tu Email

1. Abre tu bandeja de entrada
2. Deberías recibir un email de **"Potencia MX"**
3. **Si está en spam:** Márcalo como "No es spam"

---

## 🎯 PASO 8: Probar Signup de tu App

### 8.1 Inicia tu App

```bash
cd C:\Users\Roberto\landview-app-cms
npm run dev
```

### 8.2 Prueba el Registro

1. Ve a: **http://localhost:3000/signup**
2. Llena el formulario con tus datos reales
3. Usa tu email personal
4. Click en **"Crear Cuenta Gratis"**

### 8.3 Verifica que Funciona

**En consola del navegador (F12):**

```
✅ Email de bienvenida enviado
```

**En tu email (espera 10-30 segundos):**

- ✅ Email de confirmación de Supabase
- ✅ Email de bienvenida de Potentia MX (Plan FREE)

---

## ⚠️ PROBLEMAS COMUNES

### Problema 1: "Record already exists" en Namecheap

**Causa:** Ya tienes un registro con ese Host

**Solución:**

- Busca el registro existente en la tabla
- Click en el ícono de **lápiz** para editarlo
- Actualiza el valor en lugar de agregar uno nuevo

---

### Problema 2: Resend dice "SPF PermError"

**Causa:** Valor de SPF incorrecto

**Solución:**

1. Verifica que tu SPF tenga esta estructura EXACTA:
   ```
   v=spf1 include:_spf.google.com include:_spf.resend.com ~all
   ```
2. NO puede terminar en `-all`, debe ser `~all`
3. NO puede haber espacios extras

---

### Problema 3: DKIM no verifica

**Causa:** Copiaste mal el valor largo de DKIM

**Solución:**

1. Vuelve a Resend
2. Copia de nuevo el valor completo de DKIM (empieza con `p=MIGf...`)
3. Asegúrate de copiar TODO el texto (es muy largo)
4. Pégalo sin espacios ni saltos de línea

---

### Problema 4: Email va a spam

**Causa:** DNS recién configurado, falta "calentar" el dominio

**Solución temporal:**

1. Márcalo como "No es spam" en Gmail
2. Agrega hola@potentiamx.com a tus contactos

**Solución a largo plazo:**

- Los primeros días envía pocos emails
- Conforme pase el tiempo, la reputación mejorará
- Pide a usuarios que marquen como "No spam"

---

## 📋 CHECKLIST FINAL

Antes de dar por terminado, verifica:

- [ ] Accedí a Resend y agregué `potentiamx.com`
- [ ] Copié los 3 valores de DNS que Resend me mostró
- [ ] Accedí a Namecheap → Domain List → MANAGE → Advanced DNS
- [ ] Revisé si ya tenía SPF de Google
- [ ] Actualicé o agregué el registro SPF (con Google + Resend)
- [ ] Agregué el registro DKIM (resend.\_domainkey)
- [ ] Agregué el registro DMARC (\_dmarc)
- [ ] Esperé 20-30 minutos
- [ ] Verifiqué en Resend → Status: ✅ Verified
- [ ] Probé con curl y recibí el email
- [ ] Probé signup en mi app
- [ ] Recibí email de bienvenida Plan FREE

---

## 🔧 VERIFICAR DNS EXTERNAMENTE

Si quieres verificar que tus DNS estén correctos SIN esperar a Resend:

### Verificar SPF:

1. Ve a: https://mxtoolbox.com/spf.aspx
2. Ingresa: `potentiamx.com`
3. Click "SPF Record Lookup"
4. Debe mostrar: `include:_spf.resend.com` ✅

### Verificar DKIM:

1. Ve a: https://mxtoolbox.com/dkim.aspx
2. Selector: `resend`
3. Domain: `potentiamx.com`
4. Click "DKIM Lookup"
5. Debe mostrar: "DKIM Record Published" ✅

### Verificar DMARC:

1. Ve a: https://mxtoolbox.com/dmarc.aspx
2. Ingresa: `potentiamx.com`
3. Click "DMARC Lookup"
4. Debe mostrar tu registro DMARC ✅

---

## 📞 ¿NECESITAS AYUDA?

**Si algo no funciona:**

1. Toma screenshot de:
   - Tu tabla de DNS en Namecheap (Advanced DNS)
   - El error que ves en Resend
   - El resultado de MXToolbox

2. Revisa la consola de tu navegador (F12) buscando errores

3. Ve a Resend → Logs para ver si los emails están siendo enviados

---

## 📊 RESUMEN VISUAL

```
┌─────────────────────────────────────────────────┐
│  PASO 1: Resend                                 │
│  https://resend.com/domains                     │
│  → Add Domain: potentiamx.com                   │
│  → Copiar 3 registros DNS                       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASO 2: Namecheap                              │
│  https://namecheap.com → Domain List            │
│  → MANAGE → Advanced DNS                        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASO 3: Agregar/Modificar Registros            │
│  ✅ SPF: @ → v=spf1 include:_spf.google.com..  │
│  ✅ DKIM: resend._domainkey → p=MIGf...        │
│  ✅ DMARC: _dmarc → v=DMARC1; p=none...        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASO 4: Esperar 20-30 minutos ☕               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASO 5: Verificar en Resend                    │
│  → Click "Verify DNS Records"                   │
│  → Status: ✅ Verified                          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASO 6: ¡Probar!                               │
│  → Registrarse en /signup                       │
│  → Recibir email de bienvenida                  │
│  → ✅ LISTO                                     │
└─────────────────────────────────────────────────┘
```

---

**Documento creado:** 18 de Enero, 2025
**Para:** Configuración DNS en Namecheap
**Dominio:** potentiamx.com

**¡Éxito!** 🎉
