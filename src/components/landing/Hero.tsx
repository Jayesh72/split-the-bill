import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-8 pb-6 sm:pt-14 sm:pb-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F4EA] border border-[#A7F3D0]/70 shadow-sm mb-6">
        <span className="w-2 h-2 rounded-full bg-[#0D766E] animate-pulse"></span>
        <span className="text-xs font-semibold text-[#0F766E]">
          Scan it. Split it. Done. • No Sign-up Required
        </span>
      </div>

      {/* Main Hero Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-charcoal-900 leading-[1.12] mb-5">
        Split the bill without the <span className="text-[#0D766E]">awkward math.</span>
      </h1>

      {/* Hero Subtitle */}
      <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto leading-relaxed mb-8">
        Upload your restaurant bill, let AI read every dish and tax, assign what everyone ordered, and
        get the exact amount each person owes in seconds. 100% free, no login needed.
      </p>

      {/* Centered CTA Action Button */}
      <div className="flex items-center justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/split')}
          className="w-full sm:w-auto px-8 py-3.5 text-base font-bold bg-[#0D766E] hover:bg-[#0B615A] shadow-[0_8px_20px_-2px_rgba(13,118,110,0.4)]"
        >
          Get Started
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* See how it works indicator */}
      <div className="mt-8 flex items-center justify-center">
        <a
          href="#workflow"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-900 transition-colors cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>See how it works</span>
        </a>
      </div>
    </section>
  );
};
