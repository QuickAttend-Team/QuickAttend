import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

export interface FeedbackBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  status: "SUCCESS" | "OUT_OF_BOUNDS" | "DEVICE_MISMATCH";
  title?: string;
  roomName?: string;
  distanceMeters?: number;
  timestamp?: string;
}

export function FeedbackBottomSheet({
  visible,
  onClose,
  status,
  title = "Môn học",
  roomName = "Phòng học",
  distanceMeters = 0,
  timestamp = new Date().toLocaleTimeString(),
}: FeedbackBottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {status === "SUCCESS" && (
            <>
              <View style={[styles.iconCircle, styles.successCircle]}>
                <Text style={styles.iconText}>✓</Text>
              </View>
              <Text style={styles.statusTitle}>ĐIỂM DANH THÀNH CÔNG</Text>
              <Text style={styles.metaText}>{title} - Phòng {roomName}</Text>
              <Text style={styles.timeText}>Thời gian: {timestamp}</Text>
            </>
          )}

          {status === "OUT_OF_BOUNDS" && (
            <>
              <View style={[styles.iconCircle, styles.errorCircle]}>
                <Text style={styles.iconText}>✕</Text>
              </View>
              <Text style={[styles.statusTitle, { color: "#dc2626" }]}>NGOÀI PHẠM VI PHÒNG HỌC</Text>
              <Text style={styles.metaText}>Bạn đang cách phòng học khoảng {distanceMeters}m</Text>
              <Text style={styles.timeText}>Vui lòng di chuyển vào phòng học và thử lại.</Text>
            </>
          )}

          {status === "DEVICE_MISMATCH" && (
            <>
              <View style={[styles.iconCircle, styles.warningCircle]}>
                <Text style={styles.iconText}>!</Text>
              </View>
              <Text style={[styles.statusTitle, { color: "#d97706" }]}>THIẾT BỊ KHÔNG HỢP LỆ</Text>
              <Text style={styles.metaText}>Tài khoản này đã bị khóa với một thiết bị khác.</Text>
            </>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successCircle: {
    backgroundColor: "#dcfce7",
  },
  errorCircle: {
    backgroundColor: "#fee2e2",
  },
  warningCircle: {
    backgroundColor: "#fef3c7",
  },
  iconText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 8,
  },
  metaText: {
    fontSize: 15,
    color: "#334155",
    textAlign: "center",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 20,
  },
  closeButton: {
    width: "100%",
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
