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
import { delegationService } from "../../src/services/delegationService";
import { FONTS, COLORS, RADIUS } from "../../src/theme/typography";

export default function HostDashboardScreen() {
  const router = useRouter();
  const templates = useTemplateStore((state) => state.templates);
  const receivedTemplates = useTemplateStore((state) => state.receivedTemplates);
  const delegateTemplate = useTemplateStore((state) => state.delegateTemplate);
  const revokeDelegation = useTemplateStore((state) => state.revokeDelegation);

  const [isDelegationOpen, setIsDelegationOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

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

  const handleOpenDelegation = (template: TemplateItem) => {
    setSelectedTemplate(template);
    setIsDelegationOpen(true);
  };

  const handleDelegateConfirm = async (email: string, hours: number) => {
    if (!selectedTemplate) return;

    try {
      const response = await delegationService.delegate({
        templateId: selectedTemplate.id,
        receiverEmail: email,
        durationHours: hours,
      });

      delegateTemplate(selectedTemplate.id, response.receiverEmail, hours);

      Alert.alert(
        "Ủy quyền thành công",
        `Đã bàn giao quyền quản lý ca học "${selectedTemplate.title}" cho giảng viên ${response.receiverEmail} trong ${hours} giờ.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi khi kết nối ủy quyền";
      Alert.alert("Ủy quyền thất bại", msg);
    }
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

        {/* Section: My Class Templates */}
        <View style={styles.hostManage__sectionHeader_01}>
          <Ionicons name="calendar-outline" size={17} color={COLORS.textDark} style={{ marginRight: 6 }} />
          <Text style={styles.hostManage__sectionTitle_01}>Ca học của tôi</Text>
        </View>

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
                    GPS ({item.radiusMeters}m)
                  </Text>
                </View>

                <View style={styles.hostManage__metaPill_01}>
                  <MaterialCommunityIcons
                    name="timer-outline"
                    size={14}
                    color={COLORS.textMuted}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.hostManage__metaPillText_01}>
                    {item.durationMinutes} phút
                  </Text>
                </View>
              </View>

              {/* Real-time Beacon Status */}
              <View style={styles.hostManage__beaconRow_01}>
                <View
                  style={[
                    styles.hostManage__beaconDot_01,
                    {
                      backgroundColor: item.beaconActive
                        ? COLORS.primaryGreen
                        : COLORS.textMuted,
                    },
                  ]}
                />
                <Text style={styles.hostManage__beaconText_01}>
                  {item.beaconText || "Beacon: Trạm tự động"}
                </Text>
              </View>

              {/* Students count info */}
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

              {/* Primary Start Session Button */}
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

              {/* Delegation Section: Active Status or Action Link */}
              {item.isDelegated ? (
                <View style={styles.hostManage__delegatedBanner_01}>
                  <View style={styles.hostManage__delegatedInfo_01}>
                    <Ionicons name="time-outline" size={15} color="#0284C7" style={{ marginRight: 5 }} />
                    <Text style={styles.hostManage__delegatedBannerText_01} numberOfLines={1}>
                      Ủy quyền: {item.delegatedToEmail} ({item.delegatedHours}h)
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      revokeDelegation(item.id);
                      Alert.alert("Thu hồi thành công", "Đã thu hồi quyền quản lý ca học.");
                    }}
                    style={styles.hostManage__revokeBtn_01}
                  >
                    <Text style={styles.hostManage__revokeBtnText_01}>Thu hồi</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.hostManage__delegateLink_01}
                  onPress={() => handleOpenDelegation(item)}
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
              )}
            </View>
          ))}
        </View>

        {/* Section: Received Delegations from Colleagues */}
        {receivedTemplates.length > 0 && (
          <View style={styles.hostManage__receivedSection_01}>
            <View style={styles.hostManage__sectionHeader_01}>
              <Ionicons name="git-pull-request-outline" size={17} color="#0284C7" style={{ marginRight: 6 }} />
              <Text style={[styles.hostManage__sectionTitle_01, { color: "#0369A1" }]}>
                Ca học được ủy quyền nhận
              </Text>
            </View>

            {receivedTemplates.map((item) => (
              <View
                key={`received-${item.id}`}
                style={[styles.hostManage__card_01, styles.hostManage__receivedCard_01]}
              >
                <View style={styles.hostManage__cardHeaderRow_01}>
                  <Text style={styles.hostManage__courseTitle_01} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.hostManage__receivedBadge_01}>
                    <Text style={styles.hostManage__receivedBadgeText_01}>Được ủy quyền</Text>
                  </View>
                </View>

                <View style={styles.hostManage__delegatedFromRow_01}>
                  <Ionicons name="person-outline" size={13} color="#0369A1" style={{ marginRight: 4 }} />
                  <Text style={styles.hostManage__delegatedFromText_01}>
                    Ủy quyền bởi: {item.delegatedFromEmail} ({item.delegatedHours}h)
                  </Text>
                </View>

                <View style={styles.hostManage__pillsRow_01}>
                  <View style={styles.hostManage__metaPill_01}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textMuted} style={{ marginRight: 4 }} />
                    <Text style={styles.hostManage__metaPillText_01}>{item.roomName}</Text>
                  </View>
                  <View style={styles.hostManage__metaPill_01}>
                    <MaterialCommunityIcons name="timer-outline" size={14} color={COLORS.textMuted} style={{ marginRight: 4 }} />
                    <Text style={styles.hostManage__metaPillText_01}>{item.durationMinutes} phút</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.hostManage__startButton_01, { backgroundColor: "#0284C7" }]}
                  onPress={() => handleStartSession(item)}
                  activeOpacity={0.88}
                >
                  <Ionicons name="flash" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.hostManage__startButtonText_01}>Chủ trì ca dạy thay</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Section: Create New Template Button & Security Note */}
        <View style={styles.hostManage__bottomSection_01}>
          <TouchableOpacity
            style={styles.hostManage__createTemplateButton_01}
            onPress={() => router.push("/(host)/create-template")}
            activeOpacity={0.85}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
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
        targetTitle={selectedTemplate?.title}
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
  hostManage__sectionHeader_01: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 6,
  },
  hostManage__sectionTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textDark,
  },
  hostManage__cardsContainer_01: {
    gap: 16,
    marginBottom: 16,
  },
  hostManage__card_01: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  hostManage__receivedSection_01: {
    marginBottom: 16,
  },
  hostManage__receivedCard_01: {
    borderColor: "#BAE6FD",
    backgroundColor: "#F0F9FF",
  },
  hostManage__cardHeaderRow_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  hostManage__courseTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textDark,
    flex: 1,
    marginRight: 10,
  },
  hostManage__shiftBadge_01: {
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hostManage__shiftBadgeText_01: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  hostManage__receivedBadge_01: {
    backgroundColor: "#E0F2FE",
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hostManage__receivedBadgeText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: "#0284C7",
  },
  hostManage__delegatedFromRow_01: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  hostManage__delegatedFromText_01: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#0369A1",
  },
  hostManage__pillsRow_01: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  hostManage__metaPill_01: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  hostManage__metaPillText_01: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  hostManage__beaconRow_01: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  hostManage__beaconDot_01: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  hostManage__beaconText_01: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  hostManage__studentsRow_01: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 18,
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
  hostManage__delegatedBanner_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  hostManage__delegatedInfo_01: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  hostManage__delegatedBannerText_01: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#0369A1",
    flex: 1,
  },
  hostManage__revokeBtn_01: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hostManage__revokeBtnText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: "#0284C7",
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
