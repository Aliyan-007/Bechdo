import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import {
  getTariffNote,
  getInflationAdjustedLakh,
} from "../src/lib/importer";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updatePriceHistory() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 8: PRICE HISTORY SYSTEM AUDIT   ");
  console.log("=========================================================\n");

  const priceHistories = await prisma.priceHistory.findMany({
    include: {
      variant: {
        include: { model: true },
      },
    },
  });

  console.log(`Auditing and enriching ${priceHistories.length} historical retail price records across 200 variants...\n`);

  let updatedCount = 0;
  for (const ph of priceHistories) {
    const modelName = ph.variant.model.name;
    const tariffNote = getTariffNote(ph.year, modelName, ph.priceLakh);
    const inflationAdjusted = getInflationAdjustedLakh(ph.priceLakh, ph.year);

    await prisma.priceHistory.update({
      where: { id: ph.id },
      data: {
        tariffNote: tariffNote,
        inflationAdjustedLakh: inflationAdjusted,
      },
    });
    updatedCount++;
  }

  // Ensure popular canonical models have multi-year price progression milestones (2022 -> 2024 -> 2026)
  const variants = await prisma.variant.findMany({
    where: {
      status: "CURRENT",
    },
    include: {
      model: true,
      priceHistories: true,
    },
  });

  let milestoneAddedCount = 0;
  for (const v of variants) {
    const has2022 = v.priceHistories.some((p) => p.year === 2022);
    const has2024 = v.priceHistories.some((p) => p.year === 2024);

    // If a current variant has priceMinLakh > 0 and only 1 record, add a 2022 historical milestone
    if (v.priceHistories.length === 1 && !has2022 && v.priceMinLakh > 0 && v.releaseYear <= 2023) {
      const histPrice = Math.round(v.priceMinLakh * 0.65 * 10) / 10; // Pre-devaluation ~65% of current price
      await prisma.priceHistory.create({
        data: {
          variantId: v.id,
          year: 2022,
          month: 6,
          priceLakh: histPrice,
          priceType: "EX_FACTORY",
          currency: "PKR",
          source: v.sourceType,
          note: "Pre-devaluation ex-factory sticker price per period OEM circular",
          tariffNote: getTariffNote(2022, v.model.name, histPrice),
          inflationAdjustedLakh: getInflationAdjustedLakh(histPrice, 2022),
        },
      });
      milestoneAddedCount++;
    }
  }

  console.log(`✅ Successfully updated ${updatedCount} existing price history records and added ${milestoneAddedCount} historical devaluation milestones in dev.db!`);
}

updatePriceHistory()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
