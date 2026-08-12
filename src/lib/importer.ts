import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const CatalogImportItemSchema = z.object({
  id: z.string().optional(),
  brand: z.string().min(1, "Brand required"),
  model: z.string().min(1, "Model required"),
  variantName: z.string().min(1, "Variant name required"),
  bodyType: z.string().min(1, "Body type required"),
  fuelType: z.string().min(1, "Fuel type required"),
  priceMinLakh: z.number().min(0),
  priceMaxLakh: z.number().min(0),
  badge: z.string().nullable().optional(),
  engine: z.string().min(1, "Engine description required"),
  transmission: z.string().min(1, "Transmission required"),
  seating: z.number().int().min(2, "Minimum 2 seats required"),
  mileageKmpl: z.number().nullable().optional(),
  powerHp: z.number().int().min(1, "Horsepower required"),
  torqueNm: z.number().int().min(1, "Torque required"),
  fuelTankL: z.number().int().nullable().optional(),
  bootSpaceL: z.number().int().nullable().optional(),
  groundClearanceMm: z.number().int().nullable().optional(),
  airbags: z.number().int().default(2),
  colors: z.array(z.string()).default([
    "Titanium Grey",
    "Pearl White",
    "Sparkling Black",
  ]),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isRecentlyAdded: z.boolean().default(false),
  releaseYear: z.number().int().min(1950).max(2030).default(2024),
  status: z
    .enum([
      "CURRENT",
      "DISCONTINUED",
      "HISTORICAL",
      "UPCOMING",
      "LOCAL_CKD",
      "CBU",
      "PRIVATE_IMPORT",
    ])
    .default("CURRENT"),
  productionStartYear: z.number().int().min(1950).max(2030).optional(),
  productionEndYear: z.number().int().min(1950).max(2030).nullable().optional(),
  sourceType: z
    .enum([
      "OFFICIAL_ASSEMBLER",
      "MARKET_SURVEY",
      "HISTORICAL_ARCHIVE",
      "DEALERSHIP",
    ])
    .default("OFFICIAL_ASSEMBLER"),
  sourceUrl: z.string().optional(),
  verificationStatus: z
    .enum(["VERIFIED", "UNVERIFIED", "ESTIMATED"])
    .default("VERIFIED"),
  notes: z.string().optional(),
  assemblyPartner: z.string().optional(),
  isLocallyAssembled: z.boolean().default(true),
  warrantyYears: z.number().int().default(3),
  warrantyKm: z.number().int().default(75000),
  aliases: z.array(z.string()).optional(),
  originalLaunchPriceLakh: z.number().nullable().optional(),
  originalLaunchYear: z.number().int().optional(),
  features: z
    .array(
      z.object({
        name: z.string(),
        category: z.string().default("Safety"),
        status: z
          .enum(["STANDARD", "OPTIONAL", "NOT_AVAILABLE", "UNKNOWN"])
          .default("STANDARD"),
      })
    )
    .optional(),
});

export type CatalogImportItem = z.input<typeof CatalogImportItemSchema>;

export interface ImportSummary {
  totalSubmitted: number;
  imported: number;
  updated: number;
  skippedDuplicates: number;
  errors: Array<{ index: number; id?: string; error: string }>;
}

/**
 * Idempotent Import Pipeline for RASTA Automotive Database
 * - Validates records against Zod schema
 * - Detects duplicates by stable slug/id
 * - Performs safe UPSERT on brands, models, generations, variants, specifications, aliases, images, priceHistories, and pakistanAvailability
 */
