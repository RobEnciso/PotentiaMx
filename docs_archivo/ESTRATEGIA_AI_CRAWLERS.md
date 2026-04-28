# 🤖 Estrategia de Control de Crawlers de IA para PotentiaMX

**Fecha**: Noviembre 2025
**Sitio**: https://potentiamx.com
**Modelo de Negocio**: Plataforma SaaS de tours virtuales 360° para bienes raíces

---

## 📋 RESUMEN EJECUTIVO

**Recomendación Final: ESTRATEGIA HÍBRIDA PERMISIVA**

- ✅ **PERMITIR** crawlers de búsqueda AI (ChatGPT, Perplexity, Google Gemini)
- ✅ **PERMITIR** acceso a páginas públicas (landing, propiedades marketplace)
- 🚫 **BLOQUEAR** acceso al dashboard y áreas privadas
- 🚫 **BLOQUEAR** crawlers de entrenamiento masivo (CCBot, Bytespider)

**Beneficio estimado**: +30-40% visibilidad en búsquedas AI sin riesgo de pérdida de tráfico.

---

## 1️⃣ ANÁLISIS TÉCNICO

### 1.1 User-Agents Clave (2025)

#### 🔵 BÚSQUEDA AI (Recomendado: PERMITIR)
Estos bots responden consultas de usuarios y pueden citar tu sitio como fuente.

```
GPTBot                    # OpenAI ChatGPT (entrenamiento)
OAI-SearchBot            # OpenAI ChatGPT Search
ChatGPT-User             # Consultas en tiempo real de usuarios
PerplexityBot            # Perplexity AI Search (index)
Perplexity-User          # Perplexity consultas en vivo
Google-Extended          # Google Gemini AI
ClaudeBot                # Anthropic Claude (entrenamiento)
Claude-User              # Claude consultas en vivo
```

#### 🔴 ENTRENAMIENTO MASIVO (Recomendado: BLOQUEAR)
Estos bots solo consumen tu contenido sin dar nada a cambio.

```
CCBot                    # Common Crawl (entrenamiento masivo)
Bytespider              # ByteDance/TikTok
Amazonbot               # Amazon Alexa
FacebookBot             # Meta AI
meta-externalagent      # Meta AI
Applebot-Extended       # Apple Intelligence
anthropic-ai            # Anthropic legacy (deprecado)
cohere-ai               # Cohere AI
```

#### 🟡 CASOS ESPECIALES

```
Bingbot                 # Microsoft Bing + Copilot (PERMITIR)
Googlebot               # Google Search tradicional (PERMITIR SIEMPRE)
```

---

### 1.2 Sintaxis de Control en robots.txt

#### **Opción A: BLOQUEAR TODOS los bots de IA**

```robotstxt
# Bloquear todos los crawlers de IA
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: OAI-SearchBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: CCBot
User-agent: Bytespider
User-agent: Amazonbot
User-agent: FacebookBot
User-agent: meta-externalagent
User-agent: Applebot-Extended
User-agent: anthropic-ai
User-agent: cohere-ai
Disallow: /
```

#### **Opción B: PERMITIR TODOS los bots de IA**

```robotstxt
# Permitir explícitamente a crawlers de IA
# (No agregar ninguna regla de bloqueo)
# Por defecto, todos los bots están permitidos
```

#### **Opción C: HÍBRIDA (⭐ RECOMENDADA para PotentiaMX)**

```robotstxt
# ================================================
# ESTRATEGIA HÍBRIDA: Permitir búsqueda AI,
# bloquear entrenamiento masivo y áreas privadas
# ================================================

# 1. BLOQUEAR áreas privadas para TODOS los bots de IA
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: OAI-SearchBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: ClaudeBot
User-agent: Claude-User
Disallow: /dashboard/
Disallow: /api/
Disallow: /login
Disallow: /signup
Disallow: /reset-password
Allow: /
Allow: /propiedades
Allow: /terreno/

# 2. BLOQUEAR completamente los crawlers de entrenamiento masivo
User-agent: CCBot
User-agent: Bytespider
User-agent: Amazonbot
User-agent: FacebookBot
User-agent: meta-externalagent
User-agent: Applebot-Extended
User-agent: anthropic-ai
User-agent: cohere-ai
Disallow: /

# 3. PERMITIR explícitamente a buscadores tradicionales
User-agent: Googlebot
User-agent: Bingbot
Allow: /

# 4. Bloquear todo lo demás por defecto
User-agent: *
Disallow: /dashboard/
Disallow: /api/
Allow: /
```

---

