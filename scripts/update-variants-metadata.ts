import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import {
  getVariantDrivetrain,
  getVariantTrimLevel,
} from "../src/lib/importer";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updateVariants() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 5: VARIANT SYSTEM POPULATION    ");
  console.log("=========================================================\n");

  const variants = await prisma.variant.findMany();
  console.log(`Auditing and populating Variant System metadata for ${variants.length} verified Pakistani variants...\n`);

  let updatedCount = 0;
  for (const v of variants) {
    await prisma.variant.update({
      where: { id: v.id },
      data: {
        drivetrain: getVariantDrivetrain(v.bodyType, v.name),
        trimLevel: getVariantTrimLevel(v.name),
      },
    });
    updatedCount++;
  }

  console.log(`✅ Successfully updated ${updatedCount} canonical variants in dev.db with Drivetrain & Trim Level rank!`);
}

updateVariants()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
