# 🔍 Investigación: Openpay - Pasarela de Pagos México 2024/2025

## 📋 Resumen Ejecutivo

**Openpay** es la pasarela de pago de PayNet (propiedad de BBVA), con origen argentino operando en México desde 2020. Cuenta con más de 6,000 usuarios activos y es una de las pasarelas más sólidas en cuanto a respaldo financiero.

**Recomendación**: ✅ **Buena opción para tu caso de uso** (tours virtuales inmobiliarios)
- Comisiones competitivas
- Respaldo de BBVA (seguridad financiera)
- Fácil integración con Next.js
- Sin costos fijos mensuales

---

## ✅ VENTAJAS (PROS)

### 💰 1. **Sin Costos Fijos**
- ❌ **NO** renta mensual
- ❌ **NO** cargos ocultos
- ❌ **NO** costos de integración
- ❌ **NO** comisiones de configuración
- ✅ Solo pagas por transacción exitosa

**Ideal para**: Negocios pequeños/medianos que están empezando.

---

### 🔒 2. **Seguridad Avanzada**
- Motor antifraude con **+10 años de experiencia**
- **Certificación PCI DSS** (Payment Card Industry Data Security Standard)
- **Tokenización de tarjetas** (no guardas datos sensibles)
- Procesos de **KYC** (Know Your Customer)
- Respaldo de **BBVA** (uno de los bancos más grandes)

**Importante**: Cumple con estándares internacionales de seguridad.

---

### 💳 3. **Múltiples Métodos de Pago**
Acepta:
- Tarjetas de crédito/débito (Visa, MasterCard, American Express)
- Pagos en efectivo (OXXO, 7-Eleven, etc.)
- Transferencias bancarias (SPEI)
- Pagos en tiendas físicas

**Ventaja**: Tus clientes pueden pagar como prefieran.

---

### 🛠️ 4. **Facilidad de Implementación**
- **Integración simple**: Solo agregas un código JavaScript
- Librería **Openpay.js** para tokenización
- APIs REST bien documentadas
- Soporte para Node.js (compatible con Next.js)
- Dashboard intuitivo

**Código básico**:
```javascript
// Agregar script
<script src="https://js.openpay.mx/openpay.v1.min.js"></script>

// Inicializar
OpenPay.setId('merchant_id');
OpenPay.setApiKey('public_key');
OpenPay.setSandboxMode(true); // o false en producción
```

---

### 📊 5. **Escalabilidad**
- Funciona para **PYMEs** y **grandes empresas**
- Cobertura **nacional** en México
- Funcionalidades avanzadas disponibles
- Usado por empresas reconocidas

---

### ⏱️ 6. **Disponibilidad del Dinero**
- Depósitos en **48 horas** (2 días hábiles)
- Mejor que Stripe (7 días)
- Similar a Conekta (2 días)

---

## ❌ DESVENTAJAS (CONTRAS)

### 💸 1. **Comisiones por Volumen**
**Problema**: Las comisiones se acumulan con alto volumen de ventas.

**Ejemplo**:
- 100 transacciones de $1,000 MXN = $100,000 MXN
- Comisión: 2.9% + $2.50 = $2,900 + $250 = **$3,150 MXN**
- Con 1,000 transacciones: **$31,500 MXN en comisiones**

**Impacto**: Para negocios con muchas ventas pequeñas, las comisiones fijas ($2.50) pesan más.

---

### ⏳ 2. **Retención de Fondos**
**Problema**: No es inmediato.

- Openpay retiene tu dinero
- Deposita **una vez a la semana** (cada 7 días)
- No puedes disponer del dinero al instante

**Comparación**:
- **Openpay**: Semanal
- **Conekta/Stripe**: Cada 2 días (más rápido)
- **MercadoPago**: Inmediato (pero comisiones más altas)

**Impacto**: Si necesitas liquidez inmediata, puede ser un problema.

---

### 📝 3. **Requisitos de Registro**
**Problema**: Solo para personas fiscales en México.

**Debes tener**:
- RFC activo (persona física o moral)
- Cuenta bancaria mexicana
- Comprobante de domicilio
- Identificación oficial

**No aplica para**:
- Extranjeros sin RFC
- Vendedores informales
- Negocios no registrados

---

### 🐛 4. **Problemas de Integración con React/Next.js**
**Problema conocido**: Issues documentados en GitHub.

**Errores comunes**:
- `OpenPay is not defined`
- Dependencia de jQuery (obsoleto en 2024)
- Problemas al cargar scripts en React

**Solución**: Usar `useEffect` o `next/script` para cargar la librería.

