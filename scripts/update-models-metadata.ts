import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import {
  getModelCategory,
  getModelFirstYear,
  getModelAliases,
} from "../src/lib/importer";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updateModels() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 2: MODEL DATABASE POPULATION    ");
  console.log("=========================================================\n");

  const models = await prisma.model.findMany();
  console.log(`Auditing and populating Model Database metadata for ${models.length} canonical model families...\n`);

  let updatedCount = 0;
  for (const m of models) {
    await prisma.model.update({
      where: { id: m.id },
      data: {
        aliases: getModelAliases(m.name),
        category: getModelCategory(m.name, m.bodyType),
        firstProductionYear: getModelFirstYear(m.name),
        lastProductionYear: m.isHistorical ? 2010 : null,
        status: m.isHistorical ? "HISTORICAL" : "CURRENT",
      },
    });
    updatedCount++;
  }

  console.log(`✅ Successfully updated ${updatedCount} canonical models in dev.db with Category, Production Years, Aliases & Status!`);
}

updateModels()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
