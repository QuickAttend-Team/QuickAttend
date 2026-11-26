import { useState, useCallback } from "react";
import * as Location from "expo-location";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  isMocked: boolean;
  mockWarning?: string;
}

export function useLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<LocationCoordinates | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<LocationCoordinates | null> => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        const msg = "Ứng dụng cần quyền vị trí để xác thực phạm vi phòng học.";
        setError(msg);
        setLoading(false);
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Anti-Fake GPS Checks:
      // 1. Native flag provided by Android/iOS Mock Location Provider
      let isMocked = Boolean(loc.mocked);
      let mockWarning: string | undefined;

      if (isMocked) {
        mockWarning = "Phát hiện thiết bị đang bật chế độ Giả lập vị trí (Mock Location / Fake GPS).";
      }

      // 2. Suspicious zero-accuracy or impossible altitude / speed anomalies
      if (!isMocked && loc.coords.accuracy === 0) {
        isMocked = true;
        mockWarning = "Độ chính xác GPS bất thường (0m), nghi vấn sử dụng công cụ Fake GPS.";
      }

      const result: LocationCoordinates = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
        isMocked,
        mockWarning,
      };

      setCoords(result);
      setLoading(false);

      if (isMocked) {
        setError(mockWarning || "Phát hiện phần mềm can thiệp tọa độ GPS.");
      }

      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không lấy được vị trí GPS";
      setError(msg);
      setLoading(false);
      return null;
    }
  }, []);

  return {
    getCurrentLocation,
    coords,
    loading,
    error,
  };
}
