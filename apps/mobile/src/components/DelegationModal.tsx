import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";

export interface DelegationModalProps {
  visible: boolean;
  onClose: () => void;
  onDelegate: (email: string, hours: number) => void;
}

export function DelegationModal({ visible, onClose, onDelegate }: DelegationModalProps) {
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState(4);

  const handleSubmit = () => {
    if (!email) {
      alert("Vui lòng nhập email giảng viên được ủy quyền");
      return;
    }
    onDelegate(email, hours);
    setEmail("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Ủy quyền Phiên điểm danh</Text>
          <Text style={styles.subtitle}>Bàn giao quyền chủ trì ca học cho giảng viên dạy thay</Text>

          <TextInput
            style={styles.input}
            placeholder="Email giảng viên (.edu / .edu.vn)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Thời hạn ủy quyền: {hours} giờ</Text>
            <View style={styles.chipRow}>
              {[2, 4, 8, 24].map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.chip, hours === h && styles.chipActive]}
                  onPress={() => setHours(h)}
                >
                  <Text style={[styles.chipText, hours === h && styles.chipTextActive]}>
                    {h}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Xác nhận ủy quyền</Text>
            </TouchableOpacity>
          </View>
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 16,
  },
  durationRow: {
    marginBottom: 24,
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  chipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  chipText: {
    fontSize: 14,
    color: "#475569",
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  cancelText: {
    color: "#475569",
    fontWeight: "600",
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#2563eb",
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
