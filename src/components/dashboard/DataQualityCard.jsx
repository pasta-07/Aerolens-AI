import React from 'react';
import { ShieldCheck, Satellite, Radio, CloudSun, Award, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function DataQualityCard({ systemStatus, className = '' }) {
  const satellite = systemStatus?.satelliteCoverage || { value: '94%', label: 'Satellite Coverage', detail: 'Sentinel-5P TROPOMI overpass nominal' };
  const ground = systemStatus?.groundStations || { value: '82%', label: 'Ground Stations Available', detail: '344 of 420 CPCB stations live' };
  const weather = systemStatus?.weatherData || { value: 'Available', label: 'Weather Data', detail: 'IMD GFS / ECMWF 3D wind assimilation' };
  const confidence = systemStatus?.modelConfidence || { value: 'High (91.4%)', label: 'Prediction Confidence', detail: 'ConvLSTM ensemble consensus' };

  const items = [
    {
      label: satellite.label,
      value: satellite.value,
      detail: satellite.detail,
      icon: Satellite,
      color: '#38BDF8',
      score: 94,
    },
    {
      label: ground.label,
      value: ground.value,
      detail: ground.detail,
      icon: Radio,
      color: '#34D399',
      score: 82,
    },
    {
      label: weather.label,
      value: weather.value,
      detail: weather.detail,
      icon: CloudSun,
      color: '#FBBF24',
      score: 98,
    },
    {
      label: confidence.label,
      value: confidence.value,
      detail: confidence.detail,
      icon: Award,
      color: '#A78BFA',
      score: 91,
    },
  ];

  return (
    <Card
      title="Data Quality & Model Confidence"
      subtitle="Multi-source sensor fusion telemetry & operational integrity"
      icon={ShieldCheck}
      action={
        <Badge variant="normal" dot>
          Nominal Telemetry
        </Badge>
      }
      className={className}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-aerodark-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 truncate pr-2">
                    {item.label}
                  </span>
                  <div
                    className="p-1.5 rounded-lg border flex-shrink-0"
                    style={{
                      backgroundColor: `${item.color}15`,
                      borderColor: `${item.color}30`,
                      color: item.color,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="text-xl font-bold text-slate-100 font-sans">
                  {item.value}
                </div>

                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                  {item.detail}
                </p>
              </div>

              {/* Integrity bar */}
              <div className="mt-3 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.score}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
