'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Maximize2 } from 'lucide-react';

/**
 * PropertyCard - Tarjeta de propiedad estilo Airbnb
 *
 * @param {Object} props
 * @param {Object} props.property - Datos del terreno
 * @param {boolean} props.isHovered - Si la tarjeta está siendo hover
 * @param {Function} props.onMouseEnter - Callback para mouse enter
 * @param {Function} props.onMouseLeave - Callback para mouse leave
 */
export default function PropertyCard(props) {
  const {
    property,
    isHovered = false,
    onMouseEnter = () => {},
    onMouseLeave = () => {},
  } = props;
  const {
    id,
    slug,
    title,
    sale_price,
    total_square_meters,
    cover_image_url,
    image_urls,
    property_type,
    land_category,
  } = property;

  const imageUrl =
    cover_image_url || image_urls?.[0] || '/placeholder-property.jpg';
  const priceFormatted = formatPrice(sale_price);

  return (
    <Link href={`/terreno/${slug || id}`}>
      <div
        className={`group cursor-pointer transition-all duration-200 ${
          isHovered
            ? 'scale-[1.02] shadow-xl'
            : 'hover:scale-[1.02] hover:shadow-lg'
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Imagen - Más compacta estilo Airbnb */}
        <div className="relative w-full aspect-square bg-slate-200 rounded-xl overflow-hidden mb-2">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Información - Compacta */}
        <div className="space-y-0.5">
          {/* Título + Metros (en una línea) */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-teal-600 transition-colors flex-1">
              {title}
            </h3>
            {total_square_meters && (
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                {parseFloat(total_square_meters).toLocaleString('es-MX')} m²
              </span>
            )}
          </div>

          {/* Tipo/Categoría */}
          {(property_type || land_category) && (
            <p className="text-xs text-slate-500 line-clamp-1">
              {property_type && getPropertyTypeLabel(property_type)}
              {property_type && land_category && ' · '}
              {land_category && getCategoryLabel(land_category)}
            </p>
          )}

          {/* Precio - Destacado */}
          <div className="pt-1">
            <span className="text-base font-bold text-slate-900">
              {priceFormatted}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ====================================
// HELPER FUNCTIONS
// ====================================

function formatPrice(price) {
  if (!price) return '$0 MXN';

  const numPrice =
    typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;

  return `$${numPrice.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN`;
}

function formatPricePerSqm(price, sqm) {
  if (!price || !sqm) return '$0';

  const numPrice =
    typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;
  const numSqm = typeof sqm === 'string' ? parseFloat(sqm) : sqm;

  const pricePerSqm = numPrice / numSqm;

  return `$${pricePerSqm.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`;
}

function getPropertyTypeLabel(type) {
  const labels = {
    terreno: 'Terreno',
    casa: 'Casa',
    departamento: 'Departamento',
  };
  return labels[type] || type;
}

function getCategoryLabel(category) {
  const labels = {
    premium: 'Premium',
    standard: 'Estándar',
    economico: 'Económico',
  };
  return labels[category] || category;
}
