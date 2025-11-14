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
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            El Proceso Inmobiliario,
            <br />
            <span className="text-teal-500">sin las Complicaciones</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 rounded-2xl bg-teal-50 text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                  {solution.title}
                </h3>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
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
