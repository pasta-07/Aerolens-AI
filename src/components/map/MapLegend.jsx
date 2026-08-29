import React from 'react';

export function MapLegend({ activeLayer }) {
  const getLegendContent = () => {
    switch (activeLayer) {
      case 'hcho':
      case 'hotspots':
        return (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              HCHO Anomaly Severity
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span className="text-slate-300">Normal Baseline (&lt;10 ×10¹⁵)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span className="text-slate-300">Moderate Anomaly (10 - 16)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></span>
              <span className="text-slate-300">High Anomaly (16 - 22)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
              <span className="text-slate-300">Severe Anomaly (&gt;22 ×10¹⁵)</span>
            </div>
          </div>
        );

      case 'no2':
        return (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Tropospheric NO₂ Density
            </div>
            <div className="w-full h-2 rounded bg-gradient-to-r from-emerald-500 via-yellow-400 via-orange-500 to-purple-600 mb-1"></div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 µg/m³ (Clean)</span>
              <span>40</span>
              <span>80+ (Critical)</span>
            </div>
          </div>
        );

      case 'aerosol':
        return (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              UV Aerosol Index (UVAI)
            </div>
            <div className="w-full h-2 rounded bg-gradient-to-r from-blue-400 via-amber-400 to-red-600 mb-1"></div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.0 (Clear)</span>
              <span>1.5 (Dust/Haze)</span>
              <span>3.0+ (Dense Smoke)</span>
            </div>
          </div>
        );

      default: // AQI
        return (
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              CPCB NAQI Standard
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-center font-medium">0-50 Good</span>
              <span className="px-1.5 py-0.5 rounded bg-lime-500/20 text-lime-300 text-center font-medium">51-100 Satis.</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-center font-medium">101-200 Mod.</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 text-center font-medium">201-300 Poor</span>
              <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-center font-medium">301-400 V.Poor</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300 text-center font-medium">401-500 Severe</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-aerodark-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shadow-2xl min-w-[220px]">
      {getLegendContent()}
    </div>
  );
}
