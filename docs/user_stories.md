# Danh mục User Stories & Tiêu chí nghiệm thu (QuickAttend MVP)

Tài liệu này chi tiết hóa 8 User Stories được xác định từ Milestone 1 (Product Discovery & Foundation), làm cơ sở phân rã công việc cho Milestone 2.

---

## 📌 Nhóm A: Authentication & Onboarding (Đăng ký & Định danh)

### US01: Đăng ký tài khoản Giảng viên bằng Email trường
- **Mô tả:** Là một Giảng viên (Host), tôi muốn đăng ký tài khoản bằng email trường (`.edu` / `.edu.vn`), để hệ thống tự động xác minh vai trò giảng viên và cho phép tôi tạo các mẫu điểm danh.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Form đăng ký xác thực định dạng email có đuôi trường cấp hợp lệ.
  - Hệ thống gửi mã OTP hoặc liên kết kích hoạt về hòm thư trường.
  - Sau khi kích hoạt thành công, tài khoản được tự động gán quyền `ROLE_HOST`.
- **Độ ưu tiên:** High | **Story Points:** 3

### US02: Đăng ký & Khóa thiết bị Sinh viên (Hardware Binding)
- **Mô tả:** Là một Sinh viên (Guest), tôi muốn đăng ký tài khoản bằng email sinh viên và liên kết trực tiếp với thiết bị di động cá nhân, để tôi có thể điểm danh nhanh chóng mà không lo bị kẻ khác mạo danh hay điểm danh hộ.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Yêu cầu nhập Mã số sinh viên (MSSV), Họ tên và Email sinh viên.
  - Hệ thống tự động trích xuất và lưu trữ Hardware UUID của thiết bị trong lần đăng nhập đầu tiên.
  - Khi đăng nhập trên thiết bị thứ 2, hệ thống từ chối hoặc yêu cầu quy trình xác minh mở khóa đặc biệt từ quản trị viên.
- **Độ ưu tiên:** High | **Story Points:** 5

---

## 📌 Nhóm B: Host Features (Quản lý Mẫu & Khởi chạy Phiên)

### US03: Tạo & Lưu mẫu điểm danh ca học (Pre-Saved Templates)
- **Mô tả:** Là một Giảng viên (Host), tôi muốn tạo và lưu sẵn các mẫu điểm danh (tên môn, phòng học, bán kính GPS), để tôi không phải thiết lập lại các thông số này ở mỗi buổi học trên lớp.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Cho phép nhập: Tên môn học, Mã môn, Tên phòng học, Bán kính Geofence (chọn 20m, 50m, 100m).
  - Có nút "Lấy vị trí hiện tại" để tự động gán tọa độ GPS của phòng học.
  - Mẫu được lưu trữ và hiển thị dạng thẻ (Card) tại Màn hình chính của Giảng viên.
- **Độ ưu tiên:** High | **Story Points:** 5

### US04: Khởi chạy phiên điểm danh 1 chạm (One-Tap Attendance Launch)
- **Mô tả:** Là một Giảng viên (Host), tôi muốn bắt đầu phiên điểm danh chỉ với 1 nút bấm từ mẫu đã lưu, để tôi có thể tiến hành điểm danh ngay lập tức mà không làm gián đoạn thời gian giảng dạy.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Mỗi thẻ mẫu có nút to "Bắt đầu ngay (1 chạm)".
  - Nhấn nút kích hoạt ngay phiên điểm danh thời gian thực, mở đồng hồ đếm ngược (thời lượng mặc định 5-15 phút).
  - Hệ thống tự động phát tín hiệu mở phiên cho các sinh viên trong phạm vi lớp học.
- **Độ ưu tiên:** Critical | **Story Points:** 5

### US05: Bàn giao quyền quản lý tạm thời (Temporary Delegation)
- **Mô tả:** Là một Giảng viên (Host), tôi muốn chia sẻ quyền quản lý phiên điểm danh tạm thời cho giảng viên dạy thay bằng cách nhập email của họ, để giảng viên dạy thay có thể mở lớp điểm danh mà không cần tạo lại danh sách hay can thiệp hệ thống LMS.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Có tùy chọn "Bàn giao quyền" tại thẻ mẫu hoặc phiên đang mở.
  - Nhập email của giảng viên dạy thay và chọn thời hạn bàn giao (ví dụ: Chỉ ca hôm nay).
  - Giảng viên dạy thay nhận được thông báo tức thì và thấy mẫu ca học xuất hiện trong app của họ với quyền điều hành phiên.
- **Độ ưu tiên:** High | **Story Points:** 8

### US06: Theo dõi tiến độ điểm danh thời gian thực (Active Session Monitoring)
- **Mô tả:** Là một Giảng viên (Host), tôi muốn xem số lượng và danh sách sinh viên đã điểm danh hợp lệ theo thời gian thực, để tôi nắm được sĩ số lớp học ngay lập tức.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Hiển thị trực quan tỉ lệ sĩ số (ví dụ: 45/50 sinh viên).
  - Cập nhật danh sách điểm danh thời gian thực (họ tên, MSSV, mốc thời gian giây).
  - Phân loại rõ: Hợp lệ (trong vùng GPS) vs Thất bại (ngoài vùng GPS / nghi vấn).
  - Có nút "Kết thúc phiên" để chốt danh sách.
- **Độ ưu tiên:** High | **Story Points:** 5

---

## 📌 Nhóm C: Guest Features (Điểm danh Nhanh cho Sinh viên)

### US07: Điểm danh 1 chạm bằng định vị vị trí (GPS-Based One-Tap Attendance)
- **Mô tả:** Là một Sinh viên (Guest), tôi muốn điểm danh chỉ bằng 1 nút bấm duy nhất trên màn hình, để tôi có thể hoàn thành việc điểm danh trong chưa đầy 3 giây khi đã ngồi trong phòng học.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Màn hình chính của Sinh viên có giao diện cực kỳ tối giản với duy nhất một nút bấm lớn "ĐIỂM DANH NGAY".
  - Khi bấm nút, ứng dụng tự động kiểm tra quyền vị trí, đọc tọa độ GPS ngầm và so khớp với phiên ca học đang mở.
  - Không yêu cầu quét camera hay gõ phím nếu tọa độ nằm trong bán kính cho phép.
- **Độ ưu tiên:** Critical | **Story Points:** 5

### US08: Xác thực đa yếu tố & Nhận kết quả tức thì (Multi-Factor Verification & Feedback)
- **Mô tả:** Là một Sinh viên (Guest), tôi muốn xác nhận thông tin ca học và nhận thông báo kết quả điểm danh ngay trên màn hình, để tôi chắc chắn rằng lượt điểm danh của mình đã được hệ thống ghi nhận thành công.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Popup / Bottom Sheet hiển thị thông tin ca học tự nhận diện qua GPS.
  - Hiển thị biểu tượng Tích xanh kèm thời gian chính xác (hh:mm:ss) khi điểm danh thành công.
  - Hiển thị thông báo lỗi cụ thể (khoảng cách ngoài bán kính bao xa, lỗi thiết bị) và cho phép thử lại.
- **Độ ưu tiên:** High | **Story Points:** 5

