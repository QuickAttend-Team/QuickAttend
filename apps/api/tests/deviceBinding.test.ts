import assert from "node:assert/strict";
import test from "node:test";
import {
  verifyDeviceIntegrityAndBinding,
  checkDeviceOwnershipConflict,
} from "../src/lib/deviceBinding.js";
import { DomainError } from "../src/lib/errors.js";

test("Device Integrity: throws error if device is marked as rooted or emulator", () => {
  assert.throws(
    () => {
      verifyDeviceIntegrityAndBinding({
        userId: 101,
        incomingDeviceUuid: "android-hardware-uuid-9999",
        boundDeviceUuid: "android-hardware-uuid-9999",
        isEmulatorOrRooted: true,
      });
    },
    (err: unknown) => {
      assert.ok(err instanceof DomainError);
      assert.equal(err.code, "DEVICE_INTEGRITY_COMPROMISED");
      assert.equal(err.statusCode, 403);
      return true;
    }
  );
});

test("Device UUID Validation: rejects empty or short hardware UUIDs", () => {
  assert.throws(
    () => {
      verifyDeviceIntegrityAndBinding({
        userId: 101,
        incomingDeviceUuid: "short",
        boundDeviceUuid: null,
      });
    },
    (err: unknown) => {
      assert.ok(err instanceof DomainError);
      assert.equal(err.code, "VALIDATION_ERROR");
      return true;
    }
  );
});

test("Cross-Device Login Prevention: allows login when device matches bound UUID", () => {
  assert.doesNotThrow(() => {
    verifyDeviceIntegrityAndBinding({
      userId: 101,
      incomingDeviceUuid: "ios-hardware-vendor-id-12345",
      boundDeviceUuid: "ios-hardware-vendor-id-12345",
      isEmulatorOrRooted: false,
    });
  });
});

test("Cross-Device Login Prevention: rejects login from different device (Anti-Impersonation)", () => {
  assert.throws(
    () => {
      verifyDeviceIntegrityAndBinding({
        userId: 101,
        incomingDeviceUuid: "different-unauthorized-device-9999",
        boundDeviceUuid: "registered-device-12345",
        isEmulatorOrRooted: false,
      });
    },
    (err: unknown) => {
      assert.ok(err instanceof DomainError);
      assert.equal(err.code, "DEVICE_NOT_RECOGNIZED");
      assert.equal(err.statusCode, 403);
      return true;
    }
  );
});

test("Proxy Attendance Prevention: allows binding device to owner", () => {
  assert.doesNotThrow(() => {
    checkDeviceOwnershipConflict(
      { boundUserId: 101, deviceUuid: "device-uuid-12345" },
      101
    );
  });
});

test("Proxy Attendance Prevention: prevents multiple students using same device", () => {
  assert.throws(
    () => {
      // Student 102 tries to use Student 101's device
      checkDeviceOwnershipConflict(
        { boundUserId: 101, deviceUuid: "device-uuid-12345" },
        102
      );
    },
    (err: unknown) => {
      assert.ok(err instanceof DomainError);
      assert.equal(err.code, "DEVICE_BINDING_CONFLICT");
      assert.equal(err.statusCode, 409);
      return true;
    }
  );
});
