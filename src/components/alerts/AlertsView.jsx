import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Clock,
  MapPin,
  CheckCircle2,
  Filter,
  ShieldAlert,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

export function AlertsView({ alerts = [], onSelectAlert, className = '' }) {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSev =
      severityFilter === 'All' || alert.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Early Warning & Anomaly Alert Stream</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time incident notifications, public health advisories & enforcement triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="severe" dot>
            {alerts.filter(a => a.severity === 'Severe').length} Critical Active
          </Badge>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-aerodark-850 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search alerts by incident or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-aerodark-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Severe', 'Warning', 'Info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                severityFilter.toLowerCase() === sev.toLowerCase()
                  ? sev === 'Severe'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : sev === 'Warning'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : sev === 'Info'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-aerodark-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-aerodark-850 border border-slate-800 text-center text-slate-400 text-xs">
            No alerts found matching filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
              className="p-5 rounded-2xl bg-aerodark-850 border border-slate-800 hover:border-cyan-500/40 hover:bg-aerodark-800/90 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <Badge
                    variant={
                      alert.severity === 'Severe' ? 'severe' :
                      alert.severity === 'Warning' ? 'high' : 'info'
                    }
                    dot
                  >
                    {alert.severity} Incident
                  </Badge>
                  <span className="text-xs text-cyan-400 font-mono font-medium">
                    {alert.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alert.time}</span>
                  </div>
                  {alert.impactedPopulation !== 'N/A' && (
                    <div className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.impactedPopulation} Affected</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {alert.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-400">Action:</span>
                  <span className="text-cyan-300 font-medium">{alert.actionRequired}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] self-start sm:self-auto">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{alert.location}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
