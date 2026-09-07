import React from 'react';

export const SplitHeader: React.FC = () => {
  return (
    <div className="flex flex-col mb-8">
      {/* Top Status Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4EA] border border-[#A7F3D0]/70 shadow-sm mb-3 self-start">
        <span className="w-2 h-2 rounded-full bg-[#0D766E] animate-pulse"></span>
        <span className="text-[11px] font-bold tracking-wide uppercase text-[#0F766E]">
          ZERO SIGN-UP REQUIRED
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-charcoal-900 tracking-tight leading-tight mb-2.5">
        Let's split your bill.
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-xl">
        Upload your bill or snap a photo and we'll take care of the restaurant math automatically
        with itemized OCR recognition.
      </p>
    </div>
  );
};
