# RASTA — Production Database Schema & Entity Specification

This document provides the authoritative field-level specification for all 18 models in RASTA's relational automotive database (`prisma/schema.prisma`).

---

## 1. Core Automotive Hierarchy Models

### `Brand` (Manufacturer / Assembler)
- `id`: CUID Primary Key
- `name`: Manufacturer brand name (`String`, `@unique`) — e.g. "Toyota", "Honda", "BYD"
- `slug`: Deterministic URL slug (`String`, `@unique`) — e.g. "toyota"
- `logoInitial`: Monogram initial (`String`) — e.g. "TOY"
- `color`: Hex brand color token (`String`) — e.g. "#3E8A6C"
- `country`: Country of origin (`String`) — e.g. "Japan", "China", "Germany"
- `description`: Editorial brand profile (`String`)
- `isPakistaniAssembled`: Local assembly flag (`Boolean`, `@default(true)`)
- **Indexes:** `@@index([isPakistaniAssembled])`

### `Model` (Nameplate Family)
- `id`: CUID Primary Key
- `brandId`: Foreign Key → `Brand.id` (Cascade delete)
- `name`: Model family name (`String`) — e.g. "Corolla", "Civic", "Sportage"
- `slug`: Deterministic URL slug (`String`, `@unique`) — e.g. "toyota-corolla"
- `bodyType`: Canonical body style (`String`) — "Sedan", "SUV", "Hatchback", "Crossover", "MPV", "Pickup"
- `popularityScore`: Search ranking weight (`Int`, `@default(80)`)
- `isHistorical`: Heritage flag (`Boolean`, `@default(false)`)
- **Indexes:** `@@index([brandId])`, `@@index([bodyType])`

### `Generation` (Chassis Lineage)
- `id`: CUID Primary Key
- `modelId`: Foreign Key → `Model.id` (Cascade delete)
- `name`: Generation label (`String`) — e.g. "11th Generation (E170)"
- `code`: Chassis code (`String`) — e.g. "E170", "FE", "MK2"
- `startYear`: Production start year (`Int`)
- `endYear`: Production end year (`Int?`, nullable for active generations)
- `isCurrent`: Active production flag (`Boolean`, `@default(true)`)
- **Indexes:** `@@index([modelId])`

### `Variant` (Trim Level & Market Profile)
- `id`: Primary Key — Deterministic slug (`String`)
- `modelId`: Foreign Key → `Model.id` (Cascade delete)
- `generationId`: Foreign Key → `Generation.id` (Nullable)
- `faceliftId`: Foreign Key → `Facelift.id` (Nullable)
- `name`: Trim name (`String`) — e.g. "1.8 Altis Grande CVT-i"
- `slug`: Canonical URL slug (`String`, `@unique`)
- `priceMinLakh`: Ex-factory minimum price PKR Lakh (`Float`)
- `priceMaxLakh`: Ex-factory maximum price PKR Lakh (`Float`)
- `bodyType`, `fuelType`, `engine`, `transmission`, `seating`: Key technical summary fields
- `mileageKmpl`, `fuelTankL`, `bootSpaceL`, `groundClearanceMm`: Nullable technical fields (Zero Data Fabrication)
- **Strict 3-Concept Decoupling Fields:**
  - `status`: Market Availability — `"CURRENT"`, `"DISCONTINUED"`, `"HISTORICAL"`, `"UPCOMING"`
  - `marketStatus`: Pakistan Relationship — `"LOCAL_CKD"`, `"CBU"`, `"PRIVATE_IMPORT"`, `"HISTORICAL_PRESENCE"`
  - `publicationStatus`: Editorial Workflow — `"DRAFT"`, `"RESEARCH"`, `"REVIEW"`, `"PUBLISHED"`, `"ARCHIVED"`
  - `confidenceLevel`: Data Verification — `"VERIFIED"`, `"PARTIALLY_VERIFIED"`, `"ESTIMATED"`, `"UNVERIFIED"`
- **Indexes:** `@@index([modelId])`, `@@index([bodyType])`, `@@index([fuelType])`, `@@index([status])`, `@@index([marketStatus])`, `@@index([publicationStatus])`, `@@index([confidenceLevel])`, `@@index([priceMinLakh, priceMaxLakh])`

---

## 2. Search Resolution & Localization

### `VariantAlias`
- `id`: CUID Primary Key
- `variantId`: Foreign Key → `Variant.id` (Cascade delete)
- `alias`: Local Pakistani terminology string (`String`) — e.g. "Grande", "Reborn", "Indus Corolla", "Foxy", "Yellow Cab"
- **Indexes:** `@@index([variantId])`, `@@index([alias])`

---

## 3. Provenance & First-Class Evidence System

### `Source`
- `id`: CUID Primary Key
- `title`, `publisher`: Formal document attribution (`String`)
- `sourceType`: `"OFFICIAL_ASSEMBLER"`, `"OFFICIAL_MANUFACTURER"`, `"GOVERNMENT_RECORD"`, `"HISTORICAL_ARCHIVE"`
- `reliabilityLevel`: `"PRIMARY_1"` (Assembler/EDB), `"ARCHIVE_2"` (Period Book), `"SECONDARY_3"`
- **Indexes:** `@@index([sourceType])`, `@@index([reliabilityLevel])`

### `VehicleEvidence`
- `id`: CUID Primary Key
- `variantId`: Foreign Key → `Variant.id` (Cascade delete)
- `sourceId`: Foreign Key → `Source.id` (Cascade delete)
- `fieldName`: Verified field key — `"ENGINE_SPEC"`, `"PRICE_EX_FACTORY"`, `"ASSEMBLY_CKD"`, `"PAKISTAN_AVAILABILITY"`
- `verificationStatus`: `"VERIFIED"`, `"PARTIALLY_VERIFIED"`, `"ESTIMATED"`, `"UNVERIFIED"`, `"CONFLICTING"`
- **Indexes:** `@@index([variantId])`, `@@index([sourceId])`, `@@index([fieldName])`, `@@index([verificationStatus])`

---

## 4. Media & Historical Audit Models

### `Image`
- Separates CDN blob metadata from vehicle data rows.
- Stores CDN `url`, `storagePath`, `category` (`exterior`, `interior`, `dashboard`, `wheels`), `isPrimary`, and `caption`.
- **Indexes:** `@@index([variantId, category])`, `@@index([isPrimary])`

### `PriceHistory`
- Documents sticker prices across market eras by `year`, `month`, `priceLakh`, `priceType` (`EX_FACTORY`, `LAUNCH_PRICE`), and `currency` (`PKR`).
- **Indexes:** `@@index([variantId, year])`, `@@index([priceType])`
