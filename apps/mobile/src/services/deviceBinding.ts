import * as Application from "expo-application";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface DeviceSecurityCheck {
  isRootedOrJailbroken: boolean;
  isEmulator: boolean;
  isTampered: boolean;
  tamperWarnings: string[];
}

export interface DeviceInfo {
  deviceUuid: string;
  deviceName: string;
  platform: "IOS" | "ANDROID";
  isEmulatorOrRooted: boolean;
  securityCheck: DeviceSecurityCheck;
}

const SECURE_STORE_DEVICE_KEY = "quickattend_persistent_device_uuid";

/**
 * Checks for common emulator and tampering indicators
 */
export function detectDeviceIntegrity(): DeviceSecurityCheck {
  const warnings: string[] = [];
  let isEmulator = false;
  let isRootedOrJailbroken = false;

  // 1. Basic environment and platform checks
  const isWeb = Platform.OS === "web";
  if (isWeb) {
    warnings.push("Running in web browser environment");
    return {
      isRootedOrJailbroken: false,
      isEmulator: true,
      isTampered: true,
      tamperWarnings: warnings,
    };
  }

  // 2. Android Emulator heuristics
  if (Platform.OS === "android") {
    // Check known emulator markers from model or brand if present
    const isLikelyEmulator =
      typeof navigator !== "undefined" &&
      /android|google_sdk|emulator|genymotion|vbox86/i.test(navigator.userAgent || "");

    if (isLikelyEmulator) {
      isEmulator = true;
      warnings.push("Android emulator fingerprints detected");
    }
  }

  // 3. iOS Simulator heuristics
  if (Platform.OS === "ios") {
    const isLikelySimulator =
      typeof navigator !== "undefined" &&
      /simulator/i.test(navigator.userAgent || "");

    if (isLikelySimulator) {
      isEmulator = true;
      warnings.push("iOS simulator fingerprints detected");
    }
  }

  return {
    isRootedOrJailbroken,
    isEmulator,
    isTampered: isRootedOrJailbroken || isEmulator,
    tamperWarnings: warnings,
  };
}

/**
 * Extracts a persistent unique Hardware Identifier:
 * - iOS: getIosIdForVendorAsync()
 * - Android: getAndroidId()
 * - Falls back to a securely stored hardware token if native ID is unavailable
 */
export async function getHardwareDeviceIdentifier(): Promise<DeviceInfo> {
  const platform: "IOS" | "ANDROID" = Platform.OS === "ios" ? "IOS" : "ANDROID";
  let deviceUuid: string | null = null;

  // 1. Try to fetch native persistent ID
  try {
    if (Platform.OS === "android") {
      deviceUuid = Application.getAndroidId();
    } else if (Platform.OS === "ios") {
      deviceUuid = await Application.getIosIdForVendorAsync();
    }
  } catch (error) {
    console.warn("Could not retrieve native device ID:", error);
  }

  // 2. Fallback to / cross-check with SecureStore to guarantee persistence
  try {
    let savedUuid = await SecureStore.getItemAsync(SECURE_STORE_DEVICE_KEY);
    if (!savedUuid) {
      if (deviceUuid) {
        await SecureStore.setItemAsync(SECURE_STORE_DEVICE_KEY, deviceUuid);
      } else {
        savedUuid = `fallback-${platform.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        await SecureStore.setItemAsync(SECURE_STORE_DEVICE_KEY, savedUuid);
        deviceUuid = savedUuid;
      }
    } else if (!deviceUuid) {
      deviceUuid = savedUuid;
    }
  } catch {
    // SecureStore not available in certain web/testing environments
    if (!deviceUuid) {
      deviceUuid = `temp-${platform.toLowerCase()}-${Date.now()}`;
    }
  }

  const securityCheck = detectDeviceIntegrity();
  const isEmulatorOrRooted = securityCheck.isTampered;

  return {
    deviceUuid: deviceUuid || `unknown-${platform.toLowerCase()}`,
    deviceName: `${Platform.OS.toUpperCase()} Mobile Device`,
    platform,
    isEmulatorOrRooted,
    securityCheck,
  };
}

/**
 * Validates device integrity before allowing sensitive attendance actions
 */
export async function validateDeviceIntegrity(): Promise<{ valid: boolean; reason?: string }> {
  const info = await getHardwareDeviceIdentifier();
  if (info.isEmulatorOrRooted) {
    return {
      valid: false,
      reason: `Thiết bị không an toàn: ${info.securityCheck.tamperWarnings.join(", ")}`,
    };
  }
  return { valid: true };
}