**Ejemplo**:
```javascript
// Next.js approach
import Script from 'next/script';

export default function PaymentPage() {
  return (
    <>
      <Script
        src="https://js.openpay.mx/openpay.v1.min.js"
        onLoad={() => {
          OpenPay.setId('merchant_id');
          OpenPay.setApiKey('public_key');
        }}
      />
      {/* Tu formulario de pago */}
    </>
  );
}
```

---

### 🇲🇽 5. **Solo México**
**Limitación geográfica**:
- Solo opera en México
- No puedes recibir pagos internacionales
- Si planeas expandirte a otros países: necesitarás otra pasarela

**Alternativas para internacional**:
- Stripe (global)
- PayPal (global)

---

### 📞 6. **Soporte Técnico Limitado**
**Horarios**:
- Lunes a Viernes: 8:00 - 20:00 hrs
- Sábado: 8:00 - 17:00 hrs
- Domingo: ❌ **No hay soporte**

**Canales**:
- Teléfono: (55) 97 55 35 59
- Email: soporte@openpay.mx
- Chat en Dashboard (horario limitado)

**Problema**: Si tienes un problema urgente en domingo o fuera de horario, tendrás que esperar.

---

### ⚠️ 7. **Problemas Conocidos**
Según la investigación:
- **Contracargos (chargebacks)**: México tiene alta tasa
- **3D Secure**: Problemas reportados con autenticación
- **Rechazos de transacción**: Algunos bancos rechazan sin explicación clara
- **Actualizaciones TLS**: Requiere TLS 1.2 (servidores antiguos no funcionan)

---

## 💰 COMPARACIÓN DE COMISIONES

| Pasarela | Visa/MasterCard | OXXO (Efectivo) | AMEX | SPEI | Depósitos |
|----------|----------------|-----------------|------|------|-----------|
| **Openpay** | 2.9% + $2.50 | 3.5% + $2.50 | 4.5% + $2.50 | $8.00 | 48h |
| **Conekta** | 2.9% + $2.50 | 3.7% | 4.5% + $2.50 | $12.50 | 48h |
| **Stripe** | 3.6% + $3.00 | ❌ No soporta | 3.6% + $3.00 | ❌ No soporta | 7 días |
| **MercadoPago** | 4.99% + $3.00 | 3.99% | 4.99% + $3.00 | ✅ Gratis | Inmediato |

**Ganador en comisiones**: 🏆 **Openpay y Conekta (empate)**

---

## 🔧 INTEGRACIÓN TÉCNICA

### Librerías Disponibles

**Cliente (Frontend)**:
- JavaScript (Openpay.js)
- Android SDK
- iOS SDK

**Servidor (Backend)**:
- Node.js ✅ (perfecto para Next.js API routes)
- PHP
- Python
- Ruby
- Java
- .NET

### Ejemplo de Flujo de Integración

