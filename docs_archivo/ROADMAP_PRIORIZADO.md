# 🗺️ ROADMAP PRIORIZADO - LANDVIEW CMS

**Fecha de análisis**: 17 de Enero, 2025

---

## 📊 RESUMEN EJECUTIVO

- **Total de mejoras identificadas**: 25+ features
- **Categorías**: 7 categorías principales
- **Prioridad alta (Quick Wins)**: 6 tareas
- **Prioridad media (MVP Premium)**: 8 tareas
- **Prioridad baja (Roadmap futuro)**: 11+ tareas

---

## 🔥 PRIORIDAD ALTA - QUICK WINS (1-2 semanas)

Estas mejoras tienen **alto impacto** y **baja complejidad**. Implementarlas primero genera valor inmediato.

### 1. ✅ Renombrar vistas en el editor

- **Complejidad**: 🟢 Baja (2-3 horas)
- **Impacto**: 🟡 Medio
- **Categoría**: UX/Editor
- **Descripción**: Permitir cambiar "Vista 1", "Vista 2" a nombres descriptivos como "Entrada", "Jardín", etc.
- **Implementación**: Agregar campo `nombre` a vistas, input editable en HotspotEditor

### 2. ✅ Modificar subtítulo del dashboard

- **Complejidad**: 🟢 Muy baja (5 minutos)
- **Impacto**: 🟢 Alto (branding/marketing)
- **Categoría**: Quick Win
- **Descripción**: Cambiar texto a "Lienzos perfectos para tu próximo proyecto"
- **Archivo**: `app/dashboard/page.js` línea ~20-30

### 3. ✅ Verificar funcionalidad de embedding

- **Complejidad**: 🟢 Baja (1-2 horas)
- **Impacto**: 🟢 Alto (feature clave para clientes)
- **Categoría**: Embedding/Compartir
- **Descripción**: Crear ruta `/embed/[id]` sin header/footer para iframe
- **Implementación**:
  - Crear `app/embed/[id]/page.js` (copia de terreno sin UI)
  - Agregar botón "Obtener código embed" en dashboard
  - Generar snippet: `<iframe src="https://tu-dominio/embed/123">`

### 4. ✅ Formulario de contacto en recorridos (Lead Generation básico)

- **Complejidad**: 🟡 Media (4-6 horas)
- **Impacto**: 🟢 Muy alto (monetización)
- **Categoría**: Lead Generation
- **Descripción**: Modal con formulario dentro del tour 360°
- **Campos**: Nombre, Email, Teléfono, Mensaje
- **Implementación**:
  - Botón flotante "💬 Contactar" en PhotoSphereViewer
  - Modal con formulario
  - Guardar en tabla `leads` con `terreno_id`
  - Notificación al dueño del terreno

### 5. ✅ Analytics básicos (Contador de visitas)

- **Complejidad**: 🟡 Media (3-4 horas)
- **Impacto**: 🟢 Alto (datos para clientes)
- **Categoría**: Analytics
- **Descripción**: Registrar cada visita al tour
- **Implementación**:
  - Tabla `tour_visits` (terreno_id, timestamp, referrer, device)
  - Mostrar contador en dashboard del propietario
  - Gráfica simple de visitas por día (últimos 30 días)

### 6. ✅ Mejoras al panel de propiedades del dashboard

- **Complejidad**: 🟢 Baja (30 minutos)
- **Impacto**: 🟡 Medio
- **Categoría**: UX
- **Descripción**: Botón "Editar" más visible, acceso rápido al editor de hotspots

---

## ⚡ PRIORIDAD MEDIA - MVP PREMIUM (3-6 semanas)

Features para **diferenciar planes** y empezar a monetizar.

### 7. 🎨 Sistema de planes (Free vs Premium)

- **Complejidad**: 🔴 Alta (1-2 semanas)
- **Impacto**: 🟢 Muy alto (monetización)
- **Categoría**: Monetización
- **Features**:
  - **Plan Free**: Máx 3 tours, logo LandView visible, sin analytics avanzados
  - **Plan Premium**: Tours ilimitados, sin marca de agua, analytics completos, custom branding
- **Implementación**:
  - Campo `subscription_plan` en user_profiles
  - Middleware para validar límites
  - Página `/pricing` con planes
  - Integración con Stripe/PayPal

### 8. 🎨 Personalización de branding (Premium)

- **Complejidad**: 🟡 Media (1 semana)
- **Impacto**: 🟢 Alto (diferenciador clave)
- **Categoría**: Premium Features
- **Features**:
  - Subir logo personalizado (reemplaza logo LandView)
  - Elegir colores de marca (hotspots, botones)
  - Custom WhatsApp number
  - Eliminar "Powered by LandView"
