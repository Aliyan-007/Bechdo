# RASTA — Editorial Automotive Design System & Component Library

This document establishes the restrained, publication-grade design tokens, typography scale, spacing rules, component guidelines, and motion language for the **RASTA Automotive Intelligence Platform**.

---

## 1. Design Philosophy: "Less UI, Better UI"

RASTA is an authoritative automotive publication and reference archive built for Pakistan. Every interface element must answer:
1. *Why is this here?*
2. *What action does it enable?*
3. *Does it help the user find or understand a vehicle?*
4. *Can it be simplified?*

If a decorative element, paragraph, gradient, or badge does not serve discovery or data verification, it is removed.

---

## 2. Color Palette (Dark & Light Mode)

| Token Name | Dark Theme Value (`default`) | Light Theme Value | Usage |
| :--- | :--- | :--- | :--- |
| `--bg` | `#0E0F11` (Deep Charcoal) | `#EFEDE8` (Warm Off-White) | Page background |
| `--surface` | `#17181B` (Graphite) | `#FFFFFF` (White Surface) | Cards, tables, modals |
| `--surface-elevated` | `#1F2023` (Elevated Graphite) | `#E4E1DA` (Elevated Off-White) | Hover states, active tabs |
| `--border` | `#2A2C30` (Subtle Slate) | `#D8D4CB` (Subtle Beige) | Dividers, card borders |
| `--text` | `#EDEBE6` (Off-White Text) | `#17181B` (Charcoal Text) | Headings, primary copy |
| `--text-dim` | `#9A9994` (Muted Slate) | `#55564F` (Muted Charcoal) | Labels, subheadings |
| `--primary` | `#2F6B54` (Racing Green) | `#1F4D3D` (Deep Green) | Primary CTAs, verified badges |
| `--secondary` | `#C9A227` (Period Gold) | `#97721A` (Dark Gold) | Price stickers, historical tags |
| `--danger` | `#B24A3C` (Crimson) | `#9A3B2E` (Dark Red) | Discontinued tags, delete actions |

---

## 3. Typography Hierarchy

* **Display / Editorial Serif (`var(--font-display)`, Fraunces)**:
  Used exclusively for vehicle nameplates, editorial headings, and major historical milestones.
* **Interface / Body Sans (`var(--font-body)`, Manrope)**:
  Used for navigation, buttons, table headings, and concise interface labels.
* **Numerical & Technical Mono (`var(--font-mono)`, IBM Plex Mono)**:
  Used for **PKR Lakh/Crore prices**, engine displacement (`1,798 cc`), horsepower (`138 HP`), torque (`173 Nm`), and dates (`1983–1989`).

---

## 4. Radius & Border Philosophy

* **Subtle Borders Over Heavy Shadows**: Cards and tables rely on 1px borders (`#2A2C30`) rather than heavy drop-shadows.
* **Intentional Radius Scale**:
  * `--radius-sm` (`2px` / `0.125rem`): Buttons, badges, inputs.
  * `--radius-md` (`4px` / `0.25rem`): Vehicle cards, dialog modals.
  * `--radius-lg` (`6px` / `0.375rem`): Major layout containers.
  * Editorial sections use **zero radius** for sharp publication borders.

---

## 5. Component Library Standard

1. **Buttons (`Button`)**: Minimum 44px touch targets on mobile (`min-h-[44px]`). Clear focus rings (`focus-visible:ring-2 focus-visible:ring-[#2F6B54]`).
2. **Vehicle Cards (`VehicleCard`)**: Prioritizes `IMAGE` → `BRAND` → `Vehicle Name` → `Price` → `Year / status` → `Key specification` → `[View vehicle →]`. Displays `Illustrative placeholder — Official photography pending` tag when asset is an SVG placeholder.
3. **Carousels (`VehicleCarousel`)**: Composed with Embla Carousel React. Supports keyboard arrow keys, mouse drag, touch swipe, responsive sizing (`basis-[88%] sm:basis-[48%] lg:basis-[32%]`), and mobile peek affordance.
4. **Tables (`CompareMatrix`, `/admin`)**: Sticky headers on comparison and catalog tables. Overflow horizontal container (`overflow-x-auto min-w-[760px]`) prevents layout shift on mobile viewports.
5. **Dialogs & Modals (`Dialog`, `Sheet`)**: Composed using Radix primitives with accessible focus trapping, escape key closing, and aria labels.
6. **Forms & Inputs (`Input`, Zod Forms)**: Zod validation schemas provide immediate, descriptive feedback.

---

## 6. Selective Motion Language (Motion Primitives)

* **Restrained Animations**: We use subtle `InView` progressive reveal animations for scrolling historical timelines and carousel transitions.
* **Reduced Motion Compliance**: All animations obey `prefers-reduced-motion: reduce`, ensuring zero accessibility barriers.

---

## 7. Phase 10 Art Direction & Anti-Slop Guidelines

1. **Zero-Container Photography Doctrine**: In hero sections, spotlight features, and vehicle headers, vehicle photography sits directly on `#0E0F11` charcoal canvas without card boxes or decorative borders.
2. **Typography-Led Alphabetical Indexes**: Manufacturer directories (`/brands`) and historical timelines (`/history`) use oversized letterforms (`A`, `B`, `1980s`) and clean tabular rows instead of repeated card grids.
3. **Strict AI-Slop Prohibition**: Zero purple/blue neon AI gradients, zero glowing borders, zero floating glassmorphism blobs, zero meaningless badges or fake statistics.
4. **Interactive Image Gallery**: Vehicle pages support a full interactive gallery with touch swipe, keyboard arrow navigation, and a fullscreen lightbox modal.
