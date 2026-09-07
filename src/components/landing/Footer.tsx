import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-charcoal-200/60 bg-transparent py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand info */}
        <div className="text-center sm:text-left">
          <div className="font-bold text-sm text-charcoal-900">
            Split The Bill
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Frictionless social expense settling. Zero account creation required.
          </p>
        </div>

        {/* Right: Feature Badges */}
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-charcoal-500 uppercase">
          <span>100% CLIENT-SIDE PRIVACY</span>
          <span>INSTANT LINK SETTLEMENT</span>
        </div>
      </div>
    </footer>
  );
};
