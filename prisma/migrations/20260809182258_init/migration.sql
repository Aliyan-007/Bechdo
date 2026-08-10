-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoInitial" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPakistaniAssembled" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "popularityScore" INTEGER NOT NULL DEFAULT 80,
    "isHistorical" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Model_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Generation_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Facelift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "generationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,
    CONSTRAINT "Facelift_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelId" TEXT NOT NULL,
    "generationId" TEXT,
    "faceliftId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "variantCount" INTEGER NOT NULL DEFAULT 1,
    "priceMinLakh" REAL NOT NULL,
    "priceMaxLakh" REAL NOT NULL,
    "badge" TEXT,
    "bodyType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "seating" INTEGER NOT NULL,
    "mileageKmpl" REAL,
    "powerHp" INTEGER NOT NULL,
    "torqueNm" INTEGER NOT NULL,
    "fuelTankL" INTEGER,
    "bootSpaceL" INTEGER,
    "groundClearanceMm" INTEGER,
    "airbags" INTEGER NOT NULL DEFAULT 2,
    "colors" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isRecentlyAdded" BOOLEAN NOT NULL DEFAULT false,
    "releaseYear" INTEGER NOT NULL DEFAULT 2024,
    "modelYear" INTEGER,
    CONSTRAINT "Variant_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Variant_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Variant_faceliftId_fkey" FOREIGN KEY ("faceliftId") REFERENCES "Facelift" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Specification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "engineDesc" TEXT NOT NULL,
    "displacementCc" INTEGER,
    "transmissionType" TEXT NOT NULL,
    "driveType" TEXT NOT NULL DEFAULT 'FWD',
    "horsepower" INTEGER NOT NULL,
    "torqueNm" INTEGER NOT NULL,
    "topSpeedKmh" INTEGER NOT NULL DEFAULT 180,
    "acceleration0to100" REAL NOT NULL DEFAULT 11.5,
    "fuelEconomyCity" REAL,
    "fuelEconomyHwy" REAL,
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
    CONSTRAINT "Specification_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Image_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "priceLakh" REAL NOT NULL,
    "note" TEXT,
    CONSTRAINT "PriceHistory_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PakistanAvailability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "isLocallyAssembled" BOOLEAN NOT NULL DEFAULT true,
    "assemblyPartner" TEXT NOT NULL,
    "launchYearPakistan" INTEGER NOT NULL,
    "warrantyYears" INTEGER NOT NULL DEFAULT 3,
    "warrantyKm" INTEGER NOT NULL DEFAULT 75000,
    "status" TEXT NOT NULL DEFAULT 'Available',
    CONSTRAINT "PakistanAvailability_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "VehicleFeature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "isStandard" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "VehicleFeature_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VehicleFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HistoricalEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "decade" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brandName" TEXT,
    "imageUrl" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_slug_key" ON "Model"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_slug_key" ON "Variant"("slug");

-- CreateIndex
CREATE INDEX "Variant_modelYear_idx" ON "Variant"("modelYear");

-- CreateIndex
CREATE UNIQUE INDEX "Specification_variantId_key" ON "Specification"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "PakistanAvailability_variantId_key" ON "PakistanAvailability"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_name_key" ON "Feature"("name");
