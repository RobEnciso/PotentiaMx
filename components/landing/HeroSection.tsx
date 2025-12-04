import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 landscape:pt-32 md:pt-0">
      {/* Subtle background gradient - Apple style */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[var(--gray-50)] to-white" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--ocean)]/5 via-transparent to-[var(--coral)]/5" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Headline - Apple Typography (tracking negativo, muy grande) */}
        <h1
          className="font-bold text-[var(--gray-900)] mb-6 leading-[1.05] animate-[fadeInUp_0.6s_ease_0.1s_forwards] opacity-0"
          style={{
            fontSize: 'clamp(48px, 7vw, 80px)',
            letterSpacing: '-0.03em'
          }}
        >
          Tours Virtuales 360°
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'var(--gradient-ocean)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            que Venden Propiedades Más Rápido
          </span>
        </h1>

        {/* Subheadline - Apple style */}
        <p
          className="text-xl md:text-2xl text-[var(--gray-600)] mb-12 max-w-3xl mx-auto leading-relaxed font-normal animate-[fadeInUp_0.6s_ease_0.2s_forwards] opacity-0"
          style={{ letterSpacing: '-0.01em' }}
        >
          La plataforma definitiva para crear recorridos virtuales inmersivos con SEO optimizado para destacar en México
        </p>

        {/* CTA Buttons - Apple Style */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-[fadeInUp_0.6s_ease_0.3s_forwards] opacity-0">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white font-semibold text-base rounded-[var(--radius-xl)] transition-all duration-[var(--transition-base)] hover:-translate-y-0.5 shadow-[var(--shadow-ocean)] hover:shadow-[0_12px_32px_rgba(20,184,166,0.35)]"
            style={{ background: 'var(--gradient-ocean)' }}
          >
            Comenzar Gratis
          </Link>
          <Link
            href="/propiedades"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[var(--gray-800)] font-semibold text-base border-[1.5px] border-[var(--gray-200)] rounded-[var(--radius-xl)] transition-all duration-[var(--transition-base)] hover:bg-[var(--gray-50)] hover:border-[var(--gray-300)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
          >
            Ver Propiedades
          </Link>
        </div>

        {/* Social Proof - Minimalista */}
        <p className="text-sm text-[var(--gray-500)] font-medium animate-[fadeIn_0.6s_ease_0.4s_forwards] opacity-0">
          Confiado por los agentes inmobiliarios líderes de México
        </p>
      </div>
    </section>
  );
}
