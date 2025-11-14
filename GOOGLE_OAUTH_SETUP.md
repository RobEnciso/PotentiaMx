# 🔐 Configuración de Google OAuth para Signup

El código para el registro con Google ya está implementado en `/signup`. Solo falta configurarlo en Supabase y Google Cloud.

---

## ✅ Lo que YA está Listo

El botón **"Continuar con Google"** ya está en tu página de signup con el código funcionando:

```javascript
const handleGoogleSignup = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
};
```

---

## 🚀 Configuración (15-20 minutos)

### Paso 1: Crear Proyecto en Google Cloud

1. **Ve a**: https://console.cloud.google.com/
2. **Crea un nuevo proyecto**:
   - Nombre: "LandView" (o el nombre de tu app)
   - Clic en "Crear"

3. **Selecciona el proyecto** que acabas de crear (arriba a la izquierda)

---

### Paso 2: Activar Google OAuth

1. **Ve al menú** (☰) → **APIs & Services** → **OAuth consent screen**

2. **Configurar pantalla de consentimiento**:
   - Tipo de usuario: **External**
   - Clic en "Crear"

3. **Información de la app**:
   - **App name**: LandView (o tu nombre)
   - **User support email**: Tu email
   - **Developer contact information**: Tu email
   - **Clic en "Save and Continue"**

4. **Scopes** (Permisos):
   - Clic en "Add or Remove Scopes"
   - Selecciona:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Clic en "Update" y luego "Save and Continue"

5. **Test users** (Solo para testing):
   - Agrega tu email personal
   - Clic en "Save and Continue"

6. **Resumen**:
   - Revisa todo y clic en "Back to Dashboard"

---

### Paso 3: Crear Credenciales OAuth

1. **Ve a**: **APIs & Services** → **Credentials**

2. **Clic en**: **+ Create Credentials** → **OAuth client ID**

3. **Configuración**:
   - **Application type**: Web application
   - **Name**: LandView Web Client

4. **Authorized JavaScript origins**:

   ```
   http://localhost:3000
   https://tu-dominio.com (cuando tengas dominio)
   ```

5. **Authorized redirect URIs** (IMPORTANTE):

   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```

   **¿Dónde encontrar YOUR-PROJECT-REF?**
   - Ve a tu Dashboard de Supabase
   - **Settings** → **API**
   - Busca "Project URL": `https://YOUR-PROJECT-REF.supabase.co`
   - Usa esa URL + `/auth/v1/callback`

6. **Clic en "Create"**

7. **COPIA Y GUARDA**:
   - Client ID (algo como: `123456-abc.apps.googleusercontent.com`)
   - Client Secret (algo como: `GOCSPX-abc123...`)

---

### Paso 4: Configurar en Supabase

1. **Ve a tu Dashboard de Supabase**
2. **Authentication** → **Providers**
3. **Busca "Google"** en la lista
4. **Habilítalo** (toggle a ON)
5. **Pega las credenciales**:
   - **Client ID**: (el que copiaste de Google)
   - **Client Secret**: (el que copiaste de Google)
6. **Clic en "Save"**

---

### Paso 5: Actualizar Redirect URL en Google

1. **Vuelve a Google Cloud Console**
2. **Credentials** → Clic en tu OAuth client
3. **Authorized redirect URIs**, asegúrate que tenga:

   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```

   (Reemplaza YOUR-PROJECT-REF con el tuyo)

4. **Guardar cambios**

---

## 🧪 Probar que Funciona

### Prueba en Localhost:

1. Ve a: `http://localhost:3000/signup`
2. Haz clic en **"Continuar con Google"**
3. Deberías ver una ventana popup de Google
4. Selecciona tu cuenta
5. Acepta los permisos
6. Deberías ser redirigido a `/dashboard`

---

## 🐛 Problemas Comunes

### Error: "redirect_uri_mismatch"

**Causa**: El redirect URI no coincide

**Solución**:

1. Ve a Supabase → Settings → API
2. Copia tu Project URL exacta
3. En Google Cloud, usa: `TU-PROJECT-URL/auth/v1/callback`
4. Espera 5 minutos (tarda en propagarse)

---

### Error: "Access blocked: This app's request is invalid"

**Causa**: OAuth consent screen no está configurado

**Solución**:

1. Ve a Google Cloud → OAuth consent screen
2. Completa TODOS los campos requeridos
3. Agrega tu email en "Test users"