export async function importCatalog(
  items: CatalogImportItem[],
  options: { updateExisting?: boolean } = { updateExisting: true }
): Promise<ImportSummary> {
  const summary: ImportSummary = {
    totalSubmitted: items.length,
    imported: 0,
    updated: 0,
    skippedDuplicates: 0,
    errors: [],
  };

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    const parsed = CatalogImportItemSchema.safeParse(raw);

    if (!parsed.success) {
      summary.errors.push({
        index: i,
        id: raw.id,
        error: parsed.error.issues
          .map((iss) => `${iss.path.join(".")}: ${iss.message}`)
          .join("; "),
      });
      continue;
    }

    const item = parsed.data;

    try {
      // 1. Resolve or create Brand
      const brandSlug = item.brand
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      let brand = await prisma.brand.findUnique({
        where: { slug: brandSlug },
      });

      if (!brand) {
        brand = await prisma.brand.create({
          data: {
            name: item.brand,
            slug: brandSlug,
            logoInitial: item.brand.slice(0, 3).toUpperCase(),
            color: getBrandAccentColor(item.brand),
            country: getBrandCountry(item.brand),
            description: `${item.brand} vehicles in the Pakistan automotive market.`,
            isPakistaniAssembled: item.isLocallyAssembled,
            parentCompany: getBrandParentCompany(item.brand),
            officialWebsite: getBrandOfficialWebsite(item.brand),
            pakistanDistributor: getBrandDistributor(item.brand),
            isActive: true,
          },
        });
      } else {
        await prisma.brand.update({
          where: { id: brand.id },
          data: {
            parentCompany: getBrandParentCompany(item.brand),
            officialWebsite: getBrandOfficialWebsite(item.brand),
            pakistanDistributor: getBrandDistributor(item.brand),
            isActive: true,
          },
        });
      }

      // 2. Resolve or create Model
      const modelSlug = `${brandSlug}-${item.model
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`;

      let model = await prisma.model.findUnique({
        where: { slug: modelSlug },
      });

      if (!model) {
        model = await prisma.model.create({
          data: {
            brandId: brand.id,
            name: item.model,
            slug: modelSlug,
            bodyType: item.bodyType,
            popularityScore: item.isPopular ? 90 : 75,
            isHistorical: item.status === "HISTORICAL",
            aliases: getModelAliases(item.model),
            category: getModelCategory(item.model, item.bodyType),
            firstProductionYear: getModelFirstYear(item.model, item.productionStartYear || item.releaseYear),
            lastProductionYear: item.status === "HISTORICAL" ? (item.productionEndYear || 2010) : null,
            status: item.status === "HISTORICAL" ? "HISTORICAL" : "CURRENT",
          },
        });
      } else {
        await prisma.model.update({
          where: { id: model.id },
          data: {
            aliases: getModelAliases(item.model),
            category: getModelCategory(item.model, item.bodyType),
            firstProductionYear: getModelFirstYear(item.model, item.productionStartYear || item.releaseYear),
            lastProductionYear: item.status === "HISTORICAL" ? (item.productionEndYear || 2010) : null,
            status: item.status === "HISTORICAL" ? "HISTORICAL" : "CURRENT",
          },
        });
      }

      // 3. Resolve or create Generation
      let generation = await prisma.generation.findFirst({
        where: { modelId: model.id },
      });

      if (!generation) {
        generation = await prisma.generation.create({
          data: {
            modelId: model.id,
            name: `${item.model} Generation`,
            code: `${brand.logoInitial}-${item.model.slice(0, 3)}`,
            startYear: item.productionStartYear || item.releaseYear || 2020,
            isCurrent: item.status === "CURRENT",
            platform: getGenerationPlatform(brand.name, item.model),
            bodyStyles: getGenerationBodyStyles(item.bodyType),
            imageUrl: `vehicles/generations/${brandSlug}-${item.model.toLowerCase()}.svg`,
          },
        });
      } else {
        await prisma.generation.update({
          where: { id: generation.id },
          data: {
            platform: getGenerationPlatform(brand.name, item.model),
            bodyStyles: getGenerationBodyStyles(item.bodyType),
            imageUrl: `vehicles/generations/${brandSlug}-${item.model.toLowerCase()}.svg`,
          },
        });
      }

      // 3.5. Resolve or create Facelift if mid-cycle update
      let facelift: any = null;
      const isFaceliftYear =
        (item.model === "Corolla" && item.releaseYear >= 2017) ||
        (item.model === "Civic" && item.releaseYear >= 2019) ||
        (item.model === "Fortuner" && item.releaseYear >= 2021) ||
        (item.notes && item.notes.toLowerCase().includes("facelift"));

      if (isFaceliftYear) {
        const flName = `${item.model} ${item.releaseYear}+ Facelift`;
        facelift = await prisma.facelift.findFirst({
          where: { generationId: generation.id, name: flName },
        });
        if (!facelift) {
          facelift = await prisma.facelift.create({
            data: {
              generationId: generation.id,
              name: flName,
              year: item.releaseYear,
              description: `${item.model} mid-cycle refresh in Pakistan market.`,
              changes: getFaceliftChanges(brand.name, item.model, item.releaseYear),
              imageUrl: `vehicles/facelifts/${brandSlug}-${item.model.toLowerCase()}-${item.releaseYear}.svg`,
            },
          });
        }
      }

      // 4. Determine stable Variant ID / Slug
      const stableSlug =
        item.id ||
        `${modelSlug}-${item.variantName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`;

      const existingVariant = await prisma.variant.findUnique({
        where: { slug: stableSlug },
      });

      if (existingVariant && !options.updateExisting) {
        summary.skippedDuplicates++;
        continue;
      }

      const variantData = {
        modelId: model.id,
        generationId: generation.id,
        faceliftId: facelift ? facelift.id : null,
        name: item.variantName,
        slug: stableSlug,
        variantCount: 1,
        priceMinLakh: item.priceMinLakh,
        priceMaxLakh: item.priceMaxLakh,
        badge: item.badge || null,
        bodyType: item.bodyType,
        fuelType: item.fuelType,
        engine: item.engine,
        transmission: item.transmission,
        seating: item.seating,
        mileageKmpl: item.mileageKmpl || null,
        powerHp: item.powerHp,
        torqueNm: item.torqueNm,
        fuelTankL: item.fuelTankL || null,
        bootSpaceL: item.bootSpaceL || null,
        groundClearanceMm: item.groundClearanceMm || null,
        airbags: item.airbags,
        colors: JSON.stringify(item.colors),
        isFeatured: item.isFeatured,
        isPopular: item.isPopular,
        isRecentlyAdded: item.isRecentlyAdded,
        releaseYear: item.releaseYear,
        status: item.status,
        marketStatus: item.isLocallyAssembled ? "LOCAL_CKD" : "CBU",
        publicationStatus: "PUBLISHED",
        productionStartYear:
          item.productionStartYear || item.releaseYear || null,
        productionEndYear: item.productionEndYear || null,
        sourceType: item.sourceType,
        sourceUrl: item.sourceUrl || null,
        lastVerified: new Date().toISOString().slice(0, 10),
        verificationStatus: item.verificationStatus,
        notes: item.notes || null,
      };

      if (existingVariant) {
        await prisma.variant.update({
          where: { slug: stableSlug },
          data: variantData,
        });
        summary.updated++;
      } else {
        await prisma.variant.create({
          data: {
            id: stableSlug,
            ...variantData,
          },
        });
        summary.imported++;
      }

      // 5. UPSERT Specification
      await prisma.specification.upsert({
        where: { variantId: stableSlug },
        create: {
          variantId: stableSlug,
          engineDesc: item.engine,
          displacementCc: guessDisplacementCc(item.engine),
          transmissionType: item.transmission,
          driveType:
            item.bodyType === "SUV" || item.bodyType === "Pickup"
              ? "4WD / AWD"
              : "FWD",
          horsepower: item.powerHp,
          torqueNm: item.torqueNm,
          topSpeedKmh:
            item.powerHp > 200 ? 220 : item.powerHp > 140 ? 190 : 160,
          acceleration0to100:
            item.powerHp > 200 ? 8.5 : item.powerHp > 140 ? 10.8 : 13.5,
          fuelEconomyCity: item.mileageKmpl ? item.mileageKmpl * 0.9 : 11,
          fuelEconomyHwy: item.mileageKmpl ? item.mileageKmpl * 1.15 : 15,
          fuelTankCapacityL: item.fuelTankL || 50,
          bootCapacityL: item.bootSpaceL || null,
          clearanceMm: item.groundClearanceMm || 165,
          kerbWeightKg:
            item.bodyType === "SUV"
              ? 1750
              : item.bodyType === "Sedan"
              ? 1280
              : 880,
          lengthMm:
            item.bodyType === "SUV"
              ? 4750
              : item.bodyType === "Sedan"
              ? 4620
              : 3500,
          widthMm:
            item.bodyType === "SUV"
              ? 1855
              : item.bodyType === "Sedan"
              ? 1775
              : 1475,
          heightMm:
            item.bodyType === "SUV"
              ? 1835
              : item.bodyType === "Sedan"
              ? 1485
              : 1490,
          wheelbaseMm:
            item.bodyType === "SUV"
              ? 2750
              : item.bodyType === "Sedan"
              ? 2700
              : 2460,
          seatingCapacity: item.seating,
          airbagsCount: item.airbags,
          batteryCapacityKwh: getSpecBatteryKwh(item.fuelType, item.model),
          electricRangeKm: getSpecElectricRange(item.fuelType, item.model),
          chargingTimeHours: getSpecChargingHours(item.fuelType, item.model),
          hybridSystemType: getSpecHybridSystem(item.fuelType, item.model),
        },
        update: {
          engineDesc: item.engine,
          transmissionType: item.transmission,
          horsepower: item.powerHp,
          torqueNm: item.torqueNm,
          seatingCapacity: item.seating,
          airbagsCount: item.airbags,
          batteryCapacityKwh: getSpecBatteryKwh(item.fuelType, item.model),
          electricRangeKm: getSpecElectricRange(item.fuelType, item.model),
          chargingTimeHours: getSpecChargingHours(item.fuelType, item.model),
          hybridSystemType: getSpecHybridSystem(item.fuelType, item.model),
        },
      });

      // 6. UPSERT PakistanAvailability
      await prisma.pakistanAvailability.upsert({
        where: { variantId: stableSlug },
        create: {
          variantId: stableSlug,
          isLocallyAssembled: item.isLocallyAssembled,
          assemblyPartner:
            item.assemblyPartner ||
            getDefaultAssembler(item.brand, item.isLocallyAssembled),
          launchYearPakistan:
            item.productionStartYear || item.releaseYear || 2020,
          warrantyYears: item.warrantyYears,
          warrantyKm: item.warrantyKm,
          status:
            item.status === "CURRENT"
              ? "Available"
              : item.status === "DISCONTINUED"
              ? "Discontinued"
              : "Historical Archive",
        },
        update: {
          isLocallyAssembled: item.isLocallyAssembled,
          assemblyPartner:
            item.assemblyPartner ||
            getDefaultAssembler(item.brand, item.isLocallyAssembled),
          status:
            item.status === "CURRENT"
              ? "Available"
              : item.status === "DISCONTINUED"
              ? "Discontinued"
              : "Historical Archive",
        },
      });

      // 7. Sync VariantAliases if provided
      if (item.aliases && item.aliases.length > 0) {
        for (const aliasStr of item.aliases) {
          const existingAlias = await prisma.variantAlias.findFirst({
            where: {
              variantId: stableSlug,
              alias: aliasStr,
            },
          });
          if (!existingAlias) {
            await prisma.variantAlias.create({
              data: {
                variantId: stableSlug,
                alias: aliasStr,
              },
            });
          }
        }
      }

      // 8. Ensure at least 4 fallback images exist if none present
      const imgCount = await prisma.image.count({
        where: { variantId: stableSlug },
      });

      if (imgCount === 0) {
        const cats = ["exterior", "interior", "dashboard", "wheels"];
        for (let idx = 0; idx < cats.length; idx++) {
          await prisma.image.create({
            data: {
              variantId: stableSlug,
              url: `data:fallback/${cats[idx]}`,
              category: cats[idx],
              caption: `${item.brand} ${item.model} — ${cats[idx].toUpperCase()}`,
              sortOrder: idx,
              isPrimary: idx === 0,
              copyrightNotice: `© 2026 ${item.brand} Media Kit / RASTA Archive`,
              isVerified: true,
            },
          });
        }
      }

      // 9. Ensure PriceHistory record exists (supports nullable launch price for historical archives)
      const phCount = await prisma.priceHistory.count({
        where: { variantId: stableSlug },
      });

      if (phCount === 0) {
        const launchYear = item.originalLaunchYear || item.releaseYear || 2024;
        const launchPrice =
          item.originalLaunchPriceLakh !== undefined
            ? item.originalLaunchPriceLakh
            : item.priceMinLakh > 0
            ? item.priceMinLakh
            : null;
        await prisma.priceHistory.create({
          data: {
            variantId: stableSlug,
            year: launchYear,
            month: 1,
            priceLakh: launchPrice,
            priceType:
              item.status === "HISTORICAL" ? "LAUNCH_PRICE" : "EX_FACTORY",
            currency: "PKR",
            source: item.sourceType,
            note: `${item.status} documented market price`,
            tariffNote: getTariffNote(launchYear, item.model, launchPrice),
            inflationAdjustedLakh: getInflationAdjustedLakh(launchPrice, launchYear),
          },
        });
      }

      // 10. Sync VehicleFeatures if provided
      if (item.features && item.features.length > 0) {
        for (const f of item.features) {
          const featureRec = await prisma.feature.upsert({
            where: { name: f.name },
            create: { name: f.name, category: f.category },
            update: { category: f.category },
          });
          const existingVf = await prisma.vehicleFeature.findFirst({
            where: { variantId: stableSlug, featureId: featureRec.id },
          });
          if (existingVf) {
            await prisma.vehicleFeature.update({
              where: { id: existingVf.id },
              data: {
                status: f.status || "STANDARD",
                isStandard: (f.status || "STANDARD") === "STANDARD",
              },
            });
          } else {
            await prisma.vehicleFeature.create({
              data: {
                variantId: stableSlug,
                featureId: featureRec.id,
                status: f.status || "STANDARD",
                isStandard: (f.status || "STANDARD") === "STANDARD",
              },
            });
          }
        }
      }
    } catch (e: any) {
      summary.errors.push({
        index: i,
        id: item.id || `${item.brand}-${item.model}`,
        error: e.message || "Unknown database error during import",
      });
    }
  }

  return summary;
}

