# RASTA PHASE 12 — PAKISTAN AUTOMOTIVE DATA RESEARCH QUEUE

**Document Version:** 1.0.0 (Authoritative Production Standard)  
**Date:** August 10, 2026  
**Scope:** Active research ledger for evaluating, verifying, and normalizing candidate Pakistani market vehicles before importing them into the RASTA production database (`dev.db`).

---

## 1. RESEARCH QUEUE WORKFLOW & STATUSES

Every candidate vehicle must pass through our strict verification pipeline before being imported into PostgreSQL/SQLite:
- **`DISCOVERED`**: Vehicle identified in historical market materials or assembler circulars.
- **`RESEARCHING`**: Investigating trim names, CKD/CBU assembly provenance, and period prices.
- **`SOURCE_FOUND`**: Primary or archive source circular identified.
- **`PRIMARY_VERIFIED`**: Specifications and ex-factory PKR price confirmed via primary source (`PRIMARY_1`).
- **`CROSS_VERIFIED`**: Independent EDB or government registry cross-verification confirmed (`LEVEL 4`).
- **`READY_FOR_IMPORT`**: Normalized Zod schema record compiled in `src/lib/importer.ts`.
- **`IMPORTED`**: Successfully UPSERTED into RASTA production database.
- **`REJECTED`**: Excluded due to lack of credible Pakistan market relationship or unverified claims.

---

## 2. ACTIVE CANDIDATE RESEARCH LEDGER

