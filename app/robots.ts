import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Bots de búsqueda AI - PERMITIR con restricciones
      // Estos bots pueden citar tu sitio en respuestas y traer tráfico
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
      // Estos solo consumen contenido sin dar nada a cambio
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

      // 3. Buscadores tradicionales - PERMITIR TODO (crítico para SEO)
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
