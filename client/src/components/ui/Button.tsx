import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-[#03281A] hover:bg-[#07552B] text-white shadow-md shadow-[#03281A]/15 focus:ring-[#07552B] border border-[#03281A]',
      secondary:
        'bg-[#F0F5F2] hover:bg-[#E3EDE7] text-[#03281A] border border-[#D0DDD4] focus:ring-[#07552B]',
      outline:
        'bg-white border-2 border-[#03281A] hover:bg-[#F0F5F2] text-[#03281A] focus:ring-[#07552B] shadow-sm',
      accent:
        'bg-[#07552B] hover:bg-[#03281A] text-white shadow-md focus:ring-[#07552B]',
      ghost:
        'text-[#03281A] hover:bg-[#F0F5F2] focus:ring-[#07552B]',
      danger:
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-4 py-2 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-7 py-3.5 gap-2.5 font-bold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