- **Implementación**:
  - Tabla `brand_settings` (user_id, logo_url, primary_color, secondary_color, whatsapp_number)
  - UI de configuración en `/dashboard/branding`
  - PhotoSphereViewer lee settings del usuario

### 9. 🎵 Audio de fondo y narración

- **Complejidad**: 🟡 Media (4-5 días)
- **Impacidad**: 🟡 Medio (nice-to-have)
- **Categoría**: Multimedia
- **Features**:
  - Subir audio MP3 para tour completo
  - Biblioteca de sonidos ambientales (loop)
  - Control de volumen y play/pause en visor
- **Implementación**:
  - Campo `background_audio_url` en terrenos
  - Audio player con Howler.js
  - Storage para archivos de audio

### 10. 📹 Reproductor de video incrustado

- **Complejidad**: 🟡 Media (3-4 días)
- **Impacto**: 🟡 Medio
- **Categoría**: Multimedia
- **Features**:
  - Agregar videos (1080p) en hotspots específicos
  - Modal con reproductor optimizado
  - Lazy loading para no afectar performance
- **Implementación**:
  - Tipo de hotspot "video" con `video_url`
  - Modal con React Player o video nativo
  - Compresión/optimización de videos

### 11. 📊 Analytics intermedios

- **Complejidad**: 🟡 Media (1 semana)
- **Impacto**: 🟢 Alto (valor para clientes)
- **Categoría**: Analytics
- **Métricas**:
  - Duración promedio de visitas
  - Hotspots más clickeados
  - Tasa de conversión (visita → lead)
  - Dispositivos usados (móvil vs desktop)
  - Horarios pico
- **Implementación**:
  - Eventos trackeo: `tour_started`, `hotspot_clicked`, `tour_completed`
  - Dashboard de analytics con gráficas (Recharts)
  - Exportar reportes CSV/PDF

### 12. 🔗 Sistema de compartir avanzado

- **Complejidad**: 🟢 Baja (2-3 días)
- **Impacto**: 🟡 Medio
- **Categoría**: Viral Growth
- **Features**:
  - Generar links cortos (bit.ly style)
  - Compartir a redes sociales con preview cards (Open Graph)
  - Generar QR codes para imprimir
  - Tracking de origen del tráfico (utm_source)

### 13. 📱 Modo VR (Realidad Virtual)

- **Complejidad**: 🔴 Alta (1-2 semanas)
- **Impacto**: 🟡 Medio (diferenciador)
- **Categoría**: Premium Feature
- **Descripción**: Soporte para Google Cardboard y cascos VR
- **Implementación**: Photo Sphere Viewer ya tiene plugin VR

### 14. 🌍 Multi-idioma

- **Complejidad**: 🟡 Media (3-4 días)
- **Impacto**: 🟡 Medio
- **Categoría**: Internacionalización
- **Idiomas**: Español (default), Inglés, Portugués
- **Implementación**: next-i18next

---

## 🚀 PRIORIDAD BAJA - ROADMAP FUTURO (3-6 meses)

Features **complejas** o de **nicho** que requieren más investigación/desarrollo.

### 15. 🔌 Integración con CRMs (Premium+)

- **Complejidad**: 🔴 Muy alta (1-2 meses)
- **Impacto**: 🟢 Alto (enterprise clients)
- **Categoría**: Integraciones
- **CRMs soportados**:
  - Salesforce
  - HubSpot
  - Zoho CRM
  - Pipedrive
  - Microsoft Dynamics
- **Features**:
  - Sync automático de leads
  - Registro de actividad en timeline del lead
  - Asignación automática a agentes
  - Webhooks para eventos
- **Implementación**:
  - OAuth para cada CRM
  - Queue system (Bull/Redis) para procesar webhooks
  - Middleware de integración por CRM

### 16. 📧 Email marketing automation

- **Complejidad**: 🔴 Alta (3-4 semanas)
- **Impacto**: 🟡 Medio
- **Categoría**: Marketing
- **Features**:
  - Envío automático de follow-ups
  - Campañas basadas en comportamiento
  - Templates personalizables
- **Implementación**: Integración con SendGrid/Mailchimp

### 17. 📊 Analytics avanzados (IA/ML)

- **Complejidad**: 🔴 Muy alta (2-3 meses)
- **Impacto**: 🟡 Medio (premium enterprise)
- **Categoría**: Analytics + IA
- **Features**:
  - Heatmaps de interacción (dónde miran más)
  - Predicción de leads calificados (scoring con ML)
  - Recomendaciones automáticas de mejora
  - A/B testing de tours
- **Implementación**: TensorFlow.js, Eye tracking con WebGazer