```javascript
// 1. Frontend: Tokenizar tarjeta (sin pasar por tu servidor)
const tokenData = {
  card_number: '4111111111111111',
  holder_name: 'Juan Pérez',
  expiration_year: '25',
  expiration_month: '12',
  cvv2: '123'
};

OpenPay.token.create(tokenData,
  function(response) {
    const token = response.data.id;
    // 2. Enviar token a tu backend
    fetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify({ token, amount: 1000 })
    });
  },
  function(error) {
    console.error('Error:', error);
  }
);

// 3. Backend (Next.js API route): Procesar pago
// pages/api/payment.js
import Openpay from 'openpay';

export default async function handler(req, res) {
  const openpay = new Openpay('merchant_id', 'private_key');

  try {
    const charge = await openpay.charges.create({
      method: 'card',
      source_id: req.body.token,
      amount: req.body.amount,
      description: 'Tour virtual - Terreno X',
      customer: { ... }
    });

    res.status(200).json({ success: true, charge });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

---

## 🎯 CASOS DE USO IDEALES

### ✅ **Bueno para:**

1. **Negocios pequeños/medianos en México**
   - Sin presupuesto para rentas mensuales
   - Ventas esporádicas o estacionales

2. **E-commerce con ticket promedio medio/alto**
   - $500 - $10,000 MXN por venta
   - La comisión fija ($2.50) pesa menos

3. **Necesitas múltiples métodos de pago**
   - Clientes que pagan en OXXO
   - Transferencias bancarias
   - Tarjetas internacionales

4. **Requieres seguridad y respaldo**
   - BBVA detrás
   - Certificaciones internacionales

5. **Tu caso: Tours virtuales inmobiliarios** ✅
   - Ticket promedio alto ($500 - $5,000+)
   - Clientes empresariales (pagan con tarjeta/transferencia)
   - No necesitas pagos internacionales
   - Seguridad importante (sector inmobiliario)

---

### ❌ **NO recomendado para:**

1. **Micropagos (menos de $50 MXN)**
   - Comisión fija $2.50 es muy alta (5%+)

2. **Negocio internacional**
   - Solo México, necesitarías Stripe/PayPal

3. **Necesitas el dinero al instante**
   - Deposita semanalmente (7 días)

4. **Volumen MUY alto (miles de transacciones/mes)**
   - Comisiones se acumulan
   - Considera negociar comisiones especiales

---

## 🚨 CONSIDERACIONES IMPORTANTES

### 1. **Contracargos (Chargebacks)**
México tiene **alta tasa de contracargos**.

**Protégete**:
- Guarda evidencia de cada transacción
- Confirma entregas con firma
- Implementa 3D Secure
- Responde rápido a disputas

---

### 2. **3D Secure (Autenticación adicional)**
**Qué es**: El banco pide al cliente una contraseña adicional.

**Ventajas**:
- ✅ Reduce fraudes
- ✅ Transfiere responsabilidad al banco

**Desventajas**:
- ❌ Algunos clientes abandonan la compra
- ❌ Experiencia menos fluida

**Recomendación**: Actívalo para ventas >$1,000 MXN.

---

### 3. **Ambiente Sandbox**
Openpay tiene **ambiente de pruebas** (sandbox):
- Puedes hacer pruebas sin gastar dinero real
- Tarjetas de prueba disponibles
- Simula pagos en OXXO, rechazos, etc.

**Siempre prueba antes de producción**.

---

### 4. **PCI Compliance**
Openpay es **PCI DSS Compliant**, pero **tú también debes serlo**.

**Reglas básicas**:
- ❌ **NUNCA** guardes CVV
- ❌ **NUNCA** guardes números de tarjeta completos
- ✅ Usa tokenización
- ✅ Usa HTTPS (SSL)
- ✅ Cifra datos sensibles

---

## 📊 ANÁLISIS FINAL: ¿CONVIENE PARA TU PROYECTO?

### Tu Contexto: LandView App (Tours Virtuales Inmobiliarios)

**Características de tu negocio**:
- Ticket promedio: Probablemente $500 - $5,000 MXN
- Clientes: Agencias inmobiliarias, desarrolladores
- Volumen: Bajo/Medio al inicio
- Geográfico: Solo México
- Necesitas: Seguridad, profesionalismo, métodos variados

---

### ✅ **PROS para tu caso:**

1. **Comisiones competitivas** (2.9% + $2.50)
   - Con ticket de $1,000: Solo $31.50 de comisión
   - Con ticket de $5,000: Solo $147.50 de comisión

2. **Sin costos fijos** 💰
   - Perfecto para empezar sin riesgo
   - Si no vendes, no pagas

3. **Respaldo de BBVA** 🏦
   - Genera confianza con clientes corporativos
   - Seguridad de primer nivel

4. **Múltiples métodos de pago**
   - Tarjetas (corporativas, personales)
   - Transferencias (empresas)
   - Efectivo (clientes sin tarjeta)

5. **Integración con Next.js** ✅
   - Ya usas Next.js 15
   - Librería Node.js disponible
   - API REST bien documentada

---

### ❌ **CONTRAS para tu caso:**

1. **Depósitos semanales**
   - Si necesitas el dinero rápido: problema
   - Si puedes esperar 7 días: no importa

2. **Solo México**
   - Si planeas expandirte a USA/LATAM: limitación
   - Si solo México: no importa

3. **Integración React tiene issues conocidos**
   - Solucionable con `next/script`
   - Requiere configuración adicional

---

## 🎯 RECOMENDACIÓN FINAL

### Para LandView App: ✅ **SÍ, OPENPAY ES UNA BUENA OPCIÓN**

**Razones**:
1. ✅ Ticket promedio justifica las comisiones
2. ✅ Sin costos fijos (perfecto para MVP)
3. ✅ Respaldo BBVA (profesionalismo)
4. ✅ Compatible con Next.js
5. ✅ Solo necesitas México

---

### 📋 PLAN DE IMPLEMENTACIÓN RECOMENDADO

#### **FASE 1: Configuración (1-2 días)**
1. Registro en Openpay
   - Crear cuenta con RFC
   - Verificar identidad
   - Obtener API keys (sandbox + producción)

2. Configurar Dashboard
   - Agregar cuenta bancaria
   - Configurar webhook notifications
   - Activar 3D Secure (opcional)

---

#### **FASE 2: Desarrollo (3-5 días)**
1. **Backend** (Next.js API Routes)
   ```bash
   npm install openpay
   ```
   - Crear endpoints: `/api/payment/create`, `/api/payment/verify`
   - Implementar webhook handler
   - Guardar transacciones en Supabase

2. **Frontend** (React Components)
   - Componente de formulario de pago
   - Tokenización con Openpay.js
   - Manejo de errores
   - Feedback visual (loading, success, error)

3. **Base de Datos** (Supabase)
   - Tabla `transactions`
   - Tabla `payment_methods` (tarjetas tokenizadas)
   - Políticas RLS (Row Level Security)

---

#### **FASE 3: Testing (2-3 días)**
1. Pruebas en Sandbox
   - Pagos exitosos
   - Pagos rechazados
   - Tarjetas inválidas
   - Webhooks
   - 3D Secure

2. Pruebas de seguridad
   - Validación de datos
   - Protección CSRF
   - Rate limiting

---

#### **FASE 4: Producción (1 día)**
1. Switch a API keys de producción
2. Configurar webhooks en producción
3. Monitoreo de transacciones
4. Documentación para usuarios

---

## 🔗 RECURSOS ÚTILES

### Documentación Oficial
- **API Docs**: https://documents.openpay.mx/
- **Node.js Reference**: https://documents.openpay.mx/en/api-reference-node-js
- **Openpay.js**: https://documents.openpay.mx/en/docs/openpay-js.html
- **GitHub**: https://github.com/open-pay/openpay-js

### Soporte
- **Teléfono**: (55) 97 55 35 59
- **Email**: soporte@openpay.mx
- **Portal de ayuda**: https://sdeskopenpay.service-now.com/ayuda_mx
- **Horario**: Lun-Vie 8:00-20:00, Sáb 8:00-17:00

### Testing
- **Tarjetas de prueba**: https://documents.openpay.mx/en/docs/testing.html
- **Dashboard Sandbox**: https://sandbox-dashboard.openpay.mx/

---

## 💡 ALTERNATIVAS A CONSIDERAR

Si Openpay no te convence, estas son buenas alternativas:

### **Conekta** (Muy similar)
- ✅ Mismo precio: 2.9% + $2.50
- ✅ Depósitos en 2 días (más rápido)
- ✅ Mejor documentación para React
- ❌ Sin respaldo bancario (startup independiente)

### **Stripe** (Internacional)
- ✅ Documentación excelente
- ✅ Integraciones con todo
- ✅ Expansión internacional fácil
- ❌ Más caro: 3.6% + $3.00
- ❌ Depósitos en 7 días

### **MercadoPago** (Más rápido)
- ✅ Depósitos inmediatos
- ✅ Reconocimiento de marca
- ✅ App móvil
- ❌ Comisiones MUY altas: 4.99%

---

## 📈 PROYECCIÓN DE COSTOS (Ejemplo)

Supongamos que vendes **50 tours/mes** a **$1,500 MXN** cada uno:

**Ingresos mensuales**: $75,000 MXN

**Costos Openpay**:
- Comisión: 2.9% = $2,175
- Fijo: 50 x $2.50 = $125
- **Total**: $2,300 MXN/mes (3.07% efectivo)

**Comparación**:
- **Conekta**: $2,300 (igual)
- **Stripe**: $2,850 (24% más caro)
- **MercadoPago**: $3,893 (69% más caro!)

**Ahorro anual con Openpay vs Stripe**: $6,600 MXN
**Ahorro anual con Openpay vs MercadoPago**: $19,116 MXN

---

## ✅ CONCLUSIÓN

**Openpay es una excelente opción para LandView App** por:

1. ✅ Costos competitivos sin rentas
2. ✅ Respaldo financiero de BBVA
3. ✅ Facilidad de integración con Next.js
4. ✅ Múltiples métodos de pago
5. ✅ Enfoque en México (tu mercado)

**Único contra significativo**: Depósitos semanales (pero puedes vivir con eso).

---

## 🚀 SIGUIENTE PASO RECOMENDADO

**ACCIÓN INMEDIATA**:

1. **Crear cuenta en Openpay** (modo sandbox)
2. **Hacer pruebas con API** (1-2 horas)
3. **Implementar prototipo de pago** (1 día)
4. **Decidir si conviene** basado en experiencia real

**Si te gusta → Pasa a producción**
**Si no te gusta → Prueba Conekta (muy similar)**

---

**Fecha de investigación**: Diciembre 2024
**Fuentes**: Documentación oficial Openpay, comparativas de pasarelas México 2024/2025, comunidad de desarrolladores

---

¿Necesitas ayuda implementando Openpay en tu proyecto Next.js? Puedo ayudarte con el código de integración.
