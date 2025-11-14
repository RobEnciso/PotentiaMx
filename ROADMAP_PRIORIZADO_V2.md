# 🗺️ ROADMAP PRIORIZADO V2 - POTENTIA MX

**Fecha de actualización**: 18 de Enero, 2025
**Versión anterior**: ROADMAP_PRIORIZADO.md (17 de Enero, 2025)

---

## 📊 RESUMEN EJECUTIVO

- **Total de mejoras identificadas**: 30+ features
- **Categorías**: 8 categorías principales
- **Prioridad crítica (Inmediato)**: 4 tareas
- **Prioridad alta (Quick Wins)**: 8 tareas
- **Prioridad media (MVP Premium)**: 10 tareas
- **Prioridad baja (Roadmap futuro)**: 11+ tareas

---

## 🚨 PRIORIDAD CRÍTICA - INMEDIATO (Hoy)

Estas son **funcionalidades faltantes básicas** o **errores críticos** que deben corregirse de inmediato.

### 0. ✅ Agregar "Olvidé mi contraseña" en Login

- **Complejidad**: 🟢 Muy baja (10-15 minutos)
- **Impacto**: 🔴 Crítico (funcionalidad básica faltante)
- **Categoría**: Auth/UX
- **Descripción**: Link "¿Olvidaste tu contraseña?" en `/login`
- **Implementación**:
  - Agregar link que llame a `supabase.auth.resetPasswordForEmail()`
  - Supabase enviará email automático (ya configurado con SMTP personalizado)
  - Usuario recibe link y puede resetear contraseña
- **Archivo**: `app/login/page.js`

### 0.1 🔧 Corregir límite de plan FREE (2 recorridos, no 3)

- **Complejidad**: 🟢 Muy baja (5 minutos)
- **Impacto**: 🔴 Crítico (error en lógica de negocio)
- **Categoría**: Business Logic
- **Descripción**: El plan FREE debe permitir máximo 2 recorridos, actualmente permite 3
- **Implementación**:
  - Revisar validación en `app/dashboard/add-terrain/page.js`
  - Actualizar lógica de conteo de terrenos
  - Mensaje: "Has alcanzado el límite de 2 tours del plan FREE. Upgrade a STARTER para crear más"
- **Archivos**:
  - `app/dashboard/add-terrain/page.js`
  - Cualquier middleware de validación

### 0.2 🏠 Sistema de tipos de propiedad

- **Complejidad**: 🟡 Media (2-3 horas)
- **Impacto**: 🔴 Crítico (alineación con modelo de negocio)
- **Categoría**: Business Logic / UX
- **Descripción**: Cambiar de solo "terrenos" a multi-tipo de propiedades
- **Implementación**:

**Cambios en base de datos:**

```sql
ALTER TABLE terrenos ADD COLUMN property_type VARCHAR(50);
ALTER TABLE terrenos ADD COLUMN land_category VARCHAR(50);
ALTER TABLE terrenos ADD COLUMN available_for_contribution BOOLEAN DEFAULT false;
```

**Tipos de propiedad:**

- 🏡 Casa
- 🏢 Departamento
- 🏞️ Terreno (con subcategorías)

**Subcategorías para Terrenos:**

- Terreno para residencia
- Terreno para desarrollo
- Terreno para proyecto

**Campos adicionales:**

- Si es "desarrollo" o "proyecto": checkbox "Se ofrece en aportación para proyecto"

**Lógica condicional:**

- Si property_type === "Casa" o "Departamento" → ocultar campo de categoría de terreno

**Archivos a modificar:**

- `app/dashboard/add-terrain/page.js` - Agregar campos nuevos
- `app/dashboard/edit-terrain/[id]/page.js` - Agregar campos nuevos
- `app/dashboard/page.js` - Mostrar categorización en cards
- `app/terreno/[id]/page.js` - Mostrar tipo de propiedad en visor público

### 0.3 📜 Contrato legal para Marketplace

