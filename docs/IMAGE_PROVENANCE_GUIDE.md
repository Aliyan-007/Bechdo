# RASTA PHASE 13 — AUTOMOTIVE IMAGE PROVENANCE & MEDIA ARCHITECTURE GUIDE

**Document Version:** 1.0.0 (Authoritative Production Standard)  
**Date:** August 10, 2026  
**Scope:** Complete operational specification for managing image assets, provenance attribution, match quality levels, and CDN storage across RASTA's 200-variant Pakistan automotive catalog.

---

## 1. IMAGE METADATA SCHEMA (`model Image`)

Every image asset in RASTA decouples database metadata from CDN binary storage in Supabase Storage (`NEXT_PUBLIC_IMAGE_CDN`):
```prisma
model Image {
  id                 String   @id @default(cuid())
  variantId          String
  url                String
  storagePath        String?
  category           String
  caption            String?
  sortOrder          Int      @default(0)
  isPrimary          Boolean  @default(false)
  altText            String?
  width              Int?     @default(1200)
  height             Int?     @default(800)
  sourceName         String?
  sourceUrl          String?
  sourceType         String?  @default("OFFICIAL_PAKISTAN") // "OFFICIAL_MANUFACTURER", "OFFICIAL_PAKISTAN", "AUTHORIZED_DISTRIBUTOR", "OFFICIAL_PRESS", "OFFICIAL_BROCHURE", "HISTORICAL_ARCHIVE", "LEGITIMATE_SECONDARY", "PLACEHOLDER"
  imageType          String?  @default("EXTERIOR_FRONT") // "EXTERIOR_FRONT", "EXTERIOR_REAR", "EXTERIOR_SIDE", "INTERIOR", "DASHBOARD", "ENGINE", "FEATURE", "HISTORICAL", "PRESS", "BROCHURE"
  imageMatchLevel    String?  @default("EXACT_VARIANT") // "EXACT_VARIANT", "MODEL_YEAR", "GENERATION", "MODEL_ONLY"
  verificationStatus String?  @default("VERIFIED") // "VERIFIED", "REVIEW_REQUIRED", "UNVERIFIED"
  accessedAt         String?  @default("2026-08-09")
  copyrightNotice    String?
  license            String?
  isVerified         Boolean  @default(true)
  variant            Variant  @relation(fields: [variantId], references: [id], onDelete: Cascade)

  @@index([variantId, category])
  @@index([isPrimary])
  @@index([sourceType])
  @@index([imageMatchLevel])
  @@index([verificationStatus])
}
```

---

## 2. EXACT VEHICLE MATCHING QUALITY LEVELS

To prevent misleading users with mismatched model-year photographs, every image is assigned a strict `imageMatchLevel`:
1. **`EXACT_VARIANT`**: Photograph depicts the exact trim, body style, and market specification (e.g., 2026 Corolla Altis Grande PK Spec).
2. **`MODEL_YEAR`**: Photograph depicts the same model and year, but may depict a slightly different trim level.
3. **`GENERATION`**: Photograph depicts the correct chassis generation (e.g., 9th Gen Civic "Rebirth" 2012–2016) from period archival circulars.
4. **`MODEL_ONLY`**: Asset depicts a generic model silhouette (used exclusively for badged SVG illustrative fallbacks).

---

## 3. PRIORITY SELECTION HIERARCHY

When resolving which image to display as `isPrimary: true` in carousels, cards, and detail headers, RASTA evaluates assets in this exact order:
```
1. Official exact-variant image (EXACT_VARIANT + OFFICIAL_PAKISTAN / OFFICIAL_MANUFACTURER)
2. Official model-year image (MODEL_YEAR + OFFICIAL_PAKISTAN)
3. Official generation image (GENERATION + OFFICIAL_PAKISTAN)
4. Official model image (MODEL_ONLY + OFFICIAL_PAKISTAN)
5. Authorized Pakistan distributor image (AUTHORIZED_DISTRIBUTOR)
6. Legitimate historical archive image (HISTORICAL_ARCHIVE)
7. Legitimate secondary image (LEGITIMATE_SECONDARY)
8. Illustrative placeholder (PLACEHOLDER — SVG vector fallback)
```

---

## 4. STRICT PLACEHOLDER & ANTI-AI POLICY

- **Zero AI-Generated Car Renders:** RASTA strictly prohibits uploading AI-generated car images as if they were official vehicle photography.
- **Mandatory Placeholder Badging:** Whenever an image has `sourceType: "PLACEHOLDER"` or `url.startsWith("data:")`, the UI must display the explicit badge:
  `Illustrative placeholder — Official photography pending`
- **Variable Count Standard:** Do not force 4 images per vehicle artificially. If only 1 or 2 official photos exist, display those without creating redundant duplicates.
