import React from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepDefinition {
  number: number;
  title: string;
  subtitle: string;
  route: string;
}

const STEP_DEFINITIONS: StepDefinition[] = [
  {
    number: 1,
    title: 'Upload Bill',
    subtitle: 'Upload or photo',
    route: '/split',
  },
  {
    number: 2,
    title: 'Review OCR',
    subtitle: 'Line Items',
    route: '/review',
  },
  {
    number: 3,
    title: 'Add People',
    subtitle: 'Group dinner',
    route: '/add-people',
  },
  {
    number: 4,
    title: 'Assign Items',
    subtitle: 'Tap to claim',
    route: '/assign',
  },
  {
    number: 5,
    title: 'Share Split',
    subtitle: 'Instant link',
    route: '/share',
  },
];

interface ProgressStepperProps {
  currentStep?: number;
  className?: string;
}

export const BillProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep: propStep,
  className,
}) => {
  const location = useLocation();

  // Derive step dynamically if not explicitly provided
  const activeStep = React.useMemo(() => {
    if (propStep !== undefined) return propStep;
    if (location.pathname.startsWith('/share')) return 5;
    if (location.pathname.startsWith('/assign')) return 4;
    if (location.pathname.startsWith('/add-people')) return 3;
    if (location.pathname.startsWith('/review')) return 2;
    return 1;
  }, [propStep, location.pathname]);

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-charcoal-200/90 mb-8 overflow-x-auto scrollbar-none',
        className
      )}
    >
      <div className="flex items-center justify-between min-w-[660px] px-2 sm:px-4">
        {STEP_DEFINITIONS.map((step, idx) => {
          const isCompleted = step.number < activeStep;
          const isActive = step.number === activeStep;
          const isLast = idx === STEP_DEFINITIONS.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-3">
                {/* Step Circle */}
                <div
                  className={cn(
                    'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all flex-shrink-0',
                    isCompleted
                      ? 'bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]'
                      : isActive
                      ? 'bg-[#0D766E] text-white shadow-[0_4px_12px_rgba(13,118,110,0.35)]'
                      : 'bg-charcoal-100 text-charcoal-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.8]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-bold tracking-tight',
                      isActive
                        ? 'text-charcoal-900'
                        : isCompleted
                        ? 'text-charcoal-800'
                        : 'text-charcoal-600'
                    )}
                  >
                    {step.title}
                  </span>

                  {isActive ? (
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#0D766E]">
                      ACTIVE STEP
                    </span>
                  ) : isCompleted ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      Completed
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
                <div
                  className={cn(
                    'flex-1 h-[2px] mx-3 sm:mx-5 min-w-[24px] transition-colors',
                    isCompleted ? 'bg-[#0D766E]/40' : 'bg-charcoal-200/80'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const ProgressStepper = BillProgressStepper;
