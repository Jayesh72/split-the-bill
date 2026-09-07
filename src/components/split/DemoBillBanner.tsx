import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface DemoBillBannerProps {
  onLoadDemo: () => void;
}

export const DemoBillBanner: React.FC<DemoBillBannerProps> = ({ onLoadDemo }) => {
  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-charcoal-200/90 my-8 flex flex-col md:flex-row items-center justify-between gap-5">
      {/* Left Info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] border border-[#A7F3D0]/80 flex items-center justify-center text-[#0D766E] flex-shrink-0 shadow-sm">
          <Sparkles className="w-5 h-5 text-[#0D766E]" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-charcoal-900">
            Want to see it in action without uploading?
          </h2>
          <p className="text-xs text-charcoal-500 font-medium mt-0.5">
            Load an authentic 4-person table split with shared appetizers, wine, and automatic tip calculator.
          </p>
        </div>
      </div>

      {/* Right Button */}
      <button
        type="button"
        onClick={onLoadDemo}
        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-charcoal-50 border border-charcoal-200 shadow-sm text-xs sm:text-sm font-bold text-charcoal-800 hover:border-charcoal-300 transition-all flex-shrink-0 cursor-pointer"
      >
        <span>Try with Pre-filled Demo Bill (The Olive Table)</span>
        <ArrowRight className="w-4 h-4 text-charcoal-600" />
      </button>
    </div>
  );
};
