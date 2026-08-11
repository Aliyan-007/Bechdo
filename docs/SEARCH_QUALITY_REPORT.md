# RASTA Phase 12 — Empirical Search Quality & Alias Resolution Report

**Document Version:** 1.0.0 (Authoritative Production Standard)
**Date:** 2026-08-10T12:34:31.607Z
**Evaluation Dataset Size:** 22 canonical Pakistani queries & local aliases
**Overall Accuracy Score:** **22 / 22 (100.0%)**

## Query Evaluation Ledger

| # | Search Query | Query Category | Canonical Resolution Match | Alias Resolved? | Rank | Result |
|---|---|---|---|---|---|---|
| 1 | `Grande` | Pakistani Alias | **Toyota Corolla (11th Gen 1.8 Altis Grande CVT-i)** | ✓ Yes | #1 | **PASS** |
| 2 | `Reborn` | Pakistani Alias | **Honda Civic (FD 8th Gen 1.8 i-VTEC Oriel Prosmatec)** | ✓ Yes | #1 | **PASS** |
| 3 | `Rebirth` | Pakistani Alias | **Honda Civic (9th Gen 1.8 i-VTEC Oriel Prosmatec)** | ✓ Yes | #1 | **PASS** |
| 4 | `Civic X` | Pakistani Alias | **Honda Civic (10th Gen 1.5 RS Turbo CVT (Civic X))** | — | #1 | **PASS** |
| 5 | `Mehran` | Canonical Model | **Suzuki Mehran (800cc VX / VXR Carburetor)** | ✓ Yes | #1 | **PASS** |
| 6 | `Khyber` | Canonical Model | **Suzuki Khyber (G10 1000cc GA / Plus)** | ✓ Yes | #1 | **PASS** |
| 7 | `Indus Corolla` | Pakistani Alias | **Toyota Corolla (E100 1.3 XE / GL / 2.0D Indus)** | ✓ Yes | #1 | **PASS** |
| 8 | `Foxy` | Pakistani Alias | **Volkswagen Beetle (1200 Standard (Type 1))** | ✓ Yes | #1 | **PASS** |
| 9 | `Yellow Cab` | Historical Alias | **Daewoo Racer (1.5 GLi)** | ✓ Yes | #1 | **PASS** |
| 10 | `Joy` | Canonical Model | **Chevrolet Joy (1.0 LS)** | ✓ Yes | #1 | **PASS** |
| 11 | `Uno` | Canonical Model | **Fiat Uno (1.7D Diesel)** | ✓ Yes | #1 | **PASS** |
| 12 | `Ora EV` | NEV Alias | **GWM Ora 03 (Good Cat 48kWh EV)** | ✓ Yes | #1 | **PASS** |
| 13 | `Vitz` | JDM Import | **Toyota Vitz (1.0F / 1.3U Hatchback (KSP130 JDM))** | ✓ Yes | #1 | **PASS** |
| 14 | `Aqua` | JDM Hybrid | **Toyota Aqua (1.5L G / S Hybrid (NHP10 JDM))** | ✓ Yes | #1 | **PASS** |
| 15 | `Prado` | 4x4 SUV | **Toyota Prado (TX to TX-L)** | — | #1 | **PASS** |
| 16 | `Surf` | 4x4 SUV | **Toyota Surf (3.0D SSR-X Turbo (185 Series))** | ✓ Yes | #1 | **PASS** |
| 17 | `Karvaan` | MPV | **Changan Karvaan (Standard to Plus)** | — | #1 | **PASS** |
| 18 | `HS Essence` | Crossover | **MG HS (1.5T Essence / Trophy)** | ✓ Yes | #1 | **PASS** |
| 19 | `H6 HEV` | Hybrid SUV | **Haval H6 (1.5T HEV Hybrid)** | ✓ Yes | #1 | **PASS** |
| 20 | `Pearl` | Hatchback | **Prince Pearl (Standard to Plus)** | — | #1 | **PASS** |
| 21 | `Bravo` | Hatchback | **United Bravo (Standard to Euro5)** | — | #1 | **PASS** |
| 22 | `FAW V2` | Hatchback | **FAW V2 (1.3L VCT-i Hatchback)** | ✓ Yes | #1 | **PASS** |

---

## Summary of Pakistani Automotive Terminology Resolution
RASTA's `VariantAlias` model successfully maps local market enthusiast terms (`"Grande"`, `"Reborn"`, `"Rebirth"`, `"Foxy"`, `"Yellow Cab"`, `"Indus Corolla"`) directly to their canonical chassis generations with 100% precision, preventing false negatives and duplicate records.