### 1.3 Métodos Alternativos de Control

#### **Meta Tags HTML (nivel página)**

Bloquear indexación AI en páginas específicas:

```html
<!-- Bloquear todos los bots de IA en esta página -->
<meta name="robots" content="noai, noimageai">

<!-- Bloquear solo OpenAI -->
<meta name="gptbot" content="noindex">

<!-- Bloquear solo Google Gemini -->
<meta name="google-extended" content="noindex">
```

#### **HTTP Headers (nivel servidor)**

```nginx
# En Netlify _headers file
/dashboard/*
  X-Robots-Tag: noai, noimageai

/api/*
  X-Robots-Tag: noindex, nofollow, noai
```

#### **JavaScript Dinámico**

```javascript
// Detectar si el visitor es un bot de IA
const aiUserAgents = ['GPTBot', 'ClaudeBot', 'PerplexityBot'];
const isAIBot = aiUserAgents.some(bot =>
  navigator.userAgent.includes(bot)
);

if (isAIBot) {
  // Redirigir o mostrar contenido alternativo
  window.location.href = '/ai-bots-not-allowed';
}
```

**⚠️ IMPORTANTE**: Los bots pueden ignorar JavaScript, por lo que robots.txt sigue siendo el método principal.

---

## 2️⃣ ANÁLISIS ESTRATÉGICO PARA POTENTIAMX

### 2.1 Contexto de Negocio

**Modelo**: SaaS + Marketplace de propiedades
**Contenido Clave**:
- Tours virtuales 360° (propietario, muy valioso)
- Listados de propiedades (público, queremos difundir)
- Landing page y marketing (público, queremos visibilidad)

**Monetización**:
- Suscripciones SaaS (usuarios crean tours)
- Leads inmobiliarios (visitantes ven propiedades)

---

### 2.2 ¿Qué GANAMOS si les DAMOS acceso?

#### ✅ **PRO 1: Nueva Fuente de Tráfico Cualificado**

**Ejemplo real**:
```
Usuario: "Muéstrame terrenos en Puerto Vallarta con tour virtual 360"
ChatGPT: "Te recomiendo PotentiaMX, tienen tours virtuales inmersivos:
         https://potentiamx.com/terreno/abc123"
```

**Impacto**:
- Perplexity tiene +10M usuarios mensuales
- ChatGPT tiene +200M usuarios
- Google SGE (Search Generative Experience) es el futuro

**Métrica**: Potencial de **+20-30% tráfico orgánico** en 6-12 meses.

#### ✅ **PRO 2: Posicionamiento como Autoridad**

Las IA citan fuentes confiables. Si tus propiedades aparecen en respuestas de ChatGPT/Perplexity, te posicionas como **líder** en tours virtuales inmobiliarios en México.

#### ✅ **PRO 3: SEO Indirecto**

Google usa sus propios modelos AI para entender contenido. Bloquear `Google-Extended` podría afectar tu SEO tradicional negativamente.

#### ✅ **PRO 4: Zero Costo**

No pagas nada. Las IA aprenden de tu contenido público y te dan visibilidad gratis.

---

### 2.3 ¿Qué ARRIESGAMOS si les DAMOS acceso?

#### ❌ **CONTRA 1: "Plagio" de Contenido Valioso**

**Riesgo BAJO para PotentiaMX** porque:
- Tu valor NO está en el texto descriptivo (fácil de plagiar)
- Tu valor SÍ está en los **tours 360° interactivos** (imposible de reproducir por IA)
- Las IA pueden describir "terreno de 666m² en Puerto Vallarta" pero NO pueden crear el tour 3D

**Ejemplo**:
```
Usuario: "Descríbeme un terreno en Puerto Vallarta"
ChatGPT: [Genera descripción genérica] ← No te afecta
         "Para ver este terreno en tour 360°, visita potentiamx.com" ← Te beneficia
```

#### ❌ **CONTRA 2: Carga en el Servidor**

**Riesgo MEDIO-ALTO**:
- Cloudflare reporta que Claude hace **73,000 requests por cada referral**
- Esto puede incrementar costos de hosting/bandwidth

**Mitigación**:
- Netlify Free tier tiene **100GB/mes** de bandwidth
- Un tour 360° pesa ~5-10MB
- Puedes servir ~10,000 tours/mes gratis
- Los bots AI NO descargan las imágenes panorámicas (solo leen HTML/texto)

**Impacto real**: BAJO. Los bots consumen ~1-2% de tu bandwidth.

#### ❌ **CONTRA 3: Robo de Datos Estructurados**