- **Complejidad**: 🟡 Media (1-2 días)
- **Impacto**: 🔴 Crítico (protección legal)
- **Categoría**: Legal / Business
- **Descripción**: Modal con contrato al publicar en marketplace
- **Implementación**:

**Flujo:**

1. Usuario marca checkbox "Publicar en Marketplace"
2. Aparece modal con contrato legal
3. Usuario debe scroll hasta el final
4. Checkbox "Acepto términos y condiciones"
5. Solo entonces se guarda como publicado

**Contrato debe especificar:**

- Porcentaje de comisión (ej: 3% del valor de venta)
- Obligaciones del vendedor (información veraz, documentación, etc.)
- Obligaciones de Potentia MX (promoción, soporte)
- Política de reembolsos
- Resolución de disputas
- **Futuro**: Sistema de verificación de documentos (inspirado en Airbnb)

**Base de datos:**

```sql
ALTER TABLE terrenos ADD COLUMN marketplace_terms_accepted BOOLEAN DEFAULT false;
ALTER TABLE terrenos ADD COLUMN marketplace_terms_accepted_at TIMESTAMP;
ALTER TABLE terrenos ADD COLUMN marketplace_terms_version VARCHAR(10);
```

**Archivos:**

- `app/dashboard/edit-terrain/[id]/page.js` - Modal de confirmación
- `components/MarketplaceTermsModal.js` - Nuevo componente
- `MARKETPLACE_TERMS_V1.md` - Documento legal (crear con abogado)

---

## 🔥 PRIORIDAD ALTA - QUICK WINS (1-2 semanas)

Estas mejoras tienen **alto impacto** y **baja-media complejidad**. Generan valor inmediato.

### 1. ✅ Renombrar vistas en el editor

- **Complejidad**: 🟢 Baja (2-3 horas)
- **Impacto**: 🟡 Medio
- **Categoría**: UX/Editor
- **Descripción**: Permitir cambiar "Vista 1", "Vista 2" a nombres descriptivos
- **Implementación**:
  - Agregar campo `nombre` a panoramas (JSON en `image_urls` o tabla nueva)
  - Input editable en HotspotEditor
  - Guardar en base de datos
- **Archivos**:
  - `app/terreno/[id]/editor/HotspotEditor.js`
  - Schema de base de datos (agregar nombres a panoramas)

### 2. ✅ Modificar subtítulo del dashboard

- **Complejidad**: 🟢 Muy baja (5 minutos)
- **Impacto**: 🟢 Alto (branding/marketing)
- **Categoría**: Quick Win
- **Descripción**: Cambiar texto a "Lienzos perfectos para tu próximo proyecto"
- **Archivo**: `app/dashboard/page.js` línea ~20-30

### 3. ✅ Acceso directo al tour desde dashboard

- **Complejidad**: 🟢 Baja (30 minutos)
- **Impacto**: 🟢 Alto (UX)
- **Categoría**: UX
- **Descripción**: Poder entrar al visor haciendo click en la imagen (mantener animación)
- **Implementación**:
  - Convertir card de terreno en clickeable
  - Mantener botones "Editar" y "Ver Tour"
  - Click en imagen → abre tour en nueva pestaña
- **Archivo**: `app/dashboard/page.js`

### 4. ✅ Verificar funcionalidad de embedding

- **Complejidad**: 🟢 Baja (1-2 horas)
- **Impacto**: 🟢 Alto (feature clave)
- **Categoría**: Embedding/Compartir
- **Descripción**: Crear ruta `/embed/[id]` sin header/footer para iframe
- **Implementación**:
  - Crear `app/embed/[id]/page.js` (copia de terreno sin UI)
  - Agregar botón "Obtener código embed" en dashboard
  - Generar snippet: `<iframe src="https://potentiamx.com/embed/123">`
- **Archivos**:
  - `app/embed/[id]/page.js` (nuevo)
  - `app/dashboard/page.js` (botón embed)

