import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, options, children, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-steel-olive mb-1.5">
            {label} {props.required && <span className="text-emerald-400">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full bg-steel-forest/80 border rounded-lg px-3.5 py-2.5 text-sm text-white transition-colors appearance-none pr-10 cursor-pointer',
              'focus:outline-none focus:ring-1 focus:ring-steel-accent focus:border-steel-accent',
              error ? 'border-red-500 focus:ring-red-500' : 'border-steel-rich hover:border-steel-accent/60',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-steel-darkest text-white">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="w-4 h-4 text-steel-olive absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-xs text-red-400 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-steel-olive">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
