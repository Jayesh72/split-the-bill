import React from 'react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  subtitle: string;
  badge?: string;
  status: 'active' | 'upcoming' | 'completed';
}

export const BillProgressStepper: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Upload Bill',
      subtitle: 'Active Step',
      badge: 'ACTIVE STEP',
      status: 'active',
    },
    {
      number: 2,
      title: 'Review OCR',
      subtitle: 'Line Items',
      status: 'upcoming',
    },
    {
      number: 3,
      title: 'Add People',
      subtitle: 'Group dinner',
      status: 'upcoming',
    },
    {
      number: 4,
      title: 'Assign Items',
      subtitle: 'Tap to claim',
      status: 'upcoming',
    },
    {
      number: 5,
      title: 'Share Split',
      subtitle: 'Instant link',
      status: 'upcoming',
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-charcoal-200/90 mb-8 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[640px] px-2 sm:px-4">
        {steps.map((step, idx) => {
          const isActive = step.status === 'active';
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-3">
                {/* Step Circle */}
                <div
                  className={cn(
                    'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all flex-shrink-0',
                    isActive
                      ? 'bg-[#0D766E] text-white shadow-[0_4px_12px_rgba(13,118,110,0.35)]'
                      : 'bg-charcoal-100 text-charcoal-500'
                  )}
                >
                  {step.number}
                </div>

                {/* Step Text Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-xs sm:text-sm font-bold tracking-tight',
                        isActive ? 'text-charcoal-900' : 'text-charcoal-700'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {isActive && step.badge ? (
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#0D766E]">
                      {step.badge}
                    </span>
                  ) : (
                    <span className="text-[11px] text-charcoal-500 font-normal">
                      {step.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 h-[2px] bg-charcoal-200/80 mx-3 sm:mx-5 min-w-[24px]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
