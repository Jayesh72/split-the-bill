import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = 'w-5 h-5', size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="3" y="2" width="18" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 15H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="15" r="2" fill="currentColor" />
    </svg>
  );
};
