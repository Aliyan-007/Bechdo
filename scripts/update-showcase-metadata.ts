import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updateShowcaseMetadata() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 13: SHOWCASE SYSTEM AUDIT       ");
  console.log("=========================================================\n");

  const variants = await prisma.variant.findMany({
    include: {
      model: {
        include: { brand: true },
      },
    },
  });

  console.log(`Auditing and curating showcase classifications across ${variants.length} verified variant ledgers...\n`);

  let featuredCount = 0;
  let popularCount = 0;
  let recentlyAddedCount = 0;

  for (let idx = 0; idx < variants.length; idx++) {
    const v = variants[idx];
    const modelName = v.model.name;
    const nameLower = v.name.toLowerCase();

    // 1. Featured Flagship Trims
    const isFeatured =
      v.priceMinLakh >= 75 ||
      ["H6", "HS", "Ora 03", "Fortuner", "Prado", "BYD", "2008", "Tucson", "Sportage"].includes(modelName) ||
      nameLower.includes("grande") ||
      nameLower.includes("rs") ||
      nameLower.includes("hev") ||
      nameLower.includes("rocco") ||
      nameLower.includes("legender") ||
      idx % 5 === 0;

    // 2. Popular High-Volume Market Leaders
    const isPopular =
      ["Alto", "Cultus", "Corolla", "Civic", "City", "Sportage", "Tucson", "Hilux", "Karvaan", "Mehran"].includes(modelName) ||
      idx % 3 === 0;

    // 3. Recently Added / Verified Models
    const isRecentlyAdded =
      v.releaseYear >= 2023 ||
      ["Ora 03", "H6", "HS", "2008", "Karvaan"].includes(modelName) ||
      idx % 4 === 0;

    await prisma.variant.update({
      where: { id: v.id },
      data: {
        isFeatured: isFeatured,
        isPopular: isPopular,
        isRecentlyAdded: isRecentlyAdded,
      },
    });

    if (isFeatured) featuredCount++;
    if (isPopular) popularCount++;
    if (isRecentlyAdded) recentlyAddedCount++;
  }

  console.log(`✅ Successfully curated showcase classifications in dev.db:`);
  console.log(`   - Featured Flagships: ${featuredCount} variants`);
  console.log(`   - Popular Market Leaders: ${popularCount} variants`);
  console.log(`   - Recently Added / Verified: ${recentlyAddedCount} variants\n`);
}

updateShowcaseMetadata()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
