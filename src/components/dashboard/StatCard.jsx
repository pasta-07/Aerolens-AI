import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export function StatCard({
  title,
  value,
  subtitle,
  status,
  statusVariant = 'default',
  trend,
  trendDirection = 'neutral', // 'up' | 'down' | 'neutral'
  icon: Icon,
  accentColor = '#06B6D4',
  progress,
  className = '',
}) {
  const statusStyles = {
    poor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    verypoor: 'bg-red-500/15 text-red-400 border-red-500/30',
    attention: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    deteriorating: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    normal: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div
      className={clsx(
        'p-5 rounded-2xl bg-aerodark-850/90 border border-slate-800 hover:border-slate-700 shadow-xl backdrop-blur-md transition-all duration-200 group relative overflow-hidden',
        className
      )}
    >
      {/* Subtle top glowing accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
              {value}
            </span>
            {status && (
              <span
                className={clsx(
                  'text-xs font-semibold px-2.5 py-0.5 rounded-full border',
                  statusStyles[statusVariant] || statusStyles.default
                )}
              >
                {status}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner flex-shrink-0"
            style={{
              backgroundColor: `${accentColor}15`,
              borderColor: `${accentColor}30`,
              color: accentColor,
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Trend & Subtitle description */}
      <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
        <div className="text-slate-400 truncate pr-2">{subtitle}</div>

        {trend && (
          <div
            className={clsx(
              'flex items-center gap-1 font-mono font-medium flex-shrink-0',
              trendDirection === 'up' && 'text-rose-400',
              trendDirection === 'down' && 'text-emerald-400',
              trendDirection === 'neutral' && 'text-amber-400'
            )}
          >
            {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Optional Range / Mini Progress Bar */}
      {typeof progress === 'number' && (
        <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: accentColor }}
          />
        </div>
      )}
    </div>
  );
}
