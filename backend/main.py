from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
import io
import csv
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

from database import (
    init_db,
    get_db_statistics,
    query_table_paginated,
    db_session,
    GroundStation,
    GroundMeasurement,
    SatelliteSounding,
    MLCalibratedRecord,
    AlertLog,
    MLModelMetrics,
)
from ground_engine import (
    get_all_ground_stations_live,
    fetch_live_ground_data,
    trigger_ground_sync,
    seed_and_sync_ground_database,
)
from ml_engine import ml_engine

from satellite_engine import (
    get_dynamic_system_status,
    get_all_dynamic_hotspots,
    get_cluster_satellite_profile,
    get_custom_location_satellite_profile,
    geocode_location,
    get_dynamic_alerts,
    get_dynamic_forecast,
    get_dynamic_xai,
    generate_satellite_grounded_chat,
    fetch_sentinel5p_raster,
    MONITORED_CLUSTERS,
)

# Explicitly load the .env file from the backend folder
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# Initialize database schema and seed ground stations on startup
init_db()
seed_and_sync_ground_database()

app = FastAPI(
    title="AeroLens AI - Hybrid Satellite & Ground Machine Learning Platform",
    description="Real-time environmental intelligence combining ESA Copernicus Sentinel-5P satellite sounding, CPCB/CAAQMS ground sensors, SQL relational data storage, and Gradient Boosted Machine Learning calibration.",
    version="3.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class CalibrateRequest(BaseModel):
    lat: float
    lon: float
    location_name: Optional[str] = "Custom Target"
    sat_hcho_col: Optional[float] = 2.4e-4
    sat_no2_col: Optional[float] = 6.5e-5
    sat_uvai: Optional[float] = 1.2
    ground_pm25: Optional[float] = None
    ground_pm10: Optional[float] = None
    ground_no2: Optional[float] = None
    temperature: Optional[float] = 28.5
    humidity: Optional[float] = 65.0
    wind_speed: Optional[float] = 3.8
    pbl_height: Optional[float] = 440.0
    station_id: Optional[str] = None


@app.get("/api")
@app.get("/api/v1/info")
def api_info():
    return {
        "service": "AeroLens AI - Satellite & Ground ML Environmental Intelligence",
        "status": "online",
        "database": "SQLite Relational Store (SQLAlchemy)",
        "mlModel": "GradientBoosting + RandomForest Ensemble (v2.5)",
        "groundSensors": "CPCB CAAQMS & Open-Meteo High-Resolution Grid",
        "satelliteSource": "ESA Copernicus Sentinel-5P TROPOMI Level-2",
        "version": "3.5.0",
        "documentation": "/docs",
    }


# ==========================================
# 1. System Status & Real Satellite Health Overview
# ==========================================
@app.get("/api/v1/status")
def get_system_status():
    return get_dynamic_system_status()


# ==========================================
# 2. Hotspots Derived From Live Satellite Soundings & ML Calibration
# ==========================================
@app.get("/api/v1/hotspots")
def get_hotspots(
    severity: Optional[str] = None,
    search: Optional[str] = None,
):
    return get_all_dynamic_hotspots(severity=severity, search=search)


@app.get("/api/v1/hotspots/{hotspot_id}")
def get_hotspot_by_id(hotspot_id: str):
    for cluster in MONITORED_CLUSTERS:
        if cluster["id"] == hotspot_id or hotspot_id.lower() in cluster["shortName"].lower():
            return get_cluster_satellite_profile(cluster)
    raise HTTPException(status_code=404, detail=f"Hotspot '{hotspot_id}' not found in satellite registry")


# ==========================================
# 3. 24-Hour Forecast Calibrated with ML & Satellite Baselines
# ==========================================
@app.get("/api/v1/forecast/{location_id}")
def get_forecast(location_id: str = "delhi"):
    return get_dynamic_forecast(location_id=location_id)


# ==========================================
# 4. Explainable AI (XAI) Attribution from Real Satellite Telemetry
# ==========================================
@app.get("/api/v1/xai/{location_id}")
def get_xai(location_id: str = "delhi"):
    return get_dynamic_xai(location_id=location_id)


# ==========================================
# 5. Early Warning Alerts from Satellite Sounding Thresholds
# ==========================================
@app.get("/api/v1/alerts")
def get_alerts(
    severity: Optional[str] = None,
):
    return get_dynamic_alerts(severity=severity)


# ==========================================
# 6. Monitored Strategic Sentinel-5P Nodes
# ==========================================
@app.get("/api/v1/locations")
def get_locations():
    return [
        {
            "id": c["id"],
            "name": c["name"],
            "shortName": c["shortName"],
            "state": c["state"],
            "coordinates": [c["latitude"], c["longitude"]],
            "primarySource": c["primarySource"],
        }
        for c in MONITORED_CLUSTERS
    ]


# ==========================================
# 7. Ground-Level Stations & Sensor Telemetry
# ==========================================
@app.get("/api/v1/ground/stations")
def get_ground_stations():
    """Returns all official CPCB CAAQMS ground monitoring stations with live sensor measurements."""
    return get_all_ground_stations_live()


@app.get("/api/v1/ground/live")
def get_ground_live(
    lat: float = Query(28.6139, description="Latitude"),
    lon: float = Query(77.2090, description="Longitude"),
):
    """Fetches high-resolution surface sensor air quality observations for any coordinate."""
    return fetch_live_ground_data(lat=lat, lon=lon)


@app.post("/api/v1/ground/sync")
def sync_ground_stations():
    """Polls live measurements from all registered ground stations and inserts into SQLite database."""
    return trigger_ground_sync()


# ==========================================
# 8. Machine Learning (ML) Calibration & Retraining
# ==========================================
@app.get("/api/v1/ml/metrics")
def get_ml_metrics():
    """Returns real-time validation metrics (R², RMSE, MAE, feature weights) for the ML model."""
    return ml_engine.latest_metrics


@app.post("/api/v1/ml/calibrate")
def calibrate_aqi(req: CalibrateRequest):
    """Performs real-time ML calibration fusing satellite columns, ground sensors, and meteorology."""
    return ml_engine.calibrate(
        lat=req.lat,
        lon=req.lon,
        location_name=req.location_name or "Target Coordinates",
        sat_hcho_col=req.sat_hcho_col or 2.4e-4,
        sat_no2_col=req.sat_no2_col or 6.5e-5,
        sat_uvai=req.sat_uvai or 1.2,
        ground_pm25=req.ground_pm25,
        ground_pm10=req.ground_pm10,
        ground_no2=req.ground_no2,
        temperature=req.temperature or 28.5,
        humidity=req.humidity or 65.0,
        wind_speed=req.wind_speed or 3.8,
        pbl_height=req.pbl_height or 440.0,
        station_id=req.station_id,
    )


@app.post("/api/v1/ml/retrain")
def retrain_ml_model():
    """Retrains the Gradient Boosting / Random Forest model on all accumulated ground + satellite data."""
    metrics = ml_engine.train_model()
    return {
        "success": True,
        "message": "ML model retrained successfully!",
        "metrics": metrics,
    }


# ==========================================
# 9. SQL Database Management & Table Explorer
# ==========================================
@app.get("/api/v1/sql/stats")
def get_sql_stats():
    """Returns database size, table counts, and schema metrics."""
    return get_db_statistics()


@app.get("/api/v1/sql/table/{table_name}")
def get_table_records(
    table_name: str,
    page: int = Query(1, ge=1, description="Page number"),
    pageSize: int = Query(20, ge=1, le=100, description="Records per page"),
    search: Optional[str] = Query(None, description="Search query string"),
):
    """Paginated record viewer for any SQLite table."""
    try:
        return query_table_paginated(
            table_name=table_name,
            page=page,
            page_size=pageSize,
            search=search,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/v1/sql/export")
def export_sql_table(
    table_name: str = Query("ground_measurements", description="Table name to export"),
    format: str = Query("json", description="Export format: 'json' or 'csv'"),
):
    """Exports SQLite table data in CSV or JSON format."""
    data = query_table_paginated(table_name=table_name, page=1, page_size=500)
    records = data.get("records", [])

    if format.lower() == "csv" and records:
        output = io.StringIO()
        fieldnames = records[0].keys()
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for r in records:
            # Flatten dicts/lists for CSV
            row = {}
            for k, v in r.items():
                if isinstance(v, (dict, list)):
                    row[k] = json.dumps(v)
                else:
                    row[k] = v
            writer.writerow(row)
        csv_content = output.getvalue()
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={table_name}_export.csv"},
        )

    return {
        "tableName": table_name,
        "count": len(records),
        "exportedAt": data.get("page"),
        "records": records,
    }


# ==========================================
# 10. Grounded AI Copilot Chat Assistant
# ==========================================
@app.post("/api/v1/chat")
def chat_with_assistant(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    return generate_satellite_grounded_chat(req.message)


# ==========================================
# 11. Real Copernicus Sentinel-5P Multi-Band Retrieval
# ==========================================
@app.get("/api/v1/satellite/hcho")
def get_satellite_hcho(
    lat: float = 28.6139,
    lon: float = 77.2090,
):
    result = fetch_sentinel5p_raster(lat=lat, lon=lon, pollutant="HCHO")
    return result


@app.get("/api/v1/satellite/{pollutant}")
def get_satellite_pollutant(
    pollutant: str,
    lat: float = 28.6139,
    lon: float = 77.2090,
):
    result = fetch_sentinel5p_raster(lat=lat, lon=lon, pollutant=pollutant.upper())
    return result


@app.get("/api/v1/satellite/location")
def get_satellite_for_location(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    name: str = Query("Target Coordinates", description="Name of the place"),
    state: str = Query("India", description="State or Region"),
):
    """Fetches real Sentinel-5P Level-2 multi-pollutant sounding for any custom location on Earth."""
    return get_custom_location_satellite_profile(lat=lat, lon=lon, name=name, state=state)


@app.get("/api/v1/geocode")
def geocode(q: str = Query(..., description="Place name or neighborhood")):
    """Geocodes any specific place or neighborhood into coordinates."""
    return geocode_location(q)


# ==========================================
# 12. Copernicus Diagnostics & Authentication
# ==========================================
@app.get("/api/v1/test-copernicus")
def test_copernicus():
    client_id = os.getenv("COPERNICUS_CLIENT_ID")
    client_secret = os.getenv("COPERNICUS_CLIENT_SECRET")

    token_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"

    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }

    response = requests.post(token_url, data=data, timeout=15)

    if response.status_code != 200:
        return {
            "success": False,
            "status_code": response.status_code,
            "error": response.text,
        }

    token_data = response.json()

    return {
        "success": True,
        "message": "Successfully authenticated with Copernicus Dataspace Ecosystem!",
        "token_received": bool(token_data.get("access_token")),
    }


@app.get("/api/v1/check-env")
def check_env():
    client_id = os.getenv("COPERNICUS_CLIENT_ID")
    client_secret = os.getenv("COPERNICUS_CLIENT_SECRET")

    return {
        "client_id_loaded": bool(client_id),
        "client_id_prefix": client_id[:5] if client_id else None,
        "secret_loaded": bool(client_secret),
        "secret_length": len(client_secret) if client_secret else 0,
    }


# ==========================================
# 13. Production Static Frontend Delivery & SPA Fallback
# ==========================================
frontend_dist = BASE_DIR.parent / "dist"
if frontend_dist.exists():
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(frontend_dist / "index.html")

    @app.get("/{full_path:path}")
    async def serve_spa_fallback(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        file_path = frontend_dist / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/")
    def home():
        return api_info()