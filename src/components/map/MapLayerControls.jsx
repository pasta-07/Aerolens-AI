import React from 'react';
import { Layers, Flame, Gauge, CloudFog, SunMedium, Sparkles, Radio } from 'lucide-react';
import { clsx } from 'clsx';

export function MapLayerControls({ activeLayer, onSelectLayer, className = '' }) {
  const layers = [
    { id: 'hotspots', label: 'HCHO Hotspots', icon: Flame, color: 'text-red-400', badge: 'TROPOMI' },
    { id: 'ground_stations', label: 'Ground Stations', icon: Radio, color: 'text-emerald-400', badge: 'CPCB Live' },
    { id: 'aqi', label: 'AQI Index', icon: Gauge, color: 'text-orange-400', badge: 'ML Fused' },
    { id: 'hcho', label: 'HCHO Anomaly', icon: Sparkles, color: 'text-cyan-400', badge: 'Precursor' },
    { id: 'no2', label: 'Tropospheric NO₂', icon: CloudFog, color: 'text-purple-400', badge: 'Combustion' },
    { id: 'aerosol', label: 'Aerosol Index (UVAI)', icon: SunMedium, color: 'text-amber-400', badge: 'Smoke/Dust' },
  ];

  return (
    <div
      className={clsx(
        'bg-aerodark-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-wrap items-center gap-1.5',
        className
      )}
    >
      <div className="flex items-center gap-1.5 px-3 py-1 text-slate-400 text-xs font-semibold uppercase tracking-wider border-r border-slate-800">
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Active Layer:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
              )}
            >
              <Icon className={clsx('w-3.5 h-3.5', isActive ? 'text-cyan-300' : layer.color)} />
              <span>{layer.label}</span>
              {layer.badge && (
                <span
                  className={clsx(
                    'text-[9px] font-mono px-1 py-0.2 rounded',
                    isActive ? 'bg-cyan-500/30 text-white' : 'bg-slate-800 text-slate-400'
                  )}
                >
                  {layer.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
