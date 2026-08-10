import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { CarsDiscovery } from "@/components/cars/cars-discovery";

export const dynamic = "force-dynamic";

export default async function CarsPage() {
  const [variants, brands] = await Promise.all([
    prisma.variant.findMany({
      include: {
        model: {
          include: {
            brand: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: {
        id: "asc",
      },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const vehicles = variants.map((v) => ({
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
    images: v.images,
    isFeatured: v.isFeatured,
    isPopular: v.isPopular,
    isRecentlyAdded: v.isRecentlyAdded,
  }));

  const brandNames = brands.map((b) => b.name);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-[#9A9994]">
          Loading vehicle catalog...
        </div>
      }
    >
      <CarsDiscovery initialVehicles={vehicles} allBrands={brandNames} />
    </Suspense>
  );
}
