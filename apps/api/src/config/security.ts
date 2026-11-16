export const PASSWORD_MIN_LENGTH = 8 as const;
export const PASSWORD_MAX_LENGTH = 128 as const;
export const PASSWORD_PATTERN = `(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])[\\x21-\\x7E]{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}}`;
export const PASSWORD_RULE_MESSAGE = `Mật khẩu cần ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.`;

export const PASSWORD_HASH_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
} as const;

export const JWT_EXPIRY_HOURS = 24 as const;
export const SESSION_TTL_HOURS = 24 as const;
