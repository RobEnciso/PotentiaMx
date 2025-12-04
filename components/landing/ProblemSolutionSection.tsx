import { Home, TrendingUp, Sparkles } from 'lucide-react';

export default function ProblemSolutionSection() {
  const solutions = [
    {
      icon: Home,
      title: 'Tours Virtuales Inmersivos',
      description:
        'Crea recorridos 360° interactivos que permiten a tus clientes explorar propiedades desde cualquier lugar. Aumenta el interés y reduce visitas innecesarias.',
    },
    {
      icon: TrendingUp,
      title: 'SEO que Posiciona y Vende',
      description:
        'Tu tour virtual se indexa en Google con metadata optimizada. Aparece en búsquedas locales y aumenta la visibilidad de tus propiedades de forma orgánica.',
    },
    {
      icon: Sparkles,
      title: 'Gestión Simple y Poderosa',
      description:
        'Dashboard intuitivo para gestionar todas tus propiedades. Edita, comparte y analiza el rendimiento de tus tours desde un solo lugar.',
    },
  ];

  return (
    <section className="py-28 sm:py-32 bg-[var(--gray-50)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-20 sm:mb-24">
          <h2
            className="font-bold text-[var(--gray-900)] mb-4"
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              letterSpacing: '-0.025em',
              lineHeight: '1.1'
            }}
          >
            El Proceso Inmobiliario,
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'var(--gradient-ocean)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              sin las Complicaciones
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={index}
                className="text-center group transition-all duration-[var(--transition-base)]"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-[var(--radius-xl)] bg-[var(--ocean)]/10 text-[var(--ocean)] group-hover:bg-[var(--ocean)] group-hover:text-white transition-all duration-[var(--transition-base)] group-hover:shadow-[var(--shadow-ocean)]">
                  <Icon className="w-10 h-10" strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-semibold text-[var(--gray-900)] mb-4" style={{ letterSpacing: '-0.02em' }}>
                  {solution.title}
                </h3>

                <p className="text-lg text-[var(--gray-600)] leading-relaxed">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
