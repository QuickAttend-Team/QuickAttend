import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";

export default function GuestAttendanceScreen() {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("Sẵn sàng điểm danh");

  const handleCheckIn = async () => {
    setLoading(true);
    setStatusText("Đang kiểm tra tọa độ GPS & mã thiết bị...");

    // Mock delay to demonstrate UI
    setTimeout(() => {
      setLoading(false);
      setStatusText("✅ Điểm danh thành công lúc " + new Date().toLocaleTimeString());
      Alert.alert(
        "Điểm danh thành công!",
        "Môn: Phát triển Ứng dụng Di động\nPhòng: H6-602\nVị trí: Trong bán kính 20m\nTrạng thái: Hợp lệ",
        [{ text: "OK" }]
      );
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Điểm danh Sinh viên</Text>
      <Text style={styles.subtitle}>Ngồi đúng phòng học và bấm nút bên dưới</Text>

      <View style={styles.centerSection}>
        <TouchableOpacity
          style={[styles.bigButton, loading && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <Text style={styles.bigButtonText}>ĐIỂM DANH{"\n"}NGAY</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      <View style={styles.footerInfo}>
        <Text style={styles.infoText}>🔒 Quyền riêng tư: Chỉ đối soát cự ly, không lưu lịch sử GPS.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },
  centerSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  bigButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  bigButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 32,
  },
  statusText: {
    marginTop: 24,
    fontSize: 15,
    fontWeight: "500",
    color: "#334155",
    textAlign: "center",
  },
  footerInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
});
