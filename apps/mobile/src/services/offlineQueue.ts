import AsyncStorage from "@react-native-async-storage/async-storage";

export interface OfflineAttendancePayload {
  id: string;
  courseTitle: string;
  roomName: string;
  latitude: number;
  longitude: number;
  deviceUuid: string;
  biometricVerified: boolean;
  timestamp: string;
  createdAt: number;
  retryCount: number;
  status: "PENDING" | "SYNCING" | "FAILED";
}

const STORAGE_KEY = "@quickattend:offline_attendance_queue";

/**
 * Lấy toàn bộ hàng đợi ngoại tuyến từ AsyncStorage
 */
export async function getOfflineQueue(): Promise<OfflineAttendancePayload[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OfflineAttendancePayload[];
  } catch {
    return [];
  }
}

/**
 * Thêm một bản ghi điểm danh vào hàng đợi ngoại tuyến
 */
export async function enqueueAttendance(
  item: Omit<OfflineAttendancePayload, "id" | "createdAt" | "retryCount" | "status">
): Promise<OfflineAttendancePayload> {
  const queue = await getOfflineQueue();
  const newItem: OfflineAttendancePayload = {
    ...item,
    id: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
    retryCount: 0,
    status: "PENDING",
  };

  const updatedQueue = [...queue, newItem];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQueue));
  return newItem;
}

/**
 * Xóa một bản ghi khỏi hàng đợi (khi đã đồng bộ thành công)
 */
export async function removeOfflineItem(id: string): Promise<void> {
  const queue = await getOfflineQueue();
  const updated = queue.filter((item) => item.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Đếm số lượng bản ghi đang chờ đồng bộ
 */
export async function getPendingOfflineCount(): Promise<number> {
  const queue = await getOfflineQueue();
  return queue.filter((item) => item.status === "PENDING" || item.status === "FAILED").length;
}

/**
 * Xóa sạch toàn bộ hàng đợi
 */
export async function clearOfflineQueue(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/**
 * Tiến trình đồng bộ tự động duyệt qua các mục trong hàng đợi
 */
export async function processOfflineQueue(
  sendRequestFn?: (item: OfflineAttendancePayload) => Promise<boolean>
): Promise<{ syncedCount: number; failedCount: number }> {
  const queue = await getOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0, failedCount: 0 };

  let syncedCount = 0;
  let failedCount = 0;
  const remainingQueue: OfflineAttendancePayload[] = [];

  for (const item of queue) {
    try {
      let isSuccess = false;
      if (sendRequestFn) {
        isSuccess = await sendRequestFn(item);
      } else {
        // Mock sync request simulation
        await new Promise((resolve) => setTimeout(resolve, 600));
        isSuccess = true;
      }

      if (isSuccess) {
        syncedCount += 1;
      } else {
        failedCount += 1;
        remainingQueue.push({
          ...item,
          retryCount: item.retryCount + 1,
          status: "FAILED",
        });
      }
    } catch {
      failedCount += 1;
      remainingQueue.push({
        ...item,
        retryCount: item.retryCount + 1,
        status: "FAILED",
      });
    }
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remainingQueue));
  return { syncedCount, failedCount };
}