| # | Manufacturer | Model & Variant | Generation | Approx. Year | Pakistan Relationship | Potential Sources | Research Status | Evidence Status | Notes & Local Terminology |
|---|---|---|---|---|---|---|---|---|---|
| **1** | **Toyota** | Land Cruiser FJ40 4.2L | 40 Series | 1972 | `HISTORICAL_PRESENCE` | Toyota Japan Archives / Pak Gov Fleet | `IMPORTED` | `PRIMARY_VERIFIED` | Iconic 1970s government/military 4x4 Jeep in Pakistan (`"FJ40"`, `"Kaali Jeep"`). |
| **2** | **Toyota** | Corolla E80 1.3 GL | 5th Gen (E80) | 1984 | `CBU` | Indus Motor Archives / Period Ads | `IMPORTED` | `PRIMARY_VERIFIED` | Most popular imported 1980s Corolla sedan in Pakistan (`"84 Corolla"`). |
| **3** | **Toyota** | Corolla EE90 1.3 GL | 6th Gen (E90) | 1989 | `LOCAL_CKD` | IMC Launch Circular (1993) | `IMPORTED` | `PRIMARY_VERIFIED` | First Indus Motor Company CKD Corolla assembled in Karachi (`"Indus Corolla"`). |
| **4** | **Toyota** | Corolla XE 1.3 Manual | 7th Gen (E100) | 1996 | `LOCAL_CKD` | IMC Dealer Tariff 1996 | `IMPORTED` | `CROSS_VERIFIED` | Landmark 1990s CKD Corolla (`"Indus Corolla"`, `"XE"`). |
| **5** | **Toyota** | Hilux Revo G 2.8D | 8th Gen (AN120) | 2021 | `LOCAL_CKD` | IMC Technical Spec Sheet | `IMPORTED` | `PRIMARY_VERIFIED` | Benchmark dual-cabin 4x4 pickup in Pakistan (`"Revo"`, `"Vigo"` lineage). |
| **6** | **Honda** | Civic 1.5 EX (Wanderer) | 3rd Gen (AG/AH) | 1985 | `CBU` | Honda Japan / Period Imports | `IMPORTED` | `PRIMARY_VERIFIED` | 1980s imported Civic hatchback/sedan in Pakistan (`"Wanderer"`). |
| **7** | **Honda** | Civic 1.6 VTi (Oriel) | 6th Gen (EK) | 1996 | `LOCAL_CKD` | Honda Atlas Cars Pakistan Archive | `IMPORTED` | `CROSS_VERIFIED` | First VTEC Civic assembled by Honda Atlas in Lahore (`"EK Civic"`, `"Oriel"`). |
| **8** | **Honda** | Civic 1.8 i-VTEC (Reborn) | 8th Gen (FD/FA) | 2007 | `LOCAL_CKD` | Honda Atlas Launch Circular | `IMPORTED` | `CROSS_VERIFIED` | Cult-classic Pakistani sedan (`"Reborn"`). |
| **9** | **Honda** | Civic 1.8 VTi-Oriel (Rebirth) | 9th Gen (FB) | 2013 | `LOCAL_CKD` | Honda Atlas Tariff 2013 | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | 9th Gen Pakistani Civic (`"Rebirth"`). |
| **10** | **Honda** | Civic 1.5 RS Turbo | 10th Gen (FC) | 2017 | `LOCAL_CKD` | Honda Atlas Spec Sheet | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | 10th Gen Turbo Civic (`"Civic X"`, `"Turbo"`). |
| **11** | **Suzuki** | FX 800 | 1st Gen (SS80) | 1983 | `LOCAL_CKD` | Pak Suzuki Archive Circular 1983 | `IMPORTED` | `CROSS_VERIFIED` | First locally assembled passenger car by Pak Suzuki (`"FX"`). |
| **12** | **Suzuki** | Mehran VX / VXR 800 | 2nd Gen (SB308) | 1989 | `LOCAL_CKD` | Pak Suzuki Production Ledger | `IMPORTED` | `CROSS_VERIFIED` | Pakistan's longest-running national car (`"Mehran"`, `"Boss"`). |
| **13** | **Suzuki** | Khyber GA / GL 1000 | 2nd Gen (SA310) | 1991 | `LOCAL_CKD` | Pak Suzuki Catalog 1991 | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | 1000cc 1990s hatchback (`"Khyber"`). |
| **14** | **Suzuki** | Cultus VXL 1000cc | 2nd Gen (SF310) | 2007 | `LOCAL_CKD` | Pak Suzuki Spec Sheet | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | Pakistani 4-cylinder Cultus hatchback (`"Cultus EFI"`). |
| **15** | **Suzuki** | Alto VXL AGS 660cc | 8th Gen (HA36S) | 2019 | `LOCAL_CKD` | Pak Suzuki Official Brochure | `IMPORTED` | `CROSS_VERIFIED` | Current #1 selling Kei-class CKD hatchback in Pakistan (`"660 Alto"`). |
| **16** | **Hyundai** | Santro Exec 1000cc | 1st Gen (Pak) | 2004 | `LOCAL_CKD` | Dewan Farooque Motors Archive | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | 2000s Korean EFI hatchback assembled by Dewan (`"Santro"`). |
| **17** | **Hyundai** | Shahzore 2.6D Pickup | 3rd Gen (H-100) | 2002 | `LOCAL_CKD` | Dewan Farooque Motors Tariff | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | Dominant 1-ton commercial pickup in Pakistan (`"Shahzore"`). |
| **18** | **Kia** | Pride 1.0L Hatchback | 1st Gen (DA) | 1996 | `LOCAL_CKD` | Naya Daur Motors / Kia Archive | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | 1990s CKD Korean hatchback assembled in Pakistan (`"Kia Pride"`). |
| **19** | **Kia** | Classic 1.3L Sedan | 1st Gen (Avella) | 2000 | `LOCAL_CKD` | Naya Daur Motors / Kia Archive | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | Early 2000s CKD Korean sedan (`"Kia Classic"`). |
| **20** | **Nissan** | Sunny 1.3 LX (B13) | 7th Gen (B13) | 1992 | `CBU` | Ghandhara Nissan / Import Archive | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | Popular 1990s Japanese sedan (`"B13 Sunny"`, `"Nissan Sunny"`). |
| **21** | **Daihatsu** | Cuore CX 850cc | L500 Series | 2003 | `LOCAL_CKD` | Indus Motor Company Circular | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | Locally assembled 850cc automatic/manual hatchback by IMC (`"Cuore"`). |
| **22** | **Mitsubishi** | Pajero 2.5 TD Intercooler | 2nd Gen (V20/V30) | 1994 | `CBU` | Dewan Mushtaq Group / JDM Archive | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | Iconic 1990s SUV in Pakistan government and private ownership (`"Pajero"`). |
| **23** | **Peugeot** | 2008 Active 1.2T | 2nd Gen (P24) | 2022 | `LOCAL_CKD` | Lucky Motor Corporation Spec Kit | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | First European CKD B-crossover assembled in Pakistan (`"Peugeot 2008"`). |
| **24** | **Changan** | Karvaan Plus MPV | 1st Gen | 2020 | `LOCAL_CKD` | Master Motors Official Circular | `READY_FOR_IMPORT` | `PRIMARY_VERIFIED` | Best-selling 7-seater CKD minivan in Pakistan (`"Karvaan"`). |
| **25** | **MG** | HS Essence 1.5T | 1st Gen | 2021 | `LOCAL_CKD` | JW Forland / MG Pakistan Brochure | `READY_FOR_IMPORT` | `CROSS_VERIFIED` | C-segment CKD crossover in Pakistan (`"MG HS"`). |
| **26** | **Haval** | H6 HEV (Hybrid) | 3rd Gen | 2023 | `LOCAL_CKD` | Sazgar Engineering Works Brochure | `READY_FOR_IMPORT` | `CROSS_VERIFIED` | First locally assembled hybrid C-segment SUV in Pakistan (`"H6 HEV"`). |

---

## 3. RESEARCH QUEUE SUMMARY STATS
- **Total Candidate Vehicles in Ledger:** **26**
- **Already Imported & Verified in DB:** **10** (FJ40, E80, EE90, XE, Revo, Wanderer, EK Civic, Reborn, FX, Mehran, Alto).
- **Ready for Immediate Phase 12 Import:** **16** (Rebirth, Civic X, Khyber, Cultus VXL, Santro, Shahzore, Kia Pride, Kia Classic, Nissan Sunny B13, Daihatsu Cuore, Mitsubishi Pajero, Peugeot 2008, Changan Karvaan, MG HS, Haval H6 HEV).
