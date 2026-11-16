import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

interface TemplateItem {
  id: number;
  title: string;
  roomName: string;
  radiusMeters: number;
  durationMinutes: number;
}

const MOCK_TEMPLATES: TemplateItem[] = [
  {
    id: 1,
    title: "Phát triển Ứng dụng Di động - CO3043",
    roomName: "H6-602",
    radiusMeters: 20,
    durationMinutes: 15,
  },
  {
    id: 2,
    title: "Quản lý Dự án Phần mềm - CO3001",
    roomName: "B4-301",
    radiusMeters: 50,
    durationMinutes: 20,
  },
];

export default function HostDashboardScreen() {
  const router = useRouter();

  const handleStartSession = (template: TemplateItem) => {
    // M2-09: Khởi chạy 1-chạm
    alert(`Bắt đầu phiên điểm danh cho môn: ${template.title} (Phòng: ${template.roomName})`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Xin chào Giảng viên,</Text>
        <Text style={styles.title}>Mẫu điểm danh đã lưu</Text>
      </View>

      <FlatList
        data={MOCK_TEMPLATES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDetail}>Phòng: {item.roomName} | Bán kính: {item.radiusMeters}m</Text>
            <Text style={styles.cardDetail}>Thời lượng: {item.durationMinutes} phút</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => handleStartSession(item)}
              >
                <Text style={styles.startButtonText}>Bắt đầu 1 chạm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => alert("Mở form tạo mẫu điểm danh mới")}
      >
        <Text style={styles.createButtonText}>+ Tạo mẫu mới</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: "#64748b",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardDetail: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  startButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