---

### Error: "Error al conectar con Google..."

**Causa**: Credenciales mal pegadas en Supabase

**Solución**:

1. Verifica que Client ID y Secret no tengan espacios extras
2. Vuelve a copiar y pegar desde Google Cloud
3. Guarda cambios en Supabase

---

## 📊 ¿Qué Pasa Después del Registro con Google?

### 1. Usuario se registra con Google

```javascript
// Supabase crea automáticamente:
{
  id: 'uuid-generado',
  email: 'usuario@gmail.com',
  user_metadata: {
    full_name: 'Nombre del Google Profile',
    avatar_url: 'URL del avatar de Google'
  }
}
```

### 2. Guardar Información Adicional

Si quieres capturar más info después del registro con Google, puedes:

**Opción A: Redirigir a onboarding**

```javascript
// En signup/page.js
const handleGoogleSignup = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/onboarding`, // ← Cambia esto
    },
  });
};
```

Luego creas `/onboarding/page.js` que capture:

- Teléfono
- Empresa
- Tipo de cliente
- etc.

**Opción B: Capturar en el dashboard**

- Primera vez que entran, mostrar modal pidiendo info faltante

---

## 🔒 Seguridad

### Para Producción:

1. **OAuth Consent Screen**:
   - Cambia de "Testing" a "Production"
   - Proceso de verificación de Google (puede tardar días)

2. **Authorized URLs**:
   - Quita `localhost:3000`
   - Solo deja tu dominio real

3. **Manejo de Errores**:
   ```javascript
   if (error) {
     console.error('Google OAuth Error:', error);
     // Mostrar mensaje al usuario
     setError('No pudimos conectar con Google. Intenta de nuevo.');
   }
   ```

---

## 💾 Datos que Captura Google OAuth

Automáticamente obtienes:

- ✅ Email (verificado)
- ✅ Nombre completo
- ✅ Foto de perfil
- ❌ Teléfono (NO)
- ❌ Empresa (NO)
- ❌ Tipo de cliente (NO)

**Por eso necesitas un onboarding para capturar lo que falta.**

---

## 🎯 Flujo Recomendado

### Para Nuevos Usuarios con Google:

```
1. Click "Continuar con Google"
   ↓
2. Google Auth (popup)
   ↓
3. Redirige a /onboarding
   ↓
4. Formulario corto:
   - Teléfono (WhatsApp) *
   - Empresa
   - Tipo de cliente *
   - Cuántas propiedades *
   ↓
5. Guarda en user_metadata
   ↓
6. Redirige a /dashboard
```

### Para Usuarios que ya se Registraron:

```
1. Click "Continuar con Google"
   ↓
2. Detecta que ya existe
   ↓
3. Redirige directo a /dashboard
```

---

## 📝 Checklist de Configuración

Marca cuando completes cada paso:

- [ ] Crear proyecto en Google Cloud
- [ ] Configurar OAuth consent screen
- [ ] Crear credenciales OAuth 2.0
- [ ] Copiar Client ID y Secret
- [ ] Habilitar Google en Supabase
- [ ] Pegar credenciales en Supabase
- [ ] Actualizar Redirect URI en Google
- [ ] Agregar tu email en Test users
- [ ] Probar registro con Google en localhost
- [ ] (Opcional) Crear página de onboarding

---

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona:

1. **Verifica los logs**:
   - Consola del navegador (F12)
   - Supabase Dashboard → Logs → Auth

2. **Revisa la configuración**:
   - Redirect URI debe ser EXACTAMENTE: `https://xxx.supabase.co/auth/v1/callback`
   - Client ID y Secret sin espacios

3. **Espera 5 minutos**:
   - Los cambios en Google Cloud tardan en propagarse

---

## 🚀 Próximos Pasos

Una vez que Google OAuth funcione:

1. **Crear página de onboarding** (`/onboarding/page.js`)
2. **Capturar datos faltantes**:
   - Teléfono
   - Empresa
   - Tipo de cliente
3. **Guardar en Supabase**:

   ```javascript
   await supabase.auth.updateUser({
     data: {
       phone: formData.phone,
       company_name: formData.companyName,
       client_type: formData.clientType,
     },
   });
   ```

4. **Opcional**: Crear tabla separada `user_profiles` para más datos

---

**¡Listo para configurar! 🎉**

Si tienes dudas durante la configuración, avísame y te ayudo.
