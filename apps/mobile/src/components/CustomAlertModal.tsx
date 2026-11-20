import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONTS, COLORS, RADIUS } from "../theme/typography";

export interface CustomAlertModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "danger" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export function CustomAlertModal({
  visible,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "Đóng",
  cancelText,
  onConfirm,
}: CustomAlertModalProps) {
  const isConfirmation = Boolean(cancelText && onConfirm);

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          name: "checkmark-circle" as const,
          color: COLORS.primaryGreen,
          bg: "#DCFCE7",
        };
      case "danger":
        return {
          name: "alert-circle" as const,
          color: COLORS.dangerRed,
          bg: "#FEE2E2",
        };
      case "warning":
        return {
          name: "warning" as const,
          color: "#D97706",
          bg: "#FEF3C7",
        };
      case "info":
      default:
        return {
          name: "information-circle" as const,
          color: "#0284C7",
          bg: "#E0F2FE",
        };
    }
  };

  const iconConfig = getIconConfig();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.alertModal__overlay_01}>
        <View style={styles.alertModal__card_01}>
          {/* Top Circular Icon */}
          <View style={[styles.alertModal__iconCircle_01, { backgroundColor: iconConfig.bg }]}>
            <Ionicons name={iconConfig.name} size={32} color={iconConfig.color} />
          </View>

          {/* Title */}
          <Text style={styles.alertModal__title_01}>{title}</Text>

          {/* Message */}
          <Text style={styles.alertModal__message_01}>{message}</Text>

          {/* Buttons */}
          {isConfirmation ? (
            <View style={styles.alertModal__actionsRow_01}>
              <TouchableOpacity
                style={styles.alertModal__cancelButton_01}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.alertModal__cancelText_01}>{cancelText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.alertModal__confirmButton_01,
                  type === "danger"
                    ? styles.alertModal__btnDanger_01
                    : styles.alertModal__btnPrimary_01,
                ]}
                onPress={handleConfirm}
                activeOpacity={0.88}
              >
                <Text style={styles.alertModal__confirmText_01}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.alertModal__singleButton_01}
              onPress={handleConfirm}
              activeOpacity={0.88}
            >
              <Text style={styles.alertModal__singleButtonText_01}>{confirmText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  alertModal__overlay_01: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  alertModal__card_01: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xxl,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  alertModal__iconCircle_01: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  alertModal__title_01: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textDark,
    textAlign: "center",
    marginTop: 8,
  },
  alertModal__message_01: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  alertModal__actionsRow_01: {
    flexDirection: "row",
    marginTop: 22,
    gap: 12,
    width: "100%",
  },
  alertModal__cancelButton_01: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.full,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  alertModal__cancelText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: "#475569",
  },
  alertModal__confirmButton_01: {
    flex: 1,
    borderRadius: RADIUS.full,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  alertModal__btnPrimary_01: {
    backgroundColor: COLORS.cardDark,
  },
  alertModal__btnDanger_01: {
    backgroundColor: COLORS.dangerRed,
  },
  alertModal__confirmText_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#FFFFFF",
  },
  alertModal__singleButton_01: {
    width: "100%",
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.full,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  alertModal__singleButtonText_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#FFFFFF",
  },
});
