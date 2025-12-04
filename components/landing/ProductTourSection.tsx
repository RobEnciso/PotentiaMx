import { CheckCircle2, Edit3, Search, Share2 } from 'lucide-react';

export default function ProductTourSection() {
  return (
    <section id="caracteristicas" className="py-28 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-24 sm:mb-32">
          <h2
            className="font-bold text-[var(--gray-900)] mb-4"
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              letterSpacing: '-0.025em',
              lineHeight: '1.1'
            }}
          >
            Una Herramienta,{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'var(--gradient-ocean)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Múltiples Ventajas
            </span>
          </h2>
        </div>

        {/* Feature 1: Editor Intuitivo (Image Left) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-32 sm:mb-40">
          {/* Visual */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-[var(--radius-2xl)] bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--palm)]/5 p-12 shadow-[var(--shadow-lg)] border border-[var(--gray-200)] aspect-video flex items-center justify-center">
              <Edit3 className="w-24 h-24 text-[var(--ocean)] opacity-20" />
              <span className="absolute text-[var(--gray-400)] font-medium text-sm">
                [Editor GIF Animado]
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h3 className="text-3xl font-semibold text-[var(--gray-900)] mb-4" style={{ letterSpacing: '-0.02em' }}>
              Editor Intuitivo de Tours 360°
            </h3>
            <p className="text-xl text-[var(--gray-600)] mb-8 leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
              Crea experiencias inmersivas en minutos. Sube tus imágenes
              panorámicas, agrega hotspots interactivos y personaliza cada
              detalle.
            </p>

            <ul className="space-y-4">
              {[
                'Interfaz drag-and-drop sin curva de aprendizaje',
                'Hotspots con navegación fluida entre vistas',
                'Previsualización en tiempo real',
                'Optimización automática de imágenes',
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--ocean)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--gray-700)] text-base">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 2: SEO que Vende (Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-32 sm:mb-40">
          {/* Content */}
          <div>
            <h3 className="text-3xl font-semibold text-[var(--gray-900)] mb-4" style={{ letterSpacing: '-0.02em' }}>
              SEO que Posiciona tus Propiedades
            </h3>
            <p className="text-xl text-[var(--gray-600)] mb-8 leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
              Cada tour se optimiza automáticamente para buscadores. Tus
              propiedades aparecerán en Google cuando los clientes busquen en tu
              zona.
            </p>

            <ul className="space-y-4">
              {[
                'Metadata automática con palabras clave locales',
                'URLs amigables para SEO (ej: /vallarta/casa-playa)',
                'Thumbnails optimizados para redes sociales',
                'Integración con Google Business Profile',
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--ocean)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--gray-700)] text-base">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div>
            <div className="relative rounded-[var(--radius-2xl)] bg-gradient-to-br from-[var(--palm)]/5 to-[var(--ocean)]/5 p-12 shadow-[var(--shadow-lg)] border border-[var(--gray-200)] aspect-video flex items-center justify-center">
              <Search className="w-24 h-24 text-[var(--palm)] opacity-20" />
              <span className="absolute text-[var(--gray-400)] font-medium text-sm">
                [Google Results Mockup]
              </span>
            </div>
          </div>
        </div>

        {/* Feature 3: Integra y Comparte (Image Left) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Visual */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-[var(--radius-2xl)] bg-gradient-to-br from-[var(--coral)]/5 to-[var(--ocean)]/5 p-12 shadow-[var(--shadow-lg)] border border-[var(--gray-200)] aspect-video flex items-center justify-center">
              <Share2 className="w-24 h-24 text-[var(--coral)] opacity-20" />
              <span className="absolute text-[var(--gray-400)] font-medium text-sm">
                [Embed Animation]
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h3 className="text-3xl font-semibold text-[var(--gray-900)] mb-4" style={{ letterSpacing: '-0.02em' }}>
              Integra y Comparte en Cualquier Lugar
            </h3>
            <p className="text-xl text-[var(--gray-600)] mb-8 leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
              Embebe tus tours en tu sitio web, comparte en redes sociales o
              envía enlaces directos. Compatible con todos los dispositivos.
            </p>

            <ul className="space-y-4">
              {[
                'Código embed responsive para tu sitio',
                'Links compartibles con preview enriquecido',
                'Compatible con Facebook, Instagram, WhatsApp',
                'Funciona perfecto en móviles y tablets',
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--ocean)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--gray-700)] text-base">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
