import React from "react";
import { prisma } from "@/lib/prisma";
import { EditorialHero } from "@/components/editorial/EditorialHero";
import { EditorialFeatured } from "@/components/editorial/EditorialFeatured";
import { EditorialBrandDirectory } from "@/components/editorial/EditorialBrandDirectory";
import { EditorialGarage } from "@/components/editorial/EditorialGarage";
import { CompareCta } from "@/components/home/compare-cta";
import { EditorialArchiveTimeline } from "@/components/editorial/EditorialArchiveTimeline";
import { EditorialShowcaseFeed } from "@/components/home/EditorialShowcaseFeed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    totalVehicles,
    totalBrands,
    featuredVariants,
    popularVariants,
    recentVariants,
    rawBrands,
    historicalEvents,
  ] = await Promise.all([
    prisma.variant.count({ where: { publicationStatus: "PUBLISHED" } }),
    prisma.brand.count(),
    prisma.variant.findMany({
      where: { isFeatured: true, publicationStatus: "PUBLISHED" },
      include: {
        model: {
          include: {
            brand: true,
          },
        },
        images: true,
      },
      take: 8,
    }),
    prisma.variant.findMany({
      where: { isPopular: true, publicationStatus: "PUBLISHED" },
      include: {
        model: {
          include: {
            brand: true,
          },
        },
        images: true,
      },
      take: 10,
    }),
    prisma.variant.findMany({
      where: {
        publicationStatus: "PUBLISHED",
        OR: [{ isRecentlyAdded: true }, { badge: "New" }],
      },
      include: {
        model: {
          include: {
            brand: true,
          },
        },
        images: true,
      },
      take: 8,
    }),
    prisma.brand.findMany({
      include: {
        _count: {
          select: {
            models: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.historicalEvent.findMany({
      orderBy: {
        year: "asc",
      },
      take: 9,
    }),
  ]);

  const mapVehicle = (v: any) => ({
    id: v.id,
    brand: v.model.brand.name,
    model: v.model.name,
    variantName: v.name,
    bodyType: v.bodyType,
    fuelType: v.fuelType,
    priceMinLakh: v.priceMinLakh,
    priceMaxLakh: v.priceMaxLakh,
    badge: v.badge,
    engine: v.engine,
    transmission: v.transmission,
    seating: v.seating,
    mileageKmpl: v.mileageKmpl,
    powerHp: v.powerHp,
    torqueNm: v.torqueNm,
    colors: v.colors ? JSON.parse(v.colors) : [],
    images: v.images || [],
  });

  const featured = featuredVariants.map(mapVehicle);
  const popular = popularVariants.map(mapVehicle);
  const recentlyAdded = recentVariants.map(mapVehicle);

  const brandItems = rawBrands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoInitial: b.logoInitial,
    color: b.color,
    country: b.country,
    modelCount: b._count.models || 1,
  }));

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BECH DO (بیچ دو) — Pakistan Automotive Marketplace & Intelligence",
    url: "https://rasta-auto.pk",
    description:
      "Pakistan's definitive automotive marketplace and intelligence platform. Track ex-factory prices, specifications, compare cars, and explore historical automotive data across 40 brands.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://rasta-auto.pk/cars?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* 1. EDITORIAL COVER HERO & SEARCH */}
      <EditorialHero
        totalVehicles={totalVehicles}
        totalBrands={totalBrands}
      />

      {/* 2. THE SPOTLIGHT (Asymmetrical magazine lead story + Carousel) */}
      {featured.length > 0 && <EditorialFeatured vehicles={featured} />}

      {/* 2.5 EDITORIAL SHOWCASE & SPOTLIGHT FEED (Interactive Feature 13 / Phase 10) */}
      <EditorialShowcaseFeed
        featuredVehicles={featured}
        popularVehicles={popular}
        recentlyAddedVehicles={recentlyAdded}
      />

      {/* 3. MANUFACTURER DIRECTORY (Typographic Index) */}
      <EditorialBrandDirectory brands={brandItems} />

      {/* 4. POPULAR IN PAKISTAN (Horizontal vehicle gallery) */}
      {popular.length > 0 && (
        <EditorialGarage
          title="Popular in Pakistan"
          subtitle="HIGHEST MARKET VOLUME"
          vehicles={popular}
          viewAllHref="/cars?popular=true"
          viewAllText="ALL POPULAR MODELS"
        />
      )}

      {/* 5. COMPARE CARS (Visual comparison editorial box) */}
      <CompareCta />

      {/* 6. RECENTLY ADDED & NEW CKD/CBU RELEASES */}
      {recentlyAdded.length > 0 && (
        <EditorialGarage
          title="Recently Added & New Models"
          subtitle="LATEST CKD / CBU RELEASES"
          vehicles={recentlyAdded}
          viewAllHref="/cars?recentlyAdded=true"
          viewAllText="ALL NEW RELEASES"
          brandColor="#C9A227"
        />
      )}

      {/* 7. 8-DECADE AUTOMOTIVE HISTORY TIMELINE */}
      {historicalEvents.length > 0 && (
        <EditorialArchiveTimeline events={historicalEvents} />
      )}
    </div>
  );
}
