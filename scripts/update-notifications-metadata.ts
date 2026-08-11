import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const NOTIFICATIONS = [
  {
    userId: "editor@rasta.pk",
    title: "Price Drop Alert Triggered",
    message: "Toyota Corolla Altis Grande is now listed at 68.0 Lakh PKR (within your 5% target threshold).",
    type: "PRICE_ALERT",
    linkUrl: "/cars/toyota/corolla/toy-corolla",
    isRead: false,
  },
  {
    userId: "editor@rasta.pk",
    title: "New EV Added to BECH DO Catalog",
    message: "BYD Atto 3 EV and Ora 03 EV are now live with official CBU import pricing and battery specifications.",
    type: "NEW_MODEL",
    linkUrl: "/cars/byd/atto-3/byd-atto3",
    isRead: false,
  },
  {
    userId: "editor@rasta.pk",
    title: "Correction Report Resolved",
    message: "Your reported price correction for Honda Civic RS Turbo has been verified and applied to the catalog.",
    type: "CORRECTION_RESOLVED",
    linkUrl: "/cars/honda/civic/hon-civic",
    isRead: true,
  },
  {
    userId: "editor@rasta.pk",
    title: "BECH DO (بیچ دو) Marketplace Update",
    message: "477 verified secondary classifieds and 216 3S OEM showrooms synchronized across Karachi, Lahore, and Islamabad.",
    type: "SYSTEM",
    linkUrl: "/cars",
    isRead: true,
  },
  {
    userId: "demo-user",
    title: "Welcome to BECH DO (بیچ دو)",
    message: "Explore 200 verified variants, 8 decades of automotive history, and secondary marketplace listings.",
    type: "SYSTEM",
    linkUrl: "/",
    isRead: false,
  },
];

async function updateNotificationsMetadata() {
  console.log("=========================================================");
  console.log("  BECH DO (بیچ دو) PHASE 24: NOTIFICATIONS SYSTEM AUDIT  ");
  console.log("=========================================================\n");

  let count = 0;
  for (const item of NOTIFICATIONS) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId: item.userId,
        title: item.title,
      },
    });

    if (!existing) {
      await prisma.notification.create({
        data: item,
      });
      count++;
    }
  }

  const totalInDb = await prisma.notification.count();
  console.log(`✅ Successfully seeded ${count} notifications in dev.db (Total verified notifications: ${totalInDb})!`);
}

updateNotificationsMetadata()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
