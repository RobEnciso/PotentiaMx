# 🚀 ROADMAP INTEGRADO POTENTIAMX

## Estrategia Completa: SaaS + IA + Google Workspace

**Fecha de creación:** 19 de Octubre, 2025
**Versión:** 1.0
**Estado del proyecto:** 85% MVP completado
**Modelo de negocio:** Triple (SaaS + Servicios + Marketplace)

---

## 📊 CONTEXTO Y ESTADO ACTUAL

### Proyecto: PotentiaMX (antes LandView)

- **Framework:** Next.js 15 + Supabase + Photo Sphere Viewer
- **Usuarios objetivo:** Agentes inmobiliarios y desarrolladores
- **Propuesta de valor única:** Tours 360° + Analytics IA + Marketplace con comisión
- **Recursos disponibles:** $5,000 créditos Google Cloud

### Stack Actual

✅ Next.js 15.5.4 con App Router y Turbopack
✅ Supabase (auth, PostgreSQL, storage)
✅ Photo Sphere Viewer para tours 360°
✅ Resend para emails transaccionales
✅ Sistema de hotspots y navegación
✅ Dashboard básico funcional

### Funcionalidades Existentes

✅ Login/Signup con Supabase Auth
✅ CRUD de propiedades (terrenos)
✅ Editor de hotspots interactivo
✅ Visor público de tours 360°
✅ Sistema de embedding (parcial)
✅ Marketplace básico con aprobación admin
✅ Formulario de contacto (API implementada)

### Recursos Estratégicos

- 🎁 **$5,000 USD en créditos Google Cloud** (para IA)
- 📧 **Sistema SMTP configurado** (Resend)
- 💳 **Listo para integrar Stripe** (planes de pago)
- 📸 **Equipo de captura**: Insta360 X4 + DJI Air 3S

---

## 🎯 VISIÓN ESTRATÉGICA INTEGRADA

### Ejes de Diferenciación

1. **Soporte IA Proactivo** ("Poti" 🤖)
   - Chat 24/7 con Vertex AI / Gemini Pro
   - Detección inteligente de oportunidades de venta
   - Onboarding guiado automático
   - Reducción de tickets de soporte en 70%

2. **Analytics con Sugerencias** (tipo Airbnb)
   - Heatmaps de interacción
   - Predicción de conversión con ML
   - Sugerencias automáticas de optimización
   - Benchmarking vs competencia

3. **Operaciones Profesionales** (Google Workspace)
   - Emails @potentiamx.com
   - CRM en Google Sheets (temporal)
   - Calendar con appointment slots
   - Automatización Supabase ↔ Workspace

4. **Marketplace con Comisión**
   - Publicación gratuita
   - Comisión 3-5% solo al vender
   - SEO optimizado para tráfico orgánico
   - Sistema de leads integrado

---

## 📅 ROADMAP POR FASES

---

## 🔥 FASE 0: CRITICAL FIXES (HOY - 3-4 HORAS)

**Objetivo:** Corregir errores críticos antes de lanzamiento

### Prioridad CRÍTICA

| #   | Tarea                                  | Tiempo | Impacto    | Archivo                             |
| --- | -------------------------------------- | ------ | ---------- | ----------------------------------- |
| 0.1 | ✅ Agregar "Olvidé mi contraseña"      | 15 min | 🔴 Crítico | `app/login/page.js`                 |
| 0.2 | ✅ Corregir límite plan FREE (2 tours) | 5 min  | 🔴 Crítico | `app/dashboard/add-terrain/page.js` |
| 0.3 | ✅ Sistema de tipos de propiedad       | 2-3 h  | 🔴 Crítico | Múltiples archivos                  |

### Implementación 0.3: Tipos de Propiedad

**Cambios en Supabase:**

```sql
ALTER TABLE terrenos ADD COLUMN property_type VARCHAR(50) DEFAULT 'terreno';
ALTER TABLE terrenos ADD COLUMN land_category VARCHAR(50);
ALTER TABLE terrenos ADD COLUMN available_for_contribution BOOLEAN DEFAULT false;

-- Tipos: 'casa' | 'departamento' | 'terreno'
-- Categorías (solo terreno): 'residencia' | 'desarrollo' | 'proyecto'
```

**Archivos a modificar:**

- `app/dashboard/add-terrain/page.js` - Agregar campos
- `app/dashboard/edit-terrain/[id]/page.js` - Agregar campos
- `app/dashboard/page.js` - Mostrar tipo en cards
- `app/terreno/[id]/page.js` - Mostrar en visor público

**Resultado:** Transición de "LandView" (solo terrenos) a "PotentiaMX" (multi-propiedad)

---

## 🚀 FASE 1: INFRAESTRUCTURA PROFESIONAL (SEMANA 1 - 5 DÍAS)

**Objetivo:** Establecer base operativa profesional con Google Workspace

### SPRINT 1.1: Configuración Google Workspace (Día 1-2)

#### Google Workspace Setup

**Cuentas de email a crear:**

```
hola@potentiamx.com         → Contacto general
ventas@potentiamx.com        → Pipeline comercial
soporte@potentiamx.com       → Tickets de clientes
captura@potentiamx.com       → Coordinación sesiones foto
marketplace@potentiamx.com   → Leads del marketplace
admin@potentiamx.com         → Notificaciones sistema
```

**Alias estratégicos:**

- `info@` → `hola@`
- `contacto@` → `hola@`
- `ayuda@` → `soporte@`

#### Tareas Específicas

- [ ] Contratar Google Workspace Business Starter ($6 USD/usuario/mes)
- [ ] Configurar dominio potentiamx.com en Google Workspace
- [ ] Crear 6 cuentas principales
- [ ] Configurar alias
- [ ] Diseñar firma HTML profesional con:
  - Logo PotentiaMX
  - Link a calculadora de ahorro
  - Botón "Agendar Demo"
  - Badge "Ahorra hasta 78% vs competencia"
- [ ] Configurar respuestas automáticas fuera de horario

**Costo:** $12 USD/mes (2 usuarios principales)
**ROI:** Credibilidad profesional + ahorro $200/mes vs HubSpot

---

### SPRINT 1.2: CRM Temporal en Sheets (Día 2-3)

#### Google Sheets CRM Dashboard

**Hoja 1: Pipeline de Prospectos**

```
Columnas: Nombre | Email | Teléfono | Plan Interesado | Etapa | Valor Est. | Siguiente Acción
Fórmulas: MRR proyectado automático
Formato condicional: Por etapas del funnel
```

**Hoja 2: Métricas en Tiempo Real**

```
- Usuarios registrados (conectar con Zapier)
- Conversión Free → Paid
- MRR actual vs proyectado
- Gráficos automáticos
```

**Hoja 3: Sesiones de Captura**

```
Cliente | Propiedad | Fecha | Tipo | Status | Pago
```

#### Tareas

- [ ] Crear Google Sheet "PotentiaMX CRM Master"
- [ ] Configurar fórmulas de MRR
- [ ] Formato condicional por etapas
- [ ] Crear gráficos de métricas
- [ ] Apps Script para notificaciones automáticas

**Tiempo:** 4-6 horas
**Beneficio:** Control total del pipeline sin pagar CRM ($200/mes ahorrados)

---

### SPRINT 1.3: Calendar y Forms (Día 3-4)

#### Google Calendar - Appointment Slots

**3 tipos de eventos bookables:**

1. **Demo 15 min** - Para interesados rápidos
2. **Consultoría 30 min** - Para agencias
3. **Sesión de captura** - Coordinación fotógrafos

#### Google Forms Estratégicos

**Form 1: Calculadora Extendida**

- Captura más datos que calculadora actual
- Auto-populate en CRM Sheet
- Trigger email con reporte personalizado

**Form 2: Solicitud Sesión de Captura**

- Tipo de propiedad
- Ubicación con Maps integration
- Fechas disponibles
- Auto-crear evento en Calendar

**Form 3: Onboarding Nuevos Clientes**

- Datos fiscales
- Configuración de marca
- Objetivos de negocio
- Genera carpeta personalizada en Drive

#### Tareas

