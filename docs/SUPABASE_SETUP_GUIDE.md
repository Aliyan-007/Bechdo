# RASTA — SUPABASE (MANAGED POSTGRESQL) PRODUCTION DATABASE & CDN GUIDE

**Document Version:** 1.0.0 (Authoritative Production Standard)  
**Date:** August 10, 2026  
**Catalog Footprint:** **40 Brands • 200 Verified Variants • 800 CDN Image Assets • 66 Field-Level Provenance Entries**

---

## 1. Why Supabase PostgreSQL?

RASTA is architected on **Prisma 7.9.1**, which natively supports both SQLite (`file:./dev.db`) in development and **PostgreSQL** in production. When you switch RASTA to Supabase:
* **Zero Code Changes:** All Next.js Server Components, Server Actions, search queries (`⌘K`), and automated tests continue working unchanged.
* **ACID Transactions & JSONB:** Native PostgreSQL indexing (`@@index([brandId])`, `@@index([status])`, etc.) ensures sub-25ms P99 search execution up to 10,000+ variants.
* **Supabase Storage CDN:** Hosts our 800 vehicle gallery photographs and illustrative SVG fallbacks with global edge caching (`NEXT_PUBLIC_IMAGE_CDN`).

---

## 2. 60-Second Setup Guide

### Step 1: Get Your Supabase Connection Strings
1. Log in to [https://supabase.com](https://supabase.com) and create a new Project (or select an existing one).
2. Go to **Project Settings → Database** and copy:
   * **Connection Pooler URL (Transaction pooler, Port 6543):** Use for `DATABASE_URL`
   * **Direct Connection URL (Session / Direct, Port 5432):** Use for `DIRECT_URL`

### Step 2: Update Your `.env` File
Open `.env` (or create `.env.local`) in your project root and add your Supabase credentials:
```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Optional: Supabase Storage CDN URL for custom uploaded photography
NEXT_PUBLIC_IMAGE_CDN="https://[YOUR-PROJECT-REF].supabase.co/storage/v1/object/public/vehicle-gallery"
```

### Step 3: Run the Automated Supabase Migration & Seeder
In your terminal, execute:
```bash
npm run db:use-supabase
```
This automated command:
1. Replaces `prisma/schema.prisma` with our PostgreSQL-ready `prisma/schema.supabase.prisma`.
2. Generates the Prisma PostgreSQL client (`npx prisma generate`).
3. Deploys all 18 tables and indexes to your Supabase PostgreSQL database (`npx prisma db push`).
4. Seeds all **40 canonical brands**, **200 verified Pakistani market variants** (1950s–2020s), **800 gallery image references**, **287 search aliases**, and **66 field-level provenance evidence records**.
5. Automatically reconciles counts (`npm run db:reconcile`).

---

## 3. Switching Back to Local SQLite (`dev.db`) Anytime

If you want to switch back to local offline development using `dev.db`, simply run:
```bash
npm run db:use-sqlite
```
This restores `DATABASE_URL="file:./dev.db"` and re-syncs your local SQLite schema.

---

## 4. Verification & Testing on Supabase

Once connected to Supabase, verify your production database:
```bash
# 1. Run the full 24-test verification suite against Supabase
npm test

# 2. Start the development server
npm run dev

# 3. Or build and start the optimized production bundle
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to inspect RASTA running live on Supabase PostgreSQL.

---

## 5. Managing Official Photography on Supabase Storage CDN

To upload official manufacturer press kit photographs (IMC, HACPL, Pak Suzuki, LMC) to Supabase Storage:
1. In your Supabase Dashboard, go to **Storage** and create a public bucket named `vehicle-gallery`.
2. Upload high-resolution studio photographs organized by variant slug:
   ```
   vehicle-gallery/
   ├── toy-corolla-altis-grande/
   │   ├── exterior-0.jpg
   │   └── interior-1.jpg
   └── hon-civic-fe-oriel/
       └── exterior-0.jpg
   ```
3. Use the **Image Asset Manager** tab in RASTA's `/admin` portal (`admin@rasta.pk` / `admin123`) to update image URLs to your CDN paths. All changes are logged automatically to `AuditLog`.
