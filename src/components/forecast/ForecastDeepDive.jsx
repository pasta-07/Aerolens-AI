import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Compass,
  AlertTriangle,
  Wind,
  Layers,
  Thermometer,
  Droplets,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ForecastChart } from '../dashboard/ForecastChart';

export function ForecastDeepDive({ forecastData, locations = [], selectedLocation, onSelectLocation }) {
  const cityComparisons = forecastData?.cityComparison || [];
  const insight = forecastData?.insight;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>24-Hour Predictive Forecasting Hub</span>
          </h2>
          <p className="text-xs text-slate-400">
            Ensemble atmospheric dispersion & diurnal photochemical trajectory modeling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" dot>
            Dual-Branch ConvLSTM Active
          </Badge>
        </div>
      </div>

      {/* Main Forecast Visualizer */}
      <ForecastChart forecastData={forecastData} insight={insight} />

      {/* National City Forecast Comparison Grid */}
      <Card
        title="Multi-City Forecast Comparison (Peak 24h Risk)"
        subtitle="Regional air quality trajectory comparison across major metropolitan airsheds"
        icon={Layers}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityComparisons.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-aerodark-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-sm text-slate-200">{item.city}</span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${item.color}15`,
                      borderColor: `${item.color}30`,
                      color: item.color,
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-lg bg-aerodark-950/60 border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current AQI</span>
                    <span className="text-base font-extrabold text-white font-mono">
                      {item.currentAqi}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Peak Forecast</span>
                    <span
                      className="text-base font-extrabold font-mono"
                      style={{ color: item.color }}
                    >
                      {item.peakPredictedAqi}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Delta: +{(item.peakPredictedAqi - item.currentAqi)} pts</span>
                <span className="text-cyan-400">Confidence: 89%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Atmospheric Physics & Diurnal Cycle Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          title="Diurnal Boundary Layer Dynamics"
          subtitle="How temperature inversions modulate nocturnal pollutant trapping"
          icon={Wind}
        >
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-lg bg-aerodark-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block mb-1">00:00 - 06:00 AM (Critical Inversion Phase)</span>
              <p className="text-slate-400 text-xs">
                Ground radiation cooling collapses the planetary boundary layer to ~300 meters. Low horizontal wind (&lt;2.5 km/h) prevents mechanical turbulence, concentrating HCHO and NO₂ within the shallow canopy.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-aerodark-900 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">11:00 AM - 04:00 PM (Solar Expansion & Mixing)</span>
              <p className="text-slate-400 text-xs">
                Intense solar heating destabilizes the surface layer, elevating the mixing boundary layer to &gt;1,000 meters. Atmospheric dilution and thermal updrafts disperse accumulated particulates.
              </p>
            </div>
          </div>
        </Card>

        <Card
          title="Model Physical Assumptions"
          subtitle="Underlying meteorological & chemistry assumptions"
          icon={Compass}
        >
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Assumes persistent calm northwesterly regional wind vector across the Gangetic basin.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Incorporates continuous TROPOMI HCHO column photolysis kinetics (OH radical reaction rates).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Ensemble variance estimated over 16 bootstrap runs with 90% confidence bounds.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
