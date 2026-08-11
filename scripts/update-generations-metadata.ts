import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import {
  getGenerationPlatform,
  getGenerationBodyStyles,
} from "../src/lib/importer";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updateGenerations() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 3: GENERATION SYSTEM POPULATION ");
  console.log("=========================================================\n");

  const generations = await prisma.generation.findMany({
    include: { model: { include: { brand: true } } },
  });

  console.log(`Auditing and populating Generation System metadata for ${generations.length} canonical chassis generations...\n`);

  let updatedCount = 0;
  for (const g of generations) {
    await prisma.generation.update({
      where: { id: g.id },
      data: {
        platform: getGenerationPlatform(g.model.brand.name, g.model.name),
        bodyStyles: getGenerationBodyStyles(g.model.bodyType),
        imageUrl: `vehicles/generations/${g.model.brand.slug}-${g.model.slug}.svg`,
      },
    });
    updatedCount++;
  }

  console.log(`✅ Successfully updated ${updatedCount} canonical generations in dev.db with Platform, Body Styles & Generational Image!`);
}

updateGenerations()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
