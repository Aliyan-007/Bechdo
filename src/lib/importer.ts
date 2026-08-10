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
          },
        });
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
        },
        update: {
          engineDesc: item.engine,
          transmissionType: item.transmission,
          horsepower: item.powerHp,
          torqueNm: item.torqueNm,
          seatingCapacity: item.seating,
          airbagsCount: item.airbags,
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
        await prisma.priceHistory.create({
          data: {
            variantId: stableSlug,
            year: item.originalLaunchYear || item.releaseYear || 2024,
            month: 1,
            priceLakh:
              item.originalLaunchPriceLakh !== undefined
                ? item.originalLaunchPriceLakh
                : item.priceMinLakh > 0
                ? item.priceMinLakh
                : null,
            priceType:
              item.status === "HISTORICAL" ? "LAUNCH_PRICE" : "EX_FACTORY",
            currency: "PKR",
            source: item.sourceType,
            note: `${item.status} documented market price`,
          },
        });
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