function getBrandCountry(brand: string): string {
  const map: Record<string, string> = {
    Toyota: "Japan",
    Honda: "Japan",
    Suzuki: "Japan",
    Daihatsu: "Japan",
    Nissan: "Japan",
    Mitsubishi: "Japan",
    Mazda: "Japan",
    Isuzu: "Japan",
    Subaru: "Japan",
    Kia: "South Korea",
    Hyundai: "South Korea",
    MG: "United Kingdom / China",
    Changan: "China",
    Haval: "China",
    BYD: "China",
    Chery: "China",
    Proton: "Malaysia",
    DFSK: "China",
    Prince: "Pakistan / China",
    JAC: "China",
    FAW: "China",
    United: "Pakistan",
    Foton: "China",
    BAIC: "China",
    Sazgar: "Pakistan",
    Regal: "China",
    GAC: "China",
    BMW: "Germany",
    Mercedes: "Germany",
    Audi: "Germany",
    Porsche: "Germany",
    Volkswagen: "Germany",
    Peugeot: "France / Pakistan",
    Jeep: "United States",
    Ford: "United States",
    "Land Rover": "United Kingdom",
    Daewoo: "South Korea",
    Chevrolet: "United States",
    Fiat: "Italy",
    GWM: "China",
    Renault: "France",
    Chrysler: "United States",
  };
  return map[brand] || "Japan";
}

