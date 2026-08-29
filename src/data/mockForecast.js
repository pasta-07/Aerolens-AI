/**
 * AeroLens AI - Mock Forecast Engine
 * Historical 12h + Next 24h/48h AI predictive trajectories with uncertainty bounds
 */

export const mockHourlyForecast = [
  // Historical 12 Hours
  { time: '11:00', timestamp: '11:00 AM', aqi: 215, aqiLower: 210, aqiUpper: 220, pm25: 112, pm10: 210, hcho: 16.2, no2: 52, windSpeed: 7.5, pblHeight: 950, isForecast: false },
  { time: '12:00', timestamp: '12:00 PM', aqi: 228, aqiLower: 222, aqiUpper: 234, pm25: 120, pm10: 225, hcho: 18.5, no2: 55, windSpeed: 7.0, pblHeight: 1020, isForecast: false },
  { time: '13:00', timestamp: '01:00 PM', aqi: 242, aqiLower: 236, aqiUpper: 248, pm25: 132, pm10: 240, hcho: 21.0, no2: 58, windSpeed: 6.2, pblHeight: 1050, isForecast: false },
  { time: '14:00', timestamp: '02:00 PM', aqi: 255, aqiLower: 248, aqiUpper: 262, pm25: 144, pm10: 258, hcho: 24.1, no2: 64, windSpeed: 5.8, pblHeight: 980, isForecast: false },
  { time: '15:00', timestamp: '03:00 PM', aqi: 264, aqiLower: 258, aqiUpper: 270, pm25: 152, pm10: 270, hcho: 25.4, no2: 68, windSpeed: 5.1, pblHeight: 890, isForecast: false },
  { time: '16:00', timestamp: '04:00 PM', aqi: 270, aqiLower: 263, aqiUpper: 277, pm25: 158, pm10: 278, hcho: 26.0, no2: 71, windSpeed: 4.5, pblHeight: 780, isForecast: false },
  { time: '17:00', timestamp: '05:00 PM', aqi: 276, aqiLower: 270, aqiUpper: 282, pm25: 161, pm10: 284, hcho: 26.2, no2: 73, windSpeed: 4.2, pblHeight: 650, isForecast: false },
  { time: '18:00', timestamp: '06:00 PM', aqi: 280, aqiLower: 274, aqiUpper: 286, pm25: 164, pm10: 288, hcho: 26.5, no2: 75, windSpeed: 3.8, pblHeight: 560, isForecast: false },
  { time: '19:00', timestamp: '07:00 PM', aqi: 283, aqiLower: 277, aqiUpper: 289, pm25: 166, pm10: 290, hcho: 26.7, no2: 76, windSpeed: 3.5, pblHeight: 490, isForecast: false },
  { time: '20:00', timestamp: '08:00 PM', aqi: 285, aqiLower: 279, aqiUpper: 291, pm25: 167, pm10: 292, hcho: 26.8, no2: 77, windSpeed: 3.4, pblHeight: 450, isForecast: false },
  { time: '21:00', timestamp: '09:00 PM', aqi: 286, aqiLower: 280, aqiUpper: 292, pm25: 168, pm10: 293, hcho: 26.8, no2: 78, windSpeed: 3.3, pblHeight: 430, isForecast: false },
  { time: '22:00', timestamp: '10:00 PM', aqi: 287, aqiLower: 281, aqiUpper: 293, pm25: 168, pm10: 294, hcho: 26.8, no2: 78, windSpeed: 3.2, pblHeight: 420, isForecast: false, isCurrent: true },

  // Forecast 24 Hours (Next Day)
  { time: '23:00', timestamp: '11:00 PM (FC)', aqi: 294, aqiLower: 284, aqiUpper: 304, pm25: 174, pm10: 302, hcho: 27.2, no2: 80, windSpeed: 2.9, pblHeight: 390, isForecast: true },
  { time: '00:00', timestamp: '12:00 AM (FC)', aqi: 306, aqiLower: 293, aqiUpper: 319, pm25: 182, pm10: 315, hcho: 27.8, no2: 82, windSpeed: 2.6, pblHeight: 360, isForecast: true },
  { time: '01:00', timestamp: '01:00 AM (FC)', aqi: 318, aqiLower: 302, aqiUpper: 334, pm25: 190, pm10: 328, hcho: 28.3, no2: 84, windSpeed: 2.4, pblHeight: 340, isForecast: true },
  { time: '02:00', timestamp: '02:00 AM (FC)', aqi: 328, aqiLower: 310, aqiUpper: 346, pm25: 198, pm10: 338, hcho: 28.7, no2: 86, windSpeed: 2.2, pblHeight: 320, isForecast: true },
  { time: '03:00', timestamp: '03:00 AM (FC)', aqi: 336, aqiLower: 316, aqiUpper: 356, pm25: 204, pm10: 346, hcho: 29.0, no2: 88, windSpeed: 2.1, pblHeight: 310, isForecast: true },
  { time: '04:00', timestamp: '04:00 AM (FC)', aqi: 342, aqiLower: 320, aqiUpper: 364, pm25: 208, pm10: 352, hcho: 29.2, no2: 89, windSpeed: 2.0, pblHeight: 300, isForecast: true }, // Peak Deterioration
  { time: '05:00', timestamp: '05:00 AM (FC)', aqi: 340, aqiLower: 318, aqiUpper: 362, pm25: 206, pm10: 350, hcho: 29.0, no2: 89, windSpeed: 2.2, pblHeight: 310, isForecast: true },
  { time: '06:00', timestamp: '06:00 AM (FC)', aqi: 335, aqiLower: 312, aqiUpper: 358, pm25: 202, pm10: 345, hcho: 28.5, no2: 87, windSpeed: 2.6, pblHeight: 340, isForecast: true },
  { time: '07:00', timestamp: '07:00 AM (FC)', aqi: 329, aqiLower: 305, aqiUpper: 353, pm25: 196, pm10: 338, hcho: 27.9, no2: 85, windSpeed: 3.2, pblHeight: 400, isForecast: true },
  { time: '08:00', timestamp: '08:00 AM (FC)', aqi: 322, aqiLower: 298, aqiUpper: 346, pm25: 190, pm10: 330, hcho: 27.2, no2: 82, windSpeed: 4.1, pblHeight: 480, isForecast: true },
  { time: '09:00', timestamp: '09:00 AM (FC)', aqi: 312, aqiLower: 288, aqiUpper: 336, pm25: 182, pm10: 320, hcho: 26.4, no2: 78, windSpeed: 5.0, pblHeight: 600, isForecast: true },
  { time: '10:00', timestamp: '10:00 AM (FC)', aqi: 298, aqiLower: 274, aqiUpper: 322, pm25: 172, pm10: 305, hcho: 25.1, no2: 72, windSpeed: 6.2, pblHeight: 740, isForecast: true },
  { time: '11:00', timestamp: '11:00 AM (FC)', aqi: 284, aqiLower: 258, aqiUpper: 310, pm25: 162, pm10: 290, hcho: 23.8, no2: 66, windSpeed: 7.1, pblHeight: 880, isForecast: true },
  { time: '12:00', timestamp: '12:00 PM (FC)', aqi: 272, aqiLower: 245, aqiUpper: 299, pm25: 152, pm10: 276, hcho: 22.4, no2: 60, windSpeed: 7.8, pblHeight: 1010, isForecast: true },
  { time: '13:00', timestamp: '01:00 PM (FC)', aqi: 260, aqiLower: 232, aqiUpper: 288, pm25: 142, pm10: 262, hcho: 21.0, no2: 56, windSpeed: 8.4, pblHeight: 1080, isForecast: true },
  { time: '14:00', timestamp: '02:00 PM (FC)', aqi: 252, aqiLower: 222, aqiUpper: 282, pm25: 136, pm10: 252, hcho: 20.1, no2: 53, windSpeed: 8.7, pblHeight: 1090, isForecast: true },
  { time: '15:00', timestamp: '03:00 PM (FC)', aqi: 246, aqiLower: 215, aqiUpper: 277, pm25: 130, pm10: 244, hcho: 19.5, no2: 51, windSpeed: 8.5, pblHeight: 1040, isForecast: true },
  { time: '16:00', timestamp: '04:00 PM (FC)', aqi: 242, aqiLower: 210, aqiUpper: 274, pm25: 126, pm10: 238, hcho: 19.0, no2: 50, windSpeed: 8.0, pblHeight: 960, isForecast: true },
  { time: '17:00', timestamp: '05:00 PM (FC)', aqi: 244, aqiLower: 210, aqiUpper: 278, pm25: 128, pm10: 240, hcho: 19.3, no2: 52, windSpeed: 7.2, pblHeight: 820, isForecast: true },
  { time: '18:00', timestamp: '06:00 PM (FC)', aqi: 250, aqiLower: 214, aqiUpper: 286, pm25: 134, pm10: 248, hcho: 20.2, no2: 56, windSpeed: 6.0, pblHeight: 680, isForecast: true },
  { time: '19:00', timestamp: '07:00 PM (FC)', aqi: 258, aqiLower: 220, aqiUpper: 296, pm25: 140, pm10: 258, hcho: 21.1, no2: 60, windSpeed: 5.2, pblHeight: 550, isForecast: true },
  { time: '20:00', timestamp: '08:00 PM (FC)', aqi: 266, aqiLower: 226, aqiUpper: 306, pm25: 148, pm10: 268, hcho: 22.0, no2: 64, windSpeed: 4.5, pblHeight: 460, isForecast: true },
  { time: '21:00', timestamp: '09:00 PM (FC)', aqi: 274, aqiLower: 232, aqiUpper: 316, pm25: 154, pm10: 276, hcho: 22.8, no2: 68, windSpeed: 4.0, pblHeight: 410, isForecast: true },
  { time: '22:00', timestamp: '10:00 PM (FC)', aqi: 280, aqiLower: 236, aqiUpper: 324, pm25: 160, pm10: 284, hcho: 23.5, no2: 71, windSpeed: 3.6, pblHeight: 380, isForecast: true },
];

