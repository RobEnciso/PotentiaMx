'use client';

import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import SocialProofSection from '@/components/landing/SocialProofSection';
import ProblemSolutionSection from '@/components/landing/ProblemSolutionSection';
import ProductTourSection from '@/components/landing/ProductTourSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import ContactFormSection from '@/components/landing/ContactFormSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/layout/Footer';

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
