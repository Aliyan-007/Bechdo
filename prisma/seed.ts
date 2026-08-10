import fs from "fs";
import path from "path";
import { importCatalog, type CatalogImportItem } from "../src/lib/importer";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Starting Phase 6 Idempotent Database Seeding & UPSERT for RASTA...");

  const catalogPath = path.join(process.cwd(), "prisma", "data", "import-catalog.json");
  if (!fs.existsSync(catalogPath)) {
    throw new Error(`Catalog import file not found at ${catalogPath}. Run 'npx tsx scripts/generate-catalog.ts' first.`);
  }

  const items: CatalogImportItem[] = JSON.parse(
    fs.readFileSync(catalogPath, "utf-8")
  );

  console.log(`Loaded ${items.length} vehicle records from prisma/data/import-catalog.json...`);

  // Run our structured Import Pipeline with UPSERT support
  const summary = await importCatalog(items, { updateExisting: true });

  console.log("========================================");
  console.log("       RASTA DATA IMPORT SUMMARY        ");
  console.log("========================================");
  console.log(`Total Submitted       : ${summary.totalSubmitted}`);
  console.log(`Successfully Imported : ${summary.imported}`);
  console.log(`Successfully Updated  : ${summary.updated}`);
  console.log(`Skipped Duplicates    : ${summary.skippedDuplicates}`);
  console.log(`Errors Encountered    : ${summary.errors.length}`);
  console.log("========================================");

  if (summary.errors.length > 0) {
    console.warn("First 5 import errors:", summary.errors.slice(0, 5));
  }

  // Ensure 26 Authoritative Historical Timeline Events exist for /history across all 8 decades
  const historyEvents = [
    {
      year: 1953,
      decade: "1950s",
      title: "First Post-Independence Fleet",
      description:
        "Early imports of British and American automobiles establish Pakistan's initial urban transport infrastructure in Karachi and Lahore.",
      brandName: "Ford",
    },
    {
      year: 1955,
      decade: "1950s",
      title: "West German Beetle Import Wave",
      description:
        "Volkswagen Beetle Type 1 imports arrive under bilateral trade agreements, becoming a familiar sight among urban professionals.",
      brandName: "Volkswagen",
    },
    {
      year: 1962,
      decade: "1960s",
      title: "Early Assembly Plants & Datsun Era",
      description:
        "Local assembly initiatives begin alongside the introduction of early Datsun sedans and Japanese commercial pickups.",
      brandName: "Nissan",
    },
    {
      year: 1965,
      decade: "1960s",
      title: "First Japanese Passenger Car Wave",
      description:
        "Toyota Corona T40 and Publica compact sedans enter Karachi, beginning the long-term Japanese dominance of Pakistani roads.",
      brandName: "Toyota",
    },
    {
      year: 1972,
      decade: "1970s",
      title: "Land Cruiser FJ40 4x4 Fleet Adoption",
      description:
        "The Toyota Land Cruiser FJ40 is widely adopted by government agencies, agricultural estates, and rural development projects.",
      brandName: "Toyota",
    },
    {
      year: 1974,
      decade: "1970s",
      title: "Datsun Sunny B110 Commercial Motorization",
      description:
        "Datsun 1200 sedans and pickups become ubiquitous across intercity transit and small-business logistics.",
      brandName: "Nissan",
    },
    {
      year: 1983,
      decade: "1980s",
      title: "The Suzuki FX Revolution",
      description:
        "Pak Suzuki begins local assembly of the 800cc FX hatchback, transforming personal car ownership in Pakistan and democratizing mobility.",
      brandName: "Suzuki",
    },
    {
      year: 1984,
      decade: "1980s",
      title: "Toyota Corolla E80 Import Era",
      description:
        "The 5th generation E80 'Boxy Corolla' builds Toyota's reputation for unbreakable durability across Pakistani roads.",
      brandName: "Toyota",
    },
    {
      year: 1986,
      decade: "1980s",
      title: "Suzuki Potohar SJ410 4x4 Assembly",
      description:
        "Pak Suzuki introduces the locally assembled Potohar 1.0L Jeep, which remains in continuous production for 20 years.",
      brandName: "Suzuki",
    },
    {
      year: 1989,
      decade: "1980s",
      title: "Indus Motor Company Founded",
      description:
        "A joint venture between House of Habib, Toyota, and Toyota Tsusho brings locally assembled Corolla sedans to Pakistan.",
      brandName: "Toyota",
    },
    {
      year: 1989,
      decade: "1980s",
      title: "Suzuki Mehran 30-Year Reign Begins",
      description:
        "Pak Suzuki launches the 800cc Mehran VX/VXR, which goes on to become Pakistan's highest-selling hatchback in history (1989–2019).",
      brandName: "Suzuki",
    },
    {
      year: 1993,
      decade: "1990s",
      title: "First Locally Assembled Indus Corolla E100",
      description:
        "Indus Motor Company rolls out the E100 Corolla XE/GL/2.0D from Port Qasim, establishing local CKD executive standards.",
      brandName: "Toyota",
    },
    {
      year: 1994,
      decade: "1990s",
      title: "Honda Atlas Cars Pakistan Enters",
      description:
        "Honda Atlas Cars begins production of the 5th generation Civic SR4 ('Dolphin') sedan in Lahore.",
      brandName: "Honda",
    },
    {
      year: 1996,
      decade: "1990s",
      title: "EK Civic VTi Oriel VTEC Launch",
      description:
        "Honda Atlas introduces the 6th gen EK Civic VTi Oriel, bringing VTEC performance and electric sunroofs to Pakistani enthusiasts.",
      brandName: "Honda",
    },
    {
      year: 1997,
      decade: "1990s",
      title: "Honda City SX8 NEO Launch",
      description:
        "Honda Atlas launches the 1.3/1.5 EXi City SX8 sedan, creating a dedicated entry-level subcompact sedan segment.",
      brandName: "Honda",
    },
    {
      year: 2000,
      decade: "2000s",
      title: "Suzuki Cultus MK2 Family Dominance",
      description:
        "Pak Suzuki introduces the 1000cc Cultus hatchback, which serves for 17 continuous years as the middle-class family car of choice.",
      brandName: "Suzuki",
    },
    {
      year: 2001,
      decade: "2000s",
      title: "9th Gen Corolla E120 & 2.0D Saloon Era",
      description:
        "Indus Motor Company launches the E120 Corolla, introducing the iconic XLi/GLi badges and the long-distance 2.0D diesel saloon.",
      brandName: "Toyota",
    },
    {
      year: 2003,
      decade: "2000s",
      title: "Honda City i-DSI Twin-Spark Fuel Efficiency",
      description:
        "The 4th gen City i-DSI sets national urban fuel economy benchmarks with 16 km/l city mileage.",
      brandName: "Honda",
    },
    {
      year: 2005,
      decade: "2000s",
      title: "Daihatsu Cuore Automatic Pioneer",
      description:
        "Indus Motor Company assembles the Daihatsu Cuore CX/CL Automatic, creating Pakistan's first affordable automatic hatchback.",
      brandName: "Daihatsu",
    },
    {
      year: 2006,
      decade: "2000s",
      title: "Honda Civic FD 'Reborn' 1.8 i-VTEC",
      description:
        "The 8th gen Civic 'Reborn' launches with an R18 engine and futuristic digital optitron speedometer.",
      brandName: "Honda",
    },
    {
      year: 2008,
      decade: "2000s",
      title: "10th Gen Corolla E140 Sales Record",
      description:
        "Indus Motor Company launches the E140 Corolla, which achieves record-breaking national sales volumes.",
      brandName: "Toyota",
    },
    {
      year: 2014,
      decade: "2010s",
      title: "Launch of 11th Gen Corolla (E170)",
      description:
        "Toyota launches the E170 Corolla Altis Grande, which becomes Pakistan's highest-selling sedan generation in history.",
      brandName: "Toyota",
    },
    {
      year: 2016,
      decade: "2010s",
      title: "Civic X FC Turbocharged Local Assembly",
      description:
        "Honda Atlas introduces the 10th gen Civic X 1.5 RS Turbo, bringing turbocharged powertrains to mainstream CKD assembly.",
      brandName: "Honda",
    },
    {
      year: 2019,
      decade: "2010s",
      title: "The Crossover Disruption: Kia Sportage",
      description:
        "Lucky Motor Corporation introduces the locally assembled Kia Sportage, shattering the sedan monopoly and triggering a nationwide SUV craze.",
      brandName: "Kia",
    },
    {
      year: 2021,
      decade: "2020s",
      title: "ADP 2016-21 & Chinese Automotive Wave",
      description:
        "Changan Alsvin, MG HS, Haval H6, and Hyundai Tucson diversify consumer choice across sedans and crossovers.",
      brandName: "Changan",
    },
    {
      year: 2022,
      decade: "2020s",
      title: "Peugeot & Chery CKD Crossover Expansion",
      description:
        "Lucky Motor Corp and Gandhara Nissan introduce locally assembled Peugeot 2008 and Chery Tiggo 8 Pro crossovers.",
      brandName: "Peugeot",
    },
    {
      year: 2023,
      decade: "2020s",
      title: "Hybrid Adoption Surge (Corolla Cross & Haval H6 HEV)",
      description:
        "Indus Motor Company and Sazgar Engineering launch locally assembled hybrid crossovers, marking Pakistan's mainstream transition toward electrified powertrains.",
      brandName: "Toyota",
    },
    {
      year: 2024,
      decade: "2020s",
      title: "BYD Official NEV Entry (Atto 3 & Sealion 6 DM-i)",
      description:
        "Global NEV leader BYD officially enters Pakistan in partnership with Mega Conglomerate, launching the Atto 3 EV and Sealion 6 DM-i Super Hybrid.",
      brandName: "BYD",
    },
    {
      year: 2026,
      decade: "2020s",
      title: "RASTA 36-Manufacturer National Automotive Archive",
      description:
        "RASTA tracks over 160+ verified variants across 36 manufacturers, preserving 8 decades of Pakistani automotive history.",
      brandName: "RASTA",
    },
  ];

  for (const ev of historyEvents) {
    const evSlug = `ev-${ev.year}-${ev.decade}-${ev.brandName?.toLowerCase() || "rasta"}`.replace(/[^a-z0-9-]+/g, "-");
    await prisma.historicalEvent.upsert({
      where: { id: evSlug },
      create: {
        id: evSlug,
        year: ev.year,
        decade: ev.decade,
        title: ev.title,
        description: ev.description,
        brandName: ev.brandName,
        imageUrl: null,
      },
      update: {
        title: ev.title,
        description: ev.description,
        brandName: ev.brandName,
      },
    });
  }

  console.log(`Verified ${historyEvents.length} historical milestone events for the 1950s-2020s timeline.`);
  console.log("Database seeding completed successfully! ✨");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
