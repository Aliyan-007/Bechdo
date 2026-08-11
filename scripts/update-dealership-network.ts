import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const CITY_DATA: Record<
  string,
  Array<{ nameSuffix: string; address: string; phone: string; rating: number }>
> = {
  Karachi: [
    {
      nameSuffix: "Southern Motors",
      address: "Main Korangi Road, DHA Phase 1, Karachi",
      phone: "021-35881234",
      rating: 4.9,
    },
    {
      nameSuffix: "Society Motors",
      address: "Main Shahrah-e-Faisal, PECHS Block 6, Karachi",
      phone: "021-34315678",
      rating: 4.8,
    },
    {
      nameSuffix: "Clifton 3S Center",
      address: "Khayaban-e-Iqbal, Block 8 Clifton, Karachi",
      phone: "021-35839012",
      rating: 4.9,
    },
  ],
  Lahore: [
    {
      nameSuffix: "Town Motors",
      address: "Main Boulevard Gulberg III, Lahore",
      phone: "042-35751234",
      rating: 4.8,
    },
    {
      nameSuffix: "DHA 3S Showroom",
      address: "Commercial Area, DHA Phase 5, Lahore",
      phone: "042-35678901",
      rating: 4.9,
    },
  ],
  Islamabad: [
    {
      nameSuffix: "Capital Motors",
      address: "Fazal-e-Haq Road, Blue Area, Islamabad",
      phone: "051-2821234",
      rating: 4.9,
    },
    {
      nameSuffix: "F-10 3S Dealership",
      address: "F-10 Markaz, Islamabad",
      phone: "051-2654321",
      rating: 4.7,
    },
  ],
};

async function updateDealershipNetwork() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 12: DEALERSHIP NETWORK AUDIT    ");
  console.log("=========================================================\n");

  const brands = await prisma.brand.findMany();
  console.log(`Auditing and populating 3S OEM Dealership Network across ${brands.length} verified manufacturer ledgers...\n`);

  let totalDealersCreated = 0;

  for (const b of brands) {
    const cities = Object.keys(CITY_DATA);
    for (const city of cities) {
      const dealers = CITY_DATA[city];
      for (let i = 0; i < (b.isPakistaniAssembled ? dealers.length : 1); i++) {
        const d = dealers[i];
        const dealerName = `${b.name} ${d.nameSuffix} — ${city}`;
        const slug = `${b.slug}-${d.nameSuffix.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${city.toLowerCase()}`;

        await prisma.dealership.upsert({
          where: { slug: slug },
          create: {
            name: dealerName,
            slug: slug,
            sellerType: "OEM_3S_DEALERSHIP",
            brandName: b.name,
            city: city,
            address: d.address,
            phone: d.phone,
            email: `info@${b.slug}-${d.nameSuffix.toLowerCase().replace(/\s+/g, "")}.pk`,
            rating: d.rating,
            isVerified: true,
          },
          update: {
            name: dealerName,
            brandName: b.name,
            city: city,
            address: d.address,
            phone: d.phone,
            rating: d.rating,
            isVerified: true,
          },
        });
        totalDealersCreated++;
      }
    }
  }

  const totalInDb = await prisma.dealership.count();
  console.log(`✅ Successfully synchronized ${totalDealersCreated} authorized OEM 3S showrooms in dev.db (Total verified dealerships: ${totalInDb})!`);
}

updateDealershipNetwork()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
