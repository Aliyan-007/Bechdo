import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // On Vercel Serverless (or read-only production environments), copy dev.db to /tmp for read-write access
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const sourceDb = path.join(process.cwd(), "dev.db");
    const targetDb = path.join("/tmp", "dev.db");
    try {
      if (fs.existsSync(sourceDb)) {
        if (!fs.existsSync(targetDb)) {
          fs.copyFileSync(sourceDb, targetDb);
          console.log("Copied dev.db to /tmp/dev.db for Vercel Serverless read-write access");
        }
        return "file:/tmp/dev.db";
      }
    } catch (e) {
      console.error("Failed to copy dev.db to /tmp, falling back to local file:", e);
    }
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