### 18. 🏗️ Sistema de plantillas

- **Complejidad**: 🔴 Alta (1 mes)
- **Impacto**: 🟡 Medio
- **Categoría**: UX
- **Descripción**: Templates prediseñados para diferentes tipos de propiedades
- **Ejemplos**: Residencial, Comercial, Terreno, Bodega
- **Implementación**: Biblioteca de layouts con hotspots predefinidos

### 19. 🤝 Marketplace de plantillas/assets

- **Complejidad**: 🔴 Muy alta (2-3 meses)
- **Impacto**: 🟡 Medio (monetización adicional)
- **Categoría**: Monetización
- **Descripción**: Usuarios pueden vender/comprar plantillas, iconos, audios

### 20. 👥 Sistema de equipos/colaboración

- **Complejidad**: 🔴 Alta (1 mes)
- **Impacto**: 🟡 Medio (enterprise)
- **Categoría**: Colaboración
- **Features**:
  - Múltiples usuarios por cuenta
  - Roles: Admin, Editor, Viewer
  - Asignación de tours a agentes
  - Comentarios/aprobaciones

### 21. 🔐 White-label completo

- **Complejidad**: 🔴 Muy alta (2-3 meses)
- **Impacto**: 🟢 Alto (enterprise, alto precio)
- **Categoría**: Premium Enterprise
- **Features**:
  - Dominio personalizado (tours.tuagencia.com)
  - Eliminación completa de marca LandView
  - Custom login page
  - API completa para integraciones

### 22. 📱 App móvil nativa

- **Complejidad**: 🔴 Muy alta (3-4 meses)
- **Impacto**: 🟡 Medio
- **Categoría**: Mobile
- **Plataformas**: iOS + Android (React Native)
- **Features**: Captura de fotos 360° in-app, editor mobile

### 23. 🎮 Tour guiado automático

- **Complejidad**: 🟡 Media (1 semana)
- **Impacto**: 🟢 Alto (UX)
- **Categoría**: UX
- **Descripción**: Auto-play que navega automáticamente por todos los hotspots
- **Implementación**: Modo "presentación" con timer

### 24. 🗺️ Minimapa / Plano de planta

- **Complejidad**: 🔴 Alta (2-3 semanas)
- **Impacto**: 🟡 Medio
- **Categoría**: UX
- **Descripción**: Mostrar plano 2D con ubicación actual en el tour
- **Implementación**: Canvas + detección de posición

### 25. ☁️ CDN y optimización de performance

- **Complejidad**: 🟡 Media (1 semana)
- **Impacto**: 🟢 Alto (calidad del producto)
- **Categoría**: Infraestructura
- **Features**:
  - CDN para imágenes (Cloudflare/CloudFront)
  - Compresión automática de imágenes
  - Progressive loading
  - Service workers para offline

---

## 📋 TABLA RESUMEN DE PRIORIZACIÓN

| #   | Feature                     | Complejidad | Impacto     | Prioridad | Tiempo estimado |
| --- | --------------------------- | ----------- | ----------- | --------- | --------------- |
| 2   | Cambiar subtítulo dashboard | 🟢 Muy baja | 🟢 Alto     | 🔥 Alta   | 5 min           |
| 1   | Renombrar vistas            | 🟢 Baja     | 🟡 Medio    | 🔥 Alta   | 2-3 h           |
| 3   | Verificar embedding         | 🟢 Baja     | 🟢 Alto     | 🔥 Alta   | 1-2 h           |
| 6   | Mejoras panel dashboard     | 🟢 Baja     | 🟡 Medio    | 🔥 Alta   | 30 min          |
| 5   | Analytics básicos           | 🟡 Media    | 🟢 Alto     | 🔥 Alta   | 3-4 h           |
| 4   | Formulario leads            | 🟡 Media    | 🟢 Muy alto | 🔥 Alta   | 4-6 h           |
| 12  | Sistema compartir avanzado  | 🟢 Baja     | 🟡 Medio    | ⚡ Media  | 2-3 días        |
| 9   | Audio de fondo              | 🟡 Media    | 🟡 Medio    | ⚡ Media  | 4-5 días        |
| 10  | Reproductor video           | 🟡 Media    | 🟡 Medio    | ⚡ Media  | 3-4 días        |
| 14  | Multi-idioma                | 🟡 Media    | 🟡 Medio    | ⚡ Media  | 3-4 días        |
| 11  | Analytics intermedios       | 🟡 Media    | 🟢 Alto     | ⚡ Media  | 1 semana        |
| 8   | Personalización branding    | 🟡 Media    | 🟢 Alto     | ⚡ Media  | 1 semana        |
| 7   | Sistema de planes           | 🔴 Alta     | 🟢 Muy alto | ⚡ Media  | 1-2 semanas     |
| 13  | Modo VR                     | 🔴 Alta     | 🟡 Medio    | ⚡ Media  | 1-2 semanas     |
| 23  | Tour guiado automático      | 🟡 Media    | 🟢 Alto     | 🚀 Baja   | 1 semana        |
| 25  | CDN y performance           | 🟡 Media    | 🟢 Alto     | 🚀 Baja   | 1 semana        |
| 24  | Minimapa plano              | 🔴 Alta     | 🟡 Medio    | 🚀 Baja   | 2-3 semanas     |
| 15  | Integración CRMs            | 🔴 Muy alta | 🟢 Alto     | 🚀 Baja   | 1-2 meses       |
| 16  | Email automation            | 🔴 Alta     | 🟡 Medio    | 🚀 Baja   | 3-4 semanas     |
| 20  | Sistema equipos             | 🔴 Alta     | 🟡 Medio    | 🚀 Baja   | 1 mes           |
| 18  | Sistema plantillas          | 🔴 Alta     | 🟡 Medio    | 🚀 Baja   | 1 mes           |
| 17  | Analytics con IA            | 🔴 Muy alta | 🟡 Medio    | 🚀 Baja   | 2-3 meses       |
| 19  | Marketplace                 | 🔴 Muy alta | 🟡 Medio    | 🚀 Baja   | 2-3 meses       |
| 21  | White-label                 | 🔴 Muy alta | 🟢 Alto     | 🚀 Baja   | 2-3 meses       |
| 22  | App móvil nativa            | 🔴 Muy alta | 🟡 Medio    | 🚀 Baja   | 3-4 meses       |

