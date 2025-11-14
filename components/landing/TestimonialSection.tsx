import { Quote } from 'lucide-react';

export default function TestimonialSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Transformando el{' '}
            <span className="text-teal-500">Mercado Inmobiliario</span>
            <br />
            de Vallarta
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200">
          {/* Quote Icon */}
          <div className="absolute top-8 right-8 opacity-10">
            <Quote className="w-24 h-24 text-teal-500" />
          </div>

          <div className="relative z-10">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                MG
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-center mb-8">
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-800 leading-relaxed mb-2">
                &quot;Esta plataforma revolucionó la forma en que presentamos
                propiedades a nuestros clientes.&quot;
              </p>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                Cerramos ventas un 40% más rápido desde que implementamos los
                tours virtuales 360°. Los compradores internacionales ahora
                pueden explorar propiedades sin viajar.
              </p>
            </blockquote>

            {/* Author */}
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">María González</p>
              <p className="text-base text-slate-600">
                Directora de Ventas, Vallarta Premium Realty
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 sm:mt-16">
          {[
            { value: '40%', label: 'Más rápido en ventas' },
            { value: '250+', label: 'Propiedades activas' },
            { value: '15K+', label: 'Visitas virtuales/mes' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-teal-500 mb-2">
                {stat.value}
              </p>
              <p className="text-sm sm:text-base text-slate-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
