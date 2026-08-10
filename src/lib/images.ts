/**
 * RASTA Image Architecture Layer
 * 
 * Provides a unified abstraction for vehicle gallery images and manufacturer logos.
 * Handles:
 * 1. CDN URL resolution (Supabase Storage / Cloudinary / Custom CDN via env NEXT_PUBLIC_IMAGE_CDN)
 * 2. Data-URI SVG resilience for local development and sandboxed previews
 * 3. Graceful fallback generation for missing or broken assets
 */

const IMAGE_CDN_BASE = process.env.NEXT_PUBLIC_IMAGE_CDN || "";

export interface ImageAsset {
  id?: string;
  url?: string | null;
  category?: string;
  caption?: string | null;
}

export function getVehicleImageUrl(
  image?: ImageAsset | null,
  fallbackBrand = "RASTA",
  fallbackModel = "Vehicle",
  fallbackColor = "#2F6B54",
  category = "exterior"
): string {
  if (image?.url) {
    // If it's already a data URI or absolute HTTP(S) URL, return it
    if (
      image.url.startsWith("data:") ||
      image.url.startsWith("http://") ||
      image.url.startsWith("https://")
    ) {
      return image.url;
    }
    // If CDN prefix is configured, prepend it
    if (IMAGE_CDN_BASE) {
      return `${IMAGE_CDN_BASE.replace(/\/$/, "")}/${image.url.replace(/^\//, "")}`;
    }
    return image.url;
  }

  // Generate fallback SVG Data-URI
  return generateFallbackCarSVG(
    fallbackBrand,
    fallbackModel,
    fallbackColor,
    category
  );
}

export function getBrandLogoUrl(
  brand: { logoInitial: string; name: string; color?: string },
  size = 64
): string {
  const bg = brand.color || "#2F6B54";
  const initial = brand.logoInitial || brand.name.charAt(0);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="8" fill="${bg}"/>
      <text x="32" y="42" fill="#EDEBE6" font-family="serif" font-size="28" font-weight="bold" text-anchor="middle">${initial}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function generateFallbackCarSVG(
  brand: string,
  model: string,
  color: string,
  category: string
): string {
  const title = `${brand} ${model} — ${category.toUpperCase()}`;
  const bg = "#17181B";
  const accent = color || "#2F6B54";

  let svgContent = "";
  if (category === "exterior") {
    svgContent = `
      <rect width="600" height="360" fill="${bg}"/>
      <line x1="0" y1="280" x2="600" y2="280" stroke="#2A2C30" stroke-width="2"/>
      <path d="M 80 250 L 120 180 L 220 160 L 380 160 L 480 190 L 520 250 Z" fill="${accent}" opacity="0.85"/>
      <path d="M 140 185 L 220 170 L 370 170 L 450 195 Z" fill="#0E0F11" opacity="0.6"/>
      <circle cx="160" cy="250" r="35" fill="#1F2023" stroke="#9A9994" stroke-width="6"/>
      <circle cx="160" cy="250" r="18" fill="${accent}"/>
      <circle cx="440" cy="250" r="35" fill="#1F2023" stroke="#9A9994" stroke-width="6"/>
      <circle cx="440" cy="250" r="18" fill="${accent}"/>
      <text x="300" y="320" fill="#EDEBE6" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${title}</text>
    `;
  } else if (category === "interior") {
    svgContent = `
      <rect width="600" height="360" fill="${bg}"/>
      <path d="M 100 300 Q 300 220 500 300 L 550 360 L 50 360 Z" fill="#1F2023" stroke="${accent}" stroke-width="3"/>
      <circle cx="220" cy="250" r="60" fill="none" stroke="${accent}" stroke-width="8"/>
      <rect x="320" y="210" width="140" height="80" rx="6" fill="#0E0F11" stroke="#2A2C30" stroke-width="2"/>
      <text x="390" y="255" fill="${accent}" font-family="monospace" font-size="14" text-anchor="middle">MEDIA SYSTEM</text>
      <text x="300" y="50" fill="#EDEBE6" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${title}</text>
    `;
  } else {
    svgContent = `
      <rect width="600" height="360" fill="${bg}"/>
      <circle cx="300" cy="180" r="100" fill="#1F2023" stroke="${accent}" stroke-width="6"/>
      <text x="300" y="190" fill="#EDEBE6" font-family="monospace" font-size="24" font-weight="bold" text-anchor="middle">RASTA PK</text>
      <text x="300" y="320" fill="#9A9994" font-family="sans-serif" font-size="18" text-anchor="middle">${title}</text>
    `;
  }

  const encoded = Buffer.from(svgContent.trim()).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}