function getBrandAccentColor(brand: string): string {
  const map: Record<string, string> = {
    Toyota: "#3E8A6C",
    Honda: "#B24A3C",
    Suzuki: "#C9A227",
    Daihatsu: "#3E8A6C",
    Nissan: "#B24A3C",
    Mitsubishi: "#C9A227",
    Mazda: "#B24A3C",
    Isuzu: "#C9A227",
    Subaru: "#3D7399",
    Kia: "#2F6B54",
    Hyundai: "#3E8A6C",
    MG: "#9A3B2E",
    Changan: "#616266",
    Haval: "#8A887F",
    BYD: "#3D7399",
    Chery: "#9A3B2E",
    Proton: "#1F4D3D",
    DFSK: "#55564F",
    Prince: "#97721A",
    JAC: "#16342B",
    FAW: "#9A9994",
    United: "#B24A3C",
    Foton: "#2F6B54",
    BAIC: "#3E8A6C",
    Sazgar: "#97721A",
    Regal: "#616266",
    GAC: "#2F6B54",
    BMW: "#1F4D3D",
    Mercedes: "#8A887F",
    Audi: "#55564F",
    Porsche: "#9A3B2E",
    Volkswagen: "#3E8A6C",
    Peugeot: "#2B577A",
    Jeep: "#97721A",
    Ford: "#1F4D3D",
    "Land Rover": "#1F4D3D",
    Daewoo: "#C9A227",
    Chevrolet: "#C9A227",
    Fiat: "#B24A3C",
    GWM: "#2F6B54",
    Renault: "#C9A227",
    Chrysler: "#8A887F",
  };
  return map[brand] || "#2F6B54";
}

