# ✅ Checklist Pre-Deployment - PotentiaMX

Marca cada item antes de hacer deploy a producción.

---

## 📦 CÓDIGO

- [x] ✅ Código formateado con Prettier (`npm run format`)
- [x] ✅ Build exitoso sin errores (`npm run build`)
- [ ] ⬜ ESLint sin warnings críticos (`npm run lint`)
- [x] ✅ Variables de entorno documentadas (`.env.example`)
- [x] ✅ `.gitignore` actualizado (excluye `.env.local`)

---

## 🗄️ SUPABASE

### Base de Datos

- [ ] ⬜ Tablas creadas:
  - [ ] `terrenos`
  - [ ] `hotspots`
  - [ ] `user_profiles`
  - [ ] `contact_submissions`
- [ ] ⬜ Row Level Security (RLS) configurado
- [ ] ⬜ Políticas de acceso creadas
- [ ] ⬜ Funciones SQL ejecutadas

### Storage

- [ ] ⬜ Bucket `terrenos-images` creado
- [ ] ⬜ Bucket configurado como público
- [ ] ⬜ CORS configurado
- [ ] ⬜ Límites de tamaño establecidos (50 MB)

### Autenticación

- [ ] ⬜ Email confirmations habilitado
- [ ] ⬜ Email templates personalizados (opcional)
- [ ] ⬜ Políticas de password configuradas
- [ ] ⬜ URL de redirección configurada

### API Keys

- [ ] ⬜ `NEXT_PUBLIC_SUPABASE_URL` copiada
- [ ] ⬜ `NEXT_PUBLIC_SUPABASE_ANON_KEY` copiada
- [ ] ⬜ `SUPABASE_SERVICE_ROLE_KEY` copiada ⚠️

---

## 📧 RESEND (Opcional)

