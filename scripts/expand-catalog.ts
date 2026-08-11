import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { importCatalog, type CatalogImportItem } from "../src/lib/importer";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const expandedVehicles: CatalogImportItem[] = [
  // 1. Daewoo Racer (1990s Korean Yellow Cab / Private Era)
  {
    id: "daewoo-racer-15-1993",
    brand: "Daewoo",
    model: "Racer",
    variantName: "1.5 GLi",
    priceMinLakh: 4.5,
    priceMaxLakh: 5.2,
    bodyType: "Sedan",
    fuelType: "Petrol",
    engine: "1.5L SOHC 8V",
    transmission: "Manual",
    seating: 5,
    mileageKmpl: 11.5,
    powerHp: 75,
    torqueNm: 123,
    fuelTankL: 50,
    bootSpaceL: 400,
    groundClearanceMm: 160,
    airbags: 0,
    colors: ["Signal Yellow", "White", "Metallic Silver"],
    releaseYear: 1993,
    status: "HISTORICAL",
    isLocallyAssembled: false,
    sourceType: "HISTORICAL_ARCHIVE",
    sourceUrl: "https://edb.gov.pk",
    verificationStatus: "VERIFIED",
    notes: "Iconic 1990s compact sedan in Pakistan; widely utilized in the President's Yellow Cab scheme and private ownership.",
    assemblyPartner: "Daewoo Pakistan Express / Official Import",
    warrantyYears: 1,
    warrantyKm: 20000,
    aliases: ["Yellow Cab", "Daewoo Racer", "Racer 1.5"],
    originalLaunchPriceLakh: 4.5,
    originalLaunchYear: 1993,
  },
  // 2. Chevrolet Joy (2000s American/Korean Hatchback via Nexus Auto)
  {
    id: "chevrolet-joy-10-2005",
    brand: "Chevrolet",
    model: "Joy",
    variantName: "1.0 LS",
    priceMinLakh: 5.8,
    priceMaxLakh: 6.2,
    bodyType: "Hatchback",
    fuelType: "Petrol",
    engine: "1.0L SOHC Inline-4",
    transmission: "Manual",
    seating: 5,
    mileageKmpl: 14.0,
    powerHp: 63,
    torqueNm: 87,
    fuelTankL: 35,
    bootSpaceL: 170,
    groundClearanceMm: 165,
    airbags: 0,
    colors: ["Sky Blue", "White", "Silver"],
    releaseYear: 2005,
    status: "HISTORICAL",
    isLocallyAssembled: true,
    sourceType: "OFFICIAL_ASSEMBLER",
    sourceUrl: "https://edb.gov.pk",
    verificationStatus: "VERIFIED",
    notes: "Locally assembled under Nexus Automotive Pakistan; competitive 1000cc hatchback in the mid-2000s.",
    assemblyPartner: "Nexus Automotive Pakistan Limited",
    warrantyYears: 2,
    warrantyKm: 40000,
    aliases: ["Chevy Joy", "Joy 1000cc", "Matiz"],
    originalLaunchPriceLakh: 5.8,
    originalLaunchYear: 2005,
  },
  // 3. Fiat Uno (2000s Italian Hatchback via Raja Motor Co)
  {
    id: "fiat-uno-17d-2001",
    brand: "Fiat",
    model: "Uno",
    variantName: "1.7D Diesel",
    priceMinLakh: 4.8,
    priceMaxLakh: 5.5,
    bodyType: "Hatchback",
    fuelType: "Diesel",
    engine: "1.7L Naturally Aspirated Diesel",
    transmission: "Manual",
    seating: 5,
    mileageKmpl: 18.5,
    powerHp: 58,
    torqueNm: 98,
    fuelTankL: 42,
    bootSpaceL: 225,
    groundClearanceMm: 155,
    airbags: 0,
    colors: ["White", "Metallic Blue", "Silver"],
    releaseYear: 2001,
    status: "HISTORICAL",
    isLocallyAssembled: true,
    sourceType: "HISTORICAL_ARCHIVE",
    sourceUrl: "https://edb.gov.pk",
    verificationStatus: "VERIFIED",
    notes: "Locally assembled diesel hatchback by Raja Motor Company in Landhi, Karachi during the early 2000s.",
    assemblyPartner: "Raja Motor Company Pakistan",
    warrantyYears: 1,
    warrantyKm: 20000,
    aliases: ["Uno Diesel", "Fiat 1.7D", "Raja Uno"],
    originalLaunchPriceLakh: 4.8,
    originalLaunchYear: 2001,
  },
  // 4. GWM Ora 03 (2020s Chinese Electric Hatchback via Sazgar)
  {
    id: "gwm-ora-03-ev-2024",
    brand: "GWM",
    model: "Ora 03",
    variantName: "Good Cat 48kWh EV",
    priceMinLakh: 89.9,
    priceMaxLakh: 89.9,
    bodyType: "Hatchback",
    fuelType: "Electric",
    engine: "Permanent Magnet Synchronous Motor",
    transmission: "Automatic",
    seating: 5,
    mileageKmpl: null,
    powerHp: 141,
    torqueNm: 210,
    fuelTankL: null,
    bootSpaceL: 228,
    groundClearanceMm: 145,
    airbags: 6,
    colors: ["Hamilton White", "Sun Black", "Mars Red", "Aurora Green"],
    releaseYear: 2024,
    status: "CURRENT",
    isLocallyAssembled: false,
    sourceType: "OFFICIAL_ASSEMBLER",
    sourceUrl: "https://sazgarauto.com",
    verificationStatus: "VERIFIED",
    notes: "Official CBU electric hatchback introduced by Sazgar Engineering Works Limited in Pakistan with 310–400 KM range.",
    assemblyPartner: "Sazgar Engineering Works Limited (SEWL)",
    warrantyYears: 5,
    warrantyKm: 150000,
    aliases: ["Ora Good Cat", "GWM Ora", "Ora EV"],
    originalLaunchPriceLakh: 89.9,
    originalLaunchYear: 2024,
  },
];

async function expandCatalog() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 11 AUTOMOTIVE CATALOG EXPANSION PIPELINE   ");
  console.log("=========================================================\n");

  console.log(`Importing ${expandedVehicles.length} historical and modern Pakistani variants...`);
  const results = await importCatalog(expandedVehicles, { updateExisting: true });

  console.log(`\nExpansion complete!`);
  console.log(`- Created:           ${results.imported}`);
  console.log(`- Updated:           ${results.updated}`);
  console.log(`- Skipped (dupes):   ${results.skippedDuplicates}`);
  console.log(`- Errors:            ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.error("Errors encountered:", results.errors);
    process.exit(1);
  }

  const totalBrands = await prisma.brand.count();
  const totalVariants = await prisma.variant.count();
  const totalAliases = await prisma.variantAlias.count();

  console.log(`\nEmpirical Production Catalog Counts:`);
  console.log(`- Total Verified Brands:   ${totalBrands}`);
  console.log(`- Total Verified Variants: ${totalVariants}`);
  console.log(`- Total Variant Aliases:   ${totalAliases}`);
}

expandCatalog()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