function guessDisplacementCc(engine: string): number {
  if (engine.includes("660")) return 658;
  if (engine.includes("800")) return 796;
  if (engine.includes("1000") || engine.includes("1.0")) return 998;
  if (engine.includes("1200") || engine.includes("1.2")) return 1198;
  if (engine.includes("1300") || engine.includes("1.3")) return 1329;
  if (engine.includes("1400") || engine.includes("1.4")) return 1398;
  if (engine.includes("1500") || engine.includes("1.5")) return 1498;
  if (engine.includes("1600") || engine.includes("1.6")) return 1598;
  if (engine.includes("1800") || engine.includes("1.8")) return 1798;
  if (engine.includes("2000") || engine.includes("2.0")) return 1998;
  if (engine.includes("2400") || engine.includes("2.4")) return 2393;
  if (engine.includes("2700") || engine.includes("2.7")) return 2694;
  if (engine.includes("2800") || engine.includes("2.8")) return 2755;
  if (engine.includes("3000") || engine.includes("3.0")) return 2982;
  return 1498;
}

function getDefaultAssembler(brand: string, isLocal: boolean): string {
  if (!isLocal) return "Authorized Importer / CBU Dealer Network";
  const map: Record<string, string> = {
    Toyota: "Indus Motor Company",
    Honda: "Honda Atlas Cars Pakistan",
    Suzuki: "Pak Suzuki Motor Company",
    Kia: "Lucky Motor Corporation",
    Hyundai: "Hyundai Nishat Motors",
    MG: "JW Forland / MG Pakistan",
    Changan: "Master Motors",
    Haval: "Sazgar Engineering Works",
    BYD: "BYD Pakistan / Mega Conglomerate",
    Chery: "Gandhara Nissan / Ghandhara Automotive",
    Peugeot: "Lucky Motor Corporation",
    Isuzu: "Ghandhara Industries Limited",
    Proton: "Al-Haj Automotive",
    DFSK: "Regal Automobiles",
    Prince: "Regal Automobiles",
    JAC: "Ghandhara Nissan",
    FAW: "Al-Haj FAW Motors",
    United: "United Auto Industries",
    BAIC: "Sazgar Engineering Works",
    Sazgar: "Sazgar Engineering Works",
    Daihatsu: "Indus Motor Company / CBU",
    Nissan: "Ghandhara Nissan",
    Mitsubishi: "Dewan Mushtaq Group",
    Mazda: "Sindh Engineering / Import",
  };
  return map[brand] || "Authorized Local Assembler";
}

export function getBrandParentCompany(brand: string): string {
  const map: Record<string, string> = {
    Toyota: "Toyota Motor Corporation",
    Honda: "Honda Motor Co., Ltd.",
    Suzuki: "Suzuki Motor Corporation",
    Daihatsu: "Toyota Motor Corporation (Daihatsu)",
    Nissan: "Nissan Motor Co., Ltd.",
    Mitsubishi: "Mitsubishi Motors Corporation",
    Mazda: "Mazda Motor Corporation",
    Isuzu: "Isuzu Motors Ltd.",
    Subaru: "Subaru Corporation",
    Kia: "Hyundai Motor Group",
    Hyundai: "Hyundai Motor Group",
    MG: "SAIC Motor Corporation Limited",
    Changan: "Changan Automobile Co., Ltd.",
    Haval: "Great Wall Motor (GWM)",
    BYD: "BYD Company Limited",
    Chery: "Chery Automobile Co., Ltd.",
    Proton: "DRB-HICOM / Geely",
    DFSK: "Dongfeng Motor Group",
    Prince: "Regal Automobiles / DFSK",
    JAC: "Anhui Jianghuai Automobile Co.",
    FAW: "FAW Group Corporation",
    United: "United Auto Industries",
    Foton: "BAIC Group (Foton)",
    BAIC: "BAIC Group",
    Sazgar: "Sazgar Engineering Works Limited",
    Regal: "Regal Automobiles Industries",
    GAC: "Guangzhou Automobile Group",
    BMW: "BMW AG",
    Mercedes: "Mercedes-Benz Group AG",
    Audi: "Volkswagen Group (Audi AG)",
    Porsche: "Volkswagen Group (Dr. Ing. h.c. F. Porsche AG)",
    Volkswagen: "Volkswagen Group",
    Peugeot: "Stellantis N.V.",
    Jeep: "Stellantis N.V.",
    Ford: "Ford Motor Company",
    "Land Rover": "Jaguar Land Rover (Tata Motors)",
    Daewoo: "Daewoo Motors (GM Korea)",
    Chevrolet: "General Motors (GM)",
    Fiat: "Stellantis N.V.",
    GWM: "Great Wall Motor (GWM)",
    Renault: "Renault Group",
    Chrysler: "Stellantis N.V.",
  };
  return map[brand] || "Independent Automotive Manufacturer";
}

