# Configurar Custom Domain para Supabase

## ⚠️ PROBLEMA

Cuando los usuarios inician sesión con Google, ven:
```
Ir a tuhojmupstisctgaepsc.supabase.co
```

Esto genera **desconfianza** porque no es el dominio principal (potentiamx.com).

## ✅ SOLUCIÓN: Custom Domain

Configurar un subdominio de potentiamx.com para Supabase Auth.

---

## 📋 OPCIÓN 1: Custom Domain (Profesional) ⭐

### Ventajas:
- ✅ Los usuarios ven "auth.potentiamx.com" (profesional)
- ✅ Mayor confianza
- ✅ Branding consistente
- ✅ Mejor para producción

### Desventajas:
- ⏱️ Requiere configuración DNS
- 💰 Requiere plan PRO de Supabase ($25/mes)

### Pasos:

#### 1. Verificar Plan de Supabase
- Ve a: https://supabase.com/dashboard/project/tuhojmupstisctgaepsc/settings/billing
- Necesitas estar en el plan **PRO** ($25/mes)
- Si estás en el plan FREE, actualiza primero

#### 2. Configurar Custom Domain en Supabase
1. Ve a: https://supabase.com/dashboard/project/tuhojmupstisctgaepsc/settings/general
2. Busca la sección **"Custom Domains"**
3. Click en **"Add custom domain"**
4. Ingresa: `auth.potentiamx.com` (o `api.potentiamx.com`)
5. Supabase te dará los registros DNS para configurar

#### 3. Configurar DNS en tu Proveedor (GoDaddy/Cloudflare/etc)

Si usas **Cloudflare** (recomendado):
1. Ve a Cloudflare Dashboard → DNS
2. Agrega un registro **CNAME**:
   ```
   Tipo: CNAME
   Nombre: auth
   Destino: tuhojmupstisctgaepsc.supabase.co
   Proxy: Desactivado (nube gris)
   TTL: Auto
   ```

Si usas **GoDaddy** u otro:
1. Ve al panel de DNS de tu dominio
2. Agrega un registro **CNAME**:
   ```
   Host: auth
   Apunta a: tuhojmupstisctgaepsc.supabase.co
   TTL: 600 (o el mínimo)
   ```

#### 4. Verificar en Supabase
- Espera 5-10 minutos para propagación DNS
- Supabase verificará automáticamente
- Una vez verificado, estará activo

#### 5. Actualizar Variables de Entorno
Actualiza `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://auth.potentiamx.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_actual
```

⚠️ **IMPORTANTE**: NO cambies el ANON_KEY, solo la URL.

#### 6. Rebuild y Deploy
```bash
npm run build
# Deploy a Netlify/Vercel
```

#### 7. Actualizar OAuth en Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Busca tu proyecto de OAuth
3. Actualiza las **Authorized redirect URIs**:
   - Quita: `https://tuhojmupstisctgaepsc.supabase.co/auth/v1/callback`
   - Agrega: `https://auth.potentiamx.com/auth/v1/callback`

---

## 📋 OPCIÓN 2: Proxy Reverso (Gratis, más complejo)

Si no quieres pagar el plan PRO de Supabase, puedes usar un proxy reverso con Cloudflare Workers.

### Ventajas:
- ✅ Gratis (plan FREE de Cloudflare)
- ✅ Los usuarios ven potentiamx.com

### Desventajas:
- ⚠️ Configuración más compleja
- ⚠️ Requiere mantenimiento adicional
- ⚠️ Puede tener latencia adicional

**NO RECOMENDADO** para producción si tienes presupuesto para el plan PRO.

---

## 📋 OPCIÓN 3: Cambiar Mensaje en la UI (temporal)

Mientras implementas el custom domain, puedes agregar un mensaje de confianza:

```jsx
{/* Mensaje de confianza para Google Auth */}
<p className="text-xs text-slate-500 mt-2 text-center">
  🔒 Serás redirigido a nuestro servidor de autenticación seguro
</p>
```

Esto es solo temporal, no soluciona el problema de fondo.

---

## 🎯 RECOMENDACIÓN FINAL

**Para producción**: Usa **Opción 1 (Custom Domain)**
- Costo: $25/mes (plan PRO)
- Configuración: 30 minutos
- Resultado: Profesional y confiable

**Para desarrollo/pruebas**: Mantén el dominio de Supabase
- Costo: $0
- Solo para testing

---

## ❓ ¿Cuál eliges?

1. **Plan PRO + Custom Domain** ($25/mes) → Profesional ⭐
2. **Mantener dominio Supabase** (gratis) → Solo para desarrollo
3. **Proxy Reverso** (gratis, complejo) → No recomendado

Dime cuál prefieres y te ayudo a configurarlo.
