import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import {
  getBrandParentCompany,
  getBrandOfficialWebsite,
  getBrandDistributor,
} from "../src/lib/importer";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updateBrands() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 1: BRAND DATABASE POPULATION    ");
  console.log("=========================================================\n");

  const brands = await prisma.brand.findMany();
  console.log(`Auditing and populating Brand Database metadata for ${brands.length} canonical brands...\n`);

  let updatedCount = 0;
  for (const b of brands) {
    await prisma.brand.update({
      where: { id: b.id },
      data: {
        parentCompany: getBrandParentCompany(b.name),
        officialWebsite: getBrandOfficialWebsite(b.name),
        pakistanDistributor: getBrandDistributor(b.name),
        isActive: true,
      },
    });
    updatedCount++;
  }

  console.log(`✅ Successfully updated ${updatedCount} canonical brands in dev.db with Parent Company, Official Website, Pakistan Distributor & Active status!`);
}

updateBrands()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
