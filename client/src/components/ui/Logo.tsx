import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'full' | 'emblem';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  showText = true,
}) => {
  // If only emblem requested or showText is false
  if (!showText || variant === 'emblem') {
    const emblemSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };
    return (
      <div
        className={`${emblemSizes[size]} rounded-2xl flex items-center justify-center p-1 relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-xs bg-white border border-[#E2EBE5] shrink-0 ${className}`}
      >
        <img
          src="/S_logo.png"
          alt="Steels Emblem"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Full company branding logo
  const fullSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Steels - Builds a Stronger Tomorrow"
        className={`${fullSizes[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );
};

