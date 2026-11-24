import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateHaversineDistance,
  isInsideGeofence,
  evaluateGeofence,
} from "../src/lib/geofence.js";

// Reference Coordinate: HCMUT Campus Building H6 (approx. 10.772500, 106.657800)
const H6_LAT = 10.7725;
const H6_LON = 106.6578;

test("Haversine Distance: returns 0 meters for identical coordinates", () => {
  const dist = calculateHaversineDistance(H6_LAT, H6_LON, H6_LAT, H6_LON);
  assert.equal(dist, 0);
});

test("Haversine Distance: accurately calculates distance for nearby points (~10m)", () => {
  // Point ~11 meters North
  const nearbyLat = 10.7726;
  const nearbyLon = 106.6578;
  const dist = calculateHaversineDistance(H6_LAT, H6_LON, nearbyLat, nearbyLon);
  assert.ok(dist >= 10 && dist <= 12, `Expected ~11m, got ${dist}`);
});

test("Geofence Evaluation: correctly verifies 20m, 50m, 100m radii boundaries", () => {
  // Test 20m radius
  const inside20 = isInsideGeofence(10.77259, 106.6578, H6_LAT, H6_LON, 20);
  assert.equal(inside20.isInside, true);
  assert.ok(inside20.distanceMeters <= 20);

  const outside20 = isInsideGeofence(10.7728, 106.6578, H6_LAT, H6_LON, 20);
  assert.equal(outside20.isInside, false);
  assert.ok(outside20.distanceMeters > 20);

  // Test 50m radius (point ~33m away is inside 50m, outside 20m)
  const point33mLat = 10.7728;
  const inside50 = isInsideGeofence(point33mLat, 106.6578, H6_LAT, H6_LON, 50);
  assert.equal(inside50.isInside, true);
  assert.ok(inside50.distanceMeters <= 50);

  // Test 100m radius
  const point80mLat = 10.77322;
  const inside100 = isInsideGeofence(point80mLat, 106.6578, H6_LAT, H6_LON, 100);
  assert.equal(inside100.isInside, true);
  assert.ok(inside100.distanceMeters <= 100);

  const outside100 = isInsideGeofence(10.7745, 106.6578, H6_LAT, H6_LON, 100);
  assert.equal(outside100.isInside, false);
  assert.ok(outside100.distanceMeters > 100);
});

test("Anti-Fake GPS: evaluateGeofence rejects mock location instantly", () => {
  const result = evaluateGeofence({
    userLat: H6_LAT,
    userLon: H6_LON,
    targetLat: H6_LAT,
    targetLon: H6_LON,
    radiusMeters: 20,
    isMocked: true, // Mocked location detected on client
  });

  assert.equal(result.isInside, false);
  assert.equal(result.status, "REJECTED");
  assert.ok(result.reason?.includes("MOCK_LOCATION_DETECTED"));
});

test("Anti-Drift & Accuracy: evaluateGeofence flags check-in when GPS accuracy is degraded (>100m)", () => {
  const result = evaluateGeofence({
    userLat: H6_LAT,
    userLon: H6_LON,
    targetLat: H6_LAT,
    targetLon: H6_LON,
    radiusMeters: 50,
    isMocked: false,
    accuracy: 120, // Severe indoor signal drift
  });

  assert.equal(result.isInside, true);
  assert.equal(result.status, "FLAGGED");
  assert.ok(result.reason?.includes("GPS_LOW_ACCURACY"));
});

test("Privacy-First: evaluateGeofence output strips raw GPS coordinates", () => {
  const result = evaluateGeofence({
    userLat: 10.77255,
    userLon: 106.65785,
    targetLat: H6_LAT,
    targetLon: H6_LON,
    radiusMeters: 20,
    isMocked: false,
    accuracy: 10,
  });

  assert.equal(result.status, "VALID");
  assert.equal(result.isInside, true);

  // Assert Privacy-First: Result object only contains boolean and distance, never user coordinates
  const resultKeys = Object.keys(result);
  assert.ok(!resultKeys.includes("userLat"));
  assert.ok(!resultKeys.includes("userLon"));
  assert.ok(!resultKeys.includes("latitude"));
  assert.ok(!resultKeys.includes("longitude"));
});

test("Geofence Evaluation: rejects invalid or Null-Island coordinates", () => {
  const nullIslandResult = evaluateGeofence({
    userLat: 0,
    userLon: 0,
    targetLat: H6_LAT,
    targetLon: H6_LON,
    radiusMeters: 20,
  });
  assert.equal(nullIslandResult.status, "REJECTED");
  assert.ok(nullIslandResult.reason?.includes("INVALID_COORDINATES"));

  const outOfRangeResult = evaluateGeofence({
    userLat: 105.0, // Invalid latitude (> 90)
    userLon: 106.6578,
    targetLat: H6_LAT,
    targetLon: H6_LON,
    radiusMeters: 20,
  });
  assert.equal(outOfRangeResult.status, "REJECTED");
  assert.ok(outOfRangeResult.reason?.includes("INVALID_COORDINATES"));
});
