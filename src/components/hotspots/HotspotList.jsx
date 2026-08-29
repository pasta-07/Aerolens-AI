import React, { useState } from 'react';
import {
  Flame,
  LayoutList,
  LayoutGrid,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { HotspotFilters } from './HotspotFilters';
import { Badge } from '../common/Badge';
import { getAqiCategory, getSeverityStyle } from '../../utils/aqiUtils';

export function HotspotList({
  hotspots = [],
  selectedHotspot,
  onSelectHotspot,
  onInspectXAI,
  className = '',
}) {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const filteredHotspots = hotspots.filter((h) => {
    const matchesSev =
      severityFilter === 'All' || h.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.primarySource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Title & View Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            <span>Pollution Hotspot Analysis</span>
          </h2>
          <p className="text-xs text-slate-400">
            Detected TROPOMI HCHO anomalies & localized precursor surge registry across India.
          </p>
        </div>

        {/* Table / Grid Switcher */}
        <div className="flex items-center gap-1 bg-aerodark-850 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            aria-label="Table view"
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Table View"
          >
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            aria-label="Cards view"
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'cards'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <HotspotFilters
        selectedSeverity={severityFilter}
        onSelectSeverity={setSeverityFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredHotspots.length}
      />

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl border border-slate-800 bg-aerodark-850/90 overflow-hidden shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-aerodark-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Location & Region</th>
                  <th className="px-4 py-3.5">HCHO Anomaly Severity</th>
                  <th className="px-4 py-3.5">Current AQI</th>
                  <th className="px-4 py-3.5">Predicted AQI</th>
                  <th className="px-4 py-3.5">AI Confidence</th>
                  <th className="px-4 py-3.5">Detection Time</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Diagnostic Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredHotspots.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      No hotspots matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredHotspots.map((hotspot) => {
                    const aqiInfo = getAqiCategory(hotspot.currentAqi);
                    const isSelected = selectedHotspot?.id === hotspot.id;

                    return (
                      <tr
                        key={hotspot.id}
                        onClick={() => onSelectHotspot(hotspot)}
                        className={`hover:bg-slate-800/40 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-cyan-500/10' : ''
                        }`}
                      >
                        {/* Location */}
                        <td className="px-5 py-3.5 font-medium text-slate-200">
                          <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {hotspot.name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{hotspot.state}</span>
                          </div>
                        </td>

                        {/* Severity */}
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={
                              hotspot.severity === 'Severe' ? 'severe' :
                              hotspot.severity === 'High' ? 'high' :
                              hotspot.severity === 'Moderate' ? 'moderate' : 'normal'
                            }
                            dot
                          >
                            {hotspot.severity}
                          </Badge>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            {hotspot.hchoAnomalyRatio} vs base
                          </div>
                        </td>

                        {/* Current AQI */}
                        <td className="px-4 py-3.5 font-mono">
                          <div className="font-bold text-slate-100 text-sm">{hotspot.currentAqi}</div>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${aqiInfo.bg} ${aqiInfo.text}`}>
                            {hotspot.aqiCategory}
                          </span>
                        </td>

                        {/* Predicted AQI */}
                        <td className="px-4 py-3.5 font-mono">
                          <div className="font-bold text-rose-400 text-sm flex items-center gap-1">
                            <span>{hotspot.predictedAqi}</span>
                            <TrendingUp className="w-3 h-3 text-rose-400" />
                          </div>
                          <div className="text-[10px] text-slate-400">Peak 6h forecast</div>
                        </td>

                        {/* Confidence */}
                        <td className="px-4 py-3.5 font-mono">
                          <span className="font-semibold text-emerald-400">{hotspot.confidence}%</span>
                          <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${hotspot.confidence}%` }}
                            />
                          </div>
                        </td>

                        {/* Detection Time */}
                        <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {hotspot.detectionTime}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                            hotspot.actionStatus === 'Alert Dispatched'
                              ? 'bg-red-500/15 text-red-400 border-red-500/30'
                              : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          }`}>
                            {hotspot.actionStatus}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectHotspot(hotspot);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-aerodark-800 hover:bg-cyan-500/20 text-cyan-400 border border-slate-700 hover:border-cyan-500/30 transition-all font-semibold"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHotspots.map((hotspot) => {
            const aqiInfo = getAqiCategory(hotspot.currentAqi);
            const isSelected = selectedHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                onClick={() => onSelectHotspot(hotspot)}
                className={`p-5 rounded-2xl bg-aerodark-850 border border-slate-800 hover:border-cyan-500/40 hover:bg-aerodark-800 transition-all cursor-pointer group shadow-lg flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-cyan-400' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge
                      variant={
                        hotspot.severity === 'Severe' ? 'severe' :
                        hotspot.severity === 'High' ? 'high' :
                        hotspot.severity === 'Moderate' ? 'moderate' : 'normal'
                      }
                      dot
                    >
                      {hotspot.severity}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">{hotspot.detectionTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {hotspot.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{hotspot.state}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 bg-aerodark-900/90 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Current AQI</span>
                      <div className="font-extrabold text-white font-mono text-lg">
                        {hotspot.currentAqi}
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${aqiInfo.bg} ${aqiInfo.text}`}>
                        {hotspot.aqiCategory}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Predicted (6h)</span>
                      <div className="font-extrabold text-rose-400 font-mono text-lg flex items-center gap-1">
                        <span>{hotspot.predictedAqi}</span>
                        <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <span className="text-[10px] text-rose-400/80 font-mono font-medium">
                        {hotspot.predictedCategory}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    <span className="text-slate-400 font-semibold">Source: </span>
                    <span className="text-slate-300">{hotspot.primarySource}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400">
                    Confidence: {hotspot.confidence}%
                  </span>
                  <div className="flex items-center gap-1 text-xs text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Inspect Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
