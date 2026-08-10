import React, { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditorialCompareView } from "@/components/compare/EditorialCompareView";

interface Props {
  searchParams: Promise<{
    ids?: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare Cars in Pakistan Side by Side | RASTA",
  description:
    "Compare ex-factory prices, horsepower, torque, ground clearance, fuel economy, and factory equipment across up to 4 Pakistani vehicles simultaneously.",
};

export default async function ComparePage({ searchParams }: Props) {
  const { ids } = await searchParams;
  const idsArray = ids
    ? ids
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

  const [selectedVariants, allVariants] = await Promise.all([
    idsArray.length > 0
      ? prisma.variant.findMany({
          where: {
            id: { in: idsArray },
          },
          include: {
            model: {
              include: { brand: true },
            },
            specification: true,
            pakAvailability: true,
            images: {
              orderBy: { sortOrder: "asc" },
            },
            features: {
              include: { feature: true },
            },
          },
        })
      : Promise.resolve([]),
    prisma.variant.findMany({
      select: {
        id: true,
        name: true,
        priceMinLakh: true,
        priceMaxLakh: true,
        bodyType: true,
        model: {
          select: {
            name: true,
            brand: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    }),
  ]);

  // Maintain requested order of ids in array
  const orderedSelected = idsArray
    .map((id) => selectedVariants.find((v) => v.id === id))
    .filter(Boolean);

  const initialVehicles = orderedSelected.map((v: any) => ({
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
    fuelTankL: v.fuelTankL,
    bootSpaceL: v.bootSpaceL,
    groundClearanceMm: v.groundClearanceMm,
    airbags: v.airbags,
    specification: v.specification,
    pakAvailability: v.pakAvailability,
    images: v.images,
    features: v.features.map((f: any) => f.feature.name),
  }));

  const allCatalogVehicles = allVariants.map((v) => ({
    id: v.id,
    brand: v.model.brand.name,
    model: v.model.name,
    variantName: v.name,
    bodyType: v.bodyType || "Sedan",
    priceMinLakh: v.priceMinLakh || 0,
    priceMaxLakh: v.priceMaxLakh || 0,
  }));

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-[#9A9994]">
          Loading comparison matrix...
        </div>
      }
    >
      <EditorialCompareView
        initialVehicles={initialVehicles}
        allCatalogVehicles={allCatalogVehicles}
      />
    </Suspense>
  );
}