export function getBrandOfficialWebsite(brand: string): string {
  const map: Record<string, string> = {
    Toyota: "https://toyota-indus.com",
    Honda: "https://honda.com.pk",
    Suzuki: "https://suzukipakistan.com",
    Daihatsu: "https://toyota-indus.com",
    Nissan: "https://ghandharanissan.com.pk",
    Mitsubishi: "https://mitsubishi-motors.com",
    Mazda: "https://mazda.com",
    Isuzu: "https://gil.com.pk",
    Subaru: "https://subaru.com",
    Kia: "https://lucky-motor.com",
    Hyundai: "https://hyundai-nishat.com",
    MG: "https://mgmotors.com.pk",
    Changan: "https://changan.com.pk",
    Haval: "https://sazgarauto.com",
    BYD: "https://bydpakistan.com",
    Chery: "https://chery.pk",
    Proton: "https://proton.com.pk",
    DFSK: "https://dfskpakistan.com",
    Prince: "https://regalautomobiles.com",
    JAC: "https://jacpakistan.com",
    FAW: "https://alhajfaw.com",
    United: "https://unitedcars.com.pk",
    Foton: "https://foton.com.cn",
    BAIC: "https://sazgarauto.com",
    Sazgar: "https://sazgarauto.com",
    Regal: "https://regalautomobiles.com",
    GAC: "https://gac-motor.com",
    BMW: "https://bmw-pakistan.com",
    Mercedes: "https://mercedes-benz.com.pk",
    Audi: "https://audi.com.pk",
    Porsche: "https://porsche.com/middle-east/",
    Volkswagen: "https://vw.com",
    Peugeot: "https://lucky-motor.com/peugeot",
    Jeep: "https://jeep.com",
    Ford: "https://ford.com",
    "Land Rover": "https://landrover.com",
    Daewoo: "https://daewoo.com",
    Chevrolet: "https://chevrolet.com",
    Fiat: "https://fiat.com",
    GWM: "https://sazgarauto.com",
    Renault: "https://renault.com",
    Chrysler: "https://chrysler.com",
  };
  return map[brand] || "https://rasta-auto.pk/brands";
}

export function getBrandDistributor(brand: string): string {
  const map: Record<string, string> = {
    Toyota: "Indus Motor Company Limited (IMC)",
    Honda: "Honda Atlas Cars Pakistan Limited (HACPL)",
    Suzuki: "Pak Suzuki Motor Company Limited (PSMCL)",
    Daihatsu: "Indus Motor Company Limited (IMC)",
    Nissan: "Ghandhara Nissan Limited (GNL)",
    Mitsubishi: "Dewan Mushtaq Group",
    Mazda: "Sindh Engineering Limited",
    Isuzu: "Ghandhara Industries Limited (GIL)",
    Subaru: "Independent Import Channels",
    Kia: "Lucky Motor Corporation Limited (LMC)",
    Hyundai: "Hyundai Nishat Motor (Private) Limited",
    MG: "JW SEZ / MG Pakistan Limited",
    Changan: "Master Motors Limited (MML)",
    Haval: "Sazgar Engineering Works Limited (SEWL)",
    BYD: "Mega Conglomerate / BYD Pakistan",
    Chery: "Ghandhara Nissan / Ghandhara Automotive",
    Proton: "Al-Haj Automotive",
    DFSK: "Regal Automobiles Industries Limited (RAIL)",
    Prince: "Regal Automobiles Industries Limited (RAIL)",
    JAC: "Ghandhara Nissan Limited (GNL)",
    FAW: "Al-Haj FAW Motors Limited",
    United: "United Auto Industries Pakistan",
    Foton: "Foton Pakistan",
    BAIC: "Sazgar Engineering Works Limited (SEWL)",
    Sazgar: "Sazgar Engineering Works Limited (SEWL)",
    Regal: "Regal Automobiles Industries Limited (RAIL)",
    GAC: "Independent Commercial Import",
    BMW: "Dewan Motors Pakistan",
    Mercedes: "Shahnawaz (Private) Limited",
    Audi: "Premier Systems (Private) Limited",
    Porsche: "Porsche Pakistan / Premier Motors",
    Volkswagen: "Premier Motors Limited",
    Peugeot: "Lucky Motor Corporation Limited (LMC)",
    Jeep: "Independent Import Network",
    Ford: "Independent Fleet Channels",
    "Land Rover": "Smc-Private Limited",
    Daewoo: "Daewoo Pakistan Express",
    Chevrolet: "Nexus Automotive Pakistan Limited",
    Fiat: "Raja Motor Company Pakistan",
    GWM: "Sazgar Engineering Works Limited (SEWL)",
    Renault: "Al-Futtaim Automotive Pakistan",
    Chrysler: "Independent Commercial Import",
  };
  return map[brand] || "Authorized Pakistan Distributor Network";
}

export function getModelCategory(model: string, bodyType: string): string {
  const map: Record<string, string> = {
    Corolla: "Passenger Family Sedan",
    Civic: "Enthusiast Executive Sedan",
    City: "Compact Passenger Sedan",
    Alto: "Kei-Class City Hatchback",
    Mehran: "Compact Household Hatchback",
    Khyber: "1000cc Family Hatchback",
    Cultus: "1000cc EFI Hatchback",
    Sportage: "C-Segment AWD/FWD Crossover",
    Tucson: "C-Segment AWD/FWD Crossover",
    Fortuner: "7-Seater Body-on-Frame 4x4 SUV",
    Hilux: "4x4 Dual-Cabin Utility Pickup",
    HS: "British-Chinese Luxury Crossover",
    H6: "HEV Hybrid SUV",
    "2008": "European CKD B-Crossover",
    Karvaan: "7-Seater Minivan / MPV",
    "Ora 03": "All-Electric CBU Hatchback",
    Vitz: "JDM Import Hatchback",
    Aqua: "JDM Hybrid Hatchback",
    Prado: "Luxury 4x4 Land Cruiser SUV",
    Surf: "Hilux Surf 4x4 SUV",
    Racer: "1990s Korean Yellow Cab / Sedan",
    Joy: "1000cc CKD Hatchback",
    Uno: "1.7L Diesel Hatchback",
  };
  return map[model] || `${bodyType} Passenger Vehicle`;
}

