import { Metadata } from 'next';
import { createClient } from '@/lib/supabaseClient';
import TerrenoClientPage from './TerrenoClientPage';

// ✅ Función que genera SEO dinámico para cada propiedad
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const supabase = createClient();
  const { id } = await params;

  // Obtener datos del terreno
  const { data: terreno } = await supabase
    .from('terrenos')
    .select('*')
    .eq('id', id)
    .single();

  // Si no existe, metadata genérica
  if (!terreno) {
    return {
      title: 'Propiedad no encontrada | PotentiaMX',
      description: 'La propiedad que buscas no está disponible.',
    };
  }

  // 🎯 GENERAR TITLE SEO
  const propertyTypeSpanish =
    terreno.property_type === 'terreno'
      ? 'Terreno'
      : terreno.property_type === 'casa'
        ? 'Casa'
        : terreno.property_type === 'departamento'
          ? 'Departamento'
          : 'Propiedad';

  const title = [
    terreno.title || propertyTypeSpanish,
    terreno.total_square_meters
      ? `${terreno.total_square_meters}m²`
      : null,
    'Puerto Vallarta',
    terreno.sale_price
      ? `| $${terreno.sale_price.toLocaleString('es-MX')} MXN`
      : null,
    '| Tour 360°',
  ]
    .filter(Boolean)
    .join(' ');

  // 🎯 GENERAR DESCRIPTION SEO
  const description = [
    `${propertyTypeSpanish} ${terreno.land_category || ''} de ${terreno.total_square_meters || 'N/A'} m² en Puerto Vallarta, Jalisco.`,
    terreno.description
      ? terreno.description.substring(0, 100) + '...'
      : '',
    'Tour virtual 360° interactivo.',
    terreno.land_use ? `Uso: ${terreno.land_use}.` : '',
    terreno.sale_price
      ? `Precio: $${terreno.sale_price.toLocaleString('es-MX')} MXN`
      : '',
    terreno.price_per_sqm
      ? `($${terreno.price_per_sqm.toLocaleString('es-MX')}/m²).`
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  // 🎯 GENERAR KEYWORDS SEO
  const keywords = [
    terreno.property_type,
    terreno.land_category,
    'puerto vallarta',
    'bahía banderas',
    'jalisco',
    'méxico',
    terreno.land_use?.toLowerCase(),
    terreno.total_square_meters
      ? `${terreno.total_square_meters} m²`
      : null,
    terreno.total_square_meters
      ? `${terreno.total_square_meters} metros cuadrados`
      : null,
    'tour virtual 360',
    'tour virtual',
    'recorrido virtual',
    'bienes raíces',
    'inmobiliaria',
    'venta',
    terreno.available_for_contribution ? 'aportación' : null,
    terreno.available_for_contribution
      ? 'desarrollo inmobiliario'
      : null,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    title,
    description,
    keywords,

    // 🌐 Open Graph (Facebook, WhatsApp, LinkedIn)
    openGraph: {
      title,
      description,
      url: `https://potentiamx.com/terreno/${id}`,
      siteName: 'PotentiaMX',
      images: terreno.cover_image_url
        ? [
            {
              url: terreno.cover_image_url,
              width: 1200,
              height: 630,
              alt: terreno.title || propertyTypeSpanish,
            },
          ]
        : terreno.image_urls?.[0]
          ? [
              {
                url: terreno.image_urls[0],
                width: 1200,
                height: 630,
                alt: terreno.title || propertyTypeSpanish,
              },
            ]
          : [],
      locale: 'es_MX',
      type: 'website',
    },

    // 🐦 Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: terreno.cover_image_url
        ? [terreno.cover_image_url]
        : terreno.image_urls?.[0]
          ? [terreno.image_urls[0]]
          : [],
    },

    // 🤖 Control de indexación
    robots: {
      // Solo indexar si está publicado en marketplace y activo
      index:
        terreno.is_marketplace_listing === true &&
        terreno.status === 'active',
      follow: true,
      googleBot: {
        index:
          terreno.is_marketplace_listing === true &&
          terreno.status === 'active',
        follow: true,
      },
    },

    // 📱 Otras metadata útiles
    other: {
      'geo.region': 'MX-JAL',
      'geo.placename': 'Puerto Vallarta',
      ...(terreno.latitude && terreno.longitude
        ? { 'geo.position': `${terreno.latitude};${terreno.longitude}` }
        : {}),
    },
  };
}

// Componente que renderiza la página
export default async function TerrenoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TerrenoClientPage id={id} />;
}
