
import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const services = [
  {
    name: 'Sesión Terrestre Básica',
    price: '$2,500 MXN',
    description: 'Ideal para propiedades individuales, locales comerciales o espacios interiores que requieren un recorrido virtual detallado y de alta calidad.',
    features: [
      '8-12 fotografías 360° de alta resolución',
      'Edición y optimización de imágenes profesional',
      'Entrega en 24-48 horas',
      'Subida directa a tu cuenta de PotentiaMX',
    ],
    cta: 'Contactar para agendar',
  },
  {
    name: 'Sesión Aérea + Terrestre',
    price: '$5,000 MXN',
    description: 'La combinación perfecta para terrenos, naves industriales o propiedades grandes donde el contexto aéreo es tan importante como el detalle interior.',
    features: [
      '6-8 fotografías 360° terrestres',
      '4-6 fotografías aéreas con drone',
      'Tomas panorámicas para mostrar el entorno',
      'Edición y optimización profesional',
      'Entrega en 48-72 horas',
    ],
    cta: 'Contactar para agendar',
  },
  {
    name: 'Mega Sesión Premium',
    price: '$8,000 MXN',
    description: 'Para proyectos de alto valor, desarrollos inmobiliarios o cuando necesitas el máximo impacto visual, combinando foto y video.',
    features: [
      '10-15 fotografías 360° terrestres',
      '6-8 fotografías aéreas con drone',
      '2-3 clips de video cinematográfico',
      'Edición de video con color grading profesional',
      'Entrega en 3-5 días hábiles',
    ],
    cta: 'Contactar para agendar',
  },
];

export default function ServiciosCapturaPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Servicios de Captura Profesional
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            ¿No tienes una cámara 360°? No te preocupes. Nuestro equipo de profesionales captura tu propiedad por ti con equipo de última generación.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {services.map((service) => (
            <div key={service.name} className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900">{service.name}</h3>
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-4xl font-extrabold tracking-tight">{service.price}</span>
                </div>
                <p className="mt-6 text-gray-500">{service.description}</p>
                <ul role="list" className="mt-6 space-y-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex">
                      <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-teal-500" aria-hidden="true" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact"
                className="bg-teal-500 text-white hover:bg-teal-600 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium">
                {service.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-base text-gray-500">Todos los precios incluyen IVA.</p>
        </div>
        
        <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900">¿Necesitas algo diferente?</h2>
            <p className="mt-4 text-lg text-gray-600">
                Ofrecemos planes de suscripción con sesiones incluidas y descuentos.
            </p>
            <div className="mt-8">
                <Link href="/#precios" className="text-base font-medium text-teal-600 hover:text-teal-500">
                    Ver planes de suscripción &rarr;
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}