- [ ] ⬜ Cuenta creada en [resend.com](https://resend.com)
- [ ] ⬜ Dominio verificado (opcional)
- [ ] ⬜ API key generada
- [ ] ⬜ Templates de email creados
- [ ] ⬜ Límites de envío conocidos (100/día gratis)

---

## 🌐 VERCEL

### Configuración

- [x] ✅ Repositorio en GitHub
- [ ] ⬜ Proyecto importado a Vercel
- [ ] ⬜ Framework preset: Next.js
- [ ] ⬜ Build command: `npm run build`
- [ ] ⬜ Root directory: `./`

### Variables de Entorno

Configuradas en Vercel Dashboard → Settings → Environment Variables:

**Production + Preview:**

- [ ] ⬜ `NEXT_PUBLIC_SUPABASE_URL`
- [ ] ⬜ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Solo Production (Encrypted):**

- [ ] ⬜ `SUPABASE_SERVICE_ROLE_KEY` ⚠️
- [ ] ⬜ `RESEND_API_KEY` (si aplica)

---

## 🧪 TESTING POST-DEPLOYMENT

### Funcionalidades Básicas

- [ ] ⬜ Sitio carga sin errores
- [ ] ⬜ Página principal (`/`) funciona
- [ ] ⬜ Navbar funciona (desktop + mobile)
- [ ] ⬜ Footer funciona
- [ ] ⬜ Links internos funcionan
- [ ] ⬜ Imágenes cargan correctamente

### Autenticación

- [ ] ⬜ Registro (`/signup`) funciona
- [ ] ⬜ Login (`/login`) funciona
- [ ] ⬜ Logout funciona
- [ ] ⬜ Password reset funciona
- [ ] ⬜ Redirección post-login correcta

### Dashboard

- [ ] ⬜ Dashboard (`/dashboard`) carga
- [ ] ⬜ Lista de terrenos aparece
- [ ] ⬜ "Agregar Terreno" funciona
- [ ] ⬜ Subida de imágenes funciona
- [ ] ⬜ Edición de terreno funciona
- [ ] ⬜ Eliminación de terreno funciona
- [ ] ⬜ Mapa de ubicación funciona

### Visor Público

- [ ] ⬜ Visor 360° (`/terreno/[id]`) funciona
- [ ] ⬜ Navegación entre panoramas funciona
- [ ] ⬜ Hotspots aparecen y funcionan
- [ ] ⬜ Botones de contacto funcionan
- [ ] ⬜ Compartir tour funciona
- [ ] ⬜ Responsive en móvil

### Marketplace

- [ ] ⬜ Página de propiedades (`/propiedades`) funciona
- [ ] ⬜ Mapa muestra marcadores
- [ ] ⬜ Click en marcador abre popup
- [ ] ⬜ Filtros por categoría funcionan
- [ ] ⬜ Cards de propiedades se ven bien
- [ ] ⬜ Links a tours funcionan

### Contacto

- [ ] ⬜ Formulario de contacto (`#contacto`) funciona
- [ ] ⬜ WhatsApp links funcionan
- [ ] ⬜ Formulario modal funciona
- [ ] ⬜ Emails se envían (si Resend configurado)

---

## 🎨 PERFORMANCE

### Lighthouse Audit

- [ ] ⬜ Performance: > 80
- [ ] ⬜ Accessibility: > 90
- [ ] ⬜ Best Practices: > 90
- [ ] ⬜ SEO: > 90

### Core Web Vitals

- [ ] ⬜ LCP < 2.5s
- [ ] ⬜ FID < 100ms
- [ ] ⬜ CLS < 0.1

### Optimizaciones

- [ ] ⬜ Imágenes optimizadas (WebP/Next Image)
- [ ] ⬜ Fonts optimizados
- [ ] ⬜ CSS minificado
- [ ] ⬜ JavaScript minificado

---

## 🔒 SEGURIDAD

- [ ] ⬜ HTTPS activo (SSL)
- [ ] ⬜ Security headers configurados
- [ ] ⬜ `SERVICE_ROLE_KEY` no expuesta en cliente
- [ ] ⬜ RLS habilitado en Supabase
- [ ] ⬜ Rate limiting en formularios
- [ ] ⬜ Input sanitization implementado
- [ ] ⬜ XSS protection activo

---

## 📱 RESPONSIVE

- [ ] ⬜ Desktop (1920px+) ✓
- [ ] ⬜ Laptop (1024px) ✓
- [ ] ⬜ Tablet (768px) ✓
- [ ] ⬜ Mobile (375px) ✓
- [ ] ⬜ Mobile pequeño (320px) ✓

---

## 🌍 SEO

- [ ] ⬜ Meta tags configurados
- [ ] ⬜ Open Graph tags
- [ ] ⬜ Twitter Card tags
- [ ] ⬜ Sitemap generado
- [ ] ⬜ robots.txt configurado
- [ ] ⬜ Structured data (JSON-LD)

---

## 📊 ANALYTICS

- [ ] ⬜ Vercel Analytics habilitado
- [ ] ⬜ Google Analytics configurado (opcional)
- [ ] ⬜ Cookie consent implementado
- [ ] ⬜ Privacy policy actualizada

---

## 📄 DOCUMENTACIÓN

- [ ] ⬜ README actualizado
- [x] ✅ `.env.example` completo
- [x] ✅ Guía de deployment creada
- [ ] ⬜ Changelog iniciado
- [ ] ⬜ Docs para usuarios/testers

---

## 🎯 DATOS DE PRUEBA

- [ ] ⬜ Usuario admin creado
- [ ] ⬜ Usuario demo creado
- [ ] ⬜ 3-5 tours de ejemplo creados
- [ ] ⬜ Tours en diferentes categorías
- [ ] ⬜ Imágenes de calidad subidas
- [ ] ⬜ Hotspots configurados en tours

---

## 🚀 LISTO PARA COMPARTIR

- [ ] ⬜ URL de producción accesible
- [ ] ⬜ Datos demo funcionando
- [ ] ⬜ Credenciales de prueba listas
- [ ] ⬜ Lista de features a probar preparada
- [ ] ⬜ Feedback form/documento preparado

---

## 📝 INFORMACIÓN PARA TESTERS

```
🔗 URL: https://potentiamx.vercel.app
👤 Usuario demo: demo@potentiamx.com
🔑 Contraseña: [solicitar por privado]

📋 Funcionalidades a probar:
1. Registro y login
2. Crear un tour virtual
3. Navegar el tour en modo público
4. Probar marketplace de propiedades
5. Enviar formulario de contacto
```

---

## 🎉 ¡TODO LISTO!

Cuando todos los checks estén ✅, tu proyecto está listo para:

1. ✅ Deploy a producción
2. ✅ Compartir para retroalimentación
3. ✅ Comenzar pruebas con usuarios reales

---

**Tiempo estimado total: 1-2 horas** ⏱️

Para deployment rápido: Ver `DEPLOY_RAPIDO.md`
Para guía completa: Ver `GUIA_DEPLOYMENT_PRODUCCION.md`
