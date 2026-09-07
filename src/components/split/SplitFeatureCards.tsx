import React from 'react';
import { Percent, Users, QrCode } from 'lucide-react';

export const SplitFeatureCards: React.FC = () => {
  const cards = [
    {
      title: 'Proportional Tax',
      desc: "Never quarrel over tax and tips. We calculate tip percentages on subtotal shares so non drinkers don't pay alcohol taxes.",
      icon: <Percent className="w-4 h-4 text-[#0D766E]" strokeWidth={2.5} />,
    },
    {
      title: 'Shared Appetizers',
      desc: 'Tap 2 or more avatars to split single items like shared pizzas, charcuterie, or appetizers cleanly down to the penny.',
      icon: <Users className="w-4 h-4 text-[#0D766E]" strokeWidth={2.2} />,
    },
    {
      title: 'Venmo & Zelle QR',
      desc: 'Once calculated, attendees scan a single QR code to settle up via Venmo, Apple Pay, or standard Revolut payment links.',
      icon: <QrCode className="w-4 h-4 text-[#0D766E]" strokeWidth={2.2} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
      {cards.map((card) => (
        <div
          key={card.title}
          className="p-5 sm:p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.05)] hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E6F4EA] flex items-center justify-center text-[#0D766E]">
              {card.icon}
            </div>
            <h3 className="text-sm font-bold text-charcoal-900">{card.title}</h3>
          </div>
          <p className="text-xs text-charcoal-500 leading-relaxed">{card.desc}</p>
        </div>
      ))}
    </div>
  );
};
