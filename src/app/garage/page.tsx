import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditorialGarageView } from "@/components/garage/EditorialGarageView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Saved Garage & Shortlist | RASTA Automotive Intelligence",
  description:
    "Review your shortlisted vehicles, inspect side-by-side ex-factory price ladders, and export technical specifications across Pakistan's reconciled automotive catalog.",
};

export default async function GaragePage() {
  const rawVariants = await prisma.variant.findMany({
    where: {
      publicationStatus: "PUBLISHED",
      OR: [{ isPopular: true }, { isFeatured: true }],
    },
    include: {
      model: {
        include: { brand: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
    take: 8,
  });

  const serverVehicles = rawVariants.map((v) => ({
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
  }));

  return <EditorialGarageView serverVehicles={serverVehicles} />;
}
