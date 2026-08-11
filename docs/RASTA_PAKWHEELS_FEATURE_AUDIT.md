# RASTA — PAKWHEELS FEATURE EXPANSION & ARCHITECTURAL AUDIT

**Document Version:** 1.0.0 (Authoritative Project Baseline)  
**Date:** August 10, 2026  
**Scope:** Complete structural, database, API, and UI/UX baseline audit of RASTA before beginning progressive PakWheels feature expansion.

---

## 1. CURRENT PROJECT BASELINE SUMMARY

RASTA is a production-oriented Pakistan automotive archive, discovery platform, and technical reference system. Below is the verified empirical baseline of the existing application:

### 1.1 Pages & Routes
* **Public Discovery:** `/` (Homepage), `/cars` (Paginated Catalog & Multi-Criteria Discovery), `/brands` (MoMA A–Z Typographic Index), `/brands/[slug]` (Brand Cover View & Model Index), `/cars/[brand]/[model]/[id]` (6-Tab Technical Reference & Lightbox Gallery), `/compare` (Side-by-Side Spec Matrix), `/history` (8-Decade Heritage Timeline).
* **Protected CMS:** `/admin` (9-Tab Enterprise Catalog Manager, Audit Logs, Data Quality Control, Image Asset Manager, User Correction Reports).
* **System Routes:** `/robots.txt`, `/sitemap.xml`.

### 1.2 Prisma Database Schema & Footprint (`prisma/schema.prisma` — 18 Models)
* **`Brand` (40 records):** Manufacturer name, slug, logo initial, accent color, country of origin, editorial description, local assembly flag (`isPakistaniAssembled`).
* **`Model` (109 records):** Relates to Brand; stores model family name, slug, body type, popularity score, historical flag.
* **`Generation` (109 records):** Generational chassis code (`E170`, `FE`), start/end year, current flag.
* **`Facelift` (2 records):** Mid-cycle refresh year, name, description.
* **`Variant` (200 records):** Primary catalog entity across 8 decades (1950s–2020s). Features strict 3-concept decoupling (`status`, `marketStatus`, `publicationStatus`, `confidenceLevel`), engine, transmission, fuel type, seating, airbags, price range.
* **`VariantAlias` (287 records):** Resolves local Pakistani market enthusiast vocabulary (`"Grande"`, `"Reborn"`, `"Foxy"`, `"Yellow Cab"`, `"Indus Corolla"`).
* **`Specification` (200 records):** 1:1 technical ledger (displacement cc, HP, Nm, top speed, acceleration, dimensions, kerb weight).
* **`Image` (800 records):** Decouples CDN image references from vehicle rows; supports `url`, `storagePath`, `category`, `isPrimary`, `sourceType`, `imageType`, `imageMatchLevel`, `verificationStatus`, `sourceName`, `sourceUrl`, and SVG placeholder badging.
* **`PriceHistory` (437 records):** Period launch prices, sticker tariffs, and retail history across market eras.
* **`PakistanAvailability` (200 records):** Local assembly partner (`IMC`, `Honda Atlas`, `Pak Suzuki`, `Lucky Motor`, `Sazgar`), launch year, warranty terms.
* **`Feature` (12 records) & `VehicleFeature` (571 records):** Reusable standard factory equipment dictionary.
* **`Favorite` (0 records):** Hidden publicly per Phase 10.1 UI cleanup; backend model preserved.
* **`HistoricalEvent` (53 records):** 8-decade Pakistani automotive chronicle milestones (1950s–2020s).
* **`AuditLog` (0 records):** Server-side RBAC audit trail for all admin CRUD mutations.
* **`CorrectionReport` (34 records):** User-submitted data error reports with Zod validation.
* **`Source` (4 records) & `VehicleEvidence` (66 records):** First-class provenance linking technical claims to primary assembler circulars and EDB archives.

### 1.3 Authentication, Authorization & Roles
* **Authentication:** Managed via Server Actions (`loginAction`, `logoutAction` in `src/app/admin/auth-actions.ts`) with session cookies.
* **Roles:**
  * **`ADMIN`:** Full CRUD, price tariff revisions, image provenance management, and destructive deletions (`admin@rasta.pk` / `admin123`).
  * **`EDITOR`:** Variant creation, price updates, correction report reviews (`editor@rasta.pk` / `editor123`).
* **Route Protection:** Protected server-side via `requireAuth(["ADMIN", "EDITOR"])` in all Server Action mutations.

### 1.4 Design System & Responsive Architecture
* **Typography Hierarchy:** Fraunces (`--font-display`), Manrope (`--font-body`), IBM Plex Mono (`--font-mono`).
* **Theme Modes (`☼ / ☾ / SYS`):**
  * **Light Mode:** Printed Automotive Magazine (`warm ivory #EFEDE8`, `paper #FFFFFF`, `charcoal ink #17181B`, `stone border #D8D4CB`).
  * **Dark Mode:** Showroom Archive (`charcoal #0E0F11`, `graphite #17181B`, `stone #EDEBE6`).
* **Responsive Viewports:** Empirically verified across 8 viewports (`320px` to `1440px`) with 0 horizontal overflow errors.
* **Testing Suite:** `npm test` (**24 PASSED | 0 FAILED** across 13 test categories), `npm run build` (~1.6s clean compile).
