# 🚀 Guía de Configuración: Sistema de Contacto Completo

## ✅ Estado del Sistema

El sistema de contacto está **100% implementado** con las siguientes funcionalidades:

- ✅ Formulario de contacto con validación
- ✅ Botones de WhatsApp condicionales
- ✅ Guardado de leads en base de datos (Supabase)
- ✅ Envío de emails profesionales con Resend
- ✅ Configuración por tipo de propiedad (casual/formal/both)
- ✅ Formularios de agregar/editar terreno con campos de contacto

---

## 📋 Pasos de Configuración

### **Paso 1: Configurar Base de Datos**

Ejecuta la migración SQL en Supabase SQL Editor:

```sql
-- 1. Migración de campos de contacto
-- Copiar de: sql_migrations/add_contact_configuration.sql
```

```sql
-- 2. Migración de tabla de leads
-- Copiar de: sql_migrations/create_leads_table.sql
```

**Verifica que se crearon:**

- Columnas en `terrenos`: `contact_type`, `contact_email`, `contact_phone`
- Tabla nueva: `leads`

---

### **Paso 2: Configurar Resend**

#### 2.1 Crear cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Regístrate (gratis hasta 3,000 emails/mes)
3. Verifica tu email

#### 2.2 Agregar dominio (IMPORTANTE)

1. En Resend, ve a **Domains** → **Add Domain**
2. Agrega tu dominio: `potentiamx.com` (o el que tengas)
3. Copia los registros DNS que Resend te da
4. Agrégalos en tu proveedor de dominio (GoDaddy, Namecheap, etc.)

**Registros DNS necesarios:**

```
Tipo: TXT
Nombre: @
Valor: [valor que Resend te da]

Tipo: CNAME
Nombre: resend._domainkey
Valor: [valor que Resend te da]

Tipo: MX
Nombre: @
Valor: feedback-smtp.us-east-1.amazonses.com
Prioridad: 10
```

4. Espera verificación (5-15 minutos)

#### 2.3 Obtener API Key

1. En Resend, ve a **API Keys**
2. Click **Create API Key**
3. Nombre: "Potentia Production"
4. Permiso: **Full access** (o "Sending access" si solo quieres enviar)
5. Copia la key (empieza con `re_`)

#### 2.4 Agregar a .env.local

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

---

### **Paso 3: Configurar Supabase Service Role**

La API necesita permisos especiales para guardar leads sin autenticación.

1. Ve a Supabase Dashboard
2. **Settings** → **API**
3. Copia el **service_role** key (⚠️ MUY SECRETA)
4. Agrégala a `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:** Nunca subas esta key a GitHub. Ya está en `.gitignore`.

---

### **Paso 4: Variables de Entorno Finales**

Tu archivo `.env.local` debe tener:

```bash
# Supabase (públicas)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role (SECRETA - solo servidor)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend (SECRETA - solo servidor)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

---

### **Paso 5: Configurar Terrenos**

#### Para terrenos de desarrollo (formal):

```sql
UPDATE terrenos
SET contact_type = 'formal',
    contact_email = 'ventas@tuempresa.com',
    contact_phone = NULL
WHERE id = 'tu-terreno-id';
```

#### Para propiedades residenciales (casual):

```sql
UPDATE terrenos
SET contact_type = 'casual',
    contact_email = NULL,
    contact_phone = '5213221234567'
WHERE id = 'tu-terreno-id';
```

#### Para máxima conversión (ambos):

```sql
UPDATE terrenos
SET contact_type = 'both',
    contact_email = 'info@tuempresa.com',
    contact_phone = '5213221234567'
WHERE id = 'tu-terreno-id';
```

---

### **Paso 6: Probar el Sistema**

1. Reinicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

2. Ve a un terreno público: `http://localhost:3000/terreno/[id]`

3. Haz click en el botón de contacto (📧 o 💬)

4. Llena el formulario y envía