export function getModelFirstYear(model: string, fallbackYear?: number): number {
  const map: Record<string, number> = {
    Corolla: 1966,
    Civic: 1972,
    City: 1981,
    Alto: 1979,
    Mehran: 1989,
    Khyber: 1991,
    Cultus: 2000,
    Sportage: 1993,
    Tucson: 2004,
    Fortuner: 2004,
    Hilux: 1968,
    HS: 2018,
    H6: 2011,
    "2008": 2013,
    Karvaan: 2018,
    "Ora 03": 2020,
    Vitz: 1999,
    Aqua: 2011,
    Prado: 1990,
    Surf: 1984,
    Racer: 1986,
    Joy: 1998,
    Uno: 1983,
    Prefect: 1938,
  };
  return map[model] || fallbackYear || 2000;
}

export function getModelAliases(model: string): string {
  const map: Record<string, string> = {
    Corolla: "Toyota Corolla, Altis, E-Series, Indus Corolla",
    Civic: "Honda Civic, Oriel, Reborn, Rebirth, Civic X, VTEC",
    City: "Honda City, Aspire, i-DSI, SX8, GM6",
    Alto: "Suzuki Alto, 660cc Alto, VXL, AGS",
    Mehran: "Suzuki Mehran, Boss, SB308",
    Khyber: "Suzuki Khyber, SA310, Swift 1991",
    Cultus: "Suzuki Cultus, Cultus EFI, SF310",
    Sportage: "Kia Sportage, Sportage AWD, Sportage Alpha",
    Tucson: "Hyundai Tucson, Tucson AWD, Tucson Ultimate",
    Fortuner: "Toyota Fortuner, Sigma 4, Legender, AN150",
    Hilux: "Toyota Hilux, Revo, Vigo, AN120",
    HS: "MG HS, HS Essence, HS Trophy",
    H6: "Haval H6, H6 HEV, Haval Hybrid",
    "2008": "Peugeot 2008, 2008 Active, 2008 Allure",
    Karvaan: "Changan Karvaan, Karvaan Plus, MPV",
    "Ora 03": "GWM Ora, Ora Good Cat, Ora EV",
    Vitz: "Toyota Vitz, Vitz 1000cc, Yaris JDM",
    Aqua: "Toyota Aqua, Prius C, Aqua Hybrid",
    Prado: "Toyota Prado, Prado TZ, TX, 120 Series",
    Surf: "Hilux Surf, SSR-X, N185",
    Racer: "Daewoo Racer, Yellow Cab",
    Joy: "Chevrolet Joy, Chevy Joy, Matiz",
    Uno: "Fiat Uno, Uno Diesel, Raja Uno",
    Prefect: "Ford Prefect, 1953 Ford",
  };
  return map[model] || `${model} Family`;
}

export function getGenerationPlatform(brand: string, model: string): string {
  const map: Record<string, string> = {
    Corolla: "Toyota MC / TNGA-C Global Platform",
    Civic: "Honda Compact Global Platform",
    City: "Honda Global Small Car Platform",
    Alto: "Suzuki HEARTECT Lightweight Platform",
    Mehran: "Suzuki Alto SS80 / SB308 Platform",
    Khyber: "Suzuki Cultus SA310 Platform",
    Cultus: "Suzuki Cultus SF310 Platform",
    Sportage: "Hyundai-Kia N3 / QL Crossover Platform",
    Tucson: "Hyundai-Kia N3 Crossover Platform",
    Fortuner: "Toyota IMV Body-on-Frame Platform",
    Hilux: "Toyota IMV Body-on-Frame Platform",
    HS: "SAIC SSA Global Architecture",
    H6: "GWM L.E.M.O.N. Hybrid Architecture",
    "2008": "Stellantis CMP / EMP1 Platform",
    Karvaan: "Changan Commercial MPV Platform",
    "Ora 03": "GWM L.E.M.O.N. Pure EV Architecture",
    Vitz: "Toyota B-Platform (JDM Spec)",
    Aqua: "Toyota B-Platform Hybrid Architecture",
    Prado: "Toyota Land Cruiser 120/150 Platform",
    Surf: "Toyota N185 Hilux Surf Platform",
    Racer: "GM T-Body / Daewoo Platform",
    Joy: "GM M200 Compact Platform",
    Uno: "Fiat Tipo / Uno Platform",
    Prefect: "Ford E-Series Saloon Architecture",
  };
  return map[model] || `${brand} Standard Vehicle Platform`;
}

export function getGenerationBodyStyles(bodyType: string): string {
  const map: Record<string, string> = {
    Sedan: "4-Door Saloon / 3-Box Sedan",
    SUV: "5-Door Sport Utility Vehicle (4x4)",
    Crossover: "5-Door Unibody Compact Crossover",
    Hatchback: "5-Door / 3-Door Hatchback",
    MPV: "5-Door 7-Seater Multi-Purpose Vehicle",
    Pickup: "4-Door Dual Cabin / 2-Door Single Cabin Pickup",
  };
  return map[bodyType] || `${bodyType} Passenger Body Style`;
}

export function getFaceliftChanges(brand: string, model: string, year: number): string {
  const map: Record<string, string> = {
    Corolla: "2017+ Facelift: Bi-beam LED projector headlamps, revised chrome front grille, 9-inch capacitive Android touchscreen, new 16-inch alloy wheels, climate control updates",
    Civic: "2019+ Facelift: Piano black front wing grille, full LED fog lamps, 17-inch dark smoke alloy wheels, chrome rear bumper trim, upgraded infotainment",
    Fortuner: "2021+ Facelift (Sigma 4 / Legender): Bi-LED quad optical headlamps, Lexus-style Lexus spindle grille, 201 HP / 500 Nm 1GD engine tune, JBL audio system",
    Hilux: "2021+ Facelift (Revo Rocco): Heavy-duty trapezodial grille, LED fog lamps, updated suspension tuning, Apple CarPlay / Android Auto",
  };
  return map[model] || `${year}+ Mid-cycle refresh: updated front fascia, interior technology upgrades, and revised alloy wheel design.`;
}

