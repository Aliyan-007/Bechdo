import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const OWNER_NAMES = [
  "Ahmed Khan",
  "Usman Tariq",
  "Faisal Raza",
  "Hamza Siddiqui",
  "Bilal Sheikh",
  "Dr. Kamran Ali",
  "Saad Mehmood",
  "Imran Qureshi",
];

const CITIES = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"];

async function updateReviewsMetadata() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 16: OWNER REVIEWS & RELIABILITY ");
  console.log("=========================================================\n");

  const variants = await prisma.variant.findMany({
    include: {
      model: {
        include: { brand: true },
      },
    },
  });

  console.log(`Auditing and populating Pakistani owner reviews across ${variants.length} verified variant ledgers...\n`);

  let totalReviewsCreated = 0;

  for (let idx = 0; idx < variants.length; idx++) {
    const v = variants[idx];
    const existingCount = await prisma.review.count({
      where: { variantId: v.id },
    });

    if (existingCount > 0) {
      totalReviewsCreated += existingCount;
      continue;
    }

    const numReviews = v.isPopular ? 3 : 2;
    const isHybridOrEV = v.fuelType === "Hybrid" || v.fuelType === "Electric";
    const isSUV = v.bodyType === "SUV" || v.bodyType === "Pickup";

    for (let i = 0; i < numReviews; i++) {
      const owner = OWNER_NAMES[(idx + i) % OWNER_NAMES.length];
      const city = CITIES[(idx + i) % CITIES.length];

      const fuelScore = isHybridOrEV ? 4.9 : isSUV ? 3.9 : 4.6;
      const acScore = i === 0 ? 4.8 : 4.6;
      const suspScore = isSUV ? 4.8 : 4.4;
      const resaleScore = v.isPopular ? 4.9 : 4.3;
      const overall = Math.round(((fuelScore + acScore + suspScore + resaleScore) / 4) * 10) / 10;

      await prisma.review.create({
        data: {
          variantId: v.id,
          userName: `${owner} (${city})`,
          userCity: city,
          ratingOverall: overall,
          ratingFuel: fuelScore,
          ratingAC: acScore,
          ratingSuspension: suspScore,
          ratingResale: resaleScore,
          title:
            i === 0
              ? `Exceptional AC cooling & suspension durability in ${city} traffic`
              : `Long-term 2-year ownership review for ${v.model.name}`,
          comment:
            i === 0
              ? `Driven over 25,000 km in ${city}. The air conditioning cools instantly even in 45°C summer heat, and suspension absorbs potholes effortlessly. Ex-factory price is well justified.`
              : `Reliable performance and nationwide spare parts availability across authorized dealerships. Resale value remains extremely strong in the secondary market.`,
          ownershipYears: i === 0 ? 2 : 3,
          isVerifiedOwner: true,
        },
      });
      totalReviewsCreated++;
    }
  }

  const totalInDb = await prisma.review.count();
  console.log(`✅ Successfully populated ${totalReviewsCreated} Pakistani owner reviews in dev.db (Total verified reviews: ${totalInDb})!`);
}

updateReviewsMetadata()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
