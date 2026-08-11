import "dotenv/config";
import { prisma } from "./src/lib/prisma.ts";
console.log("DB URL:", process.env.DATABASE_URL);
console.log("prisma constructor:", prisma.constructor.name);
await prisma.$disconnect();
