/**
 * AeroLens AI - API & Backend Configuration Layer
 * Toggle between Realistic Mock Data and FastAPI / Azure OpenAI Backend
 */

export const API_CONFIG = {
  // Set to true for Hackathon presentation with mock data
  // Set to false when connecting to live FastAPI / Azure backend
  USE_MOCK_DATA: false,
  
  // Live Copernicus Backend Endpoints
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined'
      ? (window.location.port === '5173' || window.location.port === '3000'
          ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
          : `${window.location.origin}/api/v1`)
      : 'http://localhost:8000/api/v1'),
  AZURE_OPENAI_ENDPOINT: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
  
  // Simulated network delay for realistic UI loading states (in ms)
  SIMULATED_DELAY_MS: 150,
  
  // Refresh intervals
  AUTO_REFRESH_INTERVAL_MS: 60000, // 60s
};

/**
 * Utility helper to simulate network latency for mock calls
 */
export const delay = (ms = API_CONFIG.SIMULATED_DELAY_MS) => 
  new Promise((resolve) => setTimeout(resolve, ms));
