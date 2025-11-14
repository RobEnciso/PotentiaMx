# 📋 SISTEMA LEGAL COMPLETO - POTENTIAMX

**Fecha de implementación:** 13 de Noviembre, 2025
**Última actualización:** 13 de Noviembre, 2025

---

## ✅ ARCHIVOS CREADOS

### 📄 Documentos Legales Base (Markdown)

Ubicación: Raíz del proyecto

1. **`PRIVACY_POLICY.md`** - Aviso de Privacidad completo
   - Cumple con LFPDPPP (Ley Federal de Protección de Datos Personales)
   - Incluye derechos ARCO
   - Detalla transferencias de datos a terceros

2. **`TERMS_OF_SERVICE.md`** - Términos y Condiciones de Uso
   - Define responsabilidades del usuario y PotentiaMX
   - Incluye política de reembolsos y garantías
   - Legislación aplicable y jurisdicción

3. **`COOKIES_POLICY.md`** - Política de Cookies
   - Tipos de cookies utilizadas
   - Gestión de consentimiento
   - Enlaces a opt-out de terceros

---

### 🌐 Páginas Web (Next.js)

Ubicación: `app/legal/`

1. **`app/legal/privacidad/page.tsx`** - Página de Aviso de Privacidad
   - URL: `/legal/privacidad`
   - Diseño profesional con navegación lateral
   - Tablas de proveedores de servicios
   - Secciones con iconos y colores

2. **`app/legal/terminos/page.tsx`** - Página de Términos y Condiciones
   - URL: `/legal/terminos`
   - Tabla de planes y precios
   - Secciones de uso aceptable y prohibiciones
   - Enlaces a PROFECO

3. **`app/legal/cookies/page.tsx`** - Página de Política de Cookies
   - URL: `/legal/cookies`
   - Tablas de cookies por tipo
   - Instrucciones de configuración por navegador
   - Enlaces a políticas de terceros

---

### 🧩 Componentes React

Ubicación: `components/`

1. **`components/legal/LegalLayout.tsx`** - Layout compartido para páginas legales
   - Header con logo de PotentiaMX
   - Sidebar con navegación entre documentos legales
   - Card de contacto
   - Footer con datos fiscales
   - Diseño responsivo

2. **`components/CookieConsent.tsx`** - Banner de consentimiento de cookies
   - Vista simple con 3 botones (Personalizar, Rechazar, Aceptar)
   - Vista detallada con toggles por tipo de cookie
   - Almacena preferencias en localStorage
   - Integración con Google Analytics consent mode
   - Diseño responsive y accesible

3. **`components/Footer.tsx`** - Footer global con enlaces legales
   - Enlaces a páginas legales
   - Botón "Configuración de Cookies"
   - Datos de contacto y fiscales
   - Badges de seguridad (SSL, LFPDPPP, Pagos seguros)

---

## 🚀 INTEGRACIÓN EN EL PROYECTO

### Layout Principal Actualizado

**Archivo modificado:** `app/layout.tsx`

```tsx
import CookieConsent from '@/components/CookieConsent';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <CookieConsent /> {/* ← Banner de cookies añadido */}
      </body>
    </html>
  );
}
```

---

## 📋 CÓMO USAR ESTOS DOCUMENTOS

### 1. Agregar Footer a tus páginas

En cualquier página donde quieras mostrar el footer con enlaces legales:

```tsx
import Footer from '@/components/Footer';

export default function MyPage() {
  return (
    <div>
      {/* Tu contenido */}
      <Footer />
    </div>
  );
}
```

### 2. Personalizar el banner de cookies

El banner se muestra automáticamente en todas las páginas. Las preferencias se guardan en `localStorage`:

- `cookieConsent` - Preferencias del usuario (JSON)
- `cookieConsentDate` - Fecha de consentimiento

Para resetear el consentimiento (útil para testing):

```javascript
localStorage.removeItem('cookieConsent');
localStorage.removeItem('cookieConsentDate');
window.location.reload();
```

### 3. Integrar Google Analytics con consentimiento

El componente `CookieConsent` ya incluye integración con Google Analytics Consent Mode v2.

Agregar en `app/layout.tsx` (dentro de `<head>`):

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    // Consent mode por defecto (negado)
    gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });

    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

El componente `CookieConsent` actualizará automáticamente el consent cuando el usuario acepte.

---

## 🎨 PERSONALIZACIÓN

### Cambiar colores del tema

Los componentes usan Tailwind CSS con colores teal/cyan. Para cambiar:

**LegalLayout.tsx:**

```tsx
// Busca clases como:
className = 'text-teal-600'; // → text-blue-600
className = 'from-teal-600 to-cyan-600'; // → from-blue-600 to-indigo-600
```

**CookieConsent.tsx:**

```tsx
// Busca:
className = 'bg-gradient-to-r from-teal-600 to-cyan-600';
// Cambia a tus colores de marca
```

### Agregar/Quitar cookies

Editar `CookieConsent.tsx` → type `CookiePreferences`:

```tsx
type CookiePreferences = {
  essential: boolean; // Siempre true
  analytics: boolean;
  marketing: boolean;
  // Agregar más categorías:
  functional?: boolean;
  social_media?: boolean;
};
```

Luego agregar el toggle en la vista de configuración.

---

## ⚖️ CUMPLIMIENTO LEGAL

### Leyes que cumple este sistema:

✅ **LFPDPPP (México)** - Ley Federal de Protección de Datos Personales en Posesión de Particulares

- Aviso de Privacidad completo
- Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)
- Consentimiento expreso para finalidades secundarias

✅ **GDPR (Unión Europea)** - Si tienes usuarios europeos

