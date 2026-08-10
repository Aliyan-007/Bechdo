import { PrismaClient } from "@prisma/client";
import { importCatalog, CatalogImportItemSchema } from "../src/lib/importer";
import {
  BrandSchema,
  VehicleSchema,
} from "../src/lib/validations";
import { submitCorrectionReportAction } from "../src/app/actions";
import { createBrandAction } from "../src/app/admin/actions";

const prisma = new PrismaClient();

async function runAllTests() {
  console.log("=====================================================");
  console.log("  STARTING RASTA PHASE 7.1 AUTOMATED TEST SUITE      ");
  console.log("=====================================================");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`, detail || "");
      failed++;
    }
  }

  // --- TEST 1: Database Integrity & Relational Constraints ---
  console.log("\n1. Testing Database Integrity & Relational Constraints...");
  try {
    const totalBrands = await prisma.brand.count();
    const totalModels = await prisma.model.count();
    const totalGenerations = await prisma.generation.count();
    const totalVariants = await prisma.variant.count();
    const totalSpecs = await prisma.specification.count();
    const totalImages = await prisma.image.count();
    const totalAvailability = await prisma.pakistanAvailability.count();

    assert(totalBrands >= 30, `Catalog contains ${totalBrands} verified brands (>= 30)`);
    assert(totalVariants >= 150, `Catalog contains ${totalVariants} verified variants (>= 150)`);
    assert(totalSpecs === totalVariants, `100% specification relational coverage (${totalSpecs}/${totalVariants})`);
    assert(totalImages >= totalVariants * 4, `At least 4 gallery images per variant (${totalImages} total images)`);
    assert(totalAvailability === totalVariants, `100% CKD/CBU assembly profile coverage (${totalAvailability}/${totalVariants})`);
  } catch (e: any) {
    assert(false, "Database Integrity test error", e.message);
  }

  // --- TEST 2: Phase 7.1 Mathematical Reconciliation Check ---
  console.log("\n2. Testing Phase 7.1 Full Catalog Mathematical Reconciliation...");
  try {
    const totalVariants = await prisma.variant.count();

    const ckdCount = await prisma.variant.count({ where: { marketStatus: "LOCAL_CKD" } });
    const cbuCount = await prisma.variant.count({ where: { marketStatus: "CBU" } });
    const privateImportCount = await prisma.variant.count({ where: { marketStatus: "PRIVATE_IMPORT" } });
    const histPresenceCount = await prisma.variant.count({ where: { marketStatus: "HISTORICAL_PRESENCE" } });

    assert(
      ckdCount + cbuCount + privateImportCount + histPresenceCount === totalVariants,
      `Market relationship counts sum exactly to total variants (${ckdCount}+${cbuCount}+${privateImportCount}+${histPresenceCount} = ${totalVariants})`
    );

    const currentCount = await prisma.variant.count({ where: { status: "CURRENT" } });
    const discontinuedCount = await prisma.variant.count({ where: { status: "DISCONTINUED" } });
    const historicalCount = await prisma.variant.count({ where: { status: "HISTORICAL" } });
    const upcomingCount = await prisma.variant.count({ where: { status: "UPCOMING" } });

    assert(
      currentCount + discontinuedCount + historicalCount + upcomingCount === totalVariants,
      `Market availability counts sum exactly to total variants (${currentCount}+${discontinuedCount}+${historicalCount}+${upcomingCount} = ${totalVariants})`
    );
  } catch (e: any) {
    assert(false, "Mathematical Reconciliation test error", e.message);
  }

  // --- TEST 3: First-Class Evidence System & Source Coverage ---
  console.log("\n3. Testing First-Class Evidence System (Source & VehicleEvidence)...");
  try {
    const totalSources = await prisma.source.count();
    const totalEvidence = await prisma.vehicleEvidence.count();
    assert(totalSources >= 4, `Database contains ${totalSources} authoritative Primary/Archive sources (>= 4)`);
    assert(totalEvidence >= 30, `Database contains ${totalEvidence} explicit VehicleEvidence field entries (>= 30)`);
  } catch (e: any) {
    assert(false, "Evidence system test error", e.message);
  }

  // --- TEST 4: Strict 3-Concept Decoupling ---
  console.log("\n4. Testing Strict 3-Concept Decoupling (Market Status vs Pub Workflow vs Confidence)...");
  try {
    const validMarketStatuses = [
      "CURRENT",
      "DISCONTINUED",
      "HISTORICAL",
      "UPCOMING",
      "LOCAL_CKD",
      "CBU",
      "PRIVATE_IMPORT",
      "OFFICIAL_MARKET",
      "HISTORICAL_PRESENCE",
    ];
    const invalidMarketCount = await prisma.variant.count({
      where: {
        marketStatus: { notIn: validMarketStatuses },
      },
    });
    assert(invalidMarketCount === 0, "100% of variants use valid Pakistan market relationship classifications");

    const validPubStatuses = ["DRAFT", "RESEARCH", "REVIEW", "VERIFIED", "PUBLISHED", "ARCHIVED"];
    const invalidPubCount = await prisma.variant.count({
      where: {
        publicationStatus: { notIn: validPubStatuses },
      },
    });
    assert(invalidPubCount === 0, "100% of variants use valid editorial publication workflow statuses");

    const validConfidence = ["VERIFIED", "PARTIALLY_VERIFIED", "ESTIMATED", "UNVERIFIED", "CONFLICTING"];
    const invalidConfCount = await prisma.variant.count({
      where: {
        confidenceLevel: { notIn: validConfidence },
      },
    });
    assert(invalidConfCount === 0, "100% of variants use valid data verification confidence levels");
  } catch (e: any) {
    assert(false, "3-Concept Separation test error", e.message);
  }

  // --- TEST 5: No Fabricated Specifications (Null Handling Check) ---
  console.log("\n5. Testing No-Fabrication Standard (Null Handling Check)...");
  try {
    const fordPrefect = await prisma.variant.findUnique({
      where: { id: "ford-prefect-1953" },
    });
    assert(
      fordPrefect !== null && fordPrefect.mileageKmpl === null,
      "Historical 1953 Ford Prefect preserves NULL for unverified mileage (zero data fabrication)"
    );
  } catch (e: any) {
    assert(false, "No fabrication test error", e.message);
  }

  // --- TEST 6: VariantAlias Model & Alias Lookup Test ---
  console.log("\n6. Testing VariantAlias Model & Alias Resolution...");
  try {
    const aliases = await prisma.variantAlias.findMany({ take: 15 });
    assert(aliases.length >= 10, `Database contains ${aliases.length} verified variant aliases (e.g. 'Corolla Grande', 'Reborn', 'Indus Corolla')`);
  } catch (e: any) {
    assert(false, "VariantAlias test error", e.message);
  }

  // --- TEST 7: Server-Side Authorization Protection (Security Audit) ---
  console.log("\n7. Testing Server-Side Authorization Protection...");
  try {
    const unauthorizedRes = await createBrandAction({
      name: "UnauthorizedBrand",
      logoInitial: "UN",
      color: "#2F6B54",
      country: "Pakistan",
      description: "Should be blocked without session token",
      isPakistaniAssembled: true,
    });
    assert(
      !unauthorizedRes.success &&
        (unauthorizedRes.error?.includes("Authentication Required") ||
          unauthorizedRes.error?.includes("Authorization Forbidden")),
      "Server Action mutations block unauthenticated direct invocations"
    );
  } catch (e: any) {
    assert(false, "Server Action security test error", e.message);
  }

  // --- TEST 8: Zod Validation & Error Handling ---
  console.log("\n8. Testing Zod Validation Schemas...");
  const invalidBrand = BrandSchema.safeParse({
    name: "T", // too short
    logoInitial: "ABCD", // too long
    color: "invalid-hex",
    country: "J", // too short
    description: "short",
  });
  assert(!invalidBrand.success, "BrandSchema rejects malformed inputs with descriptive errors");

  const validBrand = BrandSchema.safeParse({
    name: "Daihatsu",
    logoInitial: "D",
    color: "#3E8A6C",
    country: "Japan",
    description: "Japanese compact car manufacturer assembled in Pakistan.",
    isPakistaniAssembled: true,
  });
  assert(validBrand.success, "BrandSchema accepts valid manufacturer inputs");

  const invalidVehicle = VehicleSchema.safeParse({
    brandName: "",
    modelName: "",
    variantName: "",
    bodyType: "",
    fuelType: "",
    priceMinLakh: -10,
    priceMaxLakh: 0,
    engine: "",
    transmission: "",
    powerHp: 5,
    torqueNm: 10,
    seating: 1,
    airbags: -1,
  });
  assert(!invalidVehicle.success, "VehicleSchema rejects impossible prices, negative airbags, and empty strings");

  // --- TEST 9: Idempotent UPSERT Import & Duplicate Detection ---
  console.log("\n9. Testing Idempotent UPSERT Import Pipeline & Duplicate Detection...");
  const testItem = {
    id: "test-toyota-corolla-18-altis",
    brand: "Toyota",
    model: "Corolla",
    variantName: "1.8 Altis CVT-i Test",
    bodyType: "Sedan",
    fuelType: "Petrol",
    priceMinLakh: 69.5,
    priceMaxLakh: 72.0,
    badge: "Test",
    engine: "1,798cc 2ZR-FE",
    transmission: "7-Speed CVT",
    seating: 5,
    mileageKmpl: 13,
    powerHp: 138,
    torqueNm: 173,
    airbags: 2,
    colors: ["White", "Black", "Silver"],
    isFeatured: false,
    isPopular: false,
    isRecentlyAdded: false,
    releaseYear: 2024,
    status: "CURRENT" as const,
    sourceType: "OFFICIAL_ASSEMBLER" as const,
    verificationStatus: "VERIFIED" as const,
    notes: "Automated test verification record",
    isLocallyAssembled: true,
    warrantyYears: 3,
    warrantyKm: 75000,
  };

  // First import call
  const run1 = await importCatalog([testItem], { updateExisting: true });
  assert(run1.errors.length === 0, "Test variant imported cleanly without errors");

  // Second import call (idempotency check)
  const run2 = await importCatalog([testItem], { updateExisting: true });
  assert(
    run2.imported === 0 && run2.updated === 1 && run2.errors.length === 0,
    "Second import run updates existing record cleanly without creating duplicate rows"
  );

  // Cleanup test record
  await prisma.variant.deleteMany({
    where: { id: "test-toyota-corolla-18-altis" },
  });

  // --- TEST 10: User Correction Reporting Action ---
  console.log("\n10. Testing User Correction Report Action...");
  const firstVariant = await prisma.variant.findFirst();
  if (firstVariant) {
    const reportRes = await submitCorrectionReportAction({
      variantId: firstVariant.id,
      fieldReported: "Ex-Factory Price",
      description: "Automated test checking correction report logging system",
      suggestedCorrection: "Verified via IMC circular #102",
      sourceUrl: "https://toyota-indus.com",
      userEmail: "test@rasta.pk",
    });
    assert(reportRes.success, "Correction report logged successfully in database");
  }

  // --- TEST 11: Search & Filter Performance (Latency Benchmark) ---
  console.log("\n11. Testing Database Search & Filter Execution Latency...");
  const t0 = performance.now();
  const searchResults = await prisma.variant.findMany({
    where: {
      OR: [
        { name: { contains: "Corolla" } },
        { engine: { contains: "Turbo" } },
        { bodyType: "SUV" },
      ],
    },
    take: 24,
  });
  const t1 = performance.now();
  const durationMs = Math.round((t1 - t0) * 100) / 100;
  assert(
    durationMs < 100,
    `Multi-criteria search query executed in ${durationMs}ms (< 100ms benchmark)`,
    `Returned ${searchResults.length} variants`
  );

  // --- TEST 12: Comparison Matrix Compatibility ---
  console.log("\n12. Testing Comparison Matrix Data Compatibility...");
  const sampleCompare = await prisma.variant.findMany({
    take: 4,
    include: {
      specification: true,
      pakAvailability: true,
      images: true,
    },
  });
  assert(
    sampleCompare.length === 4 &&
      sampleCompare.every((v) => v.specification && v.images.length >= 4),
    "All compared models have full specification and image gallery support"
  );

  // --- TEST 13: Phase 7.1 Price Provenance & Currency Check ---
  console.log("\n13. Testing Phase 7.1 Price Provenance & Currency Check...");
  try {
    const validPriceTypes = [
      "EX_FACTORY",
      "LAUNCH_PRICE",
      "LISTED",
      "MSRP",
      "USED_AVG",
      "AUCTION_PRICE",
    ];
    const invalidPriceCount = await prisma.priceHistory.count({
      where: {
        OR: [
          { priceType: { notIn: validPriceTypes } },
          { currency: { not: "PKR" } },
        ],
      },
    });
    assert(
      invalidPriceCount === 0,
      "100% of price records specify valid priceType and explicit 'PKR' currency"
    );
  } catch (e: any) {
    assert(false, "Price provenance test error", e.message);
  }

  console.log("\n=====================================================");
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=====================================================");
  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
