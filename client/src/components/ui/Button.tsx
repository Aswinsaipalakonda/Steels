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
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-steel-darkest disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-steel-accent hover:bg-steel-rich text-white shadow-lg shadow-steel-accent/20 focus:ring-steel-accent border border-emerald-500/30',
      secondary:
        'bg-steel-forest hover:bg-steel-primary text-white border border-steel-accent/30 focus:ring-steel-accent',
      outline:
        'border border-steel-olive/40 hover:border-steel-accent text-steel-purewhite hover:bg-steel-primary/30 focus:ring-steel-accent',
      accent:
        'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md focus:ring-emerald-400',
      ghost:
        'text-steel-olive hover:text-white hover:bg-steel-forest/50 focus:ring-steel-accent',
      danger:
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
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