- Consentimiento granular por tipo de cookie
- Derecho al olvido
- Portabilidad de datos

✅ **CCPA (California)** - Si tienes usuarios de California

- Derecho a saber qué datos se recopilan
- Derecho a eliminar datos

✅ **Ley Federal de Protección al Consumidor (PROFECO)**

- Información clara sobre servicios
- Política de devoluciones
- Datos fiscales completos

---

## 📞 INFORMACIÓN DE CONTACTO INCLUIDA

Todos los documentos incluyen:

```
Responsable: José Roberto Enciso Sánchez
Nombre Comercial: PotentiaMX
RFC: EISR870806JHA
Domicilio: Pimpinela 521, Col. Palmar del Progreso,
           Puerto Vallarta, Jalisco, México
Teléfono: +52 322 355 0795
Email: legal@potentiamx.com
Email alternativo: hola@potentiamx.com
Web: https://potentiamx.com
```

---

## 🔄 ACTUALIZACIONES FUTURAS

### Cuándo actualizar estos documentos:

1. **Cambios en servicios de terceros**
   - Agregar/quitar procesadores de pago
   - Cambiar proveedores de analytics
   - Nuevos servicios de marketing

2. **Nuevas funcionalidades**
   - Integración con CRM (Salesforce, HubSpot)
   - Nuevas cookies o tracking
   - Cambios en modelo de negocio

3. **Cambios legales**
   - Modificaciones a LFPDPPP
   - Nuevas regulaciones aplicables

### Cómo actualizar:

1. Editar archivos Markdown en raíz del proyecto
2. Actualizar páginas TSX en `app/legal/`
3. Modificar fecha "Última actualización" en todos los documentos
4. Notificar a usuarios por email si es cambio sustancial

---

## 🛡️ SEGURIDAD Y MEJORES PRÁCTICAS

### Datos sensibles

❌ **NUNCA almacenar en cookies:**

- Contraseñas
- Datos de tarjetas de crédito completos
- Información médica
- Datos de menores de edad

✅ **OK para cookies:**

- Tokens de sesión (encriptados)
- Preferencias de usuario
- Analytics anónimos
- IDs de sesión

### Cookies de terceros

Todos los proveedores listados son servicios reputados:

- Supabase (Backend)
- OpenPay/Stripe (Pagos)
- Resend (Emails)
- Netlify (Hosting)
- Google Analytics (Opcional)

**Importante:** Actualizar la tabla de proveedores si cambias alguno.

---

## 📊 MÉTRICAS Y ANALYTICS

### Rastrear aceptación de cookies

Agregar evento de analytics cuando el usuario acepta:

```tsx
// En CookieConsent.tsx → handleAcceptAll()
if (window.gtag) {
  window.gtag('event', 'cookie_consent', {
    event_category: 'consent',
    event_label: 'accepted_all',
  });
}
```

### Dashboards recomendados

- **Google Analytics:** Tasa de aceptación de cookies
- **Hotjar:** Grabaciones de interacción con banner
- **Supabase Analytics:** Visitas a páginas legales

---

## 🚨 IMPORTANTE - REVISAR ANTES DE LANZAR

### Checklist previo al lanzamiento:

- [ ] Verificar que todos los datos de contacto son correctos
- [ ] Confirmar que RFC es válido
- [ ] Probar banner de cookies en móvil y escritorio
- [ ] Verificar enlaces a políticas de terceros
- [ ] Configurar Google Analytics consent mode
- [ ] Revisar que las URLs `/legal/*` funcionan
- [ ] Hacer backup de documentos legales
- [ ] Enviar documentos a tu abogado para revisión final (RECOMENDADO)

---

## 🤝 SOPORTE LEGAL PROFESIONAL

**⚠️ IMPORTANTE:**

Estos documentos son una base sólida, pero **NO sustituyen asesoría legal profesional**.

**Recomendamos encarecidamente:**

1. Contratar un abogado especializado en derecho digital/tecnología
2. Revisar documentos antes de lanzar al público
3. Actualizar anualmente o cuando cambien leyes aplicables
4. Contratar seguro de responsabilidad civil

**Recursos útiles:**

- INAI (Instituto Nacional de Transparencia): https://home.inai.org.mx/
- PROFECO: https://www.gob.mx/profeco
- Barra Mexicana de Abogados: https://www.bma.org.mx/

---

## 📝 HISTORIAL DE CAMBIOS

### Versión 1.0 (13 de Noviembre, 2025)

- ✅ Creación inicial de todos los documentos legales
- ✅ Implementación de banner de cookies
- ✅ Páginas web con diseño profesional
- ✅ Footer con enlaces legales
- ✅ Integración con Google Analytics consent mode

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

1. **Configurar Google Analytics** con Consent Mode v2
2. **Agregar Facebook Pixel** (si harás marketing en Facebook/Instagram)
3. **Implementar sistema de newsletters** con doble opt-in
4. **Crear página de configuración de privacidad** en dashboard de usuario
5. **Agregar logs de auditoría** para ejercicio de derechos ARCO
6. **Implementar exportación de datos** para portabilidad (GDPR)

---

## 📚 DOCUMENTACIÓN ADICIONAL

Para más información sobre el proyecto completo, consulta:

- `CLAUDE.md` - Guía general del proyecto
- `ESTRATEGIA_MONETIZACION.md` - Planes y modelo de negocio
- `ROADMAP_INTEGRADO_POTENTIAMX.md` - Hoja de ruta del producto

---

**¿Preguntas o dudas sobre el sistema legal?**

📧 Contacta a: legal@potentiamx.com

---

© 2025 PotentiaMX - Sistema Legal v1.0
