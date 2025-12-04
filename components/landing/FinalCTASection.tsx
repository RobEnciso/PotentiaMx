import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="py-32 sm:py-40 relative overflow-hidden" style={{ background: 'var(--gradient-ocean)' }}>
      {/* Decorative Elements - Más sutiles */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <h2
          className="font-bold text-white mb-6 leading-tight"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            letterSpacing: '-0.025em',
            lineHeight: '1.1'
          }}
        >
          Empieza a Vender de Forma
          <br />
          <span className="text-white/80">Más Inteligente Hoy</span>
        </h2>

        <p
          className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ letterSpacing: '-0.01em' }}
        >
          Únete a los agentes inmobiliarios que están transformando la manera de
          vender propiedades en Puerto Vallarta.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-white/90 text-[var(--ocean)] font-semibold text-base rounded-[var(--radius-xl)] transition-all duration-[var(--transition-base)] hover:-translate-y-0.5 shadow-[var(--shadow-lg)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] group"
        >
          Crea tu Primer Tour Gratis
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-[var(--transition-fast)]" />
        </Link>

        <p className="mt-8 text-sm text-white/80 font-medium">
          Sin tarjeta de crédito • Configuración en 5 minutos
        </p>
      </div>
    </section>
  );
}
