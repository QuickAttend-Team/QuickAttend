# QuickAttend Backend API (`@quickattend/api`)

Backend được tổ chức theo **kiến trúc Modular** (học hỏi từ dự án chuẩn `15-SPM-35` / ViClinic):

- **Ngôn ngữ & Runtime:** TypeScript 5.7+ trên Node.js 24 LTS (chạy trực tiếp bằng `tsx`).
- **Web Framework:** Express 5 + CORS.
- **Database & ORM:** PostgreSQL 18 + Prisma 7 (`prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed/`).
- **Bảo mật & Validation:**
  - `zod`: Kiểm tra kiểu dữ liệu request/response đầu vào.
  - `argon2`: Băm mật khẩu và mã xác thực.
  - `node:crypto` (HMAC-SHA256): Sinh & kiểm chứng OTP / Delegation Token / Session Token.
  - `rate-limiter-flexible`: Chống nghẽn và giới hạn spam request khi 50–100 SV điểm danh cùng lúc.
- **Unit Testing:** `node:test` + `node:assert/strict` chạy bằng `tsx --test` trong `tests/` (không cần kết nối DB).

## Cấu trúc thư mục

- `prisma/`: Lược đồ CSDL (`schema.prisma`), lịch sử migration (`migrations/`) và dữ liệu mẫu (`seed/`).
- `src/config/`: Đọc & validate biến môi trường (`env.ts`), hằng số nghiệp vụ (`business.ts`), cấu hình bảo mật (`security.ts`).
- `src/lib/`: Các hàm tiện ích thuần (`geofence.ts` tính Haversine, `errors.ts`, `dates.ts`).
- `src/server/`: Hạ tầng server (`db.ts`, `password.ts`, `otp.ts`, `rate-limit.ts`, `authorization.ts`, `session.ts`).
- `src/modules/`: Chia theo từng User Story / Domain:
  - `identity/`: Đăng ký `.edu`, khóa Device UUID (US01, US02).
  - `templates/`: Quản lý mẫu ca học & tọa độ phòng (US03).
  - `sessions/`: Khởi chạy 1 chạm, monitoring sĩ số, heartbeat (US04, US06).
  - `delegation/`: Bàn giao quyền tạm thời cho giảng viên dạy thay (US05).
  - `attendance/`: Kiểm tra Geofence GPS 1 chạm & đồng bộ Offline Queue (US07, US08).
- `tests/`: Bộ Unit Test nghiệp vụ thuần.

