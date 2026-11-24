import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useCountdown } from "../../src/hooks/useCountdown";
import { DelegationModal } from "../../src/components/DelegationModal";
import { CustomAlertModal } from "../../src/components/CustomAlertModal";
import { delegationService } from "../../src/services/delegationService";
import { FONTS, COLORS, RADIUS } from "../../src/theme/typography";

interface StudentFeedItem {
  id: string;
  name: string;
  studentId: string;
  verificationBadge: string;
  timestamp: string;
  avatarLetter: string;
  avatarColor: string;
}

const RECENT_STUDENTS: StudentFeedItem[] = [
  {
    id: "1",
    name: "Nguyễn Thành Long",
    studentId: "21120084",
    verificationBadge: "GPS Verified",
    timestamp: "07:44",
    avatarLetter: "L",
    avatarColor: "#0284C7",
  },
  {
    id: "2",
    name: "Lê Thị Hoàng Yến",
    studentId: "21120412",
    verificationBadge: "Biometric OK",
    timestamp: "07:43",
    avatarLetter: "Y",
    avatarColor: "#7C3AED",
  },
  {
    id: "3",
    name: "Phạm Quốc Huy",
    studentId: "21120199",
    verificationBadge: "GPS Verified",
    timestamp: "07:41",
    avatarLetter: "H",
    avatarColor: "#059669",
  },
];

const ABSENT_STUDENTS = [
  { id: "101", name: "Trần Anh Tuấn", studentId: "21120002" },
  { id: "102", name: "Ngô Gia Bảo", studentId: "21120015" },
  { id: "103", name: "Võ Minh Trí", studentId: "21120044" },
  { id: "104", name: "Đỗ Ngọc Ánh", studentId: "21120078" },
  { id: "105", name: "Bùi Thị Mai", studentId: "21120092" },
  { id: "106", name: "Đinh Quang Hải", studentId: "21120105" },
  { id: "107", name: "Hoàng Văn Nam", studentId: "21120120" },
  { id: "108", name: "Dương Quốc Cường", studentId: "21120133" },
  { id: "109", name: "Lý Gia Hân", studentId: "21120150" },
  { id: "110", name: "Vũ Đình Trọng", studentId: "21120177" },
  { id: "111", name: "Phan Tấn Đạt", studentId: "21120188" },
  { id: "112", name: "Hồ Bảo Châu", studentId: "21120201" },
  { id: "113", name: "Cao Thùy Linh", studentId: "21120215" },
  { id: "114", name: "Lương Gia Kiệt", studentId: "21120230" },
  { id: "115", name: "Mai Thanh Trúc", studentId: "21120245" },
  { id: "116", name: "Chu Văn An", studentId: "21120260" },
  { id: "117", name: "Tạ Minh Châu", studentId: "21120275" },
];

