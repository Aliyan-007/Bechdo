import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || "";

  // If connected to Supabase or managed PostgreSQL, use it immediately
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    return url;
  }

  // For any SQLite database on Vercel Serverless / production
  const targetDb = path.join("/tmp", "dev.db");

  // If already copied to /tmp in this serverless instance, reuse it instantly
  if (fs.existsSync(targetDb)) {
    return "file:/tmp/dev.db";
  }

  // Locate dev.db in possible Vercel Serverless directories
  const candidates = [
    path.join(process.cwd(), "dev.db"),
    path.join(process.cwd(), "..", "dev.db"),
    path.join(process.cwd(), "..", "..", "dev.db"),
    path.join(__dirname, "dev.db"),
    path.join(__dirname, "..", "dev.db"),
    path.join(__dirname, "..", "..", "dev.db"),
    path.join(__dirname, "..", "..", "..", "dev.db"),
    path.resolve("./dev.db"),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
        fs.copyFileSync(candidate, targetDb);
        console.log(`Successfully copied ${candidate} -> /tmp/dev.db`);
        return "file:/tmp/dev.db";
      }
    } catch (e) {
      console.warn(`Could not copy from candidate ${candidate}:`, e);
    }
  }

  // Fallback if targetDb was created or if running locally
  if (fs.existsSync(targetDb)) {
    return "file:/tmp/dev.db";
  }

  return "file:./dev.db";
}

function createPrismaClient() {
  const url = getDatabaseUrl();

  // If connected to Supabase or managed PostgreSQL
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    return new PrismaClient();
  }

  // Default to local SQLite via LibSQL adapter
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
