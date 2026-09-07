import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantStyles = {
    primary: 'bg-brand text-white hover:bg-brand-800 shadow-[0_4px_14px_0_rgba(13,118,110,0.35)] hover:shadow-[0_6px_18px_0_rgba(13,118,110,0.45)] hover:-translate-y-0.5 active:translate-y-0 rounded-full',
    secondary: 'bg-white text-charcoal-800 hover:bg-charcoal-50 border border-charcoal-200 shadow-sm hover:border-charcoal-300 hover:-translate-y-0.5 active:translate-y-0 rounded-full',
    ghost: 'text-charcoal-700 hover:text-charcoal-900 hover:bg-charcoal-100/60 rounded-full',
    outline: 'border border-charcoal-200 text-charcoal-800 hover:bg-white/80 hover:border-charcoal-300 rounded-full',
    pill: 'bg-white text-charcoal-700 hover:text-charcoal-900 shadow-sm border border-charcoal-200/80 rounded-full',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
