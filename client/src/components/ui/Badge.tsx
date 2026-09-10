import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'new' | 'contacted' | 'quotation' | 'confirmed' | 'completed' | 'cancelled' | 'available' | 'limited' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    new: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
    contacted: 'bg-blue-950/80 text-blue-300 border-blue-700/50',
    quotation: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
    confirmed: 'bg-teal-950/80 text-teal-300 border-teal-700/50',
    completed: 'bg-green-950/80 text-green-300 border-green-600/50',
    cancelled: 'bg-red-950/80 text-red-300 border-red-700/50',
    available: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    limited: 'bg-amber-950 text-amber-400 border-amber-800',
    default: 'bg-steel-rich/60 text-steel-offwhite border-steel-accent/40',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
