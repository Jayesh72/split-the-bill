import React from 'react';
import { ArrowRight, Utensils, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Hero: React.FC = () => {
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

      {/* CTA Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Primary CTA */}
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto px-8 py-3.5 text-base font-bold bg-[#0D766E] hover:bg-[#0B615A] shadow-[0_8px_20px_-2px_rgba(13,118,110,0.4)]"
        >
          Get Started
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        {/* Demo Widget Pill Card */}
        <a
          href="#preview"
          className="w-full sm:w-auto flex items-center justify-between gap-5 px-4 py-2.5 rounded-2xl bg-white border border-charcoal-200 shadow-soft hover:shadow-soft-lg hover:border-charcoal-300 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6F4EA] text-[#0D766E] flex items-center justify-center">
              <Utensils className="w-4 h-4 text-[#0D766E]" />
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-900 group-hover:text-[#0D766E] transition-colors">
                Try Demo
              </div>
              <div className="text-[11px] text-charcoal-500 font-medium">
                The Olive Table <span className="font-semibold text-charcoal-800">₹2,048</span>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0]/80">
            Instant
          </span>
        </a>
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