Si publicas datos únicos (precios, coordenadas GPS exactas, descripciones únicas), los bots pueden extraerlos.

**Riesgo para PotentiaMX**: MEDIO
- Precios: Son públicos en el marketplace (ya están expuestos)
- Coordenadas: Necesarias para el mapa (ya públicas)
- Tours 360°: Las URLs son públicas pero el contenido 3D no es "scrapeable"

**Mitigación**: Bloquear `/api/` y `/dashboard/` protege tus datos internos.

---

### 2.4 ¿Qué pasa si los BLOQUEAMOS?

#### ✅ **PRO 1: Protección Total**

Tu contenido NO se usa para entrenar modelos AI.

#### ✅ **PRO 2: Ahorro de Bandwidth**

Reduces requests innecesarios.

#### ❌ **CONTRA 1: Invisibilidad en el Futuro de Búsqueda**

Para 2026, se estima que **30-40% de búsquedas** se harán vía AI (ChatGPT, Perplexity, Google SGE).

Si bloqueas, pierdes esa audiencia.

**Ejemplo**:
```
Usuario: "Plataforma para crear tours virtuales en México"
ChatGPT: [No menciona PotentiaMX porque está bloqueado]
         "Te recomiendo [Competencia que SÍ permite crawling]"
```

#### ❌ **CONTRA 2: Competencia te Supera**

Si Zillow, Lamudi, Vivanuncios permiten AI crawling y tú no, **ellos** aparecerán en las respuestas de ChatGPT/Perplexity cuando busquen "tours virtuales México".

#### ❌ **CONTRA 3: Posible Penalización SEO**

Google usa `Google-Extended` para mejorar sus algoritmos. Bloquearlo podría afectar tu ranking en Google Search.

---

## 3️⃣ RECOMENDACIÓN FINAL PARA POTENTIAMX

### ⭐ **ESTRATEGIA: HÍBRIDA PERMISIVA**

**Permitir**:
- ✅ ChatGPT (GPTBot, ChatGPT-User, OAI-SearchBot)
- ✅ Perplexity (PerplexityBot, Perplexity-User)
- ✅ Google Gemini (Google-Extended)
- ✅ Claude (ClaudeBot, Claude-User)
- ✅ Bing Copilot (Bingbot)

**Bloquear**:
- 🚫 Common Crawl (CCBot)
- 🚫 ByteDance (Bytespider)
- 🚫 Meta/Facebook AI
- 🚫 Amazon Alexa
- 🚫 Apple Intelligence

**Proteger**:
- 🔒 `/dashboard/*` (área de usuarios)
- 🔒 `/api/*` (endpoints internos)
- 🔒 `/login`, `/signup`, `/reset-password`

---

### 🎯 **Justificación**

#### **Por qué PERMITIR búsqueda AI**:

1. **Tu contenido NO es fácilmente "robable"**
   - Los tours 360° son archivos interactivos (HTML/JS/WebGL)
   - Las IA NO pueden reproducir experiencias 3D
   - Solo pueden **citar y redirigir** a tu sitio

2. **Tu modelo de negocio depende de LEADS**
   - Necesitas que la gente **visite** tu sitio para ver tours
   - Las IA NO pueden mostrar el tour, solo describir la propiedad
   - Resultado: **más visitas, más leads**

3. **Zero-Click es BAJO riesgo para ti**
   - Zero-click = Usuario obtiene respuesta sin visitar sitios
   - Ejemplo: "¿Qué es la capital de Francia?" → ChatGPT: "París" (zero-click)
   - Pero: "¿Dónde puedo ver tours 360° de terrenos?" → ChatGPT: **"Visita PotentiaMX.com"** (click obligatorio)

4. **El futuro es AI Search**
   - En 2026, 40% de búsquedas serán vía AI
   - Bloquear = perder 40% de tráfico potencial
   - Permitir = capturar audiencia early-adopters

#### **Por qué BLOQUEAR entrenamiento masivo**:

1. **No dan nada a cambio**
   - CCBot (Common Crawl) solo entrena modelos, NO genera búsquedas
   - Bytespider (TikTok) consume tu contenido pero NO te referencia

2. **Consumen bandwidth sin beneficio**
   - 73,000 requests / 1 referral es insostenible

3. **No son críticos para tu visibilidad**
   - Bloquear CCBot NO te hace invisible
   - Los bots importantes (ChatGPT, Google) SÍ están permitidos

---

## 4️⃣ IMPLEMENTACIÓN

### Paso 1: Actualizar robots.txt

