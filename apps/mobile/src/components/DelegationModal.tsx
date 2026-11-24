import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { EDU_EMAIL_REGEX } from "@quickattend/contracts";

export interface DelegationModalProps {
  visible: boolean;
  onClose: () => void;
  onDelegate: (email: string, hours: number) => Promise<void> | void;
  targetTitle?: string;
}

export function DelegationModal({
  visible,
  onClose,
  onDelegate,
  targetTitle,
}: DelegationModalProps) {
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState(4);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMessage(null);
    setEmail("");
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage("Vui lòng nhập email giảng viên dạy thay");
      return;
    }

    if (!EDU_EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage("Email giảng viên phải thuộc tên miền .edu hoặc .edu.vn (VD: colleague@hcmut.edu.vn)");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onDelegate(trimmedEmail, hours);
      setEmail("");
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra khi ủy quyền";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Ủy quyền Phiên điểm danh</Text>
          <Text style={styles.subtitle}>
            {targetTitle
              ? `Bàn giao quyền chủ trì "${targetTitle}" cho giảng viên dạy thay`
              : "Bàn giao quyền chủ trì ca học cho giảng viên dạy thay"}
          </Text>

          <Text style={styles.inputLabel}>Email giảng viên được ủy quyền *</Text>
          <TextInput
            style={[styles.input, errorMessage ? styles.inputError : null]}
            placeholder="VD: lecturer@hcmut.edu.vn"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!isSubmitting}
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Thời hạn ủy quyền: {hours} giờ</Text>
            <View style={styles.chipRow}>
              {[2, 4, 8, 24].map((h) => (
                <TouchableOpacity
                  key={h}
                  disabled={isSubmitting}
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
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitText}>Xác nhận ủy quyền</Text>
              )}
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
    backgroundColor: "rgba(0, 0, 0, 0.45)",
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
    marginBottom: 18,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  durationRow: {
    marginTop: 16,
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
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
  },
  chipActive: {
    backgroundColor: "#0284c7",
    borderColor: "#0284c7",
  },
  chipText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
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
    fontSize: 15,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#0284c7",
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
});
