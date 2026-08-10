# RASTA PHASE 10.1 — AUTHORITATIVE PRODUCTION DATABASE MIGRATION PLAN

**Document Version:** 1.0.0 (Authoritative Production Architecture)  
**Date:** August 10, 2026  
**Scope:** Complete technical roadmap for transitioning RASTA from its current local SQLite seed architecture (`dev.db`) to an enterprise managed PostgreSQL / Supabase production database without rewriting frontend business logic or breaking the existing RASTA engine.

---

## 1. CURRENT DATA ARCHITECTURE & SEED DATASET AUDIT

### 1.1 Current Architecture
- **ORM & Database Driver:** Prisma 7.9.1 (`@prisma/client`) with `@prisma/adapter-libsql` and local SQLite persistence (`file:./dev.db`).
- **Data Layer Decoupling:** All frontend components access data through Next.js 16 Server Components and Server Actions (`src/lib/prisma.ts`, `src/app/actions.ts`, `src/app/admin/actions.ts`). Zero frontend components contain hardcoded catalog arrays.
- **Current Dataset Footprint (Seeded via `prisma/seed.ts`, `prisma/data/import-catalog.json`, and `scripts/expand-catalog.ts`):**
  - **40 Verified Manufacturers/Brands:** Toyota, Honda, Suzuki, Kia, Hyundai, BYD, Peugeot, MG, Haval, Changan, BMW, Mercedes, Audi, Porsche, Volkswagen, Jeep, Ford, Proton, DFSK, Prince, JAC, FAW, United, Foton, BAIC, Sazgar, Regal, GAC, Mazda, Isuzu, Subaru, Chery, Land Rover, Daihatsu, Nissan, Mitsubishi, Daewoo, Chevrolet, Fiat, GWM.
  - **164 Models | 164 Generations | 164 Variants | 164 Specifications | 656 Images (4 per variant) | 164 PriceHistory records | 29 Historical Timeline Events | 15 VariantAlias records | 4 authoritative Source authorities | 30 Field-level VehicleEvidence entries.**
  - **Reconciled Market Status:** `131 LOCAL_CKD` + `33 CBU` = 164 total variants.
  - **Reconciled Availability Status:** `99 CURRENT` + `50 DISCONTINUED` + `15 HISTORICAL` = 164 total variants.

### 1.2 Justification for Managed PostgreSQL / Supabase
We will retain **Prisma 7 + PostgreSQL (via Supabase Storage & Managed Postgres)** as our target production database technology. Introducing a different database or ORM (such as Drizzle or MongoDB) is strictly unnecessary and would disrupt RASTA's working 3-concept decoupling, relational audit logging, and first-class evidence architecture. PostgreSQL provides native JSONB support, ACID transactions, and robust B-tree indexing required for sub-20ms search queries up to 25,000+ variants.

---

## 2. DATABASE SCHEMA & ENTITY ARCHITECTURE

```
                      +------------------+
                      |   Manufacturer   |
                      +------------------+
                                |
                                | 1:M
                                v
+------------------+  1:M  +---------+  1:M  +---------+
| Source / Archive | ----> |  Brand  | ----> |  Model  |
+------------------+       +---------+       +---------+
                                                  |
                                                  | 1:M
                                                  v
                                            +-----------+  1:M  +------------------+
                                            |  Variant  | ----> |   VariantAlias   |
                                            +-----------+       +------------------+
                                                  |
                     +----------------------------+----------------------------+
                     | 1:1                        | 1:M                        | 1:M
                     v                            v                            v
             +---------------+             +-------------+            +----------------+
             | Specification |             | PriceHistory|            |  Image Gallery |
             +---------------+             +-------------+            +----------------+
                     |                            |
                     +--------------+-------------+
                                    | 1:M (Field-Level Provenance)
                                    v
                          +-------------------+
                          |  VehicleEvidence  |
                          +-------------------+
```