- [ ] Configurar calendario público "Demo PotentiaMX"
- [ ] Crear 3 tipos de appointment slots
- [ ] Configurar emails de confirmación automáticos
- [ ] Crear 3 Google Forms
- [ ] Integrar Forms con Sheets (Zapier)
- [ ] Embeber calendario en landing page

**Tiempo:** 6-8 horas
**Beneficio:** Automatización de agendamiento (ahorra 5 hrs/semana)

---

### SPRINT 1.4: Drive y Automatizaciones (Día 4-5)

#### Estructura Google Drive

```
📁 PotentiaMX/
├── 📁 01_Ventas/
│   ├── Presentaciones/
│   ├── Propuestas/
│   ├── Contratos_Plantillas/
│   └── Casos_de_Éxito/
├── 📁 02_Clientes/
│   ├── [Carpeta por cliente con tours]/
│   └── Sesiones_Captura_RAW/
├── 📁 03_Marketing/
│   ├── Assets_Visuales/
│   ├── Copy_Templates/
│   └── Campañas/
├── 📁 04_Operaciones/
│   ├── SOPs_Procesos/
│   ├── Onboarding_Docs/
│   └── Knowledge_Base/
└── 📁 05_Finanzas/
    ├── Facturas/
    └── Reportes_Mensuales/
```

#### Automatizaciones con Zapier/Make

```
Zap 1: Supabase → Sheets
Trigger: Nuevo usuario registrado
Action: Añadir fila a CRM Sheet

Zap 2: Forms → Calendar
Trigger: Solicitud sesión captura
Action: Crear evento en Calendar

Zap 3: Sheets → Gmail
Trigger: Status = "Demo agendada"
Action: Email de preparación

Zap 4: Gmail → Sheets
Trigger: Email con palabra "cotización"
Action: Crear deal en pipeline
```

#### Tareas

- [ ] Crear estructura de carpetas en Drive
- [ ] Preparar templates de propuestas/contratos
- [ ] Configurar 4 Zaps básicos en Zapier
- [ ] Configurar webhook en Supabase para nuevos usuarios
- [ ] Testing de flujo completo

**Tiempo:** 6-8 horas
**Costo:** Zapier Starter $20/mes
**Beneficio:** Ahorro 10 hrs/semana en tareas manuales

---

**RESULTADO FASE 1:**
✅ Infraestructura profesional completa
✅ Emails @potentiamx.com operativos
✅ CRM funcional sin costos enterprise
✅ Automatización básica funcionando
✅ Reducción 15 hrs/semana en admin

**Inversión total:** ~$40 USD/mes
**Ahorro vs herramientas tradicionales:** ~$200 USD/mes
**ROI:** 400% 🚀

---

## 💬 FASE 2: SOPORTE IA + QUICK WINS (SEMANA 2-3 - 10 DÍAS)

**Objetivo:** Implementar chat IA 24/7 + mejoras UX críticas

### SPRINT 2.1: Chat IA con Google Cloud (Día 6-10)

#### Arquitectura Soporte IA

**Stack:**

- **Vertex AI** (Gemini Pro) - Respuestas inteligentes
- **Cloud Functions** - API endpoints
- **Firestore** - Logs de conversaciones
- **Next.js API Route** - `/api/support-chat`

#### Implementación Técnica

**Paso 1: Setup Google Cloud (Día 6)**

```bash
# Crear proyecto Google Cloud
gcloud projects create potentiamx-ai

# Habilitar APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com

# Configurar autenticación
gcloud auth application-default login
```

**Paso 2: API Route (Día 7)**

Archivo: `app/api/support-chat/route.ts`

```typescript
import { VertexAI } from '@google-cloud/vertexai';

const vertex_ai = new VertexAI({
  project: 'potentiamx-ai',
  location: 'us-central1',
});

const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

const SYSTEM_PROMPT = `
Eres "Poti", el asistente de soporte de PotentiaMX 🤖

CONOCIMIENTO BASE:
- Planes: FREE (2 tours), STARTER ($580), PRO ($1,580), BUSINESS ($3,980)
- Límites: FREE tiene marca de agua, 500MB storage
- Marketplace: Comisión 3-5% según plan
- Sesiones de captura: Desde $2,500 MXN

PROBLEMAS COMUNES:
1. "No puedo subir mi imagen" → Verificar que sea 360° (2:1 aspect ratio)
2. "Hotspots no funcionan" → Refrescar página, verificar que hay 2+ vistas
3. "Límite alcanzado" → Sugerir upgrade con calculadora de ahorro
4. "Cómo publico en marketplace" → Dashboard > Toggle marketplace > Esperar aprobación

TONO: Amigable, profesional, orientado a ventas cuando apropiado.
Si no sabes algo, ofrece contacto humano: ventas@potentiamx.com
`;

export async function POST(request: Request) {
  const { message, userId, planType } = await request.json();

  const contextualPrompt = `
  Usuario en plan: ${planType}
  Pregunta: ${message}
  `;

  const result = await model.generateContent([SYSTEM_PROMPT, contextualPrompt]);

  // Log para analytics
  await logInteraction(userId, message, result.response);

  return Response.json({
    response: result.response.text(),
    suggestedActions: generateActions(result.response),
  });
}
```

**Paso 3: Widget de Chat (Día 8-9)**

Archivo: `components/SupportChat.tsx`

```typescript
'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy Poti 🤖 ¿En qué puedo ayudarte con tus tours 360°?',
      actions: [
        'Cómo crear mi primer tour',
        'Problemas con imágenes',
        'Cambiar mi plan',
        'Agendar sesión de captura'
      ]
    }
  ]);

  const handleSend = async (message: string) => {
    const response = await fetch('/api/support-chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        userId: user?.id,
        planType: user?.plan || 'free'
      })
    });

    const data = await response.json();

    setMessages(prev => [...prev,
      { role: 'user', content: message },
      { role: 'assistant', ...data }
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-teal-500 text-white p-4
                     rounded-full shadow-lg hover:bg-teal-600 transition-all
                     hover:scale-110 z-50"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white
                      rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white
                        p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold">Poti - Soporte PotentiaMX</h3>
              <p className="text-sm opacity-90">Respuesta inmediata 24/7</p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-teal-100 text-teal-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {msg.content}
                  </div>
                </div>

                {/* Quick Actions */}
                {msg.actions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.actions.map(action => (
                      <button
                        key={action}
                        onClick={() => handleSend(action)}
                        className="text-sm bg-white border border-teal-500
                                 text-teal-600 px-3 py-1 rounded-full
                                 hover:bg-teal-50 transition"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-3 py-2 border rounded-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleSend(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button className="bg-teal-500 text-white p-2 rounded-lg">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

**Paso 4: Triggers Proactivos (Día 10)**

```typescript
// Detectar oportunidades de venta
if (user.plan === 'free' && user.toursCreated >= 2) {
  showMessage('¡Llegaste al límite! Desbloquea tours ilimitados');
  showCalculator();
  notifySlack('🔥 Hot lead: Usuario en límite FREE');
}

// Soporte preventivo
if (user.uploadsFailedCount > 2) {
  showMessage('Veo que tienes problemas subiendo imágenes');
  offerHelp([
    'Ver requisitos de imagen 360°',
    'Agendar sesión de captura profesional',
    'Hablar con soporte',
  ]);
}

