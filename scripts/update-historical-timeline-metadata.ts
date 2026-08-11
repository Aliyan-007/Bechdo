import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

function determineEventCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (
    text.includes("policy") ||
    text.includes("tariff") ||
    text.includes("adp") ||
    text.includes("duty") ||
    text.includes("tax") ||
    text.includes("gst") ||
    text.includes("concession")
  ) {
    return "TARIFF_POLICY";
  }
  if (
    text.includes("plant") ||
    text.includes("assembly") ||
    text.includes("founded") ||
    text.includes("joint venture") ||
    text.includes("established") ||
    text.includes("assembler") ||
    text.includes("imc") ||
    text.includes("atlas")
  ) {
    return "NEW_ASSEMBLER";
  }
  if (
    text.includes("devaluation") ||
    text.includes("crisis") ||
    text.includes("rupee") ||
    text.includes("pkr") ||
    text.includes("import ban") ||
    text.includes("restriction")
  ) {
    return "DEVALUATION_CRISIS";
  }
  if (
    text.includes("regulation") ||
    text.includes("standard") ||
    text.includes("euro") ||
    text.includes("safety") ||
    text.includes("emission")
  ) {
    return "REGULATORY";
  }
  return "LAUNCH_MILESTONE";
}

function determineRelatedSlug(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("corolla")) return "toy-corolla";
  if (text.includes("civic")) return "hon-civic";
  if (text.includes("alto")) return "suz-alto";
  if (text.includes("mehran")) return "suz-mehran";
  if (text.includes("khyber")) return "suz-khyber";
  if (text.includes("sportage")) return "kia-sportage";
  if (text.includes("fortuner")) return "toy-fortuner";
  if (text.includes("ora") || text.includes("good cat")) return "gwm-ora-03";
  if (text.includes("byd")) return "byd-atto3";
  if (text.includes("prefect")) return "ford-prefect-1953";
  return null;
}

async function updateHistoricalTimeline() {
  console.log("===================================================================");
  console.log("  RASTA PHASE 14 FEATURE 9: HISTORICAL TIMELINE SYSTEM AUDIT      ");
  console.log("===================================================================\n");

  const events = await prisma.historicalEvent.findMany();
  console.log(`Auditing and enriching ${events.length} historical timeline events across 8 decades...\n`);

  let updatedCount = 0;
  for (const ev of events) {
    const category = determineEventCategory(ev.title, ev.description);
    const related = determineRelatedSlug(ev.title, ev.description);

    await prisma.historicalEvent.update({
      where: { id: ev.id },
      data: {
        eventCategory: category,
        relatedSlug: related,
      },
    });
    updatedCount++;
  }

  // Ensure all 5 structured categories are present
  const policyEvent = await prisma.historicalEvent.findFirst({
    where: { eventCategory: "TARIFF_POLICY" },
  });
  if (!policyEvent) {
    await prisma.historicalEvent.create({
      data: {
        year: 2016,
        decade: "2010s",
        title: "Auto Development Policy (ADP 2016–21)",
        description: "Government introduces Greenfield and Brownfield incentives, attracting Kia, Hyundai, MG, and Changan to Pakistan.",
        brandName: "Kia",
        eventCategory: "TARIFF_POLICY",
      },
    });
  }

  const crisisEvent = await prisma.historicalEvent.findFirst({
    where: { eventCategory: "DEVALUATION_CRISIS" },
  });
  if (!crisisEvent) {
    await prisma.historicalEvent.create({
      data: {
        year: 2022,
        decade: "2020s",
        title: "PKR Devaluation & L/C Import Restriction Crisis",
        description: "State Bank restrictions on CKD kit imports and rapid currency devaluation cause unprecedented price hikes across all OEMs.",
        brandName: "Toyota",
        eventCategory: "DEVALUATION_CRISIS",
      },
    });
  }

  const regEvent = await prisma.historicalEvent.findFirst({
    where: { eventCategory: "REGULATORY" },
  });
  if (!regEvent) {
    await prisma.historicalEvent.create({
      data: {
        year: 2024,
        decade: "2020s",
        title: "National NEV & Euro 5 Emission Standard Enforcement",
        description: "Pakistan enforces Euro 5 emission standards and launches new electric vehicle regulatory frameworks for local assembly.",
        brandName: "BYD",
        eventCategory: "REGULATORY",
      },
    });
  }

  const totalAfter = await prisma.historicalEvent.count();
  console.log(`✅ Successfully enriched ${updatedCount} historical events with structured categories and verified ${totalAfter} total timeline milestones in dev.db!`);
}

updateHistoricalTimeline()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
