import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Flame,
  TrendingUp,
  Activity,
  AlertTriangle,
  BotMessageSquare,
  Settings,
  Satellite,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar({ activeTab, onSelectTab, isCollapsed, onToggleCollapse }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'map', label: 'India Map', icon: MapIcon, badge: 'Live GIS' },
    { id: 'sql_ml', label: 'SQL & ML Studio', icon: Database, badge: 'SQLite & ML' },
    { id: 'hotspots', label: 'Hotspots', icon: Flame, badge: '12 Active' },
    { id: 'forecast', label: 'AQI Forecast', icon: TrendingUp, badge: '24h' },
    { id: 'analytics', label: 'Explainable AI', icon: Activity, badge: 'XAI' },
    { id: 'alerts', label: 'Early Warnings', icon: AlertTriangle, badge: '3 Spikes' },
    { id: 'assistant', label: 'Ask AeroLens AI', icon: BotMessageSquare, badge: 'AI' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 z-40 h-screen bg-aerodark-900 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-aerodark-950/40">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center shadow-md shadow-cyan-500/20 flex-shrink-0">
                <Satellite className="w-5 h-5 text-white animate-pulse-slow" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white">AeroLens</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider truncate">SATELLITE INTEL</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Satellite className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-sky-500/5 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={clsx(
                          'text-[10px] px-2 py-0.5 rounded-full font-mono font-medium',
                          item.badge.includes('Active') || item.badge.includes('Spikes')
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-slate-800/80 bg-aerodark-950/30">
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-aerodark-800/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping-slow"></div>
              <span className="text-xs font-semibold text-slate-200 tracking-tight">System Status</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Monitoring Active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Sentinel-5P Orbit #38494</p>
          </div>
        ) : (
          <div className="flex justify-center" title="System Status: Monitoring Active">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping-slow"></div>
          </div>
        )}
      </div>
    </aside>
  );
}
