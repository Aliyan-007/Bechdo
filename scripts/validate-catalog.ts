import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function validateCatalog() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 12 AUTOMATED CATALOG VALIDATION PIPELINE   ");
  console.log("=========================================================\n");

  let errorCount = 0;
  let passCount = 0;

  // 1. Structural Checks (Orphan checks)
  const variants = await prisma.variant.findMany({
    include: {
      model: { include: { brand: true } },
      specification: true,
      pakAvailability: true,
      priceHistories: true,
      images: true,
      aliases: true,
      evidences: { include: { source: true } },
    },
  });

  console.log(`Auditing ${variants.length} total variants in dev.db for structural & logical integrity...\n`);

  for (const v of variants) {
    // Check 1: Variant belongs to model and brand
    if (!v.model || !v.model.brand) {
      console.error(`[ERROR] Orphan variant '${v.id}' has missing model or brand relation!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 2: Specification 1:1 relation exists
    if (!v.specification) {
      console.error(`[ERROR] Variant '${v.id}' is missing 1:1 Specification record!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 3: At least 4 images exist
    if (v.images.length < 4) {
      console.error(`[ERROR] Variant '${v.id}' has ${v.images.length} images (minimum 4 required)!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 4: No impossible release years (1950 - 2030)
    if (v.releaseYear < 1950 || v.releaseYear > 2030) {
      console.error(`[ERROR] Variant '${v.id}' has impossible releaseYear '${v.releaseYear}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 5: No negative prices
    if (v.priceMinLakh < 0 || v.priceMaxLakh < 0) {
      console.error(`[ERROR] Variant '${v.id}' has negative price range (${v.priceMinLakh} - ${v.priceMaxLakh})!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 6: Strict 3-Concept Decoupling Status Enums
    const validStatuses = ["CURRENT", "DISCONTINUED", "HISTORICAL", "UPCOMING"];
    if (!validStatuses.includes(v.status)) {
      console.error(`[ERROR] Variant '${v.id}' has invalid status '${v.status}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    const validMarketStatuses = ["LOCAL_CKD", "CBU", "PRIVATE_IMPORT", "HISTORICAL_PRESENCE", "OFFICIAL_MARKET"];
    if (!validMarketStatuses.includes(v.marketStatus)) {
      console.error(`[ERROR] Variant '${v.id}' has invalid marketStatus '${v.marketStatus}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    const validPubStatuses = ["DRAFT", "RESEARCH", "REVIEW", "PUBLISHED", "ARCHIVED"];
    if (!validPubStatuses.includes(v.publicationStatus)) {
      console.error(`[ERROR] Variant '${v.id}' has invalid publicationStatus '${v.publicationStatus}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    const validConfidence = ["VERIFIED", "PARTIALLY_VERIFIED", "ESTIMATED", "UNVERIFIED", "CONFLICTING"];
    if (!validConfidence.includes(v.confidenceLevel)) {
      console.error(`[ERROR] Variant '${v.id}' has invalid confidenceLevel '${v.confidenceLevel}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 7: Evidences reference valid Sources
    for (const ev of v.evidences) {
      if (!ev.source) {
        console.error(`[ERROR] VehicleEvidence '${ev.id}' references missing Source ID '${ev.sourceId}'!`);
        errorCount++;
      } else {
        passCount++;
      }
    }
  }

  // 2. Orphan checks across standalone tables
  const validVariantIds = new Set(variants.map((v) => v.id));

  const allAliases = await prisma.variantAlias.findMany();
  const orphanAliases = allAliases.filter((a) => !validVariantIds.has(a.variantId));
  if (orphanAliases.length > 0) {
    console.error(`[ERROR] Found ${orphanAliases.length} orphan VariantAlias records!`);
    errorCount++;
  } else {
    passCount++;
  }

  const allSpecs = await prisma.specification.findMany();
  const orphanSpecs = allSpecs.filter((s) => !validVariantIds.has(s.variantId));
  if (orphanSpecs.length > 0) {
    console.error(`[ERROR] Found ${orphanSpecs.length} orphan Specification records!`);
    errorCount++;
  } else {
    passCount++;
  }

  const allImages = await prisma.image.findMany();
  const orphanImages = allImages.filter((i) => !validVariantIds.has(i.variantId));
  if (orphanImages.length > 0) {
    console.error(`[ERROR] Found ${orphanImages.length} orphan Image records!`);
    errorCount++;
  } else {
    passCount++;
  }

  console.log(`=========================================================`);
  console.log(`  VALIDATION SUMMARY: ${passCount} CHECKS PASSED | ${errorCount} ERRORS  `);
  console.log(`=========================================================`);

  if (errorCount > 0) {
    process.exit(1);
  } else {
    console.log(`\n✅ 100% of ${variants.length} catalog variants passed all structural, logical & enum validations!`);
  }
}

validateCatalog()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
