import React, { useEffect, useState } from 'react';
import { Gauge, Flame, AlertOctagon, TrendingDown, Satellite } from 'lucide-react';
import { StatCard } from './StatCard';
import { airQualityService } from '../../services/airQualityService';

export function StatsOverview({ statusData, satelliteHCHO: propSatelliteHCHO }) {
  const [satelliteHCHO, setSatelliteHCHO] = useState(propSatelliteHCHO || null);
  const [hchoLoading, setHchoLoading] = useState(!propSatelliteHCHO);

  useEffect(() => {
    if (propSatelliteHCHO) {
      setSatelliteHCHO(propSatelliteHCHO);
      setHchoLoading(false);
      return;
    }

    async function fetchHCHO() {
      try {
        const data = await airQualityService.getSatelliteHCHO();
        setSatelliteHCHO(data);
      } catch (error) {
        console.error('Failed to fetch satellite HCHO:', error);
      } finally {
        setHchoLoading(false);
      }
    }

    fetchHCHO();
  }, [propSatelliteHCHO]);
  const aqiValue = statusData?.predictedNationalAqi || 287;
  const hotspotsValue = statusData?.activeHotspotsCount || 12;
  const eventsValue = statusData?.pollutionEventsCount || 3;
  const forecastValue = statusData?.forecastTrend || 'Deteriorating';
  const hchoMean = satelliteHCHO?.statistics?.mean;

  return (
    <div className="space-y-6">
      {/* Top Banner Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              National Air Quality Intelligence
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Satellite className="w-3 h-3" /> TROPOMI PASS
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Real-time satellite-powered monitoring, anomaly detection and early warning across India.
          </p>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-aerodark-850 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-mono text-slate-400">Target Airshed:</span>
            <span className="font-semibold text-slate-200">Indo-Gangetic Plain & Coasts</span>
          </div>
        </div>
      </div>

      {/* 4 Main Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Predicted AQI */}
        <StatCard
          title="Predicted AQI"
          value={aqiValue}
          status="Poor"
          statusVariant="poor"
          subtitle="Regional 6h mean forecast"
          trend="+18% vs yesterday"
          trendDirection="up"
          icon={Gauge}
          accentColor="#F97316"
          progress={(aqiValue / 500) * 100}
        />

        {/* Card 2: Active HCHO Hotspots */}
        <StatCard
          title="Live HCHO Level"
          value={
            hchoLoading
              ? 'Loading...'
              : typeof hchoMean === 'number'
              ? `${hchoMean.toExponential(3)} mol/m²`
              : (hchoMean || 'Unavailable')
          }
          status="Satellite Data"
          statusVariant="attention"
          subtitle="Sentinel-5P TROPOMI mean column value"
          trend="Live Copernicus observation"
          trendDirection="neutral"
          icon={Satellite}
          accentColor="#EF4444"
          progress={75}
      />
        {/* Card 3: Pollution Events Detected */}
        <StatCard
          title="Pollution Events Detected"
          value={eventsValue}
          status="Requires Attention"
          statusVariant="attention"
          subtitle="Precursor escalation zones"
          trend="2 Severe / 1 Watch"
          trendDirection="neutral"
          icon={AlertOctagon}
          accentColor="#F59E0B"
          progress={60}
        />

        {/* Card 4: 24-Hour Forecast */}
        <StatCard
          title="24-Hour Forecast"
          value={forecastValue}
          status="High Risk"
          statusVariant="deteriorating"
          subtitle="Peak 342 at 04:00 AM"
          trend="Nocturnal Inversion"
          trendDirection="up"
          icon={TrendingDown}
          accentColor="#E11D48"
          progress={85}
        />
      </div>
    </div>
  );
}
