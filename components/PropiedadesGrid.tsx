'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  MapPin,
  Maximize2,
  ArrowRight,
  Mountain,
  Building2,
} from 'lucide-react';

interface Terreno {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  image_urls?: string[];
  total_square_meters?: number;
  land_use?: string;
  sale_price?: number;
  price_per_sqm?: number;
  property_type?: string;
  is_marketplace_listing: boolean;
  status: string;
  created_at: string;
}

interface PropiedadesGridProps {
  propiedades: Terreno[];
}

export default function PropiedadesGrid({ propiedades }: PropiedadesGridProps) {
  // Función para obtener el icono según el tipo de propiedad
  const getPropertyIcon = (type?: string) => {
    switch (type) {
      case 'terreno':
        return <Mountain className="w-4 h-4" />;
      case 'casa':
        return <Home className="w-4 h-4" />;
      case 'departamento':
        return <Building2 className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  // Función para obtener el label del tipo de propiedad
  const getPropertyLabel = (type?: string) => {
    switch (type) {
      case 'terreno':
        return '🏞️ Terreno';
      case 'casa':
        return '🏡 Casa';
      case 'departamento':
        return '🏢 Departamento';
      default:
        return 'Propiedad';
    }
  };

  if (propiedades.length === 0) {
    return (
      <div className="text-center py-20">
        <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-slate-700 mb-2">
          No hay propiedades en esta categoría
        </h3>
        <p className="text-slate-500 mb-6">
          Estamos agregando más opciones para ti
        </p>
        <Link
          href="/propiedades"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors"
        >
          Ver todas las propiedades
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <p className="text-slate-600">
          <span className="font-semibold text-slate-900">
            {propiedades.length}
          </span>{' '}
          {propiedades.length === 1
            ? 'propiedad disponible'
            : 'propiedades disponibles'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {propiedades.map((propiedad) => (
          <article
            key={propiedad.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
          >
            {/* Image */}
            <Link href={`/terreno/${propiedad.id}`}>
              <div className="relative h-64 bg-slate-200 overflow-hidden cursor-pointer">
                {propiedad.cover_image_url || propiedad.image_urls?.[0] ? (
                  <Image
                    src={
                      propiedad.cover_image_url ||
                      propiedad.image_urls?.[0] ||
                      ''
                    }
                    alt={propiedad.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-16 h-16 text-slate-300" />
                  </div>
                )}

                {/* Badge Tipo de Propiedad */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
                  {getPropertyIcon(propiedad.property_type)}
                  {getPropertyLabel(propiedad.property_type)}
                </div>

                {/* Badge 360° */}
                <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  Tour 360°
                </div>
              </div>
            </Link>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                {propiedad.title}
              </h3>

              {propiedad.description && (
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {propiedad.description}
                </p>
              )}

              {/* Details Grid */}
              <div className="space-y-2 mb-6">
                {propiedad.total_square_meters && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Maximize2 className="w-4 h-4 text-teal-500" />
                    <span>{propiedad.total_square_meters} m²</span>
                  </div>
                )}

                {propiedad.land_use && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span>{propiedad.land_use}</span>
                  </div>
                )}
              </div>

              {/* Price */}
              {propiedad.sale_price && (
                <div className="mb-4 pb-4 border-b border-slate-200">
                  <p className="text-2xl font-bold text-slate-900">
                    ${propiedad.sale_price.toLocaleString('es-MX')}
                  </p>
                  {propiedad.price_per_sqm && (
                    <p className="text-sm text-slate-500">
                      ${propiedad.price_per_sqm.toLocaleString('es-MX')}/m²
                    </p>
                  )}
                </div>
              )}

              {/* CTA Button */}
              <Link
                href={`/terreno/${propiedad.id}`}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-all duration-300 group-hover:shadow-lg"
              >
                Ver Tour Virtual
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
