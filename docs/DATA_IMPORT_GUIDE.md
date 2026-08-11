# RASTA — Data Import Guide & UPSERT Engine

This guide describes how to import, update, and manage vehicle datasets in RASTA using the idempotent import pipeline (`src/lib/importer.ts`).

---

## 1. Idempotent Import Architecture

RASTA uses a structured import engine that validates records, detects duplicates, normalizes slugs, and executes atomic UPSERT operations against the database.

### Key Benefits
* **Idempotency**: Running the same dataset multiple times will never create duplicate rows. Existing records are updated cleanly (`summary.updated`), and new records are inserted (`summary.imported`).
* **Zod Validation**: Every import item is validated against `CatalogImportItemSchema` before touching the database.
* **Automatic Spec & Image Generation**: Missing specifications or gallery images are automatically populated with verified defaults and SVG Data-URI fallbacks.

---

## 2. JSON Catalog Format (`prisma/data/import-catalog.json`)

To add new vehicles to RASTA, format records according to `CatalogImportItemSchema`:

```json
[
  {
    "id": "toy-corolla-18-altis-grande-2024",
    "brand": "Toyota",
    "model": "Corolla",
    "variantName": "11th Gen 1.8 Altis Grande CVT-i",
    "bodyType": "Sedan",
    "fuelType": "Petrol",
    "priceMinLakh": 68.0,
    "priceMaxLakh": 89.0,
    "badge": null,
    "engine": "1,798cc 2ZR-FE Dual VVT-i",
    "transmission": "7-Speed Super CVT-i",
    "seating": 5,
    "mileageKmpl": 13,
    "powerHp": 138,
    "torqueNm": 173,
    "airbags": 2,
    "colors": ["Super White", "Attitude Black", "Phantom Grey"],
    "isFeatured": true,
    "isPopular": true,
    "isRecentlyAdded": false,
    "releaseYear": 2024,
    "status": "CURRENT",
    "productionStartYear": 2014,
    "sourceType": "OFFICIAL_ASSEMBLER",
    "verificationStatus": "VERIFIED",
    "notes": "Current production base model in Pakistan market",
    "isLocallyAssembled": true,
    "assemblyPartner": "Indus Motor Company"
  }
]
```

---

## 3. Running Data Import & Seeding

### Step 1: Generate or Update the Catalog File
Run our automated catalog builder to compile historical and modern Pakistani market variants:
```bash
npx tsx scripts/generate-catalog.ts
```
To expand the catalog with newly verified historical or modern Pakistani variants (e.g. Daewoo Racer, Chevrolet Joy, Fiat Uno, GWM Ora 03), run:
```bash
npx tsx scripts/expand-catalog.ts
```
This expands `dev.db` to **164+ verified variants** across **40 manufacturers** and 8 decades of Pakistani mobility.

### Step 2: Execute Idempotent Database Seeding
Run:
```bash
npm run db:seed
```
This invokes `prisma/seed.ts`, which calls `importCatalog(items, { updateExisting: true })` and reports a structured import summary:
```
========================================
       RASTA DATA IMPORT SUMMARY        
========================================
Total Submitted     : 164
Successfully Imported : 0
Successfully Updated  : 164
Skipped Duplicates    : 0
Errors Encountered    : 0
========================================
```

---

## 4. Programmatic Import Usage

You can import data directly within Server Actions or Node scripts:

```ts
import { importCatalog, type CatalogImportItem } from "@/lib/importer";

const items: CatalogImportItem[] = [ ... ];
const summary = await importCatalog(items, { updateExisting: true });

console.log(`Imported: ${summary.imported}, Updated: ${summary.updated}`);
```