export const mockForecastInsight = {
  headline: '24-Hour Forecast Insight: Atmospheric Compression Ahead',
  summary: 'Air quality is expected to deteriorate from AQI 287 (Poor) to a peak of 342 (Very Poor) over the next 6-8 hours (03:00 - 05:00 AM IST).',
  primaryDriver: 'Calm nocturnal surface winds (< 2.2 km/h) combined with a shallow Planetary Boundary Layer (300m) will trap fresh HCHO and NO₂ precursor emissions near the ground level.',
  turningPoint: 'Gradual recovery forecasted post 10:00 AM tomorrow as solar insolation expands boundary layer depth past 800m.',
  confidenceLevel: 'High (89.6% ensemble agreement across 16 ConvLSTM-XGBoost runs)',
};

export const mockCityForecastComparison = [
  { city: 'Delhi NCR', currentAqi: 287, peakPredictedAqi: 342, status: 'Deteriorating', color: '#EF4444' },
  { city: 'Ludhiana Corridor', currentAqi: 264, peakPredictedAqi: 318, status: 'Deteriorating', color: '#F97316' },
  { city: 'Patna Basin', currentAqi: 272, peakPredictedAqi: 325, status: 'Deteriorating', color: '#EF4444' },
  { city: 'Kanpur Belt', currentAqi: 238, peakPredictedAqi: 279, status: 'Elevated Stagnation', color: '#F59E0B' },
  { city: 'Mumbai MMR', currentAqi: 158, peakPredictedAqi: 182, status: 'Moderate Fluctuations', color: '#EAB308' },
  { city: 'Bengaluru Tech', currentAqi: 68, peakPredictedAqi: 74, status: 'Stable / Good', color: '#10B981' },
];