// Onboarding inteligente
if (user.isNew && user.toursCreated === 0) {
  startGuidedTour();
  showMessage('¡Te ayudo a crear tu primer tour! 🎉');
}
```

#### Tareas SPRINT 2.1

- [ ] Crear proyecto Google Cloud
- [ ] Habilitar Vertex AI API
- [ ] Instalar `@google-cloud/vertexai` package
- [ ] Crear API route `/api/support-chat`
- [ ] Implementar SYSTEM_PROMPT con knowledge base
- [ ] Crear componente `SupportChat.tsx`
- [ ] Agregar widget a `app/layout.tsx`
- [ ] Implementar logging a Firestore
- [ ] Configurar triggers proactivos
- [ ] Testing con 20 preguntas comunes
- [ ] Ajustar respuestas basado en feedback
- [ ] Crear dashboard de métricas del chat

**Tiempo:** 5 días (40 horas)
**Costo con créditos:** $0 (usando $5,000 créditos)
**Estimación sin créditos:** $50-100/mes
**Beneficio:**

- Respuesta instantánea 24/7
- Reducción 70% tickets manuales
- Conversión +8-12% por upselling proactivo

---

### SPRINT 2.2: Quick Wins UX (Día 11-12)

**Mejoras rápidas alto impacto**

#### Tareas

- [ ] Cambiar subtítulo dashboard: "Lienzos perfectos para tu próximo proyecto"
- [ ] Acceso directo al tour desde dashboard (click en imagen)
- [ ] Botón "Editar" más visible en cards
- [ ] Mejorar panel de propiedades (categorización)
- [ ] Renombrar vistas en editor ("Vista 1" → "Entrada Principal")
- [ ] Verificar y mejorar funcionalidad de embedding
- [ ] Crear ruta `/embed/[id]` sin UI para iframes
- [ ] Botón "Obtener código embed" en dashboard
- [ ] Vista móvil mejorada en `/demo-embed`

**Archivos:**

- `app/dashboard/page.js`
- `app/terreno/[id]/editor/HotspotEditor.js`
- `app/embed/[id]/page.js` (nuevo)

**Tiempo:** 2 días
**Impacto:** UX significativamente mejorado

---

**RESULTADO FASE 2:**
✅ Chat IA 24/7 operativo con Poti
✅ Soporte proactivo automatizado
✅ UX mejorado con quick wins
✅ Sistema de embedding funcional
✅ Reducción 70% en tickets manuales

**Inversión:** $0 (usa créditos Google Cloud)
**Ahorro:** 20 hrs/semana en soporte
**Conversión esperada:** +8-12% por upselling IA

---

## 📊 FASE 3: ANALYTICS Y LEAD GENERATION (SEMANA 4-5 - 10 DÍAS)

**Objetivo:** Captura de leads + analytics básicos

### SPRINT 3.1: Sistema de Visitas (Día 16-17)

#### Implementación Analytics Básicos

**Base de datos:**

```sql
CREATE TABLE tour_visits (
  id SERIAL PRIMARY KEY,
  terreno_id UUID REFERENCES terrenos(id),
  visited_at TIMESTAMP DEFAULT NOW(),
  duration_seconds INTEGER,
  device_type VARCHAR(50), -- mobile|desktop|tablet
  referrer TEXT,
  country_code VARCHAR(2),
  completed_tour BOOLEAN DEFAULT false
);

CREATE INDEX idx_visits_terreno ON tour_visits(terreno_id);
CREATE INDEX idx_visits_date ON tour_visits(visited_at);
```

**Servicio de analytics:**
Archivo: `lib/analyticsService.js`

```javascript
export async function trackVisit(terrenoId, metadata) {
  const { data, error } = await supabase.from('tour_visits').insert({
    terreno_id: terrenoId,
    device_type: getDeviceType(),
    referrer: document.referrer,
    country_code: await getCountryCode(),
  });

  return data;
}