### 5. ✅ Formulario de contacto en recorridos (Lead Generation)

- **Complejidad**: 🟡 Media (4-6 horas)
- **Impacto**: 🟢 Muy alto (monetización)
- **Categoría**: Lead Generation
- **Descripción**: Modal con formulario dentro del tour 360°
- **Campos**: Nombre, Email, Teléfono, Mensaje
- **Implementación**:
  - Botón flotante "💬 Contactar" en PhotoSphereViewer
  - Modal con formulario
  - Tabla `contacts` (ya existe según mejoras.txt)
  - Envío de email al propietario (ya implementado en `/api/contact`)
  - Email de confirmación al prospecto
- **Archivos**:
  - `app/terreno/[id]/PhotoSphereViewer.js` - Agregar botón flotante
  - `components/ContactModal.js` - Nuevo componente
  - `app/api/contact/route.js` - Ya existe ✅

### 6. ✅ Analytics básicos (Contador de visitas)

- **Complejidad**: 🟡 Media (3-4 horas)
- **Impacto**: 🟢 Alto (datos para clientes)
- **Categoría**: Analytics
- **Descripción**: Registrar cada visita al tour
- **Implementación**:
  ```sql
  CREATE TABLE tour_visits (
    id SERIAL PRIMARY KEY,
    terreno_id UUID REFERENCES terrenos(id),
    visited_at TIMESTAMP DEFAULT NOW(),
    referrer TEXT,
    device VARCHAR(50),
    ip_address VARCHAR(50)
  );
  ```

  - Registrar visita en `app/terreno/[id]/page.js` (useEffect)
  - Mostrar contador en dashboard del propietario
  - Gráfica simple últimos 30 días (Recharts)
- **Archivos**:
  - `app/terreno/[id]/page.js` - Trackear visita
  - `app/dashboard/page.js` - Mostrar contador
  - `lib/analyticsService.js` - Nuevo servicio

### 7. ✅ Mejoras al panel de propiedades

- **Complejidad**: 🟢 Baja (30 minutos)
- **Impacto**: 🟡 Medio
- **Categoría**: UX
- **Descripción**:
  - Botón "Editar" más visible
  - Acceso rápido al editor de hotspots
  - Categorización por tipo de propiedad (después de implementar 0.2)
- **Archivo**: `app/dashboard/page.js`

### 8. 📱 Vista móvil mejorada en demo embed

- **Complejidad**: 🟢 Baja (2-3 horas)
- **Impacto**: 🟡 Medio (marketing/demos)
- **Categoría**: Demo/Marketing
- **Descripción**: En `/demo-embed`, mostrar vista móvil con diseño de iPhone
- **Implementación**:
  - CSS con forma de iPhone (bordes redondeados, notch)
  - Mockup de dispositivo
  - Dos vistas: Desktop (monitor) y Mobile (iPhone)
- **Archivo**: `app/demo-embed/page.js` (si existe) o crear nueva ruta

---

## ⚡ PRIORIDAD MEDIA - MVP PREMIUM (3-6 semanas)

Features para **diferenciar planes** y empezar a monetizar.

### 9. 🎨 Sistema de planes (FREE / STARTER / PRO / BUSINESS)

- **Complejidad**: 🔴 Alta (1-2 semanas)
- **Impacto**: 🟢 Muy alto (monetización)
- **Categoría**: Monetización
- **Features según MODELO_NEGOCIO_TRIPLE.md**:

**Plan FREE (€0/mes):**

- 2 tours activos (ya implementado en tarea 0.1)
- Editor completo
- 1 propiedad en marketplace
- Marca de agua "Powered by Potentia MX"

**Plan STARTER (€39/mes):**

- 10 tours activos
- 1 sesión de captura cada 3 meses
- Sin marca de agua
- Captura de leads (formulario)
- 5 propiedades en marketplace

**Plan PRO (€89/mes):**

- 30 tours activos
- 1 sesión de captura mensual
- Analytics con sugerencias IA
- Branding personalizado (logo, colores)
- 15 propiedades en marketplace

