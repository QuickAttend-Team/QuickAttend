import { DomainError } from "./errors.js";

export interface DeviceBindingVerificationInput {
  userId: number;
  incomingDeviceUuid: string;
  boundDeviceUuid?: string | null;
  platform?: string;
  isEmulatorOrRooted?: boolean;
}

export interface ExistingBindingCheck {
  boundUserId: number;
  deviceUuid: string;
}

/**
 * Validates hardware integrity and enforces strict one-to-one binding:
 * 1. Checks device integrity: Rejects devices that are rooted, jailbroken, or emulators.
 * 2. Cross-Device Login Prevention (Anti-Impersonation):
 *    Ensures a student cannot log in from a device different from their registered/bound device.
 * 3. Proxy Attendance Prevention (Anti-Buddy Attendance):
 *    Ensures a single physical device cannot be bound to multiple student accounts.
 */
export function verifyDeviceIntegrityAndBinding(input: DeviceBindingVerificationInput): void {
  const { userId, incomingDeviceUuid, boundDeviceUuid, isEmulatorOrRooted } = input;

  // 1. Device Integrity Check
  if (isEmulatorOrRooted) {
    throw new DomainError(
      "DEVICE_INTEGRITY_COMPROMISED",
      "Thiết bị không an toàn: Phát hiện can thiệp hệ thống (Root/Jailbreak) hoặc môi trường giả lập (Emulator).",
      403
    );
  }

  // 2. Validate Device UUID format
  if (!incomingDeviceUuid || typeof incomingDeviceUuid !== "string" || incomingDeviceUuid.trim().length < 10) {
    throw new DomainError(
      "VALIDATION_ERROR",
      "Mã phần cứng thiết bị (Hardware UUID) không hợp lệ.",
      400
    );
  }

  // 3. Cross-Device Login check: If user already has a bound device, the incoming device must match
  if (boundDeviceUuid && boundDeviceUuid !== incomingDeviceUuid) {
    throw new DomainError(
      "DEVICE_NOT_RECOGNIZED",
      "Thiết bị này không trùng khớp với thiết bị đã liên kết với tài khoản sinh viên của bạn. Mỗi tài khoản chỉ được phép sử dụng trên thiết bị đã đăng ký ban đầu.",
      403,
      {
        expectedDeviceUuid: boundDeviceUuid,
        providedDeviceUuid: incomingDeviceUuid,
      }
    );
  }
}

/**
 * Checks whether this physical device is already bound to another student
 * (Enforcing 1 Device = 1 Student)
 */
export function checkDeviceOwnershipConflict(
  existingBinding: ExistingBindingCheck | null | undefined,
  currentUserId: number
): void {
  if (existingBinding && existingBinding.boundUserId !== currentUserId) {
    throw new DomainError(
      "DEVICE_BINDING_CONFLICT",
      "Thiết bị này đã được liên kết với một sinh viên khác. Không thể dùng chung thiết bị để điểm danh hộ.",
      409,
      {
        conflictUserId: existingBinding.boundUserId,
      }
    );
  }
}
