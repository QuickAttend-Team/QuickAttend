# Hướng dẫn tạo tự động toàn bộ Issues cho Milestone 2 chỉ với 1 lệnh

Thư mục này chứa các công cụ tự động hóa giúp nhóm sinh viên tạo **toàn bộ 14 Issues** đã được phân rã chuẩn cho Milestone 2 lên GitHub chỉ trong **1 lần chạy**, bao gồm cả việc tự động tạo **Milestone 2** và hệ thống **Labels** màu sắc trực quan.

---

## ⚡ Cách 1: Chạy bằng PowerShell trên Windows (Khuyên dùng - Nhanh nhất)

### Bước 1: Tạo GitHub Personal Access Token (Mất 30 giây)
1. Đăng nhập vào GitHub, bấm vào Avatar góc trên cùng bên phải -> chọn **Settings**.
2. Cuộn xuống cuối thanh menu bên trái -> chọn **Developer Settings**.
3. Chọn **Personal access tokens** -> chọn **Tokens (classic)**.
4. Bấm **Generate new token (classic)**.
5. Đặt tên (ví dụ: `QuickAttend-Script`), tích chọn ô **`repo`** (Full control of private repositories).
6. Cuộn xuống bấm **Generate token** và sao chép mã token (có dạng `ghp_xxxxxxxxxxxx`).

### Bước 2: Chạy lệnh trong PowerShell
Mở PowerShell tại thư mục dự án và chạy dòng lệnh sau (thay `owner/repo` và `token` của bạn):

```powershell
.\scripts\create_issues.ps1 -Repo "tên-org-hoặc-username/tên-repo" -Token "ghp_xxxxxxxxxxxxxxxxxxxx"
```

*Ví dụ:*
```powershell
.\scripts\create_issues.ps1 -Repo "HCMUT-QuickAttend/quickattend" -Token "ghp_AbCdEf1234567890"
```

Script sẽ tự động:
- Kết nối tới repo của bạn.
- Tạo Milestone: `Milestone 2: UI/UX & Core Feature Implementation`.
- Tạo 10 labels chuẩn màu sắc (`ui/ux`, `frontend`, `backend`, `devops`, `security`, `us-feature`,...).
- Tạo tuần tự 14 issues và gắn trực tiếp vào Milestone 2!

---

## ⚡ Cách 2: Nếu đã cài và đăng nhập GitHub CLI (`gh`)
Nếu máy bạn đã cài `gh` và đã gõ `gh auth login`:

```powershell
.\scripts\create_issues.ps1 -Repo "tên-org-hoặc-username/tên-repo" -UseGh
```

---

## ⚡ Cách 3: Dành cho Linux / macOS / Git Bash
Chạy script bash:

```bash
chmod +x ./scripts/create_issues.sh
./scripts/create_issues.sh -r "tên-org-hoặc-username/tên-repo" -t "ghp_xxxxxxxxxxxx"
```

---

## 📋 Danh sách 14 Issues được tạo tự động:
1. `[M2-01][UI/UX] Thiết kế hệ thống Design System & Wireframes/Hi-Fi Mockups trên Figma (Host & Guest flows)`
2. `[M2-02][DevOps] Khởi tạo khung dự án React Native Expo SDK 52 với Expo Router & TypeScript`
3. `[M2-03][Backend] Thiết lập REST API Server & Cơ sở dữ liệu cho Users, Sessions, Templates & Attendance`
4. `[M2-04][US01][Auth] Xây dựng màn hình & API Đăng ký tài khoản Giảng viên bằng Email trường (.edu/.edu.vn)`
5. `[M2-05][US02][Auth] Triển khai màn hình Đăng ký Sinh viên & Khóa định danh phần cứng thiết bị (Hardware Binding)`
6. `[M2-06][US03][Host] Xây dựng tính năng Quản lý Mẫu điểm danh ca học (Attendance Templates & Geofence GPS)`
7. `[M2-07][US04][Host] Triển khai tính năng Khởi chạy phiên điểm danh 1 chạm (One-Tap Attendance Launch & Timer)`
8. `[M2-08][US06][Host] Triển khai màn hình Giám sát phiên thời gian thực (Active Session Monitoring Dashboard)`
9. `[M2-09][US05][Host] Xây dựng tính năng Bàn giao quyền quản lý phiên tạm thời (Temporary Delegation / Handover)`
10. `[M2-10][US07][Guest] Phát triển màn hình Điểm danh 1 chạm cho Sinh viên kết hợp dịch vụ định vị GPS ngầm`
11. `[M2-11][US08][Guest] Xây dựng cơ chế Xác thực Đa yếu tố (GPS + Hardware Check) & Bottom Sheet thông báo tức thì`
12. `[M2-12][Resilience] Xây dựng Cơ chế Hàng đợi Ngoại tuyến (Offline Queue) & Cảnh báo Pin yếu/Mất mạng (Heartbeat)`
13. `[M2-13][Testing] Kiểm thử tích hợp luồng Host-Guest End-to-End & Thử nghiệm thực địa độ trôi GPS trong phòng học`
14. `[M2-14][Docs] Hoàn thiện Báo cáo Milestone 2, Video Demo và Cập nhật GitHub Wiki & Board`