**Plan BUSINESS (€199/mes):**

- Tours ilimitados
- 2 sesiones de captura mensuales
- White-label completo
- Soporte dedicado
- Marketplace ilimitado

**Implementación**:

```sql
ALTER TABLE user_profiles ADD COLUMN subscription_plan VARCHAR(50) DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'active';
ALTER TABLE user_profiles ADD COLUMN subscription_expires_at TIMESTAMP;
```

- Middleware para validar límites
- Página `/pricing` con planes
- Integración con Stripe
- Dashboard para gestionar suscripción

**Archivos**:

- `middleware.ts` - Validar límites por plan
- `app/pricing/page.js` - Nuevo
- `app/dashboard/subscription/page.js` - Nuevo
- `lib/subscriptionService.js` - Nuevo
- `app/api/webhooks/stripe/route.js` - Nuevo (webhooks de Stripe)

### 10. 🎨 Personalización de branding (Plan PRO+)

- **Complejidad**: 🟡 Media (1 semana)
- **Impacto**: 🟢 Alto (diferenciador)
- **Categoría**: Premium Features
- **Features**:
  - Subir logo personalizado (reemplaza logo Potentia MX)
  - Elegir colores de marca (hotspots, botones)
  - Custom WhatsApp number
  - Eliminar "Powered by Potentia MX"
- **Implementación**:
  ```sql
  CREATE TABLE brand_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    logo_url TEXT,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    whatsapp_number VARCHAR(20),
    hide_watermark BOOLEAN DEFAULT false
  );
  ```
- **Archivos**:
  - `app/dashboard/branding/page.js` - Nuevo
  - `app/terreno/[id]/PhotoSphereViewer.js` - Leer settings

### 11. 🎵 Audio de fondo y narración

- **Complejidad**: 🟡 Media (4-5 días)
- **Impacto**: 🟡 Medio
- **Categoría**: Multimedia
- **Features**:
  - Subir audio MP3 para tour completo
  - Biblioteca de sonidos ambientales (loop)
  - Control de volumen y play/pause
- **Implementación**:
  ```sql
  ALTER TABLE terrenos ADD COLUMN background_audio_url TEXT;
  ```

  - Audio player con Howler.js
  - Storage para archivos de audio
  - Biblioteca de sonidos (proporcionados por cliente)

### 12. 📹 Reproductor de video incrustado

- **Complejidad**: 🟡 Media (3-4 días)
- **Impacto**: 🟡 Medio
- **Categoría**: Multimedia
- **Features**:
  - Agregar videos 1080p en hotspots específicos
  - Modal con reproductor
  - Lazy loading
- **Implementación**:
  - Tipo de hotspot "video" con `video_url`
  - Modal con React Player
  - Optimización de videos

### 13. 📊 Analytics intermedios

- **Complejidad**: 🟡 Media (1 semana)
- **Impacto**: 🟢 Alto
- **Categoría**: Analytics
- **Métricas**:
  - Duración promedio de visitas
  - Hotspots más clickeados
  - Tasa de conversión (visita → lead)
  - Dispositivos usados
  - Horarios pico
  - Origen del tráfico (UTM params)
- **Implementación**:
  - Eventos: `tour_started`, `hotspot_clicked`, `tour_completed`, `contact_form_opened`
  - Dashboard con gráficas (Recharts)
  - Exportar reportes CSV/PDF
- **Archivos**:
  - `app/dashboard/analytics/[id]/page.js` - Nuevo
  - `lib/analyticsService.js` - Ampliar

### 14. 🔗 Sistema de compartir avanzado

- **Complejidad**: 🟢 Baja (2-3 días)
- **Impacto**: 🟡 Medio
- **Categoría**: Viral Growth
- **Features**:
  - Links cortos personalizados
  - Compartir a redes sociales con Open Graph
  - Generar QR codes para imprimir
  - Tracking de origen (utm_source)
