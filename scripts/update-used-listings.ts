import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const CITIES = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"];
const LOCATIONS: Record<string, string[]> = {
  Karachi: ["Clifton, Karachi", "DHA Phase 6, Karachi", "Gulshan-e-Iqbal, Karachi", "PECHS, Karachi"],
  Lahore: ["DHA Phase 5, Lahore", "Gulberg III, Lahore", "Johar Town, Lahore", "Model Town, Lahore"],
  Islamabad: ["F-10 Markaz, Islamabad", "F-7/2, Islamabad", "DHA Phase 2, Islamabad", "Blue Area, Islamabad"],
  Faisalabad: ["D Ground, Faisalabad", "Peoples Colony, Faisalabad"],
  Rawalpindi: ["Saddar, Rawalpindi", "Bahria Town, Rawalpindi"],
};

const SELLER_TYPES = ["INDIVIDUAL", "AUTHORIZED_DEALER", "CERTIFIED_PARTNER"];
const INSPECTION_GRADES = ["A+", "A", "B", "Uninspected"];

async function updateUsedListings() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 11: USED MARKETPLACE AUDIT      ");
  console.log("=========================================================\n");

  const variants = await prisma.variant.findMany({
    include: {
      model: {
        include: { brand: true },
      },
    },
  });

  console.log(`Auditing and populating Used Car Marketplace classifieds across ${variants.length} verified variant ledgers...\n`);

  let totalListingsCreated = 0;
  for (const v of variants) {
    const existingCount = await prisma.usedListing.count({
      where: { variantId: v.id },
    });

    if (existingCount > 0) {
      totalListingsCreated += existingCount;
      continue;
    }

    // Generate 2 to 3 listings per variant
    const numListings = v.isPopular ? 3 : 2;
    for (let idx = 0; idx < numListings; idx++) {
      const city = CITIES[idx % CITIES.length];
      const locList = LOCATIONS[city] || ["Central Location"];
      const location = locList[idx % locList.length];
      const sellerType = SELLER_TYPES[idx % SELLER_TYPES.length];
      const grade = INSPECTION_GRADES[idx % INSPECTION_GRADES.length];

      // Calculate realistic used asking price
      const basePrice = v.priceMinLakh > 0 ? v.priceMinLakh : 15.0;
      const depreciation = idx === 0 ? 0.92 : idx === 1 ? 0.85 : 0.78;
      const askingPrice = Math.round(basePrice * depreciation * 10) / 10;
      const regYear = Math.max(v.releaseYear - (idx === 0 ? 0 : 1), 1990);
      const mileageKm = idx === 0 ? 18500 : idx === 1 ? 42000 : 68000;

      await prisma.usedListing.create({
        data: {
          variantId: v.id,
          title: `${v.model.brand.name} ${v.model.name} ${v.name} (${regYear})`,
          askingPriceLakh: askingPrice,
          mileageKm: mileageKm,
          registrationYear: regYear,
          registrationCity: city,
          assemblyStatus: v.marketStatus === "LOCAL_CKD" ? "Local CKD" : "CBU Import",
          inspectionGrade: grade,
          sellerName:
            sellerType === "AUTHORIZED_DEALER"
              ? `${v.model.brand.name} Authorized Dealership — ${city}`
              : sellerType === "CERTIFIED_PARTNER"
              ? `RASTA Certified Partner — ${city}`
              : `Private Seller (${city})`,
          sellerType: sellerType,
          sellerPhone: idx === 0 ? "0300-1234567" : idx === 1 ? "0321-7654321" : "0333-9876543",
          location: location,
          status: "ACTIVE",
          notes:
            grade === "A+"
              ? "100% original factory paint, full dealership service history available."
              : grade === "A"
              ? "Minor touch-ups on bumpers, engine and suspension in pristine condition."
              : "Standard family driven vehicle, clear documentation.",
        },
      });
      totalListingsCreated++;
    }
  }

  const totalInDb = await prisma.usedListing.count();
  console.log(`✅ Successfully populated ${totalListingsCreated} secondary market classifieds in dev.db (Total verified listings: ${totalInDb})!`);
}

updateUsedListings()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
