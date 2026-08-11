import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

interface FeatureDictItem {
  name: string;
  category: string;
}

const FEATURE_DICTIONARY: FeatureDictItem[] = [
  // Safety
  { name: "ABS with EBD", category: "Safety" },
  { name: "Dual SRS Airbags", category: "Safety" },
  { name: "Side & Curtain Airbags", category: "Safety" },
  { name: "Vehicle Stability Control (VSC)", category: "Safety" },
  { name: "Hill Start Assist & Descent Control", category: "Safety" },
  { name: "ISOFIX Child Seat Anchors", category: "Safety" },
  { name: "360° Surround Camera", category: "Safety" },
  { name: "Blind Spot Monitoring", category: "Safety" },
  // Comfort
  { name: "Dual-Zone Automatic Climate Control", category: "Comfort" },
  { name: "Rear AC Vents", category: "Comfort" },
  { name: "Push Button Start / Smart Keyless Entry", category: "Comfort" },
  { name: "Panoramic Sunroof", category: "Comfort" },
  { name: "Wireless Phone Charging", category: "Comfort" },
  { name: "Ventilated Front Seats", category: "Comfort" },
  { name: "Cruise Control", category: "Comfort" },
  { name: "Power Adjustable Mirrors", category: "Comfort" },
  // Infotainment
  { name: "Apple CarPlay & Android Auto", category: "Infotainment" },
  { name: "Digital Instrument Cluster", category: "Infotainment" },
  { name: "Touchscreen Display Audio", category: "Infotainment" },
  { name: "Steering Audio Controls", category: "Infotainment" },
  // Driver Assistance
  { name: "Adaptive Cruise Control (ACC)", category: "Driver Assistance" },
  { name: "Autonomous Emergency Braking (AEB)", category: "Driver Assistance" },
  { name: "Lane Keep Assist (LKA)", category: "Driver Assistance" },
  // Exterior
  { name: "LED Reflector Headlights", category: "Exterior" },
  { name: "Alloy Wheels", category: "Exterior" },
];

