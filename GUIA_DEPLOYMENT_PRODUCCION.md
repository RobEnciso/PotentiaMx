# 🚀 Guía de Deployment a Producción - PotentiaMX

Guía paso a paso para desplegar PotentiaMX en Vercel y prepararlo para retroalimentación y pruebas.

---

## 📋 Checklist Pre-Deployment

Antes de hacer el deployment, verifica que todo esté listo:

- [x] ✅ Código formateado con Prettier
- [x] ✅ Build de producción exitoso (sin errores)
- [x] ✅ Variables de entorno documentadas en `.env.example`
- [x] ✅ Configuración de Vercel lista (`vercel.json`)
- [x] ✅ `.gitignore` configurado correctamente
- [ ] 🔄 Variables de entorno configuradas en Supabase
- [ ] 🔄 Storage configurado en Supabase
- [ ] 🔄 Dominio personalizado (opcional)

---

## 🛠️ PARTE 1: Preparación de Supabase

### 1.1 Verificar Configuración de Supabase

1. **Ir al Dashboard de Supabase:**

   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   ```

2. **Verificar que existan las tablas:**
   - `terrenos` (propiedades/tours)
   - `hotspots` (puntos de navegación)
   - `user_profiles` (perfiles de usuario)
   - `contact_submissions` (mensajes de contacto)

3. **Verificar Row Level Security (RLS):**
   - Ir a `Authentication` → `Policies`
   - Asegurarse de que las políticas estén activas

### 1.2 Configurar Storage para Imágenes

1. **Ir a Storage:**

   ```
   Dashboard → Storage → Create Bucket
   ```

2. **Crear bucket público:**
   - Name: `terrenos-images` o `property-images`
   - Public bucket: ✅ **Yes**
   - File size limit: 50 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

3. **Configurar CORS (si es necesario):**
   ```sql
   -- Permitir subida desde tu dominio
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('terrenos-images', 'terrenos-images', true);
   ```

### 1.3 Obtener Credenciales

1. **Ir a Settings → API:**

   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
   ```

2. **Copiar las siguientes credenciales:**
   - `Project URL` → Será tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → Será tu `SUPABASE_SERVICE_ROLE_KEY` ⚠️

   **⚠️ IMPORTANTE:** La `service_role` key tiene permisos totales. NUNCA la expongas en el cliente.

---

## 🌐 PARTE 2: Deployment en Vercel

### 2.1 Preparar Repositorio Git

1. **Verificar que todo esté commiteado:**

   ```bash
   git status
   git add .
   git commit -m "feat: preparar proyecto para deployment"
   ```

2. **Pushear a GitHub:**
   ```bash
   git push origin master
   # O el branch que uses (main, develop, etc.)
   ```

### 2.2 Conectar Proyecto a Vercel

1. **Ir a Vercel:**

   ```
   https://vercel.com/new
   ```

2. **Importar Proyecto:**
   - Click en "Import Git Repository"
   - Selecciona tu repositorio de GitHub
   - Click en "Import"

3. **Configurar el Proyecto:**
   - **Framework Preset:** Next.js (detectado automáticamente)
   - **Root Directory:** `./` (dejar por defecto)
   - **Build Command:** `npm run build` (o usar Turbopack)
   - **Output Directory:** `.next` (por defecto)
   - **Install Command:** `npm install`

### 2.3 Configurar Variables de Entorno en Vercel

1. **En la página de configuración del proyecto, ir a:**

   ```
   Environment Variables
   ```

2. **Agregar las siguientes variables:**

   | Variable Name                   | Value                     | Environment         |
   | ------------------------------- | ------------------------- | ------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxx.supabase.co` | Production, Preview |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...`             | Production, Preview |
   | `SUPABASE_SERVICE_ROLE_KEY` ⚠️  | `eyJhbGci...`             | Production          |
   | `RESEND_API_KEY` (opcional)     | `re_xxxxx`                | Production          |

   **⚠️ IMPORTANTE:**
   - Marca `SUPABASE_SERVICE_ROLE_KEY` como **Encrypted**
   - Marca `RESEND_API_KEY` como **Encrypted**
   - Solo las variables `NEXT_PUBLIC_*` pueden ser visibles en el navegador

