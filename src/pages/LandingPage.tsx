import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { ReceiptPreviewCard } from '@/components/landing/ReceiptPreviewCard';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      <div>
        <Navbar />
        <main>
          <Hero />
          <ReceiptPreviewCard />
          <WorkflowSection />
          <FeaturesSection />
          <CtaSection />
        </main>
      </div>
      <Footer />
    </div>
  );
};
