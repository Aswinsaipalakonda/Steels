import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // 'light' is dark green on white/light bg, 'dark' is white on dark bg
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  showText = true,
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const subtextSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Steel Monogram Icon */}
      <div
        className={`${iconSizes[size]} rounded-xl flex items-center justify-center relative overflow-hidden transition-transform duration-300 hover:scale-105 shadow-sm ${
          isLight
            ? 'bg-[#03281A] text-white border border-[#07552B]'
            : 'bg-white text-[#03281A] border border-emerald-200'
        }`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Top Flange of Steel I-Beam */}
          <rect x="8" y="7" width="24" height="4" rx="1.5" fill={isLight ? '#34D399' : '#03281A'} />
          
          {/* Vertical Structural Web with 'S' Geometry */}
          <path
            d="M24 11V18C24 19.1046 23.1046 20 22 20H18C16.8954 20 16 20.8954 16 22V29"
            stroke={isLight ? '#FFFFFF' : '#03281A'}
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Center Precision Rivet Accent */}
          <circle cx="20" cy="20" r="2" fill={isLight ? '#34D399' : '#07552B'} />
          
          {/* Bottom Flange of Steel I-Beam */}
          <rect x="8" y="29" width="24" height="4" rx="1.5" fill={isLight ? '#34D399' : '#03281A'} />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight uppercase leading-none font-sans ${textSizes[size]} ${
              isLight ? 'text-[#03281A]' : 'text-white'
            }`}
          >
            Steels
          </span>
          {showSubtitle && (
            <span
              className={`font-bold tracking-widest uppercase mt-0.5 leading-none ${subtextSizes[size]} ${
                isLight ? 'text-[#697057]' : 'text-emerald-300'
              }`}
            >
              Industrial
            </span>
          )}
        </div>
      )}
    </div>
  );
};
