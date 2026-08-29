import React from 'react';
import { X, AlertTriangle, CheckCircle, Bell, ChevronRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export function NotificationsModal({ isOpen, onClose, alerts = [], onSelectAlert }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-aerodark-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Live Anomaly Alerts</h2>
                <p className="text-xs text-slate-400">National early warning stream</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alerts List */}
          <div className="mt-4 space-y-3 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (onSelectAlert) onSelectAlert(alert);
                  onClose();
                }}
                className="p-4 rounded-xl bg-aerodark-850 border border-slate-800 hover:border-cyan-500/40 hover:bg-aerodark-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge
                    variant={
                      alert.severity === 'Severe' ? 'severe' :
                      alert.severity === 'Warning' ? 'high' : 'info'
                    }
                    dot
                  >
                    {alert.severity}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">{alert.time}</span>
                </div>

                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors leading-snug">
                  {alert.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {alert.description}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-cyan-400/80">{alert.location}</span>
                  <div className="flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            AeroLens AI Multi-Sensor Pipeline • Sentinel-5P + CPCB Grid
          </p>
        </div>
      </div>
    </div>
  );
}
