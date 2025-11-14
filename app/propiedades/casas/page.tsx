'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import PropiedadesGrid from '@/components/PropiedadesGrid';
import CategoryNav from '@/components/CategoryNav';

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
  is_marketplace_listing: boolean;
  status: string;
  created_at: string;
  property_type?: string;
}

export default function CasasPage() {
  const supabase = createClient();
  const [casas, setCasas] = useState<Terreno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasas = async () => {
      // ✅ MARKETPLACE: Solo casas publicadas y activas
      const { data, error } = await supabase
        .from('terrenos')
        .select('*')
        .eq('is_marketplace_listing', true)
        .eq('status', 'active')
        .eq('property_type', 'casa') // ← FILTRO POR CASAS
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching casas:', error);
      } else {
        setCasas(data || []);
      }
      setLoading(false);
    };

    fetchCasas();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
          <p className="text-slate-600">Cargando casas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Potentia<span className="text-teal-500">MX</span>
              </h1>
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors"
            >
              Publicar Propiedad
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Específico para Casas */}
      <section className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            🏡 Casas en Venta en Puerto Vallarta
          </h1>
          <p className="text-lg sm:text-xl text-blue-50 max-w-2xl mx-auto">
            Descubre tu hogar ideal con tours virtuales 360°. Explora cada
            rincón desde la comodidad de tu dispositivo antes de visitarla
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Category Navigation */}
        <CategoryNav />

        {/* Properties Grid */}
        <PropiedadesGrid propiedades={casas} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <Link href="/" className="inline-block mb-4">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Potentia<span className="text-teal-400">MX</span>
            </h2>
          </Link>
          <p className="text-sm text-slate-400 mb-4">
            Tours virtuales 360° para casas en Puerto Vallarta
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/" className="hover:text-teal-400 transition-colors">
              Inicio
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="/propiedades"
              className="hover:text-teal-400 transition-colors"
            >
              Todas las Propiedades
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="/login"
              className="hover:text-teal-400 transition-colors"
            >
              Publicar Propiedad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
