import { DomainError } from "./errors.js";

/**
 * Earth radius in meters (WGS84 spherical approximation)
 */
export const EARTH_RADIUS_METERS = 6371000;

/**
 * Converts degrees to radians
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates great-circle distance between two GPS coordinates using the Haversine formula
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in meters
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

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
  const rawDistance = calculateHaversineDistance(userLat, userLon, targetLat, targetLon);
  const distanceMeters = Math.round(rawDistance * 10) / 10;
  return {
    isInside: distanceMeters <= radiusMeters,
    distanceMeters,
  };
}

export interface GeofenceEvaluationParams {
  userLat: number;
  userLon: number;
  targetLat: number;
  targetLon: number;
  radiusMeters: number;
  isMocked?: boolean;
  accuracy?: number | null;
}

export interface GeofenceEvaluationOutcome {
  isInside: boolean;
  distanceMeters: number;
  status: "VALID" | "FLAGGED" | "REJECTED";
  reason?: string;
}

/**
 * Evaluates attendance geofence with Anti-Fake GPS and Privacy-First compliance:
 * - Rejects any request flagged with mock location / fake GPS.
 * - Flags requests with suspiciously inaccurate GPS (indoor GPS drift / signal degradation).
 * - Strictly evaluates whether user is within configured geofence radius (20m, 50m, 100m).
 * - Adheres to Privacy-First: Does not return or retain user's raw GPS coordinates.
 */
export function evaluateGeofence(params: GeofenceEvaluationParams): GeofenceEvaluationOutcome {
  const { userLat, userLon, targetLat, targetLon, radiusMeters, isMocked, accuracy } = params;

  // 1. Anti-Fake GPS / Mock Location Detection Check
  if (isMocked) {
    return {
      isInside: false,
      distanceMeters: -1,
      status: "REJECTED",
      reason: "MOCK_LOCATION_DETECTED: Phát hiện sử dụng ứng dụng giả lập vị trí GPS.",
    };
  }

  // 2. Validate Coordinate Sanity
  if (
    Number.isNaN(userLat) ||
    Number.isNaN(userLon) ||
    userLat < -90 ||
    userLat > 90 ||
    userLon < -180 ||
    userLon > 180 ||
    (userLat === 0 && userLon === 0) // Null island / invalid GPS lock
  ) {
    return {
      isInside: false,
      distanceMeters: -1,
      status: "REJECTED",
      reason: "INVALID_COORDINATES: Tọa độ GPS không hợp lệ hoặc không có tín hiệu vệ tinh.",
    };
  }

  // 3. Compute Haversine distance
  const { isInside, distanceMeters } = isInsideGeofence(
    userLat,
    userLon,
    targetLat,
    targetLon,
    radiusMeters
  );

  // 4. Check for high GPS inaccuracy (indoor GPS drift threshold, e.g. accuracy > 100m)
  if (accuracy !== undefined && accuracy !== null && accuracy > 100) {
    return {
      isInside,
      distanceMeters,
      status: "FLAGGED",
      reason: `GPS_LOW_ACCURACY: Tín hiệu GPS không ổn định (độ lệch ${accuracy}m), ca học cần đối soát lại.`,
    };
  }

  // 5. Final Geofence boundary determination
  if (!isInside) {
    return {
      isInside: false,
      distanceMeters,
      status: "REJECTED",
      reason: `OUTSIDE_GEOFENCE: Bạn cách phòng học ${distanceMeters}m (vượt quá bán kính cho phép ${radiusMeters}m).`,
    };
  }

  return {
    isInside: true,
    distanceMeters,
    status: "VALID",
  };
}
