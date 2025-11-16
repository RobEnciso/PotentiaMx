import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import SocialProofSection from '@/components/landing/SocialProofSection';
import ProblemSolutionSection from '@/components/landing/ProblemSolutionSection';
import ProductTourSection from '@/components/landing/ProductTourSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/layout/Footer';

// Lazy load client components that are below the fold
const PricingSection = dynamic(
  () => import('@/components/landing/PricingSection'),
  { ssr: true }
);
const ContactFormSection = dynamic(
  () => import('@/components/landing/ContactFormSection'),
  { ssr: true }
);

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
