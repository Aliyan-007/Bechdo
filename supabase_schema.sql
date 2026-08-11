-- ============================================================================
-- BECH DO (بیچ دو) — AUTHORITATIVE SUPABASE POSTGRESQL DIRECT DDL SCHEMA
-- ============================================================================
-- Use this script in the Supabase SQL Editor if you prefer to manage the database 
-- without Prisma ORM, using raw PostgreSQL or the direct Supabase JS / PostgREST SDK.
--
-- Supports: 40 Brands, 200 Variants, 800 Gallery Assets, 461 Price History ledgers,
-- 477 Used Classifieds, 216 3S Dealerships, 512 Owner Reviews, 477 Inspection Reports,
-- 54 Historical Milestones, Notifications, and Automotive Analytics.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BRAND TABLE
CREATE TABLE IF NOT EXISTS "Brand" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "name" TEXT UNIQUE NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "logoInitial" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "isPakistaniAssembled" BOOLEAN NOT NULL DEFAULT true,
  "parentCompany" TEXT,
  "logoUrl" TEXT,
  "officialWebsite" TEXT,
  "pakistanDistributor" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS "Brand_isPakistaniAssembled_idx" ON "Brand"("isPakistaniAssembled");
CREATE INDEX IF NOT EXISTS "Brand_isActive_idx" ON "Brand"("isActive");

-- 2. MODEL TABLE
CREATE TABLE IF NOT EXISTS "Model" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "brandId" TEXT NOT NULL REFERENCES "Brand"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "bodyType" TEXT NOT NULL,
  "popularityScore" INTEGER NOT NULL DEFAULT 80,
  "isHistorical" BOOLEAN NOT NULL DEFAULT false,
  "aliases" TEXT,
  "category" TEXT,
  "firstProductionYear" INTEGER,
  "lastProductionYear" INTEGER,
  "status" TEXT DEFAULT 'CURRENT'
);

CREATE INDEX IF NOT EXISTS "Model_brandId_idx" ON "Model"("brandId");
CREATE INDEX IF NOT EXISTS "Model_bodyType_idx" ON "Model"("bodyType");
CREATE INDEX IF NOT EXISTS "Model_status_idx" ON "Model"("status");

-- 3. GENERATION TABLE
CREATE TABLE IF NOT EXISTS "Generation" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "modelId" TEXT NOT NULL REFERENCES "Model"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "startYear" INTEGER NOT NULL,
  "endYear" INTEGER,
  "isCurrent" BOOLEAN NOT NULL DEFAULT true,
  "platform" TEXT,
  "bodyStyles" TEXT,
  "imageUrl" TEXT
);

CREATE INDEX IF NOT EXISTS "Generation_modelId_idx" ON "Generation"("modelId");

-- 4. FACELIFT TABLE
CREATE TABLE IF NOT EXISTS "Facelift" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "generationId" TEXT NOT NULL REFERENCES "Generation"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "description" TEXT,
  "changes" TEXT,
  "imageUrl" TEXT
);

CREATE INDEX IF NOT EXISTS "Facelift_generationId_idx" ON "Facelift"("generationId");

-- 5. VARIANT TABLE
CREATE TABLE IF NOT EXISTS "Variant" (
  "id" TEXT PRIMARY KEY,
  "modelId" TEXT NOT NULL REFERENCES "Model"("id") ON DELETE CASCADE,
  "generationId" TEXT REFERENCES "Generation"("id"),
  "faceliftId" TEXT REFERENCES "Facelift"("id"),
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "variantCount" INTEGER NOT NULL DEFAULT 1,
  "priceMinLakh" DOUBLE PRECISION NOT NULL,
  "priceMaxLakh" DOUBLE PRECISION NOT NULL,
  "badge" TEXT,
  "bodyType" TEXT NOT NULL,
  "fuelType" TEXT NOT NULL,
  "engine" TEXT NOT NULL,
  "transmission" TEXT NOT NULL,
  "seating" INTEGER NOT NULL,
  "mileageKmpl" DOUBLE PRECISION,
  "powerHp" INTEGER NOT NULL,
  "torqueNm" INTEGER NOT NULL,
  "fuelTankL" INTEGER,
  "bootSpaceL" INTEGER,
  "groundClearanceMm" INTEGER,
  "airbags" INTEGER NOT NULL DEFAULT 2,
  "drivetrain" TEXT NOT NULL DEFAULT 'FWD',
  "trimLevel" TEXT,
  "colors" TEXT NOT NULL,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isPopular" BOOLEAN NOT NULL DEFAULT false,
  "isRecentlyAdded" BOOLEAN NOT NULL DEFAULT false,
  "releaseYear" INTEGER NOT NULL DEFAULT 2024,
  "modelYear" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'CURRENT',
  "marketStatus" TEXT NOT NULL DEFAULT 'LOCAL_CKD',
  "publicationStatus" TEXT NOT NULL DEFAULT 'PUBLISHED',
  "confidenceLevel" TEXT NOT NULL DEFAULT 'VERIFIED',
  "productionStartYear" INTEGER,
  "productionEndYear" INTEGER,
  "sourceType" TEXT NOT NULL DEFAULT 'OFFICIAL_ASSEMBLER',
  "sourceUrl" TEXT,
  "secondarySourceUrl" TEXT,
  "lastVerified" TEXT NOT NULL DEFAULT '2026-08-09',
  "verificationStatus" TEXT NOT NULL DEFAULT 'VERIFIED',
  "notes" TEXT
);