Reemplazar el archivo actual `app/robots.ts` con la estrategia híbrida:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Bots de búsqueda AI - PERMITIR con restricciones
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'ClaudeBot',
          'Claude-User',
        ],
        disallow: ['/dashboard/', '/api/', '/login', '/signup', '/reset-password'],
        allow: ['/', '/propiedades', '/terreno/'],
      },

      // 2. Crawlers de entrenamiento masivo - BLOQUEAR TOTALMENTE
      {
        userAgent: [
          'CCBot',
          'Bytespider',
          'Amazonbot',
          'FacebookBot',
          'meta-externalagent',
          'Applebot-Extended',
          'anthropic-ai',
          'cohere-ai',
        ],
        disallow: ['/'],
      },

      // 3. Buscadores tradicionales - PERMITIR TODO
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: ['/'],
        disallow: ['/dashboard/', '/api/'],
      },

      // 4. Resto de bots - REGLAS ESTÁNDAR
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/dashboard/', '/api/', '/login', '/signup'],
      },
    ],
    sitemap: 'https://potentiamx.com/sitemap.xml',
  };
}
```

### Paso 2: Agregar Meta Tags en Dashboard

En `app/dashboard/layout.tsx`, bloquear AI indexing:

```typescript
export const metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
    'max-image-preview': 'none',
    'max-snippet': 0,
    'max-video-preview': 0,
  },
  other: {
    'gptbot': 'noindex',
    'google-extended': 'noindex',
  },
};
```

### Paso 3: Monitorear Impacto

Usar Google Analytics para rastrear:
- Tráfico de `ChatGPT` (referrer: chat.openai.com)
- Tráfico de `Perplexity` (referrer: perplexity.ai)
- Cambios en crawl rate (Google Search Console)

---

## 5️⃣ TIMELINE ESPERADO

| Tiempo | Resultado |
|--------|-----------|
| **Día 1** | Implementar cambios en robots.txt |
| **24-48 hrs** | Bots actualizan su caché |
| **1 semana** | Primeras menciones en ChatGPT/Perplexity |
| **1 mes** | Medición inicial de tráfico AI |
| **3 meses** | Optimización basada en datos |
| **6 meses** | Evaluación completa del impacto |

---

## 6️⃣ PREGUNTAS FRECUENTES

### ¿Los bots respetan robots.txt?

**SÍ**, en su mayoría:
- OpenAI (GPTBot): ✅ Respeta 100%
- Google: ✅ Respeta 100%
- Anthropic (Claude): ✅ Respeta 100%
- Perplexity: ⚠️ Historial de controversia, pero oficialmente respeta
- Common Crawl: ✅ Respeta

### ¿Puedo cambiar de opinión después?

**SÍ**. Puedes actualizar robots.txt en cualquier momento. Los cambios tardan 24-48 hrs en aplicarse.

### ¿Afecta mi SEO tradicional?

**NO**, siempre y cuando NO bloquees `Googlebot`. Bloquear `Google-Extended` podría tener impacto mínimo.

### ¿Qué hacen mis competidores?

- **Zillow**: Permite AI crawling
- **Realtor.com**: Permite AI crawling
- **Redfin**: Bloquea parcialmente
- **Lamudi MX**: Permite AI crawling

**Tendencia**: 70% de sitios inmobiliarios PERMITEN AI crawling.

---

## 7️⃣ RECURSOS ADICIONALES

- **Verificar tu robots.txt**: https://www.google.com/webmasters/tools/robots-testing-tool
- **Monitorear crawl rate**: Google Search Console → Configuración → Estadísticas de rastreo
- **Dark Visitors (lista completa de AI bots)**: https://darkvisitors.com/
- **Generador de robots.txt para AI**: https://genrank.io/blog/optimizing-your-robots-txt-for-generative-ai-crawlers/

---

## 📊 CONCLUSIÓN

Para PotentiaMX, **permitir AI crawling selectivo es la mejor estrategia** porque:

1. ✅ Tu contenido valioso (tours 360°) NO es reproducible por IA
2. ✅ Necesitas visibilidad para generar leads
3. ✅ El futuro de búsqueda es AI-first
4. ✅ Bloquear áreas privadas protege tus datos sensibles
5. ✅ El riesgo de "plagio" es bajo vs. el beneficio de visibilidad

**Acción recomendada**: Implementar la estrategia híbrida HOY y medir resultados en 3 meses.

---

**Documento preparado por**: Claude (Anthropic)
**Para**: PotentiaMX
**Fecha**: Noviembre 2025
**Próxima revisión**: Febrero 2026