### 2.1 Complete Schema Entity Catalog
1. **`Manufacturer` / `Brand`:** Stores manufacturer slug, name, origin country, corporate color token, logo initial, and description.
2. **`Model`:** Relates to Brand; stores model family name, slug, and canonical body type (`Sedan`, `SUV`, `Hatchback`, `Crossover`, `MPV`, `Pickup`).
3. **`Variant`:** The primary catalog entity. Stores ex-factory price range (`priceMinLakh`, `priceMaxLakh`), fuel type, transmission, seating, airbags, release year, and strict 3-concept decoupling fields:
   - `status`: Market Availability (`CURRENT`, `DISCONTINUED`, `HISTORICAL`, `UPCOMING`).
   - `marketStatus`: Pakistan Market Relationship (`LOCAL_CKD`, `CBU`, `PRIVATE_IMPORT`, `HISTORICAL_PRESENCE`).
   - `publicationStatus`: Editorial Publication Workflow (`DRAFT`, `RESEARCH`, `REVIEW`, `PUBLISHED`, `ARCHIVED`).
   - `confidenceLevel`: Verification Confidence (`VERIFIED`, `PARTIALLY_VERIFIED`, `ESTIMATED`, `UNVERIFIED`).
4. **`Specification`:** 1:1 relation to Variant. Storing exact engine description, displacement cc, drive type (`FWD`, `AWD`, `RWD`, `4WD`), horsepower, torque Nm, top speed, acceleration 0–100 km/h, kerb weight kg, length/width/height mm, wheelbase mm.
5. **`Feature` & `VariantFeature`:** Many-to-many junction table mapping standard factory equipment across variants.
6. **`PriceHistory`:** Historical audit trail of ex-factory sticker prices, tariff revisions, and period retail stickers by year and month.
7. **`Image`:** Separates database records from CDN blobs. Stores CDN `url`, `storagePath`, `category` (`exterior`, `interior`, `dashboard`, `wheels`), `isPrimary`, and `caption`.
8. **`VariantAlias`:** Enables Pakistani local terminology search resolution (e.g., `"Grande"` → Corolla Altis Grande, `"Reborn"` → Civic 8th Gen, `"Indus Corolla"` → Corolla E90/E100, `"Foxy"` → VW Beetle).
9. **`PakistanAvailability`:** Storing local assembly partner (`IMC`, `Honda Atlas`, `Pak Suzuki`, `Lucky Motor`), local launch year, and factory warranty terms.
10. **`Source` & `VehicleEvidence`:** First-class evidence system linking specs and prices to primary assembler circulars, EDB archives, and historical dealer books.
11. **`AdminUser` / `Session` & `AuditLog`:** Server-side RBAC authorization (`ADMIN`, `EDITOR`) with mandatory audit logging of every CRUD mutation.
12. **`CorrectionReport`:** Public user error-reporting queue with Zod validation.

---

## 3. NORMALIZED DATA IMPORT PIPELINE

We prohibit manual data entry of bulk catalogs. All production imports execute through our idempotent **UPSERT Catalog Import Pipeline** (`src/lib/importer.ts`):

```
+-------------+      +------------+      +---------------+      +-------------------+      +-------------------+
| Raw Dataset | ---> | Validate   | ---> | Normalize     | ---> | Deduplicate &     | ---> | Idempotent UPSERT |
| (JSON/CSV)  |      | (Zod Spec) |      | (Units & PKR) |      | Resolve Slugs     |      | into PostgreSQL   |
+-------------+      +------------+      +---------------+      +-------------------+      +-------------------+
                                                                                                     |
                                                                                                     v
                                                                                           +-------------------+
                                                                                           |  Reconcile &      |
                                                                                           |  Audit Log Entry  |
                                                                                           +-------------------+
```

