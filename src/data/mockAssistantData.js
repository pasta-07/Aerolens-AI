/**
 * AeroLens AI - Scientific Knowledgebase for Copilot Assistant
 */

export const mockSuggestedQuestions = [
  'Why is pollution high in Delhi?',
  'Will AQI improve tomorrow?',
  'Which area has the highest anomaly?',
  'What factors influenced this prediction?',
  'What is HCHO and why is it important for air quality?',
  'How does AeroLens AI combine satellite and ground data?'
];

export const mockAssistantResponses = {
  'why is pollution high in delhi': `**Delhi NCR Diagnostic Summary:**

Delhi NCR currently shows elevated pollution indicators (AQI 287, Poor) and a prominent **tropospheric HCHO anomaly of 26.8 × 10¹⁵ molec/cm² (+185% over baseline)** detected by Sentinel-5P TROPOMI. 

Key contributing mechanisms:
1. **Atmospheric Stagnation:** Low nocturnal surface wind speeds (3.2 km/h) restrict horizontal dispersion.
2. **Thermal Inversion:** A shallow Planetary Boundary Layer (~420m) compresses emissions near breathing level.
3. **Precursor Synergy:** Elevated NO₂ (78.4 µg/m³) from vehicular traffic reacting with volatile organic compounds (VOCs) accelerates secondary particulate formation.

*Note: This anomaly indicates intense localized photochemical oxidation and does not by itself prove a single judicial source.*`,

  'will aqi improve tomorrow': `**24-Hour Forecast Trajectory:**

Air quality is projected to **deteriorate further overnight**, peaking between **03:00 AM and 05:00 AM IST at AQI 342 (Very Poor)**.

**Improvement Outlook:**
- **Morning (08:00 AM - 11:00 AM):** Gradual dispersion begins as solar heating breaks the nocturnal inversion layer.
- **Afternoon (01:00 PM - 04:00 PM):** AQI is expected to improve to **242-252 (Poor)** as wind speeds increase to 8.5 km/h and boundary layer depth reaches ~1,090 meters.
- **Evening:** Moderate re-accumulation expected after 07:00 PM.`,

  'which area has the highest anomaly': `**Highest Detected Anomaly:**

**Delhi NCR (Anand Vihar - Jahangirpuri Belt)** currently records the highest HCHO anomaly in the national registry:
- **HCHO Column:** 26.8 × 10¹⁵ molec/cm² (+185% vs historical baseline).
- **Severity Rating:** **Severe Anomaly** (Confidence: 94.2%).

**Other High-Severity Anomaly Zones:**
1. **Ludhiana Corridor, Punjab:** +175% HCHO anomaly (Biomass pyrolysis + industrial VOCs).
2. **Patna Basin, Bihar:** +160% HCHO anomaly (Thermal inversion + transboundary basin inflow).
3. **Kanpur Cluster, UP:** +113% HCHO anomaly (Chemical tanning & secondary aerosols).`,

  'what factors influenced this prediction': `**Explainable AI (XAI) Attribution Breakdown:**

The predictive ensemble (ConvLSTM-XGBoost) attributes the current forecast primarily to:

1. **Tropospheric NO₂ Density (+42.5 AQI pts / 29.4% weight):** Highest positive driver accelerating aerosol formation.
2. **TROPOMI HCHO Anomaly (+38.2 AQI pts / 26.5% weight):** Surrogate tracer for reactive volatile organic compounds.
3. **Wind Stagnation (+29.0 AQI pts / 20.1% weight):** 3.2 km/h calm wind condition preventing advection.
4. **Thermal Inversion & Humidity (+22.3 AQI pts combined):** Moisture enhancing hygroscopic particle growth.
5. **Boundary Layer Dilution (-12.4 AQI pts):** Minor residual mixing mitigating extreme peaks.`,

  'what is hcho and why is it important for air quality': `**Formaldehyde (HCHO) as an Environmental Indicator:**

Formaldehyde (HCHO) is an intermediate product in the oxidation of almost all Volatile Organic Compounds (VOCs). 

**Why AeroLens AI tracks HCHO via Satellite:**
- **Short Atmospheric Lifetime (2-4 hours):** Because HCHO decays rapidly, satellite-detected HCHO column density serves as an excellent near-real-time spatial proxy for active VOC emissions and photochemical smog potential.
- **Precursor to Tropospheric Ozone & Secondary PM2.5:** High HCHO indicates a VOC-limited chemical regime where reducing organic vapor emissions is critical to arresting ozone spikes.
- **Early Warning:** Anomalies in HCHO frequently precede severe PM2.5 haze events by 6 to 18 hours.`,

  'how does aerolens ai combine satellite and ground data': `**Data Fusion Architecture:**

AeroLens AI utilizes a **Multi-Scale Spatial-Temporal Ensemble**:

1. **Satellite Remote Sensing (Top-Down):** Sentinel-5P TROPOMI provides high-resolution tropospheric column densities (HCHO, NO₂, Aerosol Index) covering areas without ground monitors.
2. **CPCB Ground Sensors (Bottom-Up):** 420 CAAQMS continuous monitoring stations provide calibrated surface-level microgram measurements of PM2.5, PM10, SO₂, and CO.
3. **Meteorological Assimilation:** High-resolution ECMWF ERA5 & IMD weather fields provide 3D wind velocity vectors, planetary boundary layer heights, and temperature gradients.
4. **AI Inference Engine:** A hybrid 3D-ConvLSTM + XGBoost model learns non-linear physical and chemical transport dynamics to produce 24h forecasts and anomaly alerts.`
};

export const defaultAssistantResponse = (query) => {
  return `**AeroLens AI Environmental Intelligence Analysis:**

Regarding your query: *"${query}"*

Our telemetry fusion engine correlates current Sentinel-5P TROPOMI satellite passes with 420 CPCB ground monitoring nodes across India. 

**Key Telemetry Snapshot:**
- **National Median AQI:** 287 (Poor) with localized severe spikes in the Indo-Gangetic Plain.
- **Active HCHO Anomalies:** 12 industrial/agricultural clusters identified with >50% elevation over seasonal baseline.
- **Meteorological Context:** Predominant northwesterly wind flow at low velocities (< 5 km/h) is causing valley stagnation across northern regions.

For specific location diagnostics, select an area on the **India Map** or view the **Hotspots** registry for granular sensor breakdowns.`;
};
