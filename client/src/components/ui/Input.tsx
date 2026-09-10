import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-steel-olive mb-1.5">
            {label} {props.required && <span className="text-emerald-400">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-steel-forest/80 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 transition-colors',
            'focus:outline-none focus:ring-1 focus:ring-steel-accent focus:border-steel-accent',
            error ? 'border-red-500 focus:ring-red-500' : 'border-steel-rich hover:border-steel-accent/60',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-steel-olive">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
