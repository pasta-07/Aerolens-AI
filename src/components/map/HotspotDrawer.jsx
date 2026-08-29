import React from 'react';
import {
  X,
  AlertTriangle,
  Flame,
  Gauge,
  Wind,
  Droplets,
  Thermometer,
  Sparkles,
  ShieldAlert,
  Clock,
  MapPin,
  TrendingUp,
  Radio,
  Satellite,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { getAqiCategory, getSeverityStyle } from '../../utils/aqiUtils';

export function HotspotDrawer({ hotspot, onClose, onInspectXAI }) {
  if (!hotspot) return null;

  const aqiInfo = getAqiCategory(hotspot.currentAqi);
  const predInfo = getAqiCategory(hotspot.predictedAqi);
  const sevStyle = getSeverityStyle(hotspot.severity);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-aerodark-900/95 backdrop-blur-xl border-l border-slate-700/80 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      <div>
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 bg-aerodark-950/60 sticky top-0 z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    hotspot.severity === 'Severe' ? 'severe' :
                    hotspot.severity === 'High' ? 'high' :
                    hotspot.severity === 'Moderate' ? 'moderate' : 'normal'
                  }
                  dot
                  size="sm"
                >
                  {hotspot.severity} Anomaly
                </Badge>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {hotspot.state}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {hotspot.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Coords: {(hotspot.lat ?? hotspot.latitude ?? 28.6139).toFixed(4)}°N, {(hotspot.lng ?? hotspot.longitude ?? 77.2090).toFixed(4)}°E
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close hotspot drawer"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prominent Status Banner */}
          <div
            className={`mt-4 p-3.5 rounded-xl border flex items-center gap-3 ${
              hotspot.severity === 'Severe'
                ? 'bg-red-500/15 border-red-500/40 text-red-300'
                : hotspot.severity === 'High'
                ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
            }`}
          >
            <div className="p-2 rounded-lg bg-black/30 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black tracking-wider uppercase font-sans">
                {hotspot.statusBadge || 'HIGH-SEVERITY ANOMALY DETECTED'}
              </div>
              <div className="text-[11px] opacity-90 leading-tight mt-0.5">
                {hotspot.hchoAnomalyRatio} above seasonal tropospheric baseline
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Metrics Body */}
        <div className="p-6 space-y-6">
          {/* AQI Comparison Grid: Current vs Predicted */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Air Quality Index (NAQI) Dynamics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Current AQI */}
              <div className="p-4 rounded-xl bg-aerodark-850 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block mb-1">
                  Current Surface AQI
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {hotspot.currentAqi}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${aqiInfo.bg} ${aqiInfo.text}`}>
                    {hotspot.aqiCategory}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  CPCB CAAQMS Station Sync
                </div>
              </div>

              {/* Predicted AQI */}
              <div className="p-4 rounded-xl bg-aerodark-850 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block mb-1">
                  Predicted Peak AQI (6h)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-rose-400 font-mono">
                    {hotspot.predictedAqi}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${predInfo.bg} ${predInfo.text}`}>
                    {hotspot.predictedCategory}
                  </span>
                </div>
                <div className="text-[10px] text-rose-400/80 mt-2 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Deteriorating Trajectory
                </div>
              </div>
            </div>
          </div>

          {/* Key Atmospheric Precursor Metrics */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Satellite & Chemical Telemetry
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-aerodark-800/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">HCHO Column</span>
                <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">
                  {hotspot.hchoLevel} <span className="text-[10px] font-normal text-slate-400">×10¹⁵</span>
                </span>
                <span className="text-[10px] text-slate-400">TROPOMI L2</span>
              </div>

              <div className="p-3 rounded-xl bg-aerodark-800/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">NO₂ Density</span>
                <span className="text-sm font-bold text-purple-400 font-mono mt-0.5 block">
                  {hotspot.no2Level} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
                </span>
                <span className="text-[10px] text-slate-400">Traffic/Combustion</span>
              </div>

              <div className="p-3 rounded-xl bg-aerodark-800/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Aerosol Index</span>
                <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">
                  {hotspot.aerosolIndex || 2.45} <span className="text-[10px] font-normal text-slate-400">UVAI</span>
                </span>
                <span className="text-[10px] text-slate-400">Plume Density</span>
              </div>

              <div className="p-3 rounded-xl bg-aerodark-800/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">PM2.5 Mass</span>
                <span className="text-sm font-bold text-slate-100 font-mono mt-0.5 block">
                  {hotspot.pm25} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
                </span>
                <span className="text-[10px] text-slate-400">Fine Particulate</span>
              </div>

              <div className="p-3 rounded-xl bg-aerodark-800/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">PM10 Mass</span>
                <span className="text-sm font-bold text-slate-100 font-mono mt-0.5 block">
                  {hotspot.pm10} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
                </span>
                <span className="text-[10px] text-slate-400">Coarse Dust</span>
              </div>

              <div className="p-3 rounded-xl bg-aerodark-800/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">AI Confidence</span>
                <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                  {hotspot.confidence}%
                </span>
                <span className="text-[10px] text-slate-400">Ensemble Match</span>
              </div>
            </div>
          </div>

          {/* Meteorological Dispersion Conditions */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Meteorological Dispersion Fields
            </h4>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-aerodark-850 border border-slate-800 flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Wind Velocity</div>
                  <div className="font-bold text-slate-200 font-mono">
                    {hotspot.windSpeed} km/h ({hotspot.windDirection})
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-aerodark-850 border border-slate-800 flex items-center gap-2.5">
                <Thermometer className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Temperature</div>
                  <div className="font-bold text-slate-200 font-mono">
                    {hotspot.temperature}°C
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-aerodark-850 border border-slate-800 flex items-center gap-2.5">
                <Droplets className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Humidity</div>
                  <div className="font-bold text-slate-200 font-mono">
                    {hotspot.humidity}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Precursor Source & Advisory */}
          <div className="p-4 rounded-xl bg-aerodark-850 border border-slate-800 space-y-2.5">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Attributed Source Category
              </span>
              <p className="text-xs font-bold text-cyan-300">
                {hotspot.primarySource}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Scientific Advisory
              </span>
              <p className="text-slate-300 text-xs">
                {hotspot.advisory}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{hotspot.satPassTime}</span>
              <span>Updated: {hotspot.detectionTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 border-t border-slate-800 bg-aerodark-950/80 flex items-center gap-3">
        <button
          onClick={() => onInspectXAI && onInspectXAI(hotspot)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explain AI Prediction (XAI)</span>
        </button>
        <button
          onClick={onClose}
          className="py-2.5 px-4 rounded-xl bg-aerodark-800 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
