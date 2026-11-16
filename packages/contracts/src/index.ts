import { z } from "zod";

/**
 * Common Constants
 */
export const USER_ROLES = {
  HOST: "ROLE_HOST",
  GUEST: "ROLE_GUEST",
  ADMIN: "ROLE_ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ALLOWED_GEOFENCE_RADII_METERS = [20, 50, 100] as const;
export type GeofenceRadius = (typeof ALLOWED_GEOFENCE_RADII_METERS)[number];

export const ATTENDANCE_STATUS = {
  VALID: "VALID",
  FLAGGED: "FLAGGED",
  REJECTED: "REJECTED",
} as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const SESSION_STATUS = {
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
} as const;
export type SessionStatus = (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];

export const DELEGATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REVOKED: "REVOKED",
  EXPIRED: "EXPIRED",
} as const;
export type DelegationStatus = (typeof DELEGATION_STATUS)[keyof typeof DELEGATION_STATUS];

/**
 * Authentication Schemas
 */
export const EDU_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(edu|edu\.vn)$/i;

export const registerHostSchema = z.object({
  fullName: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  email: z.string().regex(EDU_EMAIL_REGEX, "Email giảng viên phải thuộc tên miền .edu hoặc .edu.vn"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  phone: z.string().optional(),
});
export type RegisterHostInput = z.infer<typeof registerHostSchema>;

export const registerGuestSchema = z.object({
  fullName: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  deviceUuid: z.string().min(10, "Mã thiết bị không hợp lệ"),
  deviceName: z.string().optional(),
  platform: z.enum(["IOS", "ANDROID"]),
});
export type RegisterGuestInput = z.infer<typeof registerGuestSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  deviceUuid: z.string().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Attendance Templates & Sessions Schemas
 */
export const createTemplateSchema = z.object({
  title: z.string().min(3, "Tên môn học/ca học tối thiểu 3 ký tự"),
  roomName: z.string().min(2, "Tên phòng học tối thiểu 2 ký tự"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.enum(["20", "50", "100"]).transform(Number).pipe(z.union([z.literal(20), z.literal(50), z.literal(100)])).or(z.union([z.literal(20), z.literal(50), z.literal(100)])),
  durationMinutes: z.number().int().min(5).max(300).default(15),
});
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

export const startSessionSchema = z.object({
  templateId: z.number().int().positive().optional(),
  title: z.string().min(3).optional(),
  roomName: z.string().min(2).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radiusMeters: z.union([z.literal(20), z.literal(50), z.literal(100)]).default(20),
  durationMinutes: z.number().int().min(5).max(300).default(15),
});
export type StartSessionInput = z.infer<typeof startSessionSchema>;

/**
 * Check-in & Geofence Schemas
 */
export const checkInSchema = z.object({
  sessionId: z.number().int().positive(),
  deviceUuid: z.string().min(10, "Mã thiết bị không hợp lệ"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isOfflineSync: z.boolean().default(false),
  clientTimestamp: z.string().datetime().optional(),
});
export type CheckInInput = z.infer<typeof checkInSchema>;

export const offlineSyncBatchSchema = z.object({
  records: z.array(checkInSchema).min(1, "Danh sách đồng bộ không được rỗng"),
});
export type OfflineSyncBatchInput = z.infer<typeof offlineSyncBatchSchema>;

/**
 * Delegation & Feedback Schemas
 */
export const delegateSessionSchema = z.object({
  sessionId: z.number().int().positive(),
  receiverEmail: z.string().regex(EDU_EMAIL_REGEX, "Email người nhận phải thuộc tên miền .edu / .edu.vn"),
  durationHours: z.number().int().min(1).max(72).default(4),
});
export type DelegateSessionInput = z.infer<typeof delegateSessionSchema>;

export const sessionFeedbackSchema = z.object({
  sessionId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});
export type SessionFeedbackInput = z.infer<typeof sessionFeedbackSchema>;
