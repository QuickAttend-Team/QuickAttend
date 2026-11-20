import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocation } from "../../src/hooks/useLocation";
import { useNetworkSync } from "../../src/hooks/useNetworkSync";
import { enqueueAttendance } from "../../src/services/offlineQueue";
import { getHardwareDeviceIdentifier } from "../../src/services/deviceBinding";
import { CustomAlertModal } from "../../src/components/CustomAlertModal";
import { FONTS, COLORS, RADIUS } from "../../src/theme/typography";

export default function GuestAttendanceScreen() {
  useLocation();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hasAttended, setHasAttended] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "warning" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const { isOnline, pendingCount, isSyncing, syncNow, refreshPendingCount } = useNetworkSync(
    (syncedCount) => {
      setAlertConfig({
        visible: true,
        title: "Đồng bộ thành công!",
        message: `Đã tự động gửi ${syncedCount} bản ghi điểm danh ngoại tuyến lên máy chủ.`,
        type: "success",
      });
    }
  );

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  const handleConfirmAttendance = async () => {
    setIsVerifying(true);

    try {
      const device = await getHardwareDeviceIdentifier();
      const nowTime = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (!isOnline) {
        // Enqueue into local offline storage when there is no internet
        await enqueueAttendance({
          courseTitle: "Lập trình Mobile – IT001",
          roomName: "Phòng A201 (Khu A)",
          latitude: 10.76262,
          longitude: 106.68231,
          deviceUuid: device.deviceUuid,
          biometricVerified: true,
          timestamp: nowTime,
        });

        await refreshPendingCount();
        setIsSheetOpen(false);
        setHasAttended(true);

        setAlertConfig({
          visible: true,
          title: "Đã lưu tạm ngoại tuyến",
          message:
            "Thiết bị đang không có mạng. Dữ liệu điểm danh của bạn đã được lưu an toàn trong máy và sẽ tự động đồng bộ lên máy chủ ngay khi có mạng trở lại.",
          type: "warning",
        });
      } else {
        // Simulate normal online verification request
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsSheetOpen(false);
        setHasAttended(true);

        setAlertConfig({
          visible: true,
          title: "Điểm danh thành công!",
          message:
            "Bạn đã được hệ thống ghi nhận có mặt tại Lập trình Mobile – IT001 (Phòng A201).",
          type: "success",
        });
      }
    } catch {
      // In case of any unexpected network/server crash, save safely offline
      await enqueueAttendance({
        courseTitle: "Lập trình Mobile – IT001",
        roomName: "Phòng A201 (Khu A)",
        latitude: 10.76262,
        longitude: 106.68231,
        deviceUuid: "local-backup-uuid",
        biometricVerified: true,
        timestamp: "07:45",
      });
      await refreshPendingCount();
      setIsSheetOpen(false);
      setHasAttended(true);

      setAlertConfig({
        visible: true,
        title: "Đã lưu tạm ngoại tuyến",
        message:
          "Sự cố đường truyền. Dữ liệu điểm danh đã được bảo lưu cục bộ và sẽ tự động gửi lại khi có mạng.",
        type: "warning",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.guestHome__container_01} data-component="GuestAttendanceScreen">
      {/* Top Header: Logo, Date, Greeting, ID Badge */}
      <View style={styles.guestHome__topSection_01}>
        {/* Logo quickattend. */}
        <View style={styles.guestHome__logoRow_01}>
          <View style={styles.guestHome__logoIconCircle_01}>
            <Ionicons name="stopwatch-outline" size={18} color="#FFFFFF" />
            <View style={styles.guestHome__logoAccentDot_01} />
          </View>
          <Text style={styles.guestHome__logoText_01}>
            quickattend<Text style={styles.guestHome__logoDot_01}>.</Text>
          </Text>
        </View>

        {/* Date & Greeting */}
        <View style={styles.guestHome__greetingGroup_01}>
          <Text style={styles.guestHome__dateText_01}>THỨ TƯ, 24 THÁNG 10</Text>
          <Text style={styles.guestHome__greetingName_01}>Xin chào, Lê Văn B</Text>
        </View>

        {/* Student ID Badge Chip */}
        <View style={styles.guestHome__studentIdChip_01}>
          <MaterialCommunityIcons
            name="card-account-details-outline"
            size={16}
            color={COLORS.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.guestHome__studentIdText_01}>SV: 20260101</Text>
        </View>
      </View>

      {/* Main Center Area: Hero Dark Card & GPS status */}
      <View style={styles.guestHome__centerArea_01}>
        {/* Hero Dark Card */}
        <View style={styles.guestHome__darkCard_01}>
          <Text style={styles.guestHome__darkCardTag_01}>CA HỌC HIỆN TẠI</Text>
          <Text style={styles.guestHome__darkCardHeading_01}>
            {hasAttended
              ? pendingCount > 0
                ? "Đã lưu tạm (Chờ mạng)"
                : "Đã điểm danh thành công"
              : "Sẵn sàng điểm danh"}
          </Text>

          <View style={styles.guestHome__courseDetailsGroup_01}>
            <Text style={styles.guestHome__courseDetailsText_01}>
              Phòng A2–301 • Môn: Lập trình thiết bị di động
            </Text>
            <Text style={styles.guestHome__courseTimeText_01}>Thời gian: 09:30 — 11:30</Text>
          </View>

          {/* Primary CTA Button */}
          <TouchableOpacity
            style={[
              styles.guestHome__ctaButton_01,
              hasAttended && styles.guestHome__ctaButtonDisabled_01,
            ]}
            onPress={handleOpenSheet}
            disabled={hasAttended}
            activeOpacity={0.88}
          >
            <Text style={styles.guestHome__ctaButtonText_01}>
              {hasAttended ? "ĐÃ GHI NHẬN CÓ MẶT" : "ĐIỂM DANH NGAY"}
            </Text>
            {!hasAttended && (
              <Ionicons
                name="arrow-forward"
                size={16}
                color={COLORS.cardDark}
                style={{ marginLeft: 8 }}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Status Chip: Tích hợp thông minh các trạng thái GPS / Ngoại tuyến / Thành công */}
        <TouchableOpacity
          style={[
            styles.guestHome__gpsStatusChip_01,
            hasAttended
              ? styles.guestHome__statusChipSuccess_01
              : !isOnline || pendingCount > 0
              ? styles.guestHome__statusChipOffline_01
              : styles.guestHome__statusChipNormal_01,
          ]}
          onPress={pendingCount > 0 && isOnline ? syncNow : undefined}
          activeOpacity={pendingCount > 0 && isOnline ? 0.8 : 1}
        >
          <Text
            style={[
              styles.guestHome__gpsStatusText_01,
              hasAttended
                ? styles.guestHome__statusTextSuccess_01
                : !isOnline || pendingCount > 0
                ? styles.guestHome__statusTextOffline_01
                : styles.guestHome__statusTextNormal_01,
            ]}
          >
            {hasAttended
              ? pendingCount > 0
                ? "Đã lưu tạm ngoại tuyến"
                : "Điểm danh thành công"
              : !isOnline
              ? "Chế độ ngoại tuyến"
              : pendingCount > 0
              ? isSyncing
                ? "Đang tự động đồng bộ lên máy chủ..."
                : `Đã lưu tạm ngoại tuyến (${pendingCount} bản ghi • Chạm để đồng bộ)`
              : "Vị trí GPS: Đang kết nối nền"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Security Footer Notice */}
      <View style={styles.guestHome__securityFooter_01}>
        <Ionicons
          name="lock-closed-outline"
          size={14}
          color={COLORS.textMuted}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.guestHome__securityFooterText_01}>
          Xác thực vị trí bảo mật hai lớp chuẩn sinh viên
        </Text>
      </View>

      {/* Verification Bottom Sheet Popup */}
      <Modal visible={isSheetOpen} transparent animationType="slide">
        <View style={styles.guestHome__modalOverlay_01}>
          <View style={styles.guestHome__sheetCard_01}>
            {/* Notch Drag Indicator */}
            <View style={styles.guestHome__sheetNotch_01} />

            {/* Title */}
            <Text style={styles.guestHome__sheetTitle_01}>Xác thực lớp học</Text>

            {/* Course Information Box */}
            <View style={styles.guestHome__sheetCourseBox_01}>
              <View style={styles.guestHome__sheetCourseRow_01}>
                <Text style={styles.guestHome__sheetCourseName_01}>
                  Lập trình Mobile – IT001
                </Text>
                <Text style={styles.guestHome__sheetShiftTag_01}>Ca sáng</Text>
              </View>

              <View style={styles.guestHome__sheetLecturerRow_01}>
                <Ionicons
                  name="person-outline"
                  size={14}
                  color={COLORS.textMuted}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.guestHome__sheetLecturerText_01}>GV. Nguyễn Văn A</Text>
              </View>

              <View style={styles.guestHome__sheetMetaRow_01}>
                <View style={styles.guestHome__sheetMetaItem_01}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={COLORS.textMuted}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.guestHome__sheetMetaText_01}>07:30 - 09:50</Text>
                </View>

                <Text style={styles.guestHome__sheetDotSeparator_01}>•</Text>

                <View style={styles.guestHome__sheetMetaItem_01}>
                  <MaterialCommunityIcons
                    name="door-sliding"
                    size={14}
                    color={COLORS.textMuted}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.guestHome__sheetMetaText_01}>Phòng A201 (Khu A)</Text>
                </View>
              </View>
            </View>

            {/* Section: TIÊU CHUẨN KIỂM DUYỆT */}
            <Text style={styles.guestHome__sheetCriteriaHeading_01}>
              TIÊU CHUẨN KIỂM DUYỆT
            </Text>

            {/* Criteria List */}
            <View style={styles.guestHome__sheetCriteriaList_01}>
              {/* Item 1: Vị trí & Bluetooth Beacon */}
              <View style={styles.guestHome__sheetCriteriaItem_01}>
                <View style={styles.guestHome__sheetCriteriaIconCircle_01}>
                  <MaterialCommunityIcons
                    name="broadcast"
                    size={18}
                    color={COLORS.primaryGreenDark}
                  />
                </View>
                <View style={styles.guestHome__sheetCriteriaTextGroup_01}>
                  <Text style={styles.guestHome__sheetCriteriaTitle_01}>
                    Vị trí & Bluetooth Beacon
                  </Text>
                  <Text style={styles.guestHome__sheetCriteriaSubtitle_01}>
                    Bán kính &lt; 5m • Trạm A201–01
                  </Text>
                </View>
                <View style={styles.guestHome__sheetCriteriaBadge_01}>
                  <Text style={styles.guestHome__sheetCriteriaBadgeText_01}>✓ Đã khớp</Text>
                </View>
              </View>

              {/* Item 2: Định danh thiết bị */}
              <View style={styles.guestHome__sheetCriteriaItem_01}>
                <View style={styles.guestHome__sheetCriteriaIconCircle_01}>
                  <MaterialCommunityIcons
                    name="cellphone-check"
                    size={18}
                    color={COLORS.primaryGreenDark}
                  />
                </View>
                <View style={styles.guestHome__sheetCriteriaTextGroup_01}>
                  <Text style={styles.guestHome__sheetCriteriaTitle_01}>
                    Định danh thiết bị
                  </Text>
                  <Text style={styles.guestHome__sheetCriteriaSubtitle_01}>
                    Pixel 8 Pro • Đã cấp quyền
                  </Text>
                </View>
                <View style={styles.guestHome__sheetCriteriaBadge_01}>
                  <Text style={styles.guestHome__sheetCriteriaBadgeText_01}>✓ Chính chủ</Text>
                </View>
              </View>

              {/* Item 3: Sinh trắc khuôn mặt */}
              <View style={styles.guestHome__sheetCriteriaItem_01}>
                <View style={styles.guestHome__sheetCriteriaIconCircle_01}>
                  <MaterialCommunityIcons
                    name="shield-check-outline"
                    size={18}
                    color={COLORS.primaryGreenDark}
                  />
                </View>
                <View style={styles.guestHome__sheetCriteriaTextGroup_01}>
                  <Text style={styles.guestHome__sheetCriteriaTitle_01}>
                    Sinh trắc khuôn mặt
                  </Text>
                  <Text style={styles.guestHome__sheetCriteriaSubtitle_01}>
                    Độ tin cậy 99.4%
                  </Text>
                </View>
                <View style={styles.guestHome__sheetCriteriaBadge_01}>
                  <Text style={styles.guestHome__sheetCriteriaBadgeText_01}>✓ Khớp ảnh</Text>
                </View>
              </View>
            </View>

            {/* Confirm CTA Button */}
            <TouchableOpacity
              style={styles.guestHome__sheetConfirmButton_01}
              onPress={handleConfirmAttendance}
              disabled={isVerifying}
              activeOpacity={0.88}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="finger-print-outline"
                    size={18}
                    color={COLORS.primaryGreen}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.guestHome__sheetConfirmButtonText_01}>
                    XÁC NHẬN ĐIỂM DANH
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom Alert Modal */}
      <CustomAlertModal
        visible={alertConfig.visible}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="Đóng"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  guestHome__container_01: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 54,
    paddingBottom: 28,
  },
  guestHome__topSection_01: {
    gap: 12,
  },
  guestHome__logoRow_01: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  guestHome__logoIconCircle_01: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    position: "relative",
  },
  guestHome__logoAccentDot_01: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primaryGreen,
  },
  guestHome__logoText_01: {
    fontFamily: FONTS.extraBold,
    fontSize: 22,
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  guestHome__logoDot_01: {
    color: COLORS.primaryGreen,
  },
  guestHome__greetingGroup_01: {
    gap: 4,
  },
  guestHome__dateText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  guestHome__greetingName_01: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.textDark,
  },
  guestHome__studentIdChip_01: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  guestHome__studentIdText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#334155",
  },
  guestHome__centerArea_01: {
    gap: 14,
  },
  guestHome__darkCard_01: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.xxl,
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  guestHome__darkCardTag_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.textSubtle,
    letterSpacing: 0.8,
  },
  guestHome__darkCardHeading_01: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: "#FFFFFF",
    marginTop: 8,
  },
  guestHome__courseDetailsGroup_01: {
    marginTop: 10,
    gap: 4,
  },
  guestHome__courseDetailsText_01: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#CBD5E1",
  },
  guestHome__courseTimeText_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSubtle,
  },
  guestHome__ctaButton_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    marginTop: 24,
  },
  guestHome__ctaButtonDisabled_01: {
    opacity: 0.6,
  },
  guestHome__ctaButtonText_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.cardDark,
    letterSpacing: 0.5,
  },
  guestHome__gpsStatusChip_01: {
    alignSelf: "center",
    borderRadius: RADIUS.full,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  guestHome__statusChipNormal_01: {
    backgroundColor: "#ECFDF5",
  },
  guestHome__statusChipOffline_01: {
    backgroundColor: "#FEF3C7",
  },
  guestHome__statusChipSuccess_01: {
    backgroundColor: "#DCFCE7",
  },
  guestHome__gpsStatusText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  guestHome__statusTextNormal_01: {
    color: COLORS.primaryGreenDark,
  },
  guestHome__statusTextOffline_01: {
    color: "#B45309",
  },
  guestHome__statusTextSuccess_01: {
    color: "#15803D",
  },
  guestHome__securityFooter_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  guestHome__securityFooterText_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  guestHome__modalOverlay_01: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  guestHome__sheetCard_01: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
  },
  guestHome__sheetNotch_01: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 14,
  },
  guestHome__sheetTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.textDark,
    marginBottom: 12,
  },
  guestHome__sheetCourseBox_01: {
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 16,
  },
  guestHome__sheetCourseRow_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  guestHome__sheetCourseName_01: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.textDark,
  },
  guestHome__sheetShiftTag_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.primaryGreenDark,
  },
  guestHome__sheetLecturerRow_01: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  guestHome__sheetLecturerText_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  guestHome__sheetMetaRow_01: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestHome__sheetMetaItem_01: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestHome__sheetMetaText_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  guestHome__sheetDotSeparator_01: {
    marginHorizontal: 8,
    color: COLORS.textSubtle,
  },
  guestHome__sheetCriteriaHeading_01: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  guestHome__sheetCriteriaList_01: {
    gap: 12,
    marginBottom: 20,
  },
  guestHome__sheetCriteriaItem_01: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestHome__sheetCriteriaIconCircle_01: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: "#E6F4EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  guestHome__sheetCriteriaTextGroup_01: {
    flex: 1,
  },
  guestHome__sheetCriteriaTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.textDark,
  },
  guestHome__sheetCriteriaSubtitle_01: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  guestHome__sheetCriteriaBadge_01: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  guestHome__sheetCriteriaBadgeText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: "#15803D",
  },
  guestHome__sheetConfirmButton_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  guestHome__sheetConfirmButtonText_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
});
