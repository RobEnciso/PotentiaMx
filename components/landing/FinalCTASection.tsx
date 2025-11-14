import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-teal-500 to-blue-600 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Empieza a Vender de Forma
          <br />
          <span className="text-teal-100">Más Inteligente Hoy</span>
        </h2>

        <p className="text-lg sm:text-xl text-teal-50 mb-10 max-w-2xl mx-auto leading-relaxed">
          Únete a los agentes inmobiliarios que están transformando la manera de
          vender propiedades en Puerto Vallarta.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-slate-50 text-teal-600 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
        >
          Crea tu Primer Tour Gratis
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="mt-6 text-sm text-teal-100">
          ✨ Sin tarjeta de crédito • Configuración en 5 minutos
        </p>
      </div>
    </section>
  );
}
