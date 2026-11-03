# Hướng dẫn đóng góp cho dự án QuickAttend

Chào mừng các thành viên nhóm tham gia phát triển dự án **QuickAttend**! Để đảm bảo tiến độ, chất lượng mã nguồn và tính đồng nhất theo tiêu chí đánh giá môn học CO3043, nhóm áp dụng các quy chuẩn sau đây.

---

## 1. Quy trình làm việc với Git (Git Flow)

- Nhánh chính:
  - `main` (hoặc `master`): Nhánh chứa mã nguồn ổn định, đã kiểm thử để nộp bài hoặc báo cáo milestone.
  - `develop`: Nhánh tích hợp các tính năng đang phát triển trong sprint hiện tại.
- Nhánh phát triển tính năng:
  - Tạo nhánh mới từ `develop` theo quy ước:
    - `feature/<issue-id>-<short-description>`: Phát triển tính năng mới (vd: `feature/M2-04-lecturer-auth`)
    - `bugfix/<issue-id>-<short-description>`: Sửa lỗi (vd: `bugfix/M2-10-gps-fix`)
    - `refactor/<short-description>`: Cải tiến cấu trúc mã nguồn
    - `docs/<short-description>`: Cập nhật tài liệu
  - Sau khi hoàn thành và tự kiểm tra, tạo **Pull Request (PR)** vào nhánh `develop` và yêu cầu ít nhất 1 thành viên khác review.

---

## 2. Quy ước đặt tên Commit (Conventional Commits)

Định dạng commit bắt buộc:
```text
<type>(<scope>): <subject> [#<issue-number>]
```

Trong đó:
- `type`:
  - `feat`: Tính năng mới cho người dùng
  - `fix`: Sửa lỗi (bug fix)
  - `docs`: Cập nhật tài liệu
  - `style`: Định dạng code (whitespace, formatting) không ảnh hưởng logic
  - `refactor`: Tái cấu trúc mã nguồn mà không đổi hành vi
  - `test`: Thêm hoặc chỉnh sửa test
  - `chore`: Cập nhật cấu hình build, package.json, scripts
- `scope`: Module bị ảnh hưởng (`auth`, `session`, `template`, `geofence`, `ui`, `api`,...)
- `subject`: Mô tả ngắn gọn bằng tiếng Anh hoặc tiếng Việt rõ nghĩa.
- `[#issue-number]`: Mã issue GitHub liên quan để tự động liên kết.

*Ví dụ:*
```bash
git commit -m "feat(auth): add university email verification logic [#4]"
git commit -m "fix(geofence): handle permission denied gracefully on android [#10]"
```

---

## 3. Quy chuẩn viết Code (Coding Standards)

- Sử dụng **TypeScript** cho toàn bộ mã nguồn (`.ts`, `.tsx`), khai báo kiểu dữ liệu tường minh, hạn chế tối đa sử dụng kiểu `any`.
- Tuân thủ định dạng mã nguồn chuẩn với **ESLint** và **Prettier**.
- Tách nhỏ components: Mỗi component tập trung vào một nhiệm vụ (Single Responsibility).
- Đặt tên biến và hàm:
  - PascalCase cho React Components và Types/Interfaces (`AttendanceCard`, `SessionModel`).
  - camelCase cho biến, hàm và custom hooks (`useLocationPermission`, `calculateDistance`).
  - UPPER_SNAKE_CASE cho hằng số cấu hình (`DEFAULT_GEOFENCE_RADIUS_METERS`).

---

## 4. Quản lý Task & Issue trên GitHub Project

- Mỗi đầu việc trong Milestone đều phải có Issue trên GitHub tương ứng.
- Thành viên khi bắt đầu làm task cần:
  1. Gán bản thân vào Assignee của Issue.
  2. Kéo Issue sang cột **In Progress** trên GitHub Project Board.
  3. Tạo nhánh tương ứng với mã Issue.
  4. Sau khi xong, mở PR, gắn nhãn (Label) và kéo sang cột **Review / Testing**.
  5. Sau khi được duyệt và merge, đóng Issue và chuyển sang cột **Done**.

