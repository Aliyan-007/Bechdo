import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const USERS = ["editor@rasta.pk", "admin@rasta.pk", "demo-user"];

async function updateSavedGarage() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 14: SAVED GARAGE SYSTEM AUDIT   ");
  console.log("=========================================================\n");

  const variants = await prisma.variant.findMany({
    where: {
      OR: [{ isPopular: true }, { isFeatured: true }],
    },
    take: 15,
  });

  console.log(`Auditing and populating Saved Garage bookmarks across ${variants.length} canonical variant ledgers...\n`);

  let totalFavoritesCreated = 0;
  for (let idx = 0; idx < variants.length; idx++) {
    const v = variants[idx];
    const user = USERS[idx % USERS.length];

    const existing = await prisma.favorite.findFirst({
      where: {
        variantId: v.id,
        userId: user,
      },
    });

    if (!existing) {
      await prisma.favorite.create({
        data: {
          variantId: v.id,
          userId: user,
        },
      });
      totalFavoritesCreated++;
    }
  }

  const totalInDb = await prisma.favorite.count();
  console.log(`✅ Successfully populated ${totalFavoritesCreated} new bookmarks in dev.db (Total verified garage favorites: ${totalInDb})!`);
}

updateSavedGarage()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
