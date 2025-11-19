'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import PropertyCard from '@/components/PropertyCard';
import { MapPin, SlidersHorizontal } from 'lucide-react';

// Importar mapa dinámicamente para evitar SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <p className="text-slate-600">Cargando mapa...</p>
    </div>
  ),
});

interface Terreno {
  id: string;
  slug: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  image_urls?: string[];
  total_square_meters?: number;
  land_use?: string;
  sale_price?: string | number;
  price_per_sqm?: number;
  is_marketplace_listing: boolean;
  status: string;
  created_at: string;
  property_type?: string;
  land_category?: string;
  latitude?: number;
  longitude?: number;
}

export default function PropiedadesPage() {
  const supabase = createClient();
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(
    null,
  );
  const [showMap, setShowMap] = useState(true); // Para toggle en móvil
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Filtro de categoría

  useEffect(() => {
    const fetchTerrenos = async () => {
      // ✅ MARKETPLACE: Solo mostrar tours publicados en marketplace
      const { data, error } = await supabase
        .from('terrenos')
        .select('*')
        .eq('is_marketplace_listing', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching terrenos:', error);
        setTerrenos([]);
      } else {
        // Filtrar solo los que tienen coordenadas (si existen las columnas)
        const terrenosConCoordenadas = (data || []).filter(
          (t: Terreno) => t.latitude && t.longitude,
        );
        setTerrenos(terrenosConCoordenadas);
      }
      setLoading(false);
    };

    fetchTerrenos();
  }, [supabase]);

  // Filtrar terrenos por categoría seleccionada
  const terrenosFiltrados =
    selectedCategory === 'all'
      ? terrenos
      : terrenos.filter((t) => t.property_type === selectedCategory);

  // Contar terrenos por categoría
  const categoryCounts = {
    all: terrenos.length,
    terreno: terrenos.filter((t) => t.property_type === 'terreno').length,
    casa: terrenos.filter((t) => t.property_type === 'casa').length,
    departamento: terrenos.filter((t) => t.property_type === 'departamento')
      .length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
          <p className="text-slate-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 z-50 flex-shrink-0">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Mobile Header - Reorganizado */}
          <div className="lg:hidden">
            {/* Primera fila: Logo y botón volver */}
            <div className="flex items-center justify-between mb-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium text-sm">Volver</span>
              </Link>

              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo-page-black.png"
                  alt="PotentiaMX"
                  width={600}
                  height={150}
                  priority
                  className="h-8 w-auto object-contain"
                />
              </Link>

              <button
                onClick={() => setShowMap(!showMap)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors flex items-center gap-2"
              >
                {showMap ? (
                  <>
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden xs:inline">Lista</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span className="hidden xs:inline">Mapa</span>
                  </>
                )}
              </button>
            </div>

            {/* Segunda fila: Filtros de categoría con scroll horizontal */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 active:bg-slate-200'
                }`}
              >
                Todas ({categoryCounts.all})
              </button>
              <button
                onClick={() => setSelectedCategory('terreno')}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === 'terreno'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 active:bg-slate-200'
                }`}
              >
                Terrenos ({categoryCounts.terreno})
              </button>
              <button
                onClick={() => setSelectedCategory('casa')}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === 'casa'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 active:bg-slate-200'
                }`}
              >
                Casas ({categoryCounts.casa})
              </button>
              <button
                onClick={() => setSelectedCategory('departamento')}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === 'departamento'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 active:bg-slate-200'
                }`}
              >
                Departamentos ({categoryCounts.departamento})
              </button>
            </div>
          </div>

          {/* Desktop Header - Sin cambios */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/logo-page-black.png"
                alt="PotentiaMX"
                width={600}
                height={150}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Filtros de Categoría - Desktop (4 botones) */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todas ({categoryCounts.all})
              </button>
              <button
                onClick={() => setSelectedCategory('terreno')}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === 'terreno'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Terrenos ({categoryCounts.terreno})
              </button>
              <button
                onClick={() => setSelectedCategory('casa')}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === 'casa'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Casas ({categoryCounts.casa})
              </button>
              <button
                onClick={() => setSelectedCategory('departamento')}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === 'departamento'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Departamentos ({categoryCounts.departamento})
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{terrenosFiltrados.length} propiedades</span>
              </div>
              <Link
                href="/login"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Publicar Propiedad
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Airbnb Layout */}
      <main className="flex-1 overflow-hidden">
        {terrenosFiltrados.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                No hay propiedades disponibles
              </h2>
              <p className="text-slate-600 mb-6">
                Vuelve pronto para ver nuevas propiedades
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col md:flex-row">
            {/* LISTA DE PROPIEDADES - Izquierda (Desktop) / Abajo (Mobile) */}
            <div
              className={`
                ${showMap ? 'hidden md:block' : 'block'}
                md:w-[45%] lg:w-[40%] overflow-y-auto
                bg-white
              `}
            >
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Info Header */}
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                    {terrenosFiltrados.length}{' '}
                    {terrenosFiltrados.length === 1
                      ? 'Propiedad'
                      : 'Propiedades'}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Explora propiedades con tours virtuales 360° inmersivos
                  </p>
                </div>

                {/* Properties Grid - 2 columnas estilo Airbnb */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  {terrenosFiltrados.map((terreno) => (
                    <PropertyCard
                      key={terreno.id}
                      property={terreno}
                      isHovered={hoveredPropertyId === terreno.id}
                      onMouseEnter={() => setHoveredPropertyId(terreno.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* MAPA - Derecha (Desktop) / Arriba (Mobile) */}
            <div
              className={`
                ${showMap ? 'block' : 'hidden md:block'}
                flex-1 relative
                md:sticky md:top-0 md:h-[calc(100vh-64px)]
              `}
            >
              <PropertyMap
                properties={terrenosFiltrados}
                onMarkerHover={setHoveredPropertyId}
                hoveredPropertyId={hoveredPropertyId}
              />

              {/* Overlay Info en el mapa (Desktop only) */}
              <div className="hidden md:block absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-slate-200 max-w-xs">
                <p className="text-sm text-slate-700">
                  <strong className="text-teal-600">💡 Tip:</strong> Haz clic en
                  un pin para ver el tour virtual 360° completo
                </p>
              </div>

              {/* Counter badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  {terrenosFiltrados.length}{' '}
                  {terrenosFiltrados.length === 1 ? 'propiedad' : 'propiedades'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
