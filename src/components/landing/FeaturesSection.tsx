import React from 'react';
import { Lock, Calculator, PieChart, LogIn } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Zero Auth Friction',
      desc: 'No passwords, email verification, or phone number prompts. We never ask who you are or store your address book. Just open the page, settle up, and close the tab.',
      icon: <Lock className="w-5 h-5 text-[#0D766E]" strokeWidth={2.2} />,
    },
    {
      title: 'Fractional Rupee Precision',
      desc: 'Proportional distribution of taxes and tips down to the exact paisa. Non-drinkers don\'t subsidize alcohol taxes, and rounding discrepancies never exceed ₹0.00.',
      icon: <Calculator className="w-5 h-5 text-[#0D766E]" strokeWidth={2.2} />,
    },
    {
      title: 'Smart Shared Items',
      desc: 'Did three people split the loaded nachos while two others only had water? Select any combination of people for individual line items without complex math.',
      icon: <PieChart className="w-5 h-5 text-[#0D766E]" strokeWidth={2.2} />,
    },
    {
      title: 'Instant WhatsApp & UPI Deep Links',
      desc: 'Generate clean summary messages with custom links. Tapping a companion\'s link opens their preferred UPI app (Google Pay, PhonePe) with the exact amount prefilled.',
      icon: <LogIn className="w-5 h-5 text-[#0D766E]" strokeWidth={2.2} />,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
      {/* Eyebrow */}
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D766E] block mb-2">
        ENGINEERED FOR FAIRNESS
      </span>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight mb-3">
        Why Split The Bill feels different.
      </h2>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl mx-auto leading-relaxed mb-10">
        Built specifically for real restaurant scenarios where people drink differently, eat differently,
        and nobody wants to calculate 18% tax on half a naan.
      </p>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {features.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-charcoal-200/90 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.05)] hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Soft Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] border border-[#A7F3D0]/70 flex items-center justify-center text-[#0D766E] flex-shrink-0 shadow-sm mt-0.5">
              {item.icon}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-base font-bold text-charcoal-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-charcoal-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
