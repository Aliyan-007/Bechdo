# RASTA — PAKISTAN AUTOMOTIVE INTELLIGENCE & REFERENCE ARCHIVE

**Version:** 1.0.0 (Production Candidate — Phase 13 Complete)  
**Database Footprint:** **40 Canonical Brands • 200 Verified Variants • 800 Gallery Assets • 1950s–2020s Chronicle**  
**Design System:** "Less UI, Better UI" (Editorial Magazine Light Mode & Showroom Archive Dark Mode)

---

## 1. About RASTA

RASTA is Pakistan's authoritative automotive intelligence platform and permanent digital reference archive. Built from the ground up for the Pakistani market, RASTA documents 8 decades of local mobility milestones—from early 1950s Ford and Bedford imports to Suzuki's CKD revolution, Indus Corolla dominance, grey-market JDM hybrids, and modern Chinese NEV crossovers.

### Key Features:
* **Strict 3-Concept Decoupling:** Every vehicle explicitly separates Market Availability (`CURRENT`, `DISCONTINUED`, `HISTORICAL`), Pakistan Market Relationship (`LOCAL_CKD`, `CBU`, `PRIVATE_IMPORT`), and Editorial Publication Workflow (`PUBLISHED`, `RESEARCH`).
* **Zero Data Fabrication Policy:** Unknown historical specifications (e.g., 1953 Ford Prefect mileage or EV engine displacement) strictly preserve explicit `NULL` database values without inventing numbers.
* **Pakistani Enthusiast Terminology Resolution:** 287 `VariantAlias` mappings seamlessly resolve local terms (`"Grande"`, `"Reborn"`, `"Rebirth"`, `"Civic X"`, `"Foxy"`, `"Yellow Cab"`, `"Joy"`, `"Uno"`, `"Ora EV"`) directly to canonical chassis generations.
* **First-Class Evidence System:** Relational `Source` and `VehicleEvidence` entities connect field-level specifications and ex-factory PKR Lakh pricing to primary assembler circulars (IMC, Honda Atlas, Pak Suzuki, Lucky Motor, Sazgar) and government EDB registries.
* **Idempotent UPSERT Importer:** Re-runnable catalog pipeline (`src/lib/importer.ts`) that updates existing records and prevents duplicate rows.
* **Printed Automotive Magazine Light Theme:** Deliberately designed light mode (`warm ivory #EFEDE8`, `paper #FFFFFF`, `charcoal ink #17181B`, and `stone border #D8D4CB`) alongside a showroom archive dark theme (`#0E0F11`, `#17181B`).
* **Publication-Grade Image Gallery:** 800 CDN image references with touch swipe gestures, keyboard arrow navigation (`ArrowLeft` / `ArrowRight` / `Escape`), and fullscreen lightbox modal.

---

## 2. Quick Local Start (Windows, macOS, Linux)

### Method 1: Automated Launcher Script (macOS / Linux / WSL / Git Bash)
```bash
chmod +x rasta-run-local.sh
./rasta-run-local.sh
```

### Method 2: Manual Terminal Sequence
```bash
# 1. Install dependencies
npm install

# 2. Create a Supabase Postgres connection string in .env
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# 3. Generate Prisma client and sync the Supabase database
npx prisma generate
npx prisma db push

# 4. Seed verified 200-variant Pakistan automotive catalog
npm run db:seed
npx tsx scripts/expand-catalog.ts
npx tsx scripts/import-research-queue.ts

# 5. Launch development server on http://localhost:3000
npm run dev
```

### Method 3: One-Click Docker Compose
```bash
docker compose up --build
```
Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

---

## 3. Database GUI Browser (Prisma Studio)
To visually inspect, filter, or edit the 40 brands, 200 variants, 800 images, and 66 provenance evidence records in your web browser:
```bash
npx prisma studio
```
Open **[http://localhost:5555](http://localhost:5555)**.

---

## 4. Running the 24-Test Automated Suite
```bash
npm test
```
Executes 24 automated tests across database integrity, mathematical reconciliation, first-class evidence, 3-concept decoupling, zero fabrication null checks, alias resolution, RBAC server actions, Zod schemas, UPSERT idempotency, and sub-25ms search latency.

---

## 5. Demonstration Administrator & Editor Credentials

When testing administrative CRUD mutations, data quality control dashboards, image asset management, or user correction reports on **[http://localhost:3000/admin](http://localhost:3000/admin)**:

* **Administrator Role (`ADMIN`):**
  * Email: `admin@rasta.pk`
  * Password: `admin123`
  * *Enables full CRUD, price tariff revisions, image provenance management, and destructive deletions.*

* **Editor Role (`EDITOR`):**
  * Email: `editor@rasta.pk`
  * Password: `editor123`
  * *Enables variant creation, price updates, and correction report reviews.*

---

## 6. Project Directory Architecture

```
rasta-auto/
├── prisma/
│   ├── schema.prisma            # 18-model relational database schema
│   ├── seed.ts                  # Idempotent database seeder
│   └── data/import-catalog.json # Source dataset
├── src/
│   ├── app/                     # Next.js 16 App Router (/, /cars, /brands, /compare, /history, /admin)
│   ├── components/
│   │   ├── editorial/           # Editorial magazine layouts & navigation
│   │   ├── vehicle/             # Interactive gallery & detail views
│   │   ├── compare/             # Side-by-side technical matrix
│   │   ├── history/             # 8-decade Pakistani automotive timeline
│   │   └── admin/               # 9-tab enterprise catalog manager
│   ├── lib/
│   │   ├── prisma.ts            # Prisma 7 database client
│   │   ├── importer.ts          # Idempotent UPSERT pipeline
│   │   └── validations.ts       # Zod validation schemas
├── scripts/
│   ├── test-all.ts              # 24-test automated test suite (npm test)
│   ├── validate-catalog.ts      # 1,869-point catalog integrity validator
│   ├── validate-images.ts       # 3,200-point image provenance validator
│   ├── find-duplicates.ts       # Canonical duplicate detection scanner
│   ├── run-performance-benchmark.ts # 9-category empirical latency benchmark
│   └── test-search-quality.ts   # 22-query Pakistani alias evaluator
├── public/
│   └── design-references/       # Editorial moodboards & design references
├── RASTA_LOCAL_RUN_GUIDE.md     # Authoritative local setup guide
├── DATABASE_MIGRATION_PLAN.md   # PostgreSQL / Supabase production migration plan
├── RASTA_MIGRATION_REPORT.md    # Complete cumulative engineering report
└── rasta-run-local.sh           # One-click automated launcher script
```
