import React from 'react';
import {
  Sparkles,
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  Award,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { XAIExplanation } from '../dashboard/XAIExplanation';

export function XAIAnalyticsView({ xaiData, className = '' }) {
  const model = xaiData?.explanation?.modelDetails || {
    architecture: 'Dual-Branch Spatial-Temporal Hybrid: ConvLSTM-3D + Gradient Boosted Trees',
    satelliteInputs: ['Sentinel-5P TROPOMI (HCHO L2, NO2 L2, UVAI)', 'MODIS/VIIRS Fire Radiative Power'],
    groundInputs: ['CPCB CAAQMS Real-Time Sensor Telemetry (420 Nodes)'],
    meteorologicalInputs: ['ECMWF ERA5 / IMD GFS Weather Model (3D Winds, PBL, RH, Temp)'],
    trainingDataset: '4.8 Million Geocoded Observation Vectors (2021-2026)',
    validationR2: '0.924 Test R² (RMSE: 14.8 AQI Points)',
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Explainable AI (XAI) & Attribution Hub</span>
          </h2>
          <p className="text-xs text-slate-400">
            Deconstructing deep ensemble predictions with SHAP attribution & scientific transparency.
          </p>
        </div>

        <Badge variant="purple" dot>
          XAI Engine Active
        </Badge>
      </div>

      {/* Main Factor Contribution Card */}
      <XAIExplanation xaiData={xaiData} />

      {/* Model Architecture & Technical Credibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          title="Model Architecture & Training Foundations"
          subtitle="Dual-Branch Spatial-Temporal Network Specifications"
          icon={Cpu}
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-aerodark-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Deep Learning Backbone
              </span>
              <div className="font-bold text-slate-100">{model.architecture}</div>
              <p className="text-slate-400 text-[11px]">
                3D-Convolutional layers capture spatial advection patterns while LSTM cells model diurnal chemical decay dynamics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-aerodark-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Ensemble Accuracy (R²)
                </span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">
                  {model.validationR2.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Test Airshed Validation</span>
              </div>

              <div className="p-3 rounded-xl bg-aerodark-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Ground Truth Dataset
                </span>
                <span className="text-lg font-extrabold text-cyan-400 font-mono">
                  4.8M Vectors
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">420 CPCB Stations</span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="Multi-Scale Input Data Streams"
          subtitle="How satellite remote sensing fuses with ground stations"
          icon={Database}
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-aerodark-900 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <span>1. Satellite Remote Sensing (Top-Down)</span>
              </div>
              <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                <li>Sentinel-5P TROPOMI Tropospheric HCHO column density</li>
                <li>Tropospheric NO₂ vertical column density</li>
                <li>UV Aerosol Index (UVAI) for smoke/dust identification</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-aerodark-900 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <span>2. Ground Surface Monitoring (Bottom-Up)</span>
              </div>
              <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                <li>Continuous Ambient Air Quality Monitoring Stations (CAAQMS)</li>
                <li>Real-time PM2.5, PM10, SO₂, CO, and ground Ozone</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-aerodark-900 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                <span>3. Meteorological Assimilation</span>
              </div>
              <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                <li>IMD GFS / ECMWF 3D wind velocity vector fields</li>
                <li>Planetary Boundary Layer (PBL) inversion depth and humidity</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
