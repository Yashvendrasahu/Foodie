// Geolocation and OpenStreetMap Utilities for Foodie Surplus Food Rescue

export const DEFAULT_LOCATION = {
  lat: 22.7196,
  lng: 75.8577,
  name: 'Indore Central',
  state: 'Madhya Pradesh'
};

export const POPULAR_CITIES = [
  { name: 'Indore (Active Campus & Downtown)', lat: 22.7196, lng: 75.8577 },
  { name: 'Bhopal (MP)', lat: 23.2599, lng: 77.4126 },
  { name: 'Mumbai (MH)', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  { name: 'Bengaluru (KA)', lat: 12.9716, lng: 77.5946 },
  { name: 'Pune (MH)', lat: 18.5204, lng: 73.8567 },
  { name: 'Jaipur (RJ)', lat: 26.9124, lng: 75.7873 },
  { name: 'Hyderabad (TS)', lat: 17.3850, lng: 78.4867 }
];

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return 1.4;
  }
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);

  if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) {
    return 1.4;
  }

  const R = 6371; // Earth's radius in km
  const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
  const dLon = ((nLon2 - nLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nLat1 * Math.PI) / 180) *
      Math.cos((nLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

/**
 * Format km distance into friendly string (e.g. 450 m or 1.8 km)
 */
export function formatDistance(distanceKm) {
  if (distanceKm == null || isNaN(distanceKm)) return 'Nearby';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Generates OpenStreetMap Directions URL for turn-by-turn navigation
 */
export function getOsmDirectionsUrl(fromLat, fromLng, toLat, toLng) {
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${fromLat},${fromLng};${toLat},${toLng}`;
}

/**
 * Generates OpenStreetMap Point URL
 */
export function getOsmPointUrl(lat, lng, zoom = 16) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;
}
