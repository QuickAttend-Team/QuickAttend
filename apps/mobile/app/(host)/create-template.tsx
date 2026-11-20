import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocation } from "../../src/hooks/useLocation";
import { useTemplateStore } from "../../src/stores/templateStore";
import { CustomAlertModal } from "../../src/components/CustomAlertModal";
import { FONTS, COLORS, RADIUS } from "../../src/theme/typography";

export default function CreateTemplateScreen() {
  const router = useRouter();
  const { getCurrentLocation, loading: locationLoading } = useLocation();
  const addTemplate = useTemplateStore((state) => state.addTemplate);

  const [title, setTitle] = useState("Lập trình Mobile – IT001");
  const [roomName, setRoomName] = useState("Phòng A201 (Cơ sở 1)");
  const [radiusMeters, setRadiusMeters] = useState<20 | 50 | 100>(50);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>({
    latitude: 10.76262,
    longitude: 106.682,
  });
  const [locationName, setLocationName] = useState("Giảng đường A");
  const [requireRealtimeGps, setRequireRealtimeGps] = useState(true);
  const [lockDevice, setLockDevice] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "warning" | "danger" | "info";
    onConfirm?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const handleFetchCurrentLocation = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      setCoords({
        latitude: parseFloat(loc.latitude.toFixed(5)),
        longitude: parseFloat(loc.longitude.toFixed(5)),
      });
      setLocationName("Tọa độ thiết bị");
    } else {
      setAlertConfig({
        visible: true,
        title: "Lỗi vị trí",
        message: "Không thể truy cập GPS. Vui lòng cấp quyền định vị trong cài đặt.",
        type: "warning",
      });
    }
  };

  const handleSaveTemplate = () => {
    if (!title.trim() || !roomName.trim()) {
      setAlertConfig({
        visible: true,
        title: "Thiếu thông tin",
        message: "Vui lòng nhập tên môn học và phòng học.",
        type: "warning",
      });
      return;
    }

    addTemplate({
      title: title.trim(),
      roomName: roomName.trim(),
      latitude: coords?.latitude ?? 10.76262,
      longitude: coords?.longitude ?? 106.682,
      radiusMeters,
      durationMinutes,
      requireRealtimeGps,
      lockDevice,
    });

    setAlertConfig({
      visible: true,
      title: "Thành công",
      message: "Đã lưu cấu hình mẫu điểm danh mới!",
      type: "success",
      onConfirm: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        router.back();
      },
    });
  };

  return (
    <View style={styles.hostTemplate__container_01} data-component="CreateTemplateScreen">
      {/* Header */}
      <View style={styles.hostTemplate__header_01}>
        <TouchableOpacity
          style={styles.hostTemplate__backButton_01}
          onPress={() => router.back()}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>

        <View style={styles.hostTemplate__headerTitleGroup_01}>
          <Text style={styles.hostTemplate__headerTitle_01}>Cấu hình mẫu điểm danh</Text>
          <Text style={styles.hostTemplate__headerSubtitle_01}>Tùy chỉnh thông số</Text>
        </View>

        <TouchableOpacity style={styles.hostTemplate__menuButton_01}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.hostTemplate__scrollContent_01}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Môn học (Editable) */}
        <View style={styles.hostTemplate__card_01}>
          <Text style={styles.hostTemplate__cardLabel_01}>MÔN HỌC</Text>
          <View style={styles.hostTemplate__cardInputRow_01}>
            <TextInput
              style={styles.hostTemplate__cardInput_01}
              value={title}
              onChangeText={setTitle}
              placeholder="VD: Lập trình Mobile – IT001"
              placeholderTextColor={COLORS.textSubtle}
            />
            <Ionicons name="school-outline" size={22} color={COLORS.textSubtle} />
          </View>
        </View>

        {/* Card 2: Phòng học / Địa điểm (Editable) */}
        <View style={styles.hostTemplate__card_02}>
          <Text style={styles.hostTemplate__cardLabel_02}>PHÒNG HỌC / ĐỊA ĐIỂM</Text>
          <View style={styles.hostTemplate__cardInputRow_02}>
            <TextInput
              style={styles.hostTemplate__cardInput_02}
              value={roomName}
              onChangeText={setRoomName}
              placeholder="VD: Phòng A201 (Cơ sở 1)"
              placeholderTextColor={COLORS.textSubtle}
            />
            <MaterialCommunityIcons name="door-sliding" size={22} color={COLORS.textSubtle} />
          </View>
        </View>

        {/* Card 3: Bán kính định vị GPS */}
        <View style={styles.hostTemplate__cardBox_01}>
          <View style={styles.hostTemplate__cardHeaderRow_01}>
            <View style={styles.hostTemplate__iconBadgeGreen_01}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={COLORS.primaryGreenDark} />
            </View>
            <Text style={styles.hostTemplate__cardHeading_01}>Bán kính định vị GPS</Text>
          </View>

          {/* GPS Radius Pills */}
          <View style={styles.hostTemplate__pillsRow_01}>
            <TouchableOpacity
              style={[
                styles.hostTemplate__pill_01,
                radiusMeters === 20 ? styles.hostTemplate__pillActive_01 : styles.hostTemplate__pillInactive_01,
              ]}
              onPress={() => setRadiusMeters(20)}
            >
              <Text
                style={[
                  styles.hostTemplate__pillText_01,
                  radiusMeters === 20 ? styles.hostTemplate__pillTextActive_01 : styles.hostTemplate__pillTextInactive_01,
                ]}
              >
                20m
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.hostTemplate__pill_01,
                radiusMeters === 50 ? styles.hostTemplate__pillActive_01 : styles.hostTemplate__pillInactive_01,
              ]}
              onPress={() => setRadiusMeters(50)}
            >
              {radiusMeters === 50 && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              )}
              <Text
                style={[
                  styles.hostTemplate__pillText_01,
                  radiusMeters === 50 ? styles.hostTemplate__pillTextActive_01 : styles.hostTemplate__pillTextInactive_01,
                ]}
              >
                50m (Khuyên dùng)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.hostTemplate__pill_01,
                radiusMeters === 100 ? styles.hostTemplate__pillActive_01 : styles.hostTemplate__pillInactive_01,
              ]}
              onPress={() => setRadiusMeters(100)}
            >
              <Text
                style={[
                  styles.hostTemplate__pillText_01,
                  radiusMeters === 100 ? styles.hostTemplate__pillTextActive_01 : styles.hostTemplate__pillTextInactive_01,
                ]}
              >
                100m
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action: Lấy tọa độ vị trí hiện tại của tôi */}
          <TouchableOpacity
            style={styles.hostTemplate__gpsButton_01}
            onPress={handleFetchCurrentLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color={COLORS.primaryGreenDark} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={18}
                  color={COLORS.primaryGreenDark}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.hostTemplate__gpsButtonText_01}>
                  Lấy tọa độ vị trí hiện tại của tôi
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Coordinate Pill Chip */}
          <View style={styles.hostTemplate__coordChip_01}>
            <View style={styles.hostTemplate__greenDot_01} />
            <Text style={styles.hostTemplate__coordText_01} numberOfLines={1}>
              <Text style={{ fontFamily: FONTS.semiBold, color: COLORS.textDark }}>Tọa độ: </Text>
              {locationName} ({coords ? `${coords.latitude}° N, ${coords.longitude}` : "Chưa xác định"})
            </Text>
          </View>
        </View>

        {/* Section Header: YÊU CẦU XÁC THỰC BỔ SUNG */}
        <View style={styles.hostTemplate__sectionWrap_01}>
          <Text style={styles.hostTemplate__sectionLabel_01}>YÊU CẦU XÁC THỰC BỔ SUNG</Text>
        </View>

        {/* Card 4: Switch Toggles & Session Time */}
        <View style={styles.hostTemplate__cardBox_02}>
          {/* Toggle 1: GPS realtime */}
          <View style={styles.hostTemplate__toggleRow_01}>
            <View style={styles.hostTemplate__toggleTextGroup_01}>
              <Text style={styles.hostTemplate__toggleTitle_01}>Định vị GPS thời gian thực bắt buộc</Text>
              <Text style={styles.hostTemplate__toggleSubtitle_01}>
                Sinh viên phải nằm trong bán kính đã chọn
              </Text>
            </View>
            <Switch
              value={requireRealtimeGps}
              onValueChange={setRequireRealtimeGps}
              trackColor={{ false: "#E2E8F0", true: COLORS.primaryGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.hostTemplate__divider_01} />

          {/* Toggle 2: Lock device */}
          <View style={styles.hostTemplate__toggleRow_02}>
            <View style={styles.hostTemplate__toggleTextGroup_02}>
              <Text style={styles.hostTemplate__toggleTitle_02}>Khóa thiết bị sinh viên</Text>
              <Text style={styles.hostTemplate__toggleSubtitle_02}>
                Mỗi sinh viên chỉ điểm danh trên 1 máy
              </Text>
            </View>
            <Switch
              value={lockDevice}
              onValueChange={setLockDevice}
              trackColor={{ false: "#E2E8F0", true: COLORS.primaryGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.hostTemplate__divider_02} />

          {/* Duration Selector */}
          <View style={styles.hostTemplate__durationWrap_01}>
            <Text style={styles.hostTemplate__durationLabel_01}>THỜI GIAN MỞ PHIÊN TỰ ĐỘNG</Text>
            <View style={styles.hostTemplate__pillsRow_02}>
              {[5, 10, 0].map((mins) => {
                const isSelected = durationMinutes === mins;
                const label = mins === 0 ? "Không giới hạn" : `${mins} phút`;
                return (
                  <TouchableOpacity
                    key={mins}
                    style={[
                      styles.hostTemplate__pill_02,
                      isSelected ? styles.hostTemplate__pillActive_02 : styles.hostTemplate__pillInactive_02,
                    ]}
                    onPress={() => setDurationMinutes(mins)}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                    )}
                    <Text
                      style={[
                        styles.hostTemplate__pillText_02,
                        isSelected
                          ? styles.hostTemplate__pillTextActive_02
                          : styles.hostTemplate__pillTextInactive_02,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Button: LƯU CẤU HÌNH MẪU */}
      <View style={styles.hostTemplate__footer_01}>
        <TouchableOpacity
          style={styles.hostTemplate__submitButton_01}
          onPress={handleSaveTemplate}
          activeOpacity={0.88}
        >
          <MaterialCommunityIcons
            name="content-save-outline"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.hostTemplate__submitButtonText_01}>LƯU CẤU HÌNH MẪU</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert Modal */}
      <CustomAlertModal
        visible={alertConfig.visible}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="OK"
        onConfirm={alertConfig.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hostTemplate__container_01: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  hostTemplate__header_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: "#F8FAFC",
  },
  hostTemplate__backButton_01: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  hostTemplate__headerTitleGroup_01: {
    flex: 1,
    marginLeft: 14,
  },
  hostTemplate__headerTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textDark,
  },
  hostTemplate__headerSubtitle_01: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  hostTemplate__menuButton_01: {
    padding: 6,
  },
  hostTemplate__scrollContent_01: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 14,
  },
  hostTemplate__card_01: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  hostTemplate__cardLabel_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  hostTemplate__cardInputRow_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hostTemplate__cardInput_01: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textDark,
    paddingVertical: 4,
  },
  hostTemplate__card_02: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  hostTemplate__cardLabel_02: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  hostTemplate__cardInputRow_02: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hostTemplate__cardInput_02: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textDark,
    paddingVertical: 4,
  },
  hostTemplate__cardBox_01: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xxl,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  hostTemplate__cardHeaderRow_01: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  hostTemplate__iconBadgeGreen_01: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: "#E6F4EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  hostTemplate__cardHeading_01: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.textDark,
  },
  hostTemplate__pillsRow_01: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hostTemplate__pill_01: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
  },
  hostTemplate__pillActive_01: {
    backgroundColor: COLORS.cardDark,
  },
  hostTemplate__pillInactive_01: {
    backgroundColor: "#F1F5F9",
  },
  hostTemplate__pillText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  hostTemplate__pillTextActive_01: {
    color: "#FFFFFF",
  },
  hostTemplate__pillTextInactive_01: {
    color: "#475569",
  },
  hostTemplate__gpsButton_01: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 4,
  },
  hostTemplate__gpsButtonText_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.primaryGreenDark,
  },
  hostTemplate__coordChip_01: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  hostTemplate__greenDot_01: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryGreen,
    marginRight: 8,
  },
  hostTemplate__coordText_01: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  hostTemplate__sectionWrap_01: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  hostTemplate__sectionLabel_01: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: "#64748B",
    letterSpacing: 0.6,
  },
  hostTemplate__cardBox_02: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xxl,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  hostTemplate__toggleRow_01: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hostTemplate__toggleTextGroup_01: {
    flex: 1,
    paddingRight: 12,
  },
  hostTemplate__toggleTitle_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textDark,
  },
  hostTemplate__toggleSubtitle_01: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  hostTemplate__divider_01: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  hostTemplate__toggleRow_02: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hostTemplate__toggleTextGroup_02: {
    flex: 1,
    paddingRight: 12,
  },
  hostTemplate__toggleTitle_02: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textDark,
  },
  hostTemplate__toggleSubtitle_02: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  hostTemplate__divider_02: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  hostTemplate__durationWrap_01: {
    gap: 8,
  },
  hostTemplate__durationLabel_01: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  hostTemplate__pillsRow_02: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hostTemplate__pill_02: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
  },
  hostTemplate__pillActive_02: {
    backgroundColor: COLORS.cardDark,
  },
  hostTemplate__pillInactive_02: {
    backgroundColor: "#F1F5F9",
  },
  hostTemplate__pillText_02: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  hostTemplate__pillTextActive_02: {
    color: "#FFFFFF",
  },
  hostTemplate__pillTextInactive_02: {
    color: "#475569",
  },
  hostTemplate__footer_01: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
  },
  hostTemplate__submitButton_01: {
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
  hostTemplate__submitButtonText_01: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
});
