# RASTA — Pakistan Automotive Database & Editorial Data Standard

This document establishes the canonical terminology, domain hierarchy, Pakistan-market rules, provenance requirements, first-class evidence system (`Source` & `VehicleEvidence`), and publication workflow for the **RASTA Automotive Intelligence Platform**. All future data contributors, import scripts, and editors must adhere to this standard.

---

## 1. Automotive Domain Hierarchy

RASTA represents the automotive catalog as a strict hierarchical relationship in Prisma (`prisma/schema.prisma`):

```
Manufacturer / Brand (36 Manufacturers)
  └── Model (e.g., "Corolla", "Civic", "Sportage", "Alto")
        ├── Generation (e.g., "E80", "E170", "FE", "MK2")
        │     └── Facelift (e.g., "2021 Facelift", "Revo Rocco")
        └── Variant (Canonical Identity, e.g., "1.8 Altis Grande CVT-i", "Alpha AWD")
              ├── Model Year (Specific model year configuration)
              ├── Specification (1:1 technical parameters table)
              ├── Image (4 gallery categories: exterior, interior, dashboard, wheels)
              ├── PriceHistory (Multi-year price records with priceType & currency)
              ├── PakistanAvailability (CKD Local Assembly vs. CBU Import profile)
              ├── VariantAlias (Common Pakistani monikers: "Corolla Grande", "Reborn")
              └── VehicleEvidence (First-Class Evidence linking fields to authoritative sources)
```

### Identity Rule
* **No Display-Name Coupling**: Every variant must use a stable string ID/slug (`brand-model-trim-year`) that never changes when display names are adjusted.
* **No Fake Variants**: Only create a variant when evidence confirms a meaningful difference in trim, engine, transmission, drivetrain, or equipment level.

---

## 2. Strict 3-Concept Decoupling

RASTA explicitly decouples three fundamental classifications. Never conflate these:

### A. Data Verification Confidence (`confidenceLevel` & `verificationStatus`)
* `VERIFIED`: Primary assembler circular or verified historical archive confirmed.
* `PARTIALLY_VERIFIED`: Main specs verified; minor trim details estimated.
* `ESTIMATED`: Used-market average or projected price.
* `UNVERIFIED`: Unverified dealer report awaiting verification.
* `CONFLICTING`: Marked when multiple reputable sources disagree on specs or pricing.

### B. Pakistan Market Status (`marketStatus` & `status`)
Every vehicle record must be classified by its relationship to the Pakistan market:
* `LOCAL_CKD`: Locally assembled from Completely Knocked Down kits by authorized partners (*Indus Motor Company*, *Honda Atlas*, *Pak Suzuki*, *Lucky Motor*, *Hyundai Nishat*, *Master Motors*, *Sazgar*).
* `CBU` / `OFFICIAL_CBU`: Officially imported as a Completely Built Unit by authorized distributors or manufacturers (*BYD*, *BMW*, *Mercedes-Benz*, *Audi*, *Porsche*, *Jeep*, *Ford*).
* `PRIVATE_IMPORT`: Imported via grey-market JDM/European dealer channels (*Daihatsu Mira e:S*, *Nissan Note e-Power*).
* `HISTORICAL` / `HISTORICAL_PRESENCE`: Documented historical presence in Pakistan across 8 decades (1950s–2020s).
* `CURRENT`: Currently marketed in showrooms.
* `DISCONTINUED`: Previously marketed but no longer sold as new.

### C. Editorial Publication Workflow (`publicationStatus`)
* `DRAFT`: Newly ingested record undergoing initial data entry.
* `RESEARCH`: Contributor actively verifying powertrain, dimensions, and assembly partner.
* `REVIEW`: Record awaiting chief editor or administrator review.
* `VERIFIED`: Provenance confirmed against official assembler or historical archives.
* `PUBLISHED`: Approved for public display across `/cars`, `/`, `/compare`, `/history`, and `/sitemap.xml`.
* `ARCHIVED`: Retained in database for audit trail but excluded from public queries.

---

## 3. First-Class Evidence System (`Source` & `VehicleEvidence`)

To answer *"Why does RASTA say this vehicle has this specification?"* without relying solely on an internal `VERIFIED` flag, RASTA uses explicit relational evidence entities:
* **`Source`**: Stores primary references (Indus Motor circulars, EDB manufacturing lists, period brochures) with explicit `reliabilityLevel` (`PRIMARY_1`, `ARCHIVE_2`, `SECONDARY_3`).
* **`VehicleEvidence`**: Links a specific `Variant` to a `Source` for individual fields (`POWERTRAIN_AND_ASSEMBLY_CKD`, `PRICE_EX_FACTORY`, `HISTORICAL_PRESENCE`), recording `claimedValue`, `verificationStatus`, and reviewer notes.

---

## 4. Data Research Standard & The "No-Fabrication" Rule

### A. Zero Fabrication Requirement
**Accuracy > Quantity.** Never invent specifications, local assembly claims, launch dates, or historical prices. If a technical specification (such as 0–100 km/h acceleration or fuel economy for a 1953 Ford Prefect) cannot be confidently established from primary archives, **store `null` / unknown**.

### B. Source Hierarchy
When researching or verifying records, prioritize sources in this exact order:
1. **Official Pakistani Manufacturer / Assembler** (Indus Motor, Honda Atlas, Pak Suzuki, Lucky Motor Corp circulars).
2. **Official Manufacturer Technical Documentation** (Global press kits, technical service manuals).
3. **Historical Manufacturer Brochures & Assembly Archives** (Period print brochures).
4. **Government & Regulatory Records** (Engineering Development Board CKD lists, Pakistan Bureau of Statistics, tariff notifications).
5. **Reputable Pakistani Automotive Journalism** (Verified road tests, historical automotive print publications).
6. **Established Industry Databases** (Verified international automotive registries).
7. **Dealer Documentation** (Authorized dealership price lists).
8. **Historical Archives** (Verified historical newspaper or magazine advertisements).
9. **Community Sources** (Use ONLY as secondary supporting evidence).
