/**
 * AeroLens AI - System Telemetry, Satellite Health & Model Confidence
 */

export const mockSystemStatus = {
  satelliteCoverage: {
    label: 'Satellite Coverage',
    value: '94%',
    status: 'Nominal',
    detail: 'Sentinel-5P TROPOMI (ESA) + MODIS Aqua/Terra (NASA) daily pass processed.',
    lastSync: '18:30 IST',
    qualityScore: 94.2,
  },
  groundStations: {
    label: 'Ground Stations Available',
    value: '82%',
    status: 'Active',
    detail: '344 of 420 CPCB CAAQMS stations streaming 15-minute continuous telemetry.',
    lastSync: 'Live (2 mins ago)',
    qualityScore: 82.0,
  },
  weatherData: {
    label: 'Weather Assimilation',
    value: 'Available',
    status: 'Optimal',
    detail: 'ECMWF ERA5 + IMD high-resolution numerical weather prediction assimilation.',
    lastSync: 'Hourly sync (22:00 IST)',
    qualityScore: 98.5,
  },
  modelConfidence: {
    label: 'Model Confidence',
    value: 'High (91.4%)',
    status: 'High Confidence',
    detail: 'Ensemble cross-validation score based on 16 Spatial ConvLSTM runs.',
    lastSync: 'Inference cycle #1042',
    qualityScore: 91.4,
  },
  overallStatus: 'Monitoring Active',
  activeHotspotsCount: 12,
  hotspotChange: '+3 in last 6h',
  pollutionEventsCount: 3,
  predictedNationalAqi: 287,
  predictedNationalStatus: 'Poor',
  forecastTrend: 'Deteriorating',
};
