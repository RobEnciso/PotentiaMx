import { Quote } from 'lucide-react';

export default function TestimonialSection() {
  return (
    <section className="py-28 sm:py-32 bg-[var(--gray-50)]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16 sm:mb-20">
          <h2
            className="font-bold text-[var(--gray-900)] mb-4"
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              letterSpacing: '-0.025em',
              lineHeight: '1.1'
            }}
          >
            Transformando el{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'var(--gradient-ocean)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Mercado Inmobiliario
            </span>
            <br />
            de Vallarta
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-white rounded-[var(--radius-2xl)] p-10 sm:p-14 shadow-[var(--shadow-lg)] border border-[var(--gray-200)]">
          {/* Quote Icon */}
          <div className="absolute top-8 right-8 opacity-5">
            <Quote className="w-24 h-24 text-[var(--ocean)]" />
          </div>

          <div className="relative z-10">
            {/* Avatar */}
            <div className="flex justify-center mb-10">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-[var(--shadow-md)]"
                style={{ background: 'var(--gradient-ocean)' }}
              >
                MG
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-center mb-10">
              <p
                className="text-2xl sm:text-3xl font-semibold text-[var(--gray-900)] leading-relaxed mb-4"
                style={{ letterSpacing: '-0.02em' }}
              >
                &quot;Esta plataforma revolucionó la forma en que presentamos
                propiedades a nuestros clientes.&quot;
              </p>
              <p
                className="text-xl text-[var(--gray-600)] leading-relaxed"
                style={{ letterSpacing: '-0.01em' }}
              >
                Cerramos ventas un 40% más rápido desde que implementamos los
                tours virtuales 360°. Los compradores internacionales ahora
                pueden explorar propiedades sin viajar.
              </p>
            </blockquote>

            {/* Author */}
            <div className="text-center">
              <p className="text-lg font-semibold text-[var(--gray-900)]">María González</p>
              <p className="text-base text-[var(--gray-600)]">
                Directora de Ventas, Vallarta Premium Realty
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-16 sm:mt-20">
          {[
            { value: '40%', label: 'Más rápido en ventas' },
            { value: '250+', label: 'Propiedades activas' },
            { value: '15K+', label: 'Visitas virtuales/mes' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p
                className="text-5xl font-bold mb-2 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'var(--gradient-ocean)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.03em'
                }}
              >
                {stat.value}
              </p>
              <p className="text-sm font-medium text-[var(--gray-600)] uppercase tracking-[0.05em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