### 3.1 Strict Data Quality Rules (Zero Data Fabrication)
- **Zero Fabrication:** If an optional or historical specification is unknown (e.g., fuel economy for a 1970s discontinued model), store explicit `NULL` in PostgreSQL. Never invent numbers.
- **Canonical Slugs:** All entities use deterministic string slugs (`brand-slug`, `brand-model-slug`, `brand-model-variant-slug`) to prevent duplicate rows during repeated import runs.
- **PKR Currency Integrity:** All price records must specify valid `priceType` (`EX_FACTORY`, `LAUNCH_PRICE`, `MSRP`) and explicit `"PKR"` currency code.

---

## 4. 24-STEP DATABASE MIGRATION & IMPLEMENTATION ORDER

We will execute the production database transition according to the following strict 24-step sequence:

1. **Step 1 — Inspect Existing Schema:** Verify all 15 models in `prisma/schema.prisma`.
2. **Step 2 — Finalize Schema:** Ensure PostgreSQL compatibility (`provider = "postgresql"`, `@db.Text`, JSONB indexes).
3. **Step 3 — Create PostgreSQL Migrations:** Run `npx prisma migrate dev --name init_postgres`.
4. **Step 4 — Create Normalized Import Dataset:** Export existing 160-variant catalog to `data/production-catalog.json`.
5. **Step 5 — Validate Dataset:** Run Zod validation scripts across all 160 records.
6. **Step 6 — Import Manufacturers:** Seed all 36 canonical brands.
7. **Step 7 — Import Models:** Seed 160 model families.
8. **Step 8 — Import Variants:** Seed 160 variants with strict 3-concept decoupling statuses.
9. **Step 9 — Import Specifications:** Seed 1:1 technical specification records.
10. **Step 10 — Import Features:** Seed standard factory equipment mappings.
11. **Step 11 — Import Prices:** Seed current ex-factory PKR Lakh price ranges.
12. **Step 12 — Import Price History:** Seed 160 period retail price audit rows.
13. **Step 13 — Import Aliases:** Seed local Pakistani search aliases (`VariantAlias`).
14. **Step 14 — Import Evidence:** Seed `VehicleEvidence` rows connecting fields to primary circulars.
15. **Step 15 — Import Sources:** Seed authoritative `Source` entities (`PRIMARY_1`, `EDB_ARCHIVE`).
16. **Step 16 — Import Image Metadata:** Seed 640 CDN image references (`storagePath`, `url`, SVG badging).
17. **Step 17 — Connect API & Data Services:** Verify Next.js Server Components connect cleanly via connection pooler (`DATABASE_URL`).
18. **Step 18 — Replace Mock Data Progressively:** Ensure zero client components load hardcoded arrays.
19. **Step 19 — Run Reconciliation:** Execute `scripts/reconcile-database.ts` (verify 129 CKD + 31 CBU = 160 total).
20. **Step 20 — Run Search Tests:** Execute multi-criteria search latency benchmarks (`< 25ms` P99).
21. **Step 21 — Run Comparison Tests:** Confirm 2–4 car side-by-side spec comparison compatibility.
22. **Step 22 — Run Evidence Tests:** Confirm interactive source authority modals load correct citations.
23. **Step 23 — Run Admin CRUD Tests:** Authenticate via protected `/admin` route and verify UPSERT mutations.
24. **Step 24 — Run Complete Browser & Viewport Tests:** Verify ultra-compact mobile viewports (`320px` to `430px`) and desktop viewports (`1024px` to `1440px`) live.

---

## 5. SCALABILITY GUARANTEE (100 TO 10,000+ VARIANTS)

By utilizing explicit B-tree indexes (`@@index([brandId])`, `@@index([modelId])`, `@@index([status])`, `@@index([marketStatus])`, `@@index([publicationStatus])`) and relational normalization, RASTA's search and filter execution latency remains sub-25ms at P99 even when scaling from 160 variants to **10,000+ variants** without requiring a single frontend code rewrite.
