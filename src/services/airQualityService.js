/**
 * AeroLens AI - Air Quality Data Service
 * Encapsulates all data access and provides async methods for the UI.
 * Connects seamlessly to FastAPI / Azure backend endpoints when ready.
 */

import { API_CONFIG, delay } from './apiConfig';
import { mockHotspots } from '../data/mockHotspots';
import { mockHourlyForecast, mockForecastInsight, mockCityForecastComparison } from '../data/mockForecast';
import { mockXAIFactors, mockXAIExplanation } from '../data/mockXAI';
import { mockAlerts } from '../data/mockAlerts';
import { mockLocations } from '../data/mockLocations';
import { mockSystemStatus } from '../data/mockSystemStatus';

export const airQualityService = {
  /**
   * Fetch overview telemetry metrics and system health
   */
  async getSystemStatus() {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay();
      return { ...mockSystemStatus };
    }
    
    // Future FastAPI Endpoint
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/status`);
    if (!res.ok) throw new Error('Failed to fetch system status');
    return await res.json();
  },

  /**
   * Fetch all detected HCHO hotspots with optional severity or search filters
   */
  async getHotspots(filters = {}) {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay();
      let list = [...mockHotspots];
      
      if (filters.severity && filters.severity !== 'All') {
        list = list.filter(h => h.severity.toLowerCase() === filters.severity.toLowerCase());
      }
      
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(h => 
          h.name.toLowerCase().includes(q) || 
          h.state.toLowerCase().includes(q) || 
          h.primarySource.toLowerCase().includes(q)
        );
      }

      return list;
    }

    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/hotspots?${params}`);
    if (!res.ok) throw new Error('Failed to fetch hotspots');
    return await res.json();
  },

  /**
   * Fetch single hotspot detail by ID
   */
  async getHotspotById(id) {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(80);
      const found = mockHotspots.find(h => h.id === id);
      return found || mockHotspots[0];
    }

    const res = await fetch(`${API_CONFIG.API_BASE_URL}/hotspots/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch hotspot ${id}`);
    return await res.json();
  },

  /**
   * Fetch hourly AQI forecast (Historical 12h + Forecast 24h/48h)
   */
  async getForecast(locationId = 'delhi') {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay();
      return {
        locationId,
        hourly: mockHourlyForecast,
        insight: mockForecastInsight,
        cityComparison: mockCityForecastComparison,
      };
    }

    const res = await fetch(`${API_CONFIG.API_BASE_URL}/forecast/${locationId}`);
    if (!res.ok) throw new Error('Failed to fetch forecast');
    return await res.json();
  },

  /**
   * Fetch Explainable AI (XAI) feature contribution factors
   */
  async getXAI(locationId = 'delhi') {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay();
      return {
        locationId,
        factors: mockXAIFactors,
        explanation: mockXAIExplanation,
      };
    }

    const res = await fetch(`${API_CONFIG.API_BASE_URL}/xai/${locationId}`);
    if (!res.ok) throw new Error('Failed to fetch XAI metrics');
    return await res.json();
  },

  /**
   * Fetch live alert notifications
   */
  async getAlerts(filters = {}) {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay();
      let list = [...mockAlerts];
      if (filters.severity && filters.severity !== 'All') {
        list = list.filter(a => a.severity.toLowerCase() === filters.severity.toLowerCase());
      }
      return list;
    }

    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/alerts?${params}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return await res.json();
  },

  /**
   * Fetch all registered Indian cities and coordinates
   */
 async getLocations() {
  if (API_CONFIG.USE_MOCK_DATA) {
    await delay(50);
    return [...mockLocations];
  }

  const res = await fetch(`${API_CONFIG.API_BASE_URL}/locations`);
  if (!res.ok) throw new Error('Failed to fetch locations');
  return await res.json();
},

  async getSatelliteHCHO(lat = 28.6139, lon = 77.2090) {
    const res = await fetch(
      `${API_CONFIG.API_BASE_URL}/satellite/hcho?lat=${lat}&lon=${lon}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch real satellite HCHO data');
    }

    return await res.json();
  },

  /**
   * Fetch real Copernicus Sentinel-5P multi-pollutant profile for any custom coordinate or place
   */
  async getCustomLocationProfile(lat, lon, name = 'Target Coordinates', state = 'India') {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      name: String(name),
      state: String(state),
    });
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/satellite/location?${params}`);
    if (!res.ok) throw new Error('Failed to fetch custom location satellite profile');
    return await res.json();
  },

  /**
   * Geocode any specific locality, neighborhood, or city name
   */
  async geocode(query) {
    if (!query || !query.trim()) return [];
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/geocode?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return await res.json();
  },

  /**
   * Fetch SQL Relational Database Statistics & Table Overview
   */
  async getSqlStats() {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/sql/stats`);
    if (!res.ok) throw new Error('Failed to fetch SQL database stats');
    return await res.json();
  },

  /**
   * Fetch Paginated Table Records from SQLite
   */
  async getTableData(tableName = 'ground_stations', page = 1, pageSize = 15, search = '') {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/sql/table/${tableName}?${params}`);
    if (!res.ok) throw new Error(`Failed to fetch records for table ${tableName}`);
    return await res.json();
  },

  /**
   * Export SQL Table Data as JSON or CSV
   */
  async exportTable(tableName = 'ground_measurements', format = 'json') {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/sql/export?table_name=${tableName}&format=${format}`);
    if (!res.ok) throw new Error(`Failed to export table ${tableName}`);
    if (format === 'csv') {
      return await res.text();
    }
    return await res.json();
  },

  /**
   * Fetch all official CAAQMS Ground Monitoring Stations with Live Telemetry
   */
  async getGroundStations() {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/ground/stations`);
    if (!res.ok) throw new Error('Failed to fetch ground stations');
    return await res.json();
  },

  /**
   * Fetch Ground Sensor Telemetry for any coordinate
   */
  async getGroundLive(lat, lon) {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/ground/live?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Failed to fetch ground live telemetry');
    return await res.json();
  },

  /**
   * Trigger Manual Sync of Ground Stations into SQLite
   */
  async syncGroundStations() {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/ground/sync`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to synchronize ground stations');
    return await res.json();
  },

  /**
   * Fetch ML Model Accuracy Metrics (R², RMSE, MAE, Feature Importances)
   */
  async getMlMetrics() {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/ml/metrics`);
    if (!res.ok) throw new Error('Failed to fetch ML model metrics');
    return await res.json();
  },

  /**
   * Run Real-Time Satellite-to-Ground ML Calibration
   */
  async calibrateAqi(payload) {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/ml/calibrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to execute ML calibration');
    return await res.json();
  },

  /**
   * Trigger ML Model Retraining on Relational SQL Records
   */
  async retrainMlModel() {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/ml/retrain`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to retrain ML model');
    return await res.json();
  },
};