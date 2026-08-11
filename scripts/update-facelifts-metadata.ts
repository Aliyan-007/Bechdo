import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { getFaceliftChanges } from "../src/lib/importer";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updateFacelifts() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 4: FACELIFT SYSTEM POPULATION   ");
  console.log("=========================================================\n");

  const facelifts = await prisma.facelift.findMany({
    include: { generation: { include: { model: { include: { brand: true } } } } },
  });

  console.log(`Auditing and populating Facelift System metadata for ${facelifts.length} documented facelifts...\n`);

  let updatedCount = 0;
  for (const fl of facelifts) {
    const bName = fl.generation.model.brand.name;
    const mName = fl.generation.model.name;
    await prisma.facelift.update({
      where: { id: fl.id },
      data: {
        changes: getFaceliftChanges(bName, mName, fl.year),
        imageUrl: `vehicles/facelifts/${fl.generation.model.brand.slug}-${fl.generation.model.slug}-${fl.year}.svg`,
      },
    });
    updatedCount++;
  }

  console.log(`✅ Successfully updated ${updatedCount} canonical facelifts in dev.db with Changes Documentation & Facelift Image!`);
}

updateFacelifts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
