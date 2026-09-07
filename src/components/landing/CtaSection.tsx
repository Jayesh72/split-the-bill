import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LogoIcon } from '@/components/ui/LogoIcon';

export const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Neumorphic CTA Box */}
      <div className="bg-white rounded-3xl sm:rounded-[36px] p-8 sm:p-14 text-center shadow-[0_20px_50px_-10px_rgba(15,23,42,0.08),0_4px_16px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 relative overflow-hidden">
        {/* Top Logo Badge */}
        <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] border border-[#A7F3D0]/70 flex items-center justify-center text-[#0D766E] shadow-sm mx-auto mb-6">
          <LogoIcon className="w-6 h-6 text-[#0D766E]" size={24} />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight mb-4">
          Ready to settle dinner in 30 seconds?
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto leading-relaxed mb-8">
          No accounts. No credit card. Snap your receipt right now and share the breakdown
          before anyone leaves the table.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-center justify-center gap-5">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/split')}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-[#0D766E] hover:bg-[#0B615A] shadow-[0_8px_20px_-2px_rgba(13,118,110,0.4)]"
          >
            Start Splitting Now — It's Free
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 text-[11px] font-semibold text-charcoal-600">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0D766E]" />
              Zero Data Stored
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Under 30 Seconds
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
