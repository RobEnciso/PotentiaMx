import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabaseClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // 🔍 Obtener todas las propiedades públicas activas (con SLUG para SEO)
  const { data: terrenos } = await supabase
    .from('terrenos')
    .select('slug, updated_at')
    .eq('is_marketplace_listing', true)
    .eq('status', 'active');

  // URLs estáticas del sitio
  const staticUrls = [
    {
      url: 'https://potentiamx.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://potentiamx.com/propiedades',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // 🎯 URLs dinámicas SEO-friendly (cada propiedad usa SLUG)
  const propertyUrls = (terrenos || [])
    .filter((terreno) => terreno.slug) // Solo incluir si tiene slug
    .map((terreno) => ({
      url: `https://potentiamx.com/terreno/${terreno.slug}`,
      lastModified: new Date(terreno.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticUrls, ...propertyUrls];
}
