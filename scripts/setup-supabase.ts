import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function setupSupabase() {
  console.log("=========================================================");
  console.log("  RASTA — AUTOMATED SUPABASE POSTGRESQL SETUP PIPELINE   ");
  console.log("=========================================================\n");

  const args = process.argv.slice(2);
  let dbUrl = "";
  let directUrl = "";
  let supabaseUrl = "";
  let anonKey = "";

  for (const arg of args) {
    if (arg.startsWith("--dbUrl=")) dbUrl = arg.split("=")[1].trim();
    if (arg.startsWith("--directUrl=")) directUrl = arg.split("=")[1].trim();
    if (arg.startsWith("--supabaseUrl=")) supabaseUrl = arg.split("=")[1].trim();
    if (arg.startsWith("--anonKey=")) anonKey = arg.split("=")[1].trim();
  }

  if (!dbUrl && !process.env.DATABASE_URL?.startsWith("postgres")) {
    console.error("❌ Error: Missing --dbUrl argument (must start with postgresql:// or postgres://).");
    console.error("Usage: npx tsx scripts/setup-supabase.ts --dbUrl='postgresql://...' --supabaseUrl='https://...' --anonKey='...'");
    process.exit(1);
  }

  const finalDbUrl = dbUrl || process.env.DATABASE_URL || "";
  const finalDirectUrl = directUrl || finalDbUrl;
  const finalSupabaseUrl = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const finalAnonKey = anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  console.log(`[1/6] Writing Supabase configuration to .env...`);
  const envContent = `# RASTA Production Supabase PostgreSQL Configuration
DATABASE_URL="${finalDbUrl}"
DIRECT_URL="${finalDirectUrl}"
NEXT_PUBLIC_SUPABASE_URL="${finalSupabaseUrl}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${finalAnonKey}"
NEXT_PUBLIC_IMAGE_CDN="${finalSupabaseUrl ? `${finalSupabaseUrl}/storage/v1/object/public/vehicle-gallery` : ""}"
`;

  fs.writeFileSync(path.join(process.cwd(), ".env"), envContent, "utf-8");
  console.log(`✅ .env updated with Supabase connection strings!`);

  console.log(`\n[2/6] Switching prisma/schema.prisma to PostgreSQL provider...`);
  fs.copyFileSync(
    path.join(process.cwd(), "prisma/schema.supabase.prisma"),
    path.join(process.cwd(), "prisma/schema.prisma")
  );
  console.log(`✅ schema.prisma switched to PostgreSQL!`);

  console.log(`\n[3/6] Generating Prisma Client for PostgreSQL...`);
  execSync("npx prisma generate", { stdio: "inherit" });

  console.log(`\n[4/6] Pushing 18-model schema to your Supabase PostgreSQL database...`);
  execSync("npx prisma db push", { stdio: "inherit" });

  console.log(`\n[5/6] Seeding 40 canonical brands and 200 verified variants into Supabase...`);
  execSync("npm run db:seed", { stdio: "inherit" });
  execSync("npx tsx scripts/expand-catalog.ts", { stdio: "inherit" });
  execSync("npx tsx scripts/import-research-queue.ts", { stdio: "inherit" });
  execSync("npx tsx scripts/ingest-official-photography.ts", { stdio: "inherit" });

  console.log(`\n[6/6] Verifying data reconciliation on Supabase...`);
  execSync("npx tsx scripts/reconcile-database.ts", { stdio: "inherit" });

  console.log(`\n=========================================================`);
  console.log(`  SUPABASE POSTGRESQL SETUP & SEEDING 100% COMPLETE!     `);
  console.log(`=========================================================`);
}

setupSupabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