export default function ActiveSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title?: string;
    roomName?: string;
    duration?: string;
  }>();

  const title = params.title || "Lập trình Mobile – IT001";
  const roomName = params.roomName || "Phòng A201 (Cơ sở 1)";
  const initialDuration = params.duration ? parseInt(params.duration, 10) : 10;

  const [isDelegationOpen, setIsDelegationOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAbsentModalOpen, setIsAbsentModalOpen] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [isTimeUpOpen, setIsTimeUpOpen] = useState(false);
  const [delegateAlertMsg, setDelegateAlertMsg] = useState<string | null>(null);
  const [extraMinutes, setExtraMinutes] = useState(0);

  const { formatted: timerFormatted } = useCountdown(initialDuration + extraMinutes, () => {
    setIsTimeUpOpen(true);
  });

  const handleCopyCode = () => {
    // Copy code without intrusive alert
  };

  const handleAddFiveMinutes = () => {
    setExtraMinutes((prev) => prev + 5);
  };

  const handleEndSession = () => {
    setIsEndConfirmOpen(true);
  };

  const handleConfirmEndSession = () => {
    setIsEndConfirmOpen(false);
    router.replace("/(host)");
  };

  const handleDelegateConfirm = async (email: string, hours: number) => {
    try {
      const response = await delegationService.delegate({
        sessionId: 101,
        receiverEmail: email,
        durationHours: hours,
      });
      setDelegateAlertMsg(
        `Đã bàn giao quyền quản lý phiên điểm danh này cho giảng viên ${response.receiverEmail} trong ${hours} giờ.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi khi kết nối ủy quyền";
      setDelegateAlertMsg(msg);
    }
  };

  return (
    <View style={styles.hostSession__container_01} data-component="ActiveSessionScreen">
      {/* Header */}
      <View style={styles.hostSession__header_01}>
        <TouchableOpacity
          style={styles.hostSession__backButton_01}
          onPress={() => router.replace("/(host)")}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textDark} />
        </TouchableOpacity>

        <Text style={styles.hostSession__headerTitle_01}>Phiên điểm danh đang mở</Text>

        <View style={styles.hostSession__avatarCircle_01}>
          <Ionicons name="person" size={18} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.hostSession__scrollContent_01}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Course Info */}
        <View style={styles.hostSession__cardCourse_01}>
          <Text style={styles.hostSession__courseTitle_01}>{title}</Text>

          <View style={styles.hostSession__courseRow_01}>
            <View style={styles.hostSession__roomInfo_01}>
              <MaterialCommunityIcons
                name="door-sliding"
                size={16}
                color={COLORS.primaryGreenDark}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.hostSession__roomText_01}>{roomName}</Text>
            </View>

            <View style={styles.hostSession__statusBadge_01}>
              <View style={styles.hostSession__greenDotSmall_01} />
              <Text style={styles.hostSession__statusBadgeText_01}>Đang nhận diện</Text>
            </View>
          </View>

          <View style={styles.hostSession__timeInfo_01}>
            <Ionicons
              name="time-outline"
              size={15}
              color={COLORS.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.hostSession__timeText_01}>Ca sáng • 07:30 - 09:50</Text>
          </View>
        </View>

        {/* Card 2: Deep Dark Session Card */}
        <View style={styles.hostSession__cardDark_01}>
          {/* Top Row: Session Code & Actions */}
          <View style={styles.hostSession__darkTopRow_01}>
            <View style={styles.hostSession__codeColumn_01}>
              <Text style={styles.hostSession__codeLabel_01}>MÃ PHIÊN</Text>
              <View style={styles.hostSession__codeDisplayRow_01}>
                <Text style={styles.hostSession__codeText_01}>892  401</Text>
                <TouchableOpacity
                  style={styles.hostSession__copyButton_01}
                  onPress={handleCopyCode}
                  activeOpacity={0.8}
                >
                  <Ionicons name="copy-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.hostSession__copyButtonText_01}>Chép</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* QR Expand Button */}
            <TouchableOpacity
              style={styles.hostSession__qrExpandCard_01}
              onPress={() => setIsQrModalOpen(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" />
              <Text style={styles.hostSession__qrExpandText_01}>Phóng to</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hostSession__darkDivider_01} />

          {/* Bottom Row: Countdown Timer & Add Time */}
          <View style={styles.hostSession__darkBottomRow_01}>
            <View style={styles.hostSession__timerGroup_01}>
              <View style={styles.hostSession__timerRing_01}>
                <Ionicons name="hourglass-outline" size={16} color={COLORS.primaryGreen} />
              </View>
              <View style={styles.hostSession__timerTextGroup_01}>
                <Text style={styles.hostSession__timerLabel_01}>Thời gian còn lại</Text>
                <Text style={styles.hostSession__timerDigits_01}>{timerFormatted}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.hostSession__addTimeButton_01}
              onPress={handleAddFiveMinutes}
              activeOpacity={0.8}
            >
              <Ionicons name="reload-outline" size={14} color={COLORS.primaryGreen} style={{ marginRight: 4 }} />
              <Text style={styles.hostSession__addTimeButtonText_01}>+ 5 phút</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature Cards Row */}
        <View style={styles.hostSession__shieldsRow_01}>
          {/* Card Left: GPS Geofence */}
          <View style={styles.hostSession__shieldCard_01}>
            <View style={styles.hostSession__shieldBadgeGreen_01}>
              <Ionicons name="navigate-outline" size={16} color={COLORS.primaryGreenDark} />
            </View>
            <View style={styles.hostSession__shieldTextGroup_01}>
              <Text style={styles.hostSession__shieldLabel_01}>GPS Geofence</Text>
              <View style={styles.hostSession__shieldValueRow_01}>
                <View style={styles.hostSession__greenDotSmall_01} />
                <Text style={styles.hostSession__shieldValue_01}>50m</Text>
              </View>
            </View>
          </View>

          {/* Card Right: Device Lock */}
          <View style={styles.hostSession__shieldCard_02}>
            <View style={styles.hostSession__shieldBadgeGray_01}>
              <MaterialIcons name="fingerprint" size={18} color={COLORS.textMuted} />
            </View>
            <View style={styles.hostSession__shieldTextGroup_02}>
              <Text style={styles.hostSession__shieldLabel_02}>Khóa thiết bị</Text>
              <View style={styles.hostSession__shieldValueRow_02}>
                <View style={styles.hostSession__greenDotSmall_01} />
                <Text style={styles.hostSession__shieldValue_02}>1 máy / 1 SV</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Card 3: Attendance Feed */}
        <View style={styles.hostSession__cardAttendance_01}>
          <Text style={styles.hostSession__attLabel_01}>HIỆN DIỆN</Text>

          {/* Stats & Percentage */}
          <View style={styles.hostSession__statsRow_01}>
            <View style={styles.hostSession__statsCountGroup_01}>
              <Text style={styles.hostSession__statsNumber_01}>48</Text>
              <Text style={styles.hostSession__statsTotal_01}>/ 65 sinh viên</Text>
            </View>
            <Text style={styles.hostSession__percentageText_01}>74%</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.hostSession__progressTrack_01}>
            <View style={[styles.hostSession__progressBar_01, { width: "74%" }]} />
          </View>

          {/* Live Subheader */}
          <View style={styles.hostSession__feedHeader_01}>
            <Text style={styles.hostSession__feedTitle_01}>Vừa ghi nhận</Text>
            <Text style={styles.hostSession__feedSubtitle_01}>Tự động làm mới</Text>
          </View>

          {/* 3 Recent Students */}
          <View style={styles.hostSession__studentsList_01}>
            {RECENT_STUDENTS.map((student) => (
              <View key={student.id} style={styles.hostSession__studentItem_01}>
                <View
                  style={[
                    styles.hostSession__studentAvatar_01,
                    { backgroundColor: student.avatarColor },
                  ]}
                >
                  <Text style={styles.hostSession__avatarText_01}>{student.avatarLetter}</Text>
                </View>

                <View style={styles.hostSession__studentInfo_01}>
                  <Text style={styles.hostSession__studentName_01}>{student.name}</Text>
                  <Text style={styles.hostSession__studentMeta_01}>
                    SV: {student.studentId} • {student.verificationBadge}
                  </Text>
                </View>

                <View style={styles.hostSession__timestampBadge_01}>
                  <Text style={styles.hostSession__timestampText_01}>{student.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Absent Students CTA Button */}
          <TouchableOpacity
            style={styles.hostSession__absentButton_01}
            onPress={() => setIsAbsentModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="eye-off-outline"
              size={16}
              color={COLORS.textDark}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.hostSession__absentButtonText_01}>
              Xem 17 sinh viên chưa có mặt
            </Text>
          </TouchableOpacity>
        </View>

        {/* End Session Button */}
        <TouchableOpacity
          style={styles.hostSession__endButton_01}
          onPress={handleEndSession}
          activeOpacity={0.88}
        >
          <MaterialCommunityIcons
            name="square"
            size={14}
            color={COLORS.dangerRed}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.hostSession__endButtonText_01}>KẾT THÚC PHIÊN ĐIỂM DANH</Text>
        </TouchableOpacity>

        {/* Delegation Action Link */}
        <TouchableOpacity
          style={styles.hostSession__delegateLink_01}
          onPress={() => setIsDelegationOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="swap-horizontal"
            size={16}
            color={COLORS.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.hostSession__delegateLinkText_01}>
            Bàn giao quyền phiên cho trợ giảng
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* QR Code Fullscreen Modal */}
      <Modal visible={isQrModalOpen} transparent animationType="fade">
        <View style={styles.hostSession__modalOverlay_01}>
          <View style={styles.hostSession__qrModalCard_01}>
            <View style={styles.hostSession__modalHeader_01}>
              <Text style={styles.hostSession__qrModalTitle_01}>Mã QR Điểm Danh</Text>
              <TouchableOpacity onPress={() => setIsQrModalOpen(false)}>
                <Ionicons name="close-circle-outline" size={26} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.hostSession__qrBox_01}>
              <MaterialCommunityIcons name="qrcode" size={200} color={COLORS.cardDark} />
            </View>

            <Text style={styles.hostSession__qrModalCode_01}>892  401</Text>
            <Text style={styles.hostSession__qrModalSub_01}>
              Sinh viên có thể quét mã QR này để điểm danh tức thì
            </Text>
          </View>
        </View>
      </Modal>

      {/* Absent Students Detail Modal */}
      <Modal visible={isAbsentModalOpen} transparent animationType="slide">
        <View style={styles.hostSession__modalOverlay_02}>
          <View style={styles.hostSession__absentModalCard_01}>
            <View style={styles.hostSession__modalHeader_02}>
              <Text style={styles.hostSession__absentModalTitle_01}>
                Sinh viên chưa có mặt (17)
              </Text>
              <TouchableOpacity onPress={() => setIsAbsentModalOpen(false)}>
                <Ionicons name="close-circle-outline" size={26} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={ABSENT_STUDENTS}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={styles.hostSession__absentItem_01}>
                  <View style={styles.hostSession__absentIndexBadge_01}>
                    <Text style={styles.hostSession__absentIndexText_01}>{index + 1}</Text>
                  </View>
                  <View style={styles.hostSession__absentInfo_01}>
                    <Text style={styles.hostSession__absentName_01}>{item.name}</Text>
                    <Text style={styles.hostSession__absentId_01}>MSSV: {item.studentId}</Text>
                  </View>
                  <View style={styles.hostSession__absentTag_01}>
                    <Text style={styles.hostSession__absentTagText_01}>Vắng</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Delegation Modal */}
      <DelegationModal
        visible={isDelegationOpen}
        onClose={() => setIsDelegationOpen(false)}
        onDelegate={handleDelegateConfirm}
        targetTitle={title}
      />

      {/* Custom Confirmation Modal for End Session */}
      <CustomAlertModal
        visible={isEndConfirmOpen}
        onClose={() => setIsEndConfirmOpen(false)}
        onConfirm={handleConfirmEndSession}
        title="Xác nhận kết thúc"
        message="Bạn có chắc chắn muốn kết thúc phiên điểm danh này?"
        type="danger"
        confirmText="Kết thúc ngay"
        cancelText="Hủy"
      />

      {/* Custom Alert Modal for Time's Up */}
      <CustomAlertModal
        visible={isTimeUpOpen}
        onClose={() => {
          setIsTimeUpOpen(false);
          router.replace("/(host)");
        }}
        title="Hết giờ"
        message="Phiên điểm danh đã kết thúc theo thời gian quy định."
        type="warning"
        confirmText="Về trang chủ"
      />

      {/* Custom Alert Modal for Delegation Success */}
      <CustomAlertModal
        visible={Boolean(delegateAlertMsg)}
        onClose={() => setDelegateAlertMsg(null)}
        title="Ủy quyền thành công"
        message={delegateAlertMsg || ""}
        type="success"
        confirmText="Đóng"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hostSession__container_01: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  hostSession__header_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: "#F8FAFC",
  },
  hostSession__backButton_01: {
    padding: 6,
  },
  hostSession__headerTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textDark,
  },
  hostSession__avatarCircle_01: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardDark,
    alignItems: "center",
    justifyContent: "center",
  },
  hostSession__scrollContent_01: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 14,
  },
  hostSession__cardCourse_01: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  hostSession__courseTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.textDark,
    marginBottom: 8,
  },
  hostSession__courseRow_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  hostSession__roomInfo_01: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostSession__roomText_01: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  hostSession__statusBadge_01: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  hostSession__greenDotSmall_01: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryGreen,
    marginRight: 6,
  },
  hostSession__statusBadgeText_01: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: "#15803D",
  },
  hostSession__timeInfo_01: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  hostSession__timeText_01: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  hostSession__cardDark_01: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.xxl,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  hostSession__darkTopRow_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hostSession__codeColumn_01: {
    flex: 1,
  },
  hostSession__codeLabel_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.textSubtle,
    letterSpacing: 0.6,
  },
  hostSession__codeDisplayRow_01: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 12,
  },
  hostSession__codeText_01: {
    fontFamily: FONTS.extraBold,
    fontSize: 30,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  hostSession__copyButton_01: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  hostSession__copyButtonText_01: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#FFFFFF",
  },
  hostSession__qrExpandCard_01: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  hostSession__qrExpandText_01: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSubtle,
    marginTop: 4,
  },
  hostSession__darkDivider_01: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginVertical: 16,
  },
  hostSession__darkBottomRow_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hostSession__timerGroup_01: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostSession__timerRing_01: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    borderWidth: 2.5,
    borderColor: COLORS.primaryGreen,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  hostSession__timerTextGroup_01: {
    justifyContent: "center",
  },
  hostSession__timerLabel_01: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSubtle,
  },
  hostSession__timerDigits_01: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 1,
  },
  hostSession__addTimeButton_01: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  hostSession__addTimeButtonText_01: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.primaryGreen,
  },
  hostSession__shieldsRow_01: {
    flexDirection: "row",
    gap: 12,
  },
  hostSession__shieldCard_01: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  hostSession__shieldBadgeGreen_01: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: "#E6F4EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  hostSession__shieldTextGroup_01: {
    flex: 1,
  },
  hostSession__shieldLabel_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  hostSession__shieldValueRow_01: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  hostSession__shieldValue_01: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.textDark,
  },
  hostSession__shieldCard_02: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  hostSession__shieldBadgeGray_01: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  hostSession__shieldTextGroup_02: {
    flex: 1,
  },
  hostSession__shieldLabel_02: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  hostSession__shieldValueRow_02: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  hostSession__shieldValue_02: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.textDark,
  },
  hostSession__cardAttendance_01: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  hostSession__attLabel_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  hostSession__statsRow_01: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 10,
  },
  hostSession__statsCountGroup_01: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  hostSession__statsNumber_01: {
    fontFamily: FONTS.extraBold,
    fontSize: 26,
    color: COLORS.textDark,
  },
  hostSession__statsTotal_01: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  hostSession__percentageText_01: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.primaryGreen,
  },
  hostSession__progressTrack_01: {
    height: 7,
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: 16,
  },
  hostSession__progressBar_01: {
    height: "100%",
    backgroundColor: COLORS.primaryGreen,
    borderRadius: RADIUS.full,
  },
  hostSession__feedHeader_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  hostSession__feedTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textDark,
  },
  hostSession__feedSubtitle_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  hostSession__studentsList_01: {
    gap: 10,
    marginBottom: 16,
  },
  hostSession__studentItem_01: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.md,
    padding: 10,
  },
  hostSession__studentAvatar_01: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  hostSession__avatarText_01: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: "#FFFFFF",
  },
  hostSession__studentInfo_01: {
    flex: 1,
  },
  hostSession__studentName_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textDark,
  },
  hostSession__studentMeta_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  hostSession__timestampBadge_01: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  hostSession__timestampText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: "#15803D",
  },
  hostSession__absentButton_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.full,
    paddingVertical: 12,
  },
  hostSession__absentButtonText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.textDark,
  },
  hostSession__endButton_01: {
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
  hostSession__endButtonText_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  hostSession__delegateLink_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  hostSession__delegateLinkText_01: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  hostSession__modalOverlay_01: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  hostSession__qrModalCard_01: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    padding: 24,
    alignItems: "center",
  },
  hostSession__modalHeader_01: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  hostSession__qrModalTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textDark,
  },
  hostSession__qrBox_01: {
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  hostSession__qrModalCode_01: {
    fontFamily: FONTS.extraBold,
    fontSize: 26,
    color: COLORS.textDark,
    letterSpacing: 2,
    marginBottom: 6,
  },
  hostSession__qrModalSub_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  hostSession__modalOverlay_02: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  hostSession__absentModalCard_01: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: 20,
    maxHeight: "75%",
  },
  hostSession__modalHeader_02: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  hostSession__absentModalTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.textDark,
  },
  hostSession__absentItem_01: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  hostSession__absentIndexBadge_01: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  hostSession__absentIndexText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  hostSession__absentInfo_01: {
    flex: 1,
  },
  hostSession__absentName_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textDark,
  },
  hostSession__absentId_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  hostSession__absentTag_01: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  hostSession__absentTagText_01: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: "#DC2626",
  },
});