5. **Verifica:**
   - ✅ Consola del navegador: No debe haber errores
   - ✅ Terminal de Next.js: Debe mostrar "✅ Lead guardado en BD"
   - ✅ Terminal de Next.js: Debe mostrar "✅ Email enviado exitosamente"
   - ✅ Supabase Dashboard → Table Editor → `leads`: Debe aparecer el lead
   - ✅ Tu email de Google Workspace: Debe llegar el email de Resend

---

## 🎨 Personalizar Emails

Para personalizar el template de email, edita:
`app/api/contact/route.js` líneas 95-184

**Cambios comunes:**

- Logo: Agrega imagen con `<img src="https://tu-dominio.com/logo.png">`
- Colores: Cambia `#14b8a6` por tu color de marca
- Texto del footer: Línea 177-179

---

## 📊 Ver Leads en Supabase

1. Ve a Supabase Dashboard
2. **Table Editor** → `leads`
3. Ahí verás todos los leads con:
   - Nombre, email, teléfono
   - Terreno consultado
   - Mensaje
   - Estado (new, contacted, qualified, converted, lost)
   - Fecha de creación

**Filtrar leads:**

```sql
-- Leads de hoy
SELECT * FROM leads WHERE created_at::date = CURRENT_DATE;

-- Leads por terreno
SELECT * FROM leads WHERE terreno_id = 'tu-terreno-id';

-- Leads sin contactar
SELECT * FROM leads WHERE status = 'new' ORDER BY created_at DESC;
```

---

## 🔍 Solución de Problemas

### ❌ Error: "RESEND_API_KEY no configurada"

- **Solución:** Agrega `RESEND_API_KEY` a `.env.local` y reinicia el servidor

### ❌ Email no llega

- **Causa 1:** Dominio no verificado en Resend
  - **Solución:** Verifica los registros DNS
- **Causa 2:** Email de destino inválido
  - **Solución:** Revisa que `contact_email` sea válido
- **Causa 3:** Email cayó en spam
  - **Solución:** Marca como "No spam" y agrega remitente a contactos

### ❌ Error: "relation 'leads' does not exist"

- **Solución:** Ejecuta la migración `create_leads_table.sql` en Supabase

### ❌ Lead no se guarda en BD

- **Causa:** `SUPABASE_SERVICE_ROLE_KEY` no configurada o inválida
  - **Solución:** Copia la key correcta de Supabase Dashboard

---

## 📈 Próximos Pasos (Roadmap)

### Fase 1: Funcionalidad Básica ✅ (Completado)

- [x] Formulario de contacto
- [x] Guardado en BD
- [x] Envío de emails

### Fase 2: Dashboard de Leads 📋 (Pendiente)

- [ ] Página `/dashboard/leads` para ver todos los leads
- [ ] Filtros por estado, fecha, terreno
- [ ] Marcar leads como contactados/calificados
- [ ] Notas internas por lead

### Fase 3: Automatización 🤖 (Futuro)

- [ ] Email automático de confirmación al prospecto
- [ ] Webhooks para integrar con CRMs externos
- [ ] Automatización de seguimiento (recordatorios)
- [ ] Estadísticas de conversión

### Fase 4: Integraciones CRM 🔗 (Plan Premium)

- [ ] Integración con HubSpot
- [ ] Integración con Salesforce
- [ ] Integración con Zoho CRM
- [ ] Zapier/Make para conectar con cualquier CRM

---

## 💰 Costos Estimados

| Servicio     | Plan Gratis           | Plan Pagado                     | Recomendación              |
| ------------ | --------------------- | ------------------------------- | -------------------------- |
| **Supabase** | 500MB DB, 1GB storage | $25/mes (8GB DB, 100GB storage) | Gratis hasta 50+ terrenos  |
| **Resend**   | 3,000 emails/mes      | $20/mes (50,000 emails)         | Gratis hasta 100 leads/día |
| **Total**    | $0/mes                | $45/mes                         | Empieza gratis             |

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor (terminal de Next.js)
3. Verifica las variables de entorno en `.env.local`
4. Consulta la documentación de [Resend](https://resend.com/docs)

---

🎉 **¡Sistema completamente funcional!**

Ahora puedes capturar leads profesionalmente y tener un histórico completo en tu base de datos.