CREATE INDEX IF NOT EXISTS "Variant_modelId_idx" ON "Variant"("modelId");
CREATE INDEX IF NOT EXISTS "Variant_bodyType_idx" ON "Variant"("bodyType");
CREATE INDEX IF NOT EXISTS "Variant_fuelType_idx" ON "Variant"("fuelType");
CREATE INDEX IF NOT EXISTS "Variant_status_idx" ON "Variant"("status");
CREATE INDEX IF NOT EXISTS "Variant_marketStatus_idx" ON "Variant"("marketStatus");
CREATE INDEX IF NOT EXISTS "Variant_priceMinMax_idx" ON "Variant"("priceMinLakh", "priceMaxLakh");

-- 6. SPECIFICATION TABLE
CREATE TABLE IF NOT EXISTS "Specification" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "variantId" TEXT UNIQUE NOT NULL REFERENCES "Variant"("id") ON DELETE CASCADE,
  "engineDesc" TEXT NOT NULL,
  "displacementCc" INTEGER,
  "transmissionType" TEXT NOT NULL,
  "driveType" TEXT NOT NULL DEFAULT 'FWD',
  "horsepower" INTEGER NOT NULL,
  "torqueNm" INTEGER NOT NULL,
  "topSpeedKmh" INTEGER NOT NULL DEFAULT 180,
  "acceleration0to100" DOUBLE PRECISION NOT NULL DEFAULT 11.5,
  "fuelEconomyCity" DOUBLE PRECISION,
  "fuelEconomyHwy" DOUBLE PRECISION,
  "fuelTankCapacityL" INTEGER,
  "bootCapacityL" INTEGER,
  "clearanceMm" INTEGER,
  "kerbWeightKg" INTEGER NOT NULL DEFAULT 1250,
  "lengthMm" INTEGER NOT NULL DEFAULT 4620,
  "widthMm" INTEGER NOT NULL DEFAULT 1775,
  "heightMm" INTEGER NOT NULL DEFAULT 1485,
  "wheelbaseMm" INTEGER NOT NULL DEFAULT 2700,
  "seatingCapacity" INTEGER NOT NULL,
  "airbagsCount" INTEGER NOT NULL,
  "batteryCapacityKwh" DOUBLE PRECISION,
  "electricRangeKm" INTEGER,
  "chargingTimeHours" DOUBLE PRECISION,
  "hybridSystemType" TEXT
);

-- 7. IMAGE TABLE
CREATE TABLE IF NOT EXISTS "Image" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "variantId" TEXT NOT NULL REFERENCES "Variant"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "storagePath" TEXT,
  "category" TEXT NOT NULL,
  "caption" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "altText" TEXT,
  "width" INTEGER DEFAULT 1200,
  "height" INTEGER DEFAULT 800,
  "sourceName" TEXT,
  "sourceUrl" TEXT,
  "sourceType" TEXT DEFAULT 'OFFICIAL_PAKISTAN',
  "imageType" TEXT DEFAULT 'EXTERIOR_FRONT',
  "imageMatchLevel" TEXT DEFAULT 'EXACT_VARIANT',
  "verificationStatus" TEXT DEFAULT 'VERIFIED',
  "accessedAt" TEXT DEFAULT '2026-08-09',
  "copyrightNotice" TEXT,
  "license" TEXT,
  "isVerified" BOOLEAN NOT NULL DEFAULT true,
  "colorName" TEXT,
  "colorHex" TEXT
);

CREATE INDEX IF NOT EXISTS "Image_variantId_category_idx" ON "Image"("variantId", "category");
CREATE INDEX IF NOT EXISTS "Image_isPrimary_idx" ON "Image"("isPrimary");
CREATE INDEX IF NOT EXISTS "Image_colorName_idx" ON "Image"("colorName");

