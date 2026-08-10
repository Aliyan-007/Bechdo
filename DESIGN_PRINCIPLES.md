# RASTA PHASE 10 — CORE DESIGN & ART DIRECTION PRINCIPLES

**Document Version:** 1.0.0 (Authoritative Production Standard)  
**Date:** August 10, 2026  
**Scope:** Eight foundational art direction principles extracted from 25 real-world automotive, publication, museum, and luxury product websites.

---

## PRINCIPLE 1 — PHOTOGRAPHY FIRST (THE ZERO-CONTAINER DOCTRINE)

### 1.1 The Rule
Automotive websites must let vehicle photography dominate the viewport. Do not trap primary vehicle photography inside generic rounded cards with borders and shadows (`border border-gray-800 rounded-lg p-6`).

### 1.2 Architectural Execution
- In opening compositions, spotlight features, and vehicle detail headers, the vehicle image sits **directly on the dark canvas (`#0E0F11`)**.
- When placeholder SVG fallbacks are present (`data:image/svg+xml`), they must display the explicit badge: `Illustrative placeholder — Official photography pending` so users are never misled.
- Image aspect ratios are standardized: `16:9` for cinematic hero banners, `16:10` for editorial featured models, and `4:3` for historical archive entries.

---

## PRINCIPLE 2 — TYPOGRAPHY CREATES HIERARCHY (NOT CONTAINERS)

### 2.1 The Rule
Hierarchy must be communicated through typographic scale, weight, and letter spacing—not by wrapping elements in boxes, badges, and glowing borders.

### 2.2 The Three-Font System
1. **Editorial Display (`var(--font-display)` / Fraunces):**
   - Used for vehicle nameplates, manufacturer titles, historical decades (`1980s`), and editorial headlines.
   - Conveys magazine-grade warmth and automotive authority.
2. **Interface Copy (`var(--font-body)` / Manrope):**
   - Used for navigation copy, button labels, descriptions, and editorial storytelling.
   - Provides clean, highly readable modern sans-serif legibility.
3. **Mechanical Data & Pricing (`var(--font-mono)` / IBM Plex Mono):**
   - Strictly used for all numeric specifications: Ex-Factory PKR Lakh prices, horsepower (`HP`), torque (`Nm`), ground clearance (`mm`), seating capacity, and chassis codes (`E170`, `FE`).
   - Ensures tabular alignment and technical credibility.

---

## PRINCIPLE 3 — FEWER COMPONENTS ("LESS UI, BETTER UI")

### 3.1 The Rule
Do not optimize for *"How many components can I add?"* Optimize for *"How little UI can I use to create the strongest experience?"*

### 3.2 Anti-Slop Elimination
- Strictly prohibit decorative AI-slop: zero purple/blue neon gradients, zero glowing borders, zero floating glassmorphism blobs, zero meaningless stats or badges.
- Replace repetitive 3-column SaaS card grids with **Asymmetrical Magazine Compositions** (e.g., an 8-column lead spotlight paired with a 4-column spec summary or horizontal strip).

---

## PRINCIPLE 4 — CONTROLLED INFORMATION DENSITY

### 4.1 The Rule
Data must be dense where precision is required (technical specification sheets, comparison matrices, price provenance) and spacious where emotional connection and storytelling occur (homepage opening composition, historical decade intros).

### 4.2 Application
- **High Density:** On `/compare` and in the Technical Specification Tab of `/cars/[brand]/[model]/[id]`, specifications are presented in clean, tabular monospace rows with clear comparison highlights ("Show Only Differences", "Best Value").
- **Spacious Editorial Rhythm:** On `/` and `/history`, sections breathe with generous vertical whitespace (`py-16 sm:py-24`), allowing photography and typography to resonate.

---

## PRINCIPLE 5 — EDITORIAL RHYTHM & ASYMMETRIC STORYTELLING

### 5.1 The Rule
A website should not feel like an endless vertical stack of cards. Scrolling through RASTA should feel like turning the pages of an authoritative automotive magazine.

### 5.2 Narrative Pacing on `/` (Homepage)
1. **Opening Composition:** Cinematic cover photography with minimal typography (`RASTA | PAKISTAN'S AUTOMOTIVE ARCHIVE | ⌘K`).
2. **The Spotlight:** Asymmetric lead feature story on Pakistan's benchmark vehicle.
3. **Manufacturer Directory:** Typographic A–Z index of all 36 brands.
4. **Pakistan's Automotive Culture & History:** Horizontal timeline milestones (`1950s Ford Prefect` → `1980s Suzuki FX` → `2020s CKD Crossovers`).
5. **Compare Matrix CTA:** Direct portal to side-by-side ex-factory pricing intelligence.

---

## PRINCIPLE 6 — INTERACTION HAS PURPOSE (NO DECORATIVE MOTION)

### 6.1 The Rule
Motion must serve cognitive clarity: explaining navigation, confirming state changes, progressive disclosure, or spatial transition.

### 6.2 Execution
- Use subtle, professional transitions (`duration-200 ease-out`, progressive opacity reveals).
- Prohibit bouncing, spinning, floating, or continuous background video loops.
- Strictly obey user accessibility settings: `prefers-reduced-motion: reduce` disables all non-essential transitions instantly.

---

## PRINCIPLE 7 — ZERO DATA FABRICATION & FIRST-CLASS EVIDENCE

### 7.1 The Rule
Accuracy > Quantity. As an authoritative automotive archive, RASTA must never invent specifications.

### 7.2 Execution
- If a historical specification is unknown (e.g., mileage for the 1953 Ford Prefect), preserve explicit `null` in the database and display `N/A` or `Unverified` in the UI.
- Every vehicle detail page must provide interactive access to the **Authoritative Source Authority Evidence Modal**, showing field-level confidence (`VERIFIED`, `PARTIALLY_VERIFIED`, `ESTIMATED`, `UNVERIFIED`) and direct citations to assembler circulars and EDB archives.

---

## PRINCIPLE 8 — UNIQUELY PAKISTANI AUTOMOTIVE IDENTITY

### 8.1 The Rule
RASTA must reflect 8 decades of Pakistan's unique automotive heritage without resorting to superficial clichés (e.g., pasting green-and-white Pakistani flags on every card).

### 8.2 Authentic Localization
- Use authentic Pakistani automotive terminology: **Ex-Factory PKR Lakh/Crore**, **CKD (Locally Assembled)** vs. **CBU (Official Commercial Import)**, and local variant aliases (*"Indus Corolla"*, *"Reborn"*, *"Eagle Eye"*).
- Celebrate milestone vehicles that defined local mobility: Suzuki FX, Mehran, Cultus Mk2, Corolla E90/E100/E170, Civic EG/EK/FE, and modern CKD pioneers (Sportage, Tucson, H6).
