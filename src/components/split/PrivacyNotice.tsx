import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <div className="w-full mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/90 shadow-[inset_0_1px_2px_0_rgba(15,23,42,0.02)] flex items-center gap-3">
      <div className="w-6 h-6 rounded-lg bg-[#E6F4EA] text-[#0D766E] flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 text-[#0D766E]" />
      </div>
      <p className="text-[11px] sm:text-xs text-charcoal-600 font-medium leading-relaxed">
        Receipts are processed privately in memory. No banking data saved, no marketing newsletters.
      </p>
    </div>
  );
};
