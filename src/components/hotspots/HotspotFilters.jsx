import React from 'react';
import { Search, Filter, Flame } from 'lucide-react';
import { clsx } from 'clsx';

export function HotspotFilters({
  selectedSeverity,
  onSelectSeverity,
  searchQuery,
  onSearchChange,
  totalCount,
}) {
  const severities = ['All', 'Severe', 'High', 'Moderate', 'Normal'];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-aerodark-850 border border-slate-800">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Filter by city, state, or industrial source..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-aerodark-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </div>

      {/* Severity Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline">
          Severity:
        </span>
        {severities.map((sev) => {
          const isActive = selectedSeverity.toLowerCase() === sev.toLowerCase();
          return (
            <button
              key={sev}
              onClick={() => onSelectSeverity(sev)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap',
                isActive
                  ? sev === 'Severe'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                    : sev === 'High'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                    : sev === 'Moderate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : sev === 'Normal'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-aerodark-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              )}
            >
              {sev}
            </button>
          );
        })}
      </div>
    </div>
  );
}
