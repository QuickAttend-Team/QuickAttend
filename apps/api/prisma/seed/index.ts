import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/index.js";
import { hashPassword } from "../../src/server/password.js";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding QuickAttend database...");

  const defaultPassword = await hashPassword("QuickAttend@2026");

  // 1. Seed Host (Lecturer)
  const host = await prisma.user.upsert({
    where: { email: "giangvien@hcmut.edu.vn" },
    update: {},
    create: {
      fullName: "TS. Hoàng Lê Hải Thanh",
      email: "giangvien@hcmut.edu.vn",
      phone: "0901234567",
      roles: {
        create: [{ role: "ROLE_HOST" }],
      },
      account: {
        create: {
          passwordHash: defaultPassword,
          status: "ACTIVE",
        },
      },
    },
  });

  // 2. Seed Guest (Student)
  const student = await prisma.user.upsert({
    where: { email: "nhan.nguyen@hcmut.edu.vn" },
    update: {},
    create: {
      fullName: "Nguyễn Hồng Thiện Nhân",
      email: "nhan.nguyen@hcmut.edu.vn",
      phone: "0987654321",
      roles: {
        create: [{ role: "ROLE_GUEST" }],
      },
      account: {
        create: {
          passwordHash: defaultPassword,
          status: "ACTIVE",
        },
      },
      deviceBindings: {
        create: {
          deviceUuid: "test-device-uuid-nhan-2410670",
          deviceName: "Samsung Galaxy S23",
          platform: "ANDROID",
        },
      },
    },
  });

  // 3. Seed Attendance Template
  const template = await prisma.attendanceTemplate.create({
    data: {
      hostId: host.userId,
      title: "Phát triển Ứng dụng Di động - CO3043",
      roomName: "H6-602",
      latitude: 10.7725,
      longitude: 106.6578,
      radiusMeters: 20,
      durationMinutes: 15,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log(`- Host: ${host.email}`);
  console.log(`- Student: ${student.email}`);
  console.log(`- Template: ${template.title} (${template.roomName})`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
