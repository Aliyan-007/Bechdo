# BECH DO (بیچ دو) — PAKISTAN'S DEFINITIVE AUTOMOTIVE MARKETPLACE & INTELLIGENCE PLATFORM

**Official Public Name:** BECH DO (بیچ دو) — *formerly RASTA*  
**Version:** 25.0.0 (Production Candidate — Phases 1–25 Complete)  
**Homepage Hero Motto:** **`گاڑی خریدیں یا بیچیں`** (*Buy or Sell Cars*) | **`پاکستان کی گاڑیوں کی دنیا`** (*Pakistan's Automotive World*)  
**Database Footprint (23 Models):** **40 Canonical Brands • 200 Verified Variants • 800 Gallery Assets • 477 Used Classifieds • 477 Certified Inspection Reports • 216 OEM 3S Dealerships • 512 Pakistani Driver Reviews • 5 Notifications • 1,024 Automotive Intelligence Analytics Events**  
**Automated Test Verification:** **63/63 PASSED** across **26 Test Categories** (`npm test`)  
**Design System:** "Less UI, Better UI" / No-Slop Editorial Design System (`[data-theme="light"]` printed automotive magazine theme, dark showroom archive theme, and OS system mode)

---

## 1. About BECH DO (بیچ دو)

BECH DO (**بیچ دو**, meaning *"sell it"* in Urdu) is Pakistan's authoritative automotive marketplace, reference archive, and intelligence platform. It combines a rigorous 8-decade historical automotive chronicle (from 1953 Ford Prefect to CKD Suzuki Alto, Indus Corolla, JDM hybrids, and Chinese NEV crossovers) with a publication-grade secondary car marketplace, certified 150-point inspection sheets, and real-time automotive intelligence analytics.

### Key Architectural Pillars:
* **Strict 3-Concept Decoupling:** Every vehicle variant explicitly separates:
  1. *Pakistan Market Relationship:* `LOCAL_CKD`, `CBU`, `PRIVATE_IMPORT`, `HISTORICAL_PRESENCE`
  2. *Market Availability Status:* `CURRENT`, `DISCONTINUED`, `HISTORICAL`, `UPCOMING`
  3. *Editorial Publication Workflow:* `PUBLISHED`, `RESEARCH`, `REVIEW`
  4. *Verification Confidence Level:* `VERIFIED`, `PARTIALLY_VERIFIED`, `ESTIMATED`, `UNVERIFIED`
* **Zero Data Fabrication Standard:** Unknown historical specifications (e.g., 1953 Ford Prefect mileage or unverified historical launch prices) strictly preserve explicit `NULL` database values without inventing or estimating synthetic numbers.
* **Pakistani Enthusiast Terminology Resolution:** 287 `VariantAlias` mappings seamlessly resolve local Pakistani enthusiast vocabulary (`"Grande"`, `"Reborn"`, `"Rebirth"`, `"Civic X"`, `"Foxy"`, `"Yellow Cab"`, `"Joy"`, `"Uno"`, `"Ora EV"`) directly to canonical chassis generations.
* **First-Class Evidence System:** Relational `Source` and `VehicleEvidence` entities connect field-level specifications and ex-factory PKR Lakh pricing to primary assembler circulars (IMC, Honda Atlas, Pak Suzuki, Lucky Motor, Sazgar) and government EDB registries.
* **Phase 24 — Notification & Alert Center (`model Notification`):** Longitudinal user alert ledgers for `PRICE_ALERT`, `NEW_MODEL`, `CORRECTION_RESOLVED`, and `SYSTEM` announcements.
* **Phase 25 — Automotive Intelligence Analytics (`model AnalyticsEvent`):** Longitudinal research tracking across `VIEW_VARIANT`, `COMPARE_PAIR`, `SEARCH_QUERY`, `FAVORITE_ADD`, and `PRICE_ALERT_SET` across Karachi, Lahore, Islamabad, Rawalpindi, and Peshawar.
* **No-Slop Editorial Design System:** Printed automotive magazine light theme (`warm ivory #EFEDE8`, `paper #FFFFFF`, `charcoal ink #17181B`, `stone border #D8D4CB`), dark showroom archive theme (`#0E0F11`, `#17181B`), and system theme switching (`☼ / ☾ / SYS`). Zero purple AI gradients, zero glowing borders, zero floating glass blobs.
* **Public UI Restrictions (Phase 10.1):** Admin links and Favorite/Heart buttons are hidden from public UI. Direct access to protected `/admin` route remains 100% operational for authenticated admins (`admin@rasta.pk`/`admin123`, `editor@rasta.pk`/`editor123`).

---

## 2. Live Preview & Local Execution

### Live Preview in Workspace (Arena Agent Mode)
The Next.js 16 development server is running in the background and bound to `0.0.0.0:3000`.
You can view the full **BECH DO (بیچ دو)** interactive application directly in your browser's **Live Preview** tab!

### Local Terminal Sequence
```bash
# 1. Install dependencies
npm install

# 2. Synchronize Prisma schema with SQLite (dev.db)
npx prisma db push
npx prisma generate

# 3. Verify automated test suite (63/63 PASS across 26 Categories)
npm test

# 4. Launch Next.js 16 development server
npm run dev -- -H 0.0.0.0 -p 3000
```

---

## 3. Verified 23-Model Database Architecture

| Table / Model | Reconciled Record Count | Description |
| :--- | :--- | :--- |
| `Brand` | 40 Canonical Manufacturers | Toyota, Honda, Suzuki, Kia, Hyundai, BYD, Peugeot, MG, Haval, Changan, BMW, Mercedes, Audi, Porsche, Volkswagen, Jeep, Ford, Proton, DFSK, Prince, JAC, FAW, United, Foton, BAIC, Sazgar, Regal, GAC, Mazda, Isuzu, Subaru, Chery, Land Rover, Daihatsu, Nissan, Mitsubishi, Daewoo, Chevrolet, Fiat, GWM |
| `Model` | 116 Canonical Models | Linked to Pakistani brands with historical launch metadata |
| `Generation` | 116 Chassis Generations | Precise chassis codes (e.g. NHP10, E210, FD, FB, FC) |
| `Facelift` | 2 Facelift Milestones | Major mid-cycle visual & specification refreshes |
| `Variant` | 200 Reconciled Variants | 160 `LOCAL_CKD` (80%) + 40 `CBU`/`PRIVATE_IMPORT` (20%); 117 `CURRENT` (58.5%) + 63 `DISCONTINUED`/`HISTORICAL` (41.5%) |
| `VariantSpecification`| 200 Specification Records | Complete engine, dimensions, transmission, and chassis specs |
| `VariantImage` | 800 Gallery Assets | Exactly 4 curated images per variant with official `colorName` and `colorHex` paint swatches |
| `VariantAlias` | 287 Alias Mappings | Pakistani enthusiast vocabulary resolution |
| `PriceHistory` | 461 Longitudinal Records | Historical ex-factory PKR prices with tariff notes and inflation adjustments |
| `PakistanAvailability`| 200 Market Ledgers | Assembly status, CKD/CBU import codes, launch/discontinuation dates |
| `Feature` | 25 Factory Equipment Items | Standard equipment dictionary (6 Airbags, ADAS, Dual-Zone AC, Sunroof, etc.) |
| `VehicleFeature` | 5,000 Categorized Ledgers | `3,295 STANDARD`, `846 OPTIONAL`, `592 NOT_AVAILABLE`, `267 UNKNOWN` |
| `HistoricalEvent` | 54 Timeline Milestones | 8-decade Pakistani automotive chronicle from 1953 to present |
| `UsedListing` | 477 Secondary Market Ads | Active Pakistani used car classifieds across Karachi, Lahore, and Islamabad |
| `InspectionReport` | 477 Certified Inspections | 150-point technical inspection sheets with CBU Japanese auction sheet grades |
| `Dealership` | 216 OEM 3S Showrooms | Authorized sales, service, and spare parts dealerships |
| `Review` | 512 Owner Reviews | Verified Pakistani driver reviews across AC, Suspension, Fuel, Resale, Overall |
| `Notification` | 5 User Alert Records | Longitudinal alert center records (`PRICE_ALERT`, `NEW_MODEL`, `CORRECTION_RESOLVED`) |
| `AnalyticsEvent` | 1,024 Research Ledgers | User research action analytics (`VIEW_VARIANT`, `COMPARE_PAIR`, `SEARCH_QUERY`) |
| `Source` | 4 Primary Authorities | IMC, Honda Atlas, Pak Suzuki, EDB registries |
| `VehicleEvidence` | 66 Field-Level Proofs | Provenance references tying specifications to primary circulars |
| `CorrectionReport` | 34 User Corrections | Public feedback reports for catalog verification |
| `Favorite` / `SavedSearch` / `PriceAlert` | 45 Personalization Ledgers | User garage shortlists, search criteria, and target price alerts |

---

## 4. Demonstration Administrator & Editor Credentials

When testing administrative CRUD mutations, data quality control dashboards, image asset management, or user correction reports on **`/admin`**:

* **Administrator Role (`ADMIN`):**
  * Email: `admin@rasta.pk`
  * Password: `admin123`
  * *Enables full CRUD, price tariff revisions, image provenance management, and destructive deletions.*

* **Editor Role (`EDITOR`):**
  * Email: `editor@rasta.pk`
  * Password: `editor123`
  * *Enables variant creation, price updates, and correction report reviews.*

---

## 5. Automated Verification Suite (`npm test`)

```bash
npm test
```

Executes **63 automated tests** across **26 comprehensive categories**:
1. Database Integrity & Relational Constraints
2. Full Catalog Mathematical Reconciliation
3. First-Class Evidence System (`Source` & `VehicleEvidence`)
4. Strict 3-Concept Decoupling (`LOCAL_CKD`/`CBU` vs `CURRENT`/`DISCONTINUED` vs `PUBLISHED`/`RESEARCH`)
5. No-Fabrication Standard (`NULL` preservation check on 1953 Ford Prefect)
6. `VariantAlias` Model & Alias Resolution
7. Server-Side Authorization Protection (RBAC)
8. Zod Validation Schemas
9. Idempotent UPSERT Import Pipeline & Duplicate Detection
10. User Correction Report Action
11. Database Search & Filter Execution Latency (< 25ms benchmark)
12. Comparison Matrix Data Compatibility
13. Price Provenance & Currency Check (`PKR`)
14. Feature Database System (`5,000 VehicleFeatures`)
15. Price History System (`461 PriceHistory` records)
16. Pakistan Market History / Timeline System (`54 HistoricalEvents`)
17. Vehicle Media Database System (`800 VariantImages` with `colorHex` swatches)
18. Used Car Marketplace Architecture (`477 UsedListings`)
19. Dealership Network Architecture (`216 Dealerships`)
20. Showcase System Architecture (`FEATURED`, `POPULAR`, `RECENT`)
21. Saved Garage & Favorites System
22. Saved Searches & Price Alerts Architecture
23. User Reviews & Reliability Rating System (`512 Reviews`)
24. Vehicle Inspection & Auction Sheet Architecture (`477 InspectionReports`)
25. BECH DO (بیچ دو) Phase 24 Notifications System (`5 Notifications`)
26. BECH DO (بیچ دو) Phase 25 Automotive Analytics & Rebrand Check (`1,024 AnalyticsEvents`)

**Current Result:** `63 PASSED | 0 FAILED (100% Pass Rate)`
