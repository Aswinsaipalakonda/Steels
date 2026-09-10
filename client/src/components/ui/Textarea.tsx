import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const textareaId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-bold uppercase tracking-wider text-[#03281A] mb-1.5">
            {label} {props.required && <span className="text-emerald-600">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-[#111814] placeholder:text-zinc-400 transition-all resize-y shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-[#07552B]/30 focus:border-[#07552B]',
            error ? 'border-red-500 focus:ring-red-200' : 'border-[#D0DDD4] hover:border-[#07552B]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-[#697057]">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
