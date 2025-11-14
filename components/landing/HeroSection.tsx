import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-[url('/hero-background.jpg')] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(/hero-background.jpg)',
        }}
      >
        {/* Fallback gradient if image doesn't exist */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          La Plataforma Inmobiliaria
          <br />
          <span className="text-teal-400">Definitiva</span> para Puerto Vallarta
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed">
          Fusionamos recorridos virtuales 360° con una potente estrategia SEO
          para vender y encontrar propiedades más rápido.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/propiedades"
            className="group w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Explorar Propiedades
          </Link>
          <Link
            href="/signup"
            className="group w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-white"
          >
            Publicar mi Propiedad
          </Link>
        </div>

        {/* Social Proof Line */}
        <div className="flex items-center justify-center gap-2 text-slate-300 text-sm sm:text-base">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <p>La herramienta preferida por los agentes líderes de la bahía</p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
