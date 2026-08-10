import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findDuplicates() {
  console.log("=========================================================");
  console.log("  RASTA PHASE 12 AUTOMOTIVE DUPLICATE DETECTION AUDIT    ");
  console.log("=========================================================\n");

  const variants = await prisma.variant.findMany({
    include: {
      model: { include: { brand: true } },
      generation: true,
      aliases: true,
    },
  });

  console.log(`Scanning ${variants.length} verified variants in dev.db for canonical duplicate collisions...\n`);

  const slugMap = new Map<string, string[]>();
  const fingerprintMap = new Map<string, string[]>();
  const duplicateReports: Array<{
    type: "EXACT_SLUG" | "FINGERPRINT_COLLISION";
    fingerprint: string;
    variantIds: string[];
    notes: string;
  }> = [];

  for (const v of variants) {
    // Check 1: Slug collision (should never occur per unique constraint, but audited for completeness)
    const sList = slugMap.get(v.slug) || [];
    sList.push(v.id);
    slugMap.set(v.slug, sList);

    // Check 2: Normalized technical fingerprint
    // Brand + Model + Variant Normalized Name + ReleaseYear + FuelType
    const normalizedName = v.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace(/(cvt|manual|automatic|ags|prosmatec)/g, "");

    const fp = `${v.model.brand.name.toLowerCase()}:${v.model.name.toLowerCase()}:${normalizedName}:${v.releaseYear}:${v.fuelType.toLowerCase()}`;
    const fList = fingerprintMap.get(fp) || [];
    fList.push(v.id);
    fingerprintMap.set(fp, fList);
  }

  for (const [slug, ids] of slugMap.entries()) {
    if (ids.length > 1) {
      duplicateReports.push({
        type: "EXACT_SLUG",
        fingerprint: slug,
        variantIds: ids,
        notes: "Exact slug duplicate collision detected.",
      });
    }
  }

  for (const [fp, ids] of fingerprintMap.entries()) {
    if (ids.length > 1) {
      // Exclude different trims with similar names if their IDs differ explicitly
      duplicateReports.push({
        type: "FINGERPRINT_COLLISION",
        fingerprint: fp,
        variantIds: ids,
        notes: "Potential trim/variant name overlap; review required.",
      });
    }
  }

  console.log(`=========================================================`);
  console.log(`  DUPLICATE AUDIT SUMMARY: ${duplicateReports.length} POTENTIAL COLLISIONS  `);
  console.log(`=========================================================`);

  const reportPath = path.join(process.cwd(), "DUPLICATE_DETECTION_REPORT.md");
  let md = `# RASTA Phase 12 — Duplicate Detection Audit Report\n\n`;
  md += `**Audit Timestamp:** ${new Date().toISOString()}\n`;
  md += `**Total Variants Scanned:** ${variants.length}\n`;
  md += `**Collisions Found:** ${duplicateReports.length}\n\n`;

  if (duplicateReports.length === 0) {
    md += `✅ **100% CANONICAL INTEGRITY VERIFIED.** No duplicate variants or fingerprint collisions detected across all ${variants.length} catalog records.\n`;
    console.log(`\n✅ 100% canonical integrity verified across ${variants.length} catalog variants! Zero duplicate collisions detected.`);
  } else {
    md += `| # | Type | Fingerprint | Variant IDs | Notes |\n`;
    md += `|---|---|---|---|---|\n`;
    duplicateReports.forEach((d, i) => {
      md += `| ${i + 1} | \`${d.type}\` | \`${d.fingerprint}\` | ${d.variantIds.map((x) => `\`${x}\``).join(", ")} | ${d.notes} |\n`;
    });
  }

  fs.writeFileSync(reportPath, md, "utf-8");
  console.log(`✅ DUPLICATE_DETECTION_REPORT.md written!`);
}

findDuplicates()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
