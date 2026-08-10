import { config as dotenvConfig } from "dotenv";
import { defineConfig, env } from "@prisma/config";

dotenvConfig({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
