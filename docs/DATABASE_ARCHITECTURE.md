# RASTA — Production Database Architecture & Data Model

This document outlines the relational database architecture, indexing strategy, data provenance model, and Pakistani market modeling for the **RASTA Automotive Intelligence Platform**.

---

## 1. Domain Hierarchy & Relational Schema

RASTA models the automotive market using a normalized relational hierarchy in Prisma (`prisma/schema.prisma`):

```
Brand (30 Manufacturers)
  └── Model (e.g., "Corolla", "Civic", "Sportage", "Alto")
        ├── Generation (e.g., "E170 / 11th Gen", "FE / 11th Gen")
        │     └── Facelift (e.g., "2021 Facelift", "2023 MY")
        └── Variant (118+ Verified Trims, e.g., "1.8 Altis Grande CVT-i", "Alpha AWD")
              ├── Specification (Powertrain, dimensions, boot space, clearance, airbags)
              ├── Image (4 gallery categories: exterior, interior, dashboard, wheels)
              ├── PriceHistory (Multi-year price records with priceType & currency)
              ├── PakistanAvailability (CKD Local Assembly vs. CBU Import profile)
              └── VehicleFeature (Standard & optional factory equipment)
```

### Key Entities
1. **`Brand`**: Represents automotive manufacturers. Tracks `name`, stable `slug`, `logoInitial`, HEX `color`, `country` of origin, and `isPakistaniAssembled` status.
2. **`Model`**: Groups variants under a nameplate. Tracks `bodyType`, `popularityScore`, and `isHistorical`.
3. **`Generation` & `Facelift`**: Captures platform chassis generations (`code`, `startYear`, `endYear`) and mid-cycle design refreshes.
4. **`Variant`**: The canonical vehicle identity. Uses a stable string ID/slug (`brand-model-trim-year`) so that display name adjustments do not break URLs, compare links, or favorites.
5. **`Specification`**: A 1:1 table storing 20+ technical parameters (`displacementCc`, `horsepower`, `torqueNm`, `topSpeedKmh`, `acceleration0to100`, `kerbWeightKg`, `dimensions`, `airbagsCount`).
6. **`PriceHistory`**: Supports historical and current pricing with explicit currency (`PKR`) and price types (`EX_FACTORY`, `LISTED`, `USED_AVG`, `MSRP`).
7. **`PakistanAvailability`**: Explicitly models Pakistani market context: CKD (local assembly by Indus Motor, Honda Atlas, Pak Suzuki, Lucky Motor, etc.) vs. CBU (imported units), factory warranty terms (`warrantyYears`, `warrantyKm`), and market status (`Available`, `Discontinued`, `Historical Archive`).

---

## 2. Indexing Strategy for Thousands of Records

To ensure O(log n) performance as RASTA scales to thousands of variants, explicit B-tree indexes (`@@index`) are applied across all foreign keys and frequently queried columns:

```prisma
model Variant {
  ...
  @@index([modelId])
  @@index([bodyType])
  @@index([fuelType])
  @@index([status])
  @@index([isFeatured])
  @@index([isPopular])
  @@index([isRecentlyAdded])
  @@index([priceMinLakh, priceMaxLakh])
}

model Image {
  ...
  @@index([variantId, category])
}

model PriceHistory {
  ...
  @@index([variantId, year])
}
```

---

## 3. Data Provenance & Source Architecture

To guarantee accuracy and avoid inventing facts, `Variant` and `PriceHistory` include provenance metadata:
* **`sourceType`**: `"OFFICIAL_ASSEMBLER"`, `"MARKET_SURVEY"`, `"DEALERSHIP"`, `"HISTORICAL_ARCHIVE"`.
* **`verificationStatus`**: `"VERIFIED"` (confirmed sticker price/spec), `"UNVERIFIED"` (dealer reported), `"ESTIMATED"` (used average).
* **`lastVerified`**: Timestamp of last editorial review.
* **`notes`**: Context on tariff revisions, local assembly changes, or historical notes.

---

## 4. Pakistani Automotive Market Context

RASTA explicitly distinguishes between:
* **Locally Assembled (CKD)**: Assembled domestically by authorized partners (*Indus Motor Company*, *Honda Atlas Cars Pakistan*, *Pak Suzuki Motor Company*, *Lucky Motor Corporation*, *Hyundai Nishat Motors*, *Master Motors*, *Sazgar Engineering Works*).
* **Fully Imported (CBU)**: Commercial or luxury imports (*BMW*, *Mercedes-Benz*, *Audi*, *Porsche*, *Jeep*, *BYD Atto 3 / Sealion 6*, *JDM 660cc imports* like Mira e:S, Note e-Power).
* **Market Status**: `"CURRENT"`, `"DISCONTINUED"`, `"HISTORICAL"`, `"UPCOMING"`.
