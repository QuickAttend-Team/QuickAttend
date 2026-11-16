import crypto from "node:crypto";
import { env } from "../config/env.js";
import { JWT_EXPIRY_HOURS } from "../config/security.js";
import { DomainError } from "../lib/errors.js";

export interface SessionPayload {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  deviceUuid?: string;
  exp: number;
}

/**
 * Creates a signed JWT-like HMAC-SHA256 token
 */
export function signSessionToken(payload: Omit<SessionPayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + JWT_EXPIRY_HOURS * 3600;
  const fullPayload: SessionPayload = { ...payload, exp };

  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", env.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

/**
 * Verifies and decodes the session token
 */
export function verifySessionToken(token: string): SessionPayload {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new DomainError("UNAUTHENTICATED", "Token xác thực không hợp lệ.", 401);
  }

  const [header, body, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", env.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (signature !== expectedSig) {
    throw new DomainError("UNAUTHENTICATED", "Chữ ký xác thực không hợp lệ.", 401);
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new DomainError("UNAUTHENTICATED", "Phiên đăng nhập đã hết hạn.", 401);
    }
    return payload;
  } catch {
    throw new DomainError("UNAUTHENTICATED", "Nội dung token không giải mã được.", 401);
  }
}
