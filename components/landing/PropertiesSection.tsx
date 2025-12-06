'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PotentiaSkeleton from '@/components/ui/PotentiaSkeleton';

/**
 * PropertiesSection - Showcase latest properties with loading skeleton
 *
 * Demonstrates integration of PotentiaSkeleton for elegant loading states
 */
export default function PropertiesSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call
    const loadProperties = async () => {
      setIsLoading(true);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data
      const mockProperties = [
        {
          id: 1,
          title: 'Villa Paraíso - Puerto Vallarta',
          description: 'Espectacular villa con vista al mar y tour virtual 360°',
          price: '$8,500,000 MXN',
          bedrooms: 4,
          bathrooms: 3.5,
        },
        {
          id: 2,
          title: 'Penthouse Moderno - Playa del Carmen',
          description: 'Luxury penthouse con terraza panorámica y recorrido inmersivo',
          price: '$12,000,000 MXN',
          bedrooms: 3,
          bathrooms: 2.5,
        },
        {
          id: 3,
          title: 'Casa Colonial - Guanajuato',
          description: 'Hermosa casa restaurada con tour virtual interactivo',
          price: '$6,200,000 MXN',
          bedrooms: 5,
          bathrooms: 4,
        },
      ];

      setProperties(mockProperties);
      setIsLoading(false);
    };

    loadProperties();
  }, []);

  return (
    <section id="propiedades" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Propiedades Destacadas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestros tours virtuales 360° inmersivos
          </p>
        </div>

        {/* Properties Grid with Skeleton Loading */}
        {isLoading ? (
          <PotentiaSkeleton count={3} variant="card" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/terreno/${property.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-teal-300 hover:-translate-y-1"
              >
                {/* Image Placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-teal-100 to-cyan-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-teal-600 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {property.description}
                  </p>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      {property.bedrooms} habitaciones
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      {property.bathrooms} baños
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {property.price}
                    </span>
                    <span className="text-teal-600 group-hover:text-teal-700 font-semibold flex items-center gap-1">
                      Ver tour
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Ver todas las propiedades
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