export async function getVisitStats(terrenoId) {
  const { data } = await supabase
    .from('tour_visits')
    .select('*')
    .eq('terreno_id', terrenoId)
    .order('visited_at', { ascending: false });

  return {
    totalVisits: data.length,
    last7Days: data.filter((v) => isLast7Days(v.visited_at)).length,
    avgDuration: calculateAvg(data.map((v) => v.duration_seconds)),
    deviceBreakdown: groupBy(data, 'device_type'),
  };
}
```

**Integración en viewer:**
Archivo: `app/terreno/[id]/page.js`

```javascript
useEffect(() => {
  // Trackear visita al cargar
  trackVisit(terrenoId);

  // Trackear duración al salir
  const startTime = Date.now();
  return () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    updateVisitDuration(terrenoId, duration);
  };
}, [terrenoId]);
```

#### Tareas

- [ ] Crear tabla `tour_visits` en Supabase
- [ ] Implementar `lib/analyticsService.js`
- [ ] Agregar tracking en `app/terreno/[id]/page.js`
- [ ] Crear dashboard de stats en `/dashboard/analytics/[id]`
- [ ] Mostrar contador básico en cards del dashboard
- [ ] Gráfica simple últimos 30 días (Recharts)
- [ ] Instalar `recharts` package

**Tiempo:** 2 días
**Beneficio:** Datos reales de engagement para clientes

---

### SPRINT 3.2: Formulario de Leads (Día 18-20)

#### Implementación Sistema de Contacto

**Modal de contacto en viewer:**
Archivo: `components/ContactModal.tsx`

```typescript
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function ContactModal({ terrenoId, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        terrenoId,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      alert('¡Mensaje enviado! El propietario te contactará pronto.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Solicitar Información</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <input
            type="tel"
            placeholder="Teléfono"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />

          <textarea
            placeholder="Mensaje (opcional)"
            rows={3}
            className="w-full px-3 py-2 border rounded"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
          >
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Botón flotante en viewer:**
Archivo: `app/terreno/[id]/PhotoSphereViewer.js`

```javascript
const [showContactModal, setShowContactModal] = useState(false);

return (
  <div className="relative w-full h-screen">
    <div ref={viewerRef} className="w-full h-full" />

    {/* Botón flotante de contacto */}
    <button
      onClick={() => setShowContactModal(true)}
      className="fixed bottom-6 right-6 bg-teal-500 text-white px-6 py-3
                 rounded-full shadow-lg hover:bg-teal-600 transition-all
                 hover:scale-105 flex items-center gap-2 z-40"
    >
      💬 Contactar
    </button>

    {showContactModal && (
      <ContactModal terrenoId={id} onClose={() => setShowContactModal(false)} />
    )}
  </div>
);
```

**Tabla de leads:**

```sql
CREATE TABLE contact_leads (
  id SERIAL PRIMARY KEY,
  terreno_id UUID REFERENCES terrenos(id),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new' -- new|contacted|qualified|closed
);

CREATE INDEX idx_leads_terreno ON contact_leads(terreno_id);
CREATE INDEX idx_leads_status ON contact_leads(status);
```

#### Tareas

- [ ] Crear tabla `contact_leads`
- [ ] Verificar API `/api/contact` funciona
- [ ] Crear componente `ContactModal.tsx`
- [ ] Agregar botón flotante en PhotoSphereViewer
- [ ] Email al propietario cuando recibe lead
- [ ] Email de confirmación al prospecto
- [ ] Dashboard para ver leads en `/dashboard/leads`
- [ ] Notificación en tiempo real (webhook a Google Chat)

**Tiempo:** 3 días
**Impacto:** 🔥 CRÍTICO - Motor de monetización del marketplace

---

### SPRINT 3.3: Sharing y Viralidad (Día 21-22)

#### Sistema de Compartir Avanzado

**Componente de sharing:**
Archivo: `components/ShareButton.tsx`

```typescript
import { Share2, Facebook, Twitter, WhatsApp, QrCode } from 'lucide-react';

export function ShareButton({ terrenoId, title }) {
  const url = `https://potentiamx.com/terreno/${terrenoId}`;

  const shareToSocial = (platform) => {
    const urls = {
      facebook: `https://facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      whatsapp: `https://wa.me/?text=${title} ${url}`
    };
    window.open(urls[platform], '_blank');
  };

  const generateQR = async () => {
    const qrCode = await QRCode.toDataURL(url);
    // Mostrar modal con QR code
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => shareToSocial('facebook')} className="...">
        <Facebook size={20} />
      </button>
      <button onClick={() => shareToSocial('twitter')} className="...">
        <Twitter size={20} />
      </button>
      <button onClick={() => shareToSocial('whatsapp')} className="...">
        <WhatsApp size={20} />
      </button>
      <button onClick={generateQR} className="...">
        <QrCode size={20} />
      </button>
    </div>
  );
}
```

**Open Graph meta tags:**
Archivo: `app/terreno/[id]/page.js`

```javascript
export async function generateMetadata({ params }) {
  const terreno = await getTerreno(params.id);

  return {
    title: `${terreno.title} - Tour Virtual 360° | PotentiaMX`,
    description:
      terreno.description ||
      `Explora este ${terreno.property_type} con tour virtual 360°`,
    openGraph: {
      title: terreno.title,
      description: terreno.description,
      images: [terreno.image_urls[0]],
      url: `https://potentiamx.com/terreno/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: terreno.title,
      description: terreno.description,
      images: [terreno.image_urls[0]],
    },
  };
}
```

#### Tareas

- [ ] Instalar `qrcode.react` package
- [ ] Crear componente `ShareButton.tsx`
- [ ] Agregar Open Graph meta tags
- [ ] Implementar generación de QR codes
- [ ] Agregar tracking de compartidos (analytics)
- [ ] UTM params automáticos para tracking origen
- [ ] Botón share en viewer y dashboard

**Tiempo:** 2 días
**Beneficio:** Crecimiento viral + tracking de fuentes

---

**RESULTADO FASE 3:**
✅ Analytics básicos funcionando
✅ Sistema de leads operativo
✅ Sharing viral implementado
✅ Tracking de origen de visitas
✅ Dashboard de métricas para propietarios

**Impacto en monetización:** CRÍTICO 🔥
**Conversión esperada:** 5-8% visita → lead

---

## 💰 FASE 4: MONETIZACIÓN (SEMANA 6-8 - 15 DÍAS)

**Objetivo:** Sistema de planes + Stripe + upgrade flows

### SPRINT 4.1: Sistema de Planes (Día 23-30)

#### Estructura de Planes

| Plan         | Precio MXN/mes | Tours | Marketplace | Comisión | Features                     |
| ------------ | -------------- | ----- | ----------- | -------- | ---------------------------- |
| **FREE**     | $0             | 2     | 1 prop.     | 5%       | Marca agua                   |
| **STARTER**  | $580           | 10    | Ilimitado   | 4%       | Sin marca agua + Leads       |
| **PRO**      | $1,580         | 30    | Ilimitado   | 3.5%     | Analytics + 1 sesión/mes     |
| **BUSINESS** | $3,980         | ∞     | Ilimitado   | 3%       | White-label + 2 sesiones/mes |

#### Base de Datos

```sql
ALTER TABLE user_profiles ADD COLUMN subscription_plan VARCHAR(50) DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'active';
ALTER TABLE user_profiles ADD COLUMN stripe_customer_id VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN stripe_subscription_id VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN subscription_expires_at TIMESTAMP;

-- Índices
CREATE INDEX idx_profiles_plan ON user_profiles(subscription_plan);
CREATE INDEX idx_profiles_stripe_customer ON user_profiles(stripe_customer_id);
```

#### Middleware de Validación

Archivo: `middleware.ts` (actualizar)

```typescript
export async function middleware(request) {
  const user = await getUser(request);

  // Validar límites según plan
  if (request.nextUrl.pathname === '/dashboard/add-terrain') {
    const terrenosCount = await getUserTerrenosCount(user.id);
    const limits = {
      free: 2,
      starter: 10,
      pro: 30,
      business: Infinity,
    };

    if (terrenosCount >= limits[user.plan]) {
      return NextResponse.redirect('/dashboard/upgrade?reason=limit');
    }
  }

  // Validar marca de agua
  if (request.nextUrl.pathname.startsWith('/terreno/')) {
    const terreno = await getTerreno(request.params.id);
    const owner = await getUser(terreno.user_id);

    request.headers.set(
      'X-Show-Watermark',
      owner.plan === 'free' ? 'true' : 'false',
    );
  }

  return NextResponse.next();
}
```

#### Página de Pricing

Archivo: `app/pricing/page.tsx`

```typescript
const plans = [
  {
    name: 'FREE',
    price: 0,
    features: [
      '2 tours activos',
      'Editor completo',
      '1 propiedad en marketplace',
      'Marca de agua',
      'Soporte por email'
    ],
    cta: 'Empezar Gratis'
  },
  {
    name: 'STARTER',
    price: 580,
    popular: false,
    features: [
      '10 tours activos',
      'Sin marca de agua',
      'Captura de leads',
      'Marketplace ilimitado',
      'Analytics básicos',
      '1 sesión captura cada 3 meses'
    ],
    cta: 'Comenzar Prueba'
  },
  {
    name: 'PRO',
    price: 1580,
    popular: true,
    features: [
      '30 tours activos',
      'Analytics con sugerencias IA',
      'Branding personalizado',
      '1 sesión captura mensual',
      'Soporte prioritario',
      'Comisión reducida 3.5%'
    ],
    cta: 'Probar 14 Días Gratis'
  },
  {
    name: 'BUSINESS',
    price: 3980,
    features: [
      'Tours ilimitados',
      'White-label completo',
      '2 sesiones captura mensuales',
      'Soporte dedicado',
      'Comisión mínima 3%',
      'Integraciones CRM'
    ],
    cta: 'Contactar Ventas'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          Planes y Precios
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Ahorra hasta 78% vs competencia tradicional
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {plans.map(plan => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        {/* Calculadora de ahorro */}
        <SavingsCalculator />
      </div>
    </div>
  );
}
```

#### Integración Stripe

Archivo: `app/api/create-checkout/route.ts`

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const { priceId, userId } = await request.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?upgrade=cancelled`,
    client_reference_id: userId,
    metadata: { userId },
  });

  return Response.json({ url: session.url });
}
```

Archivo: `app/api/webhooks/stripe/route.ts`

```typescript
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;
  }

  return Response.json({ received: true });
}
```

#### Tareas SPRINT 4.1

- [ ] Actualizar schema de `user_profiles`
- [ ] Crear middleware de validación de límites
- [ ] Implementar página `/pricing`
- [ ] Crear componente `SavingsCalculator`
- [ ] Configurar cuenta Stripe
- [ ] Crear 4 productos en Stripe (FREE, STARTER, PRO, BUSINESS)
- [ ] Implementar `/api/create-checkout`
- [ ] Implementar `/api/webhooks/stripe`
- [ ] Testing de flujo completo de upgrade
- [ ] Crear página `/dashboard/subscription` (gestionar plan)
- [ ] Emails transaccionales (bienvenida, upgrade, cancelación)
- [ ] Dashboard admin para ver MRR

**Tiempo:** 8 días (64 horas)
**Complejidad:** Alta
**Impacto:** 🔥 CRÍTICO - Monetización principal

---

### SPRINT 4.2: Marca de Agua y Límites (Día 31-33)

#### Watermark para Plan FREE

Archivo: `app/terreno/[id]/PhotoSphereViewer.js`

```javascript
useEffect(() => {
  if (showWatermark) {
    const watermark = document.createElement('div');
    watermark.className =
      'fixed bottom-4 right-4 bg-white bg-opacity-90 px-4 py-2 rounded shadow-lg z-50';
    watermark.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-700">Powered by</span>
        <a href="https://potentiamx.com" target="_blank" class="font-bold text-teal-600">
          PotentiaMX
        </a>
      </div>
    `;
    document.body.appendChild(watermark);

    return () => watermark.remove();
  }
}, [showWatermark]);
```

#### Validación de Límites UI

```typescript
// En dashboard al intentar crear tour
if (userToursCount >= planLimits[userPlan]) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="font-bold text-yellow-800 mb-2">
        ¡Alcanzaste el límite de tu plan!
      </h3>
      <p className="text-yellow-700 mb-4">
        Tienes {userToursCount} tours activos.
        Tu plan {userPlan.toUpperCase()} permite máximo {planLimits[userPlan]}.
      </p>
      <button
        onClick={() => router.push('/pricing')}
        className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
      >
        Ver Planes y Precios
      </button>
    </div>
  );
}
```

#### Tareas

- [ ] Implementar watermark en viewer (solo FREE)
- [ ] Validación de límites en frontend
- [ ] Mensajes claros de upgrade
- [ ] Calculadora de ahorro integrada en modal de límite
- [ ] Testing exhaustivo de todos los límites

**Tiempo:** 3 días
**Impacto:** Cumplir promesa de cada plan

---

**RESULTADO FASE 4:**
✅ Sistema completo de planes
✅ Integración Stripe funcionando
✅ Validación de límites activa
✅ Watermark en plan FREE
✅ Flujo de upgrade optimizado

**Impacto:** Monetización activada 💰
**MRR esperado mes 1:** $6,000-10,000 MXN

---

## 🏆 FASE 5: MARKETPLACE AVANZADO (SEMANA 9-11 - 15 DÍAS)

**Objetivo:** Marketplace con comisiones + SEO + contrato legal

### SPRINT 5.1: Sistema de Comisiones (Día 34-38)

#### Base de Datos

```sql
CREATE TABLE marketplace_sales (
  id SERIAL PRIMARY KEY,
  terreno_id UUID REFERENCES terrenos(id),
  seller_id UUID REFERENCES auth.users(id),
  sale_price DECIMAL(12,2) NOT NULL,
  commission_rate DECIMAL(4,3), -- 0.035 = 3.5%
  commission_amount DECIMAL(12,2),
  sale_date DATE,
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_proof_url TEXT,
  escrituras_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_sales_seller ON marketplace_sales(seller_id);
CREATE INDEX idx_sales_status ON marketplace_sales(payment_status);

ALTER TABLE terrenos ADD COLUMN marketplace_terms_accepted BOOLEAN DEFAULT false;
ALTER TABLE terrenos ADD COLUMN marketplace_terms_accepted_at TIMESTAMP;
ALTER TABLE terrenos ADD COLUMN marketplace_terms_version VARCHAR(10);
```

#### Flujo de "Marcar como Vendida"

Archivo: `app/dashboard/mark-sold/[id]/page.tsx`

```typescript
export default function MarkSoldPage({ params }) {
  const [formData, setFormData] = useState({
    salePrice: '',
    saleDate: '',
    notes: ''
  });

  const handleSubmit = async () => {
    // Calcular comisión según plan del usuario
    const commissionRate = {
      free: 0.05,
      starter: 0.04,
      pro: 0.035,
      business: 0.03
    }[userPlan];

    const commissionAmount = formData.salePrice * commissionRate;

    await supabase.from('marketplace_sales').insert({
      terreno_id: params.id,
      seller_id: user.id,
      sale_price: formData.salePrice,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      sale_date: formData.saleDate,
      notes: formData.notes,
      payment_status: 'pending'
    });

    // Generar factura automática
    await generateInvoice(commissionAmount, user);

    // Email a admin y vendedor
    await sendSaleNotification(user, params.id, commissionAmount);

    router.push('/dashboard?sale=success');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Marcar Propiedad como Vendida</h1>

      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
        <p className="text-blue-800">
          Tu plan <strong>{userPlan.toUpperCase()}</strong> tiene comisión de {commissionRate * 100}%
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Precio Final de Venta (MXN)</label>
          <input
            type="number"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.salePrice}
            onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Fecha de Cierre</label>
          <input
            type="date"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.saleDate}
            onChange={(e) => setFormData({...formData, saleDate: e.target.value})}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Subir Escrituras (opcional)</label>
          <input type="file" accept=".pdf" />
        </div>

        {formData.salePrice && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800 font-medium">
              Comisión PotentiaMX: ${(formData.salePrice * commissionRate).toLocaleString('es-MX')} MXN
            </p>
            <p className="text-green-700 text-sm mt-1">
              Pago a realizar en 30 días
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-3 rounded hover:bg-teal-600"
        >
          Confirmar Venta
        </button>
      </form>
    </div>
  );
}
```

#### Dashboard Admin - Ventas Pendientes

Archivo: `app/admin/sales/page.tsx`

```typescript
export default async function AdminSalesPage() {
  const { data: sales } = await supabase
    .from('marketplace_sales')
    .select(`
      *,
      terreno:terrenos(*),
      seller:user_profiles(*)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ventas del Marketplace</h1>

      <div className="grid gap-6">
        {sales.map(sale => (
          <div key={sale.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{sale.terreno.title}</h3>
                <p className="text-gray-600">Vendedor: {sale.seller.email}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${
                sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                sale.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {sale.payment_status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Precio Venta</p>
                <p className="font-bold">${sale.sale_price.toLocaleString('es-MX')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Comisión ({sale.commission_rate * 100}%)</p>
                <p className="font-bold text-teal-600">
                  ${sale.commission_amount.toLocaleString('es-MX')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha Cierre</p>
                <p className="font-bold">{new Date(sale.sale_date).toLocaleDateString('es-MX')}</p>
              </div>
            </div>

            {sale.payment_status === 'pending' && (
              <button
                onClick={() => markAsPaid(sale.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Marcar como Pagado
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Tareas

- [ ] Crear tabla `marketplace_sales`
- [ ] Implementar página "Marcar como vendida"
- [ ] Cálculo automático de comisión según plan
- [ ] Generación de facturas automáticas (PDF)
- [ ] Dashboard admin para gestionar ventas
- [ ] Emails de notificación (vendedor + admin)
- [ ] Recordatorios automáticos de pago (día 15, 25, 30)
- [ ] Sistema de upload de comprobantes de pago
- [ ] Validación anti-fraude básica

**Tiempo:** 5 días
**Impacto:** 🔥 CRÍTICO - Segunda fuente de ingresos

---

### SPRINT 5.2: Contrato Legal Marketplace (Día 39-41)

#### Modal de Términos

Archivo: `components/MarketplaceTermsModal.tsx`

```typescript
export function MarketplaceTermsModal({ onAccept, onReject }) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Términos y Condiciones del Marketplace</h2>
        </div>

        <div
          className="flex-1 overflow-y-auto p-6"
          onScroll={(e) => {
            const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
            if (bottom) setScrolledToBottom(true);
          }}
        >
          <div className="prose max-w-none">
            <h3>1. Comisión por Venta</h3>
            <p>
              Al publicar tu propiedad en el Marketplace de PotentiaMX, aceptas pagar una comisión
              calculada sobre el precio final de venta según tu plan de suscripción:
            </p>
            <ul>
              <li><strong>Plan FREE:</strong> 5% del precio de venta</li>
              <li><strong>Plan STARTER:</strong> 4% del precio de venta</li>
              <li><strong>Plan PRO:</strong> 3.5% del precio de venta</li>
              <li><strong>Plan BUSINESS:</strong> 3% del precio de venta</li>
            </ul>

            <h3>2. Obligaciones del Vendedor</h3>
            <ul>
              <li>Proporcionar información veraz y actualizada de la propiedad</li>
              <li>Contar con documentación legal en regla (escrituras, predial)</li>
              <li>Notificar a PotentiaMX cuando la propiedad sea vendida</li>
              <li>Pagar la comisión acordada dentro de los 30 días posteriores al cierre</li>
            </ul>

            <h3>3. Obligaciones de PotentiaMX</h3>
            <ul>
              <li>Promocionar tu propiedad en el marketplace público</li>
              <li>Proporcionar herramientas de tour virtual 360°</li>
              <li>Enviar leads calificados de compradores interesados</li>
              <li>Brindar soporte técnico durante la publicación</li>
            </ul>

            <h3>4. Pago de Comisión</h3>
            <p>
              La comisión será pagadera dentro de los 30 días posteriores a la fecha de cierre
              de la venta (firma de escrituras). PotentiaMX generará una factura electrónica
              que será enviada al email registrado.
            </p>

            <h3>5. Verificación de Venta</h3>
            <p>
              Para ventas superiores a $5,000,000 MXN, PotentiaMX podrá solicitar copia de
              las escrituras firmadas para verificar el precio final de venta.
            </p>

            <h3>6. Política de Reembolsos</h3>
            <p>
              No se realizan reembolsos de comisiones una vez pagadas. En caso de cancelación
              de la venta posterior al pago, el vendedor deberá notificar a PotentiaMX dentro
              de 15 días para evaluar el caso.
            </p>

            <h3>7. Resolución de Disputas</h3>
            <p>
              Cualquier disputa será resuelta mediante mediación en primera instancia.
              Si no se llega a un acuerdo, se someterá a jurisdicción en [Ciudad], México.
            </p>

            <h3>8. Modificación de Términos</h3>
            <p>
              PotentiaMX se reserva el derecho de modificar estos términos con notificación
              previa de 30 días. La versión actual es v1.0, fecha: 19 de Octubre, 2025.
            </p>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          {!scrolledToBottom && (
            <p className="text-orange-600 text-sm mb-4">
              ⬇️ Debes leer todo el documento para continuar
            </p>
          )}

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              disabled={!scrolledToBottom}
              className="w-4 h-4"
            />
            <span className="text-sm">
              He leído y acepto los términos y condiciones del Marketplace
            </span>
          </label>

          <div className="flex gap-4">
            <button
              onClick={onReject}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={() => accepted && onAccept()}
              disabled={!accepted}
              className="flex-1 bg-teal-500 text-white py-2 rounded hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Aceptar y Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Integración en Edit Terrain

```typescript
// En app/dashboard/edit-terrain/[id]/page.js

const handleMarketplaceToggle = async (value) => {
  if (value && !terreno.marketplace_terms_accepted) {
    setShowTermsModal(true);
  } else {
    // Actualizar directamente
    await updateMarketplaceStatus(value);
  }
};

const handleAcceptTerms = async () => {
  await supabase
    .from('terrenos')
    .update({
      marketplace_enabled: true,
      marketplace_terms_accepted: true,
      marketplace_terms_accepted_at: new Date().toISOString(),
      marketplace_terms_version: '1.0',
    })
    .eq('id', terrenoId);

  setShowTermsModal(false);
};
```

#### Tareas

- [ ] Redactar contrato legal completo (consultar abogado)
- [ ] Crear componente `MarketplaceTermsModal.tsx`
- [ ] Actualizar schema con campos de aceptación
- [ ] Integrar modal en flujo de publicación
- [ ] Scroll-to-accept obligatorio
- [ ] Guardar versión de términos aceptada
- [ ] Email de confirmación al aceptar términos
- [ ] Almacenar PDF de términos en Drive

**Tiempo:** 3 días
**Impacto:** Protección legal CRÍTICA

---

### SPRINT 5.3: SEO Marketplace (Día 42-45)

#### Optimizaciones SEO

**1. Meta Tags Dinámicos**

```typescript
// app/propiedades/page.tsx
export const metadata = {
  title: 'Propiedades en Venta con Tour Virtual 360° | PotentiaMX',
  description:
    'Explora casas, departamentos y terrenos en venta con tours virtuales 360°. Encuentra tu próxima inversión inmobiliaria.',
  keywords:
    'propiedades, venta, tour virtual, 360, inmobiliaria, terrenos, casas',
  openGraph: {
    title: 'Marketplace de Propiedades 360° | PotentiaMX',
    description:
      'Descubre propiedades con tecnología de tours virtuales inmersivos',
    images: ['/og-marketplace.jpg'],
  },
};

// app/terreno/[id]/page.tsx - Meta tags por propiedad
export async function generateMetadata({ params }) {
  const terreno = await getTerreno(params.id);

  return {
    title: `${terreno.title} - ${terreno.property_type} en venta | ${terreno.price} MXN`,
    description: `${terreno.description.substring(0, 160)}...`,
    keywords: `${terreno.property_type}, ${terreno.location}, venta, tour 360`,
    openGraph: {
      title: terreno.title,
      description: terreno.description,
      images: [terreno.image_urls[0]],
      type: 'website',
      url: `https://potentiamx.com/terreno/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: terreno.title,
      description: terreno.description,
      images: [terreno.image_urls[0]],
    },
  };
}
```

**2. Schema Markup (Rich Snippets)**

```typescript
// app/terreno/[id]/page.tsx
export default function TerrenoPage({ terreno }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": terreno.title,
    "description": terreno.description,
    "price": terreno.price,
    "priceCurrency": "MXN",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": terreno.city,
      "addressRegion": terreno.state,
      "addressCountry": "MX"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": terreno.latitude,
      "longitude": terreno.longitude
    },
    "image": terreno.image_urls,
    "virtualTour": `https://potentiamx.com/terreno/${terreno.id}`,
    "datePosted": terreno.created_at,
    "availableFrom": terreno.created_at,
    "offers": {
      "@type": "Offer",
      "price": terreno.price,
      "priceCurrency": "MXN",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {/* Resto del componente */}
    </>
  );
}
```

**3. Sitemap Dinámico**

Archivo: `app/sitemap.ts`

```typescript
export default async function sitemap() {
  const { data: terrenos } = await supabase
    .from('terrenos')
    .select('id, updated_at')
    .eq('marketplace_enabled', true)
    .eq('marketplace_status', 'approved');

  const terrenoUrls = terrenos.map((terreno) => ({
    url: `https://potentiamx.com/terreno/${terreno.id}`,
    lastModified: terreno.updated_at,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [
    {
      url: 'https://potentiamx.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://potentiamx.com/propiedades',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    ...terrenoUrls,
  ];
}
```

**4. robots.txt**

Archivo: `app/robots.ts`

```typescript
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/', '/api/'],
    },
    sitemap: 'https://potentiamx.com/sitemap.xml',
  };
}
```

#### Tareas

- [ ] Agregar meta tags dinámicos a todas las páginas
- [ ] Implementar Schema.org markup
- [ ] Generar sitemap dinámico
- [ ] Configurar robots.txt
- [ ] Crear Google Search Console account
- [ ] Submit sitemap a Google
- [ ] Crear archivo `manifest.json` (PWA)
- [ ] Optimizar imágenes (WebP)
- [ ] Implementar lazy loading
- [ ] Verificar Core Web Vitals (Lighthouse)

**Tiempo:** 4 días
**Impacto:** Tráfico orgánico (5,000+ visitas/mes en 6 meses)

---

**RESULTADO FASE 5:**
✅ Sistema completo de comisiones
✅ Contrato legal implementado
✅ SEO optimizado para Google
✅ Marketplace listo para escalar
✅ Protección legal en todas las transacciones

**Impacto:** Segunda fuente de ingresos activada 💰
**Comisiones esperadas mes 3:** $200,000-500,000 MXN

---

## 🤖 FASE 6: ANALYTICS IA (SEMANA 12-14 - 15 DÍAS)

**Objetivo:** Diferenciador único - Sugerencias tipo Airbnb

### SPRINT 6.1: Heatmaps de Interacción (Día 46-50)

#### Recolección de Datos de Interacción

```sql
CREATE TABLE heatmap_data (
  id SERIAL PRIMARY KEY,
  terreno_id UUID REFERENCES terrenos(id),
  panorama_index INTEGER,
  yaw_position FLOAT,
  pitch_position FLOAT,
  dwell_time_seconds INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_heatmap_terreno ON heatmap_data(terreno_id);
```

#### Tracking de Miradas

```javascript
// app/terreno/[id]/PhotoSphereViewer.js

useEffect(() => {
  if (!viewer) return;

  let lastPosition = null;
  let positionStartTime = Date.now();

  const trackPosition = () => {
    const position = viewer.getPosition();
    const currentTime = Date.now();

    // Si cambió significativamente la posición, guardar anterior
    if (lastPosition && hasMovedSignificantly(lastPosition, position)) {
      const dwellTime = Math.floor((currentTime - positionStartTime) / 1000);

      if (dwellTime > 1) { // Solo si miró más de 1 segundo
        await supabase.from('heatmap_data').insert({
          terreno_id: terrenoId,
          panorama_index: currentIndex,
          yaw_position: lastPosition.yaw,
          pitch_position: lastPosition.pitch,
          dwell_time_seconds: dwellTime
        });
      }

      positionStartTime = currentTime;
    }

    lastPosition = position;
  };

  // Trackear cada 500ms
  const interval = setInterval(trackPosition, 500);

  return () => clearInterval(interval);
}, [viewer, currentIndex]);
```

#### Visualización de Heatmap

```typescript
// app/dashboard/analytics/[id]/heatmap.tsx

export function HeatmapViewer({ terrenoId }) {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    async function loadHeatmap() {
      const { data } = await supabase
        .from('heatmap_data')
        .select('*')
        .eq('terreno_id', terrenoId)
        .eq('panorama_index', currentPanorama);

      // Agrupar por coordenadas y sumar dwell_time
      const grouped = groupByCoordinates(data);
      setHeatmapData(grouped);
    }
    loadHeatmap();
  }, [currentPanorama]);

  // Renderizar puntos calientes sobre el viewer
  return (
    <div className="relative">
      <PhotoSphereViewer />
      <svg className="absolute inset-0 pointer-events-none">
        {heatmapData.map(point => (
          <circle
            key={point.id}
            cx={yawToX(point.yaw)}
            cy={pitchToY(point.pitch)}
            r={Math.min(point.total_dwell / 10, 50)}
            fill="rgba(255, 0, 0, 0.3)"
          />
        ))}
      </svg>
    </div>
  );
}
```

#### Tareas

- [ ] Crear tabla `heatmap_data`
- [ ] Implementar tracking de posición en viewer
- [ ] Agrupar datos por coordenadas
- [ ] Crear visualización de heatmap
- [ ] Dashboard de analytics con heatmap
- [ ] Optimizar queries (agregación en DB)

**Tiempo:** 5 días
**Impacto:** Insights únicos para vendedores

---

### SPRINT 6.2: Sugerencias Automáticas (Día 51-55)

#### Motor de Sugerencias con Reglas

```typescript
// lib/suggestionsEngine.ts

