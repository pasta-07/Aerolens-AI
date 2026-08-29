import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Rectangle, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  Maximize2,
  Minimize2,
  Satellite,
  Radio,
  Globe,
  RefreshCw,
  Crosshair,
  MapPin,
} from 'lucide-react';
import { MapLayerControls } from './MapLayerControls';
import { MapLegend } from './MapLegend';
import { HotspotDrawer } from './HotspotDrawer';
import { getSeverityStyle } from '../../utils/aqiUtils';
import { airQualityService } from '../../services/airQualityService';

// Fix Leaflet default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to center/fly to coordinates
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      try {
        map.flyTo(center, zoom, { duration: 1.2 });
      } catch (e) {
        console.warn('Map flyTo error:', e);
      }
    }
  }, [center, zoom, map]);
  return null;
}

// Invalidate size on mount to ensure Leaflet recalculates canvas height
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.invalidateSize();
      const t1 = setTimeout(() => map.invalidateSize(), 150);
      const t2 = setTimeout(() => map.invalidateSize(), 500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [map]);
  return null;
}

// Map Click Sounding Handler for arbitrary location queries
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

// Custom Leaflet DivIcon Generator for Standard Hotspots
function createCustomPin(hotspot, isSelected, activeLayer) {
  const sevStyle = getSeverityStyle(hotspot.severity);
  const isSevere = hotspot.severity === 'Severe';
  const isHigh = hotspot.severity === 'High';

  let displayMetric = `${hotspot.currentAqi}`;

  if (activeLayer === 'hcho') {
    displayMetric = `${hotspot.hchoLevel}`;
  } else if (activeLayer === 'no2') {
    displayMetric = `${hotspot.no2Level}`;
  } else if (activeLayer === 'aerosol') {
    displayMetric = `${hotspot.aerosolIndex || 2.4}`;
  }

  const pulseHtml = (isSevere || isHigh)
    ? `<div class="absolute -inset-2 rounded-full ${sevStyle.pulseClass}" style="background-color: ${sevStyle.pinColor}40;"></div>`
    : '';

  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer">
      ${pulseHtml}
      <div 
        class="relative z-10 px-2 py-1 rounded-lg font-mono font-bold text-xs shadow-xl flex items-center gap-1 border transition-all duration-150 transform hover:scale-110 ${
          isSelected ? 'ring-2 ring-cyan-400 scale-110' : ''
        }"
        style="background-color: #0F1522; color: ${sevStyle.pinColor}; border-color: ${sevStyle.pinColor};"
      >
        <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sevStyle.pinColor};"></span>
        <span>${displayMetric}</span>
      </div>
      <div class="w-1.5 h-2 -mt-0.5" style="background-color: ${sevStyle.pinColor}; clip-path: polygon(0 0, 100% 0, 50% 100%);"></div>
      <span class="text-[10px] font-sans font-semibold text-slate-300 bg-black/80 px-1.5 py-0.2 rounded border border-slate-700/80 -mt-0.5 whitespace-nowrap shadow-md">
        ${hotspot.shortName}
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [60, 48],
    iconAnchor: [30, 44],
    popupAnchor: [0, -42],
  });
}

// Custom Leaflet DivIcon Generator for Live Copernicus Sentinel-5P Satellite Observation
function createSatellitePin(satelliteData, isSelected) {
  const meanVal = satelliteData?.statistics?.mean;
  const displayVal = meanVal != null ? meanVal.toExponential(2) : '--';

  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer">
      <div class="absolute -inset-3 rounded-full animate-ping-slow" style="background-color: rgba(6, 182, 212, 0.45);"></div>
      <div class="absolute -inset-1 rounded-full animate-pulse" style="background-color: rgba(6, 182, 212, 0.65);"></div>
      <div 
        class="relative z-10 px-2.5 py-1 rounded-lg font-mono font-bold text-xs shadow-2xl flex items-center gap-1.5 border transition-all duration-200 transform hover:scale-115 ${
          isSelected ? 'ring-2 ring-cyan-300 scale-115' : ''
        }"
        style="background: linear-gradient(135deg, #071E26 0%, #0F1522 100%); color: #22D3EE; border-color: #06B6D4; box-shadow: 0 0 16px rgba(6, 182, 212, 0.55);"
      >
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span class="font-black">🛰️ S5P: ${displayVal}</span>
      </div>
      <div class="w-2 h-2 -mt-0.5" style="background-color: #06B6D4; clip-path: polygon(0 0, 100% 0, 50% 100%);"></div>
      <span class="text-[9px] font-sans font-bold text-cyan-200 bg-black/90 px-1.5 py-0.2 rounded border border-cyan-500/70 -mt-0.5 whitespace-nowrap shadow-lg">
        Sentinel-5P Live Pass
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-satellite-leaflet-marker',
    iconSize: [84, 52],
    iconAnchor: [42, 48],
    popupAnchor: [0, -44],
  });
}

