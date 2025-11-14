import { CheckCircle2, Edit3, Search, Share2 } from 'lucide-react';

export default function ProductTourSection() {
  return (
    <section id="caracteristicas" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Una Herramienta,{' '}
            <span className="text-teal-500">Múltiples Ventajas</span>
          </h2>
        </div>

        {/* Feature 1: Editor Intuitivo (Image Left) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 sm:mb-32">
          {/* Visual */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 p-8 shadow-xl border border-slate-200 aspect-video flex items-center justify-center">
              <Edit3 className="w-24 h-24 text-teal-400 opacity-20" />
              <span className="absolute text-slate-400 font-medium">
                [Editor GIF Animado]
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Editor Intuitivo de Tours 360°
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Crea experiencias inmersivas en minutos. Sube tus imágenes
              panorámicas, agrega hotspots interactivos y personaliza cada
              detalle.
            </p>

            <ul className="space-y-3">
              {[
                'Interfaz drag-and-drop sin curva de aprendizaje',
                'Hotspots con navegación fluida entre vistas',
                'Previsualización en tiempo real',
                'Optimización automática de imágenes',
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 2: SEO que Vende (Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 sm:mb-32">
          {/* Content */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              SEO que Posiciona tus Propiedades
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Cada tour se optimiza automáticamente para buscadores. Tus
              propiedades aparecerán en Google cuando los clientes busquen en tu
              zona.
            </p>

            <ul className="space-y-3">
              {[
                'Metadata automática con palabras clave locales',
                'URLs amigables para SEO (ej: /vallarta/casa-playa)',
                'Thumbnails optimizados para redes sociales',
                'Integración con Google Business Profile',
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div>
            <div className="relative rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 p-8 shadow-xl border border-slate-200 aspect-video flex items-center justify-center">
              <Search className="w-24 h-24 text-blue-400 opacity-20" />
              <span className="absolute text-slate-400 font-medium">
                [Google Results Mockup]
              </span>
            </div>
          </div>
        </div>

        {/* Feature 3: Integra y Comparte (Image Left) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-xl border border-slate-200 aspect-video flex items-center justify-center">
              <Share2 className="w-24 h-24 text-purple-400 opacity-20" />
              <span className="absolute text-slate-400 font-medium">
                [Embed Animation]
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Integra y Comparte en Cualquier Lugar
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Embebe tus tours en tu sitio web, comparte en redes sociales o
              envía enlaces directos. Compatible con todos los dispositivos.
            </p>

            <ul className="space-y-3">
              {[
                'Código embed responsive para tu sitio',
                'Links compartibles con preview enriquecido',
                'Compatible con Facebook, Instagram, WhatsApp',
                'Funciona perfecto en móviles y tablets',
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
