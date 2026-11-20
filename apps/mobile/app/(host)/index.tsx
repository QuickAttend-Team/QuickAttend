import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTemplateStore, TemplateItem } from "../../src/stores/templateStore";
import { DelegationModal } from "../../src/components/DelegationModal";
import { FONTS, COLORS, RADIUS } from "../../src/theme/typography";

export default function HostDashboardScreen() {
  const router = useRouter();
  const templates = useTemplateStore((state) => state.templates);

  const [isDelegationOpen, setIsDelegationOpen] = useState(false);
  const [selectedClassTitle, setSelectedClassTitle] = useState("");

  const handleStartSession = (template: TemplateItem) => {
    router.push({
      pathname: "/(host)/session",
      params: {
        title: template.title,
        roomName: template.roomName,
        duration: template.durationMinutes.toString(),
      },
    });
  };

  const handleOpenDelegation = (title: string) => {
    setSelectedClassTitle(title);
    setIsDelegationOpen(true);
  };

  const handleDelegateConfirm = (email: string, hours: number) => {
    Alert.alert(
      "Ủy quyền thành công",
      `Đã bàn giao quyền quản lý ca học ${selectedClassTitle} cho giảng viên ${email} trong ${hours} giờ.`
    );
  };

  return (
    <View style={styles.hostManage__container_01} data-component="HostDashboardScreen">
      <ScrollView
        contentContainerStyle={styles.hostManage__scrollContent_01}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section: Title & Lecturer Avatar */}
        <View style={styles.hostManage__header_01}>
          <View style={styles.hostManage__titleGroup_01}>
            <Text style={styles.hostManage__title_01}>Quản lý điểm danh</Text>
            {/* Date Badge */}
            <View style={styles.hostManage__dateBadge_01}>
              <Text style={styles.hostManage__dateBadgeText_01}>Hôm nay, Thứ Sáu 24/10</Text>
            </View>
          </View>

          {/* Lecturer Avatar with Online Green Dot */}
          <View style={styles.hostManage__avatarWrapper_01}>
            <View style={styles.hostManage__avatarCircle_01}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.hostManage__onlineDot_01} />
          </View>
        </View>

        {/* List of Class Cards */}
        <View style={styles.hostManage__cardsContainer_01}>
          {templates.map((item) => (
            <View key={`template-${item.id}`} style={styles.hostManage__card_01}>
              {/* Card Header: Course Title & Shift Badge */}
              <View style={styles.hostManage__cardHeaderRow_01}>
                <Text style={styles.hostManage__courseTitle_01} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.hostManage__shiftBadge_01}>
                  <Text style={styles.hostManage__shiftBadgeText_01}>
                    {item.shiftText || "Ca học"}
                  </Text>
                </View>
              </View>

              {/* Pills Group: Location & GPS */}
              <View style={styles.hostManage__pillsRow_01}>
                <View style={styles.hostManage__metaPill_01}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={COLORS.textMuted}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.hostManage__metaPillText_01}>{item.roomName}</Text>
                </View>

                <View style={styles.hostManage__metaPill_01}>
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={14}
                    color={COLORS.textMuted}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.hostManage__metaPillText_01}>
                    GPS: Bán kính {item.radiusMeters}m
                  </Text>
                </View>
              </View>

              {/* Beacon Badge */}
              <View
                style={[
                  styles.hostManage__beaconBadge_01,
                  item.beaconActive
                    ? styles.hostManage__beaconBadgeActive_01
                    : styles.hostManage__beaconBadgeInactive_01,
                ]}
              >
                <MaterialCommunityIcons
                  name="broadcast"
                  size={14}
                  color={item.beaconActive ? COLORS.primaryGreenDark : COLORS.textMuted}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.hostManage__beaconBadgeText_01,
                    item.beaconActive
                      ? styles.hostManage__beaconTextActive_01
                      : styles.hostManage__beaconTextInactive_01,
                  ]}
                >
                  {item.beaconText || "Beacon: Trạm tự động"}
                </Text>
              </View>

              {/* Student Count Row */}
              <View style={styles.hostManage__studentsRow_01}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={16}
                  color={COLORS.primaryGreenDark}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.hostManage__studentsCountText_01}>
                  {item.studentCountText || "60 sinh viên"}
                </Text>
              </View>

              {/* Primary Start Session Button (Lightning bolt neon green) */}
              <TouchableOpacity
                style={styles.hostManage__startButton_01}
                onPress={() => handleStartSession(item)}
                activeOpacity={0.88}
              >
                <Ionicons
                  name="flash"
                  size={16}
                  color={COLORS.primaryGreen}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.hostManage__startButtonText_01}>Bắt đầu ngay</Text>
              </TouchableOpacity>

              {/* Secondary Link: Delegate to TA / Substitute Teacher */}
              <TouchableOpacity
                style={styles.hostManage__delegateLink_01}
                onPress={() => handleOpenDelegation(item.title)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={15}
                  color={COLORS.textMuted}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.hostManage__delegateLinkText_01}>
                  Bàn giao quyền cho GV dạy thay
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bottom Section: Create New Template Button & Security Note */}
        <View style={styles.hostManage__bottomSection_01}>
          <TouchableOpacity
            style={styles.hostManage__createTemplateButton_01}
            onPress={() => router.push("/(host)/create-template")}
            activeOpacity={0.85}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="#334155"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.hostManage__createTemplateButtonText_01}>
              Tạo mẫu lớp học mới
            </Text>
          </TouchableOpacity>

          <View style={styles.hostManage__securityNotice_01}>
            <Ionicons
              name="lock-closed-outline"
              size={14}
              color={COLORS.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.hostManage__securityNoticeText_01}>
              Được mã hóa xác thực thiết bị và định vị cục bộ
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Delegation Modal */}
      <DelegationModal
        visible={isDelegationOpen}
        onClose={() => setIsDelegationOpen(false)}
        onDelegate={handleDelegateConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hostManage__container_01: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  hostManage__scrollContent_01: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  hostManage__header_01: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  hostManage__titleGroup_01: {
    flex: 1,
  },
  hostManage__title_01: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  hostManage__dateBadge_01: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  hostManage__dateBadgeText_01: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  hostManage__avatarWrapper_01: {
    position: "relative",
    marginLeft: 12,
  },
  hostManage__avatarCircle_01: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardDark,
    alignItems: "center",
    justifyContent: "center",
  },
  hostManage__onlineDot_01: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: COLORS.primaryGreen,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  hostManage__cardsContainer_01: {
    gap: 16,
    marginBottom: 20,
  },
  hostManage__card_01: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xxl,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  hostManage__cardHeaderRow_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  hostManage__courseTitle_01: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 19,
    color: COLORS.textDark,
    paddingRight: 8,
  },
  hostManage__shiftBadge_01: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  hostManage__shiftBadgeText_01: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#334155",
  },
  hostManage__pillsRow_01: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  hostManage__metaPill_01: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hostManage__metaPillText_01: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#334155",
  },
  hostManage__beaconBadge_01: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginBottom: 12,
  },
  hostManage__beaconBadgeActive_01: {
    backgroundColor: "#DCFCE7",
  },
  hostManage__beaconBadgeInactive_01: {
    backgroundColor: "#F1F5F9",
  },
  hostManage__beaconBadgeText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  hostManage__beaconTextActive_01: {
    color: COLORS.primaryGreenDark,
  },
  hostManage__beaconTextInactive_01: {
    color: COLORS.textMuted,
  },
  hostManage__studentsRow_01: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  hostManage__studentsCountText_01: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#334155",
  },
  hostManage__startButton_01: {
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
  hostManage__startButtonText_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  hostManage__delegateLink_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  hostManage__delegateLinkText_01: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  hostManage__bottomSection_01: {
    marginTop: 4,
    gap: 14,
  },
  hostManage__createTemplateButton_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.full,
    paddingVertical: 16,
  },
  hostManage__createTemplateButtonText_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#334155",
  },
  hostManage__securityNotice_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  hostManage__securityNoticeText_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