export async function generateSuggestions(terrenoId: string) {
  const analytics = await getAnalytics(terrenoId);
  const suggestions = [];

  // Regla 1: Tasa de abandono alta
  if (analytics.abandonRate > 60%) {
    const problemPanorama = findHighestAbandonPanorama(analytics);
    suggestions.push({
      type: 'warning',
      priority: 'high',
      title: 'Alta tasa de abandono detectada',
      description: `${analytics.abandonRate}% de visitantes abandonan en Vista ${problemPanorama.index}`,
      action: 'Considera mejorar la iluminación o cambiar el ángulo de esta vista',
      icon: '⚠️'
    });
  }

  // Regla 2: Hotspot popular
  const popularHotspots = analytics.hotspots.filter(h => h.clickRate > 80%);
  popularHotspots.forEach(hotspot => {
    suggestions.push({
      type: 'success',
      priority: 'medium',
      title: `Hotspot "${hotspot.title}" es muy popular`,
      description: `${hotspot.clickRate}% de visitantes hacen click aquí`,
      action: 'Destaca más esta característica en la descripción de la propiedad',
      icon: '🎯'
    });
  });

  // Regla 3: Duración baja
  if (analytics.avgDuration < 30) {
    suggestions.push({
      type: 'info',
      priority: 'medium',
      title: 'Duración promedio baja',
      description: `Visitantes pasan solo ${analytics.avgDuration} segundos`,
      action: 'Agrega descripciones más atractivas o audio narrado',
      icon: '⏱️'
    });
  }

  // Regla 4: Comparación con benchmarks
  const avgMarket = await getMarketAverage(analytics.propertyType);
  if (analytics.conversionRate < avgMarket.conversionRate * 0.7) {
    suggestions.push({
      type: 'warning',
      priority: 'high',
      title: 'Conversión por debajo del mercado',
      description: `Tu conversión (${analytics.conversionRate}%) vs promedio (${avgMarket.conversionRate}%)`,
      action: 'Tours similares con video obtienen 35% más conversión. Considera agregar video',
      icon: '📊',
      cta: {
        text: 'Agendar Sesión con Video',
        link: '/dashboard/book-session'
      }
    });
  }

  // Regla 5: Primera vista con baja atención
  if (analytics.panoramas[0].avgDwell < 5) {
    suggestions.push({
      type: 'warning',
      priority: 'high',
      title: 'Primera impresión débil',
      description: 'La vista de entrada tiene poca retención',
      action: 'Considera usar una toma aérea como primera vista',
      icon: '🚁'
    });
  }

  return suggestions.sort((a, b) =>
    priorityScore[b.priority] - priorityScore[a.priority]
  );
}
```

#### Dashboard de Sugerencias

```typescript
// app/dashboard/analytics/[id]/page.tsx

