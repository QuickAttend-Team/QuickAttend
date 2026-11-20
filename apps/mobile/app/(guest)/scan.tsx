import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, COLORS, RADIUS } from '../../src/theme/typography';
import { CustomAlertModal } from '../../src/components/CustomAlertModal';

// Mock component simulating QR Matrix
function MockQRCodeGraphic() {
  return (
    <View style={styles.qr__container_01}>
      {/* Top-Left Finder */}
      <View style={[styles.qr__finder_01, { top: 0, left: 0 }]}>
        <View style={styles.qr__finder_inner_01} />
      </View>

      {/* Top-Right Finder */}
      <View style={[styles.qr__finder_01, { top: 0, right: 0 }]}>
        <View style={styles.qr__finder_inner_01} />
      </View>

      {/* Bottom-Left Finder */}
      <View style={[styles.qr__finder_01, { bottom: 0, left: 0 }]}>
        <View style={styles.qr__finder_inner_01} />
      </View>

      {/* Center & Random Data Blocks */}
      <View style={styles.qr__data_block_01} />
      <View style={styles.qr__data_block_02} />
      <View style={styles.qr__data_block_03} />
      <View style={styles.qr__data_block_04} />
      <View style={styles.qr__data_block_05} />
      <View style={styles.qr__data_block_06} />
      <View style={styles.qr__data_block_07} />
    </View>
  );
}

