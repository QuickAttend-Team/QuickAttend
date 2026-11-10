# QuickAttend - One-Tap Mobile Attendance & Session Delegation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Course: CO3043](https://img.shields.io/badge/Course-CO3043%20Mobile%20App%20Development-blue.svg)](https://hcmut.edu.vn)
[![Institution: HCMUT](https://img.shields.io/badge/Institution-HCMUT--VNU--HCM-003366.svg)](https://cse.hcmut.edu.vn)
[![Node.js: 24 LTS](https://img.shields.io/badge/Node.js-24%20LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm: 12](https://img.shields.io/badge/pnpm-12.18-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![React Native & Expo](https://img.shields.io/badge/Expo-SDK%2052-000020?logo=expo&logoColor=white)](https://expo.dev)
[![PostgreSQL 18 + Prisma 7](https://img.shields.io/badge/PostgreSQL%2018-Prisma%207-4169E1?logo=postgresql&logoColor=white)](https://www.prisma.io)
[![TypeScript: 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

> **QuickAttend** là ứng dụng điểm danh di động một chạm thế hệ mới, tối ưu hóa quy trình điểm danh học đường bằng công nghệ định vị Geofencing GPS kết hợp khóa phần cứng thiết bị (Hardware Binding) và cơ chế bàn giao quyền điểm danh tạm thời (Temporary Teacher Handover) độc quyền.

---

## 📌 Mục lục

- [1. Giới thiệu dự án & Thành viên nhóm](#1-giới-thiệu-dự-án--thành-viên-nhóm)
- [2. Bài toán, Giải pháp & Phạm vi MVP (US01–US08)](#2-bài-toán-giải-pháp--phạm-vi-mvp-us01us08)
- [3. Công nghệ & Ngôn ngữ sử dụng (Ghi chú chi tiết cho từng thành phần)](#3-công-nghệ--ngôn-ngữ-sử-dụng-ghi-chú-chi-tiết-cho-từng-thành-phần)
- [4. Cấu trúc thư mục dự án (Monorepo)](#4-cấu-trúc-thư-mục-dự-án-monorepo)
- [5. Cài đặt môi trường (Windows / macOS / Linux)](#5-cài-đặt-môi-trường-windows--macos--linux)
- [6. Cài đặt & Khởi chạy QuickAttend](#6-cài-đặt--khởi-chạy-quickattend)
- [7. Kiểm tra mã nguồn & Unit Test](#7-kiểm-tra-mã-nguồn--unit-test)
- [8. Xử lý lỗi cài đặt thường gặp](#8-xử-lý-lỗi-cài-đặt-thường-gặp)
- [9. Quy chuẩn đóng góp (Git Flow) & Lộ trình](#9-quy-chuẩn-đóng-góp-git-flow--lộ-trình)
- [10. Giấy phép](#10-giấy-phép)

---

## 1. Giới thiệu dự án & Thành viên nhóm

- **Tên dự án:** QuickAttend (Hệ thống điểm danh di động siêu tốc và chuyển giao phiên)
- **Môn học:** Phát triển ứng dụng Mobile App (CO3043) - Lớp L01
- **Khoa:** Khoa Khoa học và Kỹ thuật Máy tính - Trường Đại học Bách Khoa, ĐHQG-HCM
- **Giảng viên hướng dẫn:** ThS. Hoàng Lê Hải Thanh
- **GitHub Repository:** [QuickAttend-Team/QuickAttend](https://github.com/QuickAttend-Team/QuickAttend)
- **GitHub Wiki:** [QuickAttend Documentation Wiki](https://github.com/QuickAttend-Team/QuickAttend/wiki)

### Thành viên & Phân công phụ trách

| STT | Họ và tên | MSSV | Vai trò & Mảng công nghệ phụ trách | GitHub Profile |
|:---:|:---|:---:|:---|:---|
| 1 | **Nguyễn Hồng Thiện Nhân** | 2410670 | **Git Manager / Backend API & Database Lead** (`apps/api`, PostgreSQL 18, Prisma 7, Auth/Delegation APIs) | [@ThienNhan0906](https://github.com/ThienNhan0906) |
| 2 | **Lâm Chí Nguyên** | 2412332 | **Frontend Mobile Lead / Architecture** (`apps/mobile`, Expo SDK 52, Expo Router, Offline Queue, 1-Tap Launch) | [@nieinsaneliterally](https://github.com/nieinsaneliterally) |
| 3 | **Ngô Võ Gia Minh** | 2412069 | **Mobile UI/UX Design & Frontend Feature Dev** (Figma Design System, Auth UI, Realtime Dashboard, Feedback Modal) | [@MinhGiaVoNgo](https://github.com/MinhGiaVoNgo) |
| 4 | **Nguyễn Huỳnh Tấn Phát** | 2412585 | **QA / Testing, Geofencing & Hardware Auth** (Hardware UUID Binding, Geofence Haversine, Field Testing, Unit/E2E Tests) | [@phatmmp](https://github.com/phatmmp) |

---

## 2. Bài toán, Giải pháp & Phạm vi MVP (US01–US08)

### ⚠️ Bối cảnh & Nút thắt thực tế
1. **Thao tác thiết lập cồng kềnh:** Giảng viên tốn nhiều thời gian cấu hình ca học, phòng học và cơ chế điểm danh mỗi đầu buổi.
2. **Bất tiện khi có biến động:** Khi đổi phòng học đột xuất hoặc có giảng viên dạy thay / trợ giảng, việc cấp quyền quản trị trên hệ thống LMS rất rủi ro, rườm rà và chậm trễ.
3. **Gian lận điểm danh hộ:** QR code tĩnh, Google Form hay điểm danh giấy dễ bị chụp ảnh gửi ra ngoài hoặc ký hộ.

### 💡 Giải pháp & Điểm vượt trội của QuickAttend

| Tiêu chí | Điểm danh truyền thống | Google Form / QR tĩnh | Phân hệ LMS (Moodle/Canvas) | **QuickAttend** |
|:---|:---:|:---:|:---:|:---:|
| **Thời gian tạo phiên** | Tốn 3–5 phút | Tốn 2–3 phút | Tốn 1–2 phút (nhiều click) | **< 5 giây (1 chạm)** |
| **Thời gian SV thao tác** | Xếp hàng đọc tên | 15–30 giây (điền form) | 10–20 giây | **< 3 giây (1 chạm)** |
| **Chống điểm danh hộ** | Kém (ký hộ) | Rất kém (gửi link từ xa) | Trung bình | **Rất cao (GPS + Device UUID)** |
| **Chuyển giao dạy thay** | Chuyền giấy thủ công | Chia sẻ link form phức tạp | Rất chậm (cần admin cấp quyền) | **Tức thì (1-chạm qua Email/Token)** |
| **Bảo vệ quyền riêng tư** | N/A | Thu thập email | Lưu log truy cập | **Privacy-First (chỉ lưu Boolean Geofence)** |

### Danh sách 8 User Stories cốt lõi (MVP)
- **Nhóm A — Authentication & Onboarding:**
  - **US01:** Đăng ký tài khoản Giảng viên bằng Email trường (`.edu` / `.edu.vn`), tự động cấp quyền `ROLE_HOST`.
  - **US02:** Đăng ký Sinh viên & Khóa định danh phần cứng thiết bị (Hardware UUID Binding) chống mượn máy điểm danh hộ.
- **Nhóm B — Host Features (Giảng viên):**
  - **US03:** Tạo & Lưu mẫu điểm danh ca học (Tên môn, phòng học, tọa độ tâm & bán kính GPS `20m / 50m / 100m`).
  - **US04:** Khởi chạy phiên điểm danh 1 chạm (One-Tap Launch) kèm đồng hồ đếm ngược.
  - **US05:** Bàn giao quyền quản lý phiên tạm thời (Temporary Delegation) cho giảng viên dạy thay theo ca qua email.
  - **US06:** Theo dõi tiến độ điểm danh thời gian thực (Sĩ số hợp lệ / ngoài vùng GPS).
- **Nhóm C — Guest Features (Sinh viên):**
  - **US07:** Điểm danh 1 chạm bằng định vị GPS ngầm (`ĐIỂM DANH NGAY`, thao tác < 3 giây).
  - **US08:** Xác thực đa yếu tố (GPS + Device UUID) & Bottom Sheet phản hồi tức thì (Tích xanh / Cảnh báo ngoài vùng / Lỗi thiết bị).

---

## 3. Công nghệ & Ngôn ngữ sử dụng (Ghi chú chi tiết cho từng thành phần)

Dự án tổ chức theo mô hình **pnpm Monorepo** (chuẩn hóa kiến trúc từ mô hình kiểm thử & bảo mật chặt chẽ), đồng bộ ngôn ngữ **TypeScript 5.7+** xuyên suốt từ Mobile App, Shared Contracts đến Backend & Database:

| Thành phần | Vị trí thư mục | Ngôn ngữ & Công nghệ chính | Ghi chú mục đích sử dụng (Để thành viên làm đúng chuẩn) |
|:---|:---|:---|:---|
| **Quản lý Monorepo** | Gốc dự án (`/`) | **Node.js 24 LTS**, **pnpm 12** (`pnpm-workspace.yaml`) | Dùng `pnpm` quản lý chung 3 workspace (`apps/mobile`, `apps/api`, `packages/contracts`), tiết kiệm ổ cứng và khóa phiên bản đồng bộ. |
| **Shared Contracts** | `packages/contracts/` | **TypeScript**, **Zod** | **BẮT BUỘC dùng chung:** Chứa Zod schema validation, TypeScript types (`UserRole`, `GeofenceRadius`), error codes. Frontend & Backend cùng import `@quickattend/contracts` để không bị lệch định dạng JSON. |
| **Mobile Client** | `apps/mobile/` | **TypeScript**, **React Native 0.76**, **Expo SDK 52**, **Expo Router** | Giao diện iOS/Android. Routing theo file trong `app/`. Không viết logic tính khoảng cách hay validate rời rạc mà import từ `@quickattend/contracts`. |
| **Mobile State & Sensors** | `apps/mobile/src/` | **Zustand**, `expo-location`, `expo-application`, `expo-secure-store`, `expo-local-authentication` | `zustand` quản lý state nhẹ; `expo-location` đọc GPS ngầm; `expo-application` & `expo-secure-store` lấy/lưu Hardware UUID & Token; `expo-local-authentication` xác thực Face ID/vân tay cục bộ khi có rủi ro. |
| **Backend API** | `apps/api/` | **TypeScript**, **Node.js 24**, **Express 5**, **tsx** | Chia module theo domain nghiệp vụ trong `src/modules/` (`identity`, `templates`, `sessions`, `delegation`, `attendance`). Chạy dev trực tiếp bằng `tsx watch`. |
| **Database & ORM** | `apps/api/prisma/` | **PostgreSQL 18**, **Prisma 7** (`@prisma/adapter-pg`, `pg`) | Quản lý schema tại `prisma/schema.prisma`, cấu hình tại `prisma.config.ts`. Luôn tạo migration bằng `prisma migrate` và dữ liệu mẫu trong `prisma/seed/`. |
| **Bảo mật & Chống tải cao** | `apps/api/src/server/` | **Argon2**, `node:crypto` (HMAC-SHA256), **`rate-limiter-flexible`** | `argon2` băm mật khẩu/mã xác thực; `node:crypto` ký OTP & Delegation Token; `rate-limiter-flexible` chống nghẽn/spam khi 50–100 SV bấm điểm danh đồng thời. |
| **Unit Test & Quality** | `apps/api/tests/` | **`node:test`**, **`node:assert/strict`**, **`tsx --test`**, **ESLint 9** | Viết Unit Test cho các hàm nghiệp vụ thuần (Geofence Haversine, validation email `.edu`, logic handover, offline sync) chạy độc lập **không cần mở DB hay mạng**. |

---

## 4. Cấu trúc thư mục dự án (Monorepo)

```text
QuickAttend/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI: kiểm tra cấu trúc, typecheck & unit test
├── apps/
│   ├── mobile/                        # [@quickattend/mobile] Ứng dụng di động (Expo SDK 52 + Expo Router)
│   │   ├── app/                       # File-based routing screens ((auth), (host), (guest))
│   │   ├── src/
│   │   │   ├── components/            # Reusable UI components (TemplateCard, FeedbackBottomSheet...)
│   │   │   ├── hooks/                 # Custom React hooks (useLocation, useCountdown, useOfflineQueue)
│   │   │   ├── services/              # API client, Hardware UUID extractor, Offline storage
│   │   │   ├── stores/                # Zustand state stores
│   │   │   └── utils/                 # Hàm hỗ trợ UI & format
│   │   ├── package.json
│   │   └── README.md                  # Ghi chú riêng cho team Mobile
│   └── api/                           # [@quickattend/api] Backend REST API (Express 5 + Prisma 7)
│       ├── prisma/
│       │   ├── migrations/            # Lịch sử migration CSDL PostgreSQL
│       │   ├── seed/                  # Script tạo dữ liệu mẫu (Host, Guest, Templates)
│       │   └── schema.prisma          # Lược đồ quan hệ các bảng (User, Device, Template, Session...)
│       ├── src/
│       │   ├── config/                # env.ts (validate .env bằng Zod), business.ts, security.ts
│       │   ├── lib/                   # Hàm thuần: geofence.ts (Haversine), errors.ts, dates.ts
│       │   ├── server/                # Hạ tầng: db.ts, password.ts (Argon2), otp.ts, rate-limit.ts
│       │   └── modules/               # Nghiệp vụ chia theo domain:
│       │       ├── identity/          # US01, US02 (Auth .edu & Device UUID Binding)
│       │       ├── templates/         # US03 (Pre-saved Attendance Templates)
│       │       ├── sessions/          # US04, US06 (1-Tap Launch, Monitoring, Heartbeat)
│       │       ├── delegation/        # US05 (Temporary Teacher Handover)
│       │       └── attendance/        # US07, US08 (GPS Check-in & Offline Queue Sync)
│       ├── tests/                     # Unit tests chạy bằng node:test + tsx --test
│       ├── prisma.config.ts           # Cấu hình Prisma 7 datasource
│       ├── tsconfig.json
│       ├── package.json
│       └── README.md                  # Ghi chú riêng cho team Backend
├── packages/
│   └── contracts/                     # [@quickattend/contracts] Zod schemas & Types dùng chung Mobile + API
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── docs/                              # Tài liệu thiết kế & Đặc tả kỹ thuật
│   ├── database-design/               # ERD & Data Dictionary
│   ├── user-flow/                     # Sơ đồ luồng người dùng Host & Guest
│   ├── architecture.md                # Tài liệu kiến trúc hệ thống
│   └── user_stories.md                # Đặc tả chi tiết 8 User Stories & Acceptance Criteria
├── .env.example                       # Mẫu biến môi trường (copy thành .env trước khi chạy)
├── .gitignore                         # Chặn node_modules, .env, build, src/generated, scripts/ nội bộ
├── CONTRIBUTING.md                    # Quy ước Git Flow, đặt tên nhánh & Conventional Commits
├── LICENSE                            # Giấy phép MIT
├── package.json                       # Scripts điều phối toàn bộ Monorepo
├── pnpm-workspace.yaml                # Khai báo pnpm workspaces (apps/*, packages/*)
└── README.md                          # Tài liệu hướng dẫn chính (file này)
```

---

## 5. Cài đặt môi trường (Windows / macOS / Linux)

### 5.1. Node.js 24 LTS

#### Windows
```cmd
winget install --id OpenJS.NodeJS.LTS -e --version 24.22.1 --interactive
```
*(Mở lại CMD/PowerShell mới sau khi cài đặt xong).*

#### macOS
```sh
brew install node@24
printf '\nexport PATH="%s/opt/node@24/bin:$PATH"\n' "$(brew --prefix)" >> ~/.zprofile
source ~/.zprofile
```

#### Linux (Ubuntu/Debian)
```sh
sudo apt update && sudo apt install -y curl ca-certificates
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

Kiểm tra:
```sh
node --version   # Yêu cầu >= v24.x
```

### 5.2. pnpm (v12+)

#### Windows
```cmd
npm install --global pnpm@12.18.0
pnpm --version
```

#### Linux / macOS
```sh
npm install --global pnpm@12.18.0
pnpm --version
```

### 5.3. PostgreSQL 18

#### Windows
```cmd
winget install --id PostgreSQL.PostgreSQL.18 -e --interactive
```
Thành phần cài đặt: chọn **PostgreSQL Server**, **Command Line Tools** (**pgAdmin 4** tùy chọn; bỏ chọn **Stack Builder**). Giữ cổng mặc định `5432`, đặt mật khẩu cho user `postgres`, giữ Locale `DEFAULT`.

#### macOS
```sh
brew install postgresql@18
brew services start postgresql@18
pg_isready -h localhost -p 5432
```

#### Linux (Ubuntu/Debian)
```sh
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
sudo apt update && sudo apt install -y postgresql-18
sudo systemctl enable --now postgresql
pg_isready -h localhost -p 5432
```

### 5.4. Thiết bị chạy thử Mobile App
- Cài ứng dụng **Expo Go** trên điện thoại (iOS App Store / Android Google Play), hoặc cài **Android Studio Emulator** / **Xcode Simulator**.

---

## 6. Cài đặt & Khởi chạy QuickAttend

Thư mục làm việc: thư mục gốc `QuickAttend/` (nơi chứa `package.json` và `pnpm-workspace.yaml`).

### Bước 1: Clone repository & tạo database PostgreSQL

```sh
git clone https://github.com/QuickAttend-Team/QuickAttend.git
cd QuickAttend
```

Kết nối vào PostgreSQL bằng role `postgres` để tạo role và database riêng cho QuickAttend:
- **Windows (CMD):**
  ```cmd
  "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d postgres
  ```
- **macOS:** `psql -d postgres` | **Linux:** `sudo -u postgres psql`

Chạy các lệnh SQL sau trong `psql`:
```sql
CREATE ROLE quickattend LOGIN PASSWORD 'QuickAttendLocal2026';
CREATE DATABASE quickattend OWNER quickattend;
\connect quickattend
\quit
```

### Bước 2: Cài đặt thư viện cho toàn bộ Monorepo

```sh
pnpm install
```
*(Khi dự án đã có `pnpm-lock.yaml`, dùng `pnpm install --frozen-lockfile` để đồng bộ phiên bản tuyệt đối giữa các thành viên).*

### Bước 3: Cấu hình biến môi trường (`.env`)

Tạo file `.env` từ `.env.example`:
- **Windows:** `copy .env.example .env`
- **Linux / macOS:** `cp .env.example .env`

*(Nếu chạy Prisma CLI trực tiếp trong `apps/api`, copy thêm `.env` vào `apps/api/.env` hoặc chạy lệnh từ root qua `pnpm db:*`).*

Sinh hai chuỗi khóa bảo mật ngẫu nhiên (ít nhất 32 bytes / 64 ký tự hex) cho `JWT_SECRET` và `OTP_HMAC_SECRET`:
```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Cập nhật nội dung `.env`:
```dotenv
DATABASE_URL="postgresql://quickattend:QuickAttendLocal2026@localhost:5432/quickattend?schema=public"
JWT_SECRET="CHUOI_SECRET_1_VUA_SINH"
OTP_HMAC_SECRET="CHUOI_SECRET_2_VUA_SINH"
API_PORT=4000
NODE_ENV="development"
EXPO_PUBLIC_API_URL="http://localhost:4000/api"
```
> **Lưu ý khi test trên điện thoại thật qua Expo Go:** Đổi `localhost` trong `EXPO_PUBLIC_API_URL` thành địa chỉ **IP LAN** của máy tính chạy API (ví dụ `http://192.168.1.15:4000/api`) để điện thoại gọi được tới Backend. Tuyệt đối **không commit file `.env`**.

### Bước 4: Khởi tạo Prisma Client, bảng CSDL và dữ liệu mẫu

*(Áp dụng sau khi hoàn thiện schema ở task `M2-03`):*
```sh
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```
- `db:generate`: Sinh Prisma Client từ `apps/api/prisma/schema.prisma`.
- `db:migrate`: Áp dụng migrations tạo bảng và ràng buộc trên PostgreSQL.
- `db:seed`: Làm sạch và nạp dữ liệu mẫu (tài khoản Giảng viên, Sinh viên, mẫu phòng học) phục vụ phát triển & demo.

### Bước 5: Chạy hệ thống (2 terminal tại thư mục gốc `QuickAttend/`)

- **Terminal 1 — Backend API (`http://localhost:4000`):**
  ```sh
  pnpm dev:api
  ```
- **Terminal 2 — Mobile App (Expo Dev Server):**
  ```sh
  pnpm dev:mobile
  ```
  Quét mã QR hiển thị trên terminal bằng ứng dụng **Expo Go** (Android) hoặc Camera mặc định (iOS) để mở ứng dụng.

---

## 7. Kiểm tra mã nguồn & Unit Test

```sh
pnpm lint        # Kiểm tra quy tắc mã nguồn ESLint toàn workspace
pnpm typecheck   # Kiểm tra kiểu TypeScript nghiêm ngặt
pnpm test        # Chạy toàn bộ Unit Test nghiệp vụ (node:test + tsx --test)
pnpm build       # Biên dịch contracts & api
```

- **Quy ước Unit Test:** Các test trong `apps/api/tests/*.test.ts` sử dụng `node:test` và `node:assert/strict`, kiểm thử các hàm nghiệp vụ thuần (tính khoảng cách Geofence Haversine, validate email `.edu.vn`, logic kiểm tra Hardware UUID, tính toán thời hạn bàn giao `delegation`, xử lý hàng đợi `offline sync`) mà **không phụ thuộc vào PostgreSQL hay mạng**, giúp chạy tức thì và tự động trên CI.

---

## 8. Xử lý lỗi cài đặt thường gặp

| Lỗi | Cách xử lý |
| :--- | :--- |
| Không tìm thấy `node` hoặc `pnpm` | Mở lại cửa sổ PowerShell/CMD mới; kiểm tra biến `PATH` hoặc cài lại đúng phiên bản Node 24 & pnpm 12. |
| PostgreSQL không kết nối được (`ECONNREFUSED`) | Kiểm tra dịch vụ PostgreSQL đã chạy chưa (`net start postgresql-x64-18` trên Windows hoặc `brew services start postgresql@18` trên macOS) và kiểm tra cổng `5432`. |
| `password authentication failed` | Kiểm tra lại username (`quickattend`) và mật khẩu trong chuỗi `DATABASE_URL` ở `.env` đã khớp với lệnh `CREATE ROLE` chưa. |
| Thiếu Prisma Client hoặc lỗi bảng chưa tồn tại | Chạy lại `pnpm db:generate` rồi `pnpm db:migrate`. |
| Lỗi `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` hoặc thiếu package | Chạy `pnpm install` lại ở thư mục gốc `QuickAttend/` (không chạy `npm install` để tránh tạo `package-lock.json` xung đột với `pnpm`). |
| Điện thoại mở Expo Go nhưng gọi API bị lỗi Network Error | `localhost` trên điện thoại trỏ vào chính điện thoại; cần sửa `EXPO_PUBLIC_API_URL` thành IP LAN máy tính (xem bằng `ipconfig` / `ifconfig`) và mở firewall cổng `4000`. |
| `EADDRINUSE` tại cổng `4000` hoặc `8081` | Tắt tiến trình Node/Expo cũ đang chạy ngầm trong terminal khác rồi khởi động lại. |

---

## 9. Quy chuẩn đóng góp (Git Flow) & Lộ trình

### 🌿 Quy ước Branch & Commit
Xem chi tiết tại [CONTRIBUTING.md](CONTRIBUTING.md):
- Đặt tên nhánh từ `develop` / `main`: `feature/<issue-id>-<short-description>`, `bugfix/<issue-id>-<short-description>`, `docs/<short-description>`.
- Commit theo chuẩn **Conventional Commits**:
  ```text
  feat(identity): implement university email registration for host [M2-05]
  fix(attendance): adjust indoor gps radius check tolerance [M2-10]
  docs(readme): update monorepo setup and tech stack guide
  ```

### 🗺️ Lộ trình phát triển (Roadmap)
- [x] **Milestone 1: Product Discovery & Foundation**
  - Nghiên cứu vấn đề, khảo sát thực tế ($N=8$), phân tích 5 giải pháp thay thế.
  - Ma trận Keep/Revise/Reject, Business Canvas 3×3, xác định phạm vi MVP (US01–US08) & User Flows.
  - Thiết lập GitHub Organization, Wiki, GitHub Project Board và Backlog Milestone 2.
- [ ] **Milestone 2: UI/UX Design & Core Feature Implementation** *(Hạn: 20/11/2026)*
  - Hoàn thiện Figma Design System & Mockups (Host & Guest flows).
  - Thiết lập pnpm Monorepo, CSDL PostgreSQL 18 + Prisma 7 và `@quickattend/contracts`.
  - Hiện thực hóa US01–US08 (Auth `.edu`, Device UUID Binding, Templates, 1-Tap Launch, Delegation, Monitoring, 1-Tap GPS Check-in, Offline Queue).
  - Kiểm thử đơn vị (`node:test`), đo độ trôi GPS thực địa tại giảng đường & demo.
- [ ] **Milestone 3: Advanced Security, Realtime Sync & Pilot Release**
  - Tối ưu phòng chống Fake GPS / Mock Location và tinh chỉnh bán kính theo kết quả đo thực địa.
  - Kiểm thử tải đồng thời (50–100 sinh viên bấm điểm danh cùng lúc) & đóng gói bản build thử nghiệm.

---

## 10. Giấy phép

Dự án được phân phối dưới giấy phép **MIT License**. Chi tiết xem tại [LICENSE](LICENSE).
