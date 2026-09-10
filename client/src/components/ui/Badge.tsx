import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'new' | 'contacted' | 'quotation' | 'confirmed' | 'completed' | 'cancelled' | 'available' | 'limited' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    new: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    contacted: 'bg-sky-50 text-sky-800 border-sky-300',
    quotation: 'bg-amber-50 text-amber-900 border-amber-300',
    confirmed: 'bg-teal-50 text-teal-900 border-teal-300',
    completed: 'bg-green-100 text-green-900 border-green-400',
    cancelled: 'bg-red-50 text-red-800 border-red-300',
    available: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    limited: 'bg-amber-50 text-amber-800 border-amber-300',
    default: 'bg-[#F0F5F2] text-[#03281A] border-[#D0DDD4]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider shadow-xs',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