---

## 🎯 RECOMENDACIÓN DE SPRINT

### **SPRINT 1 - Quick Wins (Esta semana)**

1. ✅ Cambiar subtítulo dashboard (5 min)
2. ✅ Mejoras panel dashboard (30 min)
3. ✅ Renombrar vistas (2-3 h)
4. ✅ Verificar embedding (1-2 h)
5. ✅ Analytics básicos (3-4 h)

**Total**: ~1 día de trabajo

### **SPRINT 2 - Lead Generation (Próxima semana)**

6. ✅ Formulario de contacto en tours (4-6 h)
7. ✅ Sistema de compartir avanzado (2-3 días)

**Total**: ~4 días

### **SPRINT 3 - Premium MVP (Siguientes 2 semanas)**

8. 🎨 Sistema de planes Free/Premium
9. 🎨 Personalización de branding
10. 📊 Analytics intermedios

**Total**: 3-4 semanas para MVP premium listo para vender

---

## 💡 RECOMENDACIONES ESTRATÉGICAS

### 1. **Enfocarse en Quick Wins primero**

- Implementar features 1-6 en 1-2 semanas
- Genera valor inmediato sin complejidad
- Prepara base para features premium

### 2. **Lanzar MVP Premium en 1 mes**

- Sistema de planes + branding + analytics = paquete vendible
- Precio sugerido: $29-49/mes Premium
- Target: 10-20 clientes beta en primer mes

### 3. **Posponer integraciones complejas**

- CRM, email automation, IA son para después de tener tracción
- Requieren mucho desarrollo sin garantía de ROI inmediato
- Mejor: Manual CRM export (CSV) por ahora

### 4. **Priorizar features que reducen "puntos de dolor"**

Del análisis de mercado, los clientes sufren más por:

- ❌ Costos altos → ✅ Solución: Plan Free generoso + Premium accesible
- ❌ Complejidad técnica → ✅ Solución: Editor intuitivo (ya tenemos)
- ❌ Falta de personalización → ✅ Solución: Branding custom (Sprint 3)
- ❌ Sin integración con herramientas → ✅ Solución: Embedding + API futura

### 5. **Monetización escalonada**

- **Ahora**: Freemium (Plan Free + Premium básico)
- **3 meses**: Plan Business (analytics avanzados, más tours)
- **6 meses**: Plan Enterprise (CRM, white-label, soporte dedicado)

---

## 🔄 PRÓXIMOS PASOS INMEDIATOS

**Hoy mismo:**

1. ✅ Cambiar subtítulo dashboard (completado en sesión actual)
2. ⏳ Implementar renombrar vistas

**Esta semana:** 3. Verificar/crear funcionalidad de embedding 4. Implementar analytics básicos (contador de visitas) 5. Formulario de leads en tours

**Siguiente semana:** 6. Sistema de compartir + QR codes 7. Audio de fondo básico

---

**Documento generado**: 17 de Enero, 2025
**Próxima revisión**: Después de completar Sprint 1 (estimado: 24 de Enero)