export default function QRScannerScreen() {
  const router = useRouter();
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [manualCodeModalVisible, setManualCodeModalVisible] = useState(false);

  // Animated laser beam translation
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    scanAnimation.start();

    return () => {
      scanAnimation.stop();
    };
  }, [laserAnim]);

  const translateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 190],
  });

  return (
    <SafeAreaView
      style={styles['scanner-screen__container_01']}
      data-component="QRScannerScreen"
      testID="qr-scanner-screen"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View style={styles['scanner-header__container_01']}>
        <TouchableOpacity
          style={styles['scanner-header__button_01']}
          onPress={() => router.back()}
          activeOpacity={0.7}
          testID="btn-back"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>

        <Text style={styles['scanner-header__title_01']}>Quét mã QR</Text>

        <TouchableOpacity
          style={styles['scanner-header__button_02']}
          onPress={() => setTorchEnabled((prev) => !prev)}
          activeOpacity={0.7}
          testID="btn-flash"
        >
          <Ionicons
            name={torchEnabled ? 'flash' : 'flash-outline'}
            size={22}
            color={torchEnabled ? '#EAB308' : COLORS.textDark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles['scanner-scroll__container_01']}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Info Card */}
        <View style={styles['scanner-info__card_01']}>
          <Text style={styles['scanner-info__title_01']}>
            Lập trình Mobile • IT001
          </Text>
          <Text style={styles['scanner-info__subtitle_01']}>
            Phòng A201 • Ca sáng (09:00 - 11:30)
          </Text>
        </View>

        {/* Viewfinder Card */}
        <View style={styles['scanner-viewfinder__card_01']}>
          <View style={styles['scanner-viewfinder__box_01']}>
            {/* Corner Brackets */}
            <View style={[styles['scanner-viewfinder__corner_01'], styles.cornerTopLeft]} />
            <View style={[styles['scanner-viewfinder__corner_01'], styles.cornerTopRight]} />
            <View style={[styles['scanner-viewfinder__corner_01'], styles.cornerBottomLeft]} />
            <View style={[styles['scanner-viewfinder__corner_01'], styles.cornerBottomRight]} />

            {/* QR Code Container */}
            <View style={styles['scanner-viewfinder__qr_box_01']}>
              <MockQRCodeGraphic />
            </View>

            {/* Scanning Laser Beam */}
            <Animated.View
              style={[
                styles['scanner-viewfinder__laser_01'],
                { transform: [{ translateY }] },
              ]}
            >
              <View style={styles['scanner-viewfinder__laser_core_01']} />
              <View style={styles['scanner-viewfinder__laser_glow_01']} />
            </Animated.View>
          </View>

          {/* Indicator Dot */}
          <View style={styles['scanner-viewfinder__dot_01']} />
        </View>

        {/* Automatic Verification Card */}
        <View style={styles['scanner-verify__card_01']}>
          <Text style={styles['scanner-verify__title_01']}>Xác thực tự động</Text>
          <View style={styles['scanner-verify__divider_01']} />

          {/* Verification Item 1: GPS */}
          <View style={styles['scanner-verify__row_01']}>
            <View style={styles['scanner-verify__badge_01']}>
              <Ionicons name="location-outline" size={20} color={COLORS.primaryGreen} />
            </View>
            <View style={styles['scanner-verify__content_01']}>
              <Text style={styles['scanner-verify__item_title_01']}>Định vị GPS</Text>
              <Text style={styles['scanner-verify__item_desc_01']}>
                Trong bán kính lớp học (~14m)
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#34D399" />
          </View>

          {/* Verification Item 2: Device */}
          <View style={styles['scanner-verify__row_02']}>
            <View style={styles['scanner-verify__badge_02']}>
              <Ionicons name="phone-portrait-outline" size={20} color={COLORS.primaryGreen} />
            </View>
            <View style={styles['scanner-verify__content_02']}>
              <Text style={styles['scanner-verify__item_title_02']}>Thiết bị hợp lệ</Text>
              <Text style={styles['scanner-verify__item_desc_02']}>
                Xiaomi 14T • SV: 20260101
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#34D399" />
          </View>
        </View>

        {/* Manual Input Action Button */}
        <TouchableOpacity
          style={styles['scanner-action__button_01']}
          activeOpacity={0.85}
          onPress={() => setManualCodeModalVisible(true)}
          testID="btn-manual-code"
        >
          <Ionicons name="keypad-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles['scanner-action__text_01']}>Nhập mã số thủ công</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Manual Code Modal */}
      <CustomAlertModal
        visible={manualCodeModalVisible}
        type="info"
        title="Nhập mã thủ công"
        message="Tính năng nhập mã số thủ công sẽ sớm được tích hợp khi kết nối luồng điểm danh."
        confirmText="Đóng"
        onClose={() => setManualCodeModalVisible(false)}
        onConfirm={() => setManualCodeModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  'scanner-screen__container_01': {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  'scanner-header__container_01': {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  'scanner-header__button_01': {
    padding: 6,
  },
  'scanner-header__title_01': {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textDark,
  },
  'scanner-header__button_02': {
    padding: 6,
  },
  'scanner-scroll__container_01': {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  /* Info Card */
  'scanner-info__card_01': {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  'scanner-info__title_01': {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  'scanner-info__subtitle_01': {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  /* Viewfinder Card */
  'scanner-viewfinder__card_01': {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  'scanner-viewfinder__box_01': {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  'scanner-viewfinder__corner_01': {
    position: 'absolute',
    width: 38,
    height: 38,
    borderColor: '#059669',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 18,
  },
  'scanner-viewfinder__qr_box_01': {
    width: 170,
    height: 170,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  'scanner-viewfinder__laser_01': {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  'scanner-viewfinder__laser_core_01': {
    width: '100%',
    height: 2.5,
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  'scanner-viewfinder__laser_glow_01': {
    position: 'absolute',
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderRadius: 6,
  },
  'scanner-viewfinder__dot_01': {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginTop: 18,
  },
  /* Mock QR Graphic */
  qr__container_01: {
    width: 130,
    height: 130,
    position: 'relative',
  },
  qr__finder_01: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderWidth: 6,
    borderColor: '#0F172A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qr__finder_inner_01: {
    width: 18,
    height: 18,
    backgroundColor: '#0F172A',
    borderRadius: 3,
  },
  qr__data_block_01: {
    position: 'absolute',
    top: 56,
    left: 6,
    width: 16,
    height: 16,
    backgroundColor: '#0F172A',
    borderRadius: 2,
  },
  qr__data_block_02: {
    position: 'absolute',
    top: 56,
    left: 32,
    width: 42,
    height: 16,
    backgroundColor: '#0F172A',
    borderRadius: 2,
  },
  qr__data_block_03: {
    position: 'absolute',
    top: 56,
    right: 6,
    width: 42,
    height: 16,
    backgroundColor: '#0F172A',
    borderRadius: 2,
  },
  qr__data_block_04: {
    position: 'absolute',
    top: 82,
    left: 56,
    width: 18,
    height: 18,
    backgroundColor: '#0F172A',
    borderRadius: 3,
  },
  qr__data_block_05: {
    position: 'absolute',
    top: 82,
    right: 8,
    width: 16,
    height: 38,
    backgroundColor: '#0F172A',
    borderRadius: 3,
  },
  qr__data_block_06: {
    position: 'absolute',
    bottom: 4,
    right: 32,
    width: 24,
    height: 24,
    backgroundColor: '#0F172A',
    borderRadius: 3,
  },
  qr__data_block_07: {
    position: 'absolute',
    bottom: 30,
    right: 6,
    width: 16,
    height: 16,
    backgroundColor: '#0F172A',
    borderRadius: 2,
  },
  /* Verification Card */
  'scanner-verify__card_01': {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  'scanner-verify__title_01': {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 12,
  },
  'scanner-verify__divider_01': {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  'scanner-verify__row_01': {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  'scanner-verify__row_02': {
    flexDirection: 'row',
    alignItems: 'center',
  },
  'scanner-verify__badge_01': {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  'scanner-verify__badge_02': {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  'scanner-verify__content_01': {
    flex: 1,
  },
  'scanner-verify__content_02': {
    flex: 1,
  },
  'scanner-verify__item_title_01': {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  'scanner-verify__item_title_02': {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  'scanner-verify__item_desc_01': {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  'scanner-verify__item_desc_02': {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  /* Manual Action Button */
  'scanner-action__button_01': {
    backgroundColor: '#111827',
    borderRadius: RADIUS.full,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  'scanner-action__text_01': {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
