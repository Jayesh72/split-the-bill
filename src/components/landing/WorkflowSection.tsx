import React from 'react';
import { Camera, ScanText, Users, QrCode, Zap, Check, SlidersHorizontal } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Scan or Snap',
      desc: 'Upload a bill image directly from your gallery, take a quick photo of the physical slip, or paste the text receipt.',
      badgeText: 'Takes < 2 seconds',
      badgeIcon: <Zap className="w-3 h-3 text-[#0D766E] fill-[#0D766E]" />,
      icon: <Camera className="w-5 h-5 text-[#0D766E]" strokeWidth={2} />,
    },
    {
      num: '02',
      title: 'AI Auto-Extracts',
      desc: 'Intelligent OCR parses every dish, quantity, price, GST, VAT, and service charge accurately without manual typing.',
      badgeText: 'Sub-second precision',
      badgeIcon: <Check className="w-3 h-3 text-[#0D766E]" strokeWidth={2.5} />,
      icon: <ScanText className="w-5 h-5 text-[#0D766E]" strokeWidth={2} />,
    },
    {
      num: '03',
      title: 'Assign Companions',
      desc: 'One tap assigns dishes to individuals. Easily split shared starters, pizzas, or bottle drinks between custom subgroups.',
      badgeText: 'Smart group splits',
      badgeIcon: <SlidersHorizontal className="w-3 h-3 text-[#0D766E]" strokeWidth={2} />,
      icon: <Users className="w-5 h-5 text-[#0D766E]" strokeWidth={2} />,
    },
    {
      num: '04',
      title: 'Instant UPI & QR Share',
      desc: 'Each friend receives an itemized WhatsApp card and direct one-click UPI links (GPay, PhonePe, Paytm).',
      badgeText: 'Zero pending debts',
      badgeIcon: <Check className="w-3 h-3 text-[#0D766E]" strokeWidth={2.5} />,
      icon: <QrCode className="w-5 h-5 text-[#0D766E]" strokeWidth={2} />,
    },
  ];

  return (
    <section id="workflow" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Section Header with Left-Right alignment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D766E] block mb-1.5">
            ZERO FRICTION WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Land. Use. Split. Share.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-md leading-relaxed">
          No sign-up barriers, no account setup, no app installs. Solve the tab before the waiter
          comes back with the card machine.
        </p>
      </div>

      {/* 4 Process Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.05)] hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-200 group"
          >
            <div>
              {/* Card Top: Number & Icon */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-extrabold text-charcoal-300 group-hover:text-charcoal-400 transition-colors tracking-tight">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] border border-[#A7F3D0]/70 flex items-center justify-center text-[#0D766E] shadow-sm">
                  {step.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-charcoal-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {step.desc}
              </p>
            </div>

            {/* Bottom Badge */}
            <div className="mt-8 pt-4 border-t border-charcoal-100">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0D766E]">
                <span>{step.badgeText}</span>
                {step.badgeIcon}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
