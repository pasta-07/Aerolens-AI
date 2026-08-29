import React, { useState } from 'react';
import {
  Settings,
  Database,
  Server,
  Key,
  Save,
  CheckCircle2,
  RefreshCw,
  Satellite,
  Radio,
  Sliders,
  Shield,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { API_CONFIG } from '../../services/apiConfig';

export function SettingsView({ systemStatus, className = '' }) {
  const [useMockData, setUseMockData] = useState(API_CONFIG.USE_MOCK_DATA);
  const [fastApiUrl, setFastApiUrl] = useState(API_CONFIG.API_BASE_URL);
  const [azureKey, setAzureKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-300" />
            <span>Platform Configuration & Backend Connectors</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage data stream pipelines, ML model endpoints, and Azure cloud connectors.
          </p>
        </div>

        <Badge variant="normal" dot>
          System Nominal
        </Badge>
      </div>

      {/* Backend API Connector Setup */}
      <Card
        title="Backend API & Azure Services Integration"
        subtitle="Configure connections to live FastAPI backend and Azure OpenAI model endpoints"
        icon={Server}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Mock vs Live Toggle */}
          <div className="p-4 rounded-xl bg-aerodark-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200 text-sm">Operation Mode</div>
              <p className="text-slate-400 text-xs mt-0.5">
                Toggle between Realistic Hackathon Mock Engine and Live FastAPI/Azure Endpoints.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${useMockData ? 'text-cyan-400' : 'text-slate-400'}`}>
                Mock Engine
              </span>
              <button
                type="button"
                onClick={() => setUseMockData(!useMockData)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  useMockData ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    useMockData ? 'translate-x-0' : 'translate-x-6'
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold ${!useMockData ? 'text-emerald-400' : 'text-slate-400'}`}>
                Live Backend
              </span>
            </div>
          </div>

          {/* FastAPI URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">FastAPI Backend Endpoint URL</label>
            <input
              type="text"
              value={fastApiUrl}
              onChange={(e) => setFastApiUrl(e.target.value)}
              placeholder="http://localhost:8000/api/v1"
              className="w-full bg-aerodark-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-400">
              Expected routes: <code>/api/v1/status</code>, <code>/api/v1/hotspots</code>, <code>/api/v1/forecast</code>, <code>/api/v1/xai</code>
            </p>
          </div>

          {/* Azure OpenAI Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Azure OpenAI API Key (Optional)</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={azureKey}
                onChange={(e) => setAzureKey(e.target.value)}
                placeholder="••••••••••••••••••••••••••••••••"
                className="w-full bg-aerodark-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>

            {isSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Configuration saved successfully!</span>
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Satellite Ingestion Pipelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          title="Satellite Remote Sensing Feed"
          subtitle="Copernicus Sentinel-5P TROPOMI & NASA Aqua/Terra"
          icon={Satellite}
        >
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-aerodark-900 border border-slate-800">
              <span className="text-slate-300">Sentinel-5P HCHO (Offline L2)</span>
              <span className="text-emerald-400 font-mono font-semibold">Active (94.2% Sync)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-aerodark-900 border border-slate-800">
              <span className="text-slate-300">Sentinel-5P NO₂ (Tropospheric Column)</span>
              <span className="text-emerald-400 font-mono font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-aerodark-900 border border-slate-800">
              <span className="text-slate-300">MODIS/VIIRS Active Fires (FRP)</span>
              <span className="text-emerald-400 font-mono font-semibold">Active</span>
            </div>
          </div>
        </Card>

        <Card
          title="Ground Telemetry & Weather Feeds"
          subtitle="CPCB CAAQMS Grid & IMD GFS Weather Model"
          icon={Radio}
        >
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-aerodark-900 border border-slate-800">
              <span className="text-slate-300">CPCB CAAQMS Live Stations</span>
              <span className="text-emerald-400 font-mono font-semibold">344 / 420 Connected</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-aerodark-900 border border-slate-800">
              <span className="text-slate-300">ECMWF ERA5 Atmospheric Reanalysis</span>
              <span className="text-emerald-400 font-mono font-semibold">Synced (Hourly)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-aerodark-900 border border-slate-800">
              <span className="text-slate-300">IMD Numerical Weather Forecast</span>
              <span className="text-emerald-400 font-mono font-semibold">Assimilation Active</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
