import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import Footer from '@/components/layout/Footer';
import PotentiaSkeleton from '@/components/ui/PotentiaSkeleton';

// ⚠️ CRITICAL PERFORMANCE - DO NOT REMOVE OR MODIFY THIS SECTION ⚠️
// These dynamic imports reduce initial bundle by ~70% and improve LCP from 11s to <2.5s
// Removing these will cause SEVERE performance degradation

// LAYER 1: Below-the-fold sections loaded lazily

// TODO: SocialProofSection comentada temporalmente (muestra logos placeholder)
// Descomentar cuando tengamos logos reales de partners
// const SocialProofSection = dynamicImport(
//   () => import('@/components/landing/SocialProofSection'),
//   {
//     ssr: true, // Keep SSR for SEO
//     loading: () => <div className="h-48 bg-white" aria-hidden="true" />,
//   }
// );

// TODO: PropertiesSection comentada temporalmente (muestra datos mock)
// Descomentar cuando se implemente conexión a Supabase con is_featured
// const PropertiesSection = dynamicImport(
//   () => import('@/components/landing/PropertiesSection'),
//   {
//     ssr: true,
//     loading: () => (
//       <section className="py-24 bg-gradient-to-b from-white to-gray-50">
//         <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
//           <div className="text-center mb-16">
//             <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse" />
//             <div className="h-6 bg-gray-100 rounded w-128 mx-auto animate-pulse" />
//           </div>
//           <PotentiaSkeleton count={3} variant="card" />
//         </div>
//       </section>
//     ),
//   }
// );

const ProblemSolutionSection = dynamicImport(
  () => import('@/components/landing/ProblemSolutionSection'),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-gradient-to-b from-white to-gray-50" aria-hidden="true" />,
  }
);

const ProductTourSection = dynamicImport(
  () => import('@/components/landing/ProductTourSection'),
  {
    ssr: true,
    loading: () => <div className="h-screen bg-white" aria-hidden="true" />,
  }
);

// LAYER 2: Interactive sections loaded with lower priority
const PricingSection = dynamicImport(
  () => import('@/components/landing/PricingSection'),
  {
    ssr: true,
    loading: () => <div className="h-screen bg-gradient-to-b from-white to-gray-50" aria-hidden="true" />,
  }
);

const TestimonialSection = dynamicImport(
  () => import('@/components/landing/TestimonialSection'),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-white" aria-hidden="true" />,
  }
);

// LAYER 3: Form and footer sections loaded last
const ContactFormSection = dynamicImport(
  () => import('@/components/landing/ContactFormSection'),
  {
    ssr: true,
    loading: () => <div className="h-screen bg-gradient-to-b from-white to-gray-50" aria-hidden="true" />,
  }
);

const FinalCTASection = dynamicImport(
  () => import('@/components/landing/FinalCTASection'),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-white" aria-hidden="true" />,
  }
);

// ⚠️ END CRITICAL PERFORMANCE SECTION ⚠️

// ⚡ STATIC GENERATION - Build once at deploy time
// Landing page has no dynamic content, so we generate it once and serve it instantly
// This prevents ISR from rebuilding the page and making Supabase calls
// CRITICAL: These two directives force static generation and prevent cold start issues
export const dynamic = 'force-static'; // Force static HTML generation at build time
export const revalidate = false; // Never revalidate - serve static HTML forever

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      {/* TODO: SocialProofSection deshabilitada temporalmente (muestra logos placeholder) */}
      {/* Descomentar cuando tengamos logos reales de partners/colaboradores */}
      {/* <SocialProofSection /> */}
      {/* TODO: PropertiesSection deshabilitada temporalmente (muestra datos mock) */}
      {/* Descomentar cuando se implemente conexión a Supabase con is_featured */}
      {/* <PropertiesSection /> */}
      <ProblemSolutionSection />
      <ProductTourSection />
      <PricingSection />
      <TestimonialSection />
      <ContactFormSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
