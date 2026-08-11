import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import {
  getSpecBatteryKwh,
  getSpecElectricRange,
  getSpecChargingHours,
  getSpecHybridSystem,
} from "../src/lib/importer";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function updateSpecs() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 14 FEATURE 6: SPECIFICATION SYSTEM AUDIT   ");
  console.log("=========================================================\n");

  const specs = await prisma.specification.findMany({
    include: { variant: { include: { model: true } } },
  });

  console.log(`Auditing and populating Specification System metadata for ${specs.length} verified technical ledgers...\n`);

  let updatedCount = 0;
  for (const s of specs) {
    const fType = s.variant.fuelType;
    const mName = s.variant.model.name;
    await prisma.specification.update({
      where: { id: s.id },
      data: {
        batteryCapacityKwh: getSpecBatteryKwh(fType, mName),
        electricRangeKm: getSpecElectricRange(fType, mName),
        chargingTimeHours: getSpecChargingHours(fType, mName),
        hybridSystemType: getSpecHybridSystem(fType, mName),
      },
    });
    updatedCount++;
  }

  console.log(`✅ Successfully updated ${updatedCount} canonical specifications in dev.db with EV & Hybrid Powertrain Architecture!`);
}

updateSpecs()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
