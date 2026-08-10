# RASTA PHASE 11 — AUTHORITATIVE PRODUCTION DATABASE AUDIT

**Document Version:** 1.0.0 (Authoritative Production Standard)  
**Date:** August 10, 2026  
**Scope:** Exhaustive architectural audit of all 18 Prisma models, relations, indexes, foreign keys, unique constraints, and empirical record counts in RASTA's automotive database.

---

## 1. DATABASE SYSTEM OVERVIEW

- **Database ORM:** Prisma 7.9.1 (`@prisma/client`)
- **Adapter & Driver:** `@prisma/adapter-libsql` with SQLite persistence (`file:./dev.db`), fully architected for PostgreSQL / Supabase deployment.
- **Total Registered Models:** 18
- **Empirical Reconciled Catalog Footprint:** 40 Manufacturers, 109 Models, 109 Generations, 2 Facelifts, 164 Verified Variants, 163 VariantAliases, 164 Specifications, 656 Images, 401 PriceHistory records, 164 PakistanAvailability records, 12 Features, 571 VehicleFeatures, 53 HistoricalTimelineEvents, 34 CorrectionReports, 4 Source Authorities, 30 Field-Level VehicleEvidence entries.

---

## 2. COMPLETE MODEL & RELATIONAL AUDIT MATRIX