export default function AnalyticsPage({ params }) {
  const [suggestions, setSuggestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getAnalytics(params.id);
      const sug = await generateSuggestions(params.id);
      setAnalytics(data);
      setSuggestions(sug);
    }
    load();
  }, [params.id]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics y Sugerencias</h1>

      {/* Métricas principales */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Visitas Totales"
          value={analytics.totalVisits}
          change="+12% vs semana pasada"
          icon="👁️"
        />
        <MetricCard
          title="Conversión a Lead"
          value={`${analytics.conversionRate}%`}
          change="+2.3% vs promedio"
          icon="📈"
        />
        <MetricCard
          title="Duración Promedio"
          value={`${analytics.avgDuration}s`}
          change="-5s vs semana pasada"
          icon="⏱️"
        />
        <MetricCard
          title="Tasa de Completado"
          value={`${analytics.completionRate}%`}
          change="+8% vs promedio"
          icon="✅"
        />
      </div>

      {/* Sugerencias */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">🤖 Sugerencias de Optimización</h2>

        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>¡Todo se ve bien! No hay sugerencias por el momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className={`border-l-4 p-4 rounded ${
                  suggestion.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  suggestion.type === 'success' ? 'border-green-500 bg-green-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{suggestion.title}</h3>
                    <p className="text-gray-700 mb-2">{suggestion.description}</p>
                    <p className="text-sm text-gray-600 italic">
                      💡 {suggestion.action}
                    </p>
                    {suggestion.cta && (
                      <button className="mt-3 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                        {suggestion.cta.text}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Mapa de Calor - Dónde Miran</h2>
        <HeatmapViewer terrenoId={params.id} />
      </div>
    </div>
  );
}
```

#### Tareas

- [ ] Implementar motor de sugerencias (`lib/suggestionsEngine.ts`)
- [ ] Crear 10+ reglas de análisis
- [ ] Calcular benchmarks de mercado
- [ ] Crear UI de sugerencias
- [ ] Implementar scoring de prioridad
- [ ] Email semanal con sugerencias
- [ ] A/B testing de efectividad de sugerencias

**Tiempo:** 5 días
**Impacto:** 🔥 DIFERENCIADOR ÚNICO

---

### SPRINT 6.3: Exportar Reportes (Día 56-60)

#### Generación de PDFs

```typescript
// lib/reportGenerator.ts
import { jsPDF } from 'jspdf';

export async function generateReport(terrenoId: string, period: string) {
  const analytics = await getAnalytics(terrenoId, period);
  const suggestions = await generateSuggestions(terrenoId);

  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('Reporte de Analytics - PotentiaMX', 20, 20);

  // Métricas principales
  doc.setFontSize(14);
  doc.text('Métricas Principales', 20, 40);
  doc.setFontSize(10);
  doc.text(`Visitas totales: ${analytics.totalVisits}`, 20, 50);
  doc.text(`Conversión: ${analytics.conversionRate}%`, 20, 60);
  doc.text(`Duración promedio: ${analytics.avgDuration}s`, 20, 70);

  // Gráfica
  const chartImage = await generateChartImage(analytics);
  doc.addImage(chartImage, 'PNG', 20, 90, 170, 80);

  // Sugerencias
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Sugerencias de Optimización', 20, 20);
  doc.setFontSize(10);

  suggestions.forEach((sug, idx) => {
    const y = 40 + idx * 30;
    doc.text(`${sug.icon} ${sug.title}`, 20, y);
    doc.text(sug.description, 20, y + 5);
    doc.text(`Acción: ${sug.action}`, 20, y + 10);
  });

  return doc.output('blob');
}
```

#### Botón de Exportar

```typescript
// En dashboard de analytics

const handleExport = async (format: 'pdf' | 'csv') => {
  if (format === 'pdf') {
    const blob = await generateReport(terrenoId, '30days');
    downloadBlob(blob, `reporte-${terrenoId}.pdf`);
  } else {
    const csv = await generateCSV(analytics);
    downloadBlob(csv, `datos-${terrenoId}.csv`);
  }
};

<div className="flex gap-2">
  <button onClick={() => handleExport('pdf')}>
    📄 Exportar PDF
  </button>
  <button onClick={() => handleExport('csv')}>
    📊 Exportar CSV
  </button>
</div>
```

#### Tareas

- [ ] Instalar `jspdf` y `html2canvas`
- [ ] Implementar generación de reportes PDF
- [ ] Exportación a CSV
- [ ] Gráficas embebidas en PDF (Recharts → imagen)
- [ ] Email automático semanal con reporte adjunto
- [ ] Personalización de períodos (7/30/90 días)

**Tiempo:** 5 días
**Beneficio:** Valor agregado para clientes premium

---

**RESULTADO FASE 6:**
✅ Heatmaps de interacción funcionando
✅ Motor de sugerencias automáticas
✅ Reportes exportables (PDF/CSV)
✅ Email semanal con insights
✅ Diferenciador único vs competencia

**Impacto:** Razón #1 para elegir PotentiaMX sobre competencia 🏆

---

## 🎨 FASE 7: PREMIUM FEATURES (SEMANA 15-18 - 20 DÍAS)

**Objetivo:** Features que justifican planes PRO y BUSINESS

### Features a Implementar

1. **Personalización de Branding** (Plan PRO+)
   - Logo personalizado
   - Colores de marca
   - WhatsApp custom
   - Eliminar watermark

2. **Audio de Fondo** (Plan PRO+)
   - Biblioteca de sonidos ambientales
   - Upload de audio custom
   - Control de volumen

3. **Videos Incrustados** (Plan BUSINESS)
   - Hotspots tipo "video"
   - Modal con reproductor
   - Lazy loading

4. **Tour Guiado Automático** (Plan PRO+)
   - Auto-play mode
   - Timer configurable
   - Modo presentación

5. **Multi-idioma** (Plan BUSINESS)
   - Español, Inglés, Portugués
   - Detección automática
   - Switch manual

**Tiempo estimado:** 20 días
**Prioridad:** Media (después de monetización básica)

---

## 📋 RESUMEN EJECUTIVO Y PRÓXIMOS PASOS

### Estado Actual del Proyecto

✅ **MVP Básico:** 85% completado
✅ **Infraestructura:** Supabase + Next.js estable
✅ **Recursos:** $5,000 créditos Google Cloud disponibles

### Roadmap Total

| Fase                       | Duración  | Impacto          | Inversión       |
| -------------------------- | --------- | ---------------- | --------------- |
| 0. Critical Fixes          | 3-4 horas | 🔴 Crítico       | $0              |
| 1. Google Workspace        | 5 días    | Alto             | $40/mes         |
| 2. Soporte IA + Quick Wins | 10 días   | Muy Alto         | $0 (créditos)   |
| 3. Analytics + Leads       | 10 días   | 🔥 Crítico       | $0              |
| 4. Monetización (Stripe)   | 15 días   | 🔥 Crítico       | 2.9% + $0.30/tx |
| 5. Marketplace Avanzado    | 15 días   | Muy Alto         | $0              |
| 6. Analytics IA            | 15 días   | 🏆 Diferenciador | $50-100/mes     |
| 7. Premium Features        | 20 días   | Medio            | $0              |

**Total tiempo estimado:** 12-14 semanas
**Inversión mensual:** ~$100-150 USD
**ROI esperado mes 3:** $20,000-40,000 MXN MRR

---

## 🎯 PLAN DE ACCIÓN INMEDIATO

### Esta Semana (Próximos 7 días)

**HOY (4 horas):**

1. ✅ Agregar "Olvidé mi contraseña"
2. ✅ Corregir límite plan FREE
3. ✅ Sistema de tipos de propiedad

**Mañana-Día 3:** 4. Configurar Google Workspace 5. Crear emails profesionales 6. Diseñar firma HTML

**Día 4-7:** 7. CRM en Google Sheets 8. Calendar con appointment slots 9. Automatizaciones Zapier básicas

### Próximas 2 Semanas

**Semana 2:**

- Implementar chat IA con Vertex AI
- Quick wins UX
- Sistema de embedding

**Semana 3:**

- Analytics básicos
- Formulario de leads
- Sistema de compartir

### Mes 2-3

**Mes 2:**

- Sistema completo de planes
- Integración Stripe
- Validación de límites

**Mes 3:**

- Marketplace con comisiones
- Contrato legal
- SEO optimizado

---

## 💡 MÉTRICAS DE ÉXITO

### KPIs Principales

**Métricas de Producto:**

- Usuarios registrados: 100 (mes 1) → 500 (mes 3)
- Conversión FREE → PAID: 10%
- Tasa de retención: >80%
- NPS Score: >50

**Métricas de Negocio:**

- MRR: $6K (mes 1) → $50K (mes 3)
- Comisiones marketplace: $0 (mes 1) → $300K (mes 3)
- CAC: <$50 USD
- LTV: >$2,000 USD

**Métricas de Soporte:**

- Tiempo respuesta chat IA: <10 segundos
- Resolución automática: >70%
- Satisfacción soporte: >4.5/5
- Tickets manuales: -70%

**Métricas de Marketing:**

- Tráfico orgánico: 5,000 visitas/mes (mes 6)
- Conversión landing: 8-12%
- Leads marketplace: 250-400/mes
- Share rate: >15%

---

## 🔄 ITERACIÓN Y FEEDBACK

### Ciclo de Mejora Continua

**Cada semana:**

1. Revisar analytics de uso
2. Analizar feedback de usuarios
3. Priorizar siguiente sprint
4. Ajustar roadmap si necesario

**Cada mes:**

1. Revisar MRR y comisiones
2. Analizar churn rate
3. Entrevistas a usuarios
4. Roadmap review con stakeholders

**Cada trimestre:**

1. Análisis competitivo
2. Ajuste de precios si necesario
3. Nuevas features basadas en demanda
4. Plan de expansión

---

## ✅ CHECKLIST DE LANZAMIENTO

### Pre-Launch (Antes de abrir al público)

- [ ] Todas las features críticas (Fase 0) completadas
- [ ] Emails profesionales @potentiamx.com activos
- [ ] Chat IA funcionando 24/7
- [ ] Sistema de planes configurado en Stripe
- [ ] Contrato legal del marketplace revisado por abogado
- [ ] SEO básico implementado
- [ ] Analytics funcionando
- [ ] Testing completo en mobile y desktop
- [ ] Página /pricing lista
- [ ] Landing page actualizada
- [ ] Google Search Console configurado
- [ ] Backup automático configurado
- [ ] Monitoring y alertas (Uptime Robot)

### Post-Launch (Primera semana)

- [ ] Monitor 24/7 de errores
- [ ] Responder todos los tickets <2 horas
- [ ] Analizar comportamiento de primeros usuarios
- [ ] Ajustar chat IA basado en preguntas reales
- [ ] Primera campaña de email marketing
- [ ] Contactar 50 agencias inmobiliarias
- [ ] Publicar en redes sociales
- [ ] Primer reporte de métricas

---

## 📞 CONTACTO Y SOPORTE

**Email principal:** hola@potentiamx.com
**Soporte técnico:** soporte@potentiamx.com
**Ventas:** ventas@potentiamx.com

**Documentación:** [potentiamx.com/docs](https://potentiamx.com/docs)
**Status página:** [status.potentiamx.com](https://status.potentiamx.com)

---

**🚀 LISTO PARA DESPEGAR**

Este roadmap integra:
✅ La infraestructura profesional de Google Workspace
✅ El soporte inteligente 24/7 con IA
✅ El sistema de monetización completo
✅ El diferenciador único de analytics con sugerencias

**Siguiente acción:** Completar Fase 0 (Critical Fixes) HOY mismo.

Después de eso, el camino está trazado semana por semana hacia un producto que:

- Genera ingresos recurrentes (SaaS)
- Captura comisiones del marketplace
- Se diferencia con IA y analytics
- Opera con costos mínimos
- Escala sin fricción

**¿Empezamos?** 🚀