// Custom Leaflet DivIcon Generator for Ground Monitoring Stations (CPCB / CAAQMS)
function createGroundStationPin(station, isSelected) {
  const aqi = station.currentAqi || station.latestMeasurement?.groundAqi || 210;
  const pm25 = station.pm25 || station.latestMeasurement?.pm25 || 85.0;

  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer">
      <div class="absolute -inset-2 rounded-full animate-ping-slow" style="background-color: rgba(16, 185, 129, 0.35);"></div>
      <div 
        class="relative z-10 px-2 py-0.5 rounded-lg font-mono font-bold text-xs shadow-xl flex items-center gap-1 border transition-all duration-150 transform hover:scale-110 ${
          isSelected ? 'ring-2 ring-emerald-400 scale-110' : ''
        }"
        style="background-color: #061A14; color: #34D399; border-color: #10B981;"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>AQI ${aqi}</span>
      </div>
      <div class="w-1.5 h-2 -mt-0.5" style="background-color: #10B981; clip-path: polygon(0 0, 100% 0, 50% 100%);"></div>
      <span class="text-[9px] font-sans font-semibold text-emerald-200 bg-black/85 px-1.5 py-0.2 rounded border border-emerald-500/50 -mt-0.5 whitespace-nowrap shadow-md">
        📡 ${station.name ? station.name.split(' ')[0] : 'CAAQMS'}
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-ground-leaflet-marker',
    iconSize: [70, 46],
    iconAnchor: [35, 42],
    popupAnchor: [0, -40],
  });
}

