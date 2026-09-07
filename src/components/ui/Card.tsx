import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat' | 'inset' | 'interactive';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'elevated',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const variantStyles = {
    elevated: 'bg-white shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/80',
    flat: 'bg-white border border-charcoal-200/80 shadow-sm',
    inset: 'bg-[#F8FAFC] border border-charcoal-200/90 shadow-[inset_0_2px_4px_0_rgba(15,23,42,0.03)]',
    interactive: 'bg-white shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] border border-charcoal-200/80 hover:shadow-[0_16px_36px_-6px_rgba(15,23,42,0.1)] hover:-translate-y-1 cursor-pointer',
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
};