| Model Name | Purpose | Primary Key | Foreign Keys | Unique Constraints | Explicit Indexes (`@@index`) | Current Record Count | Dependencies (Parent Entities) | Used By (Components / Services) |
|---|---|---|---|---|---|---|---|---|
| **`Brand`** | Represents automotive manufacturers & assemblers in Pakistan (`Toyota`, `Honda`, `BYD`). | `id` (cuid) | None | `name`, `slug` | `[isPakistaniAssembled]` | **40** | None | `/`, `/brands`, `/brands/[slug]`, `/cars`, `/admin`, `importer.ts` |
| **`Model`** | Represents model lines/families (`Corolla`, `Civic`, `Sportage`, `Mehran`). | `id` (cuid) | `brandId` → `Brand.id` (Cascade) | `slug` | `[brandId]`, `[bodyType]` | **109** | `Brand` | `/`, `/cars`, `/cars/[brand]/[model]/[id]`, `/compare`, `/admin` |
| **`Generation`** | Represents generational lineage & chassis codes (`E170`, `FE`, `MK2`). | `id` (cuid) | `modelId` → `Model.id` (Cascade) | None | `[modelId]` | **109** | `Model` | `/cars/[brand]/[model]/[id]`, `/compare`, `importer.ts` |
| **`Facelift`** | Storing mid-cycle refresh documentation within a generation. | `id` (cuid) | `generationId` → `Generation.id` (Cascade) | None | `[generationId]` | **2** | `Generation` | `/cars/[brand]/[model]/[id]`, `importer.ts` |
| **`Variant`** | Primary catalog entity for specific trim levels across Pakistan market eras. | `id` (string slug) | `modelId` → `Model.id`<br>`generationId` → `Generation.id`<br>`faceliftId` → `Facelift.id` | `slug` | `[modelId]`, `[bodyType]`, `[fuelType]`, `[status]`, `[marketStatus]`, `[publicationStatus]`, `[confidenceLevel]`, `[modelYear]`, `[isFeatured]`, `[isPopular]`, `[isRecentlyAdded]`, `[priceMinLakh, priceMaxLakh]` | **164** | `Model`, `Generation`, `Facelift` | All routes, `importer.ts`, `prisma.ts`, server actions, global search |
| **`VariantAlias`** | Enables Pakistani local terminology search resolution (`"Grande"`, `"Reborn"`, `"Foxy"`). | `id` (cuid) | `variantId` → `Variant.id` (Cascade) | None | `[variantId]`, `[alias]` | **163** | `Variant` | Global command search (`⌘K`), `/cars` search filter, `importer.ts` |
| **`Specification`** | 1:1 technical engineering ledger (engine cc, HP, Nm, dimensions, weight). | `id` (cuid) | `variantId` → `Variant.id` (Cascade) | `variantId` | None (1:1 via unique index) | **164** | `Variant` | `/cars/[brand]/[model]/[id]`, `/compare`, `/cars` filters, `importer.ts` |
| **`Image`** | CDN image asset references separated from vehicle data rows. | `id` (cuid) | `variantId` → `Variant.id` (Cascade) | None | `[variantId, category]`, `[isPrimary]` | **656** (4 / var) | `Variant` | `EditorialVehicleGallery.tsx`, all cards, `/compare`, `/history`, `/admin` |
| **`PriceHistory`** | Documenting ex-factory sticker prices & retail history across market eras. | `id` (cuid) | `variantId` → `Variant.id` (Cascade) | None | `[variantId, year]`, `[priceType]` | **401** | `Variant` | `/cars/[brand]/[model]/[id]` History tab, `/admin`, `importer.ts` |
| **`PakistanAvailability`** | Documenting local assembly partner (`IMC`, `Honda Atlas`), launch year, warranty. | `id` (cuid) | `variantId` → `Variant.id` (Cascade) | `variantId` | None (1:1 via unique index) | **164** | `Variant` | `/cars/[brand]/[model]/[id]` Availability tab, `/compare`, `importer.ts` |
| **`Feature`** | Normalized dictionary of factory equipment features (`Sunroof`, `6 Airbags`). | `id` (cuid) | None | `name` | None | **12** | None | `/cars/[brand]/[model]/[id]` Features tab, `importer.ts` |
| **`VehicleFeature`** | Junction table connecting standard equipment across variants. | `id` (cuid) | `variantId` → `Variant.id`<br>`featureId` → `Feature.id` | None | `[variantId]`, `[featureId]` | **571** | `Variant`, `Feature` | `/cars/[brand]/[model]/[id]`, `importer.ts` |
| **`Favorite`** | User favorites persistence mapping. | `id` (cuid) | `variantId` → `Variant.id` (Cascade) | None | `[variantId]`, `[userId]` | **0** | `Variant` | `favorites-provider.tsx`, `/cars?favorites=true` |
| **`HistoricalEvent`** | 8-decade Pakistani automotive timeline milestones (`1950s`–`2020s`). | `id` (cuid) | None | None | `[year]`, `[decade]` | **53** | None | `/`, `/history`, `EditorialArchiveTimeline.tsx` |
| **`AuditLog`** | Server-side RBAC audit trail logging all admin CRUD mutations. | `id` (cuid) | None | None | `[entity, entityId]`, `[createdAt]`, `[action]` | **0** | None | `/admin` Audit Logs tab, `src/app/admin/actions.ts` |
| **`CorrectionReport`** | Public user error-reporting queue with Zod validation. | `id` (cuid) | `variantId` → `Variant.id` (Cascade) | None | `[variantId]`, `[status]`, `[createdAt]` | **34** | `Variant` | `/cars/[brand]/[model]/[id]` Report Error modal, `/admin` Reports tab |
| **`Source`** | First-class authoritative primary & archive references (`PRIMARY_1`, `EDB`). | `id` (cuid) | None | None | `[sourceType]`, `[reliabilityLevel]` | **4** | None | `/cars/[brand]/[model]/[id]` Evidence modal, `importer.ts` |
| **`VehicleEvidence`** | Field-level provenance entries connecting claims (`ENGINE_SPEC`, `PRICE`) to `Source`. | `id` (cuid) | `variantId` → `Variant.id`<br>`sourceId` → `Source.id` | None | `[variantId]`, `[sourceId]`, `[fieldName]`, `[verificationStatus]` | **30** | `Variant`, `Source` | `/cars/[brand]/[model]/[id]` Evidence table & modal, `importer.ts` |

---

## 3. KEY ARCHITECTURAL CONSTRAINTS AUDITED

1. **Strict 3-Concept Decoupling Verified:** Every `Variant` strictly separates:
   - `status` (Market Availability): `CURRENT`, `DISCONTINUED`, `HISTORICAL`, `UPCOMING`.
   - `marketStatus` (Pakistan Market Relationship): `LOCAL_CKD`, `CBU`, `PRIVATE_IMPORT`, `HISTORICAL_PRESENCE`.
   - `publicationStatus` (Editorial Workflow): `DRAFT`, `RESEARCH`, `REVIEW`, `PUBLISHED`, `ARCHIVED`.
   - `confidenceLevel` (Data Verification): `VERIFIED`, `PARTIALLY_VERIFIED`, `ESTIMATED`, `UNVERIFIED`.
2. **Zero Data Fabrication Verified:** Price and specification nullable fields (`priceLakh`, `mileageKmpl`, `displacementCc`) preserve explicit `NULL` in the database when historical records are unknown (e.g., 1953 Ford Prefect mileage).
3. **Idempotent Importer Verified:** All catalog imports run through `importCatalog(items, { updateExisting: true })` in `src/lib/importer.ts`, using canonical string slugs (`brand-model-variant-slug`) with zero duplicate row creation.