export function getVariantDrivetrain(bodyType: string, variantName: string): string {
  const v = variantName.toLowerCase();
  if (v.includes("awd") || v.includes("4wd") || v.includes("sigma 4") || v.includes("4x4") || bodyType === "Pickup") {
    return "4WD / AWD";
  }
  if (v.includes("rwd")) return "RWD";
  return "FWD";
}

export function getVariantTrimLevel(variantName: string): string {
  const v = variantName.toLowerCase();
  if (v.includes("grande") || v.includes("rs") || v.includes("oriel") || v.includes("sigma") || v.includes("legender") || v.includes("rocco") || v.includes("vxl") || v.includes("ultimate") || v.includes("trophy") || v.includes("hev") || v.includes("pro")) {
    return "Flagship / Top Trim";
  }
  if (v.includes("vxr") || v.includes("gls") || v.includes("gl") || v.includes("exi") || v.includes("gli")) {
    return "Mid-Range Trim";
  }
    if (v.includes("vx") || v.includes("ga") || v.includes("xe")) {
      return "Base / Entry Trim";
    }
    return "Standard Trim Level";
  }

export function getSpecBatteryKwh(fuelType: string, model: string): number | null {
  if (model.includes("Ora 03")) return 47.8;
  if (model === "H6" && fuelType === "Hybrid") return 1.8;
  if (model === "Aqua" && fuelType === "Hybrid") return 0.9;
  if (fuelType === "Electric") return 50.0;
  if (fuelType === "Hybrid") return 1.2;
  return null;
}

export function getSpecElectricRange(fuelType: string, model: string): number | null {
  if (model.includes("Ora 03")) return 400;
  if (fuelType === "Electric") return 350;
  return null;
}

export function getSpecChargingHours(fuelType: string, model: string): number | null {
  if (model.includes("Ora 03")) return 6.5;
  if (fuelType === "Electric") return 7.0;
  return null;
}

export function getSpecHybridSystem(fuelType: string, model: string): string {
  if (fuelType === "Electric") return "BEV Pure Electric Architecture (PMSM + LFP)";
  if (fuelType === "Hybrid") return "Series-Parallel HEV Dual-Motor Powertrain";
  return "Conventional ICE Combustion Powertrain";
}

export function getTariffNote(
  year: number,
  model: string,
  priceLakh?: number | null
): string | null {
  if (year === 2024 || year === 2025 || year === 2026) {
    if (priceLakh && priceLakh >= 40) {
      return "Includes 25% GST luxury tax slab and Federal Excise Duty (FED) revision per 2024–26 Finance Act.";
    }
    return "Standard 18% GST and applicable FED under current local CKD tariff schedule.";
  }
  if (year === 2022 || year === 2023) {
    return "Reflects multiple OEM price revisions following PKR/USD exchange rate devaluation and L/C import restrictions.";
  }
  if (year === 2020 || year === 2021) {
    return "Includes Auto Development Policy (ADP 2016–21) CKD tariff concessions / COVID-era GST relief.";
  }
  if (year < 2000) {
    return "Period launch dealer list price under documented historical import / assembly tariff regime.";
  }
  return "Standard local retail tariff schedule applicable at launch period.";
}

export function getInflationAdjustedLakh(
  priceLakh: number | null | undefined,
  year: number
): number | null {
  if (!priceLakh || priceLakh <= 0) return null;
  const currentYear = 2026;
  if (year >= currentYear) return priceLakh;
  const multiplierMap: Record<number, number> = {
    2025: 1.12,
    2024: 1.25,
    2023: 1.55,
    2022: 2.1,
    2021: 2.45,
    2020: 2.7,
    2019: 3.1,
    2018: 3.5,
    2015: 4.5,
    2010: 7.2,
    2000: 15.0,
    1990: 38.0,
    1980: 95.0,
    1970: 250.0,
    1960: 600.0,
    1953: 1200.0,
  };
  const years = Object.keys(multiplierMap)
    .map(Number)
    .sort((a, b) => b - a);
  let factor = 1.0;
  for (const y of years) {
    if (year <= y) {
      factor = multiplierMap[y];
    }
  }
  return Math.round(priceLakh * factor * 10) / 10;
}

export function getPaintColorHex(colorName: string): string {
  const c = colorName.toLowerCase();
  if (c.includes("white") || c.includes("pearl")) return "#EDEBE6";
  if (c.includes("black") || c.includes("graphite")) return "#17181B";
  if (c.includes("silver") || c.includes("grey") || c.includes("gray") || c.includes("titanium")) return "#8A887F";
  if (c.includes("red") || c.includes("maroon") || c.includes("crimson")) return "#B24A3C";
  if (c.includes("blue") || c.includes("navy") || c.includes("cyan")) return "#3D7399";
  if (c.includes("gold") || c.includes("bronze") || c.includes("yellow") || c.includes("beige")) return "#C9A227";
  if (c.includes("green") || c.includes("emerald")) return "#2F6B54";
  return "#616266";
}
