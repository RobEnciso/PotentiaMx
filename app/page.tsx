import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import Footer from '@/components/layout/Footer';

// OPTIMIZACIÓN CRÍTICA: Lazy load TODOS los componentes below-the-fold
// Esto reduce el bundle inicial y mejora LCP drásticamente
const SocialProofSection = dynamic(
  () => import('@/components/landing/SocialProofSection'),
  {
    ssr: true,
    loading: () => <div className="h-48 bg-white" /> // Skeleton para evitar layout shift
  }
);

const ProblemSolutionSection = dynamic(
  () => import('@/components/landing/ProblemSolutionSection'),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-gradient-to-b from-white to-gray-50" />
  }
);

const ProductTourSection = dynamic(
  () => import('@/components/landing/ProductTourSection'),
  {
    ssr: true,
    loading: () => <div className="h-screen bg-white" />
  }
);

const PricingSection = dynamic(
  () => import('@/components/landing/PricingSection'),
  {
    ssr: true,
    loading: () => <div className="h-screen bg-gradient-to-b from-white to-gray-50" />
  }
);

const TestimonialSection = dynamic(
  () => import('@/components/landing/TestimonialSection'),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-white" />
  }
);

const ContactFormSection = dynamic(
  () => import('@/components/landing/ContactFormSection'),
  {
    ssr: true,
    loading: () => <div className="h-screen bg-gradient-to-b from-white to-gray-50" />
  }
);

const FinalCTASection = dynamic(
  () => import('@/components/landing/FinalCTASection'),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-white" />
  }
);

// ⚡ ISR Configuration - Rebuild page every 60 seconds
// This allows Netlify to serve cached HTML instantly (TTFB < 100ms)
export const revalidate = 60;

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SocialProofSection />
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
