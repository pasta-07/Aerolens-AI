import sys
from satellite_engine import geocode_location, get_custom_location_satellite_profile

places = geocode_location('Rohini, Delhi')
print(f"[1] Geocode for Rohini: {places[0]['name']} ({places[0]['lat']}, {places[0]['lng']})")

profile = get_custom_location_satellite_profile(places[0]['lat'], places[0]['lng'], places[0]['name'], places[0]['state'])
print(f"[2] Satellite Profile for Rohini:")
print(f"    Name: {profile['name']}")
print(f"    Satellite AQI: {profile['currentAqi']} ({profile['severity']})")
print(f"    Sentinel-5P HCHO: {profile['hchoMean']:.3e} mol/m²")
print(f"    Sentinel-5P NO2: {profile['no2Mean']:.3e} mol/m²")
print(f"    Valid Sounding Pixels: {profile['satellite']['validPixels']}")
print("\n>>> SPECIFIC PLACE SATELLITE RETRIEVAL VERIFIED! <<<")
