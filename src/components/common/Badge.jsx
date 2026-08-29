import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({ children, variant = 'default', size = 'sm', dot = false, className = '' }) {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    severe: 'bg-red-500/15 text-red-400 border-red-500/40',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
    moderate: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
    normal: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium',
    sm: 'text-xs px-2.5 py-1 font-medium',
    md: 'text-sm px-3 py-1.5 font-medium',
  };

  const dotColors = {
    severe: 'bg-red-500',
    high: 'bg-orange-500',
    moderate: 'bg-amber-500',
    normal: 'bg-emerald-500',
    primary: 'bg-cyan-400',
    default: 'bg-slate-400',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-md border tracking-wide select-none',
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size] || sizeStyles.sm,
          className
        )
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full inline-block animate-pulse',
            dotColors[variant] || dotColors.default
          )}
        />
      )}
      {children}
    </span>
  );
}
