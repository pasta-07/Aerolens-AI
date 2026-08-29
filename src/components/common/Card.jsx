import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = '',
  bodyClassName = '',
  hoverEffect = false,
  glowColor,
}) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-aerodark-850/90 border border-slate-800/80 rounded-xl overflow-hidden shadow-lg backdrop-blur-md transition-all duration-200',
          hoverEffect && 'hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-950/20',
          className
        )
      )}
      style={glowColor ? { boxShadow: `0 0 20px -5px ${glowColor}` } : {}}
    >
      {(title || Icon || action) && (
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-aerodark-900/40">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && <h3 className="text-sm font-semibold text-slate-100 tracking-tight truncate">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={twMerge(clsx('p-5', bodyClassName))}>{children}</div>
    </div>
  );
}