- **Implementación**:
  - Botón "Compartir" en viewer
  - Preview cards para redes sociales (meta tags)
  - Librería QR (qrcode.js)

### 15. 📱 Modo VR (Realidad Virtual)

- **Complejidad**: 🔴 Alta (1-2 semanas)
- **Impacto**: 🟡 Medio (diferenciador)
- **Categoría**: Premium Feature
- **Descripción**: Soporte para Google Cardboard y cascos VR
- **Implementación**: Photo Sphere Viewer ya tiene plugin VR

### 16. 🌍 Multi-idioma

- **Complejidad**: 🟡 Media (3-4 días)
- **Impacto**: 🟡 Medio
- **Categoría**: Internacionalización
- **Idiomas**: Español (default), Inglés, Portugués
- **Implementación**: next-i18next

### 17. 🎮 Tour guiado automático

- **Complejidad**: 🟡 Media (1 semana)
- **Impacto**: 🟢 Alto (UX)
- **Categoría**: UX
- **Descripción**: Auto-play que navega automáticamente
- **Implementación**: Modo "presentación" con timer

### 18. ☁️ CDN y optimización de performance

- **Complejidad**: 🟡 Media (1 semana)
- **Impacto**: 🟢 Alto
- **Categoría**: Infraestructura
- **Features**:
  - CDN para imágenes (Cloudflare)
  - Compresión automática
  - Progressive loading
  - Service workers

---

## 🚀 PRIORIDAD BAJA - ROADMAP FUTURO (3-6 meses)

Features **complejas** o **enterprise** que requieren más desarrollo.

### 19. 🔌 Integración con CRMs (Plan BUSINESS)

- **Complejidad**: 🔴 Muy alta (1-2 meses)
- **Impacto**: 🟢 Alto (enterprise)
- **CRMs**: Salesforce, HubSpot, Zoho, Pipedrive, Microsoft Dynamics
- **Features**:
  - Sync automático de leads
  - Registro de actividad
  - Asignación automática a agentes
  - Webhooks
- **Implementación**: OAuth + Queue system (Bull/Redis)

### 20. 📧 Email marketing automation

- **Complejidad**: 🔴 Alta (3-4 semanas)
- **Impacto**: 🟡 Medio
- **Features**:
  - Follow-ups automáticos
  - Campañas basadas en comportamiento
  - Templates personalizables
- **Implementación**: Integración con Resend (ya tenemos) + automatización

### 21. 📊 Analytics avanzados (IA/ML)

- **Complejidad**: 🔴 Muy alta (2-3 meses)
- **Impacto**: 🟡 Medio (enterprise)
- **Features**:
  - Heatmaps de interacción
  - Predicción de leads calificados (ML)
  - Recomendaciones IA
  - A/B testing
- **Implementación**: TensorFlow.js, Eye tracking con WebGazer

### 22. 🏗️ Sistema de plantillas

- **Complejidad**: 🔴 Alta (1 mes)
- **Impacto**: 🟡 Medio
- **Descripción**: Templates prediseñados por tipo de propiedad
- **Ejemplos**: Residencial, Comercial, Terreno, Bodega

### 23. 🤝 Marketplace de assets

- **Complejidad**: 🔴 Muy alta (2-3 meses)
- **Impacto**: 🟡 Medio
- **Descripción**: Usuarios venden/compran plantillas, iconos, audios

### 24. 👥 Sistema de equipos/colaboración

- **Complejidad**: 🔴 Alta (1 mes)
- **Impacto**: 🟡 Medio (enterprise)
- **Features**:
  - Múltiples usuarios por cuenta
  - Roles: Admin, Editor, Viewer
  - Asignación de tours
  - Comentarios/aprobaciones

### 25. 🔐 White-label completo (Plan BUSINESS)

- **Complejidad**: 🔴 Muy alta (2-3 meses)
- **Impacto**: 🟢 Alto (enterprise)
- **Features**:
  - Dominio personalizado (tours.tuagencia.com)
  - Eliminación completa de marca
  - Custom login page
  - API completa

