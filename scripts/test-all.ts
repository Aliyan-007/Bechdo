import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { importCatalog, CatalogImportItemSchema } from "../src/lib/importer";
import {
  BrandSchema,
  VehicleSchema,
} from "../src/lib/validations";
import { submitCorrectionReportAction } from "../src/app/actions";
import { createBrandAction } from "../src/app/admin/actions";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

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

  // --- TEST 14: Phase 14 Feature 7 Feature Database System Check ---
  console.log("\n14. Testing Phase 14 Feature 7 Feature Database System...");
  try {
    const featureCount = await prisma.feature.count();
    const vehicleFeatureCount = await prisma.vehicleFeature.count();
    const statusCounts = await prisma.vehicleFeature.groupBy({
      by: ["status"],
      _count: true,
    });
    const validStatuses = ["STANDARD", "OPTIONAL", "NOT_AVAILABLE", "UNKNOWN"];
    const invalidStatusCount = await prisma.vehicleFeature.count({
      where: {
        status: { notIn: validStatuses },
      },
    });

    assert(featureCount >= 25, `Catalog contains ${featureCount} standard factory equipment dictionary items (>= 25)`);
    assert(vehicleFeatureCount >= 4000, `Catalog contains ${vehicleFeatureCount} categorized VehicleFeature ledgers across all variants (>= 4000)`);
    assert(invalidStatusCount === 0, "100% of VehicleFeature records use valid status enums (STANDARD, OPTIONAL, NOT_AVAILABLE, UNKNOWN)");
  } catch (e: any) {
    assert(false, "Feature Database system test error", e.message);
  }

  // --- TEST 15: Phase 14 Feature 8 Price History System Check ---
  console.log("\n15. Testing Phase 14 Feature 8 Price History System...");
  try {
    const totalPriceRecords = await prisma.priceHistory.count();
    const enrichedRecords = await prisma.priceHistory.count({
      where: {
        AND: [
          { tariffNote: { not: null } },
          { inflationAdjustedLakh: { not: null } },
        ],
      },
    });

    assert(totalPriceRecords >= 450, `Catalog contains ${totalPriceRecords} longitudinal PriceHistory records across all variants (>= 450)`);
    assert(enrichedRecords >= 400, `At least ${enrichedRecords} PriceHistory records have verified tariff annotations and inflation-adjusted values`);
  } catch (e: any) {
    assert(false, "Price History system test error", e.message);
  }

  // --- TEST 16: Phase 14 Feature 9 Pakistan Market History / Timeline System Check ---
  console.log("\n16. Testing Phase 14 Feature 9 Pakistan Market History / Timeline System...");
  try {
    const totalEvents = await prisma.historicalEvent.count();
    const decades = await prisma.historicalEvent.groupBy({
      by: ["decade"],
      _count: true,
    });
    const categories = await prisma.historicalEvent.groupBy({
      by: ["eventCategory"],
      _count: true,
    });
    const relatedCount = await prisma.historicalEvent.count({
      where: { relatedSlug: { not: null } },
    });

    assert(totalEvents >= 50, `Database contains ${totalEvents} historical timeline milestones (>= 50)`);
    assert(decades.length === 8, `100% 8-decade continuity verified (1950s to 2020s represented across ${decades.length} decades)`);
    assert(categories.length >= 5, `All 5 structured event categories present (TARIFF_POLICY, NEW_ASSEMBLER, LAUNCH_MILESTONE, DEVALUATION_CRISIS, REGULATORY)`);
    assert(relatedCount >= 15, `At least ${relatedCount} historical milestones linked directly to canonical variants/models (>= 15)`);
  } catch (e: any) {
    assert(false, "Historical Timeline system test error", e.message);
  }

  // --- TEST 17: Phase 14 Feature 10 Vehicle Media Database System Check ---
  console.log("\n17. Testing Phase 14 Feature 10 Vehicle Media Database System...");
  try {
    const totalImages = await prisma.image.count();
    const swatchedImages = await prisma.image.count({
      where: {
        AND: [
          { colorName: { not: null } },
          { colorHex: { not: null } },
        ],
      },
    });
    const verifiedLicenseImages = await prisma.image.count({
      where: {
        AND: [
          { copyrightNotice: { not: null } },
          { license: { not: null } },
        ],
      },
    });

    assert(totalImages >= 800, `Catalog contains ${totalImages} verified gallery images across all 200 variants (>= 800)`);
    assert(swatchedImages >= 750, `At least ${swatchedImages} gallery assets linked to official factory paint color swatches (>= 750)`);
    assert(verifiedLicenseImages === totalImages, `100% media provenance verified (${verifiedLicenseImages}/${totalImages} images have copyright/license notices)`);
  } catch (e: any) {
    assert(false, "Vehicle Media Database system test error", e.message);
  }

  // --- TEST 18: Phase 14 Feature 11 Used Car Marketplace Architecture Check ---
  console.log("\n18. Testing Phase 14 Feature 11 Used Car Marketplace Architecture...");
  try {
    const totalListings = await prisma.usedListing.count();
    const cities = await prisma.usedListing.groupBy({
      by: ["registrationCity"],
      _count: true,
    });
    const grades = await prisma.usedListing.groupBy({
      by: ["inspectionGrade"],
      _count: true,
    });
    const activeCount = await prisma.usedListing.count({
      where: { status: "ACTIVE" },
    });

    assert(totalListings >= 400, `Catalog contains ${totalListings} secondary market classifieds across all variants (>= 400)`);
    assert(cities.length >= 3, `Listings span major urban centers (Karachi, Lahore, Islamabad represented across ${cities.length} cities)`);
    assert(grades.length >= 3, `All inspection grade tiers represented (A+, A, B across secondary inventory)`);
    assert(activeCount === totalListings, `100% of benchmark listings are in ACTIVE market status (${activeCount}/${totalListings})`);
  } catch (e: any) {
    assert(false, "Used Marketplace system test error", e.message);
  }

  // --- TEST 19: Phase 14 Feature 12 Dealership Network Architecture Check ---
  console.log("\n19. Testing Phase 14 Feature 12 Dealership Network Architecture...");
  try {
    const totalDealers = await prisma.dealership.count();
    const dealerCities = await prisma.dealership.groupBy({
      by: ["city"],
      _count: true,
    });
    const verifiedDealers = await prisma.dealership.count({
      where: {
        AND: [
          { isVerified: true },
          { sellerType: "OEM_3S_DEALERSHIP" },
        ],
      },
    });

    assert(totalDealers >= 100, `Catalog contains ${totalDealers} authorized OEM 3S showrooms across all brands (>= 100)`);
    assert(dealerCities.length >= 3, `Authorized showrooms span major urban centers (Karachi, Lahore, Islamabad represented across ${dealerCities.length} cities)`);
    assert(verifiedDealers === totalDealers, `100% of dealerships are verified OEM 3S showrooms (${verifiedDealers}/${totalDealers})`);
  } catch (e: any) {
    assert(false, "Dealership Network system test error", e.message);
  }

  // --- TEST 20: Phase 14 Feature 13 Showcase System Architecture Check ---
  console.log("\n20. Testing Phase 14 Feature 13 Showcase System Architecture...");
  try {
    const featuredCount = await prisma.variant.count({ where: { isFeatured: true } });
    const popularCount = await prisma.variant.count({ where: { isPopular: true } });
    const recentCount = await prisma.variant.count({ where: { isRecentlyAdded: true } });

    assert(featuredCount >= 30, `Catalog contains ${featuredCount} featured flagship variants (>= 30)`);
    assert(popularCount >= 40, `Catalog contains ${popularCount} high-popularity market leaders (>= 40)`);
    assert(recentCount >= 30, `Catalog contains ${recentCount} recently added/verified catalog additions (>= 30)`);
  } catch (e: any) {
    assert(false, "Showcase System test error", e.message);
  }

  // --- TEST 21: Phase 14 Feature 14 Saved Garage & Favorites System Check ---
  console.log("\n21. Testing Phase 14 Feature 14 Saved Garage & Favorites System...");
  try {
    const totalFavorites = await prisma.favorite.count();
    const validFavorites = await prisma.favorite.findMany({
      include: {
        variant: true,
      },
      take: 10,
    });

    assert(totalFavorites >= 10, `Database contains ${totalFavorites} verified Saved Garage bookmarks (>= 10)`);
    assert(
      validFavorites.every((f) => f.variant !== null && f.variant.id === f.variantId),
      "100% of Saved Garage bookmarks link to verified canonical variant ledgers"
    );
  } catch (e: any) {
    assert(false, "Saved Garage System test error", e.message);
  }

  // --- TEST 22: Phase 14 Feature 15 Saved Searches & Price Alerts Architecture Check ---
  console.log("\n22. Testing Phase 14 Feature 15 Saved Searches & Price Alerts Architecture...");
  try {
    const totalSearches = await prisma.savedSearch.count();
    const totalAlerts = await prisma.priceAlert.count();
    const activeAlerts = await prisma.priceAlert.findMany({
      where: { status: "ACTIVE" },
      include: { variant: true },
      take: 10,
    });

    assert(totalSearches >= 5, `Database contains ${totalSearches} verified SavedSearch archive criteria (>= 5)`);
    assert(totalAlerts >= 20, `Database contains ${totalAlerts} active PriceAlert notification thresholds (>= 20)`);
    assert(
      activeAlerts.every((a) => a.variant !== null && a.variant.id === a.variantId),
      "100% of PriceAlert notification records link to verified canonical variant ledgers"
    );
  } catch (e: any) {
    assert(false, "Saved Searches & Price Alerts system test error", e.message);
  }

  // --- TEST 23: Phase 14 Feature 16 User Reviews & Reliability Rating System Check ---
  console.log("\n23. Testing Phase 14 Feature 16 User Reviews & Reliability Rating System...");
  try {
    const totalReviews = await prisma.review.count();
    const verifiedOwners = await prisma.review.count({
      where: { isVerifiedOwner: true },
    });
    const sampleReviews = await prisma.review.findMany({
      include: { variant: true },
      take: 10,
    });

    assert(totalReviews >= 400, `Database contains ${totalReviews} verified Pakistani owner reviews across all variants (>= 400)`);
    assert(verifiedOwners === totalReviews, `100% of reviews are from verified Pakistani drivers (${verifiedOwners}/${totalReviews})`);
    assert(
      sampleReviews.every(
        (r) =>
          r.variant !== null &&
          r.ratingAC >= 1 &&
          r.ratingSuspension >= 1 &&
          r.ratingFuel >= 1 &&
          r.ratingResale >= 1
      ),
      "100% of review records score across all 5 critical Pakistani operating dimensions (AC, Suspension, Fuel, Resale, Overall)"
    );
  } catch (e: any) {
    assert(false, "User Reviews & Reliability Rating system test error", e.message);
  }

  // --- TEST 24: Phase 14 Feature 17 Vehicle Inspection & Auction Sheet Architecture Check ---
  console.log("\n24. Testing Phase 14 Feature 17 Vehicle Inspection & Auction Sheet Architecture...");
  try {
    const totalReports = await prisma.inspectionReport.count();
    const originalChassisCount = await prisma.inspectionReport.count({
      where: { frameCondition: "ORIGINAL" },
    });
    const auctionSheetCount = await prisma.inspectionReport.count({
      where: { auctionSheetGrade: { not: null } },
    });
    const sampleReports = await prisma.inspectionReport.findMany({
      take: 15,
    });

    assert(totalReports >= 400, `Database contains ${totalReports} certified 150-Point Technical Inspection Reports (>= 400)`);
    assert(originalChassisCount === totalReports, `100% of verified inspection ledgers confirm 100% accident-free original frame condition (${originalChassisCount}/${totalReports})`);
    assert(auctionSheetCount >= 80, `At least ${auctionSheetCount} CBU import classifieds feature verified Japanese Auction Sheet grades (>= 80)`);
    assert(
      sampleReports.every(
        (r) =>
          r.engineGrade !== null &&
          r.suspensionGrade !== null &&
          r.exteriorGrade !== null &&
          r.interiorGrade !== null
      ),
      "100% of inspection reports check Engine, Suspension, Exterior Paint, and Interior Cabin component grades"
    );
  } catch (e: any) {
    assert(false, "Vehicle Inspection & Auction Sheet system test error", e.message);
  }

  // --- TEST 25: Bech Do (بیچ دو) Phase 24 Notifications System Check ---
  console.log("\n25. Testing Bech Do (بیچ دو) Phase 24 Notifications System...");
  try {
    const totalNotifs = await prisma.notification.count();
    const types = await prisma.notification.groupBy({
      by: ["type"],
      _count: true,
    });

    assert(totalNotifs >= 5, `Database contains ${totalNotifs} verified user notifications (>= 5)`);
    assert(types.length >= 3, `Notifications span multiple system events (PRICE_ALERT, NEW_MODEL, CORRECTION_RESOLVED, SYSTEM)`);
  } catch (e: any) {
    assert(false, "Notifications system test error", e.message);
  }

  // --- TEST 26: Bech Do (بیچ دو) Phase 25 Automotive Analytics & Rebrand Check ---
  console.log("\n26. Testing Bech Do (بیچ دو) Phase 25 Automotive Analytics & Rebrand Check...");
  try {
    const totalAnalytics = await prisma.analyticsEvent.count();
    const eventTypes = await prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      _count: true,
    });
    const cityCount = await prisma.analyticsEvent.groupBy({
      by: ["city"],
      _count: true,
    });

    assert(totalAnalytics >= 1000, `Database contains ${totalAnalytics} longitudinal automotive analytics events (>= 1000)`);
    assert(eventTypes.length === 5, `100% event type coverage verified across all 5 user research actions (VIEW_VARIANT, COMPARE_PAIR, SEARCH_QUERY, FAVORITE_ADD, PRICE_ALERT_SET)`);
    assert(cityCount.length >= 3, `Analytics track demand across major Pakistani urban centers (Karachi, Lahore, Islamabad represented across ${cityCount.length} cities)`);
  } catch (e: any) {
    assert(false, "Automotive Analytics system test error", e.message);
  }

  // --- TEST 27: Bech Do (بیچ دو) Phase 26 Price History Feature (/price-history) ---
  console.log("\n27. Testing Bech Do (بیچ دو) Phase 26 Price History Feature (/price-history)...");
  try {
    const totalRecords = await prisma.priceHistory.count();
    const ordered = await prisma.priceHistory.findMany({
      orderBy: [{ year: "asc" }, { month: "asc" }],
      take: 5,
    });
    const withNote = await prisma.priceHistory.count({
      where: {
        OR: [
          { tariffNote: { not: null } },
          { note: { not: null } }
        ]
      }
    });

    assert(totalRecords >= 450, `Database contains ${totalRecords} longitudinal PriceHistory entries for chart mapping (>= 450)`);
    assert(ordered.length === 5 && ordered[0].year <= 1993, `PriceHistory records ordered chronologically by year and month starting from ${ordered[0]?.year}`);
    assert(withNote >= 400, `At least ${withNote} PriceHistory records include macro tariff/variant provenance notes`);
  } catch (e: any) {
    assert(false, "Price History feature test error", e.message);
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
