# 📧 Sistema de Contacto Condicional - Potentia

## 🎯 Concepto

Sistema flexible de contacto que se adapta al tipo de propiedad:

- **Terrenos de desarrollo** (formal) → Formulario de email para capturar leads profesionales
- **Propiedades residenciales** (casual) → WhatsApp para contacto inmediato
- **Híbrido** (both) → Ambas opciones disponibles

## 📁 Archivos Creados/Modificados

### 1. Migración SQL

📄 `sql_migrations/add_contact_configuration.sql`

Agrega 3 campos nuevos a la tabla `terrenos`:

- `contact_type` (ENUM): 'formal', 'casual', 'both'
- `contact_email` (TEXT): Email donde llegan las solicitudes
- `contact_phone` (TEXT): Número de WhatsApp

### 2. Componente de Formulario

📄 `components/ContactFormModal.js`

Modal profesional con:

- Campos: Nombre*, Email*, Teléfono, Mensaje
- Validación de formulario
- Estados de éxito/error
- Animaciones suaves
- Diseño responsivo

### 3. API Route

📄 `app/api/contact/route.js`

Endpoint para procesar solicitudes:

- POST `/api/contact`
- Log de leads en consola
- TODO: Integrar con Resend/SendGrid para envío real

### 4. Visor Público

📄 `app/terreno/[id]/PhotoSphereViewer.js`

Integración condicional de métodos de contacto:

- Botones flotantes adaptables
- Opciones en panel de información
- Lógica condicional basada en `contact_type`

## 🚀 Cómo Usar

### Paso 1: Ejecutar Migración en Supabase

```sql
-- Copiar y pegar en Supabase SQL Editor

DO $$ BEGIN
    CREATE TYPE contact_type_enum AS ENUM ('formal', 'casual', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS contact_type contact_type_enum DEFAULT 'casual',
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

COMMENT ON COLUMN terrenos.contact_type IS 'Tipo de contacto: formal (formulario email), casual (WhatsApp), both (ambos)';
COMMENT ON COLUMN terrenos.contact_email IS 'Email donde se recibirán las solicitudes de información (para contact_type formal o both)';
COMMENT ON COLUMN terrenos.contact_phone IS 'Número de WhatsApp para contacto (para contact_type casual o both)';

UPDATE terrenos
SET contact_phone = '5213221234567'
WHERE contact_phone IS NULL;

CREATE INDEX IF NOT EXISTS idx_terrenos_contact_type ON terrenos(contact_type);
```

### Paso 2: Configurar Terrenos

Actualmente los terrenos tienen estos valores por defecto:

- `contact_type`: `'casual'` (WhatsApp)
- `contact_phone`: `'5213221234567'`
- `contact_email`: `null`

**Para terrenos de desarrollo (formal):**

```sql
UPDATE terrenos
SET contact_type = 'formal',
    contact_email = 'ventas@tuempresa.com',
    contact_phone = NULL
WHERE id = 'TU-TERRENO-ID';
```

**Para mostrar ambos:**

```sql
UPDATE terrenos
SET contact_type = 'both',
    contact_email = 'info@tuempresa.com',
    contact_phone = '5213221234567'
WHERE id = 'TU-TERRENO-ID';
```

### Paso 3: Integrar Email Real (Opcional)

El sistema actualmente solo registra leads en consola. Para envío real:

**Opción A: Resend (Recomendado)**

```bash
npm install resend
```

```javascript
// En app/api/contact/route.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@potentia.mx',
  to: contactEmail,
  subject: `Nueva solicitud: ${terrenoTitle}`,
  html: `...`,
});
```

**Opción B: SendGrid**

```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

## 📊 Comportamiento según `contact_type`

| contact_type | Botón Flotante | Panel Información | Uso Recomendado                     |
| ------------ | -------------- | ----------------- | ----------------------------------- |
| `formal`     | 📧 Formulario  | 📧 Formulario     | Terrenos de desarrollo, inversiones |
| `casual`     | 💬 WhatsApp    | 💬 WhatsApp       | Propiedades residenciales           |
| `both`       | 📧 + 💬 Ambos  | 📧 + 💬 Ambos     | Propiedades versátiles              |

## 🎨 Diseño Visual

### Formulario (contact_type: formal)

- Botón flotante teal/cyan gradient
- Modal elegante con degradado
- Campos con validación inline
- Confirmación visual (✅ ¡Mensaje Enviado!)

### WhatsApp (contact_type: casual)

- Botón flotante verde WhatsApp (#25D366)
- Link directo con mensaje pre-llenado
- Experiencia inmediata

### Ambos (contact_type: both)

- Dos botones flotantes lado a lado
- WhatsApp a la derecha del formulario
- Usuario elige su método preferido

## 🔧 Estado de Implementación

**Sistema 100% Funcional:**

1. ✅ Migración SQL ejecutada (add_contact_configuration.sql)
2. ✅ Tabla de leads creada (create_leads_table.sql)
3. ✅ Formularios de agregar/editar terreno actualizados
4. ✅ Servicio de email con Resend integrado
5. ✅ Guardado de leads en base de datos funcionando
6. ✅ API route completa con validaciones

**Para usar el sistema, ver:** `SETUP_CONTACT_SYSTEM.md`

## 💡 Ejemplo de Uso Real

```javascript
// Terreno de desarrollo en Guadalajara
{
  id: "abc-123",
  title: "Terreno Comercial 5000m²",
  contact_type: "formal",
  contact_email: "desarrollo@inmobiliaria.com",
  contact_phone: null
}
// → Muestra solo formulario de email

// Casa en venta
{
  id: "xyz-789",
  title: "Casa 3 Recámaras Zona Centro",
  contact_type: "casual",
  contact_email: null,
  contact_phone: "5213221234567"
}
// → Muestra solo botón de WhatsApp

// Lote mixto
{
  id: "mix-456",
  title: "Lote Residencial/Comercial",
  contact_type: "both",
  contact_email: "info@potentia.mx",
  contact_phone: "5213221234567"
}
// → Muestra ambas opciones
```

## 📈 Ventajas del Sistema

✅ **Escalable**: Se adapta al tipo de propiedad
✅ **Profesional**: Formularios formales para inversionistas
✅ **Inmediato**: WhatsApp para compradores individuales
✅ **Flexible**: Opción híbrida para máxima conversión
✅ **Minimalista**: No abruma al usuario con opciones innecesarias
✅ **Mobile-First**: Funciona perfecto en todos los dispositivos

---

🎉 **Sistema implementado y listo para usar!**
