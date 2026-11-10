/**
 * @quickattend/contracts
 * Nơi chia sẻ Zod validation schemas, TypeScript types và hằng số nghiệp vụ
 * dùng chung giữa Backend (@quickattend/api) và Mobile App (@quickattend/mobile).
 */

export const USER_ROLES = {
  HOST: 'ROLE_HOST',
  GUEST: 'ROLE_GUEST',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ALLOWED_GEOFENCE_RADII_METERS = [20, 50, 100] as const;

export type GeofenceRadius = (typeof ALLOWED_GEOFENCE_RADII_METERS)[number];