### 26. 📱 App móvil nativa

- **Complejidad**: 🔴 Muy alta (3-4 meses)
- **Impacto**: 🟡 Medio
- **Plataformas**: iOS + Android (React Native)
- **Features**: Captura de fotos 360° in-app

### 27. 🗺️ Minimapa / Plano de planta

- **Complejidad**: 🔴 Alta (2-3 semanas)
- **Impacto**: 🟡 Medio
- **Descripción**: Plano 2D con ubicación actual

---

## 📋 TABLA RESUMEN ACTUALIZADA

| #   | Feature                 | Complejidad | Impacto     | Prioridad  | Tiempo   |
| --- | ----------------------- | ----------- | ----------- | ---------- | -------- |
| 0   | Olvidé contraseña       | 🟢 Muy baja | 🔴 Crítico  | 🚨 Crítica | 15 min   |
| 0.1 | Corregir límite FREE    | 🟢 Muy baja | 🔴 Crítico  | 🚨 Crítica | 5 min    |
| 0.2 | Tipos de propiedad      | 🟡 Media    | 🔴 Crítico  | 🚨 Crítica | 2-3 h    |
| 0.3 | Contrato marketplace    | 🟡 Media    | 🔴 Crítico  | 🚨 Crítica | 1-2 días |
| 2   | Cambiar subtítulo       | 🟢 Muy baja | 🟢 Alto     | 🔥 Alta    | 5 min    |
| 1   | Renombrar vistas        | 🟢 Baja     | 🟡 Medio    | 🔥 Alta    | 2-3 h    |
| 3   | Acceso desde dashboard  | 🟢 Baja     | 🟢 Alto     | 🔥 Alta    | 30 min   |
| 4   | Verificar embedding     | 🟢 Baja     | 🟢 Alto     | 🔥 Alta    | 1-2 h    |
| 7   | Mejoras panel dashboard | 🟢 Baja     | 🟡 Medio    | 🔥 Alta    | 30 min   |
| 6   | Analytics básicos       | 🟡 Media    | 🟢 Alto     | 🔥 Alta    | 3-4 h    |
| 5   | Formulario leads        | 🟡 Media    | 🟢 Muy alto | 🔥 Alta    | 4-6 h    |
| 8   | Vista móvil demo        | 🟢 Baja     | 🟡 Medio    | 🔥 Alta    | 2-3 h    |

---

## 🎯 RECOMENDACIÓN DE SPRINTS ACTUALIZADA

### **SPRINT 0 - CRITICAL FIXES (HOY - 3-4 horas)**

1. ✅ Olvidé mi contraseña (15 min)
2. ✅ Corregir límite plan FREE (5 min)
3. ✅ Sistema de tipos de propiedad (2-3 h)
4. ⏸️ Contrato marketplace (postponer a Sprint 2 - requiere legal)

**Total**: ~3-4 horas
**Resultado**: Sistema alineado con modelo de negocio actual

---

### **SPRINT 1 - QUICK WINS (Semana 1)**

5. ✅ Cambiar subtítulo dashboard (5 min)
6. ✅ Acceso directo desde dashboard (30 min)
7. ✅ Mejoras panel dashboard (30 min)
8. ✅ Renombrar vistas (2-3 h)
9. ✅ Verificar embedding (1-2 h)
10. ✅ Vista móvil demo embed (2-3 h)
11. ✅ Analytics básicos (3-4 h)

**Total**: ~2 días de trabajo
**Resultado**: UX mejorado + analytics básicos funcionando

---

### **SPRINT 2 - LEAD GENERATION (Semana 2)**

12. ✅ Formulario de contacto en tours (4-6 h)
13. ✅ Sistema de compartir avanzado (2-3 días)
14. ✅ Contrato marketplace (1-2 días)

**Total**: ~5 días
**Resultado**: Sistema de generación de leads completo + marketplace con protección legal

