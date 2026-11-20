import { useState, useEffect, useCallback } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import {
  getPendingOfflineCount,
  processOfflineQueue,
} from "../services/offlineQueue";

export interface NetworkSyncResult {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  syncNow: () => Promise<{ syncedCount: number; failedCount: number }>;
  refreshPendingCount: () => Promise<number>;
}

export function useNetworkSync(onAutoSyncComplete?: (syncedCount: number) => void): NetworkSyncResult {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const refreshPendingCount = useCallback(async () => {
    const count = await getPendingOfflineCount();
    setPendingCount(count);
    return count;
  }, []);

  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await processOfflineQueue();
      await refreshPendingCount();
      if (result.syncedCount > 0 && onAutoSyncComplete) {
        onAutoSyncComplete(result.syncedCount);
      }
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [onAutoSyncComplete, refreshPendingCount]);

  useEffect(() => {
    // Initial pending count load
    refreshPendingCount();

    // Subscribe to network connectivity changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = Boolean(state.isConnected && (state.isInternetReachable ?? true));
      setIsOnline((prevOnline) => {
        // If we transitioned from offline to online, trigger automatic sync
        if (!prevOnline && online) {
          syncNow();
        }
        return online;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [refreshPendingCount, syncNow]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    syncNow,
    refreshPendingCount,
  };
}
