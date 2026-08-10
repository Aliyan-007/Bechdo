import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // If the env var wasn't set in the shell, load .env.local for local development
  if (!process.env.DATABASE_URL) {
    dotenv.config({ path: ".env.local" });
  }

  // Debug: show whether DATABASE_URL is present and its type
  try {
    // avoid printing the full URL (contains password)
    // show only whether it starts with the expected prefix
    // eslint-disable-next-line no-console
    console.log("DATABASE_URL present:", typeof process.env.DATABASE_URL, process.env.DATABASE_URL ? process.env.DATABASE_URL.startsWith("postgresql://") : false);
  } catch (e) {
    /* ignore */
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
