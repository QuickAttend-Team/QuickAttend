# QuickAttend Mobile Client (`@quickattend/mobile`)

Ứng dụng di động đa nền tảng (iOS & Android) dành cho Giảng viên (Host) và Sinh viên (Guest).

- **Framework:** React Native 0.76 + Expo SDK 52 (TypeScript).
- **Navigation:** `expo-router` (File-based routing trong thư mục `app/`).
- **State Management:** `zustand` (nhẹ, tách biệt khỏi UI).
- **Phần cứng & Cảm biến:**
  - `expo-location`: Đọc tọa độ GPS ngầm phục vụ Geofencing 1 chạm.
  - `expo-application` & `expo-secure-store`: Trích xuất/lưu Hardware Device UUID & JWT Token an toàn.
  - `expo-local-authentication`: Xác thực Face ID / Vân tay cục bộ khi có rủi ro (Privacy-First).
- **Shared Contracts:** Nhập trực tiếp types và constants từ `@quickattend/contracts`.

## Cấu trúc thư mục

- `app/`: Các màn hình & layout theo `expo-router` (`(auth)/`, `(host)/`, `(guest)/`).
- `src/components/`: Các UI component tái sử dụng (TemplateCard, OneTapButton, FeedbackBottomSheet).
- `src/hooks/`: Custom React hooks (`useLocation`, `useCountdown`, `useOfflineQueue`).
- `src/services/`: Giao tiếp REST API với `@quickattend/api`, đọc Device UUID, hàng đợi offline.
- `src/stores/`: Zustand stores quản lý trạng thái đăng nhập và phiên điểm danh.
- `src/utils/`: Các hàm trợ giúp tính toán hiển thị và validate.

