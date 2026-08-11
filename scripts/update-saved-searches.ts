import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const SAVED_SEARCHES = [
  {
    name: "Toyota SUVs under 150 Lakh",
    query: "Fortuner",
    bodyType: "SUV",
    brandName: "Toyota",
    priceMaxLakh: 150.0,
  },
  {
    name: "660cc Kei Cars with AGS",
    query: "Alto",
    bodyType: "Hatchback",
    brandName: "Suzuki",
    priceMaxLakh: 35.0,
  },
  {
    name: "Haval HEV Hybrid Models",
    query: "H6 HEV",
    bodyType: "SUV",
    brandName: "Haval",
    fuelType: "Hybrid",
  },
  {
    name: "Honda Executive Sedans",
    query: "Civic RS",
    bodyType: "Sedan",
    brandName: "Honda",
  },
  {
    name: "BEV Pure Electric Cars",
    query: "Ora",
    fuelType: "Electric",
    priceMaxLakh: 120.0,
  },
];

async function updateSavedSearchesAndAlerts() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 15: SAVED SEARCHES & ALERTS     ");
  console.log("=========================================================\n");

  // 1. Populate SavedSearches
  let searchCount = 0;
  for (const item of SAVED_SEARCHES) {
    const existing = await prisma.savedSearch.findFirst({
      where: {
        name: item.name,
        userId: "editor@rasta.pk",
      },
    });
    if (!existing) {
      await prisma.savedSearch.create({
        data: {
          userId: "editor@rasta.pk",
          name: item.name,
          query: item.query,
          bodyType: item.bodyType || null,
          fuelType: item.fuelType || null,
          priceMaxLakh: item.priceMaxLakh || null,
          brandName: item.brandName || null,
          notifyOnChange: true,
        },
      });
      searchCount++;
    }
  }

  // 2. Populate PriceAlerts
  const variants = await prisma.variant.findMany({
    where: {
      OR: [{ isPopular: true }, { isFeatured: true }],
    },
    take: 25,
  });

  let alertCount = 0;
  for (const v of variants) {
    const existing = await prisma.priceAlert.findFirst({
      where: {
        variantId: v.id,
        userId: "editor@rasta.pk",
      },
    });

    if (!existing && v.priceMinLakh > 0) {
      const currentPrice = v.priceMinLakh;
      const targetPrice = Math.round(currentPrice * 0.95 * 10) / 10; // 5% price drop threshold
      await prisma.priceAlert.create({
        data: {
          variantId: v.id,
          userId: "editor@rasta.pk",
          userEmail: "editor@rasta.pk",
          currentPriceLakh: currentPrice,
          targetPriceLakh: targetPrice,
          status: "ACTIVE",
          notes: `Notify when ex-factory price or dealer ask drops to ${targetPrice} Lakh.`,
        },
      });
      alertCount++;
    }
  }

  const totalSearches = await prisma.savedSearch.count();
  const totalAlerts = await prisma.priceAlert.count();
  console.log(`✅ Successfully seeded ${searchCount} saved searches and ${alertCount} active price alerts in dev.db:`);
  console.log(`   - Total Saved Searches in archive: ${totalSearches}`);
  console.log(`   - Total Active Price Alerts in archive: ${totalAlerts}\n`);
}

updateSavedSearchesAndAlerts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