3. **Click en "Deploy"**

---

## 🔍 PARTE 3: Verificación Post-Deployment

### 3.1 Verificar que el sitio cargue

1. **Esperar a que termine el deployment (~2-5 minutos)**

2. **Acceder al URL de producción:**

   ```
   https://your-project.vercel.app
   ```

3. **Verificar que cargue sin errores:**
   - Abrir la consola del navegador (F12)
   - No debe haber errores de conexión a Supabase
   - Las imágenes deben cargar correctamente

### 3.2 Probar Funcionalidades Clave

#### ✅ Test 1: Registro de Usuario

1. Ir a `/signup`
2. Crear una cuenta nueva
3. Verificar que reciba email de confirmación (si está configurado)
4. Confirmar email en Supabase Dashboard

#### ✅ Test 2: Login

1. Ir a `/login`
2. Iniciar sesión con la cuenta creada
3. Verificar redirección a `/dashboard`

#### ✅ Test 3: Crear Tour

1. En el dashboard, click en "Agregar Terreno"
2. Subir algunas imágenes 360°
3. Llenar datos del formulario
4. Guardar y verificar que se cree correctamente

#### ✅ Test 4: Visor Público

1. Abrir el tour creado
2. Verificar que las imágenes carguen
3. Probar navegación entre panoramas
4. Probar botones de contacto (WhatsApp/Formulario)

#### ✅ Test 5: Marketplace

1. Ir a `/propiedades`
2. Verificar que aparezca el tour creado
3. Verificar que el mapa funcione
4. Filtrar por categorías

### 3.3 Verificar Performance

1. **Lighthouse Audit:**
   - Abrir DevTools (F12)
   - Ir a tab "Lighthouse"
   - Ejecutar audit
   - Verificar scores:
     - Performance: > 80
     - SEO: > 90
     - Best Practices: > 90

2. **Core Web Vitals:**
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

---

## 🐛 PARTE 4: Troubleshooting Común

### Error: "Supabase client has not been initialized"

**Solución:**

```bash
# Verificar que las variables estén en Vercel:
Vercel Dashboard → Settings → Environment Variables

# Debe tener:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Error: "Failed to load images"

**Solución:**

1. Verificar que el bucket de Supabase sea público
2. Verificar CORS en Supabase Storage
3. Actualizar `next.config.ts`:
   ```typescript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'YOUR_PROJECT_ID.supabase.co',
       },
     ],
   }
   ```

### Error: "Build failed: TypeScript errors"

**Solución:**

```bash
# Ejecutar localmente para ver errores:
npm run build

# Arreglar errores de tipos
# Re-deployar
```

### Error: "Function exceeded time limit"

**Solución:**

- Las funciones serverless en Vercel tienen límite de 10s (hobby plan)
- Optimizar queries de base de datos
- Implementar paginación
- Considerar upgrade a Vercel Pro

---

## 🔒 PARTE 5: Seguridad

### 5.1 Variables de Entorno Seguras

✅ **SÍ hacer:**

- Usar variables `NEXT_PUBLIC_*` solo para URLs y keys públicas
- Mantener `SERVICE_ROLE_KEY` en servidor únicamente
- Rotar keys si se exponen accidentalmente
- Usar diferentes keys para development y production

❌ **NO hacer:**

- Commitear `.env.local` a Git
- Exponer `SERVICE_ROLE_KEY` en el cliente
- Usar la misma key de production en development

### 5.2 Row Level Security (RLS)

Asegurarse de que las políticas RLS estén activas en Supabase:

```sql
-- Ejemplo: Solo el dueño puede editar su terreno
CREATE POLICY "Users can update own terrenos"
ON terrenos
FOR UPDATE
USING (auth.uid() = user_id);

