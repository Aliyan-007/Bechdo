# RASTA — Automotive Data Research & Contribution Standard

This research standard governs how future automotive contributors, catalog editors, and administrators research, verify, and import new vehicle records into the **RASTA Automotive Intelligence Platform** without contaminating the database.

---

## 1. The Core Research Standard

### Accuracy > Quantity
RASTA is a curated automotive reference database. Never fabricate specifications, local assembly claims, launch dates, or historical prices. A smaller database with trustworthy provenance is vastly more valuable than a giant database full of plausible-looking invented numbers.

### The "No-Fabrication" Rule
* If a technical specification (such as 0–100 km/h acceleration, fuel economy, or ground clearance for a historical vehicle) cannot be confidently established from primary archives, **leave it `null`**.
* Never copy random community blog claims or unverified forum posts into official specification fields.

---

## 2. Source Priority Hierarchy

When verifying automotive data, contributors must prioritize sources in this exact order:
1. **Official Pakistani Manufacturer / Assembler Circulars** (e.g., Indus Motor Company, Honda Atlas Cars Pakistan, Pak Suzuki, Lucky Motor Corp dealer notifications).
2. **Official Manufacturer Technical Documentation** (Global press kits, service manuals).
3. **Historical Manufacturer Brochures & Assembly Archives** (Period print brochures).
4. **Government & Regulatory Records** (Engineering Development Board CKD lists, Pakistan Bureau of Statistics, tariff circulars).
5. **Reputable Pakistani Automotive Journalism** (Verified road tests, historical automotive print publications).
6. **Established Industry Databases** (Verified international automotive registries).
7. **Dealer Price Lists** (Authorized dealership sticker sheets).
8. **Historical Print Advertisements** (Verified newspaper or magazine ads).
9. **Community / Enthusiast Sources** (Use ONLY as supporting background context).

---

## 3. Publication Workflow (`DRAFT` → `RESEARCH` → `REVIEW` → `VERIFIED` → `PUBLISHED`)

To prevent unverified records from appearing publicly, RASTA separates **Market Availability Status** from **Editorial Publication Workflow Status**.

```
[DRAFT]
  ↳ Initial raw data ingestion from dealer circulars or import JSON.
[RESEARCH]
  ↳ Contributor actively verifying powertrain, dimensions, and assembly partner.
[REVIEW]
  ↳ Record submitted to Chief Editor or Administrator for verification check.
[VERIFIED]
  ↳ All required provenance fields (sourceType, lastVerified) confirmed.
[PUBLISHED]
  ↳ Approved for public display across `/cars`, `/`, `/compare`, `/history`, and `/sitemap.xml`.
```

---

## 4. How to Import New Vehicles (`prisma/data/import-catalog.json`)

1. Add your structured vehicle JSON item to `prisma/data/import-catalog.json` adhering to `CatalogImportItemSchema`:
   * Set `status`: `"CURRENT"` | `"DISCONTINUED"` | `"HISTORICAL"` | `"LOCAL_CKD"` | `"CBU"`.
   * Set `sourceType`: `"OFFICIAL_ASSEMBLER"` | `"MARKET_SURVEY"` | `"HISTORICAL_ARCHIVE"`.
   * Set `verificationStatus`: `"VERIFIED"` | `"PARTIALLY_VERIFIED"` | `"UNVERIFIED"`.
   * Provide `aliases` array for common Pakistani names (e.g., `["Corolla Grande", "Grande X"]`).
2. Execute the idempotent seed engine:
   ```bash
   npm run db:seed
   ```
3. Run the automated test suite to ensure zero relational or Zod schema regressions:
   ```bash
   npm test
   ```
