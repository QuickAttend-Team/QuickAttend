import assert from "node:assert/strict";
import test from "node:test";
import { calculateHaversineDistance, isInsideGeofence } from "../src/lib/geofence.js";

test("calculateHaversineDistance returns 0 for identical coordinates", () => {
  const dist = calculateHaversineDistance(10.7725, 106.6578, 10.7725, 106.6578);
  assert.equal(dist, 0);
});

test("isInsideGeofence correctly identifies inside and outside bounds", () => {
  // Center: H6 building (10.772500, 106.657800)
  const centerLat = 10.7725;
  const centerLon = 106.6578;
  const radiusMeters = 20;

  // Nearby point (~5 meters away)
  const nearbyLat = 10.77253;
  const nearbyLon = 106.65782;
  const nearbyResult = isInsideGeofence(nearbyLat, nearbyLon, centerLat, centerLon, radiusMeters);
  assert.equal(nearbyResult.isInside, true);
  assert.ok(nearbyResult.distanceMeters < 10);

  // Far point (~500 meters away)
  const farLat = 10.7765;
  const farLon = 106.6605;
  const farResult = isInsideGeofence(farLat, farLon, centerLat, centerLon, radiusMeters);
  assert.equal(farResult.isInside, false);
  assert.ok(farResult.distanceMeters > 100);
});