-- Ejemplo: Todos pueden ver terrenos públicos
CREATE POLICY "Anyone can view terrenos"
ON terrenos
FOR SELECT
USING (true);
```

### 5.3 Rate Limiting

Implementar rate limiting para formularios de contacto:

```javascript
// En /api/contact/route.js
// Limitar a 3 envíos por hora por IP
```

---

## 📊 PARTE 6: Monitoreo

### 6.1 Vercel Analytics

1. **Habilitar Analytics:**

   ```
   Vercel Dashboard → Analytics → Enable
   ```

2. **Métricas a monitorear:**
   - Page views
   - Unique visitors
   - Top pages
   - Core Web Vitals

### 6.2 Supabase Monitoring

1. **Ir a Database → Logs**
2. **Monitorear:**
   - Query performance
   - Error logs
   - Auth attempts
   - Storage usage

---

## 🎨 PARTE 7: Configuración de Dominio Personalizado (Opcional)

### 7.1 Agregar Dominio en Vercel

1. **Ir a Settings → Domains**
2. **Add Domain:**

   ```
   potentiamx.com
   www.potentiamx.com
   ```

3. **Configurar DNS:**
   - Tipo: `A`
   - Name: `@`
   - Value: `76.76.21.21` (Vercel IP)

   - Tipo: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

### 7.2 Configurar SSL

- SSL se configura automáticamente con Let's Encrypt
- Esperar 24-48 horas para propagación DNS

---

## 📝 PARTE 8: Checklist Final

Antes de compartir el link para retroalimentación:

- [ ] ✅ Sitio accesible en URL de producción
- [ ] ✅ Todas las funcionalidades probadas
- [ ] ✅ No hay errores en la consola del navegador
- [ ] ✅ Imágenes y assets cargan correctamente
- [ ] ✅ Formularios de contacto funcionan
- [ ] ✅ Lighthouse score > 80
- [ ] ✅ Responsive en móvil y desktop
- [ ] ✅ Datos de prueba creados para demostración
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ SSL activo (HTTPS)

---

## 🚀 SIGUIENTE: Compartir para Retroalimentación

Una vez completado el checklist:

1. **Crear datos de prueba:**
   - 3-5 tours de ejemplo
   - Diferentes categorías (terrenos, casas, departamentos)
   - Imágenes de calidad

2. **Documentar para testers:**
   - Usuario de prueba: `demo@potentiamx.com` / `password123`
   - Link al sitio: `https://potentiamx.vercel.app`
   - Funcionalidades a probar: [lista]

3. **Compartir link:**
   ```
   🔗 Link de prueba: https://potentiamx.vercel.app
   👤 Usuario demo: demo@potentiamx.com
   🔑 Contraseña: [solicitar por privado]
   ```

---

## 📞 Soporte

Si encuentras algún problema durante el deployment:

1. **Revisar logs de Vercel:**

   ```
   Vercel Dashboard → Deployments → [Latest] → Function Logs
   ```

2. **Revisar logs de Supabase:**

   ```
   Supabase Dashboard → Logs → Database / Auth / Storage
   ```

3. **Documentación:**
   - [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
   - [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
   - [Supabase Deployment](https://supabase.com/docs/guides/platform)

---

## ✅ ¡Listo para Deploy!

Tu proyecto está preparado para producción. Sigue esta guía paso a paso y tendrás tu aplicación live en ~30 minutos.

**Próximos pasos sugeridos:**

1. ✅ Deploy a Vercel
2. ✅ Crear datos de prueba
3. ✅ Enviar link para retroalimentación
4. ⏳ Iterar basado en feedback
5. ⏳ Configurar dominio personalizado
6. ⏳ Optimizar SEO
7. ⏳ Configurar Google Analytics
