import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updateInspectionsMetadata() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 17: INSPECTION & AUCTION SHEETS ");
  console.log("=========================================================\n");

  const listings = await prisma.usedListing.findMany({
    include: {
      variant: true,
      inspectionReport: true,
    },
  });

  console.log(`Auditing and generating 150-Point Technical Inspection Reports across ${listings.length} secondary classifieds...\n`);

  let reportsCreated = 0;

  for (const l of listings) {
    if (l.inspectionReport) {
      reportsCreated++;
      continue;
    }

    const isCBU = l.assemblyStatus.includes("CBU") || l.variant.marketStatus === "CBU";
    const grade = l.inspectionGrade;

    const overall =
      isCBU && grade === "A+"
        ? "4.5 Grade B/B"
        : isCBU && grade === "A"
        ? "4.0 Grade B/B"
        : grade;

    const auctionSheet = isCBU
      ? `${overall} (USS Tokyo / JAAI Export Verified)`
      : null;

    await prisma.inspectionReport.create({
      data: {
        listingId: l.id,
        variantId: l.variantId,
        overallGrade: overall,
        exteriorGrade: grade === "A+" ? "A+" : "A",
        interiorGrade: grade === "A+" ? "A+" : "A",
        engineGrade: "A+",
        suspensionGrade: "A",
        frameCondition: "ORIGINAL",
        auctionSheetGrade: auctionSheet,
        inspectionDate: "2026-08-01",
        inspectorName: "RASTA 150-Point Certified Inspection Center",
        notes: `Engine compression test: 100% across all cylinders. Structural frame members original and untouched. OBD-II diagnostic scan clear of all DTC error codes.`,
      },
    });
    reportsCreated++;
  }

  const totalInDb = await prisma.inspectionReport.count();
  console.log(`✅ Successfully generated ${reportsCreated} inspection reports in dev.db (Total verified inspection ledgers: ${totalInDb})!`);
}

updateInspectionsMetadata()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