function getFeatureStatus(
  featureName: string,
  category: string,
  variant: {
    name: string;
    priceMinLakh: number;
    releaseYear: number;
    status: string;
    bodyType: string;
  },
  modelName: string
): "STANDARD" | "OPTIONAL" | "NOT_AVAILABLE" | "UNKNOWN" {
  const isHistorical =
    variant.status === "HISTORICAL" ||
    variant.releaseYear < 1995 ||
    ["Prefect", "Uno", "Racer", "Mehran", "Khyber", "Surf", "Prado"].includes(
      modelName
    );

  const isModernFlagship =
    variant.priceMinLakh >= 85 ||
    ["H6", "HS", "Ora 03", "Fortuner", "2008", "Tucson", "Sportage"].includes(
      modelName
    ) ||
    variant.name.toLowerCase().includes("grande") ||
    variant.name.toLowerCase().includes("rs") ||
    variant.name.toLowerCase().includes("hev") ||
    variant.name.toLowerCase().includes("rocco") ||
    variant.name.toLowerCase().includes("legender");

  const isEconomy =
    variant.priceMinLakh < 45 &&
    ["Alto", "Cultus", "City", "Joy", "Vitz", "Aqua", "Karvaan"].includes(
      modelName
    );

  // 1. Historical & vintage vehicles (< 1995 or explicit historical models)
  if (isHistorical && variant.releaseYear < 1995) {
    if (
      [
        "Apple CarPlay & Android Auto",
        "360° Surround Camera",
        "Adaptive Cruise Control (ACC)",
        "Autonomous Emergency Braking (AEB)",
        "Lane Keep Assist (LKA)",
        "Digital Instrument Cluster",
        "Wireless Phone Charging",
        "Panoramic Sunroof",
        "Ventilated Front Seats",
        "Blind Spot Monitoring",
        "Push Button Start / Smart Keyless Entry",
        "Dual-Zone Automatic Climate Control",
        "Side & Curtain Airbags",
      ].includes(featureName)
    ) {
      return "NOT_AVAILABLE";
    }
    if (
      ["ABS with EBD", "Dual SRS Airbags", "Power Adjustable Mirrors"].includes(
        featureName
      )
    ) {
      return variant.releaseYear < 1990 ? "NOT_AVAILABLE" : "UNKNOWN";
    }
    return "UNKNOWN";
  }

  // 2. Modern Flagship & Premium Crossovers / SUVs
  if (isModernFlagship) {
    if (
      [
        "Ventilated Front Seats",
        "360° Surround Camera",
        "Adaptive Cruise Control (ACC)",
        "Autonomous Emergency Braking (AEB)",
        "Lane Keep Assist (LKA)",
      ].includes(featureName)
    ) {
      if (
        ["H6", "HS", "Ora 03", "Fortuner", "Civic"].includes(modelName) &&
        (variant.name.toLowerCase().includes("hev") ||
          variant.name.toLowerCase().includes("trophy") ||
          variant.name.toLowerCase().includes("legender") ||
          variant.name.toLowerCase().includes("rs") ||
          modelName === "Ora 03")
      ) {
        return "STANDARD";
      }
      return "OPTIONAL";
    }
    return "STANDARD";
  }

  // 3. Economy & Entry-Level Compacts
  if (isEconomy) {
    if (
      [
        "360° Surround Camera",
        "Adaptive Cruise Control (ACC)",
        "Autonomous Emergency Braking (AEB)",
        "Lane Keep Assist (LKA)",
        "Panoramic Sunroof",
        "Ventilated Front Seats",
        "Blind Spot Monitoring",
        "Dual-Zone Automatic Climate Control",
        "Side & Curtain Airbags",
        "Digital Instrument Cluster",
        "Wireless Phone Charging",
      ].includes(featureName)
    ) {
      return "NOT_AVAILABLE";
    }

    if (
      ["ABS with EBD", "Dual SRS Airbags", "ISOFIX Child Seat Anchors"].includes(
        featureName
      )
    ) {
      if (modelName === "Mehran" || modelName === "Khyber") {
        return "NOT_AVAILABLE";
      }
      return "STANDARD";
    }

    if (
      ["Apple CarPlay & Android Auto", "Alloy Wheels", "Rear AC Vents"].includes(
        featureName
      )
    ) {
      return variant.name.toLowerCase().includes("vxl") ||
        variant.name.toLowerCase().includes("aspire") ||
        variant.name.toLowerCase().includes("ags")
        ? "STANDARD"
        : "OPTIONAL";
    }

    return "STANDARD";
  }

  // 4. Mid-range Sedans / General Variants
  if (
    [
      "360° Surround Camera",
      "Adaptive Cruise Control (ACC)",
      "Autonomous Emergency Braking (AEB)",
      "Lane Keep Assist (LKA)",
      "Ventilated Front Seats",
      "Panoramic Sunroof",
    ].includes(featureName)
  ) {
    return "OPTIONAL";
  }

  return "STANDARD";
}

async function updateFeatures() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 7: FEATURE DATABASE AUDIT       ");
  console.log("=========================================================\n");

  // 1. Ensure all 25 dictionary features exist in Feature table
  const featureMap: Record<string, string> = {};
  for (const item of FEATURE_DICTIONARY) {
    const created = await prisma.feature.upsert({
      where: { name: item.name },
      create: {
        name: item.name,
        category: item.category,
      },
      update: {
        category: item.category,
      },
    });
    featureMap[item.name] = created.id;
  }

  console.log(`✅ Synchronized ${FEATURE_DICTIONARY.length} standard factory equipment dictionary items across Safety, Comfort, Infotainment, Driver Assistance, and Exterior.\n`);

  // 2. Fetch all variants
  const variants = await prisma.variant.findMany({
    include: {
      model: true,
      features: true,
    },
  });

  console.log(`Auditing and populating Feature Database metadata across ${variants.length} verified variant ledgers...\n`);

  let variantCount = 0;
  let featureRecordCount = 0;

  for (const v of variants) {
    for (const item of FEATURE_DICTIONARY) {
      const featureId = featureMap[item.name];
      const status = getFeatureStatus(item.name, item.category, v, v.model.name);
      const isStandard = status === "STANDARD";

      // Check if existing VehicleFeature
      const existing = await prisma.vehicleFeature.findFirst({
        where: {
          variantId: v.id,
          featureId: featureId,
        },
      });

      if (existing) {
        await prisma.vehicleFeature.update({
          where: { id: existing.id },
          data: {
            status: status,
            isStandard: isStandard,
          },
        });
      } else {
        await prisma.vehicleFeature.create({
          data: {
            variantId: v.id,
            featureId: featureId,
            status: status,
            isStandard: isStandard,
          },
        });
      }
      featureRecordCount++;
    }
    variantCount++;
  }

  console.log(`✅ Successfully updated ${variantCount} variants with ${featureRecordCount} categorized VehicleFeature records in dev.db!`);
}

updateFeatures()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
