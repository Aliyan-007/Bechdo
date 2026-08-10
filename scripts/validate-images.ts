import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function validateImages() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 13 AUTOMOTIVE IMAGE VALIDATION PIPELINE    ");
  console.log("=========================================================\n");

  const images = await prisma.image.findMany({
    include: {
      variant: { include: { model: { include: { brand: true } } } },
    },
  });

  console.log(`Auditing ${images.length} total image records across ${images.length / 4} variants...\n`);

  let errorCount = 0;
  let passCount = 0;
  const urlMap = new Map<string, string[]>();

  for (const img of images) {
    // Check 1: Image has valid url
    if (!img.url || (!img.url.startsWith("http") && !img.url.startsWith("data:"))) {
      console.error(`[ERROR] Image '${img.id}' has invalid URL format: '${img.url}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 2: Image has valid sourceType
    const validSourceTypes = [
      "OFFICIAL_MANUFACTURER",
      "OFFICIAL_PAKISTAN",
      "AUTHORIZED_DISTRIBUTOR",
      "OFFICIAL_PRESS",
      "OFFICIAL_BROCHURE",
      "HISTORICAL_ARCHIVE",
      "LEGITIMATE_SECONDARY",
      "PLACEHOLDER",
    ];
    if (!img.sourceType || !validSourceTypes.includes(img.sourceType)) {
      console.error(`[ERROR] Image '${img.id}' has invalid sourceType '${img.sourceType}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 3: Image has valid imageMatchLevel
    const validMatchLevels = ["EXACT_VARIANT", "MODEL_YEAR", "GENERATION", "MODEL_ONLY"];
    if (!img.imageMatchLevel || !validMatchLevels.includes(img.imageMatchLevel)) {
      console.error(`[ERROR] Image '${img.id}' has invalid imageMatchLevel '${img.imageMatchLevel}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 4: No SVG fallback falsely marked as official studio photo
    if (img.url.startsWith("data:") && (img.sourceType === "OFFICIAL_PAKISTAN" || img.sourceType === "OFFICIAL_MANUFACTURER")) {
      console.error(`[ERROR] SVG fallback image '${img.id}' is falsely marked as '${img.sourceType}'!`);
      errorCount++;
    } else {
      passCount++;
    }

    // Check 5: Duplicate URL detection across DIFFERENT variants
    if (img.url.startsWith("http")) {
      const existing = urlMap.get(img.url) || [];
      existing.push(img.variantId);
      urlMap.set(img.url, existing);
    }
  }

  let duplicateUrlCount = 0;
  for (const [url, varIds] of urlMap.entries()) {
    const uniqueVars = new Set(varIds);
    if (uniqueVars.size > 1) {
      console.warn(`[WARN] External image URL '${url}' is shared across multiple distinct variants: ${[...uniqueVars].join(", ")}`);
      duplicateUrlCount++;
    }
  }

  console.log(`=========================================================`);
  console.log(`  IMAGE VALIDATION SUMMARY: ${passCount} CHECKS PASSED | ${errorCount} ERRORS  `);
  console.log(`=========================================================`);
  if (duplicateUrlCount === 0) {
    console.log(`✅ Zero cross-variant duplicate URL collisions detected across all ${images.length} images!`);
  }

  if (errorCount > 0) {
    process.exit(1);
  } else {
    console.log(`\n✅ 100% of ${images.length} image records passed all format, provenance, and anti-slop validations!`);
  }
}

validateImages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