---

### **SPRINT 3 - PREMIUM MVP (Semanas 3-5)**

15. 🎨 Sistema de planes (1-2 semanas)
16. 🎨 Personalización de branding (1 semana)
17. 📊 Analytics intermedios (1 semana)

**Total**: 3-4 semanas
**Resultado**: MVP premium listo para monetizar

---

## 💡 RECOMENDACIONES ESTRATÉGICAS ACTUALIZADAS

### 1. **URGENTE: Completar Sprint 0 HOY**

- Estas son correcciones críticas que afectan el modelo de negocio
- Sin ellas, el sistema no refleja la propuesta de valor correcta
- **Tiempo total**: 3-4 horas máximo

### 2. **Contrato Marketplace requiere asesoría legal**

- No escribir contrato sin revisar con abogado
- Mientras tanto: mensaje simple "Al publicar aceptas 3% de comisión"
- Contrato completo en Sprint 2 con asesoría legal

### 3. **Priorizar autenticación básica**

- "Olvidé contraseña" es funcionalidad estándar esperada
- 15 minutos de implementación, evita frustración de usuarios

### 4. **Sistema de tipos revoluciona la plataforma**

- De "LandView" (solo terrenos) a "Potentia MX" (multi-propiedad)
- Abre mercado a agencias inmobiliarias completas
- Permite segmentación de mercado (residencial vs comercial vs desarrollo)

### 5. **Siguiente milestone: 100 usuarios FREE**

- Con Sprint 0-2 completos, lanzar beta pública
- Meta: 100 usuarios en plan FREE en 30 días
- De esos 100, convertir 10% a STARTER (€390/mes MRR)

---

## 🔄 PRÓXIMOS PASOS INMEDIATOS

**HOY (Próximas 4 horas):**

1. ✅ Implementar "Olvidé mi contraseña" (15 min)
2. ✅ Corregir límite plan FREE a 2 tours (5 min)
3. ✅ Sistema de tipos de propiedad (2-3 h)

**ESTA SEMANA (Sprint 1):** 4. Quick wins de UX (subtítulo, acceso directo, etc.) 5. Analytics básicos 6. Demo embed mejorado

**PRÓXIMA SEMANA (Sprint 2):** 7. Formulario de leads en tours 8. Sistema de compartir + QR 9. Contrato marketplace (con asesoría legal)

---

## 📝 NOTAS SOBRE GOOGLE WORKSPACE

Las sugerencias de Google Workspace (líneas 70-142 de mejoras.txt) son **organizacionales**, no de código:

**Acciones recomendadas:**

- ✅ Migrar documentación .md a Google Docs (colaboración en tiempo real)
- ✅ Crear Google Calendar para sprints y deadlines
- ✅ Google Meet para reuniones con clientes/demos
- ✅ Google Forms para captar feedback de beta testers
- ✅ Google Sheets como CRM temporal (hasta implementar CRM integration)

**No requieren cambios en código**, solo mejores prácticas organizacionales.

---

## ✅ ESTADO DEL PROYECTO

| Categoría          | Completado | En Progreso         | Pendiente            |
| ------------------ | ---------- | ------------------- | -------------------- |
| Auth básico        | 80%        | -                   | Recuperar contraseña |
| Sistema de planes  | 30%        | -                   | Límites + Stripe     |
| Lead generation    | 50%        | Formulario contacto | Analytics avanzados  |
| Multimedia         | 0%         | -                   | Audio + Video        |
| Analytics          | 0%         | -                   | Todo                 |
| CRM Integration    | 0%         | -                   | Todo                 |
| Marketplace        | 60%        | -                   | Contrato legal       |
| Tipos de propiedad | 0%         | -                   | Todo                 |

---

**Documento actualizado**: 18 de Enero, 2025
**Próxima revisión**: Después de completar Sprint 0 (estimado: hoy mismo)
**Contacto**: hola@potentiamx.com
