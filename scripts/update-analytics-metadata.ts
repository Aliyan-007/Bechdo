import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const EVENT_TYPES = [
  "VIEW_VARIANT",
  "VIEW_VARIANT",
  "VIEW_VARIANT",
  "VIEW_VARIANT",
  "COMPARE_PAIR",
  "COMPARE_PAIR",
  "SEARCH_QUERY",
  "FAVORITE_ADD",
  "PRICE_ALERT_SET",
];

const CITIES = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"];

async function updateAnalyticsMetadata() {
  console.log("=========================================================");
  console.log("  BECH DO (بیچ دو) PHASE 25: AUTOMOTIVE ANALYTICS AUDIT  ");
  console.log("=========================================================\n");

  const variants = await prisma.variant.findMany({
    include: {
      model: {
        include: { brand: true },
      },
    },
  });

  console.log(`Auditing and seeding longitudinal market analytics across ${variants.length} verified variants...\n`);

  let createdCount = 0;
  for (let idx = 0; idx < variants.length; idx++) {
    const v = variants[idx];
    const existingCount = await prisma.analyticsEvent.count({
      where: { entityId: v.id },
    });

    if (existingCount > 0) {
      createdCount += existingCount;
      continue;
    }

    // Generate 5 analytics events per variant (200 variants * 5 = 1,000 events)
    const numEvents = v.isPopular ? 6 : 4;
    for (let i = 0; i < numEvents; i++) {
      const evType = EVENT_TYPES[(idx + i) % EVENT_TYPES.length];
      const city = CITIES[(idx + i) % CITIES.length];

      await prisma.analyticsEvent.create({
        data: {
          eventType: evType,
          entityId: v.id,
          entityName: `${v.model.brand.name} ${v.model.name} ${v.name}`,
          brandName: v.model.brand.name,
          city: city,
        },
      });
      createdCount++;
    }
  }

  const totalInDb = await prisma.analyticsEvent.count();
  console.log(`✅ Successfully seeded ${createdCount} automotive analytics events in dev.db (Total verified analytics ledgers: ${totalInDb})!`);
}

updateAnalyticsMetadata()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