-- 8. PRICE HISTORY TABLE
CREATE TABLE IF NOT EXISTS "PriceHistory" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "variantId" TEXT NOT NULL REFERENCES "Variant"("id") ON DELETE CASCADE,
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "priceLakh" DOUBLE PRECISION,
  "priceType" TEXT NOT NULL DEFAULT 'EX_FACTORY',
  "currency" TEXT NOT NULL DEFAULT 'PKR',
  "source" TEXT,
  "sourceUrl" TEXT,
  "verificationStatus" TEXT NOT NULL DEFAULT 'VERIFIED',
  "note" TEXT,
  "inflationAdjustedLakh" DOUBLE PRECISION,
  "tariffNote" TEXT
);

CREATE INDEX IF NOT EXISTS "PriceHistory_variantId_year_idx" ON "PriceHistory"("variantId", "year");

-- 9. USED LISTINGS TABLE
CREATE TABLE IF NOT EXISTS "UsedListing" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "variantId" TEXT NOT NULL REFERENCES "Variant"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "askingPriceLakh" DOUBLE PRECISION NOT NULL,
  "mileageKm" INTEGER NOT NULL,
  "registrationYear" INTEGER NOT NULL,
  "registrationCity" TEXT NOT NULL,
  "assemblyStatus" TEXT NOT NULL DEFAULT 'Local CKD',
  "inspectionGrade" TEXT NOT NULL DEFAULT 'A+',
  "sellerName" TEXT NOT NULL,
  "sellerType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
  "sellerPhone" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "UsedListing_variantId_idx" ON "UsedListing"("variantId");
CREATE INDEX IF NOT EXISTS "UsedListing_registrationCity_idx" ON "UsedListing"("registrationCity");

-- 10. DEALERSHIP TABLE
CREATE TABLE IF NOT EXISTS "Dealership" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "sellerType" TEXT NOT NULL DEFAULT 'OEM_3S_DEALERSHIP',
  "brandName" TEXT,
  "city" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.8,
  "isVerified" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Dealership_city_idx" ON "Dealership"("city");

-- 11. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS "Review" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "variantId" TEXT NOT NULL REFERENCES "Variant"("id") ON DELETE CASCADE,
  "userName" TEXT NOT NULL,
  "userCity" TEXT NOT NULL,
  "ratingOverall" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  "ratingFuel" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  "ratingAC" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  "ratingSuspension" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  "ratingResale" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  "title" TEXT NOT NULL,
  "comment" TEXT NOT NULL,
  "ownershipYears" INTEGER NOT NULL DEFAULT 2,
  "isVerifiedOwner" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Review_variantId_idx" ON "Review"("variantId");

-- 12. INSPECTION REPORT TABLE
CREATE TABLE IF NOT EXISTS "InspectionReport" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "listingId" TEXT UNIQUE NOT NULL REFERENCES "UsedListing"("id") ON DELETE CASCADE,
  "variantId" TEXT NOT NULL REFERENCES "Variant"("id") ON DELETE CASCADE,
  "overallGrade" TEXT NOT NULL,
  "exteriorGrade" TEXT NOT NULL DEFAULT 'A',
  "interiorGrade" TEXT NOT NULL DEFAULT 'A',
  "engineGrade" TEXT NOT NULL DEFAULT 'A+',
  "suspensionGrade" TEXT NOT NULL DEFAULT 'A',
  "frameCondition" TEXT NOT NULL DEFAULT 'ORIGINAL',
  "auctionSheetGrade" TEXT,
  "inspectionDate" TEXT NOT NULL DEFAULT '2026-08-01',
  "inspectorName" TEXT NOT NULL DEFAULT 'BECH DO Certified Inspection Center',
  "reportUrl" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "InspectionReport_overallGrade_idx" ON "InspectionReport"("overallGrade");
CREATE INDEX IF NOT EXISTS "InspectionReport_frameCondition_idx" ON "InspectionReport"("frameCondition");

-- 13. NOTIFICATION TABLE
CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'SYSTEM',
  "linkUrl" TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");

-- 14. ANALYTICS EVENT TABLE
CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "eventType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "entityName" TEXT NOT NULL,
  "brandName" TEXT,
  "city" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_eventType_idx" ON "AnalyticsEvent"("eventType");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- ENABLE ROW LEVEL SECURITY (RLS) ON PUBLIC TABLES
ALTER TABLE "Brand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Model" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Variant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Specification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UsedListing" ENABLE ROW LEVEL SECURITY;

-- DEFAULT SELECT PUBLIC POLICIES FOR READING CATALOG
CREATE POLICY "Public select on Brand" ON "Brand" FOR SELECT USING (true);
CREATE POLICY "Public select on Model" ON "Model" FOR SELECT USING (true);
CREATE POLICY "Public select on Variant" ON "Variant" FOR SELECT USING (true);
CREATE POLICY "Public select on Specification" ON "Specification" FOR SELECT USING (true);
CREATE POLICY "Public select on UsedListing" ON "UsedListing" FOR SELECT USING (true);
