import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default("postgresql://quickattend:quickattend_secret@localhost:5432/quickattend?schema=public"),
  JWT_SECRET: z.string().min(16).default("quickattend-super-secret-jwt-key-2026-secure"),
  PORT: z.string().transform(Number).default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment configuration.");
}

export const env = parsed.data;
