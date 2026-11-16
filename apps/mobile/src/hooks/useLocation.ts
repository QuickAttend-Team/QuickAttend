import { useState, useCallback } from "react";
import * as Location from "expo-location";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  isMocked?: boolean;
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
        setError("Ứng dụng cần quyền vị trí để xác thực phạm vi phòng học.");
        setLoading(false);
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const result: LocationCoordinates = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
        isMocked: loc.mocked,
      };

      setCoords(result);
      setLoading(false);
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
