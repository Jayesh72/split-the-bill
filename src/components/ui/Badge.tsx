import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'teal' | 'subtle-teal' | 'gray' | 'outline' | 'pill-user';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'teal',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center text-xs font-medium rounded-full transition-colors';

  const variantStyles = {
    teal: 'bg-brand-50 text-brand-700 border border-brand-200/60 px-2.5 py-0.5',
    'subtle-teal': 'bg-[#E6F4EA] text-[#0D766E] font-semibold px-2 py-0.5 text-[11px]',
    gray: 'bg-charcoal-100 text-charcoal-600 px-2 py-0.5 text-[11px]',
    outline: 'border border-charcoal-200 text-charcoal-600 bg-white/60 px-2.5 py-0.5',
    'pill-user': 'bg-[#CCFBF1]/80 text-[#0F766E] border border-[#99F6E4]/70 px-2.5 py-0.5 font-medium text-[11px]',
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
};