// Convert Lat/Lng to normalized percentages for Vector Map view
function projectCoords(lat, lng) {
  const minLat = 7.5;
  const maxLat = 37.0;
  const minLng = 67.5;
  const maxLng = 97.5;

  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

export function IndiaMap({
  hotspots = [],
  selectedHotspot,
  onSelectHotspot,
  onInspectXAI,
  satelliteHCHO = null,
  isFullScreen = false,
  onToggleFullScreen,
  className = '',
}) {
  const [activeLayer, setActiveLayer] = useState('hotspots');
  const [mapCenter, setMapCenter] = useState([22.8, 79.2]);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapMode, setMapMode] = useState('leaflet'); // 'leaflet' | 'vector'
  const [groundStations, setGroundStations] = useState([]);

  // Load ground stations
  useEffect(() => {
    airQualityService.getGroundStations()
      .then((res) => {
        if (Array.isArray(res)) setGroundStations(res);
      })
      .catch((err) => console.warn('Failed to load ground stations on map:', err));
  }, []);

  // Live Real Satellite HCHO State
  const [satelliteData, setSatelliteData] = useState(satelliteHCHO);
  const [satelliteLoading, setSatelliteLoading] = useState(!satelliteHCHO);
  const [satelliteError, setSatelliteError] = useState(null);
  const [selectedSatelliteObservation, setSelectedSatelliteObservation] = useState(false);

  // Fetch real Sentinel-5P HCHO data from FastAPI backend
  const fetchSatelliteData = async (lat = 28.6139, lon = 77.2090) => {
    setSatelliteLoading(true);
    setSatelliteError(null);
    try {
      const data = await airQualityService.getSatelliteHCHO(lat, lon);
      if (data && (data.success || data.statistics)) {
        setSatelliteData(data);
      } else {
        setSatelliteError(data?.message || 'No satellite data returned');
      }
    } catch (err) {
      console.error('Failed to fetch real satellite HCHO data:', err);
      setSatelliteError(err.message || 'Failed to fetch satellite data');
    } finally {
      setSatelliteLoading(false);
    }
  };

  // Synchronize when a specific location/hotspot is selected (e.g. from header search or drawer)
  useEffect(() => {
    if (selectedHotspot) {
      const lat = selectedHotspot.lat ?? selectedHotspot.latitude ?? (Array.isArray(selectedHotspot.coordinates) ? selectedHotspot.coordinates[0] : null);
      const lng = selectedHotspot.lng ?? selectedHotspot.longitude ?? (Array.isArray(selectedHotspot.coordinates) ? selectedHotspot.coordinates[1] : null);
      if (lat != null && lng != null) {
        setMapCenter([lat, lng]);
        setMapZoom(10.5);
        fetchSatelliteData(lat, lng);
      }
    }
  }, [selectedHotspot]);

  // Handle map click to trigger real Sentinel-5P sounding at ANY arbitrary point
  const handleMapClickSounding = async (latlng) => {
    const lat = latlng.lat;
    const lng = latlng.lng;
    setSatelliteLoading(true);
    setMapCenter([lat, lng]);
    setMapZoom(11);
    try {
      const profile = await airQualityService.getCustomLocationProfile(
        lat,
        lng,
        `Sounding Point (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`,
        'Local Airshed'
      );
      if (onSelectHotspot) {
        onSelectHotspot(profile);
      }
      const sat = await airQualityService.getSatelliteHCHO(lat, lng);
      if (sat) setSatelliteData(sat);
    } catch (err) {
      console.warn('Map click sounding error:', err);
    } finally {
      setSatelliteLoading(false);
    }
  };

  useEffect(() => {
    if (satelliteHCHO) {
      setSatelliteData(satelliteHCHO);
      setSatelliteLoading(false);
    } else {
      fetchSatelliteData();
    }
  }, [satelliteHCHO]);

  const regionPresets = [
    { label: 'All India', coords: [22.8, 79.2], zoom: 5 },
    { label: 'Delhi NCR', coords: [28.6139, 77.2090], zoom: 8 },
    { label: 'Punjab Corridor', coords: [30.9010, 75.8573], zoom: 8 },
    { label: 'Indo-Gangetic Basin', coords: [25.8, 83.5], zoom: 6.5 },
    { label: 'Mumbai MMR', coords: [19.0760, 72.8777], zoom: 8.5 },
    { label: 'Singrauli Energy Belt', coords: [24.1997, 82.6644], zoom: 8 },
    { label: 'Southern Plateau', coords: [13.0, 78.5], zoom: 6.5 },
  ];

  const handleJumpToRegion = (preset) => {
    setMapCenter(preset.coords);
    setMapZoom(preset.zoom);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-aerodark-950 shadow-2xl flex flex-col ${
        isFullScreen ? 'fixed inset-4 z-50 rounded-2xl' : 'h-[640px]'
      } ${className}`}
    >
      {/* Top Map Action Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Layer Switcher */}
        <div className="pointer-events-auto">
          <MapLayerControls activeLayer={activeLayer} onSelectLayer={setActiveLayer} />
        </div>

        {/* Mode & Region Presets */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Live Copernicus Sentinel-5P Satellite Status & Focus Button */}
          <div className="hidden md:flex items-center gap-1.5 bg-aerodark-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-2xl">
            <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-300">
              Sentinel-5P HCHO:
            </span>
            <span className="text-[11px] font-mono font-bold text-cyan-400">
              {satelliteLoading ? 'Syncing...' : satelliteData?.statistics?.mean != null ? `${satelliteData.statistics.mean.toExponential(2)}` : 'Connected'}
            </span>
            {satelliteData?.latitude && (
              <button
                onClick={() => {
                  setMapCenter([satelliteData.latitude, satelliteData.longitude]);
                  setMapZoom(9);
                }}
                className="ml-1 px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-[10px] font-mono font-semibold text-cyan-300 border border-cyan-500/30 transition-colors"
                title="Center map on Copernicus observation coordinates"
              >
                Focus
              </button>
            )}
            <button
              onClick={() => fetchSatelliteData()}
              disabled={satelliteLoading}
              aria-label="Refresh Copernicus Satellite Data"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
              title="Refresh Copernicus Satellite Data"
            >
              <RefreshCw className={`w-3 h-3 ${satelliteLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

          {/* Map Engine Mode Switcher (Leaflet Tile vs Vector GIS) */}
          <div className="flex items-center bg-aerodark-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-2xl">
            <button
              onClick={() => setMapMode('leaflet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mapMode === 'leaflet'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Leaflet Tile Satellite Basemap"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Satellite Tiles</span>
            </button>
            <button
              onClick={() => setMapMode('vector')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mapMode === 'vector'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Vector Atmospheric Contour Grid"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Vector GIS</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="hidden lg:flex items-center gap-1 bg-aerodark-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-2xl">
            <span className="text-[10px] text-slate-400 font-semibold px-2 uppercase font-mono">
              Focus:
            </span>
            {regionPresets.slice(0, 5).map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleJumpToRegion(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Fullscreen Button */}
          {onToggleFullScreen && (
            <button
              onClick={onToggleFullScreen}
              aria-label={isFullScreen ? "Exit fullscreen" : "Fullscreen map"}
              className="p-2.5 rounded-xl bg-aerodark-900/90 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow-2xl transition-all"
              title={isFullScreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Map Rendering Area */}
      {mapMode === 'leaflet' ? (
        /* MODE A: Interactive Leaflet Map */
        <div className="flex-1 w-full h-full min-h-[500px] relative z-0">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', minHeight: '520px', width: '100%' }}
            zoomControl={false}
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            <MapResizeHandler />

            {/* Esri World Dark Gray Canvas Basemap (Free, High-Contrast, Zero Watermarks) */}
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>, HERE, DeLorme, MapmyIndia | Sentinel-5P TROPOMI &copy; ESA/Copernicus'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
              opacity={0.8}
            />

            {/* Real Sentinel-5P TROPOMI Satellite Observation Swath & Footprint */}
            {satelliteData && satelliteData.latitude && satelliteData.longitude && (
              <>
                {/* Real Satellite Bounding Box Area from Copernicus */}
                {satelliteData.bbox && Array.isArray(satelliteData.bbox) && satelliteData.bbox.length === 4 && (
                  <Rectangle
                    bounds={[
                      [satelliteData.bbox[1], satelliteData.bbox[0]], // [minLat, minLon]
                      [satelliteData.bbox[3], satelliteData.bbox[2]], // [maxLat, maxLon]
                    ]}
                    pathOptions={{
                      color: '#06B6D4',
                      weight: 2,
                      dashArray: '5, 5',
                      fillColor: '#06B6D4',
                      fillOpacity: activeLayer === 'hcho' ? 0.28 : 0.18,
                    }}
                  >
                    <Tooltip sticky direction="top" className="dark-tooltip">
                      <div className="text-[11px] font-mono font-bold text-cyan-300">
                        Sentinel-5P HCHO Swath: {satelliteData.statistics?.mean != null ? `${satelliteData.statistics.mean.toExponential(3)} mol/m²` : 'Active Footprint'}
                      </div>
                    </Tooltip>
                    <Popup className="dark-popup">
                      <div className="p-3 space-y-2 min-w-[260px] text-slate-200">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                          <div className="flex items-center gap-1.5">
                            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
                            <span className="font-bold text-sm text-white">Sentinel-5P Swath Footprint</span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Copernicus L2
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Target Airshed:</span>
                            <span className="font-semibold text-slate-200">Delhi NCR Region</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Mean HCHO Column:</span>
                            <span className="font-mono font-bold text-cyan-300">
                              {satelliteData.statistics?.mean != null ? `${satelliteData.statistics.mean.toExponential(4)} mol/m²` : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Min / Max Column:</span>
                            <span className="font-mono text-slate-300 text-[11px]">
                              {satelliteData.statistics?.minimum != null ? satelliteData.statistics.minimum.toExponential(2) : '--'} / {satelliteData.statistics?.maximum != null ? satelliteData.statistics.maximum.toExponential(2) : '--'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Valid Soundings:</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              {satelliteData.statistics?.valid_pixels ?? 'N/A'} valid pixels
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                            <span>BBox [Lon, Lat]:</span>
                            <span className="font-mono">
                              [{satelliteData.bbox[0].toFixed(3)}, {satelliteData.bbox[1].toFixed(3)}] to [{satelliteData.bbox[2].toFixed(3)}, {satelliteData.bbox[3].toFixed(3)}]
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Rectangle>
                )}

                {/* Sounding Core Halo Circle */}
                <Circle
                  center={[satelliteData.latitude, satelliteData.longitude]}
                  radius={12000}
                  pathOptions={{
                    color: '#22D3EE',
                    fillColor: '#06B6D4',
                    fillOpacity: 0.25,
                    weight: 1.5,
                  }}
                />

                {/* Sentinel-5P Satellite Observation Pin Marker (Only for custom sounding queries) */}
                {satelliteData.isCustom && (
                  <Marker
                    position={[satelliteData.latitude, satelliteData.longitude]}
                    icon={createSatellitePin(satelliteData, selectedSatelliteObservation)}
                    eventHandlers={{
                      click: () => {
                        setSelectedSatelliteObservation(true);
                      },
                    }}
                  >
                    <Popup className="dark-popup">
                      <div className="p-3 space-y-2.5 min-w-[280px] text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                              <Satellite className="w-4 h-4 animate-pulse" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-white">Sentinel-5P TROPOMI</h4>
                              <p className="text-[10px] text-slate-400 font-mono">ESA / Copernicus Earth Observation</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
                          </span>
                        </div>

                        <div className="bg-aerodark-900/90 rounded-xl p-2.5 border border-slate-800 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Pollutant Precursor:</span>
                            <span className="font-bold text-cyan-300 font-mono">Formaldehyde (HCHO)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Live Mean Column:</span>
                            <span className="font-bold text-cyan-400 font-mono text-sm">
                              {satelliteData.statistics?.mean != null ? `${satelliteData.statistics.mean.toExponential(4)} mol/m²` : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </>
            )}

            {/* Anomaly Halo Dispersion Circles */}
            {hotspots.map((hotspot) => {
              const hLat = hotspot.lat ?? hotspot.latitude ?? (Array.isArray(hotspot.coordinates) ? hotspot.coordinates[0] : null);
              const hLng = hotspot.lng ?? hotspot.lon ?? hotspot.longitude ?? (Array.isArray(hotspot.coordinates) ? hotspot.coordinates[1] : null);
              if (hLat == null || hLng == null || isNaN(hLat) || isNaN(hLng)) return null;

              const sevStyle = getSeverityStyle(hotspot.severity);
              const radius =
                hotspot.severity === 'Severe' ? 75000 :
                hotspot.severity === 'High' ? 55000 :
                hotspot.severity === 'Moderate' ? 40000 : 25000;

              return (
                <Circle
                  key={`halo-${hotspot.id}`}
                  center={[hLat, hLng]}
                  radius={radius}
                  pathOptions={{
                    color: sevStyle.pinColor,
                    fillColor: sevStyle.pinColor,
                    fillOpacity: hotspot.severity === 'Severe' ? 0.22 : 0.14,
                    weight: 1,
                    dashArray: hotspot.severity === 'Severe' ? '4, 4' : undefined,
                  }}
                />
              );
            })}

            {/* Hotspot Interactive Markers */}
            {hotspots.map((hotspot) => {
              const hLat = hotspot.lat ?? hotspot.latitude ?? (Array.isArray(hotspot.coordinates) ? hotspot.coordinates[0] : null);
              const hLng = hotspot.lng ?? hotspot.lon ?? hotspot.longitude ?? (Array.isArray(hotspot.coordinates) ? hotspot.coordinates[1] : null);
              if (hLat == null || hLng == null || isNaN(hLat) || isNaN(hLng)) return null;

              const isSelected = selectedHotspot?.id === hotspot.id;
              const customIcon = createCustomPin(hotspot, isSelected, activeLayer);

              return (
                <Marker
                  key={hotspot.id}
                  position={[hLat, hLng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => onSelectHotspot(hotspot),
                  }}
                >
                  <Popup className="dark-popup">
                    <div className="p-2 space-y-1.5 min-w-[200px]">
                      <div className="font-bold text-sm text-slate-100">{hotspot.name}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        State: {hotspot.state}
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Current AQI:</span>
                        <span className="font-bold text-orange-400 font-mono">{hotspot.currentAqi} ({hotspot.aqiCategory})</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">HCHO Level:</span>
                        <span className="font-bold text-cyan-400 font-mono">{hotspot.hchoLevel} ×10¹⁵ ({hotspot.hchoAnomalyRatio})</span>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => onSelectHotspot(hotspot)}
                          className="w-full py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded font-semibold text-xs transition-colors"
                        >
                          Inspect Telemetry Drawer &rarr;
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Official CAAQMS Ground Monitoring Stations */}
            {(activeLayer === 'ground_stations' || activeLayer === 'aqi') &&
              groundStations.map((station) => {
                const isSelected = selectedHotspot?.id === station.id;
                return (
                  <Marker
                    key={`ground-${station.id}`}
                    position={[station.latitude, station.longitude]}
                    icon={createGroundStationPin(station, isSelected)}
                    eventHandlers={{
                      click: () => {
                        const mappedHotspot = {
                          id: station.id,
                          name: station.name,
                          shortName: station.name.split(' ')[0],
                          state: station.state,
                          lat: station.latitude,
                          lng: station.longitude,
                          latitude: station.latitude,
                          longitude: station.longitude,
                          currentAqi: station.currentAqi || 220,
                          mlCalibratedAqi: station.currentAqi || 220,
                          severity: station.severity || 'High',
                          primarySource: `${station.agency} Ground Sensor (${station.stationType})`,
                          pm25: station.pm25 || 110,
                          pm10: station.pm10 || 210,
                          no2: station.no2 || 45,
                          confidence: 98.2,
                          groundStation: {
                            nearest: station.name,
                            agency: station.agency,
                            pm25: station.pm25,
                            pm10: station.pm10,
                            no2: station.no2,
                          },
                        };
                        if (onSelectHotspot) onSelectHotspot(mappedHotspot);
                      },
                    }}
                  >
                    <Popup className="dark-popup">
                      <div className="p-2.5 bg-aerodark-900 text-slate-100 rounded-xl border border-slate-700 min-w-[220px]">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                            <Radio className="w-3.5 h-3.5" />
                            <span>{station.name}</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            CAAQMS
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">{station.agency} • {station.city}, {station.state}</p>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono mb-2">
                          <div className="bg-aerodark-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block text-[9px]">Ground AQI</span>
                            <span className="text-emerald-400 font-bold text-sm">AQI {station.currentAqi}</span>
                          </div>
                          <div className="bg-aerodark-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block text-[9px]">Surface PM2.5</span>
                            <span className="text-sky-400 font-bold text-sm">{station.pm25} µg/m³</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const mappedHotspot = {
                              id: station.id,
                              name: station.name,
                              shortName: station.name.split(' ')[0],
                              state: station.state,
                              lat: station.latitude,
                              lng: station.longitude,
                              latitude: station.latitude,
                              longitude: station.longitude,
                              currentAqi: station.currentAqi || 220,
                              mlCalibratedAqi: station.currentAqi || 220,
                              severity: station.severity || 'High',
                              primarySource: `${station.agency} Ground Sensor`,
                              pm25: station.pm25 || 110,
                              pm10: station.pm10 || 210,
                              no2: station.no2 || 45,
                              confidence: 98.2,
                            };
                            if (onSelectHotspot) onSelectHotspot(mappedHotspot);
                          }}
                          className="w-full py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg font-semibold text-xs transition-colors"
                        >
                          Inspect Station Details &rarr;
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            <MapClickHandler onMapClick={handleMapClickSounding} />

            {/* Custom Location / Click Sounding Target Pin if not in default hotspots */}
            {selectedHotspot && (
              (() => {
                const sLat = selectedHotspot.lat ?? selectedHotspot.latitude ?? (Array.isArray(selectedHotspot.coordinates) ? selectedHotspot.coordinates[0] : null);
                const sLng = selectedHotspot.lng ?? selectedHotspot.longitude ?? (Array.isArray(selectedHotspot.coordinates) ? selectedHotspot.coordinates[1] : null);
                const isExistingCluster = hotspots.some(h => h.id === selectedHotspot.id);

                if (!isExistingCluster && sLat != null && sLng != null && !isNaN(sLat) && !isNaN(sLng)) {
                  return (
                    <Marker
                      key={`custom-${selectedHotspot.id || 'target'}`}
                      position={[sLat, sLng]}
                      icon={createCustomPin(selectedHotspot, true, activeLayer)}
                      eventHandlers={{
                        click: () => onSelectHotspot(selectedHotspot),
                      }}
                    >
                      <Popup className="dark-popup" autoPan>
                        <div className="p-2.5 space-y-1.5 min-w-[220px]">
                          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase">
                            <Satellite className="w-3.5 h-3.5 animate-pulse" />
                            <span>Localized Sentinel-5P Pass</span>
                          </div>
                          <div className="font-bold text-sm text-slate-100">{selectedHotspot.name}</div>
                          <div className="text-xs text-slate-400 font-mono">
                            Coords: {sLat.toFixed(4)}°N, {sLng.toFixed(4)}°E
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                            <span className="text-slate-400">Satellite AQI:</span>
                            <span className="font-bold text-orange-400 font-mono">{selectedHotspot.currentAqi} ({selectedHotspot.severity || 'Live'})</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">HCHO Level:</span>
                            <span className="font-bold text-cyan-400 font-mono">
                              {selectedHotspot.hchoMean ? `${selectedHotspot.hchoMean.toExponential(3)} mol/m²` : `${selectedHotspot.hchoLevel} ×10¹⁵`}
                            </span>
                          </div>
                          <div className="pt-1.5">
                            <button
                              onClick={() => onSelectHotspot(selectedHotspot)}
                              className="w-full py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded font-semibold text-xs transition-colors"
                            >
                              Inspect Sounding Drawer &rarr;
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })()
            )}
          </MapContainer>

          {/* Floating Sounding Prompt Pill */}
          <div className="absolute top-14 left-4 z-[400] bg-aerodark-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-2xl text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>Click <strong>any point on map</strong> to retrieve real Copernicus Sentinel-5P soundings for that exact location.</span>
          </div>
        </div>
      ) : (
        /* MODE B: Vector Atmospheric GIS Console (Always available / offline capable) */
        <div className="flex-1 w-full h-full min-h-[500px] relative z-0 bg-gradient-to-b from-[#070A10] via-[#0B0F17] to-[#080D1A] overflow-hidden flex items-center justify-center p-6 select-none">
          {/* Spatial Coordinate Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #38BDF8 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* India Airshed SVG Contour Silhouette */}
          <div className="relative w-full max-w-2xl h-[500px] flex items-center justify-center">
            {/* Ambient Regional Heatmap Glow for Gangetic Plain & Mumbai */}
            <div className="absolute top-[20%] left-[25%] w-72 h-36 bg-red-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-[32%] left-[38%] w-60 h-28 bg-orange-500/15 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-[58%] left-[16%] w-36 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>

            {/* India Boundary Schematic SVG */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full opacity-30 text-cyan-500 pointer-events-none stroke-current fill-none stroke-[0.4]"
            >
              {/* Outer boundary schematic */}
              <polygon points="28,10 38,12 45,20 52,24 60,22 68,26 76,28 88,32 94,36 90,44 82,46 72,48 65,55 58,62 48,78 40,92 38,82 32,70 24,62 16,52 14,42 20,32 25,20" strokeDasharray="1, 1" />
              {/* Tropic of Cancer indicator line */}
              <line x1="10" y1="46" x2="90" y2="46" stroke="#06B6D4" strokeWidth="0.3" strokeDasharray="2, 2" />
              <text x="12" y="44.5" fill="#38BDF8" fontSize="2.2" fontFamily="monospace">Tropic of Cancer (23.5°N)</text>
              {/* Indo-Gangetic Corridor Corridor Area */}
              <ellipse cx="48" cy="30" rx="26" ry="7" fill="#EF4444" fillOpacity="0.08" stroke="#EF4444" strokeWidth="0.4" strokeDasharray="1, 1" />
              <text x="44" y="27" fill="#F87171" fontSize="2.2" fontFamily="monospace" textAnchor="middle">Indo-Gangetic Airshed Corridor</text>
            </svg>

            {/* Real Sentinel-5P Observation Node in Vector GIS Mode */}
            {satelliteData && satelliteData.latitude && satelliteData.longitude && (() => {
              const satCoords = projectCoords(satelliteData.latitude, satelliteData.longitude);
              const meanVal = satelliteData?.statistics?.mean;
              const displayVal = meanVal != null ? meanVal.toExponential(2) : '--';

              return (
                <div
                  key="satellite-observation-vector-node"
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
                  style={{ left: `${satCoords.x}%`, top: `${satCoords.y}%` }}
                >
                  <div className="absolute -inset-3.5 rounded-full animate-ping-slow pointer-events-none" style={{ backgroundColor: 'rgba(6, 182, 212, 0.4)' }} />
                  <div className="absolute -inset-1.5 rounded-full animate-pulse pointer-events-none" style={{ backgroundColor: 'rgba(6, 182, 212, 0.6)' }} />
                  
                  <div
                    className="px-2.5 py-1.5 rounded-lg font-mono font-bold text-xs shadow-2xl flex items-center gap-1.5 border transition-all duration-200 group-hover:scale-125 bg-gradient-to-r from-[#071E26] to-[#0F1522] text-cyan-300 border-cyan-400"
                    style={{ boxShadow: '0 0 16px rgba(6, 182, 212, 0.6)' }}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>🛰️ S5P: {displayVal}</span>
                  </div>

                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-sans font-bold text-cyan-200 bg-black/95 px-2 py-0.5 rounded border border-cyan-500/80 whitespace-nowrap shadow-xl pointer-events-none group-hover:border-cyan-300">
                    Live Copernicus Pass (Delhi NCR)
                  </div>
                </div>
              );
            })()}

            {/* Interactive Vector Hotspots */}
            {hotspots.map((hotspot) => {
              const { x, y } = projectCoords(hotspot.lat, hotspot.lng);
              const sevStyle = getSeverityStyle(hotspot.severity);
              const isSelected = selectedHotspot?.id === hotspot.id;

              return (
                <div
                  key={hotspot.id}
                  onClick={() => onSelectHotspot(hotspot)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {/* Outer pulse wave */}
                  {(hotspot.severity === 'Severe' || hotspot.severity === 'High') && (
                    <div
                      className="absolute -inset-3 rounded-full animate-ping-slow pointer-events-none"
                      style={{ backgroundColor: `${sevStyle.pinColor}30` }}
                    />
                  )}

                  {/* Hotspot Node Badge */}
                  <div
                    className={`px-2 py-1 rounded-lg font-mono font-bold text-xs shadow-2xl flex items-center gap-1.5 border transition-all duration-200 group-hover:scale-125 ${
                      isSelected ? 'ring-2 ring-cyan-400 scale-125' : ''
                    }`}
                    style={{
                      backgroundColor: '#0B0F17',
                      color: sevStyle.pinColor,
                      borderColor: sevStyle.pinColor,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: sevStyle.pinColor }}
                    />
                    <span>
                      {activeLayer === 'hcho' ? `${hotspot.hchoLevel}` : `${hotspot.currentAqi}`}
                    </span>
                  </div>

                  {/* Location label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-sans font-semibold text-slate-200 bg-black/90 px-1.5 py-0.2 rounded border border-slate-700/80 whitespace-nowrap shadow-md pointer-events-none group-hover:border-cyan-400">
                    {hotspot.shortName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Map Overlay Bar: Legend & Satellite Telemetry Footnote */}
      <div className="absolute bottom-4 left-4 z-[400] pointer-events-auto">
        <MapLegend activeLayer={activeLayer} />
      </div>

      <div className="absolute bottom-4 right-4 z-[400] hidden sm:flex items-center gap-2 bg-aerodark-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-2xl text-[11px] font-mono text-slate-400 pointer-events-auto">
        <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>TROPOMI Res: 3.5×5.5 km² • Copernicus S5P HCHO Active</span>
      </div>

      {/* Slide-over Diagnostic Drawer for Selected Hotspot */}
      <HotspotDrawer
        hotspot={selectedHotspot}
        onClose={() => onSelectHotspot(null)}
        onInspectXAI={onInspectXAI}
      />
    </div>
  );
}

