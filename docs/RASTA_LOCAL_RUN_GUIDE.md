# RASTA — PAKISTAN AUTOMOTIVE ARCHIVE: COMPLETE LOCAL SETUP & RUN GUIDE

**Document Version:** 1.0.0 (Authoritative Local Deployment Guide)  
**Date:** August 10, 2026  
**Catalog Footprint:** **40 Canonical Brands • 200 Verified Variants • 800 Registered Images • 1950s–2020s Heritage Timeline**

---

## 1. Prerequisites

Before running RASTA on your local machine, ensure you have:
* **Node.js**: v18.17+ or v20 LTS (Recommended: Node.js v20+ — download from [nodejs.org](https://nodejs.org/)).
* **npm**: v9+ (Included automatically with Node.js).
* **Git**: Installed on your system.
* *(Optional)* **Docker & Docker Compose**: If you prefer containerized deployment without installing Node.js locally.

---

## 2. METHOD 1: One-Click Automated Shell Script (macOS / Linux / Windows WSL)

We have created an automated launcher script **`rasta-run-local.sh`** that installs dependencies, generates the Prisma client, seeds the 200-variant verified Pakistan automotive catalog, and launches the server for you.

### Step-by-Step Instructions:
1. Open your terminal inside the RASTA project root folder.
2. Ensure the launcher script is executable:
   ```bash
   chmod +x rasta-run-local.sh
   ```
3. Execute the launcher script:
   ```bash
   ./rasta-run-local.sh
   ```
4. Choose an option from the interactive menu:
   * **`[1]` Development Server** (`http://localhost:3000` with hot-reloading)
   * **`[2]` Production Build & Server** (Fast optimized bundle on `http://localhost:3000`)
   * **`[3]` Prisma Studio Database GUI** (Inspect the 200 variants on `http://localhost:5555`)
   * **`[4]` Run Full 24-Test Suite** (Execute `npm test`)

---

## 3. METHOD 2: Standard Manual Commands (Windows PowerShell / macOS / Linux)

If you prefer running commands manually in your terminal, follow this exact sequence:

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Generate Prisma Client & Sync Local SQLite Database (`dev.db`)
```bash
npx prisma generate
npx prisma db push
```

### 3.3 Seed & Reconcile the 200-Variant Pakistan Automotive Catalog
```bash
npm run db:seed
npx tsx scripts/expand-catalog.ts
npx tsx scripts/import-research-queue.ts
npx tsx scripts/reconcile-database.ts
```

### 3.4 Launch the Server
* **For Development (Hot-Reloading):**
  ```bash
  npm run dev
  ```
  Open **[http://localhost:3000](http://localhost:3000)** in your browser.

* **For Production (Optimized Prerendered Bundle):**
  ```bash
  npm run build
  npm start
  ```
  Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 4. METHOD 3: One-Click Docker Compose (`docker compose`)

If you have Docker installed, you can launch RASTA without installing Node.js locally:

1. In your terminal in the project folder, run:
   ```bash
   docker compose up --build
   ```
2. The multi-stage Docker build will compile the Next.js 16 bundle, seed the local SQLite database (`dev.db`), and expose the application on **[http://localhost:3000](http://localhost:3000)**.
3. Your local SQLite database changes will persist across container restarts via the `./dev.db:/app/dev.db` volume mount.

---

## 5. Inspecting & Browsing Your Local Database with Prisma Studio

RASTA uses a local SQLite database (`file:./dev.db`) in development. You can visually browse, filter, edit, or inspect all 40 brands, 200 variants, 800 images, and 66 provenance evidence records using **Prisma Studio**:

```bash
npx prisma studio
```
This opens a graphical database explorer in your web browser at **[http://localhost:5555](http://localhost:5555)**.

---

## 6. Running the Automated 24-Test Verification Suite

To verify that your local installation passes 100% of our database, reconciliation, first-class evidence, search latency, and schema integrity tests:

```bash
npm test
```
**Expected Output:**
```
=====================================================
  TEST RESULTS: 24 PASSED | 0 FAILED (100% Pass Rate)
=====================================================
```

---

## 7. Demo Administrator & Editor Credentials

When testing administrative CRUD mutations, data quality dashboards, image asset management, or user correction reports on **[http://localhost:3000/admin](http://localhost:3000/admin)**, use these pre-configured demonstration credentials:

* **Administrator Role (`ADMIN`):**
  * Email: `admin@rasta.pk`
  * Password: `admin123`
  * *Enables full CRUD, price tariff revisions, image provenance management, and destructive deletions.*

* **Editor Role (`EDITOR`):**
  * Email: `editor@rasta.pk`
  * Password: `editor123`
  * *Enables variant creation, price updates, and correction report reviews (destructive deletion disabled).*

---

## 8. Switching to PostgreSQL / Supabase in Production

When deploying RASTA to an enterprise managed PostgreSQL or Supabase production environment:
1. Update your `.env` file with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
2. Update `prisma/schema.prisma` datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Deploy migrations and seed the production database:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   npx tsx scripts/expand-catalog.ts
   npx tsx scripts/import-research-queue.ts
   ```
4. Consult **`DATABASE_MIGRATION_PLAN.md`** for the complete 24-step PostgreSQL implementation sequence.
