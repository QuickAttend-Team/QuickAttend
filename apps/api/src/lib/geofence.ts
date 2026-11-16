/**
 * Earth radius in meters
 */
const EARTH_RADIUS_METERS = 6371000;

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates great-circle distance between two GPS coordinates using Haversine formula
 * @returns Distance in meters
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Checks whether user coordinates fall within the geofence boundary
 */
export function isInsideGeofence(
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number,
  radiusMeters: number
): { isInside: boolean; distanceMeters: number } {
  const distanceMeters = Math.round(calculateHaversineDistance(userLat, userLon, targetLat, targetLon) * 10) / 10;
  return {
    isInside: distanceMeters <= radiusMeters,
    distanceMeters,
  };
}
