import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, AlertTriangle, Info, Clock, Compass } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { mockHourlyForecast, mockForecastInsight } from '../../data/mockForecast';

export function ForecastChart({ forecastData, insight, className = '' }) {
  const [selectedMetric, setSelectedMetric] = useState('aqi'); // 'aqi' | 'pm25' | 'hcho' | 'no2'

  const rawHourly = forecastData?.hourly && forecastData.hourly.length > 0 ? forecastData.hourly : mockHourlyForecast;
  const hourlyData = rawHourly.map((d) => ({
    ...d,
    time: d.time || d.hour || (d.timestamp ? d.timestamp.split(' ')[0] : '12:00'),
    timestamp: d.timestamp || d.time || d.hour,
    aqi: Number(d.aqi) || 0,
    pm25: Number(d.pm25) || 0,
    hcho: Number(d.hcho) || 0,
    no2: Number(d.no2) || 0,
    windSpeed: d.windSpeed ?? 3.5,
    pblHeight: d.pblHeight ?? 450,
  }));

  const forecastInsight = insight || forecastData?.insight || mockForecastInsight;

  const metricConfig = {
    aqi: { name: 'AQI Index', color: '#F97316', unit: '', domain: ['auto', 'auto'], ref: 200 },
    pm25: { name: 'PM2.5', color: '#EF4444', unit: 'µg/m³', domain: ['auto', 'auto'], ref: 60 },
    hcho: { name: 'HCHO Column', color: '#06B6D4', unit: '×10¹⁵', domain: ['auto', 'auto'], ref: 15 },
    no2: { name: 'Tropospheric NO₂', color: '#A855F7', unit: 'µg/m³', domain: ['auto', 'auto'], ref: 40 },
  };

  const currentMetric = metricConfig[selectedMetric];
  const currentItem = hourlyData.find((d) => d.isCurrent) || hourlyData[11] || hourlyData[0];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-aerodark-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[180px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="font-bold text-slate-200">{data.timestamp}</span>
            <Badge
              variant={data.isForecast ? 'purple' : 'info'}
              size="xs"
            >
              {data.isForecast ? 'AI Forecast' : data.isCurrent ? 'Current' : 'Historical'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">AQI Index:</span>
            <span className="font-bold text-orange-400 font-mono text-sm">{data.aqi}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">PM2.5:</span>
            <span className="font-mono text-slate-200">{data.pm25} µg/m³</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">HCHO Anomaly:</span>
            <span className="font-mono text-cyan-400">{data.hcho} ×10¹⁵</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Wind Velocity:</span>
            <span className="font-mono text-slate-300">{data.windSpeed} km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Boundary Layer:</span>
            <span className="font-mono text-emerald-400">{data.pblHeight} m</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="AQI: Previous 12 Hours + Next 24 Hours Forecast"
      subtitle="Multi-scale ConvLSTM atmospheric transport & precursor projection"
      icon={TrendingUp}
      action={
        <div className="flex items-center gap-1.5 bg-aerodark-950 p-1 rounded-lg border border-slate-800">
          {Object.entries(metricConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedMetric === key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {config.name}
            </button>
          ))}
        </div>
      }
      className={className}
    >
      {/* Visual Chart Area */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={hourlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="historicalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
              interval={3}
            />
            <YAxis
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
              domain={currentMetric.domain}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference Line for Current Time */}
            {currentItem?.time && (
              <ReferenceLine
                x={currentItem.time}
                stroke="#06B6D4"
                strokeDasharray="4 4"
                label={{
                  value: 'NOW',
                  fill: '#22D3EE',
                  fontSize: 10,
                  position: 'top',
                  fontWeight: 'bold',
                }}
              />
            )}

            {/* Historical Zone */}
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={2.5}
              fill="url(#forecastAreaGrad)"
              activeDot={{ r: 5, fill: currentMetric.color, stroke: '#FFFFFF', strokeWidth: 1.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Period Division Indicators */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-400 inline-block"></span>
            <span className="text-slate-400">Past 12h Observations (CPCB Ground + Satellite)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-orange-400 inline-block border-t border-dashed"></span>
            <span className="text-slate-400">Next 24h AI Ensemble Forecast</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
          <Clock className="w-3 h-3" />
          <span>Next Cycle: 23:00 IST</span>
        </div>
      </div>

      {/* Forecast Insight Summary Card */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-aerodark-800 to-slate-900 border border-slate-700/80 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Forecast Insight</span>
              <span className="text-[10px] font-normal px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Atmospheric Compression
              </span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong>Air quality is expected to deteriorate over the next 12 hours</strong> due to low wind conditions (3.2 km/h) and elevated precursor concentrations (NO₂ & HCHO). Peak deterioration expected between 03:00 AM – 05:00 AM IST (AQI ~342).
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
