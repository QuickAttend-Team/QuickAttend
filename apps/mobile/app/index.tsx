import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuickAttend</Text>
      <Text style={styles.subtitle}>Hệ thống Điểm danh Tự động & Quản lý Ca học</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.hostButton]}
          onPress={() => router.push("/(host)")}
        >
          <Text style={styles.buttonText}>Dành cho Giảng viên (Host)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.guestButton]}
          onPress={() => router.push("/(guest)")}
        >
          <Text style={styles.buttonText}>Dành cho Sinh viên (Guest)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={[styles.buttonText, { color: "#2563eb" }]}>Đăng nhập tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  hostButton: {
    backgroundColor: "#2563eb",
  },
  guestButton: {
    backgroundColor: "#059669",
  },
  loginButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#2563eb",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
