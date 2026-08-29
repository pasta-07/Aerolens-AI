import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NotificationsModal } from './components/layout/NotificationsModal';
import { StatsOverview } from './components/dashboard/StatsOverview';
import { ForecastChart } from './components/dashboard/ForecastChart';
import { XAIExplanation } from './components/dashboard/XAIExplanation';
import { DataQualityCard } from './components/dashboard/DataQualityCard';
import { QuickAlertsFeed } from './components/dashboard/QuickAlertsFeed';
import { IndiaMap } from './components/map/IndiaMap';
import { HotspotList } from './components/hotspots/HotspotList';
import { ForecastDeepDive } from './components/forecast/ForecastDeepDive';
import { XAIAnalyticsView } from './components/analytics/XAIAnalyticsView';
import { AlertsView } from './components/alerts/AlertsView';
import { AssistantChat } from './components/assistant/AssistantChat';
import { SettingsView } from './components/settings/SettingsView';
import { SqlMlStudioView } from './components/database/SqlMlStudioView';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { mockHotspots } from './data/mockHotspots';
import { mockLocations } from './data/mockLocations';
import { airQualityService } from './services/airQualityService';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  // Core Data States
  const [systemStatus, setSystemStatus] = useState(null);
  const [hotspots, setHotspots] = useState(mockHotspots);
  const [selectedHotspot, setSelectedHotspot] = useState(mockHotspots[0]);
  const [forecastData, setForecastData] = useState(null);
  const [xaiData, setXaiData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [satelliteHCHO, setSatelliteHCHO] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [status, hsList, fc, xai, altList, locList, satData] = await Promise.all([
          airQualityService.getSystemStatus().catch((err) => {
            console.warn('System status fetch warning:', err);
            return null;
          }),
          airQualityService.getHotspots().catch((err) => {
            console.warn('Hotspots fetch warning:', err);
            return mockHotspots;
          }),
          airQualityService.getForecast('delhi').catch((err) => {
            console.warn('Forecast fetch warning:', err);
            return null;
          }),
          airQualityService.getXAI('delhi').catch((err) => {
            console.warn('XAI fetch warning:', err);
            return null;
          }),
          airQualityService.getAlerts().catch((err) => {
            console.warn('Alerts fetch warning:', err);
            return [];
          }),
          airQualityService.getLocations().catch((err) => {
            console.warn('Locations fetch warning:', err);
            return mockLocations;
          }),
          airQualityService.getSatelliteHCHO(28.6139, 77.2090).catch((err) => {
            console.warn('Initial satellite HCHO fetch error:', err);
            return null;
          }),
        ]);

        if (status) setSystemStatus(status);
        if (hsList && hsList.length > 0) {
          setHotspots(hsList);
          setSelectedHotspot(hsList[0]);
        } else {
          setHotspots(mockHotspots);
          setSelectedHotspot(mockHotspots[0]);
        }
        if (fc) setForecastData(fc);
        if (xai) setXaiData(xai);
        if (altList) setAlerts(altList);
        if (locList && locList.length > 0) {
          setLocations(locList);
          setSelectedLocation(locList[0]);
        } else {
          setLocations(mockLocations);
          setSelectedLocation(mockLocations[0]);
        }
        if (satData) setSatelliteHCHO(satData);
      } catch (error) {
        console.error('Error loading AeroLens AI telemetry:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Handle location selection from header
  const handleSelectLocation = async (loc) => {
    setSelectedLocation(loc);

    const lat = loc.lat ?? loc.latitude ?? (Array.isArray(loc.coordinates) ? loc.coordinates[0] : null);
    const lng = loc.lng ?? loc.longitude ?? (Array.isArray(loc.coordinates) ? loc.coordinates[1] : null);

    if (lat != null && lng != null) {
      try {
        // Fetch real Sentinel-5P multi-pollutant profile for this specific location
        const profile = await airQualityService.getCustomLocationProfile(
          lat,
          lng,
          loc.fullName || loc.name,
          loc.state || 'India'
        );
        setSelectedHotspot(profile);

        // Fetch exact satellite HCHO bounding box and valid pixels for this location
        const sat = await airQualityService.getSatelliteHCHO(lat, lng).catch(() => null);
        if (sat) setSatelliteHCHO(sat);
      } catch (err) {
        console.warn('Failed to load custom location profile:', err);
      }
    } else {
      // Find matching hotspot if available
      const matched = hotspots.find(
        (h) => h.name.toLowerCase().includes(loc.name.toLowerCase()) ||
               loc.name.toLowerCase().includes(h.shortName.toLowerCase())
      );
      if (matched) {
        setSelectedHotspot(matched);
      }
    }
  };

  // Inspect XAI for a specific hotspot
  const handleInspectXAI = (hotspot) => {
    setSelectedHotspot(hotspot);
    setActiveTab('analytics');
  };

  // Select alert and view related hotspot/map
  const handleSelectAlert = (alert) => {
    const matched = hotspots.find(
      (h) => alert.location.toLowerCase().includes(h.shortName.toLowerCase()) ||
             alert.location.toLowerCase().includes(h.state.toLowerCase())
    );
    if (matched) {
      setSelectedHotspot(matched);
      setActiveTab('map');
    } else {
      setActiveTab('alerts');
    }
  };

  return (
    <div className="min-h-screen bg-aerodark-950 text-slate-100 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-0 md:ml-64'
        }`}
      >
        {/* Top Header */}
        <Header
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
          locations={locations}
          unreadAlertsCount={alerts.filter((a) => !a.acknowledged).length}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Page Views */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {isLoading ? (
            <div className="space-y-6 p-8">
              <LoadingSkeleton lines={4} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LoadingSkeleton lines={3} />
                <LoadingSkeleton lines={3} />
                <LoadingSkeleton lines={3} />
                <LoadingSkeleton lines={3} />
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: Main Dashboard Overview */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* National Stats Overview (4 Cards) */}
                  <StatsOverview statusData={systemStatus} satelliteHCHO={satelliteHCHO} />

                  {/* Interactive Map Section with Layer Switchers */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span>India Air Quality & Satellite Intelligence Map</span>
                      </h2>
                      <button
                        onClick={() => setActiveTab('map')}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        Expand Map View &rarr;
                      </button>
                    </div>
                    <IndiaMap
                      hotspots={hotspots}
                      selectedHotspot={selectedHotspot}
                      onSelectHotspot={setSelectedHotspot}
                      onInspectXAI={handleInspectXAI}
                      satelliteHCHO={satelliteHCHO}
                      isFullScreen={isMapFullScreen}
                      onToggleFullScreen={() => setIsMapFullScreen(!isMapFullScreen)}
                    />
                  </div>

                  {/* Forecast Chart (12h Historical + 24h Forecast) */}
                  <ForecastChart
                    forecastData={forecastData}
                    insight={forecastData?.insight}
                  />

                  {/* Explainable AI & Factor Contribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <XAIExplanation xaiData={xaiData} />
                    </div>
                    <div>
                      <QuickAlertsFeed
                        alerts={alerts}
                        onSelectAlert={handleSelectAlert}
                        onNavigateAlerts={() => setActiveTab('alerts')}
                      />
                    </div>
                  </div>

                  {/* Data Quality & Scientific Credibility */}
                  <DataQualityCard systemStatus={systemStatus} />
                </div>
              )}

              {/* TAB 2: Interactive India Map View */}
              {activeTab === 'map' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Interactive National Pollution GIS Console
                      </h2>
                      <p className="text-xs text-slate-400">
                        Multi-layer satellite rasterization (Sentinel-5P TROPOMI HCHO, NO₂, UVAI) & CPCB ground telemetry.
                      </p>
                    </div>
                  </div>
                  <IndiaMap
                    hotspots={hotspots}
                    selectedHotspot={selectedHotspot}
                    onSelectHotspot={setSelectedHotspot}
                    onInspectXAI={handleInspectXAI}
                    satelliteHCHO={satelliteHCHO}
                    isFullScreen={false}
                    className="h-[750px]"
                  />
                </div>
              )}

              {/* TAB: SQL Data Storage & Machine Learning Studio */}
              {activeTab === 'sql_ml' && (
                <div className="animate-in fade-in duration-200">
                  <SqlMlStudioView />
                </div>
              )}

              {/* TAB 3: Hotspot Registry View */}
              {activeTab === 'hotspots' && (
                <div className="animate-in fade-in duration-200">
                  <HotspotList
                    hotspots={hotspots}
                    selectedHotspot={selectedHotspot}
                    onSelectHotspot={(hs) => {
                      setSelectedHotspot(hs);
                    }}
                    onInspectXAI={handleInspectXAI}
                  />
                </div>
              )}

              {/* TAB 4: 24-Hour Forecast View */}
              {activeTab === 'forecast' && (
                <div className="animate-in fade-in duration-200">
                  <ForecastDeepDive
                    forecastData={forecastData}
                    locations={locations}
                    selectedLocation={selectedLocation}
                    onSelectLocation={handleSelectLocation}
                  />
                </div>
              )}

              {/* TAB 5: Explainable AI Analytics View */}
              {activeTab === 'analytics' && (
                <div className="animate-in fade-in duration-200">
                  <XAIAnalyticsView xaiData={xaiData} />
                </div>
              )}

              {/* TAB 6: Early Warning Alerts View */}
              {activeTab === 'alerts' && (
                <div className="animate-in fade-in duration-200">
                  <AlertsView
                    alerts={alerts}
                    onSelectAlert={handleSelectAlert}
                  />
                </div>
              )}

              {/* TAB 7: Ask AeroLens AI Assistant View */}
              {activeTab === 'assistant' && (
                <div className="animate-in fade-in duration-200">
                  <AssistantChat />
                </div>
              )}

              {/* TAB 8: Settings & Connector View */}
              {activeTab === 'settings' && (
                <div className="animate-in fade-in duration-200">
                  <SettingsView systemStatus={systemStatus} />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Slide-over Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onSelectAlert={handleSelectAlert}
      />
    </div>
  );
}

export default App;
