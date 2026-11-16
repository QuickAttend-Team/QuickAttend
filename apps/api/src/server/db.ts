import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";
import { env } from "../config/env.js";
import { DomainError } from "../lib/errors.js";

const { Pool } = pg;

const globalForPrisma = globalThis as unknown as {
  pgPool?: pg.Pool;
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString: env.DATABASE_URL,
      options: "-c timezone=UTC",
      max: 20,
    });
  globalForPrisma.pgPool = pool;
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const db: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export function mapDatabaseConstraintError(err: unknown): never {
  if (err instanceof DomainError) {
    throw err;
  }
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("Unique constraint") || msg.includes("23505")) {
    if (msg.includes("email")) {
      throw new DomainError("IDENTITY_CONFLICT", "Địa chỉ email này đã được sử dụng.", 409);
    }
    if (msg.includes("device_uuid")) {
      throw new DomainError("DEVICE_BINDING_CONFLICT", "Thiết bị này đã được liên kết với một tài khoản khác.", 409);
    }
    if (msg.includes("session_id") && msg.includes("guest_id")) {
      throw new DomainError("ALREADY_CHECKED_IN", "Bạn đã điểm danh trong ca học này rồi.", 409);
    }
  }
  throw new DomainError("INTERNAL_SERVER_ERROR", "Lỗi xử lý cơ sở dữ liệu.", 500, { original: msg });
}
