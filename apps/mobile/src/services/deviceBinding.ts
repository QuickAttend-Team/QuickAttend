import * as Application from "expo-application";
import { Platform } from "react-native";

export interface DeviceInfo {
  deviceUuid: string;
  deviceName: string;
  platform: "IOS" | "ANDROID";
  isEmulatorOrRooted: boolean;
}

/**
 * Extracts a persistent unique Hardware Identifier
 * iOS: getIosIdForVendorAsync()
 * Android: getAndroidId()
 */
export async function getHardwareDeviceIdentifier(): Promise<DeviceInfo> {
  let deviceUuid = "unknown-device-uuid";
  const platform = Platform.OS === "ios" ? "IOS" : "ANDROID";

  try {
    if (Platform.OS === "android") {
      deviceUuid = Application.getAndroidId() ?? `android-fallback-${Date.now()}`;
    } else if (Platform.OS === "ios") {
      const iosId = await Application.getIosIdForVendorAsync();
      deviceUuid = iosId ?? `ios-fallback-${Date.now()}`;
    }
  } catch (error) {
    console.warn("Could not retrieve native device ID, using fallback", error);
  }

  return {
    deviceUuid,
    deviceName: `${Platform.OS.toUpperCase()} Device`,
    platform,
    isEmulatorOrRooted: false, // Updated by security checks
  };
}
