import React from 'react';
import { AlertTriangle, ChevronRight, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function QuickAlertsFeed({ alerts = [], onSelectAlert, onNavigateAlerts, className = '' }) {
  return (
    <Card
      title="Recent Anomaly Signals"
      subtitle="Automated alerts from satellite & ground anomaly triggers"
      icon={AlertTriangle}
      action={
        <button
          onClick={onNavigateAlerts}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 hover:underline"
        >
          <span>View All ({alerts.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      }
      className={className}
    >
      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => (
          <div
            key={alert.id}
            onClick={() => onSelectAlert && onSelectAlert(alert)}
            className="p-3.5 rounded-xl bg-aerodark-900 border border-slate-800 hover:border-slate-700 hover:bg-aerodark-800/80 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <Badge
                variant={
                  alert.severity === 'Severe' ? 'severe' :
                  alert.severity === 'Warning' ? 'high' : 'info'
                }
                dot
              >
                {alert.severity}
              </Badge>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{alert.time || alert.timestamp || 'Live'}</span>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors leading-snug">
              {alert.title}
            </h4>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
              <MapPin className="w-3 h-3 text-cyan-400/80" />
              <span className="truncate">{alert.location}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
