import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Radio,
  Bell,
  User,
  Search,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { formatCurrentDateTime } from '../../utils/dateUtils';
import { Badge } from '../common/Badge';
import { airQualityService } from '../../services/airQualityService';

export function Header({
  selectedLocation,
  onSelectLocation,
  locations = [],
  unreadAlertsCount = 3,
  onOpenNotifications,
  isSidebarCollapsed,
}) {
  const [timeStr, setTimeStr] = useState(formatCurrentDateTime());
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(formatCurrentDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingGeo, setIsSearchingGeo] = useState(false);

  // Debounced geocoding search for specific places (e.g. Rohini, Dwarka, Connaught Place)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearchingGeo(true);
      try {
        const geoList = await airQualityService.geocode(searchQuery);
        setSearchResults(geoList);
      } catch (err) {
        console.warn('Geocoding search error:', err);
      } finally {
        setIsSearchingGeo(false);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 bg-aerodark-900/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      {/* Left: Location Picker & Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Location Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-aerodark-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 transition-all text-sm font-medium shadow-sm group"
          >
            <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="font-semibold text-slate-100">{selectedLocation?.name || 'Delhi NCR, India'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Location Dropdown Menu */}
          {isLocationDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsLocationDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-80 bg-aerodark-850 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-slate-800">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search any place (e.g. Rohini, Dwarka, Bandra)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-aerodark-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto py-1 space-y-0.5">
                  {/* Dynamic Geocoded Specific Places */}
                  {searchResults.length > 0 && (
                    <div className="pb-1.5 mb-1.5 border-b border-slate-800">
                      <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 px-2 py-0.5 block">
                        🛰️ Specific Places (Copernicus Sounding)
                      </span>
                      {searchResults.map((geo) => (
                        <button
                          key={geo.id}
                          onClick={() => {
                            onSelectLocation({
                              id: geo.id,
                              name: geo.shortName,
                              fullName: geo.name,
                              state: geo.state,
                              lat: geo.lat,
                              lng: geo.lng,
                              latitude: geo.lat,
                              longitude: geo.lng,
                              isCustom: true,
                            });
                            setIsLocationDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-300 transition-colors group"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-white truncate group-hover:text-cyan-300">{geo.shortName}</div>
                            <div className="text-[10px] text-slate-400 truncate">{geo.name}</div>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex-shrink-0">
                            Sounding
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Standard Hotspots / Strategic Clusters */}
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 px-2 py-0.5 block">
                    Strategic Regional Clusters
                  </span>
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        setIsLocationDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <div>
                        <div className="font-medium">{loc.name}</div>
                        <div className="text-[10px] text-slate-400">{loc.state}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${loc.aqi > 200 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {loc.aqi ? `AQI ${loc.aqi}` : 'Node'}
                        </span>
                      </div>
                    </button>
                  ))}

                  {filteredLocations.length === 0 && searchResults.length === 0 && (
                    <div className="p-3 text-center text-xs text-slate-500">
                      {isSearchingGeo ? 'Searching satellite geocoder...' : 'No location found. Try typing a neighborhood name like "Rohini"'}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-aerodark-950/60 border border-slate-800/80 text-xs text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Right: Data Sync Status, Alerts & User Badge */}
      <div className="flex items-center gap-3">
        {/* Satellite Sync Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-sans">Satellite data updated</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          className="relative p-2 rounded-xl bg-aerodark-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
          title="Anomaly Alerts & Early Warnings"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* SIH Hackathon & User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-cyan-400/30">
            SIH
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-200">Team AeroLens</div>
            <div className="text-[10px] text-cyan-400 font-mono">SIH 2026 Finalist</div>
          </div>
        </div>
      </div>
    </header>
  );
}
